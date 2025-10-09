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
      where: { enabled: true },
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
      where: { 
        userId,
        enabled: true
      },
      include: {
        sport: {
          select: {
            id: true,
            name: true
          }
        },
        userPoints: {
          where: { enabled: true }
        }
      }
    });

    const userSportsFormatted = userSports.map(us => ({
      id: us.id, // UserSport ID
      sport: {
        id: us.sport.id,
        name: us.sport.name
      },
      userPoints: us.userPoints ? [us.userPoints] : []
    }));

    return successResponse(res, { userSports: userSportsFormatted }, "Deportes del usuario obtenidos exitosamente");
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

    // Verificar que el deporte existe y está habilitado
    const sport = await prisma.sport.findUnique({
      where: { 
        id: sportId,
        enabled: true
      }
    });

    if (!sport) {
      return errorResponse(res, "Deporte no encontrado o no disponible", 404);
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

// PUT /sports/user - Actualizar deportes del usuario (borrado lógico)
router.put("/user", authenticateToken, async (req, res) => {
  try {
    const { sportIds } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(sportIds)) {
      return errorResponse(res, "sportIds debe ser un array", 400);
    }

    // Verificar que todos los deportes existen y están habilitados
    const sports = await prisma.sport.findMany({
      where: {
        id: {
          in: sportIds
        },
        enabled: true
      }
    });

    if (sports.length !== sportIds.length) {
      return errorResponse(res, "Uno o más deportes no existen o no están disponibles", 400);
    }

    // Obtener deportes actuales del usuario (solo los habilitados)
    const currentUserSports = await prisma.userSport.findMany({
      where: { 
        userId,
        enabled: true  // Solo deportes habilitados
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

    const currentSportIds = currentUserSports.map(us => us.sport.id);
    
    // Identificar deportes a agregar y eliminar
    const sportsToAdd = sportIds.filter(sportId => !currentSportIds.includes(sportId));
    const sportsToRemove = currentSportIds.filter(sportId => !sportIds.includes(sportId));

    // Eliminar deportes (borrado lógico)
    if (sportsToRemove.length > 0) {
      // Deshabilitar UserSport
      await prisma.userSport.updateMany({
        where: {
          userId: userId,
          sportId: {
            in: sportsToRemove
          }
        },
        data: {
          enabled: false
        }
      });
      
      // También deshabilitar UserPoints asociados
      const userSportsToDisable = await prisma.userSport.findMany({
        where: {
          userId: userId,
          sportId: {
            in: sportsToRemove
          }
        },
        select: { id: true }
      });
      
      if (userSportsToDisable.length > 0) {
        await prisma.userPoints.updateMany({
          where: {
            userSportId: {
              in: userSportsToDisable.map(us => us.id)
            }
          },
          data: {
            enabled: false
          }
        });
      }
    }

    // Agregar nuevos deportes
    if (sportsToAdd.length > 0) {
      // Verificar si ya existen registros para reactivarlos o crear nuevos
      for (const sportId of sportsToAdd) {
        // Buscar cualquier registro existente (habilitado o deshabilitado)
        const existingUserSport = await prisma.userSport.findFirst({
          where: {
            userId: userId,
            sportId: sportId
          }
        });

        if (existingUserSport) {
          if (!existingUserSport.enabled) {
            // Reactivar el registro existente
            await prisma.userSport.update({
              where: { id: existingUserSport.id },
              data: { enabled: true }
            });

            // Verificar si existe UserPoints para este UserSport y reactivarlo
            const existingUserPoints = await prisma.userPoints.findFirst({
              where: {
                userSportId: existingUserSport.id
              }
            });

            if (existingUserPoints) {
              if (!existingUserPoints.enabled) {
                // Reactivar UserPoints existente
                await prisma.userPoints.update({
                  where: { id: existingUserPoints.id },
                  data: { enabled: true }
                });
              }
            } else {
              // Si no existe UserPoints, crear uno nuevo
              await prisma.userPoints.create({
                data: {
                  userSportId: existingUserSport.id,
                  initPoints: 0, // Valor inicial vacío
                  actualPoints: 0 // Valor inicial vacío
                }
              });
            }
          }
        } else {
          // Crear nuevo registro
          const newUserSport = await prisma.userSport.create({
            data: {
              userId: userId,
              sportId: sportId
            }
          });

          // Crear registro vacío en UserPoints para que el usuario pueda configurar puntos iniciales
          await prisma.userPoints.create({
            data: {
              userSportId: newUserSport.id,
              initPoints: 0, // Valor inicial vacío
              actualPoints: 0 // Valor inicial vacío
            }
          });
        }
      }
    }

    // Obtener los deportes actualizados del usuario
    const updatedUserSports = await prisma.userSport.findMany({
      where: { 
        userId,
        enabled: true
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


    const userSports = updatedUserSports.map(us => ({
      id: us.id, // UserSport ID
      sport: {
        id: us.sport.id,
        name: us.sport.name
      }
    }));

    return successResponse(res, { userSports }, "Deportes actualizados exitosamente");
  } catch (error) {
    console.error("Error actualizando deportes del usuario:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

export default router;
