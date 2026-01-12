const express = require('express');
const router = express.Router();
const examenController = require('../controllers/examenController');
const { authMiddleware, verificadoMiddleware } = require('../middlewares/auth');
const { examenLimiter } = require('../middlewares/rateLimit');
const { respuestaExamenValidation } = require('../middlewares/validation');

// Todas las rutas requieren autenticación y email verificado
router.use(authMiddleware);
router.use(verificadoMiddleware);

// Obtener estado del examen (intentos, si puede hacer, etc.)
router.get('/estado', examenController.obtenerEstado);

// Iniciar nuevo examen
router.post('/iniciar', examenLimiter, examenController.iniciarExamen);

// Obtener examen en curso con preguntas
router.get('/:id', examenController.obtenerExamen);

// Guardar respuesta individual
router.patch('/:id/respuesta', respuestaExamenValidation, examenController.guardarRespuesta);

// Finalizar examen
router.post('/:id/finalizar', examenController.finalizarExamen);

// Obtener resultado de examen finalizado
router.get('/:id/resultado', examenController.obtenerResultado);

module.exports = router;
