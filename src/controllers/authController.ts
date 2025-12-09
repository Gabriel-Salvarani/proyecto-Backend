// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

// ⚠️ ASUMIMOS que estos servicios y validadores existen
import * as userService from '../services/userServices'; 
import { registerSchema, loginSchema } from "../validators/authValidator"; // Incluimos loginSchema

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET; 

if (!SECRET_KEY) {
    console.error("❌ ERROR CRÍTICO: JWT_SECRET no está definido. Deteniendo el servidor.");
    process.exit(1); 
}

// -----------------------------------------------------------
// 1. POST: Registrar Nuevo Usuario (Requiere Rate Limit)
// -----------------------------------------------------------

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // 💡 LÓGICA DE VALIDACIÓN MOVIDA DENTRO DE LA FUNCIÓN
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ 
                success: false, 
                message: "Error en los datos de registro.",
                errors: validation.error.issues // 'issues' es el campo correcto de Zod
            });
            return;
        }

        // ✅ Usamos los datos limpios y validados
        const { email, password } = validation.data;
        
        // 1. Verificar si el usuario ya existe
        const existingUser = await userService.findUserByEmail(email); 
        if (existingUser) {
            res.status(409).json({ message: 'El usuario ya está registrado.' });
            return;
        }

        // 2. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); 

        // 3. Crear el nuevo usuario
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
        // 💡 AGREGAMOS VALIDACIÓN AL LOGIN
        const validation = loginSchema.safeParse(req.body);
        
        if (!validation.success) {
            res.status(400).json({ 
                success: false, 
                message: "Error en los datos de login.",
                errors: validation.error.issues
            });
            return;
        }
        
        const { email, password } = validation.data; // Usamos datos validados
        
        // 1. Buscar el usuario en la DB
        const user = await userService.findUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas.' });
            return;
        }

        // 2. Comparar la contraseña hasheada
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            res.status(401).json({ message: 'Credenciales inválidas.' });
            return;
        }
        
        // 3. Generar el JWT
        const token = jwt.sign(
            { userId: user._id.toString(), email: email }, 
            SECRET_KEY, // ✅ SECRET_KEY es seguro porque ya fue validado arriba.
            { expiresIn: '1h' } 
        );

        res.status(200).json({ success: true, token });

    } catch (e) {
        const error = e as Error;
        res.status(500).json({ success: false, error: 'Error al iniciar sesión: ' + error.message });
    }
};