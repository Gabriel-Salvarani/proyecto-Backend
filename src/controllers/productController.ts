// src/controllers/product.controller.ts

import { Request, Response } from "express";
import { Types } from "mongoose"; 
import * as productService from "../services/productServices"; 
// 💡 Corrección de importación: Ya no es con llaves (AuthMiddleware.ts usa export default)
import { AuthenticatedRequest } from "../middlewares/authMiddleware"; 
// 💡 Corrección de importación: Usamos importación con nombre
import { IProduct } from '../interfaces/IProduct'; 
import { createProductSchema } from "../validators/productValidator";


// -----------------------------------------------------------
// 1. GET: Listar Productos (Maneja Query Params)
// -----------------------------------------------------------
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Pasa req.query directamente al servicio, donde se construye el filtro de DB
        const products = await productService.getAllProducts(req.query); 
        
        res.status(200).json({ success: true, data: products });
    } catch (e) {
        const error = e as Error;
        res.status(500).json({ success: false, error: error.message });
    }
};

// -----------------------------------------------------------
// 2. GET: Obtener Producto por ID
// -----------------------------------------------------------
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: "ID Inválido" });
            return;
        }

        const product = await productService.getProductById(id);

        if (!product) {
            res.status(404).json({ success: false, error: "Producto no encontrado" });
            return;
        }

        res.status(200).json({ success: true, data: product });
    } catch (e) {
        const error = e as Error;
        res.status(500).json({ success: false, error: error.message });
    }
};

// -----------------------------------------------------------
// 3. POST: Crear Producto (Ruta Protegida)
// -----------------------------------------------------------
// 💡 CORRECCIÓN: Usamos AuthenticatedRequest para el tipado del request
export const addProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const validation = createProductSchema.safeParse(req.body);

        if (!validation.success) {
            // ❌ Si falla, devolvemos 400 Bad Request con los errores
            res.status(400).json({ 
                success: false, 
                message: "Error de validación de inputs.",
                errors: validation.error.issues // 'issues' contiene detalles de qué campo falló
            });
            return;
        }

        // ✅ Si tiene éxito, usamos 'validation.data' que está tipado y limpio
        const newProduct = await productService.createProduct(validation.data as IProduct);

        res.status(201).json({ success: true, data: newProduct });
    } catch (e) {
        const error = e as Error;
        // Si el error es de la DB (ej. valores negativos o un campo que Mongoose valida)
        res.status(500).json({ success: false, error: 'Error al crear producto: ' + error.message });
    }
};

// -----------------------------------------------------------
// 4. PUT/PATCH: Actualizar Producto (Ruta Protegida)
// ----------------------------------------------------------
// src/controllers/product.controller.ts (Fragmento de updateProduct)

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { price, stock } = req.body;
        
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: "ID Inválido" });
            return;
        }
        
        // 💡 VALIDACIÓN MANUAL (Requerimiento 7)
        if ((price !== undefined && typeof price !== 'number') || (stock !== undefined && typeof stock !== 'number')) {
             res.status(400).json({ 
                success: false, 
                message: "El precio y el stock deben ser valores numéricos si son enviados." 
            });
            return;
        }

        // Llamada al Servicio con los datos de actualización
        const updatedProduct = await productService.updateProduct(id, req.body as Partial<IProduct>);

        if (!updatedProduct) {
            res.status(404).json({ success: false, error: "Producto no encontrado" });
            return;
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (e) {
        const error = e as Error; 
        
        // 2. Registramos el error en la consola del servidor (terminal)
        console.error("Error al procesar la solicitud:", error.message);

        // 3. Devolvemos una respuesta 500 al cliente
        res.status(500).json({ 
            success: false, 
            error: 'Error interno de configuración del servidor.', // Mensaje genérico para el cliente
            details: error.message // Opcional: Para desarrollo, dar más detalles
        });
    }
}

// -----------------------------------------------------------
// 5. DELETE: Eliminar Producto (Ruta Protegida)
// -----------------------------------------------------------
// 💡 CORRECCIÓN: Usamos AuthenticatedRequest para el tipado del request
export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "ID Inválido" });
            return;
        }

        const deletedProduct = await productService.deleteProduct(id);

        if (!deletedProduct) {
            res.status(404).json({ success: false, error: "Producto no encontrado" });
            return;
        }

        res.status(200).json({ success: true, data: deletedProduct });
    } catch (e) {
        const error = e as Error;
        res.status(500).json({ error: error.message });
    }
};

// 💡 Exportamos las funciones individualmente para el router
export const updateProductById = updateProduct;
export const deleteProductById = deleteProduct;
export const addProductController = addProduct;