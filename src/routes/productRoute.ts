// src/routes/product.routes.ts

import { Router } from 'express';
import { addProduct } from '../controllers/product.controller.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';

const router = Router();

router.post('/', authMiddleware, addProduct); 
export default router