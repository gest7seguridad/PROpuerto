const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {
  generarAccessToken,
  generarRefreshToken,
  verificarRefreshToken,
  generarTokenVerificacion,
  generarTokenRecuperacion,
  calcularExpiracionRefresh,
  verificarAccessToken
} = require('../utils/jwt');
const { generarHashDireccion } = require('../utils/validators');
const { enviarEmailVerificacion, enviarEmailRecuperacion } = require('../utils/email');

const prisma = new PrismaClient();

/**
 * Registro de nuevo usuario
 */
async function registro(req, res) {
  try {
    const {
      dni,
      nombre,
      apellidos,
      email,
      telefono,
      password,
      direccion,
      numero,
      piso,
      puerta,
      codigoPostal,
      localidad = 'Puerto del Rosario'
    } = req.body;

    // Normalizar DNI
    const dniNormalizado = dni.toUpperCase().trim();

    // Verificar si ya existe usuario con ese DNI
    const existeDNI = await prisma.usuario.findUnique({
      where: { dni: dniNormalizado }
    });

    if (existeDNI) {
      return res.status(400).json({
        error: 'DNI ya registrado',
        message: 'Ya existe un usuario registrado con este DNI/NIE'
      });
    }

    // Verificar si ya existe usuario con ese email
    const existeEmail = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existeEmail) {
      return res.status(400).json({
        error: 'Email ya registrado',
        message: 'Ya existe un usuario registrado con este email'
      });
    }

    // Generar hash de dirección
    const direccionHash = generarHashDireccion(direccion, numero, codigoPostal, piso, puerta);

    // Verificar si ya existe usuario con esa dirección
    const existeDireccion = await prisma.usuario.findUnique({
      where: { direccionHash }
    });

    if (existeDireccion) {
      return res.status(400).json({
        error: 'Dirección ya registrada',
        message: 'Ya existe un usuario registrado en esta dirección. Solo se permite un registro por vivienda.'
      });
    }

    // Hash de contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear dirección completa para mostrar
    let direccionCompleta = direccion;
    if (numero) direccionCompleta += `, ${numero}`;
    if (piso) direccionCompleta += `, ${piso}`;
    if (puerta) direccionCompleta += ` ${puerta}`;
    direccionCompleta += `, ${codigoPostal} ${localidad}`;

    // Generar token de verificación
    const tokenVerificacion = generarTokenVerificacion(uuidv4());

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        dni: dniNormalizado,
        nombre,
        apellidos,
        email: email.toLowerCase(),
        telefono,
        password: passwordHash,
        direccionHash,
        direccionCompleta,
        numero,
        piso,
        puerta,
        codigoPostal,
        localidad,
        tokenVerificacion
      },
      select: {
        id: true,
        dni: true,
        nombre: true,
        apellidos: true,
        email: true,
        verificado: true,
        createdAt: true
      }
    });

    // Enviar email de verificación
    try {
      await enviarEmailVerificacion(usuario.email, usuario.nombre, tokenVerificacion);
    } catch (emailError) {
      console.error('Error enviando email de verificación:', emailError);
      // No fallar el registro si el email falla
    }

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario,
      verificacionPendiente: true
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al registrar usuario'
    });
  }
}

/**
 * Login de usuario
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar tokens
    const accessToken = generarAccessToken({ userId: usuario.id });
    const refreshToken = generarRefreshToken({ userId: usuario.id });

    // Guardar refresh token en BD
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        usuarioId: usuario.id,
        expiresAt: calcularExpiracionRefresh()
      }
    });

    res.json({
      mensaje: 'Login exitoso',
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        dni: usuario.dni,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        verificado: usuario.verificado
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al iniciar sesión'
    });
  }
}

/**
 * Verificar email
 */
async function verificarEmail(req, res) {
  try {
    const { token } = req.params;

    // Verificar token
    const decoded = verificarAccessToken(token);

    if (!decoded || decoded.type !== 'email_verification') {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'El enlace de verificación es inválido o ha expirado'
      });
    }

    // Buscar usuario con este token
    const usuario = await prisma.usuario.findFirst({
      where: { tokenVerificacion: token }
    });

    if (!usuario) {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'El enlace de verificación es inválido o ya fue utilizado'
      });
    }

    // Actualizar usuario
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        verificado: true,
        tokenVerificacion: null
      }
    });

    res.json({
      mensaje: 'Email verificado correctamente',
      verificado: true
    });

  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al verificar email'
    });
  }
}

