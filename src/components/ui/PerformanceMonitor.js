import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { globalCache } from '../../utils/dataCache';
import { getCacheStats } from '../../hooks/useGeoJSONData';

/**
 * Performance Monitor Component
 * Displays real-time performance metrics, cache statistics, and memory usage
 * Only visible in development mode
 */
const PerformanceMonitor = ({ 
  isVisible = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  updateInterval = 2000 
}) => {
  const [stats, setStats] = useState({
    cache: {},
    memory: {},
    timing: {},
    renders: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // Track component renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  }, []);

  // Memoized position styles
  const positionStyles = useMemo(() => {
    const positions = {
      'top-left': { top: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' }
    };
    return positions[position] || positions['bottom-right'];
  }, [position]);

  // Collect performance metrics
  const collectMetrics = useCallback(() => {
    try {
      // Cache statistics
      const cacheStats = globalCache.getStats();
      const geoJsonStats = getCacheStats();

      // Memory usage (if available)
      const memoryInfo = performance.memory ? {
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
        totalJSHeapSize: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
        jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
      } : null;

      // Performance timing
      const navigation = performance.getEntriesByType('navigation')[0];
      const timingInfo = navigation ? {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      } : {};

      setStats({
        cache: {
          ...cacheStats,
          geojson: geoJsonStats
        },
        memory: memoryInfo,
        timing: timingInfo,
        renders: renderCount
      });
    } catch (error) {
      console.warn('Performance monitoring error:', error);
    }
  }, [renderCount]);

  // Update metrics periodically
  useEffect(() => {
    if (!isVisible) return;

    collectMetrics();
    const interval = setInterval(collectMetrics, updateInterval);

    return () => clearInterval(interval);
  }, [isVisible, updateInterval, collectMetrics]);

  // Toggle expanded view
  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Clear cache action
  const handleClearCache = useCallback(() => {
    globalCache.clear();
    collectMetrics();
  }, [collectMetrics]);

  if (!isVisible) return null;

  return (
    <div 
      className="cg-performance-monitor"
      style={{
        position: 'fixed',
        ...positionStyles,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '12px',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #333',
        minWidth: isExpanded ? '300px' : '120px',
        maxWidth: '400px',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: isExpanded ? '10px' : '0'
        }}
        onClick={handleToggle}
      >
        <span>⚡ Performance</span>
        <span style={{ fontSize: '10px' }}>
          {isExpanded ? '▼' : '▶'} {stats.cache.hitRate || '0%'}
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
          {/* Cache Statistics */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ color: '#ffff00', fontWeight: 'bold' }}>🗄️ Cache</div>
            <div>Hit Rate: {stats.cache.hitRate}</div>
            <div>Hits: {stats.cache.hits} | Misses: {stats.cache.misses}</div>
            <div>Size: {stats.cache.size} entries</div>
            <div>GeoJSON: {stats.cache.geojson?.geojsonCacheSize || 0} files</div>
          </div>

          {/* Memory Usage */}
          {stats.memory && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: '#ffff00', fontWeight: 'bold' }}>💾 Memory (MB)</div>
              <div>Used: {stats.memory.usedJSHeapSize}</div>
              <div>Total: {stats.memory.totalJSHeapSize}</div>
              <div>Limit: {stats.memory.jsHeapSizeLimit}</div>
            </div>
          )}

          {/* Performance Timing */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ color: '#ffff00', fontWeight: 'bold' }}>⏱️ Timing (ms)</div>
            <div>DOM Ready: {stats.timing.domContentLoaded || 'N/A'}</div>
            <div>Load Complete: {stats.timing.loadComplete || 'N/A'}</div>
            <div>First Paint: {Math.round(stats.timing.firstPaint) || 'N/A'}</div>
            <div>FCP: {Math.round(stats.timing.firstContentfulPaint) || 'N/A'}</div>
          </div>

          {/* Component Stats */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ color: '#ffff00', fontWeight: 'bold' }}>🔄 Component</div>
            <div>Renders: {stats.renders}</div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            <button
              onClick={handleClearCache}
              style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Clear Cache
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#4444ff',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Higher-order component to add performance monitoring to any component
 */
export const withPerformanceMonitoring = (WrappedComponent, componentName = 'Component') => {
  return React.memo(function PerformanceMonitoredComponent(props) {
    const [renderCount, setRenderCount] = useState(0);
    const [lastRenderTime, setLastRenderTime] = useState(Date.now());

    useEffect(() => {
      const now = Date.now();
      setRenderCount(prev => prev + 1);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 ${componentName} rendered #${renderCount + 1} (${now - lastRenderTime}ms since last render)`);
      }
      
      setLastRenderTime(now);
    }, [renderCount, lastRenderTime, componentName]);

    return <WrappedComponent {...props} />;
  });
};

/**
 * Hook to track component performance
 */
export const usePerformanceTracking = (componentName) => {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: Date.now(),
    averageRenderTime: 0
  });

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRender = now - metrics.lastRenderTime;
    
    setMetrics(prev => ({
      renderCount: prev.renderCount + 1,
      lastRenderTime: now,
      averageRenderTime: prev.renderCount > 0 
        ? (prev.averageRenderTime + timeSinceLastRender) / 2 
        : timeSinceLastRender
    }));

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${componentName} performance:`, {
        render: metrics.renderCount + 1,
        timeSinceLastRender,
        averageRenderTime: metrics.averageRenderTime
      });
    }
  }, [metrics.lastRenderTime, metrics.renderCount, metrics.averageRenderTime, componentName]);

  return metrics;
};

export default React.memo(PerformanceMonitor); 