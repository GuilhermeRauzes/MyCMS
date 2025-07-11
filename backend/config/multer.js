const multer = require('multer');
const path = require('path');

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Pasta onde os arquivos serão salvos
    },
    filename: function (req, file, cb) {
        // Define o nome do arquivo: ex: nome-original-timestamp.extensao
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true); // Aceita o arquivo
    } else {
        cb(new Error('Tipo de arquivo não suportado, apenas JPG, PNG ou GIF!'), false); // Rejeita o arquivo
    }
};

// Configuração do Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limite de 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;