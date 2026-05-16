import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";

export const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 6;

  const { data, loading, error, setParams, updateProduct } = useProducts({
    limit,
    page,
    search,
    sortBy: "stock",
    sortOrder: "desc",
  });

  
  useEffect(() => {
    setParams({ limit, page, search, sortBy: "stock", sortOrder: "desc" });
  }, [page, search, setParams, limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1); 
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = data?.meta?.totalPages || 0;

  return (
    <div className="container main-content">
      <header>
        <h1>Products</h1>
        <p>Premium inventory management system. (Stock updates in real-time)</p>
      </header>

      {/* Search Bar */}
      <div style={{ marginBottom: "2rem" }}>
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border-light)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              backgroundColor: "var(--accent-primary)",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p className="error-msg" style={{ fontSize: "1.1rem" }}>
            {error}
          </p>
        </div>
      )}

      {loading && !data && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          No products found.
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="product-grid">
            {data.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRefresh={(updatedProduct) => {
    
                  if (updatedProduct) {
                    updateProduct(updatedProduct);
                  }
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginTop: "2rem",
              paddingBottom: "2rem",
            }}
          >
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border-light)",
                backgroundColor:
                  page === 1 ? "var(--bg-secondary)" : "var(--accent-primary)",
                color: page === 1 ? "var(--text-secondary)" : "white",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontSize: "0.95rem",
              }}
            >
              Previous
            </button>

            <div
              style={{
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                minWidth: "150px",
                textAlign: "center",
              }}
            >
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border-light)",
                backgroundColor:
                  page === totalPages
                    ? "var(--bg-secondary)"
                    : "var(--accent-primary)",
                color: page === totalPages ? "var(--text-secondary)" : "white",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                fontSize: "0.95rem",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
