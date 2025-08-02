// src/services/api/enhancedClient.ts
import NetInfo from '@react-native-community/netinfo';
import cacheService, { CACHE_KEYS, CACHE_CONFIGS } from '../cache/cacheService';
import apiClient from './client';

interface RequestConfig {
  useCache?: boolean;
  cacheKey?: string;
  cacheTTL?: number;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  fromCache: boolean;
  timestamp: number;
}

class EnhancedApiClient {
  private retryCount = 3;
  private retryDelay = 1000;
  private timeout = 30000;

  /**
   * Enhanced GET request with caching and offline support
   */
  async get<T>(
    url: string, 
    params?: any, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      useCache = true,
      cacheKey,
      cacheTTL,
      retryCount = this.retryCount,
      retryDelay = this.retryDelay,
      timeout = this.timeout,
    } = config;

    const finalCacheKey = cacheKey || this.generateCacheKey(url, params);
    const networkState = await NetInfo.fetch();

    // Try to get from cache first if enabled
    if (useCache) {
      const cachedData = cacheService.get<T>(finalCacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          fromCache: true,
          timestamp: Date.now(),
        };
      }
    }

    // If offline and no cache, throw error
    if (!networkState.isConnected) {
      throw new Error('No internet connection and no cached data available');
    }

    // Make API request with retry logic
    let lastError: Error;
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const response = await this.makeRequest<T>(url, 'GET', params, timeout);
        
        // Cache the response if enabled
        if (useCache) {
          const ttl = cacheTTL || this.getDefaultTTL(url);
          await cacheService.set(finalCacheKey, response, ttl);
        }

        return {
          data: response,
          fromCache: false,
          timestamp: Date.now(),
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retryCount) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  /**
   * Enhanced POST request with offline queue
   */
  async post<T>(
    url: string, 
    data?: any, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      retryCount = this.retryCount,
      retryDelay = this.retryDelay,
      timeout = this.timeout,
    } = config;

    const networkState = await NetInfo.fetch();

    // If offline, queue the request
    if (!networkState.isConnected) {
      await this.queueOfflineRequest(url, 'POST', data);
      throw new Error('Request queued for offline processing');
    }

    // Make API request with retry logic
    let lastError: Error;
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const response = await this.makeRequest<T>(url, 'POST', data, timeout);
        
        return {
          data: response,
          fromCache: false,
          timestamp: Date.now(),
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retryCount) {
          await this.delay(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Enhanced PUT request
   */
  async put<T>(
    url: string, 
    data?: any, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      retryCount = this.retryCount,
      retryDelay = this.retryDelay,
      timeout = this.timeout,
    } = config;

    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      await this.queueOfflineRequest(url, 'PUT', data);
      throw new Error('Request queued for offline processing');
    }

    let lastError: Error;
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const response = await this.makeRequest<T>(url, 'PUT', data, timeout);
        
        // Invalidate related cache
        await this.invalidateRelatedCache(url);
        
        return {
          data: response,
          fromCache: false,
          timestamp: Date.now(),
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retryCount) {
          await this.delay(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Enhanced DELETE request
   */
  async delete<T>(
    url: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      retryCount = this.retryCount,
      retryDelay = this.retryDelay,
      timeout = this.timeout,
    } = config;

    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      await this.queueOfflineRequest(url, 'DELETE');
      throw new Error('Request queued for offline processing');
    }

    let lastError: Error;
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const response = await this.makeRequest<T>(url, 'DELETE', undefined, timeout);
        
        // Invalidate related cache
        await this.invalidateRelatedCache(url);
        
        return {
          data: response,
          fromCache: false,
          timestamp: Date.now(),
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retryCount) {
          await this.delay(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Process offline queue when connection is restored
   */
  async processOfflineQueue(): Promise<void> {
    const queue = await this.getOfflineQueue();
    
    for (const request of queue) {
      try {
        await this.makeRequest(request.url, request.method, request.data);
        await this.removeFromOfflineQueue(request.id);
      } catch (error) {
        console.error('Failed to process offline request:', error);
      }
    }
  }

  /**
   * Clear cache for specific patterns
   */
  async clearCache(pattern?: string): Promise<void> {
    if (pattern) {
      // Clear cache keys matching pattern
      const keys = Object.values(CACHE_KEYS).filter(key => 
        key.includes(pattern)
      );
      for (const key of keys) {
        await cacheService.delete(key);
      }
    } else {
      await cacheService.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cacheService.getStats();
  }

  /**
   * Make actual HTTP request
   */
  private async makeRequest<T>(
    url: string, 
    method: string, 
    data?: any, 
    timeout?: number
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      let response: T;
      
      switch (method) {
        case 'GET':
          response = await apiClient.get<T>(url, data);
          break;
        case 'POST':
          response = await apiClient.post<T>(url, data);
          break;
        case 'PUT':
          response = await apiClient.put<T>(url, data);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Generate cache key from URL and params
   */
  private generateCacheKey(url: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}${paramString}`;
  }

  /**
   * Get default TTL based on URL pattern
   */
  private getDefaultTTL(url: string): number {
    if (url.includes('/products/')) {
      return CACHE_CONFIGS.PRODUCT_DETAIL.ttl;
    }
    if (url.includes('/products')) {
      return CACHE_CONFIGS.PRODUCTS.ttl;
    }
    if (url.includes('/categories')) {
      return CACHE_CONFIGS.CATEGORIES.ttl;
    }
    if (url.includes('/user/')) {
      return CACHE_CONFIGS.USER_PROFILE.ttl;
    }
    if (url.includes('/orders')) {
      return CACHE_CONFIGS.ORDERS.ttl;
    }
    if (url.includes('/conversations')) {
      return CACHE_CONFIGS.CONVERSATIONS.ttl;
    }
    if (url.includes('/messages')) {
      return CACHE_CONFIGS.MESSAGES.ttl;
    }
    if (url.includes('/search')) {
      return CACHE_CONFIGS.SEARCH_RESULTS.ttl;
    }
    
    return CACHE_CONFIGS.PRODUCTS.ttl; // Default
  }

  /**
   * Invalidate related cache entries
   */
  private async invalidateRelatedCache(url: string): Promise<void> {
    const keysToInvalidate: string[] = [];

    if (url.includes('/products/')) {
      keysToInvalidate.push(CACHE_KEYS.PRODUCTS, CACHE_KEYS.PRODUCT_DETAIL);
    }
    if (url.includes('/user/')) {
      keysToInvalidate.push(CACHE_KEYS.USER_PROFILE, CACHE_KEYS.USER_STATS);
    }
    if (url.includes('/orders')) {
      keysToInvalidate.push(CACHE_KEYS.ORDERS);
    }
    if (url.includes('/conversations') || url.includes('/messages')) {
      keysToInvalidate.push(CACHE_KEYS.CONVERSATIONS, CACHE_KEYS.MESSAGES);
    }

    for (const key of keysToInvalidate) {
      await cacheService.delete(key);
    }
  }

  /**
   * Queue offline request
   */
  private async queueOfflineRequest(url: string, method: string, data?: any): Promise<void> {
    const queue = await this.getOfflineQueue();
    const request = {
      id: Date.now().toString(),
      url,
      method,
      data,
      timestamp: Date.now(),
    };
    
    queue.push(request);
    await this.saveOfflineQueue(queue);
  }

  /**
   * Get offline queue
   */
  private async getOfflineQueue(): Promise<any[]> {
    try {
      const queueData = await cacheService.get('offline_queue');
      return queueData || [];
    } catch {
      return [];
    }
  }

  /**
   * Save offline queue
   */
  private async saveOfflineQueue(queue: any[]): Promise<void> {
    await cacheService.set('offline_queue', queue, 24 * 60 * 60 * 1000); // 24 hours
  }

  /**
   * Remove request from offline queue
   */
  private async removeFromOfflineQueue(requestId: string): Promise<void> {
    const queue = await this.getOfflineQueue();
    const filteredQueue = queue.filter(req => req.id !== requestId);
    await this.saveOfflineQueue(filteredQueue);
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new EnhancedApiClient(); 