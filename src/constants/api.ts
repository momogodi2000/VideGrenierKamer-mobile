export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    VERIFY_2FA: '/verify_2fa',
    REGISTER: '/register',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
  },
  VISITOR: {
    ADD_TO_CART: '/visitor/add_to_cart',
    CREATE_ORDER: '/create_order',
  },
  USER: {
    PROFILE: '/user/profile',
    STATS: '/user/stats',
  },
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard_stats',
    PENDING_PRODUCTS: '/pending_products',
  },
  PAYMENT: {
    INITIATE: '/payment',
    VERIFY: '/verify',
  },
}
