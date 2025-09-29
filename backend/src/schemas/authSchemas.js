import { z } from "zod";

// Schema base para email
const emailSchema = z.string()
  .min(1, { message: "El email es obligatorio" })
  .email({ message: "Formato de email inválido" })
  .toLowerCase();

// Schema base para contraseña
const passwordSchema = z.string()
  .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  .max(100, { message: "La contraseña no puede exceder 100 caracteres" });

// Schema para registro
export const registerSchema = z.object({
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" })
    .trim(),
  email: emailSchema,
  password: passwordSchema,
});

// Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(1, { message: "La contraseña es obligatoria" }),
});

// Schema para actualizar perfil
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" })
    .trim()
    .optional(),
  email: emailSchema.optional(),
});

