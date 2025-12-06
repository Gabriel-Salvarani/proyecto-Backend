// src/routes/auth.routes.ts

import { Router } from 'express';
//import authLimiter from '../middlewares/rateLimiter.ts'; // Middleware de Rate Limit (R4)
// ⚠️ Aquí debes importar tus controladores de usuario/autenticación
// import { registerUser, loginUser } from '../controllers/auth.controller.ts'; 

const authRouter = Router();

// -------------------------------------------------------------------
// RUTAS DE AUTENTICACIÓN (Protegidas por Rate Limit - Requerimiento 4)
// -------------------------------------------------------------------

// POST /api/auth/register
// 💡 Aplicamos el Rate Limit SÓLO a esta ruta para prevenir ataques de fuerza bruta
authRouter.post('/register', (req, res) => {
    // ⚠️ Llama a la función del controlador para registrar al usuario
    res.status(200).json({ message: "Endpoint Register listo para usar." });
});

// POST /api/auth/login
// 💡 Aplicamos el Rate Limit SÓLO a esta ruta para prevenir ataques de fuerza bruta
authRouter.post('/login', (req, res) => {
    // ⚠️ Llama a la función del controlador para iniciar sesión y generar JWT
    res.status(200).json({ message: "Endpoint Login listo para usar." });
});

export default authRouter;