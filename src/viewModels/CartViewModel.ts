import { cartApi } from '@/services/api/cart';
import { Analytics, EventType } from '@/services/analytics';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  pickupPointId?: string;
}

export class CartViewModel {
  async getCart(): Promise<Cart> {
    try {
      const response = await cartApi.getCart();

      await Analytics.trackEvent(EventType.CART_UPDATE, {
        action: 'view_cart',
        itemCount: response.data.itemCount,
        total: response.data.total
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'get_cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async addToCart(productId: string, quantity: number): Promise<Cart> {
    try {
      const response = await cartApi.addToCart(productId, quantity);

      await Analytics.trackEvent(EventType.CART_ADD, {
        productId,
        quantity,
        newTotal: response.data.total,
        newItemCount: response.data.itemCount
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'add_to_cart',
        productId,
        quantity,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    try {
      const response = await cartApi.updateCartItem(itemId, quantity);

      await Analytics.trackEvent(EventType.CART_UPDATE, {
        itemId,
        newQuantity: quantity,
        newTotal: response.data.total,
        newItemCount: response.data.itemCount
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'update_cart_item',
        itemId,
        quantity,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    try {
      const response = await cartApi.removeFromCart(itemId);

      await Analytics.trackEvent(EventType.CART_REMOVE, {
        itemId,
        newTotal: response.data.total,
        newItemCount: response.data.itemCount
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'remove_from_cart',
        itemId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async clearCart(): Promise<Cart> {
    try {
      const response = await cartApi.clearCart();

      await Analytics.trackEvent(EventType.CART_UPDATE, {
        action: 'clear_cart'
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'clear_cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async setPickupPoint(pickupPointId: string): Promise<Cart> {
    try {
      const response = await cartApi.setPickupPoint(pickupPointId);

      await Analytics.trackEvent(EventType.CART_UPDATE, {
        action: 'set_pickup_point',
        pickupPointId
      });

      return response.data;
    } catch (error) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'set_pickup_point',
        pickupPointId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}
