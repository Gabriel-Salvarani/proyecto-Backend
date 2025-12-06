// src/index.ts

import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';

// Configuración y Middlewares
import connectDB from "./config/mongodb";
//import logger from './config/logger'; // Logger avanzado (Requerimiento 3)

// Rutas
import productRoutes from './routes/productRoute'; // Rutas de productos
import authRoutes from './routes/authRoute';       // Rutas de autenticación (Necesarias para Rate Limit R4)


// 1. CARGA DE VARIABLES DE ENTORNO (Debe ser lo primero)
dotenv.config(); 
const PORT = process.env.PORT || 3000;


// 2. CONEXIÓN A LA BASE DE DATOS
connectDB();


const app: Application = express();


// -------------------------------------------------------------------
// 3. MIDDLEWARES GLOBALES
// -------------------------------------------------------------------

// Logger 1: Log de Consola (Para desarrollo rápido)
app.use(morgan('dev')); 

// Logger 2: Log de Archivo (Requerimiento 3)
// ⚠️ Si el servidor sigue "crasheando" aquí, comentar temporalmente esta línea:
// app.use(loggers.fileLogger); 

// Middleware para parsear bodies JSON (Necesario para POST/PUT)
app.use(express.json());


// -------------------------------------------------------------------
// 4. CONEXIÓN DE RUTAS
// -------------------------------------------------------------------

// Rutas de Autenticación (POST /api/auth/login, /api/auth/register)
// Aquí se aplicará el Rate Limit (Requerimiento 4)
app.use('/api/auth', authRoutes); 

// Rutas de Productos (GET/POST/PUT/DELETE /api/products)
// ✅ Esta línea soluciona el 404
app.use('/api/products', productRoutes); 


// 5. RUTA RAIZ (Opcional, para verificar si el servidor responde)
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ 
        message: '✅ API REST UTN funcionando.', 
        version: '1.0', 
        status: 'online'
    });
});


// 6. INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`⚡️ Servidor escuchando en http://localhost:${PORT}`);
});