require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000; // Define a porta, pegando do .env ou usando 5000 como padrão
const mongoose = require('mongoose'); // Já importamos o mongoose no topo, então não precisa de outro 'require'

// Função para conectar ao MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
        process.exit(1); // Sai do processo com falha
    }
};

// Chame a função de conexão antes de iniciar o servidor
connectDB();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rota de teste simples
app.get('/', (req, res) => {
    res.send('API do CMS está funcionando!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});