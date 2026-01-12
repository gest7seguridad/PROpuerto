const { body, param, validationResult } = require('express-validator');
const { validarDocumento, validarCodigoPostal, validarTelefono } = require('../utils/validators');

/**
 * Middleware para manejar errores de validación
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Error de validación',
      errores: errors.array().map(err => ({
        campo: err.path,
        mensaje: err.msg
      }))
    });
  }
  next();
}

/**
 * Validaciones para registro de usuario
 */
const registroValidation = [
  body('dni')
    .trim()
    .notEmpty().withMessage('El DNI/NIE es obligatorio')
    .custom(value => {
      if (!validarDocumento(value)) {
        throw new Error('DNI/NIE inválido');
      }
      return true;
    }),

  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('apellidos')
    .trim()
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isLength({ min: 2, max: 150 }).withMessage('Los apellidos deben tener entre 2 y 150 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('telefono')
    .optional()
    .trim()
    .custom(value => {
      if (value && !validarTelefono(value)) {
        throw new Error('Teléfono inválido');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),

  body('direccion')
    .trim()
    .notEmpty().withMessage('La dirección es obligatoria')
    .isLength({ min: 5, max: 200 }).withMessage('La dirección debe tener entre 5 y 200 caracteres'),

  body('numero')
    .trim()
    .notEmpty().withMessage('El número es obligatorio'),

  body('piso')
    .optional()
    .trim(),

  body('puerta')
    .optional()
    .trim(),

  body('codigoPostal')
    .trim()
    .notEmpty().withMessage('El código postal es obligatorio')
    .custom(value => {
      if (!validarCodigoPostal(value)) {
        throw new Error('Código postal inválido (debe tener 5 dígitos)');
      }
      return true;
    }),

  body('localidad')
    .optional()
    .trim()
    .default('Puerto del Rosario'),

  handleValidationErrors
];

/**
 * Validaciones para login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),

  handleValidationErrors
];

/**
 * Validaciones para recuperación de contraseña
 */
const recuperarPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido'),

  handleValidationErrors
];

/**
 * Validaciones para reset de contraseña
 */
const resetPasswordValidation = [
  param('token')
    .notEmpty().withMessage('Token inválido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),

  handleValidationErrors
];

/**
 * Validaciones para actualizar progreso de módulo
 */
const progresoValidation = [
  body('tiempoAcumulado')
    .isInt({ min: 0 }).withMessage('El tiempo acumulado debe ser un número positivo'),

  handleValidationErrors
];

/**
 * Validaciones para respuesta de examen
 */
const respuestaExamenValidation = [
  body('preguntaId')
    .isInt({ min: 1 }).withMessage('ID de pregunta inválido'),

  body('respuesta')
    .isInt({ min: 0, max: 3 }).withMessage('La respuesta debe ser un índice entre 0 y 3'),

  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registroValidation,
  loginValidation,
  recuperarPasswordValidation,
  resetPasswordValidation,
  progresoValidation,
  respuestaExamenValidation
};
