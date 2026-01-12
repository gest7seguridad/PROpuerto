const crypto = require('crypto');

/**
 * Valida un DNI español
 * @param {string} dni - DNI a validar
 * @returns {boolean}
 */
function validarDNI(dni) {
  if (!dni) return false;

  const dniUpper = dni.toUpperCase().trim();
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

  // DNI: 8 números + 1 letra
  const dniRegex = /^(\d{8})([A-Z])$/;
  const matchDNI = dniUpper.match(dniRegex);

  if (matchDNI) {
    const numero = parseInt(matchDNI[1], 10);
    const letra = matchDNI[2];
    return letra === letras[numero % 23];
  }

  return false;
}

/**
 * Valida un NIE español
 * @param {string} nie - NIE a validar
 * @returns {boolean}
 */
function validarNIE(nie) {
  if (!nie) return false;

  const nieUpper = nie.toUpperCase().trim();
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

  // NIE: X/Y/Z + 7 números + 1 letra
  const nieRegex = /^([XYZ])(\d{7})([A-Z])$/;
  const matchNIE = nieUpper.match(nieRegex);

  if (matchNIE) {
    let prefijo = matchNIE[1];
    const numeros = matchNIE[2];
    const letra = matchNIE[3];

    // Convertir prefijo a número
    if (prefijo === 'X') prefijo = '0';
    else if (prefijo === 'Y') prefijo = '1';
    else if (prefijo === 'Z') prefijo = '2';

    const numero = parseInt(prefijo + numeros, 10);
    return letra === letras[numero % 23];
  }

  return false;
}

/**
 * Valida DNI o NIE
 * @param {string} documento - DNI o NIE a validar
 * @returns {boolean}
 */
function validarDocumento(documento) {
  return validarDNI(documento) || validarNIE(documento);
}

/**
 * Normaliza una dirección para generar hash único
 * @param {string} direccion - Nombre de la calle/avenida
 * @param {string} numero - Número del portal
 * @param {string} codigoPostal - Código postal
 * @param {string} piso - Piso (opcional)
 * @param {string} puerta - Puerta (opcional)
 * @returns {string} - Cadena normalizada
 */
function normalizarDireccion(direccion, numero, codigoPostal, piso = '', puerta = '') {
  const normalized = direccion
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/\s+/g, ' ')
    .replace(/^(calle|c\/|c\.|cl\.)\s*/i, 'c ')
    .replace(/^(avenida|av\/|av\.|avda\.)\s*/i, 'av ')
    .replace(/^(plaza|pl\/|pl\.)\s*/i, 'pl ')
    .replace(/^(paseo|ps\/|ps\.)\s*/i, 'ps ')
    .replace(/^(urbanizacion|urb\.)\s*/i, 'urb ')
    .replace(/^(camino|cm\.)\s*/i, 'cm ')
    .trim();

  const numNorm = (numero || '').toLowerCase().trim();
  const cpNorm = (codigoPostal || '').trim();
  const pisoNorm = (piso || '').toLowerCase().trim();
  const puertaNorm = (puerta || '').toLowerCase().trim();

  return `${normalized}|${numNorm}|${cpNorm}|${pisoNorm}|${puertaNorm}`;
}

/**
 * Genera hash SHA256 de la dirección normalizada
 * @param {string} direccion - Nombre de la calle
 * @param {string} numero - Número del portal
 * @param {string} codigoPostal - Código postal
 * @param {string} piso - Piso (opcional)
 * @param {string} puerta - Puerta (opcional)
 * @returns {string} - Hash SHA256
 */
function generarHashDireccion(direccion, numero, codigoPostal, piso, puerta) {
  const normalizada = normalizarDireccion(direccion, numero, codigoPostal, piso, puerta);
  return crypto.createHash('sha256').update(normalizada).digest('hex');
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida código postal español (5 dígitos)
 * @param {string} cp - Código postal
 * @returns {boolean}
 */
function validarCodigoPostal(cp) {
  const cpRegex = /^\d{5}$/;
  return cpRegex.test(cp);
}

/**
 * Valida teléfono español
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean}
 */
function validarTelefono(telefono) {
  if (!telefono) return true; // Campo opcional
  const telefonoLimpio = telefono.replace(/\s+/g, '');
  const telefonoRegex = /^(\+34)?[6789]\d{8}$/;
  return telefonoRegex.test(telefonoLimpio);
}

module.exports = {
  validarDNI,
  validarNIE,
  validarDocumento,
  normalizarDireccion,
  generarHashDireccion,
  validarEmail,
  validarCodigoPostal,
  validarTelefono
};
