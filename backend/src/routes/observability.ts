import { Router } from 'express';
import { getHealth, getMetrics } from '../controllers/observability.js';

const router = Router();

router.get('/health', getHealth);
router.get('/metrics', getMetrics);

export default router;
