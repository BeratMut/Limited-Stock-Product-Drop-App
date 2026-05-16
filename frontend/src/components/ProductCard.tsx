import React, { useState } from "react";
import type { Product } from "../types";
import { useReservation } from "../hooks/useReservation";
import { useCountdown } from "../hooks/useCountdown";
import { useAuth } from "../contexts/AuthContext";
import { Clock, CheckCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onRefresh: (updatedProduct?: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onRefresh,
}) => {
  const { user } = useAuth();
  const { reserve, checkout, loading, error } = useReservation();

 
  const userId = user?.id;

  
  const storageKey = userId ? `reservation_${userId}_${product.id}` : null;

  
  const [reservationId, setReservationId] = useState<string | null>(() => {
    if (!storageKey) return null;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).reservationId : null;
  });

  const [expiresAt, setExpiresAt] = useState<string | null>(() => {
    if (!storageKey) return null;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).expiresAt : null;
  });

  const [isCompleted, setIsCompleted] = useState(false);

  
  const { isExpired, formattedString } = useCountdown(expiresAt);

  
  React.useEffect(() => {
    if (isExpired && storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [isExpired, storageKey]);

  
  const isOutOfStock = product.stock <= 0 && !reservationId;

  const handleReserve = async () => {
    if (!storageKey) return;
    try {
      const response = await reserve(product.id);
      const resId = response.data.id;
      const expAt = response.data.expiresAt;

      setReservationId(resId);
      setExpiresAt(expAt);

     
      localStorage.setItem(
        storageKey,
        JSON.stringify({ reservationId: resId, expiresAt: expAt }),
      );

      
      if (response.product) {
        onRefresh(response.product);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (!reservationId || !storageKey) return;
    try {
      await checkout(reservationId);
      setIsCompleted(true);
      setExpiresAt(null); 

      
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error(err);
    }
  };

  
  const stockClass = isOutOfStock
    ? "stock-out"
    : product.stock < 5
      ? "stock-low"
      : "stock-high";

  return (
    <div className="premium-card">
      <h3 className="card-title">{product.name}</h3>

      <div className="card-stock">
        <span className={`stock-indicator ${stockClass}`}></span>
        {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
      </div>

      <div className="reservation-section">
        {!reservationId && !isCompleted && (
          <button
            className="btn-primary"
            onClick={handleReserve}
            disabled={isOutOfStock || loading}
          >
            {loading ? "Processing..." : "Reserve (5 Minutes)"}
          </button>
        )}

        {reservationId && !isExpired && !isCompleted && (
          <div className="countdown-box">
            <span className="countdown-label">Time Remaining</span>
            <div className="countdown-time">
              <Clock
                size={20}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  verticalAlign: "text-bottom",
                }}
              />
              {formattedString}
            </div>
            <button
              className="btn-success"
              onClick={handleCheckout}
              disabled={loading}
              style={{ marginTop: "0.5rem" }}
            >
              {loading ? "Processing..." : "Complete Checkout"}
            </button>
          </div>
        )}

        {isExpired && !isCompleted && (
          <div className="countdown-box" style={{ opacity: 0.7 }}>
            <span className="countdown-label">Expired</span>
            <span className="error-msg">Reservation cancelled.</span>
          </div>
        )}

        {isCompleted && (
          <div
            className="countdown-box"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-light)",
            }}
          >
            <CheckCircle
              size={32}
              color="var(--accent-success)"
              style={{ margin: "0 auto" }}
            />
            <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
              Order Received!
            </span>
            <span className="countdown-label">Thank you.</span>
          </div>
        )}

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};
