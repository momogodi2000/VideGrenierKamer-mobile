// src/navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadStoredAuth } from '@/store/slices/authSlice';
import secureStorage from '@/services/storage/secureStorage';

// Import navigators
import VisitorNavigator from './VisitorNavigator';
import ClientNavigator from './ClientNavigator';
import AdminNavigator from './AdminNavigator';
import AuthNavigator from './AuthNavigator';

// Import screens
import SplashScreen from '@/screens/splash/SplashScreen';
import TermsConditionsScreen from '@/screens/auth/TermsConditionsScreen';

export type RootStackParamList = {
  Splash: undefined;
  TermsConditions: undefined;
  Visitor: undefined;
  Auth: undefined;
  Client: undefined;
  Admin: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load stored authentication
        await dispatch(loadStoredAuth());
        
        // Check if user has accepted terms
        const termsAccepted = await secureStorage.getItem('termsAccepted');
        setHasAcceptedTerms(!!termsAccepted);
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleTermsAccepted = async () => {
    await secureStorage.setItem('termsAccepted', true);
    setHasAcceptedTerms(true);
  };

  if (isLoading || showSplash) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  const getMainNavigator = () => {
    if (!isAuthenticated) {
      return <Stack.Screen name="Visitor" component={VisitorNavigator} />;
    } else if (user?.user_type === 'ADMIN') {
      return <Stack.Screen name="Admin" component={AdminNavigator} />;
    } else {
      return <Stack.Screen name="Client" component={ClientNavigator} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {!hasAcceptedTerms ? (
          <Stack.Screen name="TermsConditions">
            {(props) => (
              <TermsConditionsScreen
                {...props}
                onAccept={handleTermsAccepted}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            {getMainNavigator()}
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;