// src/interfaces/IUser.ts

import { Document } from 'mongoose';

// 1. Interfaz Base: Define los campos de la aplicación
export interface IUser {
    email: string;
    password?: string; // Es opcional para Mongoose, ya que lo hasheamos antes de guardar
    // Puedes añadir otros campos como name, role, etc.
}

// 2. Interfaz de Documento: Extiende la base con las propiedades de Mongoose
export interface IUserDocument extends IUser, Document {
    // Aquí puedes definir métodos personalizados si es necesario
}