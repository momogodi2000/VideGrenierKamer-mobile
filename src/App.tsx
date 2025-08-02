// src/App.tsx
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';

// Store and navigation
import { store } from '@/store';
import AppNavigator from '@/navigation/AppNavigator';

// Services
import pushNotificationService from '@/services/notifications/pushNotificationService';
import enhancedApiClient from '@/services/api/enhancedClient';
import cacheService from '@/services/cache/cacheService';

// Components
import OfflineBanner from '@/components/common/OfflineBanner';
import LoadingScreen from '@/components/common/LoadingScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'AsyncStorage has been extracted from react-native',
]);

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize services
      await initializeServices();
      
      // Set up network monitoring
      setupNetworkMonitoring();
      
      // Set up push notifications
      await setupPushNotifications();
      
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsReady(true); // Continue anyway
    } finally {
      setIsLoading(false);
      await SplashScreen.hideAsync();
    }
  };

  const initializeServices = async () => {
    // Initialize cache service
    cacheService.setConfig({
      ttl: 5 * 60 * 1000, // 5 minutes
      maxSize: 100,
    });

    // Process any pending offline requests
    await enhancedApiClient.processOfflineQueue();
  };

  const setupNetworkMonitoring = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOnline = isOnline;
      const isNowOnline = state.isConnected && state.isInternetReachable;
      
      setIsOnline(isNowOnline);

      // Handle connection restoration
      if (!wasOnline && isNowOnline) {
        handleConnectionRestored();
      }
    });

    return unsubscribe;
  };

  const handleConnectionRestored = async () => {
    try {
      // Process offline queue
      await enhancedApiClient.processOfflineQueue();
      
      // Refresh critical data
      await refreshCriticalData();
    } catch (error) {
      console.error('Error handling connection restoration:', error);
    }
  };

  const refreshCriticalData = async () => {
    // Refresh user profile, orders, and other critical data
    // This would be implemented based on your specific needs
    console.log('Refreshing critical data after connection restoration');
  };

  const setupPushNotifications = async () => {
    try {
      await pushNotificationService.registerForPushNotifications();
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          
          {/* Offline Banner */}
          {!isOnline && <OfflineBanner />}
          
          {/* Main App Navigator */}
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App; 