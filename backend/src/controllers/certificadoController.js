const { PrismaClient } = require('@prisma/client');
const { generarCertificadoPDF, guardarCertificadoPDF } = require('../utils/pdfGenerator');
const { enviarEmailCertificado } = require('../utils/email');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

/**
 * Obtener estado del certificado
 */
async function obtenerEstado(req, res) {
  try {
    // Verificar si ha aprobado el examen
    const examenAprobado = await prisma.examen.findFirst({
      where: {
        usuarioId: req.userId,
        aprobado: true
      },
      orderBy: { fechaFin: 'desc' }
    });

    if (!examenAprobado) {
      return res.json({
        puedeObtenerCertificado: false,
        mensaje: 'Debes aprobar el examen para obtener el certificado',
        certificado: null
      });
    }

    // Buscar certificado existente
    const certificado = await prisma.certificado.findUnique({
      where: { usuarioId: req.userId }
    });

    res.json({
      puedeObtenerCertificado: true,
      examenAprobado: {
        puntuacion: examenAprobado.puntuacion,
        fechaFin: examenAprobado.fechaFin
      },
      certificado: certificado ? {
        id: certificado.id,
        codigoVerificacion: certificado.codigoVerificacion,
        fechaEmision: certificado.fechaEmision,
        firmaSolicitada: certificado.firmaSolicitada,
        firmado: certificado.firmado,
        fechaFirma: certificado.fechaFirma,
        pdfGenerado: certificado.pdfGenerado
      } : null
    });

  } catch (error) {
    console.error('Error obteniendo estado del certificado:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al obtener estado del certificado'
    });
  }
}

/**
 * Solicitar firma del certificado
 */
async function solicitarFirma(req, res) {
  try {
    // Verificar examen aprobado
    const examenAprobado = await prisma.examen.findFirst({
      where: {
        usuarioId: req.userId,
        aprobado: true
      },
      orderBy: { fechaFin: 'desc' }
    });

    if (!examenAprobado) {
      return res.status(400).json({
        error: 'Sin examen aprobado',
        message: 'Debes aprobar el examen antes de solicitar el certificado'
      });
    }

    // Buscar o crear certificado
    let certificado = await prisma.certificado.findUnique({
      where: { usuarioId: req.userId }
    });

    if (!certificado) {
      certificado = await prisma.certificado.create({
        data: {
          usuarioId: req.userId,
          notaExamen: examenAprobado.puntuacion,
          firmaSolicitada: true
        }
      });
    } else if (!certificado.firmaSolicitada) {
      certificado = await prisma.certificado.update({
        where: { id: certificado.id },
        data: { firmaSolicitada: true }
      });
    }

    // En producción, aquí se integraría con Signaturit
    // Por ahora, simulamos el proceso de firma

    res.json({
      mensaje: 'Solicitud de firma enviada',
      certificado: {
        id: certificado.id,
        codigoVerificacion: certificado.codigoVerificacion,
        firmaSolicitada: true,
        // En producción, esto sería la URL de firma de Signaturit
        urlFirma: `${process.env.FRONTEND_URL}/firmar/${certificado.id}`
      }
    });

  } catch (error) {
    console.error('Error solicitando firma:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al solicitar firma'
    });
  }
}

/**
 * Webhook para recibir confirmación de firma (de Signaturit)
 * En producción, se verificaría la autenticidad de la petición
 */
