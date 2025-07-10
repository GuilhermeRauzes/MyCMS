require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

// Importa as rotas de autenticação (NOVA LINHA)
const authRoutes = require('./routes/authRoutes');

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

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rotas da API (NOVA SEÇÃO)
app.use('/api/auth', authRoutes); // Usa as rotas de autenticação

// Rota de teste simples (OPCIONALMENTE REMOVER OU COMENTAR)
app.get('/', (req, res) => {
    res.send('API do CMS está funcionando!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});