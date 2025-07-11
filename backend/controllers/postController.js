const Post = require('../models/Post'); // Importa o modelo Post

// @desc    Criar novo post
// @route   POST /api/posts
// @access  Private (Admin)
exports.createPost = async (req, res) => {
    try {
        // Anexamos o ID do usuário (autor) que vem do middleware 'protect'
        req.body.author = req.user.id;
        // Definimos o status inicial como rascunho, ou como enviado no body
        req.body.status = req.body.status || 'draft';

        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        console.error(error);
        // Mongoose Validation Error (erros de validação do esquema)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages });
        }
        res.status(500).json({ success: false, message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Obter todos os posts (apenas publicados para público, todos para admin)
// @route   GET /api/posts
// @access  Public (para posts publicados) / Private (para todos os posts se for admin)
exports.getPosts = async (req, res) => {
    try {
        let query;

        // Base da query: apenas posts publicados para usuários não logados
        // Ou todos os posts se for um admin logado
        if (req.user && req.user.role === 'admin') {
            query = Post.find(); // Admin vê tudo
        } else {
            query = Post.find({ status: 'published' }); // Público vê só publicados
        }

        // Popula o campo 'author' com o username (para mostrar quem escreveu)
        query = query.populate({
            path: 'author',
            select: 'username' // Seleciona apenas o campo username do autor
        });

        const posts = await query.exec();
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Obter um único post por slug
// @route   GET /api/posts/:slug
// @access  Public (se publicado) / Private (se for rascunho e for o autor/admin)
exports.getPost = async (req, res) => {
    try {
        console.log('GET POSTS: req.user:', req.user);
        console.log('GET POSTS: req.user role:', req.user ? req.user.role : 'N/A');
        const post = await Post.findOne({ slug: req.params.slug }).populate({
            path: 'author',
            select: 'username'
        });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post não encontrado' });
        }

        // Regra de acesso:
        // - Se o post está publicado, qualquer um pode ver.
        // - Se o post é um rascunho (draft):
        //   - Só pode ser visto pelo próprio autor logado ou por um admin logado.
        if (post.status === 'draft') {
            if (!req.user || (req.user.id.toString() !== post.author._id.toString() && req.user.role !== 'admin')) {
                return res.status(401).json({ success: false, message: 'Não autorizado a ver este rascunho' });
            }
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Atualizar post
// @route   PUT /api/posts/:slug
// @access  Private (Autor ou Admin)
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findOne({ slug: req.params.slug });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post não encontrado' });
        }

        // Garante que apenas o autor ou um admin possa atualizar
        if (post.author._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Não autorizado a atualizar este post' });
        }

        // Atualiza a data de modificação
        req.body.updatedAt = Date.now();

        post = await Post.findOneAndUpdate({ slug: req.params.slug }, req.body, {
            new: true, // Retorna o documento modificado
            runValidators: true // Roda as validações do esquema ao atualizar
        });

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages });
        }
        res.status(500).json({ success: false, message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Deletar post
// @route   DELETE /api/posts/:slug
// @access  Private (Autor ou Admin)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });

        if (!post) {
            // Se não encontrou o post, retorna 200 OK de qualquer forma
            // para não dar dicas a invasores sobre quais posts existem ou não.
            return res.status(200).json({ success: true, message: 'Post já deletado ou não encontrado.' });
        }

        // Garante que apenas o autor ou um admin possa deletar
        if (post.author._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Não autorizado a deletar este post' });
        }

        await post.deleteOne(); 
        res.status(200).json({ success: true, message: 'Post deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro no servidor: ' + error.message });
    }
};