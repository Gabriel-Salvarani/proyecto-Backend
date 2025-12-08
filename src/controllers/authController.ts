// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
// ⚠️ ASUMIMOS que estos servicios y tipos YA EXISTEN y son correctos.
import * as userService from '../services/userServices'; 
// import { IUserDocument } from '../interfaces/IUser'; 
dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET!; 

if (!SECRET_KEY) {
    // Si la clave no está en el .env, lanzamos un error y detenemos el proceso.
    console.error("❌ ERROR CRÍTICO: JWT_SECRET no está definido. Asegúrate de tenerlo en tu archivo .env.");
    process.exit(1); 
}

// -----------------------------------------------------------
// 1. POST: Registrar Nuevo Usuario (Requiere Rate Limit)
// -----------------------------------------------------------

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        // 1. Verificar si el usuario ya existe (USAMOS 'email' aquí)
        const existingUser = await userService.findUserByEmail(email); 
        if (existingUser) {
            // 💡 'existingUser' ya fue usado al verificar.
            res.status(409).json({ message: 'El usuario ya está registrado.' });
            return;
        }

        // 2. Hashear la contraseña (USAMOS 'password' aquí)
        // 💡 SOLUCIÓN TS6133 'hashedPassword': Lo declaramos y lo usamos en el paso 3.
        const hashedPassword = await bcrypt.hash(password, 10); 

        // 3. Crear el nuevo usuario en la DB
        // 💡 SOLUCIÓN TS6133 'newUser': No declaramos la variable si no la usamos.
        await userService.createUser({ email, password: hashedPassword });
        
        res.status(201).json({ success: true, message: 'Usuario registrado con éxito. Ahora puede iniciar sesión.' });

    } catch (e) {
        const error = e as Error;
        res.status(500).json({ success: false, error: 'Error al registrar usuario: ' + error.message });
    }
};

// -----------------------------------------------------------
// 2. POST: Iniciar Sesión y Emitir JWT (Requiere Rate Limit)
// -----------------------------------------------------------

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Buscar el usuario en la DB (USAMOS 'email' aquí)
        const user = await userService.findUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas.' });
            return;
        }

        // 2. Comparar la contraseña hasheada (USAMOS 'password' y 'user.password' aquí)
        // 💡 'user.password!' resuelve el error de tipado (TS2345).
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            // 💡 'isMatch' es usado en esta condición, resolviendo su TS6133.
            res.status(401).json({ message: 'Credenciales inválidas.' });
            return;
        }
        
        // 3. Generar el JWT
        const token = jwt.sign(
            // 💡 CORRECCIÓN CLAVE: Usamos el ID REAL del usuario.
            { userId: user._id.toString(), email: email }, SECRET_KEY,{ expiresIn: '1h' } );

        res.status(200).json({ success: true, token });

    } catch (e) {
        const error = e as Error;
        res.status(500).json({ success: false, error: 'Error al iniciar sesión: ' + error.message });
    }
};