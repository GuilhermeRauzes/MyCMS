require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');

// Rotas
const authRoutes = require('./routes/authRoutes'); // Importa as rotas de autenticação
const postRoutes = require('./routes/postRoutes'); // Importa as rotas de posts

// Função para conectar ao MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Chame a função de conexão antes de iniciar o servidor
connectDB();

const upload = require('./config/multer');  //Importa as configs do Multer
// Middleware para parsear JSON no corpo das requisições
app.use(express.json());
// CORS para todas as origens
app.use(cors());
// Serve a pasta 'uploads' estaticamente para que as imagens sejam acessíveis via URL
app.use('/uploads', express.static('uploads'));

// Rota de upload de imagem (pode ser protegida posteriormente)
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
    }
    // Retorna o caminho completo da imagem (acessível via /uploads/nome-do-arquivo)
    res.status(200).json({
        success: true,
        message: 'Upload realizado com sucesso!',
        filePath: `/uploads/${req.file.filename}`
    });
});



// Rotas da API (sempre fica com prefixo de /api/alguma coisa)
app.use('/api/auth', authRoutes); // Usa as rotas de autenticação
app.use('/api/posts', postRoutes); // Usa as rotas de posts

// Rota de teste simples 
//app.get('/', (req, res) => {
//    res.send('API do CMS está funcionando!');
//});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});