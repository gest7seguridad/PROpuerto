const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Obtener estado del examen del usuario
 */
async function obtenerEstado(req, res) {
  try {
    // Verificar si todos los módulos están completados
    const totalModulos = await prisma.modulo.count({ where: { activo: true } });
    const modulosCompletados = await prisma.progresoModulo.count({
      where: {
        usuarioId: req.userId,
        completado: true
      }
    });

    const formacionCompletada = modulosCompletados === totalModulos && totalModulos > 0;

    // Obtener configuración del examen
    let config = await prisma.configuracionExamen.findUnique({
      where: { id: 1 }
    });

    if (!config) {
      config = {
        numPreguntas: 20,
        notaMinAprobado: 70,
        tiempoLimiteMin: 30,
        maxIntentos: 3
      };
    }

    // Obtener intentos del usuario
    const intentos = await prisma.examen.findMany({
      where: { usuarioId: req.userId },
      orderBy: { intentoNum: 'desc' }
    });

    const intentosRealizados = intentos.length;
    const intentosRestantes = config.maxIntentos - intentosRealizados;
    const ultimoExamen = intentos[0] || null;

    // Verificar si hay examen aprobado
    const examenAprobado = intentos.find(e => e.aprobado);

    // Verificar si hay examen en curso
    const examenEnCurso = intentos.find(e => !e.fechaFin);

    res.json({
      formacionCompletada,
      modulosCompletados,
      totalModulos,
      configuracion: {
        numPreguntas: config.numPreguntas,
        notaMinAprobado: config.notaMinAprobado,
        tiempoLimiteMin: config.tiempoLimiteMin,
        maxIntentos: config.maxIntentos
      },
      intentos: {
        realizados: intentosRealizados,
        restantes: intentosRestantes,
        puedeIntentar: formacionCompletada && intentosRestantes > 0 && !examenAprobado && !examenEnCurso
      },
      ultimoExamen: ultimoExamen ? {
        id: ultimoExamen.id,
        intentoNum: ultimoExamen.intentoNum,
        fechaInicio: ultimoExamen.fechaInicio,
        fechaFin: ultimoExamen.fechaFin,
        puntuacion: ultimoExamen.puntuacion,
        aprobado: ultimoExamen.aprobado
      } : null,
      examenAprobado: examenAprobado ? {
        id: examenAprobado.id,
        puntuacion: examenAprobado.puntuacion,
        fechaFin: examenAprobado.fechaFin
      } : null,
      examenEnCurso: examenEnCurso ? {
        id: examenEnCurso.id,
        fechaInicio: examenEnCurso.fechaInicio
      } : null
    });

  } catch (error) {
    console.error('Error obteniendo estado del examen:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener estado del examen'
    });
  }
}

/**
 * Iniciar un nuevo examen
 */
async function iniciarExamen(req, res) {
  try {
    // Verificar si puede hacer examen
    const totalModulos = await prisma.modulo.count({ where: { activo: true } });
    const modulosCompletados = await prisma.progresoModulo.count({
      where: {
        usuarioId: req.userId,
        completado: true
      }
    });

    if (modulosCompletados < totalModulos) {
      return res.status(400).json({
        error: 'Formación incompleta',
        message: 'Debes completar todos los módulos antes de realizar el examen'
      });
    }

    // Obtener configuración
    let config = await prisma.configuracionExamen.findUnique({
      where: { id: 1 }
    });

    if (!config) {
      config = { numPreguntas: 20, notaMinAprobado: 70, tiempoLimiteMin: 30, maxIntentos: 3 };
    }

    // Verificar intentos
    const intentosRealizados = await prisma.examen.count({
      where: { usuarioId: req.userId }
    });

    if (intentosRealizados >= config.maxIntentos) {
      return res.status(400).json({
        error: 'Sin intentos',
        message: 'Has agotado todos los intentos de examen'
      });
    }

    // Verificar si ya aprobó
    const examenAprobado = await prisma.examen.findFirst({
      where: { usuarioId: req.userId, aprobado: true }
    });

    if (examenAprobado) {
      return res.status(400).json({
        error: 'Ya aprobado',
        message: 'Ya has aprobado el examen. Puedes solicitar tu certificado.'
      });
    }

    // Verificar si hay examen en curso
    const examenEnCurso = await prisma.examen.findFirst({
      where: { usuarioId: req.userId, fechaFin: null }
    });

    if (examenEnCurso) {
      return res.status(400).json({
        error: 'Examen en curso',
        message: 'Ya tienes un examen en curso',
        examenId: examenEnCurso.id
      });
    }

    // Seleccionar preguntas aleatorias
    const preguntas = await prisma.pregunta.findMany({
      where: { activa: true },
      select: { id: true }
    });

    if (preguntas.length < config.numPreguntas) {
      return res.status(500).json({
        error: 'Error de configuración',
        message: 'No hay suficientes preguntas disponibles'
      });
    }

    // Mezclar y seleccionar preguntas
    const preguntasIds = preguntas
      .map(p => p.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, config.numPreguntas);

    // Crear examen
    const examen = await prisma.examen.create({
      data: {
        usuarioId: req.userId,
        intentoNum: intentosRealizados + 1,
        preguntasIds: preguntasIds,
        respuestas: {}
      }
    });

    res.status(201).json({
      mensaje: 'Examen iniciado',
      examen: {
        id: examen.id,
        intentoNum: examen.intentoNum,
        fechaInicio: examen.fechaInicio,
        numPreguntas: config.numPreguntas,
        tiempoLimiteMin: config.tiempoLimiteMin
      }
    });

  } catch (error) {
    console.error('Error iniciando examen:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al iniciar examen'
    });
  }
}

