export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login/',
    VERIFY_2FA: '/auth/verify_2fa/',
    REGISTER: '/auth/register/',
    VERIFY_PHONE: '/auth/verify_phone/',
    REFRESH: '/auth/refresh/',
    GOOGLE_OAUTH: '/auth/google_oauth/',
    LOGOUT: '/auth/logout/',
  },

  // Product endpoints
  PRODUCTS: {
    LIST: '/products/',
    DETAIL: (id: string) => `/products/${id}/`,
    CREATE: '/products/',
    UPDATE: (id: string) => `/products/${id}/`,
    DELETE: (id: string) => `/products/${id}/`,
    FAVORITE: (id: string) => `/products/${id}/favorite/`,
    TRENDING: '/products/trending/',
    RECOMMENDED: '/products/recommended/',
    MY_PRODUCTS: '/products/?seller=me',
  },

  // Category endpoints
  CATEGORIES: {
    LIST: '/categories/',
    DETAIL: (id: string) => `/categories/${id}/`,
    PRODUCTS: (id: string) => `/categories/${id}/products/`,
  },

  // Order endpoints
  ORDERS: {
    LIST: '/orders/',
    DETAIL: (id: string) => `/orders/${id}/`,
    CREATE: '/orders/',
    UPDATE_STATUS: (id: string) => `/orders/${id}/update_status/`,
    MY_ORDERS: '/orders/?buyer=me',
    MY_SALES: '/orders/?seller=me',
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile/',
    UPDATE_PROFILE: '/user/update_profile/',
    FAVORITES: '/user/favorites/',
    STATS: '/user/stats/',
    SETUP_2FA: '/user/setup_2fa/',
    PUSH_TOKEN: '/user/push-token/',
  },

  // Visitor endpoints
  VISITOR: {
    ADD_TO_CART: '/visitor/add_to_cart/',
    CART: '/visitor/cart/',
    CREATE_ORDER: '/visitor/create_order/',
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard_stats/',
    USERS: '/admin/users/',
    PENDING_PRODUCTS: '/admin/pending_products/',
    APPROVE_PRODUCT: (id: string) => `/admin/${id}/approve_product/`,
    REJECT_PRODUCT: (id: string) => `/admin/${id}/reject_product/`,
  },

  // Wallet endpoints
  WALLET: {
    BALANCE: '/wallet/balance/',
    TRANSACTIONS: '/wallet/transactions/',
    ADD_FUNDS: '/wallet/add_funds/',
  },

  // Pickup points
  PICKUP_POINTS: {
    LIST: '/pickup-points/',
    DETAIL: (id: string) => `/pickup-points/${id}/`,
  },

  // Search endpoint
  SEARCH: {
    PRODUCTS: '/search/',
  },

  // Payment endpoints
  PAYMENT: {
    INITIATE: '/payment/',
    VERIFY: '/payment/',
  },

  // Health check
  HEALTH: '/health/',
};

// API Base URL - should match Django settings
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/mobile';

// API Headers
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// API Timeout
export const API_TIMEOUT = 30000; // 30 seconds

// Cache TTL configurations
export const CACHE_TTL = {
  PRODUCTS: 10 * 60 * 1000, // 10 minutes
  PRODUCT_DETAIL: 30 * 60 * 1000, // 30 minutes
  CATEGORIES: 60 * 60 * 1000, // 1 hour
  USER_PROFILE: 15 * 60 * 1000, // 15 minutes
  USER_STATS: 5 * 60 * 1000, // 5 minutes
  ORDERS: 2 * 60 * 1000, // 2 minutes
  CONVERSATIONS: 1 * 60 * 1000, // 1 minute
  MESSAGES: 30 * 1000, // 30 seconds
  SEARCH_RESULTS: 5 * 60 * 1000, // 5 minutes
  TRENDING: 5 * 60 * 1000, // 5 minutes
  RECOMMENDED: 10 * 60 * 1000, // 10 minutes
};
