// src/services/api/enhancedProductsApi.ts
import enhancedApiClient from './enhancedClient';
import { Product, ProductFilters, CreateProductRequest } from './products';

export const enhancedProductsApi = {
  /**
   * Get products with caching
   */
  async getProducts(filters: ProductFilters = {}): Promise<{ results: Product[]; count: number }> {
    const response = await enhancedApiClient.get('/products/', filters, {
      useCache: true,
      cacheKey: `products_${JSON.stringify(filters)}`,
    });
    return response.data;
  },

  /**
   * Get product detail with caching
   */
  async getProduct(id: string): Promise<Product> {
    const response = await enhancedApiClient.get(`/products/${id}/`, undefined, {
      useCache: true,
      cacheKey: `product_${id}`,
    });
    return response.data;
  },

  /**
   * Create product with offline support
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await enhancedApiClient.post('/products/', data, {
      useCache: false,
    });
    return response.data;
  },

  /**
   * Update product with cache invalidation
   */
  async updateProduct(id: string, data: Partial<CreateProductRequest>): Promise<Product> {
    const response = await enhancedApiClient.put(`/products/${id}/`, data, {
      useCache: false,
    });
    return response.data;
  },

  /**
   * Delete product with cache invalidation
   */
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const response = await enhancedApiClient.delete(`/products/${id}/`, {
      useCache: false,
    });
    return response.data;
  },

  /**
   * Toggle favorite with cache invalidation
   */
  async toggleFavorite(productId: string): Promise<{ success: boolean }> {
    const response = await enhancedApiClient.post(`/products/${productId}/favorite/`, undefined, {
      useCache: false,
    });
    return response.data;
  },

  /**
   * Get trending products with caching
   */
  async getTrendingProducts(): Promise<Product[]> {
    const response = await enhancedApiClient.get('/products/trending/', undefined, {
      useCache: true,
      cacheKey: 'trending_products',
      cacheTTL: 5 * 60 * 1000, // 5 minutes
    });
    return response.data;
  },

  /**
   * Get recommended products with caching
   */
  async getRecommendedProducts(): Promise<Product[]> {
    const response = await enhancedApiClient.get('/products/recommended/', undefined, {
      useCache: true,
      cacheKey: 'recommended_products',
      cacheTTL: 10 * 60 * 1000, // 10 minutes
    });
    return response.data;
  },

  /**
   * Get user's products with caching
   */
  async getMyProducts(): Promise<Product[]> {
    const response = await enhancedApiClient.get('/products/', { seller: 'me' }, {
      useCache: true,
      cacheKey: 'my_products',
      cacheTTL: 2 * 60 * 1000, // 2 minutes
    });
    return response.data;
  },

  /**
   * Get category products with caching
   */
  async getCategoryProducts(categoryId: string): Promise<Product[]> {
    const response = await enhancedApiClient.get(`/categories/${categoryId}/products/`, undefined, {
      useCache: true,
      cacheKey: `category_products_${categoryId}`,
      cacheTTL: 15 * 60 * 1000, // 15 minutes
    });
    return response.data;
  },

  /**
   * Search products with caching
   */
  async searchProducts(query: string, filters: ProductFilters = {}): Promise<{ results: Product[]; count: number }> {
    const response = await enhancedApiClient.get('/search/', { q: query, ...filters }, {
      useCache: true,
      cacheKey: `search_${query}_${JSON.stringify(filters)}`,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
    });
    return response.data;
  },

  /**
   * Preload critical data
   */
  async preloadCriticalData(): Promise<void> {
    try {
      // Preload trending and recommended products
      await Promise.all([
        this.getTrendingProducts(),
        this.getRecommendedProducts(),
      ]);
    } catch (error) {
      console.error('Error preloading critical data:', error);
    }
  },

  /**
   * Clear product cache
   */
  async clearCache(): Promise<void> {
    await enhancedApiClient.clearCache('products');
  },
}; 