/**
 * Obtener examen en curso con preguntas
 */
async function obtenerExamen(req, res) {
  try {
    const { id } = req.params;

    const examen = await prisma.examen.findUnique({
      where: { id }
    });

    if (!examen || examen.usuarioId !== req.userId) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Examen no encontrado'
      });
    }

    // Si ya terminó, no mostrar preguntas
    if (examen.fechaFin) {
      return res.status(400).json({
        error: 'Examen finalizado',
        message: 'Este examen ya ha sido finalizado',
        resultado: {
          puntuacion: examen.puntuacion,
          aprobado: examen.aprobado
        }
      });
    }

    // Obtener configuración para tiempo límite
    let config = await prisma.configuracionExamen.findUnique({
      where: { id: 1 }
    });

    if (!config) {
      config = { tiempoLimiteMin: 30, notaMinAprobado: 70 };
    }

    // Verificar si ha expirado el tiempo
    const tiempoTranscurrido = (new Date() - new Date(examen.fechaInicio)) / 1000 / 60;
    if (tiempoTranscurrido >= config.tiempoLimiteMin) {
      // Finalizar automáticamente
      const resultado = await finalizarExamenInterno(examen, config);
      return res.json({
        mensaje: 'Tiempo agotado. El examen ha sido finalizado automáticamente.',
        resultado
      });
    }

    // Obtener preguntas (sin respuesta correcta)
    const preguntas = await prisma.pregunta.findMany({
      where: { id: { in: examen.preguntasIds } },
      select: {
        id: true,
        enunciado: true,
        opciones: true
      }
    });

    // Ordenar según el orden original
    const preguntasOrdenadas = examen.preguntasIds.map(id =>
      preguntas.find(p => p.id === id)
    );

    res.json({
      examen: {
        id: examen.id,
        intentoNum: examen.intentoNum,
        fechaInicio: examen.fechaInicio,
        respuestas: examen.respuestas || {},
        tiempoRestante: Math.max(0, (config.tiempoLimiteMin * 60) - (tiempoTranscurrido * 60))
      },
      preguntas: preguntasOrdenadas,
      configuracion: {
        tiempoLimiteMin: config.tiempoLimiteMin,
        notaMinAprobado: config.notaMinAprobado
      }
    });

  } catch (error) {
    console.error('Error obteniendo examen:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener examen'
    });
  }
}

/**
 * Guardar respuesta individual
 */
async function guardarRespuesta(req, res) {
  try {
    const { id } = req.params;
    const { preguntaId, respuesta } = req.body;

    const examen = await prisma.examen.findUnique({
      where: { id }
    });

    if (!examen || examen.usuarioId !== req.userId) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Examen no encontrado'
      });
    }

    if (examen.fechaFin) {
      return res.status(400).json({
        error: 'Examen finalizado',
        message: 'No se pueden guardar respuestas en un examen finalizado'
      });
    }

    // Verificar que la pregunta pertenece al examen
    if (!examen.preguntasIds.includes(preguntaId)) {
      return res.status(400).json({
        error: 'Pregunta inválida',
        message: 'Esta pregunta no pertenece al examen'
      });
    }

    // Actualizar respuestas
    const respuestas = { ...(examen.respuestas || {}), [preguntaId]: respuesta };

    await prisma.examen.update({
      where: { id },
      data: { respuestas }
    });

    res.json({
      mensaje: 'Respuesta guardada',
      preguntasRespondidas: Object.keys(respuestas).length,
      totalPreguntas: examen.preguntasIds.length
    });

  } catch (error) {
    console.error('Error guardando respuesta:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al guardar respuesta'
    });
  }
}

