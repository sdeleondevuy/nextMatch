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
  lastName: z.string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede exceder 50 caracteres" })
    .trim(),
  legalId: z.string()
    .min(7, { message: "La cédula debe tener al menos 7 caracteres" })
    .max(10, { message: "La cédula no puede exceder 10 caracteres" })
    .regex(/^[0-9]+$/, { message: "La cédula debe contener solo números" })
    .trim(),
  username: z.string()
    .min(3, { message: "El username debe tener al menos 3 caracteres" })
    .max(20, { message: "El username no puede exceder 20 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "El username solo puede contener letras, números y guiones bajos" })
    .trim(),
  email: emailSchema,
  birthDate: z.string()
    .min(1, { message: "La fecha de nacimiento es obligatoria" })
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, { message: "Debes tener entre 13 y 120 años" }),
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
  lastName: z.string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede exceder 50 caracteres" })
    .trim()
    .optional(),
  username: z.string()
    .min(3, { message: "El username debe tener al menos 3 caracteres" })
    .max(20, { message: "El username no puede exceder 20 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "El username solo puede contener letras, números y guiones bajos" })
    .trim()
    .optional(),
  email: emailSchema.optional(),
  birthDate: z.string()
    .min(1, { message: "La fecha de nacimiento es obligatoria" })
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, { message: "Debes tener entre 13 y 120 años" })
    .optional(),
});

