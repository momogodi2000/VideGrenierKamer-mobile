import { api } from './base';
import { Cart } from '@/viewModels/CartViewModel';

export const cartApi = {
  getCart: () => 
    api.get<Cart>('/mobile/api/visitor/cart/'),

  addToCart: (productId: string, quantity: number) =>
    api.post<Cart>('/mobile/api/visitor/cart/add/', {
      product_id: productId,
      quantity
    }),

  updateCartItem: (itemId: string, quantity: number) =>
    api.put<Cart>(`/mobile/api/visitor/cart/items/${itemId}/`, {
      quantity
    }),

  removeFromCart: (itemId: string) =>
    api.delete<Cart>(`/mobile/api/visitor/cart/items/${itemId}/`),

  clearCart: () =>
    api.delete<Cart>('/mobile/api/visitor/cart/'),

  setPickupPoint: (pickupPointId: string) =>
    api.put<Cart>('/mobile/api/visitor/cart/pickup-point/', {
      pickup_point_id: pickupPointId
    })
};
