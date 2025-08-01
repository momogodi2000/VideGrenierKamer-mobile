import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/services/api/auth';
import secureStorage from '@/services/storage/secureStorage';
import { Analytics, EventType } from '@/services/analytics';
import { 
  LoginRequest, 
  RegisterRequest, 
  User, 
  AuthTokens,
  VerifyPhoneRequest,
  Verify2FARequest 
} from '@/types/auth';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requires2FA: boolean;
  requiresPhoneVerification: boolean;
  tempUserId: string | null;
  tempEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  requires2FA: false,
  requiresPhoneVerification: false,
  tempUserId: null,
  tempEmail: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      if (response.requires_2fa) {
        await Analytics.trackEvent(EventType.USER_LOGIN, {
          status: 'requires_2fa',
          email: credentials.email
        });
        
        return { 
          requires2FA: true, 
          message: response.message,
          tempEmail: credentials.email 
        };
      }

      if (response.tokens && response.user) {
        // Save tokens securely
        await secureStorage.setSecureItem('access_token', response.tokens.access_token);
        await secureStorage.setSecureItem('refresh_token', response.tokens.refresh_token);
        await secureStorage.setItem('user', response.user);

        await Analytics.trackEvent(EventType.USER_LOGIN, {
          status: 'success',
          userId: response.user.id,
          userType: response.user.user_type
        });
        Analytics.setUserId(response.user.id);
      }

      return response;
    } catch (error: any) {
      await Analytics.trackEvent(EventType.USER_LOGIN, {
        status: 'error',
        error: error.response?.data?.error || 'Échec de la connexion'
      });
      return rejectWithValue(
        error.response?.data?.error || 'Échec de la connexion'
      );
    }
  }
);

export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async (data: Verify2FARequest, { rejectWithValue }) => {
    try {
      const response = await authApi.verify2FA(data);
      
      if (response.tokens && response.user) {
        await secureStorage.setSecureItem('access_token', response.tokens.access_token);
        await secureStorage.setSecureItem('refresh_token', response.tokens.refresh_token);
        await secureStorage.setItem('user', response.user);
        
        await Analytics.trackEvent(EventType.USER_LOGIN, {
          status: 'success_2fa',
          userId: response.user.id,
          userType: response.user.user_type
        });
        Analytics.setUserId(response.user.id);
      }

      return response;
    } catch (error: any) {
      await Analytics.trackEvent(EventType.USER_LOGIN, {
        status: 'error_2fa',
        error: error.response?.data?.error || 'Code de vérification invalide'
      });
      return rejectWithValue(
        error.response?.data?.error || 'Code de vérification invalide'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      
      if (response.requires_phone_verification) {
        await Analytics.trackEvent(EventType.USER_REGISTER, {
          status: 'requires_phone_verification',
          email: userData.email
        });
        
        return { 
          requiresPhoneVerification: true,
          tempUserId: response.user_id,
          message: response.message 
        };
      }

      if (response.tokens && response.user) {
        await secureStorage.setSecureItem('access_token', response.tokens.access_token);
        await secureStorage.setSecureItem('refresh_token', response.tokens.refresh_token);
        await secureStorage.setItem('user', response.user);
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Échec de l\'inscription'
      );
    }
  }
);

export const verifyPhone = createAsyncThunk(
  'auth/verifyPhone',
  async (data: VerifyPhoneRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyPhone(data);
      
      if (response.tokens && response.user) {
        await secureStorage.setSecureItem('access_token', response.tokens.access_token);
        await secureStorage.setSecureItem('refresh_token', response.tokens.refresh_token);
        await secureStorage.setItem('user', response.user);

        await Analytics.trackEvent(EventType.USER_REGISTER, {
          status: 'success',
          userId: response.user.id,
          userType: response.user.user_type
        });
        Analytics.setUserId(response.user.id);
      }

      return response;
    } catch (error: any) {
      await Analytics.trackEvent(EventType.USER_REGISTER, {
        status: 'error_phone_verification',
        error: error.response?.data?.error || 'Code de vérification invalide'
      });
      return rejectWithValue(
        error.response?.data?.error || 'Code de vérification invalide'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authApi.logout();
      await Analytics.trackEvent(EventType.USER_LOGOUT, {
        status: 'success'
      });
    } catch (error) {
      await Analytics.trackEvent(EventType.USER_LOGOUT, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      // Continue with logout even if API call fails
    }
    
    await secureStorage.multiRemove(['access_token', 'refresh_token']);
    await secureStorage.removeItem('user');
    Analytics.setUserId(undefined);
  }
);

export const loadStoredAuth = createAsyncThunk(
  'auth/loadStoredAuth',
  async () => {
    const [accessToken, refreshToken, user] = await Promise.all([
      secureStorage.getSecureItem('access_token'),
      secureStorage.getSecureItem('refresh_token'),
      secureStorage.getItem('user'),
    ]);

    if (accessToken && refreshToken && user) {
      Analytics.setUserId(user.id);
      return {
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: 3600,
        },
        user,
      };
    }

    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTempData: (state) => {
      state.tempUserId = null;
      state.tempEmail = null;
      state.requires2FA = false;
      state.requiresPhoneVerification = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        if (payload && typeof payload === 'object' && 'requires2FA' in payload) {
          state.requires2FA = true;
          state.tempEmail = payload.tempEmail || null;
        } else if (payload && typeof payload === 'object' && 'user' in payload && 'tokens' in payload) {
          state.isAuthenticated = true;
          state.user = payload.user;
          state.tokens = payload.tokens;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify 2FA
      .addCase(verify2FA.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        if (payload && typeof payload === 'object' && 'user' in payload && 'tokens' in payload) {
          state.isAuthenticated = true;
          state.user = payload.user;
          state.tokens = payload.tokens;
          state.requires2FA = false;
          state.tempEmail = null;
        }
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        if (payload && typeof payload === 'object' && 'requiresPhoneVerification' in payload) {
          state.requiresPhoneVerification = true;
          state.tempUserId = payload.tempUserId || null;
        } else if (payload && typeof payload === 'object' && 'user' in payload && 'tokens' in payload) {
          state.isAuthenticated = true;
          state.user = payload.user;
          state.tokens = payload.tokens;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify Phone
      .addCase(verifyPhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhone.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        if (payload && typeof payload === 'object' && 'user' in payload && 'tokens' in payload) {
          state.isAuthenticated = true;
          state.user = payload.user;
          state.tokens = payload.tokens;
          state.requiresPhoneVerification = false;
          state.tempUserId = null;
        }
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      // Load stored auth
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        const payload = action.payload as any;
        if (payload) {
          state.isAuthenticated = true;
          state.user = payload.user;
          state.tokens = payload.tokens;
        }
      });
  },
});

export const { clearError, clearTempData, updateUser } = authSlice.actions;
export default authSlice.reducer;