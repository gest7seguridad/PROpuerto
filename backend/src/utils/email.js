const nodemailer = require('nodemailer');

let transporter = null;

/**
 * Inicializa el transportador de email
 */
function inicializarEmail() {
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    console.log('📧 Email en modo desarrollo - los emails se mostrarán en consola');
    return;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Envía un email
 * @param {Object} opciones - Opciones del email
 * @param {string} opciones.to - Destinatario
 * @param {string} opciones.subject - Asunto
 * @param {string} opciones.html - Contenido HTML
 * @param {string} opciones.text - Contenido texto plano (opcional)
 * @param {Array} opciones.attachments - Adjuntos (opcional)
 */
async function enviarEmail({ to, subject, html, text, attachments }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@puertoderosario.org',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
    attachments
  };

  if (!transporter) {
    console.log('\n📧 EMAIL (modo desarrollo):');
    console.log(`   Para: ${to}`);
    console.log(`   Asunto: ${subject}`);
    console.log(`   Contenido: ${text || html.substring(0, 200)}...`);
    console.log('');
    return { messageId: 'dev-' + Date.now() };
  }

  return await transporter.sendMail(mailOptions);
}

/**
 * Envía email de verificación
 * @param {string} email - Email del usuario
 * @param {string} nombre - Nombre del usuario
 * @param {string} token - Token de verificación
 */
async function enviarEmailVerificacion(email, nombre, token) {
  const url = `${process.env.FRONTEND_URL}/verificar-email/${token}`;

  await enviarEmail({
    to: email,
    subject: 'Verifica tu cuenta - Formación en Gestión de Residuos',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #f9fafb; }
          .button { display: inline-block; background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ayuntamiento de Puerto del Rosario</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${nombre}!</h2>
            <p>Gracias por registrarte en la plataforma de Formación en Gestión de Residuos.</p>
            <p>Para completar tu registro y acceder a los módulos de formación, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
            <p style="text-align: center;">
              <a href="${url}" class="button">Verificar mi cuenta</a>
            </p>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #1e40af;">${url}</p>
            <p>Este enlace expirará en 24 horas.</p>
            <p>Si no has solicitado este registro, puedes ignorar este mensaje.</p>
          </div>
          <div class="footer">
            <p>Ayuntamiento de Puerto del Rosario<br>
            Formación en Gestión de Residuos</p>
          </div>
        </div>
      </body>
      </html>
    `
  });
}

/**
 * Envía email de recuperación de contraseña
 * @param {string} email - Email del usuario
 * @param {string} nombre - Nombre del usuario
 * @param {string} token - Token de recuperación
 */
async function enviarEmailRecuperacion(email, nombre, token) {
  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await enviarEmail({
    to: email,
    subject: 'Recuperar contraseña - Formación en Gestión de Residuos',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #f9fafb; }
          .button { display: inline-block; background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ayuntamiento de Puerto del Rosario</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <p style="text-align: center;">
              <a href="${url}" class="button">Restablecer contraseña</a>
            </p>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #1e40af;">${url}</p>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este mensaje.</p>
          </div>
          <div class="footer">
            <p>Ayuntamiento de Puerto del Rosario<br>
            Formación en Gestión de Residuos</p>
          </div>
        </div>
      </body>
      </html>
    `
  });
}

/**
 * Envía email con el certificado
 * @param {string} email - Email del usuario
 * @param {string} nombre - Nombre del usuario
 * @param {string} codigoCertificado - Código del certificado
 * @param {Buffer} pdfBuffer - Buffer del PDF
 */
async function enviarEmailCertificado(email, nombre, codigoCertificado, pdfBuffer) {
  const urlVerificacion = `${process.env.FRONTEND_URL}/verificar/${codigoCertificado}`;

  await enviarEmail({
    to: email,
    subject: 'Tu Certificado de Formación en Gestión de Residuos',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #f9fafb; }
          .success { background-color: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ayuntamiento de Puerto del Rosario</h1>
          </div>
          <div class="content">
            <div class="success">
              <h2>¡Enhorabuena ${nombre}!</h2>
            </div>
            <p>Has completado satisfactoriamente la formación en Gestión de Residuos.</p>
            <p>Adjunto encontrarás tu certificado oficial en formato PDF.</p>
            <p><strong>Código de verificación:</strong> ${codigoCertificado}</p>
            <p>Puedes verificar la autenticidad de tu certificado en cualquier momento en:</p>
            <p style="word-break: break-all; color: #1e40af;">${urlVerificacion}</p>
            <p>Gracias por tu compromiso con el medio ambiente y la correcta gestión de residuos en Puerto del Rosario.</p>
          </div>
          <div class="footer">
            <p>Ayuntamiento de Puerto del Rosario<br>
            Formación en Gestión de Residuos</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: `certificado-residuos-${codigoCertificado}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}

module.exports = {
  inicializarEmail,
  enviarEmail,
  enviarEmailVerificacion,
  enviarEmailRecuperacion,
  enviarEmailCertificado
};
