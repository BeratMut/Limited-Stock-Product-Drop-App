import { Router } from 'express';
import { reserveProduct, checkoutReservation } from '../controllers/reservation.js';
import { validate } from '../middlewares/validate.js';
import { reserveSchema, checkoutSchema } from '../validations/reservation.js';

const router = Router();

// /api/reservations/reserve
router.post('/reserve', validate(reserveSchema), reserveProduct);

// /api/reservations/checkout
router.post('/checkout', validate(checkoutSchema), checkoutReservation);

export default router;
