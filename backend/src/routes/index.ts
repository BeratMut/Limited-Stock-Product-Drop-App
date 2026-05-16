import { Router } from "express";
import reservationRoutes from "./reservation.js";
import productRoutes from "./product.js";
import authRoutes from "./auth.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes
router.use("/products", authMiddleware, productRoutes);
router.use("/reservations", authMiddleware, reservationRoutes);

export default router;
