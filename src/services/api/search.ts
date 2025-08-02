// src/services/api/search.ts
import apiClient from './client';

export interface SearchFilters {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  city?: string;
  sortBy?: string;
  page?: number;
  page_size?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  price: number;
  condition: string;
  city: string;
  main_image: string;
  category: {
    id: string;
    name: string;
  };
}

export const searchApi = {
  async searchProducts(filters: SearchFilters = {}): Promise<{ results: SearchResult[]; count: number }> {
    return apiClient.get('/search/', filters);
  },

  async getSearchSuggestions(query: string): Promise<string[]> {
    return apiClient.get('/search/suggestions/', { q: query });
  },

  async getPopularSearches(): Promise<string[]> {
    return apiClient.get('/search/popular/');
  },
}; 