export interface Product {
  id: string;
  name: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  productId: string;
  userId: string;
  status: "PENDING" | "COMPLETED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  message?: string;
  status?: string;
  data: T;
  product?: Product;
}
