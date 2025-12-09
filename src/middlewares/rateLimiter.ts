// src/middlewares/rateLimiter.ts

import rateLimit from 'express-rate-limit';

// Definición del limitador para rutas de autenticación
const authLimiter = rateLimit({
    // La ventana de tiempo es 1 minuto
    windowMs: 60 * 1000, 
    // El máximo de solicitudes permitidas por IP dentro de la ventana de tiempo
    max: 5,             
    message: 'Demasiadas solicitudes de autenticación desde esta IP. Inténtelo de nuevo en 1 minuto.',
    
    // Configuraciones estándar para entornos de producción/proxy (como Render.com)
    standardHeaders: true, 
    legacyHeaders: false,
});

export default authLimiter;