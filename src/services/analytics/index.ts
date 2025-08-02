import { Platform } from 'react-native';

export enum EventType {
  // Navigation events
  PAGE_VIEW = 'page_view',
  SCREEN_VIEW = 'screen_view',
  
  // User events
  USER_LOGIN = 'user_login',
  USER_REGISTER = 'user_register',
  USER_LOGOUT = 'user_logout',
  
  // Product events
  PRODUCT_VIEW = 'product_view', 
  PRODUCT_SEARCH = 'product_search',
  PRODUCT_FILTER = 'product_filter',
  PRODUCT_CREATE = 'product_create',
  PRODUCT_EDIT = 'product_edit',
  
  // Cart events
  CART_ADD = 'cart_add',
  CART_REMOVE = 'cart_remove',
  CART_UPDATE = 'cart_update',
  
  // Order events
  ORDER_CREATE = 'order_create',
  ORDER_STATUS_UPDATE = 'order_status_update',
  
  // User interaction events
  FAVORITE_TOGGLE = 'favorite_toggle',
  CHAT_SEND = 'chat_send',
  REVIEW_SUBMIT = 'review_submit',
  
  // Error events
  ERROR = 'error'
}

export interface AnalyticsEvent {
  type: EventType;
  timestamp: number;
  userId?: string;
  sessionId: string;
  properties: Record<string, any>;
  platform: string;
  version: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean = true;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  public setUserId(userId: string | undefined): void {
    this.userId = userId;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public async trackEvent(type: EventType, properties: Record<string, any> = {}): Promise<void> {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      properties,
      platform: Platform.OS,
      version: '1.0.0' // TODO: Get from app config
    };

    try {
      // For now just log to console, in production this would send to analytics backend
      console.log('Analytics Event:', event);

      // TODO: Queue events when offline
      // TODO: Batch send events to reduce network requests
      // TODO: Add retry logic for failed sends
      // TODO: Implement proper backend API call
      
    } catch (error) {
      // Silent fail for analytics
      console.error('Analytics Error:', error);
    }
  }

  public async screenView(screenName: string, properties: Record<string, any> = {}): Promise<void> {
    await this.trackEvent(EventType.SCREEN_VIEW, {
      screen_name: screenName,
      ...properties
    });
  }

  public async logError(error: Error, context: Record<string, any> = {}): Promise<void> {
    await this.trackEvent(EventType.ERROR, {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });
  }
}

export const Analytics = AnalyticsService.getInstance();
