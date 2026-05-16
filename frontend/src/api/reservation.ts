import { apiClient } from "./client";
import type { ApiResponse, Reservation } from "../types";

export const reserveProduct = async (productId: string) => {
  const { data } = await apiClient.post<ApiResponse<Reservation>>(
    "/reservations/reserve",
    {
      productId,
    },
  );
  return data;
};

export const checkoutReservation = async (reservationId: string) => {
  const { data } = await apiClient.post<ApiResponse<any>>(
    "/reservations/checkout",
    {
      reservationId,
    },
  );
  return data;
};
