// src/services/api/auth.ts
import apiClient from './client';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  VerifyPhoneRequest,
  Verify2FARequest 
} from '@/types/auth';
import { API_ENDPOINTS } from '@/constants/api';

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  async verifyPhone(data: VerifyPhoneRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_PHONE, data);
  },

  async verify2FA(data: Verify2FARequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_2FA, data);
  },

  async resendPhoneCode(userId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/auth/resend_phone_code/', { user_id: userId });
  },

  async resend2FACode(email: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/auth/resend_2fa_code/', { email });
  },

  async logout(): Promise<{ success: boolean }> {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { 
      refresh_token: refreshToken 
    });
  },

  async googleOAuth(accessToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.GOOGLE_OAUTH, { 
      access_token: accessToken 
    });
  },

  async setup2FA(enable: boolean): Promise<{ success: boolean; message: string }> {
    return apiClient.post(API_ENDPOINTS.USER.SETUP_2FA, { enable_2fa: enable });
  },
};