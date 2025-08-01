// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  user_type: 'ADMIN' | 'CLIENT';
  city: string;
  is_verified: boolean;
  phone_verified: boolean;
  trust_score: number;
  loyalty_points: number;
  loyalty_level: string;
  profile_picture?: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  first_name: string;
  last_name: string;
  city: string;
  address?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  success: boolean;
  requires_2fa?: boolean;
  requires_phone_verification?: boolean;
  message?: string;
  tokens?: AuthTokens;
  user?: User;
  user_id?: string;
}

export interface VerifyPhoneRequest {
  user_id: string;
  code: string;
}

export interface Verify2FARequest {
  email: string;
  code: string;
}