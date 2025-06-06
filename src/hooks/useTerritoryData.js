import { useState, useEffect, useMemo, useCallback } from 'react';
import { globalCache, CACHE_TTL } from '../utils/dataCache';
import { getDistrictsByState, getStateStats } from '../components/map/layers/DistrictBoundariesLayer';
import { getAvailableStatesFromData } from '../components/map/layers/StateBoundariesLayer';

/**
 * Custom hook for territory business intelligence data
 * Integrates with existing GeoJSON infrastructure and adds business metrics
 */
export const useTerritoryData = (options = {}) => {
  const {
    enableCache = true,
    cacheDuration = CACHE_TTL.MEDIUM
  } = options;

  const [territoryData, setTerritoryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock business data generator (replace with real API calls)
  const generateBusinessMetrics = useCallback((territoryName, territoryType = 'state') => {
    // Simulate business metrics based on territory
    const baseMetrics = {
      facilities: Math.floor(Math.random() * 20) + 1,
      revenue: Math.floor(Math.random() * 10000000) + 1000000, // 1M to 11M
      growth: (Math.random() * 40) - 10, // -10% to +30%
      marketShare: Math.random() * 25 + 5, // 5% to 30%
      activeProjects: Math.floor(Math.random() * 8) + 1,
      totalInvestment: Math.floor(Math.random() * 50000000) + 5000000, // 5M to 55M
      employeeCount: Math.floor(Math.random() * 500) + 50,
      customerSatisfaction: Math.random() * 30 + 70, // 70% to 100%
      marketOpportunity: Math.random() * 100, // 0 to 100 opportunity score
      competitorCount: Math.floor(Math.random() * 15) + 2
    };

    // Add territory-specific variations
    if (territoryType === 'state') {
      // States typically have higher numbers
      baseMetrics.facilities *= 3;
      baseMetrics.revenue *= 2;
      baseMetrics.employeeCount *= 4;
    }

    return baseMetrics;
  }, []);

  // Get territory business data with caching
  const getTerritoryBusinessData = useCallback(async (territoryName, territoryType = 'state') => {
    const cacheKey = `territory_business_${territoryType}_${territoryName}`;
    
    if (enableCache) {
      const cachedData = globalCache.get(cacheKey, cacheDuration);
      if (cachedData) {
        console.log(`🏢 Using cached business data for ${territoryName}`);
        return cachedData;
      }
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const businessData = {
      territory: {
        name: territoryName,
        type: territoryType
      },
      metrics: generateBusinessMetrics(territoryName, territoryType),
      lastUpdated: new Date().toISOString(),
      trends: {
        revenue: Math.random() > 0.5 ? 'up' : 'down',
        facilities: Math.random() > 0.7 ? 'up' : 'stable',
        growth: Math.random() > 0.6 ? 'up' : 'down'
      }
    };

    // Cache the data
    if (enableCache) {
      globalCache.set(cacheKey, businessData);
    }

    console.log(`🏢 Generated business data for ${territoryName}:`, businessData);
    return businessData;
  }, [enableCache, cacheDuration, generateBusinessMetrics]);

  // Get enhanced state data with business metrics
  const getEnhancedStateData = useCallback(async (stateName) => {
    try {
      setLoading(true);
      setError(null);

      // Get existing geographic data
      const districts = getDistrictsByState(stateName);
      const stateStats = getStateStats();
      
      // Get business data
      const businessData = await getTerritoryBusinessData(stateName, 'state');
      
      // Get district business data
      const districtBusinessData = await Promise.all(
        districts.slice(0, 5).map(async (district) => { // Limit to 5 for performance
          const districtName = district.properties?.district;
          if (districtName) {
            return await getTerritoryBusinessData(districtName, 'district');
          }
          return null;
        })
      );

      const enhancedData = {
        ...businessData,
        geographic: {
          districts: districts.length,
          stateStats,
          topDistricts: districtBusinessData.filter(Boolean).slice(0, 3)
        }
      };

      setTerritoryData(prev => ({
        ...prev,
        [stateName]: enhancedData
      }));

      return enhancedData;
    } catch (err) {
      console.error(`❌ Error loading territory data for ${stateName}:`, err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getTerritoryBusinessData]);

  // Get all available states with business preview data
  const getAllStatesWithBusinessData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const availableStates = getAvailableStatesFromData();
      
      // Get business preview for all states (lighter data)
      const statesWithBusiness = await Promise.all(
        availableStates.map(async (stateName) => {
          const businessData = await getTerritoryBusinessData(stateName, 'state');
          return {
            name: stateName,
            preview: {
              facilities: businessData.metrics.facilities,
              revenue: businessData.metrics.revenue,
              growth: businessData.metrics.growth,
              marketOpportunity: businessData.metrics.marketOpportunity,
              trend: businessData.trends.revenue
            }
          };
        })
      );

      const allStatesData = {
        states: statesWithBusiness,
        summary: {
          totalStates: statesWithBusiness.length,
          totalFacilities: statesWithBusiness.reduce((sum, state) => sum + state.preview.facilities, 0),
          totalRevenue: statesWithBusiness.reduce((sum, state) => sum + state.preview.revenue, 0),
          averageGrowth: statesWithBusiness.reduce((sum, state) => sum + state.preview.growth, 0) / statesWithBusiness.length
        }
      };

      setTerritoryData(prev => ({
        ...prev,
        _allStates: allStatesData
      }));

      return allStatesData;
    } catch (err) {
      console.error('❌ Error loading all states business data:', err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getTerritoryBusinessData]);

  // Memoized territory analytics
  const territoryAnalytics = useMemo(() => {
    if (!territoryData._allStates) return null;

    const { states, summary } = territoryData._allStates;
    
    return {
      topPerformers: states
        .sort((a, b) => b.preview.revenue - a.preview.revenue)
        .slice(0, 3),
      fastestGrowing: states
        .sort((a, b) => b.preview.growth - a.preview.growth)
        .slice(0, 3),
      highestOpportunity: states
        .sort((a, b) => b.preview.marketOpportunity - a.preview.marketOpportunity)
        .slice(0, 3),
      summary
    };
  }, [territoryData._allStates]);

  // Format currency helper
  const formatCurrency = useCallback((amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
  }, []);

  // Format percentage helper
  const formatPercentage = useCallback((value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }, []);

  return {
    territoryData,
    territoryAnalytics,
    loading,
    error,
    getEnhancedStateData,
    getAllStatesWithBusinessData,
    formatCurrency,
    formatPercentage
  };
};

/**
 * Hook specifically for state territory data
 */
export const useStateTerritory = (stateName) => {
  const { getEnhancedStateData, territoryData, loading, error, formatCurrency, formatPercentage } = useTerritoryData();
  
  useEffect(() => {
    if (stateName && !territoryData[stateName]) {
      getEnhancedStateData(stateName);
    }
  }, [stateName, getEnhancedStateData, territoryData]);

  return {
    stateData: territoryData[stateName] || null,
    loading,
    error,
    formatCurrency,
    formatPercentage
  };
};

/**
 * Hook for all states overview
 */
export const useAllStatesOverview = () => {
  const { getAllStatesWithBusinessData, territoryData, territoryAnalytics, loading, error, formatCurrency, formatPercentage } = useTerritoryData();
  
  useEffect(() => {
    if (!territoryData._allStates) {
      getAllStatesWithBusinessData();
    }
  }, [getAllStatesWithBusinessData, territoryData._allStates]);

  return {
    allStatesData: territoryData._allStates || null,
    territoryAnalytics,
    loading,
    error,
    formatCurrency,
    formatPercentage
  };
}; 