/**
 * Función interna para finalizar examen
 */
async function finalizarExamenInterno(examen, config) {
  const preguntas = await prisma.pregunta.findMany({
    where: { id: { in: examen.preguntasIds } },
    select: {
      id: true,
      respuestaCorrecta: true,
      explicacion: true,
      enunciado: true,
      opciones: true
    }
  });

  const respuestas = examen.respuestas || {};
  let correctas = 0;

  const detalle = preguntas.map(pregunta => {
    const respuestaUsuario = respuestas[pregunta.id];
    const esCorrecta = respuestaUsuario === pregunta.respuestaCorrecta;
    if (esCorrecta) correctas++;

    return {
      preguntaId: pregunta.id,
      enunciado: pregunta.enunciado,
      opciones: pregunta.opciones,
      respuestaUsuario,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      esCorrecta,
      explicacion: pregunta.explicacion
    };
  });

  const puntuacion = (correctas / preguntas.length) * 100;
  const aprobado = puntuacion >= config.notaMinAprobado;

  await prisma.examen.update({
    where: { id: examen.id },
    data: {
      fechaFin: new Date(),
      puntuacion,
      aprobado
    }
  });

  return {
    puntuacion,
    aprobado,
    correctas,
    totalPreguntas: preguntas.length,
    notaMinAprobado: config.notaMinAprobado,
    detalle
  };
}

/**
 * Finalizar examen
 */
async function finalizarExamen(req, res) {
  try {
    const { id } = req.params;

    const examen = await prisma.examen.findUnique({
      where: { id }
    });

    if (!examen || examen.usuarioId !== req.userId) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Examen no encontrado'
      });
    }

    if (examen.fechaFin) {
      return res.status(400).json({
        error: 'Examen finalizado',
        message: 'Este examen ya ha sido finalizado'
      });
    }

    // Obtener configuración
    let config = await prisma.configuracionExamen.findUnique({
      where: { id: 1 }
    });

    if (!config) {
      config = { notaMinAprobado: 70 };
    }

    const resultado = await finalizarExamenInterno(examen, config);

    res.json({
      mensaje: resultado.aprobado ? '¡Felicidades! Has aprobado el examen.' : 'No has alcanzado la nota mínima.',
      resultado
    });

  } catch (error) {
    console.error('Error finalizando examen:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al finalizar examen'
    });
  }
}

/**
 * Obtener resultado de un examen finalizado
 */
async function obtenerResultado(req, res) {
  try {
    const { id } = req.params;

    const examen = await prisma.examen.findUnique({
      where: { id }
    });

    if (!examen || examen.usuarioId !== req.userId) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Examen no encontrado'
      });
    }

    if (!examen.fechaFin) {
      return res.status(400).json({
        error: 'Examen en curso',
        message: 'Este examen aún no ha sido finalizado'
      });
    }

    // Obtener configuración
    let config = await prisma.configuracionExamen.findUnique({
      where: { id: 1 }
    });

    if (!config) {
      config = { notaMinAprobado: 70 };
    }

    // Obtener preguntas con explicaciones
    const preguntas = await prisma.pregunta.findMany({
      where: { id: { in: examen.preguntasIds } },
      select: {
        id: true,
        enunciado: true,
        opciones: true,
        respuestaCorrecta: true,
        explicacion: true
      }
    });

    const respuestas = examen.respuestas || {};

    const detalle = preguntas.map(pregunta => {
      const respuestaUsuario = respuestas[pregunta.id];
      return {
        preguntaId: pregunta.id,
        enunciado: pregunta.enunciado,
        opciones: pregunta.opciones,
        respuestaUsuario,
        respuestaCorrecta: pregunta.respuestaCorrecta,
        esCorrecta: respuestaUsuario === pregunta.respuestaCorrecta,
        explicacion: pregunta.explicacion
      };
    });

    res.json({
      examen: {
        id: examen.id,
        intentoNum: examen.intentoNum,
        fechaInicio: examen.fechaInicio,
        fechaFin: examen.fechaFin,
        puntuacion: examen.puntuacion,
        aprobado: examen.aprobado
      },
      resultado: {
        puntuacion: examen.puntuacion,
        aprobado: examen.aprobado,
        correctas: detalle.filter(d => d.esCorrecta).length,
        totalPreguntas: detalle.length,
        notaMinAprobado: config.notaMinAprobado
      },
      detalle
    });

  } catch (error) {
    console.error('Error obteniendo resultado:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener resultado'
    });
  }
}

module.exports = {
  obtenerEstado,
  iniciarExamen,
  obtenerExamen,
  guardarRespuesta,
  finalizarExamen,
  obtenerResultado
};
