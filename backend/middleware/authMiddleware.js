const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Proteger rotas - verifica se o usuário está autenticado
const protect = async (req, res, next) => {
    let token;

    // 1. Checa se o token está no header da requisição (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Pega o token após "Bearer "
    }

    // 2. Verifica se o token existe
    if (!token) {
        return res.status(401).json({ success: false, message: 'Não autorizado, token não encontrado' });
    }

    try {
        // 3. Verifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token usando sua chave secreta

        // 4. Encontra o usuário pelo ID do token e anexa à requisição
        // O .select('-password') garante que a senha hasheada não venha junto
        req.user = await User.findById(decoded.id).select('-password');

        // Se não encontrar o usuário (token inválido ou usuário deletado)
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Não autorizado, usuário não encontrado' });
        }

        next(); // Chama a próxima função middleware/rota
    } catch (error) {
        console.error(error);
        // Se o token for inválido (expirado, modificado)
        res.status(401).json({ success: false, message: 'Não autorizado, token inválido ou expirado' });
    }
};

// @desc    Middleware de autorização - verifica se o usuário tem o papel necessário
const authorize = (...roles) => { // Aceita múltiplos papéis (ex: 'admin', 'editor')
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `O usuário com o papel ${req.user ? req.user.role : 'desconhecido'} não está autorizado a acessar esta rota.` });
        }
        next();
    };
};


module.exports = { protect, authorize };