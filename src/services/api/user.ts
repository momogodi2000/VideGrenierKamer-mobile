// src/services/api/user.ts
import apiClient from './client';

export const userApi = {
  async getProfile() {
    return apiClient.get('/user/profile/');
  },

  async updateProfile(data: any) {
    return apiClient.put('/user/profile/update/', data);
  },

  async getStats() {
    return apiClient.get('/user/stats/');
  },

  async getFavorites() {
    return apiClient.get('/user/favorites/');
  },

  async getOrders() {
    return apiClient.get('/user/orders/');
  },

  async getMyProducts() {
    return apiClient.get('/user/products/');
  },
};