import { api } from './base';

export interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export const orderApi = {
  getPurchases: (page = 1) =>
    api.get<Order[]>('/mobile/api/orders/purchases/', {
      params: { page }
    }),
    
  getSales: (page = 1) =>
    api.get<Order[]>('/mobile/api/orders/sales/', {
      params: { page }
    }),
    
  updateOrderStatus: (orderId: string, status: Order['status']) =>
    api.put<Order>(`/mobile/api/orders/${orderId}/status/`, { status })
};
