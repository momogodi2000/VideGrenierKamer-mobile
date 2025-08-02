import apiClient from './client';
import { Notification } from '../../store/slices/notificationSlice';

export const notificationApi = {
  async getNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/mobile/api/notifications/');
  },

  async markAsRead(notificationId: string): Promise<void> {
    return apiClient.post(`/mobile/api/notifications/${notificationId}/read/`);
  },

  async markAllAsRead(): Promise<void> {
    return apiClient.post('/mobile/api/notifications/mark-all-read/');
  },

  async deleteNotification(notificationId: string): Promise<void> {
    return apiClient.delete(`/mobile/api/notifications/${notificationId}/`);
  },

  async updatePushToken(token: string): Promise<void> {
    return apiClient.post('/mobile/api/notifications/push-token/', { token });
  },

  async updateNotificationSettings(settings: {
    orderUpdates: boolean;
    chatMessages: boolean;
    productUpdates: boolean;
    marketing: boolean;
  }): Promise<void> {
    return apiClient.put('/mobile/api/notifications/settings/', settings);
  },
};
