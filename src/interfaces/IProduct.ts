// src/interfaces/IProduct.ts (Verificación)

import { Document } from 'mongoose'; 

export interface IProduct {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}

// 💡 Debe extender Document (o lo que uses para Mongoose)
export interface IProductDocument extends IProduct, Document {
    // Aquí puedes añadir campos como createdAt, updatedAt si no están en Document
}