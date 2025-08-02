import apiClient from './client';
import { Order } from '../../store/slices/orderSlice';

export const orderApi = {
  async createOrder(productId: string, quantity: number): Promise<Order> {
    return apiClient.post<Order>('/mobile/api/orders/', {
      product_id: productId,
      quantity,
    });
  },

  async getPurchases(): Promise<Order[]> {
    return apiClient.get<Order[]>('/mobile/api/orders/purchases/');
  },

  async getSales(): Promise<Order[]> {
    return apiClient.get<Order[]>('/mobile/api/orders/sales/');
  },

  async getOrderDetails(orderId: string): Promise<Order> {
    return apiClient.get<Order>(`/mobile/api/orders/${orderId}/`);
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    return apiClient.put<Order>(`/mobile/api/orders/${orderId}/status/`, { status });
  },

  async cancelOrder(orderId: string): Promise<Order> {
    return apiClient.post<Order>(`/mobile/api/orders/${orderId}/cancel/`);
  },
};
