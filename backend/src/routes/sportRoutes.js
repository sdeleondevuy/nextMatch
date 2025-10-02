import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /sports - Obtener todos los deportes disponibles
router.get("/", async (req, res) => {
  try {
    const sports = await prisma.sport.findMany({
      orderBy: { name: 'asc' }
    });

    return successResponse(res, { sports }, "Deportes obtenidos exitosamente");
  } catch (error) {
    console.error("Error obteniendo deportes:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// GET /sports/user - Obtener deportes del usuario autenticado
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userSports = await prisma.userSport.findMany({
      where: { userId },
      include: {
        sport: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const sports = userSports.map(us => us.sport);

    return successResponse(res, { sports }, "Deportes del usuario obtenidos exitosamente");
  } catch (error) {
    console.error("Error obteniendo deportes del usuario:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// POST /sports/user - Agregar deporte al usuario autenticado
router.post("/user", authenticateToken, async (req, res) => {
  try {
    const { sportId } = req.body;

    if (!sportId) {
      return errorResponse(res, "sportId es requerido", 400);
    }

    const userId = req.user.userId;

    // Verificar que el deporte existe
    const sport = await prisma.sport.findUnique({
      where: { id: sportId }
    });

    if (!sport) {
      return errorResponse(res, "Deporte no encontrado", 404);
    }

    // Verificar que el usuario no tenga ya este deporte
    const existingUserSport = await prisma.userSport.findUnique({
      where: {
        userId_sportId: {
          userId: userId,
          sportId: sportId
        }
      }
    });

    if (existingUserSport) {
      return errorResponse(res, "El usuario ya tiene este deporte", 400);
    }

    // Agregar el deporte al usuario
    const userSport = await prisma.userSport.create({
      data: {
        userId: userId,
        sportId: sportId
      },
      include: {
        sport: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return successResponse(res, { sport: userSport.sport }, "Deporte agregado exitosamente");
  } catch (error) {
    console.error("Error agregando deporte al usuario:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// DELETE /sports/user/:sportId - Eliminar deporte del usuario autenticado
router.delete("/user/:sportId", authenticateToken, async (req, res) => {
  try {
    const { sportId } = req.params;
    const userId = req.user.userId;

    // Buscar la relación usuario-deporte
    const userSport = await prisma.userSport.findUnique({
      where: {
        userId_sportId: {
          userId: userId,
          sportId: sportId
        }
      },
      include: {
        sport: {
          select: {
            name: true
          }
        }
      }
    });

    if (!userSport) {
      return errorResponse(res, "El usuario no tiene este deporte", 404);
    }

    // Eliminar la relación
    await prisma.userSport.delete({
      where: {
        userId_sportId: {
          userId: userId,
          sportId: sportId
        }
      }
    });

    return successResponse(res, { sportName: userSport.sport.name }, "Deporte eliminado exitosamente");
  } catch (error) {
    console.error("Error eliminando deporte del usuario:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// PUT /sports/user - Actualizar deportes del usuario (reemplazar todos)
router.put("/user", authenticateToken, async (req, res) => {
  try {
    const { sportIds } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(sportIds)) {
      return errorResponse(res, "sportIds debe ser un array", 400);
    }

    // Verificar que todos los deportes existen
    const sports = await prisma.sport.findMany({
      where: {
        id: {
          in: sportIds
        }
      }
    });

    if (sports.length !== sportIds.length) {
      return errorResponse(res, "Uno o más deportes no existen", 400);
    }

    // Eliminar todos los deportes actuales del usuario
    await prisma.userSport.deleteMany({
      where: {
        userId: userId
      }
    });

    // Agregar los nuevos deportes
    if (sportIds.length > 0) {
      await prisma.userSport.createMany({
        data: sportIds.map(sportId => ({
          userId: userId,
          sportId: sportId
        }))
      });
    }

    // Obtener los deportes actualizados del usuario
    const updatedUserSports = await prisma.userSport.findMany({
      where: { userId },
      include: {
        sport: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const userSports = updatedUserSports.map(us => us.sport);

    return successResponse(res, { sports: userSports }, "Deportes actualizados exitosamente");
  } catch (error) {
    console.error("Error actualizando deportes del usuario:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

export default router;
