import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import prisma from '../prismaClient.js';

const router = express.Router();

// Ruta protegida - solo accesible con JWT válido
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error en /profile:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
