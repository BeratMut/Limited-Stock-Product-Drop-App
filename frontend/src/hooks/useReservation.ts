import { useState } from "react";
import { reserveProduct, checkoutReservation } from "../api/reservation";

export const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserve = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reserveProduct(productId);
      return data;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to make reservation",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (reservationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await checkoutReservation(reservationId);
      return data;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to complete checkout",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reserve, checkout, loading, error };
};
