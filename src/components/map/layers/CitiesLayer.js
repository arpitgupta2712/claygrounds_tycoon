import React, { useEffect } from 'react';
import { useIndiaCitiesData, useCitiesLayer } from '../../../hooks';

/**
 * Optimized Cities Layer Component
 * Renders cities on the map with population-based styling and filtering
 */
const CitiesLayer = ({ 
  map, 
  isVisible = true, 
  onCityClick = null,
  cityFilter = 'all',
  selectedState = null
}) => {
  // Fetch cities data with caching
  const { data: citiesData, loading, error } = useIndiaCitiesData();

  // Handle city click events
  const handleCityClick = (feature, event) => {
    if (onCityClick && feature.properties) {
      const city = feature.properties;
      console.log('🗺️ City clicked:', city.name);
      onCityClick(city, event.lngLat);
    }
  };

  // Use the cities layer hook
  const { updateLayer } = useCitiesLayer(map, citiesData, {
    onLayerClick: handleCityClick,
    dependencies: [isVisible, cityFilter, selectedState]
  });

  // Update layer visibility and filters when props change
  useEffect(() => {
    if (!map || !updateLayer || !citiesData) return;

    console.log('🗺️ CitiesLayer - Updating layer properties:', {
      isVisible,
      cityFilter,
      selectedState
    });

    const layers = ['cities-points', 'cities-labels'];
    
    layers.forEach(layerId => {
      if (isVisible) {
        // Set visibility
        updateLayer(layerId, 'layout.visibility', 'visible');
        
        // Apply city filter
        let filter = null;
        
        if (cityFilter === 'top-10') {
          filter = ['<=', ['get', 'population_rank'], 10];
        } else if (cityFilter === 'top-50') {
          filter = ['<=', ['get', 'population_rank'], 50];
        } else if (cityFilter === 'metros') {
          filter = ['<=', ['get', 'population_rank'], 10]; // Assuming metros are top 10
        }
        
        // Combine with state filter if selected
        if (selectedState) {
          const stateFilter = ['==', ['get', 'state'], selectedState];
          if (filter) {
            filter = ['all', filter, stateFilter];
          } else {
            filter = stateFilter;
          }
        }
        
        updateLayer(layerId, 'filter', filter);
        
        console.log(`🗺️ Applied filter to ${layerId}:`, filter);
      } else {
        // Hide layer
        updateLayer(layerId, 'layout.visibility', 'none');
      }
    });

    // Update labels filter for zoom-based visibility
    if (isVisible) {
      const labelsFilter = [
        'case',
        ['<', ['zoom'], 6], ['<=', ['get', 'population_rank'], 10], // Show only top 10 cities at low zoom
        ['<', ['zoom'], 8], ['<=', ['get', 'population_rank'], 25], // Show top 25 cities at medium zoom
        true // Show all cities at high zoom
      ];
      
      // Combine with existing filter if any
      let currentFilter = null;
      if (cityFilter === 'top-10') {
        currentFilter = ['<=', ['get', 'population_rank'], 10];
      } else if (cityFilter === 'top-50') {
        currentFilter = ['<=', ['get', 'population_rank'], 50];
      } else if (cityFilter === 'metros') {
        currentFilter = ['<=', ['get', 'population_rank'], 10];
      }
      
      if (selectedState) {
        const stateFilter = ['==', ['get', 'state'], selectedState];
        if (currentFilter) {
          currentFilter = ['all', currentFilter, stateFilter];
        } else {
          currentFilter = stateFilter;
        }
      }
      
      // For labels, combine zoom filter with current filter
      let finalLabelsFilter = labelsFilter;
      if (currentFilter) {
        finalLabelsFilter = ['all', labelsFilter, currentFilter];
      }
      
      updateLayer('cities-labels', 'filter', finalLabelsFilter);
    }
  }, [map, updateLayer, isVisible, cityFilter, selectedState, citiesData]);

  // Handle loading and error states
  if (loading) {
    console.log('🗺️ Loading cities data...');
    return null;
  }

  if (error) {
    console.error('❌ Error loading cities data:', error);
    return null;
  }

  if (!citiesData) {
    console.warn('⚠️ No cities data available');
    return null;
  }

  // This component renders to the map, not the DOM
  return null;
};

// Helper function to create a city popup (preserved from original)
export const createCityPopup = (city, coordinates) => {
  const popupContent = `
    <div class="city-popup">
      <div class="city-popup-header">
        <h3>${city.name}</h3>
        <span class="city-rank">#${city.population_rank}</span>
      </div>
      <div class="city-popup-content">
        <p><strong>State:</strong> ${city.state}</p>
        <p><strong>Population Rank:</strong> ${city.population_rank}</p>
        <p><strong>Coordinates:</strong> ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}</p>
      </div>
    </div>
  `;
  
  return popupContent;
};

// Helper function to filter cities by state (preserved from original)
export const filterCitiesByState = (stateName) => {
  const data = window.indiaCitiesData;
  
  if (!data || !data.features) {
    console.warn('Cities data not loaded yet');
    return { type: 'FeatureCollection', features: [] };
  }
  
  return {
    type: 'FeatureCollection',
    features: data.features.filter(
      feature => feature.properties.state === stateName
    )
  };
};

// Helper function to get top N cities (preserved from original)
export const getTopCities = (n = 10) => {
  const data = window.indiaCitiesData;
  
  if (!data || !data.features) {
    console.warn('Cities data not loaded yet');
    return { type: 'FeatureCollection', features: [] };
  }
  
  return {
    type: 'FeatureCollection',
    features: data.features
      .filter(feature => feature.properties.population_rank <= n)
      .sort((a, b) => a.properties.population_rank - b.properties.population_rank)
  };
};

// Helper function to get cities statistics
export const getCitiesStats = (stateName = null) => {
  const data = window.indiaCitiesData;
  
  if (!data || !data.features) {
    return { total: 0, metros: 0, top50: 0 };
  }
  
  let features = data.features;
  if (stateName) {
    features = features.filter(f => f.properties.state === stateName);
  }
  
  return {
    total: features.length,
    metros: features.filter(f => f.properties.population_rank <= 10).length,
    top50: features.filter(f => f.properties.population_rank <= 50).length,
    byState: stateName ? features.length : undefined
  };
};

export default CitiesLayer; 