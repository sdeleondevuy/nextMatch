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
    console.log("🟢 [BACKEND] Iniciando proceso de login para:", email);

    // Buscar usuario con sus deportes y puntos
    console.log("🟢 [BACKEND] Buscando usuario en la base de datos...");
    const user = await prisma.user.findUnique({ 
      where: { 
        email: email.toLowerCase(),
        enabled: true
      },
      include: {
        userSports: {
          where: { enabled: true },
          include: {
            sport: {
              select: {
                id: true,
                name: true
              }
            },
            userPoints: {
              where: { enabled: true },
              select: {
                initPoints: true,
                actualPoints: true
              }
            }
          }
        }
      }
    });
    
    console.log("🟢 [BACKEND] Usuario encontrado:", user ? "SÍ" : "NO");
    if (!user) {
      console.log("🟢 [BACKEND] Usuario no encontrado, devolviendo error 401");
      return errorResponse(res, "Credenciales inválidas", 401);
    }

    // Verificar contraseña
    console.log("🟢 [BACKEND] Verificando contraseña...");
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("🟢 [BACKEND] Contraseña válida:", validPassword ? "SÍ" : "NO");
    if (!validPassword) {
      console.log("🟢 [BACKEND] Contraseña inválida, devolviendo error 401");
      return errorResponse(res, "Credenciales inválidas", 401);
    }

    // Generar token JWT
    console.log("🟢 [BACKEND] Generando token JWT...");
    const token = generateToken({ 
      userId: user.id,
      email: user.email 
    });
    console.log("🟢 [BACKEND] Token generado:", token.substring(0, 20) + "...");

    // Validar estado del usuario
    console.log("🟢 [BACKEND] Validando estado del usuario...");
    console.log("🟢 [BACKEND] UserSports encontrados:", user.userSports?.length || 0);
    const hasSports = user.userSports && user.userSports.length > 0;
    console.log("🟢 [BACKEND] Usuario tiene deportes:", hasSports);
    
    // La validación debe verificar que cada userSport tenga userPoints
    // userPoints viene como un array de objetos desde Prisma
    console.log("🟢 [BACKEND] Verificando puntos iniciales...");
    const hasAllInitPoints = hasSports && user.userSports.every(us => {
      const hasPoints = us.userPoints && (
        (Array.isArray(us.userPoints) && us.userPoints.length > 0) ||
        (typeof us.userPoints === 'object' && us.userPoints.initPoints !== undefined)
      );
      return hasPoints;
    });
    console.log("🟢 [BACKEND] Todos los deportes tienen puntos:", hasAllInitPoints);
    
    // Contar deportes con puntos configurados
    console.log("🟢 [BACKEND] === DEBUGGING SPORTS WITH POINTS ===");
    console.log("🟢 [BACKEND] Total userSports:", user.userSports.length);
    
    user.userSports.forEach((us, index) => {
      console.log(`🟢 [BACKEND] Deporte ${index + 1}:`, {
        sportName: us.sport.name,
        userPoints: us.userPoints,
        userPointsType: typeof us.userPoints,
        userPointsIsArray: Array.isArray(us.userPoints),
        userPointsLength: us.userPoints ? us.userPoints.length : 'N/A'
      });
    });
    
    const sportsWithPoints = hasSports ? user.userSports.filter(us => {
      // Verificar si userPoints existe y tiene datos
      const hasPoints = us.userPoints && (
        (Array.isArray(us.userPoints) && us.userPoints.length > 0) ||
        (typeof us.userPoints === 'object' && us.userPoints.initPoints !== undefined)
      );
      console.log(`🟢 [BACKEND] ${us.sport.name} tiene puntos:`, hasPoints);
      console.log(`🟢 [BACKEND] ${us.sport.name} userPoints detalle:`, us.userPoints);
      return hasPoints;
    }) : [];
    
    const hasSomeSportsWithPoints = sportsWithPoints.length > 0;
    console.log("🟢 [BACKEND] Algunos deportes tienen puntos:", hasSomeSportsWithPoints);
    console.log("🟢 [BACKEND] Deportes con puntos:", sportsWithPoints.length);
    console.log("🟢 [BACKEND] === FIN DEBUGGING ===");

    // Determinar el estado y la próxima acción
    console.log("🟢 [BACKEND] Determinando estado del usuario...");
    let status = "complete";
    let nextAction = "/profile";
    let message = "Login exitoso";

    if (!hasSports) {
      status = "missing_sports";
      nextAction = "/selectSports";
      message = "Usuario necesita seleccionar al menos un deporte";
      console.log("🟢 [BACKEND] → Estado: missing_sports (sin deportes)");
    } else if (!hasAllInitPoints && !hasSomeSportsWithPoints) {
      status = "missing_initpoints";
      nextAction = "/initpoints";
      message = "Usuario necesita configurar puntos iniciales para todos sus deportes";
      console.log("🟢 [BACKEND] → Estado: missing_initpoints (sin puntos)");
    } else if (!hasAllInitPoints && hasSomeSportsWithPoints) {
      status = "partial_config";
      nextAction = "/selectSport";
      message = "Usuario tiene algunos deportes configurados. Puede jugar o configurar más deportes";
      console.log("🟢 [BACKEND] → Estado: partial_config (algunos puntos)");
    } else if (hasAllInitPoints) {
      status = "complete";
      nextAction = "/selectSport";
      message = "Usuario completamente configurado. Selecciona un deporte para jugar";
      console.log("🟢 [BACKEND] → Estado: complete (todo configurado)");
    }
    
    console.log("🟢 [BACKEND] Estado final:", status);
    console.log("🟢 [BACKEND] Próxima acción:", nextAction);

    // Respuesta exitosa
    const userResponse = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      legalId: user.legalId,
      username: user.username,
      email: user.email,
      birthDate: user.birthDate,
      age: user.age
    };

    const userSports = user.userSports.map(us => ({
      id: us.id, // UserSport ID
      sport: {
        id: us.sport.id,
        name: us.sport.name
      },
      userPoints: us.userPoints ? [us.userPoints] : []
    }));

    console.log("🟢 [BACKEND] Enviando respuesta exitosa...");
    const responseData = {
      user: userResponse,
      userSports,
      token,
      validation: {
        status,
        nextAction,
        message,
        hasSports,
        hasAllInitPoints,
        hasSomeSportsWithPoints,
        sportsWithPointsCount: sportsWithPoints.length,
        totalSportsCount: hasSports ? user.userSports.length : 0
      }
    };
    console.log("🟢 [BACKEND] Datos de respuesta:", JSON.stringify(responseData, null, 2));
    
    return successResponse(res, responseData, message);
  } catch (error) {
    console.error("Error en login:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// GET /auth/me - Obtener perfil del usuario autenticado
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { 
        id: req.user.userId,
        enabled: true
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        legalId: true,
        username: true,
        email: true,
        birthDate: true,
        age: true,
        createdAt: true,
        userSports: {
          where: { enabled: true },
          include: {
            sport: {
              select: {
                id: true,
                name: true
              }
            },
            userPoints: {
              where: { enabled: true },
              select: {
                initPoints: true,
                actualPoints: true
              }
            }
          }
        }
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
        createdAt: true,
        userSports: {
          include: {
            sport: {
              select: {
                id: true,
                name: true
              }
            },
            userPoints: {
              select: {
                initPoints: true,
                actualPoints: true
              }
            }
          }
        }
      }
    });

    return successResponse(res, user, "Perfil actualizado exitosamente");
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// PUT /auth/initpoints - Configurar puntos iniciales por deporte
router.put("/initpoints", authenticateToken, async (req, res) => {
  try {
    const { sportPoints } = req.body; // Array de { sportId, initPoints }
    const userId = req.user.userId;

    // Validar que sportPoints sea un array
    if (!Array.isArray(sportPoints) || sportPoints.length === 0) {
      return errorResponse(res, "Debes proporcionar puntos para al menos un deporte", 400);
    }

    // Validar que todos los puntos sean válidos
    for (const sportPoint of sportPoints) {
      if (!sportPoint.sportId || !sportPoint.initPoints || 
          typeof sportPoint.initPoints !== 'number' || sportPoint.initPoints <= 0) {
        return errorResponse(res, "Todos los deportes deben tener puntos iniciales válidos", 400);
      }
    }

    // Verificar que el usuario tiene estos deportes
    const userSports = await prisma.userSport.findMany({
      where: { userId },
      include: { sport: true }
    });

    const userSportIds = userSports.map(us => us.id);
    const sportIds = sportPoints.map(sp => sp.sportId);
    
    // Verificar que todos los deportes pertenecen al usuario
    const validUserSports = userSports.filter(us => 
      sportPoints.some(sp => sp.sportId === us.sport.id)
    );

    if (validUserSports.length !== sportPoints.length) {
      return errorResponse(res, "Algunos deportes no pertenecen al usuario", 400);
    }

    // Crear o actualizar UserPoints para cada deporte
    const createdPoints = [];
    
    for (const sportPoint of sportPoints) {
      // Encontrar el userSport correspondiente
      const userSport = validUserSports.find(us => us.sport.id === sportPoint.sportId);
      
      if (userSport) {
        const userPoints = await prisma.userPoints.upsert({
          where: { userSportId: userSport.id },
          update: {
            initPoints: sportPoint.initPoints,
            actualPoints: sportPoint.initPoints // actualPoints se inicializa igual que initPoints
          },
          create: {
            userSportId: userSport.id,
            initPoints: sportPoint.initPoints,
            actualPoints: sportPoint.initPoints
          },
          include: {
            userSport: {
              include: {
                sport: true
              }
            }
          }
        });
        
        createdPoints.push({
          sport: userPoints.userSport.sport,
          points: {
            initPoints: userPoints.initPoints,
            actualPoints: userPoints.actualPoints
          }
        });
      }
    }

    return successResponse(res, {
      sportsWithPoints: createdPoints
    }, "Puntos iniciales configurados exitosamente para todos los deportes");
  } catch (error) {
    console.error("Error configurando puntos iniciales:", error);
    return errorResponse(res, "Error interno del servidor");
  }
});

