import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Genera un token JWT
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica un token JWT
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Extrae el token del header Authorization
 */
export const extractToken = (req) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return token;
};
