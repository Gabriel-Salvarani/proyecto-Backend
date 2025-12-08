// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// -----------------------------------------------------------
// 1. Interfaz para Request Autenticado
// -----------------------------------------------------------
// Extendemos la interfaz de Request de Express para añadir el campo 'userId'.
// Esto asegura que TypeScript sepa que 'req.userId' existe después de la autenticación.
export interface AuthenticatedRequest extends Request {
    userId?: string; 
}

// -----------------------------------------------------------
// 2. Clave Secreta y Constantes
// -----------------------------------------------------------
// ⚠️ IMPORTANTE: La clave debe cargarse desde las variables de entorno (.env)
const JWT_SECRET = process.env.JWT_SECRET!; 

// -----------------------------------------------------------
// 3. Función Middleware
// -----------------------------------------------------------

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    // 1. Verificar si JWT_SECRET está definido
    if (!JWT_SECRET) {
        console.error("JWT_SECRET no está configurado. Verifique su archivo .env.");
        // Devolvemos 500 para indicar un error de configuración del servidor.
        return res.status(500).json({ message: 'Error interno de configuración del servidor.' }); 
    }
    
    // 2. Obtener el token del encabezado 'Authorization'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Rechazar si no hay token o si el formato es incorrecto
        return res.status(401).json({ message: 'Acceso denegado. Se requiere un token Bearer.' });
    }

    // El token es la segunda parte del string 'Bearer <token>'
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verificar y decodificar el token
        // Usamos JwtPayload para tipar correctamente la carga útil
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // 4. Adjuntar el ID del usuario al objeto request (Authorization)
        // Asumimos que el payload de tu token incluye 'userId'
        if (decoded.userId) {
            req.userId = decoded.userId;
        } else {
            return res.status(401).json({ message: 'Token inválido: Falta la información de usuario.' });
        }
        
        // 5. El token es válido, continuar con la ejecución del controlador
        next();

    } catch (error) {
        // Si jwt.verify falla (token expirado, firma inválida, etc.)
        return res.status(401).json({ message: 'Token de autenticación inválido o expirado.' });
    }
};

export default authMiddleware;