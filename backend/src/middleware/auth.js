import { verifyToken, extractToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';

const authenticateToken = (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return errorResponse(res, 'Token de acceso requerido', 401);
    }

    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Token inválido o expirado', 403);
  }
};

export default authenticateToken;
