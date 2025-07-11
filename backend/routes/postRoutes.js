const express = require('express');
const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
} = require('../controllers/postController'); // Importa os controladores de posts

const { protect, authorize } = require('../middleware/authMiddleware'); // Importa os middlewares

const router = express.Router();

// Rotas de Posts
router.get('/', protect, getPosts); // Esta rota tem que ter protect

// A rota POST para criar um post é protegida e apenas para admins.
router.post('/', protect, authorize('admin'), createPost);

// Rotas que operam em um post específico por slug
router.route('/:slug')
    .get(protect, getPost)     // GET: Qualquer um para publicados, autenticado para rascunhos (lógica no controller)
    .put(protect, updatePost)   // PUT: Apenas autor ou admin autenticado
    .delete(protect, deletePost); // DELETE: Apenas autor ou admin autenticado

module.exports = router;