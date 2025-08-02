// src/services/api/categories.ts
import apiClient from './client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  product_count: number;
}

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    return apiClient.get('/categories/');
  },

  async getCategory(id: string): Promise<Category> {
    return apiClient.get(`/categories/${id}/`);
  },

  async getCategoryProducts(categoryId: string): Promise<any[]> {
    return apiClient.get(`/categories/${categoryId}/products/`);
  },
}; 