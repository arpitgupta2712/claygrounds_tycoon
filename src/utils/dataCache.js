/**
 * Smart Data Cache with TTL (Time To Live) support
 * Optimizes API calls by caching responses with automatic expiration
 */
class DataCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultMaxAge = 300000; // 5 minutes default
    
    // Performance monitoring
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
    
    console.log('🗄️ DataCache initialized');
  }

  /**
   * Get cached data if it exists and hasn't expired
   * @param {string} key - Cache key
   * @param {number} maxAge - Maximum age in milliseconds (default: 5 minutes)
   * @returns {any|null} Cached data or null if not found/expired
   */
  get(key, maxAge = this.defaultMaxAge) {
    if (!this.cache.has(key)) {
      this.stats.misses++;
      return null;
    }

    const timestamp = this.timestamps.get(key);
    const now = Date.now();
    
    // Check if data has expired
    if (now - timestamp > maxAge) {
      this.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      console.log(`🗄️ Cache expired for key: ${key}`);
      return null;
    }

    this.stats.hits++;
    console.log(`🗄️ Cache hit for key: ${key}`);
    return this.cache.get(key);
  }

  /**
   * Store data in cache with timestamp
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} maxAge - Optional custom max age for this entry
   */
  set(key, data, maxAge = null) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
    this.stats.sets++;
    
    // Set custom expiration if provided
    if (maxAge) {
      setTimeout(() => {
        if (this.cache.has(key)) {
          this.delete(key);
          this.stats.evictions++;
          console.log(`🗄️ Cache auto-expired for key: ${key}`);
        }
      }, maxAge);
    }
    
    console.log(`🗄️ Cache set for key: ${key}`);
  }

  /**
   * Delete specific cache entry
   * @param {string} key - Cache key to delete
   */
  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
    console.log(`🗄️ Cache deleted for key: ${key}`);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.timestamps.clear();
    console.log(`🗄️ Cache cleared (${size} entries removed)`);
  }

  /**
   * Get cache statistics
   * @returns {object} Cache performance stats
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;
    
    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`,
      size: this.cache.size
    };
  }

  /**
   * Check if cache has a specific key (regardless of expiration)
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Get all cache keys
   * @returns {string[]} Array of cache keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   * @returns {number} Number of cached entries
   */
  size() {
    return this.cache.size;
  }

  /**
   * Cleanup expired entries manually
   * @param {number} maxAge - Maximum age to consider for cleanup
   */
  cleanup(maxAge = this.defaultMaxAge) {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now - timestamp > maxAge) {
        this.delete(key);
        cleaned++;
        this.stats.evictions++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🗄️ Cache cleanup: ${cleaned} expired entries removed`);
    }
    
    return cleaned;
  }
}

/**
 * Global cache instance for the application
 */
export const globalCache = new DataCache();

/**
 * Cache keys for different data types
 */
export const CACHE_KEYS = {
  STATES_DATA: 'states_geojson_data',
  DISTRICTS_DATA: 'districts_geojson_data',
  CITIES_DATA: 'cities_geojson_data',
  LOCATIONS_ALL: 'locations_all',
  LOCATIONS_ACTIVE: 'locations_active',
  LOCATIONS_BY_STATE: (state) => `locations_state_${state}`,
  LOCATIONS_BY_CITY: (city) => `locations_city_${city}`,
  MAP_BOUNDS: 'map_bounds',
  USER_PREFERENCES: 'user_preferences'
};

/**
 * Cache TTL (Time To Live) configurations
 */
export const CACHE_TTL = {
  SHORT: 60000,      // 1 minute
  MEDIUM: 300000,    // 5 minutes
  LONG: 900000,      // 15 minutes
  VERY_LONG: 3600000 // 1 hour
};

/**
 * Higher-order function to add caching to any async function
 * @param {Function} fn - Async function to cache
 * @param {string} cacheKey - Cache key for this function
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Function} Cached version of the function
 */
export const withCache = (fn, cacheKey, ttl = CACHE_TTL.MEDIUM) => {
  return async (...args) => {
    // Create unique key with arguments
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    
    // Try to get from cache first
    const cached = globalCache.get(key, ttl);
    if (cached !== null) {
      return cached;
    }
    
    try {
      // Execute function and cache result
      const result = await fn(...args);
      globalCache.set(key, result);
      return result;
    } catch (error) {
      console.error(`🗄️ Cache miss and function error for key: ${key}`, error);
      throw error;
    }
  };
};

/**
 * Utility to invalidate cache entries by pattern
 * @param {string} pattern - Pattern to match cache keys
 */
export const invalidateCache = (pattern) => {
  const keys = globalCache.keys();
  let invalidated = 0;
  
  keys.forEach(key => {
    if (key.includes(pattern)) {
      globalCache.delete(key);
      invalidated++;
    }
  });
  
  console.log(`🗄️ Invalidated ${invalidated} cache entries matching pattern: ${pattern}`);
  return invalidated;
};

/**
 * Auto-cleanup function that runs periodically
 */
export const startCacheCleanup = (interval = 600000) => { // 10 minutes default
  const cleanup = () => {
    globalCache.cleanup();
    console.log('🗄️ Periodic cache cleanup completed', globalCache.getStats());
  };
  
  // Run cleanup immediately
  cleanup();
  
  // Set up periodic cleanup
  const intervalId = setInterval(cleanup, interval);
  
  console.log(`🗄️ Cache auto-cleanup started (every ${interval / 1000}s)`);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    console.log('🗄️ Cache auto-cleanup stopped');
  };
};

export default DataCache; 