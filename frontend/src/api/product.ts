import { apiClient } from './client';
import type { PaginatedResponse, Product } from '../types';

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const { data } = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
  return data;
};