async function webhookFirma(req, res) {
  try {
    const { certificadoId, firmaId, firmado } = req.body;

    // En producción, verificar signature de Signaturit

    const certificado = await prisma.certificado.findUnique({
      where: { id: certificadoId }
    });

    if (!certificado) {
      return res.status(404).json({ error: 'Certificado no encontrado' });
    }

    if (firmado) {
      await prisma.certificado.update({
        where: { id: certificadoId },
        data: {
          firmado: true,
          firmaId,
          fechaFirma: new Date()
        }
      });
    }

    res.json({ recibido: true });

  } catch (error) {
    console.error('Error en webhook de firma:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
}

/**
 * Simular firma (para desarrollo)
 */
async function simularFirma(req, res) {
  try {
    const certificado = await prisma.certificado.findUnique({
      where: { usuarioId: req.userId },
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
    });

    if (!certificado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'No tienes un certificado pendiente de firma'
      });
    }

    if (certificado.firmado) {
      return res.status(400).json({
        error: 'Ya firmado',
        message: 'El certificado ya ha sido firmado'
      });
    }

    // Simular firma
    const certificadoActualizado = await prisma.certificado.update({
      where: { id: certificado.id },
      data: {
        firmado: true,
        firmaId: `SIM-${Date.now()}`,
        fechaFirma: new Date()
      }
    });

    // Generar PDF
    const nombreCompleto = `${certificado.usuario.nombre} ${certificado.usuario.apellidos}`;

    const pdfBuffer = await generarCertificadoPDF({
      nombre: nombreCompleto,
      dni: certificado.usuario.dni,
      codigoVerificacion: certificado.codigoVerificacion,
      fechaEmision: certificadoActualizado.fechaFirma,
      nota: certificado.notaExamen
    });

    // Guardar PDF
    const pdfPath = await guardarCertificadoPDF(pdfBuffer, certificado.codigoVerificacion);

    await prisma.certificado.update({
      where: { id: certificado.id },
      data: {
        pdfGenerado: true,
        pdfPath
      }
    });

    // Enviar email con certificado
    try {
      await enviarEmailCertificado(
        certificado.usuario.email,
        certificado.usuario.nombre,
        certificado.codigoVerificacion,
        pdfBuffer
      );
    } catch (emailError) {
      console.error('Error enviando email de certificado:', emailError);
    }

    res.json({
      mensaje: 'Certificado firmado y generado correctamente',
      certificado: {
        id: certificado.id,
        codigoVerificacion: certificado.codigoVerificacion,
        firmado: true,
        fechaFirma: certificadoActualizado.fechaFirma,
        pdfGenerado: true
      }
    });

  } catch (error) {
    console.error('Error simulando firma:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al procesar la firma'
    });
  }
}

/**
 * Descargar certificado PDF
 */
async function descargarCertificado(req, res) {
  try {
    const certificado = await prisma.certificado.findUnique({
      where: { usuarioId: req.userId },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
            dni: true
          }
        }
      }
    });

    if (!certificado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'No tienes un certificado generado'
      });
    }

    if (!certificado.firmado) {
      return res.status(400).json({
        error: 'Sin firmar',
        message: 'El certificado aún no ha sido firmado'
      });
    }

    // Si ya existe el PDF, enviarlo
    if (certificado.pdfPath && fs.existsSync(certificado.pdfPath)) {
      return res.download(certificado.pdfPath, `certificado-${certificado.codigoVerificacion}.pdf`);
    }

    // Si no existe, generarlo
    const nombreCompleto = `${certificado.usuario.nombre} ${certificado.usuario.apellidos}`;

    const pdfBuffer = await generarCertificadoPDF({
      nombre: nombreCompleto,
      dni: certificado.usuario.dni,
      codigoVerificacion: certificado.codigoVerificacion,
      fechaEmision: certificado.fechaFirma || certificado.fechaEmision,
      nota: certificado.notaExamen
    });

    // Guardar para futuras descargas
    const pdfPath = await guardarCertificadoPDF(pdfBuffer, certificado.codigoVerificacion);

    await prisma.certificado.update({
      where: { id: certificado.id },
      data: {
        pdfGenerado: true,
        pdfPath
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificado-${certificado.codigoVerificacion}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error descargando certificado:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al descargar certificado'
    });
  }
}

/**
 * Verificar certificado (público)
 */
// Funcion auxiliar para censurar DNI (mostrar solo parte por privacidad)
function censurarDNI(dni) {
  if (!dni || dni.length < 5) return '***';
  // Mostrar solo los 3 ultimos digitos y la letra: ***4567A
  return '***' + dni.slice(-4);
}

async function verificarCertificado(req, res) {
  try {
    const { codigo } = req.params;

    const certificado = await prisma.certificado.findUnique({
      where: { codigoVerificacion: codigo },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
            dni: true
          }
        }
      }
    });

    if (!certificado || !certificado.firmado) {
      return res.status(404).json({
        valido: false,
        mensaje: 'Certificado no encontrado o no valido'
      });
    }

    res.json({
      valido: true,
      certificado: {
        nombreCompleto: `${certificado.usuario.nombre} ${certificado.usuario.apellidos}`,
        dniCensurado: censurarDNI(certificado.usuario.dni),
        codigoVerificacion: certificado.codigoVerificacion,
        fechaEmision: certificado.fechaEmision,
        fechaFirma: certificado.fechaFirma,
        notaExamen: certificado.notaExamen
      }
    });

  } catch (error) {
    console.error('Error verificando certificado:', error);
    res.status(500).json({
      error: 'Error interno',
      message: 'Error al verificar certificado'
    });
  }
}

module.exports = {
  obtenerEstado,
  solicitarFirma,
  webhookFirma,
  simularFirma,
  descargarCertificado,
  verificarCertificado
};
