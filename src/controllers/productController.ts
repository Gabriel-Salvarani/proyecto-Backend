// src/controllers/product.controller.ts

import { Request, Response } from "express";
import { Types } from "mongoose"; 
import * as productService from "../services/productServices"; 
// 💡 Corrección de importación: Ya no es con llaves (AuthMiddleware.ts usa export default)
import { AuthenticatedRequest } from "../middlewares/authMiddleware"; 
// 💡 Corrección de importación: Usamos importación con nombre
import { IProduct } from '../interfaces/IProduct'; 


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
        const { body } = req;
        
        // ❌ VALIDACIÓN ELIMINADA TEMPORALMENTE (Requerimiento 7)
        
        // Llamamos al Servicio con la data, tipada como IProduct
        const newProduct = await productService.createProduct(body as IProduct);

        res.status(201).json({ success: true, data: newProduct });
    } catch (e) {
        const error = e as Error;
        res.status(500).json({ success: false, error: error.message });
    }
};

// -----------------------------------------------------------
// 4. PUT/PATCH: Actualizar Producto (Ruta Protegida)
// -----------------------------------------------------------
// 💡 CORRECCIÓN: Usamos AuthenticatedRequest para el tipado del request
export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { body } = req;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, error: "ID Inválido" });
            return;
        }

        // ❌ VALIDACIÓN ELIMINADA TEMPORALMENTE (Requerimiento 7)

        // Llamada al Servicio con los datos de actualización
        const updatedProduct = await productService.updateProduct(id, body as Partial<IProduct>);

        if (!updatedProduct) {
            res.status(404).json({ success: false, error: "Producto no encontrado" });
            return;
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (e) {
        const error = e as Error;
        res.status(500).json({ success: false, error: error.message });
    }
};

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