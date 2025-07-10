const User = require('../models/User'); // Importa o modelo User
const bcrypt = require('bcryptjs');     // Já usado para hashear
const jwt = require('jsonwebtoken');    // Para gerar JWTs

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // 1. Verificar se o usuário já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Usuário com este email já existe.' });
        }

        // 2. Criar novo usuário (o middleware 'pre-save' no modelo User vai hashear a senha)
        user = await User.create({
            username,
            email,
            password, // A senha será hasheada pelo middleware do Mongoose
            role: role || 'user' // Define 'user' como padrão se não especificado
        });

        // 3. Gerar token JWT e enviá-lo
        const token = user.getSignedJwtToken(); // Chamada para um método que criaremos no modelo User
        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error(error); // Para depuração no console do servidor
        res.status(500).json({ success: false, message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Logar usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // 1. Validação básica de campos
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Por favor, forneça email e senha' });
    }

    try {
        // 2. Checar se o usuário existe (e selecionar a senha explicitamente)
        const user = await User.findOne({ email }).select('+password'); // Precisamos da senha para comparar

        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }

        // 3. Comparar senha informada com a senha hasheada
        const isMatch = await user.matchPassword(password); // Chamada para o método no modelo User

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }

        // 4. Gerar token JWT e enviá-lo
        const token = user.getSignedJwtToken();
        res.status(200).json({ success: true, token });

    } catch (error) {
        console.error(error); // Para depuração
        res.status(500).json({ success: false, message: 'Erro no servidor: ' + error.message });
    }
};