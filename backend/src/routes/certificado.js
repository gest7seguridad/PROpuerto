const express = require('express');
const router = express.Router();
const certificadoController = require('../controllers/certificadoController');
const { authMiddleware, verificadoMiddleware } = require('../middlewares/auth');

// Rutas públicas
// Verificar certificado (pública)
router.get('/verificar/:codigo', certificadoController.verificarCertificado);

// Webhook de firma (público pero con verificación interna)
router.post('/webhook-firma', certificadoController.webhookFirma);

// Rutas autenticadas
router.use(authMiddleware);
router.use(verificadoMiddleware);

// Obtener estado del certificado
router.get('/estado', certificadoController.obtenerEstado);

// Solicitar firma
router.post('/solicitar-firma', certificadoController.solicitarFirma);

// Simular firma (para desarrollo)
router.post('/simular-firma', certificadoController.simularFirma);

// Descargar certificado PDF
router.get('/descargar', certificadoController.descargarCertificado);

module.exports = router;
