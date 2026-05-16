import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-md)",
        borderBottom: "1px solid var(--border-light)",
        padding: "1rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            color: "var(--accent-primary)",
            margin: 0,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          📦 Inventory
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-primary)",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
              }}
            >
              👤
            </span>
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: "500",
              }}
            >
              {user?.name || user?.email}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "var(--accent-danger)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "opacity var(--transition-normal)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
