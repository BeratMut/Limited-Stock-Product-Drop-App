import { Router } from 'express';
import { getProducts } from '../controllers/product.js';
import { validate } from '../middlewares/validate.js';
import { getProductsSchema } from '../validations/product.js';

const router = Router();

// /api/products
router.get('/', validate(getProductsSchema), getProducts);

export default router;
