// src/services/api/auth.ts
import apiClient from './client';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  VerifyPhoneRequest,
  Verify2FARequest 
} from '@/types/auth';

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login/', credentials);
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register/', userData);
  },

  async verifyPhone(data: VerifyPhoneRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/verify_phone/', data);
  },

  async verify2FA(data: Verify2FARequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/verify_2fa/', data);
  },

  async resendPhoneCode(userId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/auth/resend_phone_code/', { user_id: userId });
  },

  async resend2FACode(email: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/auth/resend_2fa_code/', { email });
  },

  async logout(): Promise<{ success: boolean }> {
    return apiClient.post('/auth/logout/');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh/', { 
      refresh_token: refreshToken 
    });
  },

  async googleOAuth(accessToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/google_oauth/', { 
      access_token: accessToken 
    });
  },

  async setup2FA(enable: boolean): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/user/setup_2fa/', { enable_2fa: enable });
  },
};