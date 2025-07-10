const express = require('express');
const { register, login } = require('../controllers/authController'); // Importa os controladores

const router = express.Router(); // Cria uma instância de Router do Express

router.post('/register', register); // Rota para registrar novo usuário
router.post('/login', login);       // Rota para logar usuário

module.exports = router;