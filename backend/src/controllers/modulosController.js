const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Obtener todos los módulos con progreso del usuario
 */
async function obtenerModulos(req, res) {
  try {
    const modulos = await prisma.modulo.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        orden: true,
        titulo: true,
        descripcion: true,
        duracionMin: true,
        videoUrl: true
      }
    });

    // Obtener progreso del usuario
    const progreso = await prisma.progresoModulo.findMany({
      where: { usuarioId: req.userId }
    });

    // Mapear progreso a módulos
    const progresoMap = new Map(progreso.map(p => [p.moduloId, p]));

    const modulosConProgreso = modulos.map(modulo => {
      const progresoModulo = progresoMap.get(modulo.id);
      return {
        ...modulo,
        progreso: progresoModulo ? {
          tiempoAcumulado: progresoModulo.tiempoAcumulado,
          completado: progresoModulo.completado,
          fechaCompletado: progresoModulo.fechaCompletado,
          porcentaje: Math.min(100, Math.round((progresoModulo.tiempoAcumulado / 60) / modulo.duracionMin * 100))
        } : {
          tiempoAcumulado: 0,
          completado: false,
          fechaCompletado: null,
          porcentaje: 0
        }
      };
    });

    // Calcular progreso total
    const modulosCompletados = modulosConProgreso.filter(m => m.progreso.completado).length;
    const progresoTotal = Math.round((modulosCompletados / modulos.length) * 100);

    res.json({
      modulos: modulosConProgreso,
      estadisticas: {
        totalModulos: modulos.length,
        modulosCompletados,
        progresoTotal,
        puedeHacerExamen: modulosCompletados === modulos.length
      }
    });

  } catch (error) {
    console.error('Error obteniendo módulos:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener módulos'
    });
  }
}

/**
 * Obtener detalle de un módulo
 */
async function obtenerModulo(req, res) {
  try {
    const { id } = req.params;

    const modulo = await prisma.modulo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!modulo || !modulo.activo) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Módulo no encontrado'
      });
    }

    // Verificar si puede acceder (módulos previos completados)
    if (modulo.orden > 1) {
      const moduloAnterior = await prisma.modulo.findFirst({
        where: { orden: modulo.orden - 1, activo: true }
      });

      if (moduloAnterior) {
        const progresoAnterior = await prisma.progresoModulo.findUnique({
          where: {
            usuarioId_moduloId: {
              usuarioId: req.userId,
              moduloId: moduloAnterior.id
            }
          }
        });

        if (!progresoAnterior || !progresoAnterior.completado) {
          return res.status(403).json({
            error: 'Acceso denegado',
            message: 'Debes completar el módulo anterior antes de acceder a este'
          });
        }
      }
    }

    // Obtener o crear progreso
    let progreso = await prisma.progresoModulo.findUnique({
      where: {
        usuarioId_moduloId: {
          usuarioId: req.userId,
          moduloId: modulo.id
        }
      }
    });

    if (!progreso) {
      progreso = await prisma.progresoModulo.create({
        data: {
          usuarioId: req.userId,
          moduloId: modulo.id
        }
      });
    }

    res.json({
      modulo: {
        id: modulo.id,
        orden: modulo.orden,
        titulo: modulo.titulo,
        descripcion: modulo.descripcion,
        contenido: modulo.contenido,
        videoUrl: modulo.videoUrl,
        duracionMin: modulo.duracionMin
      },
      progreso: {
        tiempoAcumulado: progreso.tiempoAcumulado,
        completado: progreso.completado,
        fechaCompletado: progreso.fechaCompletado,
        tiempoRestante: Math.max(0, (modulo.duracionMin * 60) - progreso.tiempoAcumulado)
      }
    });

  } catch (error) {
    console.error('Error obteniendo módulo:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener módulo'
    });
  }
}

/**
 * Actualizar progreso de un módulo
 */
