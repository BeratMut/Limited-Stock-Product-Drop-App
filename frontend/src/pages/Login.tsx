import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface FieldErrors {
  email?: string;
  password?: string;
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      // Check if error has field-specific errors
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-secondary)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "var(--bg-primary)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
          }}
        >
          Login
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
          }}
        >
          Welcome back to our inventory system
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid var(--accent-danger)",
              color: "var(--accent-danger)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-primary)",
                fontWeight: "500",
                fontSize: "0.875rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: fieldErrors.email
                  ? "1px solid var(--accent-danger)"
                  : "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            {fieldErrors.email && (
              <p
                style={{
                  color: "var(--accent-danger)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-primary)",
                fontWeight: "500",
                fontSize: "0.875rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: fieldErrors.password
                  ? "1px solid var(--accent-danger)"
                  : "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            {fieldErrors.password && (
              <p
                style={{
                  color: "var(--accent-danger)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "var(--accent-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
