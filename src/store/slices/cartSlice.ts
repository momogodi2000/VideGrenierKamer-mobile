import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartViewModel, Cart, CartItem as ApiCartItem } from '@/viewModels/CartViewModel';
import { Analytics, EventType } from '@/services/analytics';

interface CartItem {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  unitPrice: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  sessionKey: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  sessionKey: null,
  loading: false,
  error: null,
};

const transformApiCartToState = (apiCart: Cart): Omit<CartState, 'loading' | 'error' | 'sessionKey'> => {
  return {
    items: apiCart.items.map((item: ApiCartItem) => ({
      productId: item.productId,
      product: {
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image
      },
      quantity: item.quantity,
      unitPrice: item.price
    })),
    totalAmount: apiCart.total,
    totalItems: apiCart.itemCount
  };
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cartViewModel = new CartViewModel();
      const cart = await cartViewModel.getCart();

      await Analytics.trackEvent(EventType.CART_UPDATE, {
        action: 'fetch_cart',
        itemCount: cart.itemCount,
        total: cart.total
      });

      return cart;
    } catch (error: any) {
      await Analytics.trackEvent(EventType.ERROR, {
        action: 'fetch_cart',
        error: error.message
      });
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSessionKey: (state, action: PayloadAction<string>) => {
      state.sessionKey = action.payload;
      Analytics.trackEvent(EventType.CART_UPDATE, {
        action: 'set_session_key',
        sessionKey: action.payload
      });
    },
    
    addToCart: (state, action: PayloadAction<{ product: any; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        const oldQuantity = existingItem.quantity;
        existingItem.quantity += quantity;
        
        Analytics.trackEvent(EventType.CART_UPDATE, {
          action: 'update_quantity',
          productId: product.id,
          oldQuantity,
          newQuantity: existingItem.quantity
        });
      } else {
        state.items.push({
          productId: product.id,
          product,
          quantity,
          unitPrice: parseFloat(product.price),
        });
        
        Analytics.trackEvent(EventType.CART_ADD, {
          productId: product.id,
          product: {
            id: product.id,
            name: product.name,
            price: product.price
          },
          quantity,
          unitPrice: parseFloat(product.price)
        });
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

      Analytics.trackEvent(EventType.CART_UPDATE, {
        action: 'totals_update',
        totalItems: state.totalItems,
        totalAmount: state.totalAmount
      });
    },
    
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      
      if (item) {
        const oldQuantity = item.quantity;
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.productId !== productId);
          
          Analytics.trackEvent(EventType.CART_REMOVE, {
            productId,
            reason: 'quantity_zero'
          });
        } else {
          item.quantity = quantity;
          
          Analytics.trackEvent(EventType.CART_UPDATE, {
            action: 'update_quantity',
            productId,
            oldQuantity,
            newQuantity: quantity
          });
        }
        
        // Recalculate totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

        Analytics.trackEvent(EventType.CART_UPDATE, {
          action: 'totals_update',
          totalItems: state.totalItems,
          totalAmount: state.totalAmount
        });
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const removedItem = state.items.find(item => item.productId === action.payload);
      
      if (removedItem) {
        Analytics.trackEvent(EventType.CART_REMOVE, {
          productId: action.payload,
          quantity: removedItem.quantity,
          unitPrice: removedItem.unitPrice
        });
      }
      
      state.items = state.items.filter(item => item.productId !== action.payload);
      
      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

      Analytics.trackEvent(EventType.CART_UPDATE, {
        action: 'totals_update',
        totalItems: state.totalItems,
        totalAmount: state.totalAmount
      });
    },
    
    clearCart: (state) => {
      const oldItemCount = state.totalItems;
      const oldTotal = state.totalAmount;
      
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;

      Analytics.trackEvent(EventType.CART_UPDATE, {
        action: 'clear_cart',
        oldItemCount,
        oldTotal,
        newItemCount: 0,
        newTotal: 0
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const transformed = transformApiCartToState(action.payload);
        state.items = transformed.items;
        state.totalAmount = transformed.totalAmount;
        state.totalItems = transformed.totalItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSessionKey, addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;