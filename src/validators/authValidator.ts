// src/validators/authValidator.ts

import { z } from 'zod';

// Esquema base para email y contraseña
const baseAuthSchema = z.object({
    // Email debe ser un string con formato de email válido
    email: z.string().email("El formato del correo electrónico no es válido."),
    // Password debe ser un string con un mínimo de 6 caracteres (según tu modelo)
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.")
});

// Esquema para el registro
export const registerSchema = baseAuthSchema.extend({
    // Puedes añadir campos adicionales específicos para el registro si los necesitas
    // Por ejemplo: name: z.string().min(1),
});

// Esquema para el login (es igual al baseAuthSchema)
export const loginSchema = baseAuthSchema;