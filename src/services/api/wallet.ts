import { api } from './base';

export interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  timestamp: string;
  description: string;
}

export interface WalletBalance {
  balance: number;
  currency: string;
  last_updated: string;
}

export const walletApi = {
  getBalance: () => 
    api.get<WalletBalance>('/mobile/api/wallet/balance/'),
    
  getTransactions: (page = 1) =>
    api.get<WalletTransaction[]>('/mobile/api/wallet/transactions/', {
      params: { page }
    }),
    
  addFunds: (amount: number, paymentMethod: string) =>
    api.post<WalletTransaction>('/mobile/api/wallet/add-funds/', {
      amount,
      payment_method: paymentMethod
    }),
    
  withdraw: (amount: number, bankDetails: any) =>
    api.post<WalletTransaction>('/mobile/api/wallet/withdraw/', {
      amount,
      bank_details: bankDetails
    })
};
