import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prismaClient.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../schemas/AuthSchemas.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { generateToken } from "../utils/jwt.js";
import authenticateToken from "../middleware/auth.js";

const router = Router();

// POST /auth/register
router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { name, lastName, legalId, username, email, birthDate, password } = req.body;

    // Verificar si el usuario ya existe por email, username o cédula
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username },
          { legalId: legalId }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return errorResponse(res, "El email ya está registrado", 400);
      }
      if (existingUser.username === username) {
        return errorResponse(res, "El username ya está en uso", 400);
      }
      if (existingUser.legalId === legalId) {
        return errorResponse(res, "La cédula ya está registrada", 400);
      }
    }

    // Calcular edad
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate()) 
      ? age - 1 
      : age;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: { 
        name: name.trim(),
        lastName: lastName.trim(),
        legalId: legalId.trim(),
        username: username.trim(),
        email: email.toLowerCase(),
        birthDate: birthDateObj,
        age: finalAge,
        password: hashedPassword 
      },
    });

    // Respuesta exitosa (sin contraseña)
    const userResponse = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      legalId: user.legalId,
      username: user.username,
      email: user.email,
      birthDate: user.birthDate,
      age: user.age,
      createdAt: user.createdAt
    };

    return successResponse(res, userResponse, "Usuario registrado exitosamente", 201);
  } catch (error) {
    console.error("Error en registro:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// POST /auth/login
router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario con sus deportes
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() },
      include: {
        userSports: {
          include: {
            sport: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return errorResponse(res, "Credenciales inválidas", 401);
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return errorResponse(res, "Credenciales inválidas", 401);
    }

    // Generar token JWT
    const token = generateToken({ 
      userId: user.id,
      email: user.email 
    });

    // Validar estado del usuario
    const hasSports = user.userSports && user.userSports.length > 0;
    const hasInitPoints = user.initPoints !== null && user.initPoints !== undefined;

    // Determinar el estado y la próxima acción
    let status = "complete";
    let nextAction = "/profile";
    let message = "Login exitoso";

    if (!hasSports) {
      status = "missing_sports";
      nextAction = "/selectSports";
      message = "Usuario necesita seleccionar al menos un deporte";
    } else if (!hasInitPoints) {
      status = "missing_initpoints";
      nextAction = "/initpoints";
      message = "Usuario necesita configurar puntos iniciales";
    }

    // Respuesta exitosa
    const userResponse = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      legalId: user.legalId,
      username: user.username,
      email: user.email,
      birthDate: user.birthDate,
      age: user.age,
      initPoints: user.initPoints
    };

    const sports = user.userSports.map(us => ({
      id: us.sport.id,
      name: us.sport.name
    }));

    return successResponse(res, {
      user: userResponse,
      sports,
      token,
      validation: {
        status,
        nextAction,
        message,
        hasSports,
        hasInitPoints
      }
    }, message);
  } catch (error) {
    console.error("Error en login:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// GET /auth/me - Obtener perfil del usuario autenticado
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        legalId: true,
        username: true,
        email: true,
        birthDate: true,
        age: true,
        createdAt: true
      }
    });

    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    return successResponse(res, user, "Perfil obtenido exitosamente");
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// PUT /auth/profile - Actualizar perfil del usuario
router.put("/profile", authenticateToken, validate(updateProfileSchema), async (req, res) => {
  try {
    const { name, lastName, username, email, birthDate } = req.body;
    const userId = req.user.userId;

    // Verificar si el email ya existe (si se está actualizando)
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { 
          email: email.toLowerCase(),
          id: { not: userId }
        }
      });
      
      if (existingUser) {
        return errorResponse(res, "El email ya está en uso", 400);
      }
    }

    // Verificar si el username ya existe (si se está actualizando)
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: { 
          username: username,
          id: { not: userId }
        }
      });
      
      if (existingUser) {
        return errorResponse(res, "El username ya está en uso", 400);
      }
    }

    // Actualizar usuario
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (username) updateData.username = username.trim();
    if (email) updateData.email = email.toLowerCase();
    
    // Si se actualiza la fecha de nacimiento, recalcular la edad
    if (birthDate) {
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate()) 
        ? age - 1 
        : age;
      
      updateData.birthDate = birthDateObj;
      updateData.age = finalAge;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        lastName: true,
        legalId: true,
        username: true,
        email: true,
        birthDate: true,
        age: true,
        createdAt: true
      }
    });

    return successResponse(res, user, "Perfil actualizado exitosamente");
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// PUT /auth/initpoints - Configurar puntos iniciales del usuario
router.put("/initpoints", authenticateToken, async (req, res) => {
  try {
    const { initPoints } = req.body;
    const userId = req.user.userId;

    // Validar que initPoints sea un número positivo
    if (!initPoints || typeof initPoints !== 'number' || initPoints <= 0) {
      return errorResponse(res, "Los puntos iniciales deben ser un número positivo", 400);
    }

    // Actualizar usuario con initPoints
    const user = await prisma.user.update({
      where: { id: userId },
      data: { initPoints },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        email: true,
        initPoints: true,
        createdAt: true
      }
    });

    return successResponse(res, user, "Puntos iniciales configurados exitosamente");
  } catch (error) {
    console.error("Error configurando puntos iniciales:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// GET /auth/validate - Validar estado del usuario (deportes e initPoints)
router.get("/validate", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Obtener usuario con sus deportes
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        email: true,
        initPoints: true,
        userSports: {
          include: {
            sport: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    // Validar si tiene deportes seleccionados
    const hasSports = user.userSports && user.userSports.length > 0;
    
    // Validar si tiene initPoints cargados
    const hasInitPoints = user.initPoints !== null && user.initPoints !== undefined;

    // Determinar el estado y la próxima acción
    let status = "complete";
    let nextAction = null;
    let message = "Usuario completamente configurado";

    if (!hasSports) {
      status = "missing_sports";
      nextAction = "/selectSports";
      message = "Usuario necesita seleccionar al menos un deporte";
    } else if (!hasInitPoints) {
      status = "missing_initpoints";
      nextAction = "/initpoints";
      message = "Usuario necesita configurar puntos iniciales";
    }

    const validationResponse = {
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        initPoints: user.initPoints
      },
      sports: user.userSports.map(us => ({
        id: us.sport.id,
        name: us.sport.name
      })),
      validation: {
        status,
        nextAction,
        message,
        hasSports,
        hasInitPoints
      }
    };

    return successResponse(res, validationResponse, message);
  } catch (error) {
    console.error("Error validando usuario:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// GET /auth/internal/uuid/:uuid - Obtener usuario por UUID (uso interno)
router.get("/internal/uuid/:uuid", authenticateToken, async (req, res) => {
  try {
    const { uuid } = req.params;

    const user = await prisma.user.findUnique({ 
      where: { id: uuid },
      select: {
        id: true,
        name: true,
        lastName: true,
        legalId: true,
        username: true,
        email: true,
        birthDate: true,
        age: true,
        createdAt: true
      }
    });

    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    return successResponse(res, user, "Usuario obtenido exitosamente");
  } catch (error) {
    console.error("Error obteniendo usuario por UUID:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

export default router;
