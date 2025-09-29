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
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "El email ya está registrado", 400);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: { 
        name: name.trim(), 
        email: email.toLowerCase(), 
        password: hashedPassword 
      },
    });

    // Respuesta exitosa (sin contraseña)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
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

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
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

    // Respuesta exitosa
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return successResponse(res, {
      user: userResponse,
      token
    }, "Login exitoso");
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
        email: true,
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
    const { name, email } = req.body;
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

    // Actualizar usuario
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase();

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return successResponse(res, user, "Perfil actualizado exitosamente");
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

export default router;
