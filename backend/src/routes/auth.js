const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');
const { authLimiter, registroLimiter } = require('../middlewares/rateLimit');
const {
  registroValidation,
  loginValidation,
  recuperarPasswordValidation,
  resetPasswordValidation
} = require('../middlewares/validation');

// Registro
router.post('/registro', registroLimiter, registroValidation, authController.registro);

// Login
router.post('/login', authLimiter, loginValidation, authController.login);

// Verificar email
router.get('/verificar-email/:token', authController.verificarEmail);

// Recuperar contraseña
router.post('/recuperar-password', authLimiter, recuperarPasswordValidation, authController.recuperarPassword);

// Reset de contraseña
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, authController.resetPassword);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Obtener datos del usuario actual (autenticado)
router.get('/me', authMiddleware, authController.me);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
