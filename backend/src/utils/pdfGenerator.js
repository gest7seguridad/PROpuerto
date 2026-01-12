const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Genera el certificado en PDF
 * @param {Object} datos - Datos para el certificado
 * @param {string} datos.nombre - Nombre completo del usuario
 * @param {string} datos.dni - DNI del usuario
 * @param {string} datos.codigoVerificacion - Código único del certificado
 * @param {Date} datos.fechaEmision - Fecha de emisión
 * @param {number} datos.nota - Nota obtenida en el examen
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
async function generarCertificadoPDF(datos) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const urlVerificacion = `${process.env.FRONTEND_URL}/verificar/${datos.codigoVerificacion}`;

      // Generar QR
      const qrDataUrl = await QRCode.toDataURL(urlVerificacion, {
        width: 120,
        margin: 1,
        color: { dark: '#7B2D5B', light: '#ffffff' }
      });

      // Colores corporativos del Ayuntamiento de Puerto del Rosario
      const granatePrincipal = '#7B2D5B'; // Color corporativo principal
      const granateClaro = '#9B4D7B';
      const grisOscuro = '#374151';

      // Marco decorativo
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
         .lineWidth(3)
         .stroke(granatePrincipal);

      doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
         .lineWidth(1)
         .stroke(granateClaro);

      // Header con "escudo" simulado
      const centerX = doc.page.width / 2;

      // Círculo simulando escudo
      doc.circle(centerX, 100, 40)
         .lineWidth(2)
         .stroke(granatePrincipal);

      doc.fontSize(12)
         .fillColor(granatePrincipal)
         .text('PR', centerX - 15, 90, { width: 30, align: 'center' });

      // Título del Ayuntamiento
      doc.fontSize(16)
         .fillColor(grisOscuro)
         .text('AYUNTAMIENTO DE PUERTO DEL ROSARIO', 50, 160, {
           width: doc.page.width - 100,
           align: 'center'
         });

      doc.fontSize(12)
         .fillColor(granateClaro)
         .text('Fuerteventura - Islas Canarias', 50, 180, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Línea decorativa
      doc.moveTo(150, 210).lineTo(doc.page.width - 150, 210)
         .lineWidth(2)
         .stroke(granatePrincipal);

      // Título del certificado
      doc.fontSize(28)
         .fillColor(granatePrincipal)
         .text('CERTIFICADO', 50, 235, {
           width: doc.page.width - 100,
           align: 'center'
         });

      doc.fontSize(18)
         .fillColor(grisOscuro)
         .text('de Formación en Gestión de Residuos', 50, 270, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Cuerpo del certificado
      doc.fontSize(12)
         .fillColor(grisOscuro)
         .text('Se certifica que:', 50, 320, {
           width: doc.page.width - 100,
           align: 'center'
         });

      doc.fontSize(22)
         .fillColor(granatePrincipal)
         .text(datos.nombre, 50, 350, {
           width: doc.page.width - 100,
           align: 'center'
         });

      doc.fontSize(12)
         .fillColor(grisOscuro)
         .text(`con DNI/NIE: ${datos.dni}`, 50, 385, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Texto descriptivo
      const textoDescriptivo = `Ha superado satisfactoriamente el curso de Formación en Gestión de Residuos organizado por el Ayuntamiento de Puerto del Rosario, demostrando conocimientos en la correcta separación, reciclaje y tratamiento de residuos domésticos.`;

      doc.fontSize(11)
         .fillColor(grisOscuro)
         .text(textoDescriptivo, 100, 420, {
           width: doc.page.width - 200,
           align: 'justify'
         });

      // Calificación
      doc.fontSize(14)
         .fillColor(granatePrincipal)
         .text(`Calificación obtenida: ${datos.nota.toFixed(1)}%`, 50, 475, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Fecha de emisión
      const fechaFormateada = new Date(datos.fechaEmision).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      doc.fontSize(11)
         .fillColor(grisOscuro)
         .text(`Puerto del Rosario, a ${fechaFormateada}`, 50, 505, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // QR Code (esquina inferior izquierda)
      const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
      doc.image(qrBuffer, 60, doc.page.height - 170, { width: 100 });

      doc.fontSize(8)
         .fillColor(grisOscuro)
         .text('Escanea para verificar', 60, doc.page.height - 65, { width: 100, align: 'center' });

      // Código de verificación (centro inferior)
      doc.fontSize(9)
         .fillColor(grisOscuro)
         .text(`Código de verificación: ${datos.codigoVerificacion}`, 50, doc.page.height - 80, {
           width: doc.page.width - 100,
           align: 'center'
         });

      doc.fontSize(8)
         .text(`Verificable en: ${urlVerificacion}`, 50, doc.page.height - 65, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Firma digital simulada (esquina inferior derecha)
      doc.fontSize(10)
         .fillColor(grisOscuro)
         .text('Firmado digitalmente', doc.page.width - 200, doc.page.height - 130, {
           width: 140,
           align: 'center'
         });

      doc.moveTo(doc.page.width - 200, doc.page.height - 100)
         .lineTo(doc.page.width - 60, doc.page.height - 100)
         .stroke(grisOscuro);

      doc.fontSize(9)
         .text('El/La Concejal/a de Medio Ambiente', doc.page.width - 200, doc.page.height - 90, {
           width: 140,
           align: 'center'
         });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Guarda el PDF en el sistema de archivos
 * @param {Buffer} pdfBuffer - Buffer del PDF
 * @param {string} codigoVerificacion - Código del certificado
 * @returns {string} - Ruta del archivo guardado
 */
async function guardarCertificadoPDF(pdfBuffer, codigoVerificacion) {
  const directorioBase = path.join(__dirname, '../../uploads/certificados');

  // Crear directorio si no existe
  if (!fs.existsSync(directorioBase)) {
    fs.mkdirSync(directorioBase, { recursive: true });
  }

  const nombreArchivo = `certificado-${codigoVerificacion}.pdf`;
  const rutaCompleta = path.join(directorioBase, nombreArchivo);

  fs.writeFileSync(rutaCompleta, pdfBuffer);

  return rutaCompleta;
}

module.exports = {
  generarCertificadoPDF,
  guardarCertificadoPDF
};