async function actualizarProgreso(req, res) {
  try {
    const { id } = req.params;
    const { tiempoAcumulado } = req.body;

    const modulo = await prisma.modulo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!modulo || !modulo.activo) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Módulo no encontrado'
      });
    }

    // Obtener progreso actual
    let progreso = await prisma.progresoModulo.findUnique({
      where: {
        usuarioId_moduloId: {
          usuarioId: req.userId,
          moduloId: modulo.id
        }
      }
    });

    if (!progreso) {
      progreso = await prisma.progresoModulo.create({
        data: {
          usuarioId: req.userId,
          moduloId: modulo.id,
          tiempoAcumulado: Math.max(0, tiempoAcumulado)
        }
      });
    } else {
      // Solo actualizar si no está completado y el nuevo tiempo es mayor
      if (!progreso.completado && tiempoAcumulado > progreso.tiempoAcumulado) {
        progreso = await prisma.progresoModulo.update({
          where: { id: progreso.id },
          data: { tiempoAcumulado }
        });
      }
    }

    const tiempoRequerido = modulo.duracionMin * 60;
    const puedeCompletar = progreso.tiempoAcumulado >= tiempoRequerido;

    res.json({
      progreso: {
        tiempoAcumulado: progreso.tiempoAcumulado,
        completado: progreso.completado,
        tiempoRestante: Math.max(0, tiempoRequerido - progreso.tiempoAcumulado),
        porcentaje: Math.min(100, Math.round((progreso.tiempoAcumulado / tiempoRequerido) * 100)),
        puedeCompletar
      }
    });

  } catch (error) {
    console.error('Error actualizando progreso:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al actualizar progreso'
    });
  }
}

/**
 * Marcar módulo como completado
 */
async function completarModulo(req, res) {
  try {
    const { id } = req.params;

    const modulo = await prisma.modulo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!modulo || !modulo.activo) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Módulo no encontrado'
      });
    }

    // Obtener progreso actual
    const progreso = await prisma.progresoModulo.findUnique({
      where: {
        usuarioId_moduloId: {
          usuarioId: req.userId,
          moduloId: modulo.id
        }
      }
    });

    if (!progreso) {
      return res.status(400).json({
        error: 'Sin progreso',
        message: 'Debes visualizar el contenido antes de completar el módulo'
      });
    }

    if (progreso.completado) {
      return res.json({
        mensaje: 'Módulo ya completado',
        progreso: {
          completado: true,
          fechaCompletado: progreso.fechaCompletado
        }
      });
    }

    // Verificar tiempo mínimo
    const tiempoRequerido = modulo.duracionMin * 60;
    if (progreso.tiempoAcumulado < tiempoRequerido) {
      const minutosRestantes = Math.ceil((tiempoRequerido - progreso.tiempoAcumulado) / 60);
      return res.status(400).json({
        error: 'Tiempo insuficiente',
        message: `Debes visualizar el contenido durante al menos ${minutosRestantes} minutos más`
      });
    }

    // Marcar como completado
    const progresoActualizado = await prisma.progresoModulo.update({
      where: { id: progreso.id },
      data: {
        completado: true,
        fechaCompletado: new Date()
      }
    });

    // Verificar si todos los módulos están completados
    const totalModulos = await prisma.modulo.count({ where: { activo: true } });
    const modulosCompletados = await prisma.progresoModulo.count({
      where: {
        usuarioId: req.userId,
        completado: true
      }
    });

    res.json({
      mensaje: 'Módulo completado correctamente',
      progreso: {
        completado: true,
        fechaCompletado: progresoActualizado.fechaCompletado
      },
      estadisticas: {
        modulosCompletados,
        totalModulos,
        puedeHacerExamen: modulosCompletados === totalModulos
      }
    });

  } catch (error) {
    console.error('Error completando módulo:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al completar módulo'
    });
  }
}

module.exports = {
  obtenerModulos,
  obtenerModulo,
  actualizarProgreso,
  completarModulo
};