// GET /auth/validate - Validar estado del usuario (deportes e initPoints)
router.get("/validate", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Obtener usuario con sus deportes y puntos
    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
        enabled: true
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        email: true,
        userSports: {
          where: { enabled: true },
          include: {
            sport: {
              select: {
                id: true,
                name: true
              }
            },
            userPoints: {
              where: { enabled: true },
              select: {
                initPoints: true,
                actualPoints: true
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
    
    // Validar si tiene puntos configurados para todos los deportes
    const hasAllInitPoints = hasSports && user.userSports.every(us => 
      us.userPoints && Array.isArray(us.userPoints) && us.userPoints.length > 0
    );

    // Determinar el estado y la próxima acción
    let status = "complete";
    let nextAction = null;
    let message = "Usuario completamente configurado";

    if (!hasSports) {
      status = "missing_sports";
      nextAction = "/selectSports";
      message = "Usuario necesita seleccionar al menos un deporte";
    } else if (!hasAllInitPoints) {
      status = "missing_initpoints";
      nextAction = "/initpoints";
      message = "Usuario necesita configurar puntos iniciales para todos sus deportes";
    }

    const validationResponse = {
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        username: user.username,
        email: user.email
      },
      userSports: user.userSports.map(us => ({
        id: us.id, // UserSport ID
        sport: {
          id: us.sport.id,
          name: us.sport.name
        },
        userPoints: us.userPoints ? [us.userPoints] : []
      })),
      validation: {
        status,
        nextAction,
        message,
        hasSports,
        hasAllInitPoints
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
      where: { 
        id: uuid,
        enabled: true
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        legalId: true,
        username: true,
        email: true,
        birthDate: true,
        age: true,
        createdAt: true,
        userSports: {
          where: { enabled: true },
          include: {
            sport: {
              select: {
                id: true,
                name: true
              }
            },
            userPoints: {
              where: { enabled: true },
              select: {
                initPoints: true,
                actualPoints: true
              }
            }
          }
        }
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
