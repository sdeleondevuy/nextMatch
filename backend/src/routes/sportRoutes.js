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
    // Obtener el UUID del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { uuid: true }
    });

    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    const userUuid = user.uuid;

    const userSports = await prisma.userSport.findMany({
      where: { userUuid },
      include: {
        sport: {
          select: {
            uuid: true,
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
    const { sportUuid } = req.body;

    if (!sportUuid) {
      return errorResponse(res, "sportUuid es requerido", 400);
    }

    // Obtener el UUID del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { uuid: true }
    });

    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    const userUuid = user.uuid;

    // Verificar que el deporte existe
    const sport = await prisma.sport.findUnique({
      where: { uuid: sportUuid }
    });

    if (!sport) {
      return errorResponse(res, "Deporte no encontrado", 404);
    }

    // Verificar que el usuario no tenga ya este deporte
    const existingUserSport = await prisma.userSport.findUnique({
      where: {
        userUuid_sportUuid: {
          userUuid: userUuid,
          sportUuid: sportUuid
        }
      }
    });

    if (existingUserSport) {
      return errorResponse(res, "El usuario ya tiene este deporte", 400);
    }

    // Agregar el deporte al usuario
    const userSport = await prisma.userSport.create({
      data: {
        userUuid: userUuid,
        sportUuid: sportUuid
      },
      include: {
        sport: {
          select: {
            uuid: true,
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

// DELETE /sports/user/:sportUuid - Eliminar deporte del usuario autenticado
router.delete("/user/:sportUuid", authenticateToken, async (req, res) => {
  try {
    const { sportUuid } = req.params;

    // Obtener el UUID del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { uuid: true }
    });

    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    const userUuid = user.uuid;

    // Buscar la relación usuario-deporte
    const userSport = await prisma.userSport.findUnique({
      where: {
        userUuid_sportUuid: {
          userUuid: userUuid,
          sportUuid: sportUuid
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
        userUuid_sportUuid: {
          userUuid: userUuid,
          sportUuid: sportUuid
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
    const { sportUuids } = req.body;
    
    // Obtener el UUID del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { uuid: true }
    });

    if (!user) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }

    const userUuid = user.uuid;

    if (!Array.isArray(sportUuids)) {
      return errorResponse(res, "sportUuids debe ser un array", 400);
    }

    // Verificar que todos los deportes existen
    const sports = await prisma.sport.findMany({
      where: {
        uuid: {
          in: sportUuids
        }
      }
    });

    if (sports.length !== sportUuids.length) {
      return errorResponse(res, "Uno o más deportes no existen", 400);
    }

    // Eliminar todos los deportes actuales del usuario
    await prisma.userSport.deleteMany({
      where: {
        userUuid: userUuid
      }
    });

    // Agregar los nuevos deportes
    if (sportUuids.length > 0) {
      await prisma.userSport.createMany({
        data: sportUuids.map(sportUuid => ({
          userUuid: userUuid,
          sportUuid: sportUuid
        }))
      });
    }

    return successResponse(res, { sportUuids }, "Deportes actualizados exitosamente");
  } catch (error) {
    console.error("Error actualizando deportes del usuario:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

export default router;
