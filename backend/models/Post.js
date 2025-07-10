const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Por favor, adicione um título para o post'],
        unique: true, // Títulos de posts devem ser únicos para evitar duplicidade
        trim: true,
        minlength: [5, 'O título deve ter pelo menos 5 caracteres']
    },
    slug: { // Uma versão amigável para URL (ex: "meu-primeiro-post")
        type: String,
        unique: true,
        lowercase: true, // Garante que o slug seja sempre em minúsculas
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Por favor, adicione o conteúdo do post']
    },
    thumbnail: { // URL da imagem principal do post (do Cloudinary)
        type: String,
        default: 'no-photo.jpg' // Um placeholder ou imagem padrão
    },
    category: { // Para organizar posts por categoria
        type: String,
        default: 'Uncategorized',
        trim: true
    },
    tags: [String], // Array de strings para tags (palavras-chave)
    author: {
        type: mongoose.Schema.ObjectId, // Referência ao ID de um usuário
        ref: 'User', // O modelo que ele referencia
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'], // Rascunho ou Publicado
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adiciona automaticamente createdAt e updatedAt
});

// Middleware do Mongoose: Pré-salvar para gerar o slug
PostSchema.pre('save', function (next) {
    if (this.isModified('title') || this.isNew) { // Gerar slug se o título mudou ou é um novo post
        this.slug = this.title
            .toLowerCase() // Converte para minúsculas
            .replace(/[^a-z0-9 ]/g, '') // Remove caracteres não alfanuméricos (exceto espaços)
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .trim(); // Remove espaços em branco extras

        // Adiciona um timestamp ou um hash para garantir a unicidade se o título for o mesmo
        // Isso é um fallback caso dois posts tenham o MESMO título e gerem o mesmo slug
        // Para simplicidade inicial, não vamos adicionar timestamp, mas é uma boa prática
        // if (this.isNew || this.isModified('title')) {
        //     this.slug = `${this.slug}-${Date.now()}`;
        // }
    }
    this.updatedAt = Date.now(); // Atualiza a data de modificação
    next();
});

module.exports = mongoose.model('Post', PostSchema);