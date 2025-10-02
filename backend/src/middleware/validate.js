import { validationErrorResponse } from '../utils/response.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return validationErrorResponse(res, result.error.issues);
    }

    // Sobrescribimos req.body con los datos ya parseados/validados
    req.body = result.data;
    next();
  };
};
  