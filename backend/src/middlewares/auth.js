const { verificarAccessToken } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware de autenticación para usuarios
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Token de acceso no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verificarAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Token inválido o expirado'
      });
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId }
    });

    if (!usuario) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Usuario no encontrado'
      });
    }

    // Añadir usuario al request
    req.usuario = usuario;
    req.userId = usuario.id;

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      error: 'Error interno',
      message: 'Error al verificar autenticación'
    });
  }
}

/**
 * Middleware para verificar que el email está verificado
 */
async function verificadoMiddleware(req, res, next) {
  if (!req.usuario.verificado) {
    return res.status(403).json({
      error: 'Email no verificado',
      message: 'Debes verificar tu email antes de continuar'
    });
  }
  next();
}

/**
 * Middleware de autenticación para administradores
 */
async function adminMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Token de acceso no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verificarAccessToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Token inválido o sin permisos de administrador'
      });
    }

    // Verificar que el administrador existe
    const admin = await prisma.administrador.findUnique({
      where: { id: decoded.userId }
    });

    if (!admin || !admin.activo) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Administrador no encontrado o inactivo'
      });
    }

    req.admin = admin;
    req.adminId = admin.id;

    next();
  } catch (error) {
    console.error('Error en middleware de admin:', error);
    return res.status(500).json({
      error: 'Error interno',
      message: 'Error al verificar autenticación de administrador'
    });
  }
}

module.exports = {
  authMiddleware,
  verificadoMiddleware,
  adminMiddleware
};
