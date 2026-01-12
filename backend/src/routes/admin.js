const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminMiddleware } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimit');
const { loginValidation } = require('../middlewares/validation');

// Login de admin (público)
router.post('/login', authLimiter, loginValidation, adminController.login);

// Todas las demás rutas requieren autenticación de admin
router.use(adminMiddleware);

// Estadísticas
router.get('/estadisticas', adminController.obtenerEstadisticas);

// Usuarios
router.get('/usuarios', adminController.listarUsuarios);
router.get('/usuarios/exportar', adminController.exportarUsuarios);

// Módulos (CRUD)
router.get('/modulos', adminController.listarModulos);
router.post('/modulos', adminController.crearModulo);
router.put('/modulos/:id', adminController.actualizarModulo);
router.delete('/modulos/:id', adminController.eliminarModulo);

// Preguntas (CRUD)
router.get('/preguntas', adminController.listarPreguntas);
router.post('/preguntas', adminController.crearPregunta);
router.put('/preguntas/:id', adminController.actualizarPregunta);
router.delete('/preguntas/:id', adminController.eliminarPregunta);

// Certificados
router.get('/certificados', adminController.listarCertificados);

module.exports = router;
