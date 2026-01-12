const express = require('express');
const router = express.Router();
const modulosController = require('../controllers/modulosController');
const { authMiddleware, verificadoMiddleware } = require('../middlewares/auth');
const { progresoValidation } = require('../middlewares/validation');

// Todas las rutas requieren autenticación y email verificado
router.use(authMiddleware);
router.use(verificadoMiddleware);

// Obtener listado de módulos con progreso
router.get('/', modulosController.obtenerModulos);

// Obtener detalle de un módulo
router.get('/:id', modulosController.obtenerModulo);

// Actualizar progreso de un módulo
router.post('/:id/progreso', progresoValidation, modulosController.actualizarProgreso);

// Marcar módulo como completado
router.post('/:id/completar', modulosController.completarModulo);

module.exports = router;
