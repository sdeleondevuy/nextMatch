import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

