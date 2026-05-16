import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      navigate("/");
    } catch (err: any) {
      // Check if error has field-specific errors
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError(err.response?.data?.message || "Please check your input");
      } else {
        setError(err.message || "Registration failed");
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
          Register
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
          }}
        >
          Create a new account to get started
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
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: fieldErrors.name
                  ? "1px solid var(--accent-danger)"
                  : "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            {fieldErrors.name && (
              <p
                style={{
                  color: "var(--accent-danger)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {fieldErrors.name}
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
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
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
            {loading ? "Registering..." : "Register"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
