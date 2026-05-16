import cron from "node-cron";
import prisma from "../utils/prisma.js";
import logger from "../utils/logger.js";

export const startReservationCleanupJob = () => {
  cron.schedule("* * * * *", async () => {
    logger.info("Running reservation cleanup job...");
    try {
      const expiredReservations = await prisma.reservation.findMany({
        where: {
          status: "PENDING",
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      for (const reservation of expiredReservations) {
        try {
          await prisma.$transaction(async (tx) => {
            const updated = await tx.reservation.updateMany({
              where: {
                id: reservation.id,
                status: "PENDING",
              },
              data: {
                status: "EXPIRED",
              },
            });

            if (updated.count === 0) return;

            await tx.product.update({
              where: { id: reservation.productId },
              data: { stock: { increment: 1 } },
            });

            await tx.inventoryLog.create({
              data: {
                productId: reservation.productId,
                change: 1,
                reason: "CANCELLED_TIMEOUT",
              },
            });
          });
          logger.info(
            `Reservation ${reservation.id} cancelled and stock refunded.`,
          );
        } catch (innerError) {
          logger.error(
            `Failed to cancel reservation ${reservation.id}:`,
            innerError,
          );
        }
      }
    } catch (error) {
      logger.error("Error in reservation cleanup job:", error);
    }
  });
};
