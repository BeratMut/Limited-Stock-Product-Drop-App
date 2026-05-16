import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../api/product";
import type { Product, PaginatedResponse } from "../types";

export const useProducts = (initialParams: any = { limit: 10, page: 1 }) => {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

 
  const fetchProducts = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const response = await getProducts(params);
        setData(response);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load products",
        );
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [params],
  );

 
  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

 
  useEffect(() => {
    const intervalId = setInterval(() => {
      
      fetchProducts(false);
    }, 5000);

    return () => clearInterval(intervalId); 
  }, [fetchProducts]);


  const updateProduct = useCallback((updatedProduct: any) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p,
        ),
      };
    });
  }, []);

  return {
    data,
    loading,
    error,
    params,
    setParams,
    refresh: fetchProducts,
    updateProduct,
  };
};
