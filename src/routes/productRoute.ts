// src/routes/product.routes.ts

import { Router } from 'express';
// 💡 Importamos el middleware para proteger las rutas de escritura (Requerimiento 5)
import authMiddleware from '../middlewares/authMiddleware'; 

// 💡 Importamos los controladores que manejan la lógica de negocio y Request/Response
import { 
    getProducts, 
    getProductById,
    addProductController,   // Función para crear
    updateProductById,      // Función para actualizar
    deleteProductById       // Función para eliminar
} from '../controllers/productController'; 

const router = Router();

// -------------------------------------------------------------------
// RUTAS DE LECTURA (Públicas y con Query Params - Requerimiento 6)
// -------------------------------------------------------------------

// GET /api/products
// Obtiene todos los productos (aplica filtros de Query Params)
router.get('/', getProducts); 

// GET /api/products/:id
// Obtiene un producto específico por ID
router.get('/:id', getProductById);


// -------------------------------------------------------------------
// RUTAS DE ESCRITURA (Protegidas por Autenticación - Requerimiento 5)
// -------------------------------------------------------------------

// POST /api/products
// Crea un nuevo producto (Requiere JWT válido)
// 🔒 Aplica el middleware antes del controlador
router.post('/', authMiddleware, addProductController); 

// PUT /api/products/:id
// Actualiza un producto existente (Requiere JWT válido)
// 🔒 Aplica el middleware antes del controlador
router.put('/:id', authMiddleware, updateProductById);

// DELETE /api/products/:id
// Elimina un producto (Requiere JWT válido)
// 🔒 Aplica el middleware antes del controlador
router.delete('/:id', authMiddleware, deleteProductById);

export default router;