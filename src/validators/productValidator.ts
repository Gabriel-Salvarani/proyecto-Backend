// src/validators/productValidator.ts

import { z } from 'zod';

// Esquema para la creación de un nuevo producto (POST /api/products)
export const createProductSchema = z.object({
    // name debe ser un string no vacío
    name: z.string().min(1, "El nombre del producto es obligatorio."),
    // description debe ser un string con un mínimo de 10 caracteres
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
    // price debe ser un número positivo (mayor o igual a 0)
    price: z.number().min(0, "El precio debe ser un número positivo.").max(1000000, "Precio máximo excedido."),
    // stock debe ser un número entero positivo
    stock: z.number().int().min(0, "El stock no puede ser negativo."),
    // category debe ser un string no vacío
    category: z.string().min(1, "La categoría es obligatoria.")
});

// Esquema para la actualización de un producto (PATCH /api/products/:id)
// Partial hace que todos los campos sean opcionales, pero si se envían, deben ser válidos.
export const updateProductSchema = createProductSchema.partial();