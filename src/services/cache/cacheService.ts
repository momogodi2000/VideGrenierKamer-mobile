// src/services/cache/cacheService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>> = new Map();
  private config: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes default
    maxSize: 100,
  };

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Set cache configuration
   */
  setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Store data in cache
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || this.config.ttl);
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt,
    };

    this.cache.set(key, cacheItem);
    await this.saveToStorage();
    this.cleanup();
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    return item ? Date.now() <= item.expiresAt : false;
  }

  /**
   * Remove item from cache
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    await this.saveToStorage();
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
    await AsyncStorage.removeItem('app_cache');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    const validItems = Array.from(this.cache.entries()).filter(
      ([_, item]) => now <= item.expiresAt
    );

    return {
      totalItems: this.cache.size,
      validItems: validItems.length,
      expiredItems: this.cache.size - validItems.length,
      size: this.getCacheSize(),
    };
  }

  /**
   * Clean up expired items
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((item, key) => {
      if (now > item.expiresAt) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.cache.delete(key));

    // Remove oldest items if cache is too large
    if (this.config.maxSize && this.cache.size > this.config.maxSize) {
      const sortedItems = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const itemsToRemove = sortedItems.slice(0, this.cache.size - this.config.maxSize);
      itemsToRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * Calculate cache size in bytes
   */
  private getCacheSize(): number {
    const cacheString = JSON.stringify(Array.from(this.cache.entries()));
    return new Blob([cacheString]).size;
  }

  /**
   * Save cache to AsyncStorage
   */
  private async saveToStorage(): Promise<void> {
    try {
      const cacheData = Array.from(this.cache.entries());
      await AsyncStorage.setItem('app_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  /**
   * Load cache from AsyncStorage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const cacheData = await AsyncStorage.getItem('app_cache');
      if (cacheData) {
        const parsedData = JSON.parse(cacheData);
        this.cache = new Map(parsedData);
        this.cleanup();
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }
}

// Cache keys constants
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product_detail',
  CATEGORIES: 'categories',
  USER_PROFILE: 'user_profile',
  USER_STATS: 'user_stats',
  ORDERS: 'orders',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  SEARCH_RESULTS: 'search_results',
} as const;

// Cache configurations for different data types
export const CACHE_CONFIGS = {
  PRODUCTS: { ttl: 10 * 60 * 1000 }, // 10 minutes
  PRODUCT_DETAIL: { ttl: 30 * 60 * 1000 }, // 30 minutes
  CATEGORIES: { ttl: 60 * 60 * 1000 }, // 1 hour
  USER_PROFILE: { ttl: 15 * 60 * 1000 }, // 15 minutes
  USER_STATS: { ttl: 5 * 60 * 1000 }, // 5 minutes
  ORDERS: { ttl: 2 * 60 * 1000 }, // 2 minutes
  CONVERSATIONS: { ttl: 1 * 60 * 1000 }, // 1 minute
  MESSAGES: { ttl: 30 * 1000 }, // 30 seconds
  SEARCH_RESULTS: { ttl: 5 * 60 * 1000 }, // 5 minutes
} as const;

export default CacheService.getInstance(); 