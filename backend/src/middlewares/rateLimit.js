const rateLimit = require('express-rate-limit');

/**
 * Rate limiter general para API
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por ventana
  message: {
    error: 'Demasiadas peticiones',
    message: 'Has excedido el límite de peticiones. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter estricto para autenticación
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos por ventana
  message: {
    error: 'Demasiados intentos',
    message: 'Has excedido el límite de intentos de autenticación. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // No contar peticiones exitosas
});

/**
 * Rate limiter para registro
 */
const registroLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 registros por hora por IP
  message: {
    error: 'Demasiados registros',
    message: 'Has excedido el límite de registros. Intenta de nuevo en 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter para examen
 */
const examenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 intentos por hora
  message: {
    error: 'Demasiados intentos de examen',
    message: 'Has excedido el límite de intentos de examen. Intenta de nuevo en 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  authLimiter,
  registroLimiter,
  examenLimiter
};
