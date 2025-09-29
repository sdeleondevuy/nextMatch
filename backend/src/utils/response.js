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
  return res.status(400).json({
    success: false,
    message: 'Error de validación',
    errors: errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    })),
    timestamp: new Date().toISOString()
  });
};
