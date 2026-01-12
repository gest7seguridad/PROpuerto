const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Genera un token de acceso JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} - Token JWT
 */
function generarAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Genera un refresh token JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} - Refresh token JWT
 */
function generarRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

/**
 * Verifica un token de acceso
 * @param {string} token - Token a verificar
 * @returns {Object|null} - Payload decodificado o null si es inválido
 */
function verificarAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Verifica un refresh token
 * @param {string} token - Token a verificar
 * @returns {Object|null} - Payload decodificado o null si es inválido
 */
function verificarRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Genera token para verificación de email
 * @param {string} userId - ID del usuario
 * @returns {string} - Token de verificación
 */
function generarTokenVerificacion(userId) {
  return jwt.sign({ userId, type: 'email_verification' }, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Genera token para recuperación de contraseña
 * @param {string} userId - ID del usuario
 * @returns {string} - Token de recuperación
 */
function generarTokenRecuperacion(userId) {
  return jwt.sign({ userId, type: 'password_reset' }, JWT_SECRET, { expiresIn: '1h' });
}

/**
 * Calcula la fecha de expiración del refresh token
 * @returns {Date}
 */
function calcularExpiracionRefresh() {
  const duracion = JWT_REFRESH_EXPIRES_IN;
  const valor = parseInt(duracion);
  const unidad = duracion.replace(/\d/g, '');

  const ahora = new Date();

  switch (unidad) {
    case 'd':
      ahora.setDate(ahora.getDate() + valor);
      break;
    case 'h':
      ahora.setHours(ahora.getHours() + valor);
      break;
    case 'm':
      ahora.setMinutes(ahora.getMinutes() + valor);
      break;
    default:
      ahora.setDate(ahora.getDate() + 7); // 7 días por defecto
  }

  return ahora;
}

module.exports = {
  generarAccessToken,
  generarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken,
  generarTokenVerificacion,
  generarTokenRecuperacion,
  calcularExpiracionRefresh
};
