export const validate = (schema) => {
    return (req, res, next) => {
      const result = schema.safeParse(req.body);
  
      if (!result.success) {
        return res.status(400).json({
          success: false,
          errors: result.error.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
          })),
        });
      }
  
      // Sobrescribimos req.body con los datos ya parseados/validados
      req.body = result.data;
      next();
    };
  };
  