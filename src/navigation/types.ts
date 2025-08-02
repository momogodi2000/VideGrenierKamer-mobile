import { NavigatorScreenParams } from '@react-navigation/native';

// Visitor stack params
export type VisitorStackParamList = {
  Landing: undefined;
  ProductList: { category?: string };
  ProductDetail: { productId: string };
  Cart: undefined;
  About: undefined;
  Contact: undefined;
};

// Auth stack params
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  TwoFactorVerification: { email: string };
  PhoneVerification: { userId: string; phone: string };
};

// Client stack params
export type ClientStackParamList = {
  Dashboard: undefined;
  Products: undefined;
  Sell: undefined;
  Messages: { conversationId?: string };
  Profile: undefined;
};

// Admin stack params
export type AdminStackParamList = {
  Dashboard: undefined;
  Users: undefined;
  Moderation: undefined;
  Reports: undefined;
  Settings: undefined;
};

// Root stack params
export type RootStackParamList = {
  Splash: undefined;
  TermsConditions: undefined;
  Visitor: NavigatorScreenParams<VisitorStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Client: NavigatorScreenParams<ClientStackParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
};
