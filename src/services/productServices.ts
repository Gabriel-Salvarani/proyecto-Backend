// src/services/product.service.ts

import ProductModel from '../models/ProductModel'
// 💡 Importamos ambas interfaces para tipar correctamente los datos y los documentos de Mongoose
import { IProduct, IProductDocument } from '../interfaces/IProduct';

// -----------------------------------------------------------
// INTERFACES DE CONSULTA (Para el Requerimiento 6: Query Params)
// -----------------------------------------------------------

interface IProductQuery {
    category?: string
    price?: { $gte?: number; $lte?: number }
    name?: { $regex: string; $options: string }
}

// -----------------------------------------------------------
// 1. GET: Listar Productos (Incluye Query Params - Requerimiento 6)
// -----------------------------------------------------------

// 💡 CORRECCIÓN CLAVE: El retorno ahora es Promise<IProductDocument[]>
export const getAllProducts = async (filters: any = {}): Promise<IProductDocument[]> => {
    
    const dbQuery: IProductQuery = {}

    // Filtrar por CATEGORÍA
    if (filters.category) {
        dbQuery.category = filters.category
    }

    // Filtrar por PRECIO MÍNIMO y MÁXIMO
    if (filters.minPrice || filters.maxPrice) {
        dbQuery.price = {}
        if (filters.minPrice) {
            dbQuery.price.$gte = Number(filters.minPrice)
        }
        if (filters.maxPrice) {
            dbQuery.price.$lte = Number(filters.maxPrice)
        }
    }

    // Filtrar por NOMBRE (búsqueda parcial)
    if (filters.name) {
        dbQuery.name = { $regex: filters.name, $options: 'i' }
    }

    try {
        // Ejecutar la consulta con los filtros construidos
        // 💡 El resultado de find() se tipa como el documento completo de Mongoose
        const products: IProductDocument[] = await ProductModel.find(dbQuery)
        return products
    } catch (error) {
        console.error("Error al obtener productos de la DB:", error)
        throw new Error('No se pudo recuperar la lista de productos con los filtros especificados.')
    }
};

// -----------------------------------------------------------
// 2. GET: Obtener Producto por ID
// -----------------------------------------------------------

// 💡 CORRECCIÓN: El retorno ahora es Promise<IProductDocument | null>
export const getProductById = async (id: string): Promise<IProductDocument | null> => {
    try {
        const product = await ProductModel.findById(id)
        return product
    } catch (error) {
        console.error("Error al obtener producto por ID:", error)
        throw new Error('No se pudo recuperar el producto.')
    }
}

// -----------------------------------------------------------
// 3. POST: Crear Producto
// -----------------------------------------------------------

// 💡 CORRECCIÓN: El retorno ahora es Promise<IProductDocument>
export const createProduct = async (data: IProduct): Promise<IProductDocument> => {
    try {
        const product = new ProductModel(data)
        await product.save()
        return product
    } catch (error) {
        console.error("Error al crear producto en la DB:", error)
        throw new Error('No se pudo guardar el nuevo producto.')
    }
};

// -----------------------------------------------------------
// 4. PUT/PATCH: Actualizar Producto
// -----------------------------------------------------------

// 💡 CORRECCIÓN: El retorno ahora es Promise<IProductDocument | null>
export const updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProductDocument | null> => {
    try {
        const product = await ProductModel.findByIdAndUpdate(id, data, { new: true })
        return product
    } catch (error) {
        console.error("Error al actualizar producto en la DB:", error)
        throw new Error('No se pudo actualizar el producto.')
    }
};

// -----------------------------------------------------------
// 5. DELETE: Eliminar Producto
// -----------------------------------------------------------

// 💡 CORRECCIÓN: El retorno ahora es Promise<IProductDocument | null>
export const deleteProduct = async (id: string): Promise<IProductDocument | null> => {
    try {
        const product = await ProductModel.findByIdAndDelete(id)
        return product
    } catch (error) {
        console.error("Error al eliminar producto de la DB:", error)
        throw new Error('No se pudo eliminar el producto.')
    }
}