import type { Request, Response } from "express";
import prisma from "../utils/prisma.js";
import { AppError } from "../utils/AppError.js";

export const reserveProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = (req as any).userId; // Get authenticated user ID from JWT

    if (!userId) {
      throw new AppError("Unauthorized - user ID not found", 401);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.updateMany({
        where: {
          id: productId,
          stock: { gt: 0 },
        },
        data: {
          stock: { decrement: 1 },
        },
      });

      if (updatedProduct.count === 0) {
        throw new AppError("Insufficient stock or product not found", 409);
      }


      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      const reservation = await tx.reservation.create({
        data: {
          productId,
          userId,
          status: "PENDING",
          expiresAt,
        },
      });

  
      await tx.inventoryLog.create({
        data: {
          productId,
          change: -1,
          reason: "RESERVATION",
        },
      });


      const updatedProductData = await tx.product.findUnique({
        where: { id: productId },
      });

      return { reservation, product: updatedProductData };
    });

    return res.status(201).json({
      message: "Reservation created successfully",
      data: result.reservation,
      product: result.product,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    }

    console.error("Reserve product error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create reservation",
    });
  }
};

export const checkoutReservation = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;
    const userId = (req as any).userId; // Get authenticated user ID from JWT

    if (!userId) {
      throw new AppError("Unauthorized - user ID not found", 401);
    }

    const result = await prisma.$transaction(async (tx) => {
     
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new AppError("Reservation not found", 404);
      }

      if (reservation.userId !== userId) {
        throw new AppError("This reservation does not belong to you", 403);
      }

      if (reservation.status !== "PENDING") {
        throw new AppError(
          "This reservation is already processed or cancelled",
          400,
        );
      }

      if (reservation.expiresAt < new Date()) {
        throw new AppError("Reservation has expired", 400);
      }

    
      const updatedReservation = await tx.reservation.update({
        where: { id: reservationId },
        data: { status: "COMPLETED" },
      });

      
      const order = await tx.order.create({
        data: {
          productId: reservation.productId,
          userId,
          amount: 1,
        },
      });

      
      await tx.inventoryLog.create({
        data: {
          productId: reservation.productId,
          change: 0,
          reason: "SALE",
        },
      });

      return { reservation: updatedReservation, order };
    });

    return res.status(200).json({
      message: "Order completed successfully",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    }

    console.error("Checkout reservation error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to complete checkout",
    });
  }
};
