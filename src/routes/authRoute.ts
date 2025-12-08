import { Router } from 'express'; 
// Controladores de Autenticación
import { registerUser, loginUser } from '../controllers/authController'; // Asegúrate que la ruta al archivo es correcta

const router = Router();

// -------------------------------------------------------------------
// RUTAS DE AUTENTICACIÓN (Protegidas por Rate Limit - Requerimiento 4)
// -------------------------------------------------------------------

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

export default router;