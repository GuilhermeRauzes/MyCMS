const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para hashear senhas

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Por favor, adicione um nome de usuário'],
        unique: true,
        trim: true, // Remove espaços em branco do início e fim
        minlength: [3, 'O nome de usuário deve ter pelo menos 3 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Por favor, adicione um email'],
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, adicione um email válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'Por favor, adicione uma senha'],
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
        select: false // Não retorna a senha automaticamente em consultas
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define que o papel só pode ser 'user' ou 'admin'
        default: 'user' // Valor padrão se não for especificado
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// === Middlewares do Mongoose (antes de salvar) ===
// Hash da senha antes de salvar o usuário
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // Só hasheia se a senha foi modificada (ou é nova)
        next();
    }
    const salt = await bcrypt.genSalt(10); // Gera um "sal"
    this.password = await bcrypt.hash(this.password, salt); // Hasheia a senha
});

// === Métodos do Modelo (para comparação de senhas) ===
// Método para comparar a senha informada com a senha hasheada no DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);