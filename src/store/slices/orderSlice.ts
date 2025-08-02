import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderApi } from '../../services/api/order';

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  purchases: Order[];
  sales: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  purchases: [],
  sales: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

export const fetchPurchases = createAsyncThunk(
  'orders/fetchPurchases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getPurchases();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSales = createAsyncThunk(
  'orders/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getSales();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }: { orderId: string; status: Order['status'] }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrderStatus(orderId, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch purchases
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch sales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        if (updatedOrder.buyerId === state.purchases[0]?.buyerId) {
          // Update in purchases
          const purchaseIndex = state.purchases.findIndex(order => order.id === updatedOrder.id);
          if (purchaseIndex !== -1) {
            state.purchases[purchaseIndex] = updatedOrder;
          }
        } else {
          // Update in sales
          const saleIndex = state.sales.findIndex(order => order.id === updatedOrder.id);
          if (saleIndex !== -1) {
            state.sales[saleIndex] = updatedOrder;
          }
        }
        // Update selected order if it's the same
        if (state.selectedOrder?.id === updatedOrder.id) {
          state.selectedOrder = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
