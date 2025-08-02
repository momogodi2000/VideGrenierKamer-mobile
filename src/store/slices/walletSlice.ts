import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  balance: number;
  transactions: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    fetchBalanceStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBalanceSuccess(state, action: PayloadAction<number>) {
      state.balance = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchBalanceFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setTransactions(state, action: PayloadAction<any[]>) {
      state.transactions = action.payload;
    },
  },
});

export const { fetchBalanceStart, fetchBalanceSuccess, fetchBalanceFailure, setTransactions } = walletSlice.actions;
export default walletSlice.reducer;
