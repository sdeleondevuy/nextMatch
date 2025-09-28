import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prismaClient.js";
import { validate } from "../middleware/validate.js";
import { registerSchema } from "../schemas/AuthSchemas.js";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
