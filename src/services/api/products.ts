// src/services/api/products.ts
import apiClient from './client';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  condition: string;
  city: string;
  is_negotiable: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
  status: string;
  seller: any;
  category: any;
  images: any[];
  is_favorited: boolean;
  main_image: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  city?: string;
  sortBy?: string;
  page?: number;
  page_size?: number;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  city: string;
  is_negotiable: boolean;
  images?: File[];
}

export const productsApi = {
  async getProducts(filters: ProductFilters = {}): Promise<{ results: Product[]; count: number }> {
    return apiClient.get('/products/', filters);
  },

  async getProduct(id: string): Promise<Product> {
    return apiClient.get(`/products/${id}/`);
  },

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(data).forEach(key => {
      if (key !== 'images' && data[key as keyof CreateProductRequest] !== undefined) {
        formData.append(key, String(data[key as keyof CreateProductRequest]));
      }
    });

    // Add images
    if (data.images) {
      data.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }

    return apiClient.upload('/products/', formData);
  },

  async updateProduct(id: string, data: Partial<CreateProductRequest>): Promise<Product> {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key !== 'images' && data[key as keyof CreateProductRequest] !== undefined) {
        formData.append(key, String(data[key as keyof CreateProductRequest]));
      }
    });

    if (data.images) {
      data.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }

    return apiClient.upload(`/products/${id}/`, formData);
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/products/${id}/`);
  },

  async toggleFavorite(productId: string): Promise<{ success: boolean }> {
    return apiClient.post(`/products/${productId}/favorite/`);
  },

  async getTrendingProducts(): Promise<Product[]> {
    return apiClient.get('/products/trending/');
  },

  async getRecommendedProducts(): Promise<Product[]> {
    return apiClient.get('/products/recommended/');
  },

  async getMyProducts(): Promise<Product[]> {
    return apiClient.get('/products/', { seller: 'me' });
  },

  async getCategoryProducts(categoryId: string): Promise<Product[]> {
    return apiClient.get(`/categories/${categoryId}/products/`);
  },
}; 