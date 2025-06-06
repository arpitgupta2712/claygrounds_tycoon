import { useState, useEffect, useRef, useCallback } from 'react';
import { globalCache, CACHE_TTL } from '../utils/dataCache';

/**
 * Custom hook for fetching and caching GeoJSON data
 * @param {string} url - URL to fetch GeoJSON data from
 * @param {Object} options - Configuration options
 * @param {number} options.cacheDuration - Cache duration in milliseconds
 * @param {boolean} options.enableCache - Whether to use caching
 * @returns {Object} { data, loading, error, refetch }
 */
export const useGeoJSONData = (url, options = {}) => {
  const {
    cacheDuration = CACHE_TTL.MEDIUM,
    enableCache = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!url) {
      setLoading(false);
      return;
    }

    // Check cache first using advanced cache system
    if (enableCache && !forceRefresh) {
      const cacheKey = `geojson_${url}`;
      const cachedData = globalCache.get(cacheKey, cacheDuration);
      
      if (cachedData) {
        console.log(`🗺️ Using cached data for ${url}`);
        setData(cachedData);
        setLoading(false);
        setError(null);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      console.log(`🗺️ Fetching GeoJSON data from ${url}`);
      
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Validate GeoJSON structure
      if (!jsonData || jsonData.type !== 'FeatureCollection' || !Array.isArray(jsonData.features)) {
        throw new Error('Invalid GeoJSON format');
      }

      console.log(`✅ GeoJSON loaded successfully:`, {
        type: jsonData.type,
        featuresCount: jsonData.features.length,
        url
      });

      // Cache the data using advanced cache system
      if (enableCache) {
        const cacheKey = `geojson_${url}`;
        globalCache.set(cacheKey, jsonData);
      }

      // Store globally for backward compatibility with existing helper functions
      if (url.includes('states')) {
        window.indiaStatesData = jsonData;
      } else if (url.includes('districts')) {
        window.indiaDistrictsData = jsonData;
      } else if (url.includes('cities')) {
        window.indiaCitiesData = jsonData;
      }

      setData(jsonData);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`🗺️ Request aborted for ${url}`);
        return;
      }
      
      console.error(`❌ Error loading GeoJSON from ${url}:`, err);
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [url, cacheDuration, enableCache]);

  const refetch = () => {
    fetchData(true);
  };

  useEffect(() => {
    fetchData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
};

/**
 * Hook specifically for India states data with optimized caching
 */
export const useIndiaStatesData = (options = {}) => {
  return useGeoJSONData('/india_states.geojson', {
    cacheDuration: CACHE_TTL.LONG, // States data changes rarely
    ...options
  });
};

/**
 * Hook specifically for India districts data with optimized caching
 */
export const useIndiaDistrictsData = (options = {}) => {
  return useGeoJSONData('/india_districts.geojson', {
    cacheDuration: CACHE_TTL.LONG, // Districts data changes rarely
    ...options
  });
};

/**
 * Hook specifically for India cities data with optimized caching
 */
export const useIndiaCitiesData = (options = {}) => {
  return useGeoJSONData('/india_cities.geojson', {
    cacheDuration: CACHE_TTL.MEDIUM, // Cities might change more frequently
    ...options
  });
};

/**
 * Clear all GeoJSON cached data
 */
export const clearGeoJSONCache = () => {
  // Clear all geojson cache entries
  const keys = globalCache.keys();
  keys.forEach(key => {
    if (key.startsWith('geojson_')) {
      globalCache.delete(key);
    }
  });
  console.log('🗺️ GeoJSON cache cleared');
};

/**
 * Get GeoJSON cache statistics
 */
export const getCacheStats = () => {
  const allStats = globalCache.getStats();
  const geojsonKeys = globalCache.keys().filter(key => key.startsWith('geojson_'));
  
  return {
    ...allStats,
    geojsonCacheSize: geojsonKeys.length,
    geojsonCachedUrls: geojsonKeys.map(key => key.replace('geojson_', ''))
  };
}; 