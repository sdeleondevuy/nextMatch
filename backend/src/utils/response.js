/**
 * Utilidades para respuestas consistentes de la API
 */

export const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (res, message = 'Error interno del servidor', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

export const validationErrorResponse = (res, errors) => {
  // Validar que errors existe y es un array
  let errorList = [];
  
  if (Array.isArray(errors)) {
    errorList = errors;
  } else if (errors && errors.issues && Array.isArray(errors.issues)) {
    // Zod devuelve { issues: [...] }
    errorList = errors.issues;
  } else if (errors && errors.errors && Array.isArray(errors.errors)) {
    // Otras veces devuelve { errors: [...] }
    errorList = errors.errors;
  }
  
  return res.status(400).json({
    success: false,
    message: 'Error de validación',
    errors: errorList.map((err) => ({
      field: err.path && err.path[0] ? err.path[0] : 'unknown',
      message: err.message || 'Error de validación desconocido',
    })),
    timestamp: new Date().toISOString()
  });
};
