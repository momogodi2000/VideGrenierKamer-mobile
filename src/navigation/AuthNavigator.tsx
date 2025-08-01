// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import TwoFactorScreen from '@/screens/auth/TwoFactorScreen';
import PhoneVerificationScreen from '@/screens/auth/PhoneVerificationScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  TwoFactorVerification: { email: string };
  PhoneVerification: { userId: string; phone: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="TwoFactorVerification" component={TwoFactorScreen} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;