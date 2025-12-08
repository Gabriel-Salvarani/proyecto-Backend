// src/services/userService.ts

import UserModel from '../models/UserModel';
import { IUser, IUserDocument } from '../interfaces/IUser';

// -----------------------------------------------------------
// 1. Crear Usuario
// -----------------------------------------------------------

export const createUser = async (userData: IUser): Promise<IUserDocument> => {
    try {
        const newUser = new UserModel(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw new Error('No se pudo guardar el nuevo usuario.');
    }
};

// -----------------------------------------------------------
// 2. Buscar Usuario por Email (Necesario para login y registro)
// -----------------------------------------------------------

export const findUserByEmail = async (email: string): Promise<IUserDocument | null> => {
    try {
        // Seleccionamos la contraseña para poder compararla en el controlador de login
        const user = await UserModel.findOne({ email }).select('+password');
        return user;
    } catch (error) {
        console.error("Error al buscar usuario por email:", error);
        throw new Error('Error de base de datos al buscar usuario.');
    }
};

// -----------------------------------------------------------
// 3. Buscar Usuario por ID (Necesario para authMiddleware)
// -----------------------------------------------------------

export const findUserById = async (id: string): Promise<IUserDocument | null> => {
    try {
        // No seleccionamos la contraseña aquí, ya que es para uso interno
        const user = await UserModel.findById(id);
        return user;
    } catch (error) {
        console.error("Error al buscar usuario por ID:", error);
        throw new Error('Error de base de datos al buscar usuario por ID.');
    }
};