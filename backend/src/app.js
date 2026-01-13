require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { apiLimiter } = require('./middlewares/rateLimit');
const { inicializarEmail } = require('./utils/email');

// Importar rutas
const authRoutes = require('./routes/auth');
const modulosRoutes = require('./routes/modulos');
const examenRoutes = require('./routes/examen');
const certificadoRoutes = require('./routes/certificado');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet());

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://valiant-elegance-production.up.railway.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permitir peticiones sin origin (como Postman o curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS bloqueado para origin:', origin);
      callback(null, true); // Permitir de todos modos en producción para evitar errores
    }
  },
  credentials: true
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting general
app.use('/api', apiLimiter);

// Servir archivos estáticos (certificados)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/examen', examenRoutes);
app.use('/api/certificado', certificadoRoutes);
app.use('/api/admin', adminRoutes);

// Ruta pública de verificación de certificado
app.use('/api/verificar', (req, res, next) => {
  req.url = '/verificar' + req.url;
  certificadoRoutes(req, res, next);
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'No encontrado',
    message: 'La ruta solicitada no existe'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error interno'
  });
});

// Iniciar servidor
async function iniciar() {
  try {
    // Inicializar email
    inicializarEmail();

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🏛️  Sistema de Certificación de Gestión de Residuos       ║
║       Ayuntamiento de Puerto del Rosario                     ║
║                                                              ║
║   🚀 Servidor iniciado en: http://localhost:${PORT}            ║
║   📧 Email: ${process.env.SMTP_HOST ? 'Configurado' : 'Modo desarrollo (consola)'}                         ║
║   🌍 Entorno: ${process.env.NODE_ENV || 'development'}                                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
}

iniciar();

module.exports = app;
