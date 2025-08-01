// src/services/api/admin.ts
import apiClient from './client';

export const adminApi = {
  async getDashboardStats() {
    return apiClient.get('/admin/dashboard_stats/');
  },

  async getUsers(params?: any) {
    return apiClient.get('/admin/users/', params);
  },

  async getPendingProducts() {
    return apiClient.get('/admin/pending_products/');
  },

  async approveProduct(productId: string) {
    return apiClient.post(`/admin/products/${productId}/approve/`);
  },

  async rejectProduct(productId: string, reason: string) {
    return apiClient.post(`/admin/products/${productId}/reject/`, { reason });
  },

  async getReports(params?: any) {
    return apiClient.get('/admin/reports/', params);
  },
};