/**
 * Solicitar recuperación de contraseña
 */
async function recuperarPassword(req, res) {
  try {
    const { email } = req.body;

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Siempre responder igual para evitar enumerar emails
    if (!usuario) {
      return res.json({
        mensaje: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
      });
    }

    // Generar token
    const token = generarTokenRecuperacion(usuario.id);

    // Guardar token (reutilizamos el campo tokenVerificacion)
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { tokenVerificacion: token }
    });

    // Enviar email
    try {
      await enviarEmailRecuperacion(usuario.email, usuario.nombre, token);
    } catch (emailError) {
      console.error('Error enviando email de recuperación:', emailError);
    }

    res.json({
      mensaje: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
    });

  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al procesar solicitud'
    });
  }
}

/**
 * Restablecer contraseña
 */
async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verificar token
    const decoded = verificarAccessToken(token);

    if (!decoded || decoded.type !== 'password_reset') {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'El enlace de recuperación es inválido o ha expirado'
      });
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findFirst({
      where: {
        id: decoded.userId,
        tokenVerificacion: token
      }
    });

    if (!usuario) {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'El enlace de recuperación es inválido o ya fue utilizado'
      });
    }

    // Hash nueva contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Actualizar usuario
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: passwordHash,
        tokenVerificacion: null
      }
    });

    // Invalidar todos los refresh tokens del usuario
    await prisma.refreshToken.deleteMany({
      where: { usuarioId: usuario.id }
    });

    res.json({
      mensaje: 'Contraseña restablecida correctamente'
    });

  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al restablecer contraseña'
    });
  }
}

/**
 * Refrescar token de acceso
 */
async function refreshToken(req, res) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token requerido',
        message: 'Refresh token no proporcionado'
      });
    }

    // Verificar token
    const decoded = verificarRefreshToken(token);

    if (!decoded) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Refresh token inválido o expirado'
      });
    }

    // Verificar que existe en BD
    const tokenExistente = await prisma.refreshToken.findUnique({
      where: { token }
    });

    if (!tokenExistente || tokenExistente.expiresAt < new Date()) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Refresh token inválido o expirado'
      });
    }

    // Verificar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId }
    });

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        message: 'El usuario ya no existe'
      });
    }

    // Generar nuevos tokens
    const newAccessToken = generarAccessToken({ userId: usuario.id });
    const newRefreshToken = generarRefreshToken({ userId: usuario.id });

    // Eliminar token antiguo y crear nuevo
    await prisma.refreshToken.delete({
      where: { token }
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        usuarioId: usuario.id,
        expiresAt: calcularExpiracionRefresh()
      }
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error('Error refrescando token:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al refrescar token'
    });
  }
}

/**
 * Obtener datos del usuario actual
 */
async function me(req, res) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        dni: true,
        nombre: true,
        apellidos: true,
        email: true,
        telefono: true,
        direccionCompleta: true,
        verificado: true,
        createdAt: true,
        certificado: {
          select: {
            id: true,
            firmado: true,
            fechaFirma: true,
            codigoVerificacion: true
          }
        }
      }
    });

    // Obtener progreso
    const progreso = await prisma.progresoModulo.findMany({
      where: { usuarioId: req.userId },
      include: { modulo: true }
    });

    // Obtener intentos de examen
    const examenes = await prisma.examen.findMany({
      where: { usuarioId: req.userId },
      orderBy: { fechaInicio: 'desc' }
    });

    res.json({
      usuario,
      progreso,
      examenes: examenes.map(e => ({
        id: e.id,
        intentoNum: e.intentoNum,
        fechaInicio: e.fechaInicio,
        fechaFin: e.fechaFin,
        puntuacion: e.puntuacion,
        aprobado: e.aprobado
      }))
    });

  } catch (error) {
    console.error('Error obteniendo datos del usuario:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener datos del usuario'
    });
  }
}

/**
 * Logout - invalidar refresh token
 */
async function logout(req, res) {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await prisma.refreshToken.deleteMany({
        where: { token }
      });
    }

    res.json({ mensaje: 'Sesión cerrada correctamente' });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al cerrar sesión'
    });
  }
}

module.exports = {
  registro,
  login,
  verificarEmail,
  recuperarPassword,
  resetPassword,
  refreshToken,
  me,
  logout
};
