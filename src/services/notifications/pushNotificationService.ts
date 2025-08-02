// src/services/notifications/pushNotificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import apiClient from '../api/client';

interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  priority?: 'default' | 'normal' | 'high';
}

interface PushToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;

  private constructor() {
    this.configureNotifications();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Configure notification behavior
   */
  private configureNotifications(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Set notification categories for iOS
    if (Platform.OS === 'ios') {
      Notifications.setNotificationCategoryAsync('chat', [
        {
          identifier: 'reply',
          buttonTitle: 'Répondre',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
          },
        },
        {
          identifier: 'view',
          buttonTitle: 'Voir',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
          },
        },
      ]);

      Notifications.setNotificationCategoryAsync('order', [
        {
          identifier: 'view_order',
          buttonTitle: 'Voir la commande',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
          },
        },
        {
          identifier: 'contact_seller',
          buttonTitle: 'Contacter le vendeur',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
          },
        },
      ]);
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  /**
   * Register for push notifications
   */
  async registerForPushNotifications(): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return null;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.expoPushToken = token.data;
      console.log('Expo push token:', token.data);

      // Send token to backend
      await this.sendTokenToBackend(token.data);

      // Set up notification listeners
      this.setupNotificationListeners();

      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Send push token to backend
   */
  private async sendTokenToBackend(token: string): Promise<void> {
    try {
      const pushToken: PushToken = {
        token,
        platform: Platform.OS as 'ios' | 'android' | 'web',
      };

      await apiClient.post('/user/push-token/', pushToken);
    } catch (error) {
      console.error('Error sending push token to backend:', error);
    }
  }

  /**
   * Set up notification listeners
   */
  private setupNotificationListeners(): void {
    // Listen for incoming notifications
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listen for notification responses (taps)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  /**
   * Handle incoming notification
   */
  private handleNotificationReceived(notification: Notifications.Notification): void {
    const { title, body, data } = notification.request.content;
    
    // Update app state based on notification type
    if (data?.type === 'chat') {
      // Update chat unread count
      // You can use Redux or context to update the app state
    } else if (data?.type === 'order') {
      // Update order status
    }
  }

  /**
   * Handle notification tap/response
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const { data, actionIdentifier } = response;
    
    // Handle different action types
    switch (actionIdentifier) {
      case 'reply':
        // Navigate to chat screen
        this.navigateToChat(data?.conversationId);
        break;
      case 'view':
      case 'view_order':
        // Navigate to order detail
        this.navigateToOrder(data?.orderId);
        break;
      case 'contact_seller':
        // Navigate to chat with seller
        this.navigateToChat(data?.conversationId);
        break;
      default:
        // Default navigation based on notification type
        this.handleDefaultNavigation(data);
        break;
    }
  }

  /**
   * Handle default navigation based on notification data
   */
  private handleDefaultNavigation(data: any): void {
    if (data?.type === 'chat') {
      this.navigateToChat(data.conversationId);
    } else if (data?.type === 'order') {
      this.navigateToOrder(data.orderId);
    } else if (data?.type === 'product') {
      this.navigateToProduct(data.productId);
    }
  }

  /**
   * Navigate to chat screen
   */
  private navigateToChat(conversationId: string): void {
    // Import navigation and navigate to chat
    // This would need to be implemented based on your navigation setup
    console.log('Navigate to chat:', conversationId);
  }

  /**
   * Navigate to order detail
   */
  private navigateToOrder(orderId: string): void {
    console.log('Navigate to order:', orderId);
  }

  /**
   * Navigate to product detail
   */
  private navigateToProduct(productId: string): void {
    console.log('Navigate to product:', productId);
  }

  /**
   * Schedule local notification
   */
  async scheduleLocalNotification(notification: NotificationData, trigger?: any): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: notification.sound ? 'default' : undefined,
        priority: notification.priority || 'default',
      },
      trigger: trigger || null, // null means send immediately
    });

    return notificationId;
  }

  /**
   * Cancel local notification
   */
  async cancelLocalNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all local notifications
   */
  async cancelAllLocalNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Set badge count (iOS only)
   */
  async setBadgeCount(count: number): Promise<void> {
    if (Platform.OS === 'ios') {
      await Notifications.setBadgeCountAsync(count);
    }
  }

  /**
   * Get badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Send test notification
   */
  async sendTestNotification(): Promise<void> {
    await this.scheduleLocalNotification({
      title: 'Test Notification',
      body: 'This is a test notification from Vidé-Grenier Kamer',
      data: { type: 'test' },
    });
  }

  /**
   * Clean up listeners
   */
  cleanup(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  /**
   * Get current push token
   */
  getPushToken(): string | null {
    return this.expoPushToken;
  }
}

export default PushNotificationService.getInstance(); 