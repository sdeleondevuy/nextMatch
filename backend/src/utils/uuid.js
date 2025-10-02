import { prisma } from '../prismaClient.js';

/**
 * Obtiene un usuario por su UUID interno
 * @param {string} uuid - UUID del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const getUserByUuid = async (uuid) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        name: true,
        lastName: true,
        cedula: true,
        username: true,
        email: true,
        birthDate: true,
        age: true,
        department: true,
        createdAt: true
      }
    });
    return user;
  } catch (error) {
    console.error('Error obteniendo usuario por UUID:', error);
    return null;
  }
};

/**
 * Obtiene un usuario por su ID numérico
 * @param {number} id - ID numérico del usuario
 * @returns {Promise<Object|null>} Usuario encontrado o null
 */
export const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        uuid: true,
        name: true,
        lastName: true,
        cedula: true,
        username: true,
        email: true,
        birthDate: true,
        age: true,
        department: true,
        createdAt: true
      }
    });
    return user;
  } catch (error) {
    console.error('Error obteniendo usuario por ID:', error);
    return null;
  }
};

/**
 * Verifica si un UUID existe en la base de datos
 * @param {string} uuid - UUID a verificar
 * @returns {Promise<boolean>} True si existe, false si no
 */
export const uuidExists = async (uuid) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uuid },
      select: { id: true }
    });
    return !!user;
  } catch (error) {
    console.error('Error verificando existencia de UUID:', error);
    return false;
  }
};
