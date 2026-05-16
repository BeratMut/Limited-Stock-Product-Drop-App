import { z } from "zod";

export const reserveSchema = z.object({
  body: z.object({
    productId: z
      .string({ message: "productId is required and must be a string" })
      .uuid("productId must be a valid UUID"),
  }),
});

export const checkoutSchema = z.object({
  body: z.object({
    reservationId: z
      .string({ message: "reservationId is required and must be a string" })
      .uuid("reservationId must be a valid UUID"),
  }),
});
