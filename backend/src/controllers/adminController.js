const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generarAccessToken, generarRefreshToken, calcularExpiracionRefresh } = require('../utils/jwt');

const prisma = new PrismaClient();

/**
 * Login de administrador
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await prisma.administrador.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!admin || !admin.activo) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    const passwordValido = await bcrypt.compare(password, admin.password);

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    const accessToken = generarAccessToken({ userId: admin.id, role: 'admin' });
    const refreshToken = generarRefreshToken({ userId: admin.id, role: 'admin' });

    res.json({
      mensaje: 'Login exitoso',
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre
      }
    });

  } catch (error) {
    console.error('Error en login de admin:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al iniciar sesión'
    });
  }
}

/**
 * Obtener estadísticas generales
 */
async function obtenerEstadisticas(req, res) {
  try {
    // Estadísticas básicas usando Prisma (evitando raw queries problemáticas)
    const [
      totalUsuarios,
      usuariosVerificados,
      totalExamenes,
      examenesAprobados,
      certificadosEmitidos,
      certificadosFirmados,
      totalModulosActivos
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({ where: { verificado: true } }),
      prisma.examen.count(),
      prisma.examen.count({ where: { aprobado: true } }),
      prisma.certificado.count(),
      prisma.certificado.count({ where: { firmado: true } }),
      prisma.modulo.count({ where: { activo: true } })
    ]);

    // Usuarios con formación completa (usando Prisma en lugar de raw query)
    let usuariosConFormacionCompleta = 0;
    if (totalModulosActivos > 0) {
      const usuariosConProgreso = await prisma.usuario.findMany({
        select: {
          id: true,
          _count: {
            select: {
              progreso: {
                where: { completado: true }
              }
            }
          }
        }
      });
      usuariosConFormacionCompleta = usuariosConProgreso.filter(
        u => u._count.progreso >= totalModulosActivos
      ).length;
    }

    // Usuarios recientes
    const usuariosRecientes = await prisma.usuario.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        verificado: true,
        createdAt: true
      }
    });

    // Registros por día - simplificado
    const treintaDiasAtras = new Date();
    treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);

    const usuariosUltimos30Dias = await prisma.usuario.findMany({
      where: {
        createdAt: { gte: treintaDiasAtras }
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    // Agrupar por fecha
    const registrosPorFecha = {};
    usuariosUltimos30Dias.forEach(u => {
      const fecha = u.createdAt.toISOString().split('T')[0];
      registrosPorFecha[fecha] = (registrosPorFecha[fecha] || 0) + 1;
    });

    const registrosPorDia = Object.entries(registrosPorFecha).map(([fecha, registros]) => ({
      fecha,
      registros
    })).sort((a, b) => b.fecha.localeCompare(a.fecha));

    // Tasa de aprobación por intento
    const examenesFinalizados = await prisma.examen.findMany({
      where: { fechaFin: { not: null } },
      select: { intentoNum: true, aprobado: true }
    });

    const tasaPorIntento = {};
    examenesFinalizados.forEach(e => {
      if (!tasaPorIntento[e.intentoNum]) {
        tasaPorIntento[e.intentoNum] = { total: 0, aprobados: 0 };
      }
      tasaPorIntento[e.intentoNum].total++;
      if (e.aprobado) tasaPorIntento[e.intentoNum].aprobados++;
    });

    const tasaAprobacionPorIntento = Object.entries(tasaPorIntento).map(([intentoNum, data]) => ({
      intentoNum: parseInt(intentoNum),
      total: data.total,
      aprobados: data.aprobados
    })).sort((a, b) => a.intentoNum - b.intentoNum);

    res.json({
      usuarios: {
        total: totalUsuarios,
        verificados: usuariosVerificados,
        pendientes: totalUsuarios - usuariosVerificados,
        conFormacionCompleta: usuariosConFormacionCompleta,
        recientes: usuariosRecientes.map(u => ({
          id: u.id,
          nombre: u.nombre,
          apellidos: u.apellidos,
          email: u.email,
          emailVerificado: u.verificado,
          fechaRegistro: u.createdAt
        }))
      },
      examenes: {
        total: totalExamenes,
        aprobados: examenesAprobados,
        suspensos: totalExamenes - examenesAprobados,
        tasaAprobacion: totalExamenes > 0 ? ((examenesAprobados / totalExamenes) * 100).toFixed(1) : '0'
      },
      certificados: {
        total: certificadosEmitidos,
        emitidos: certificadosEmitidos,
        firmados: certificadosFirmados,
        pendientes: certificadosEmitidos - certificadosFirmados
      },
      registrosPorDia,
      tasaAprobacionPorIntento
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener estadísticas',
      detalle: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
}

/**
 * Listar usuarios
 */
async function listarUsuarios(req, res) {
  try {
    const { page = 1, limit = 20, search, verificado } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { apellidos: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { dni: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (verificado !== undefined) {
      where.verificado = verificado === 'true';
    }

    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          dni: true,
          nombre: true,
          apellidos: true,
          email: true,
          verificado: true,
          createdAt: true,
          _count: {
            select: {
              progreso: { where: { completado: true } },
              examenes: true
            }
          },
          certificado: {
            select: { firmado: true }
          }
        }
      }),
      prisma.usuario.count({ where })
    ]);

    res.json({
      usuarios: usuarios.map(u => ({
        ...u,
        modulosCompletados: u._count.progreso,
        intentosExamen: u._count.examenes,
        tieneCertificado: u.certificado?.firmado || false,
        _count: undefined,
        certificado: undefined
      })),
      paginacion: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPaginas: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al listar usuarios'
    });
  }
}

/**
 * CRUD de Módulos
 */
async function listarModulos(req, res) {
  try {
    const modulos = await prisma.modulo.findMany({
      orderBy: { orden: 'asc' }
    });

    res.json({ modulos });

  } catch (error) {
    console.error('Error listando módulos:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al listar módulos'
    });
  }
}

async function crearModulo(req, res) {
  try {
    const { orden, titulo, descripcion, contenido, videoUrl, duracionMin, activo = true } = req.body;

    const modulo = await prisma.modulo.create({
      data: {
        orden,
        titulo,
        descripcion,
        contenido,
        videoUrl,
        duracionMin,
        activo
      }
    });

    res.status(201).json({ mensaje: 'Módulo creado', modulo });

  } catch (error) {
    console.error('Error creando módulo:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al crear módulo'
    });
  }
}

async function actualizarModulo(req, res) {
  try {
    const { id } = req.params;
    const { orden, titulo, descripcion, contenido, videoUrl, duracionMin, activo } = req.body;

    const modulo = await prisma.modulo.update({
      where: { id: parseInt(id) },
      data: {
        orden,
        titulo,
        descripcion,
        contenido,
        videoUrl,
        duracionMin,
        activo
      }
    });

    res.json({ mensaje: 'Módulo actualizado', modulo });

  } catch (error) {
    console.error('Error actualizando módulo:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al actualizar módulo'
    });
  }
}

async function eliminarModulo(req, res) {
  try {
    const { id } = req.params;

    await prisma.modulo.delete({
      where: { id: parseInt(id) }
    });

    res.json({ mensaje: 'Módulo eliminado' });

  } catch (error) {
    console.error('Error eliminando módulo:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al eliminar módulo'
    });
  }
}

/**
 * CRUD de Preguntas
 */
async function listarPreguntas(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [preguntas, total] = await Promise.all([
      prisma.pregunta.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { id: 'asc' }
      }),
      prisma.pregunta.count()
    ]);

    res.json({
      preguntas,
      paginacion: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPaginas: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error listando preguntas:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al listar preguntas'
    });
  }
}

async function crearPregunta(req, res) {
  try {
    const { enunciado, opciones, respuestaCorrecta, explicacion, activa = true } = req.body;

    if (!Array.isArray(opciones) || opciones.length !== 4) {
      return res.status(400).json({
        error: 'Validación',
        message: 'Debe proporcionar exactamente 4 opciones'
      });
    }

    if (respuestaCorrecta < 0 || respuestaCorrecta > 3) {
      return res.status(400).json({
        error: 'Validación',
        message: 'La respuesta correcta debe ser un índice entre 0 y 3'
      });
    }

    const pregunta = await prisma.pregunta.create({
      data: {
        enunciado,
        opciones,
        respuestaCorrecta,
        explicacion,
        activa
      }
    });

    res.status(201).json({ mensaje: 'Pregunta creada', pregunta });

  } catch (error) {
    console.error('Error creando pregunta:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al crear pregunta'
    });
  }
}

async function actualizarPregunta(req, res) {
  try {
    const { id } = req.params;
    const { enunciado, opciones, respuestaCorrecta, explicacion, activa } = req.body;

    const pregunta = await prisma.pregunta.update({
      where: { id: parseInt(id) },
      data: {
        enunciado,
        opciones,
        respuestaCorrecta,
        explicacion,
        activa
      }
    });

    res.json({ mensaje: 'Pregunta actualizada', pregunta });

  } catch (error) {
    console.error('Error actualizando pregunta:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al actualizar pregunta'
    });
  }
}

async function eliminarPregunta(req, res) {
  try {
    const { id } = req.params;

    await prisma.pregunta.delete({
      where: { id: parseInt(id) }
    });

    res.json({ mensaje: 'Pregunta eliminada' });

  } catch (error) {
    console.error('Error eliminando pregunta:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al eliminar pregunta'
    });
  }
}

/**
 * Listar certificados
 */
async function listarCertificados(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [certificados, total] = await Promise.all([
      prisma.certificado.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { fechaEmision: 'desc' },
        include: {
          usuario: {
            select: {
              nombre: true,
              apellidos: true,
              dni: true,
              email: true
            }
          }
        }
      }),
      prisma.certificado.count()
    ]);

    res.json({
      certificados,
      paginacion: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPaginas: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error listando certificados:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al listar certificados'
    });
  }
}

/**
 * Exportar datos a CSV
 */
async function exportarUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        certificado: { select: { firmado: true, fechaFirma: true } },
        examenes: {
          where: { aprobado: true },
          select: { puntuacion: true, fechaFin: true },
          take: 1,
          orderBy: { fechaFin: 'desc' }
        }
      }
    });

    const csv = [
      'DNI,Nombre,Apellidos,Email,Teléfono,Dirección,Verificado,Certificado,Nota Examen,Fecha Certificado',
      ...usuarios.map(u => [
        u.dni,
        u.nombre,
        u.apellidos,
        u.email,
        u.telefono || '',
        `"${u.direccionCompleta}"`,
        u.verificado ? 'Sí' : 'No',
        u.certificado?.firmado ? 'Sí' : 'No',
        u.examenes[0]?.puntuacion?.toFixed(1) || '',
        u.certificado?.fechaFirma ? new Date(u.certificado.fechaFirma).toLocaleDateString('es-ES') : ''
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios-residuos.csv');
    res.send('\uFEFF' + csv); // BOM para Excel

  } catch (error) {
    console.error('Error exportando usuarios:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al exportar usuarios'
    });
  }
}

module.exports = {
  login,
  obtenerEstadisticas,
  listarUsuarios,
  listarModulos,
  crearModulo,
  actualizarModulo,
  eliminarModulo,
  listarPreguntas,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
  listarCertificados,
  exportarUsuarios
};
