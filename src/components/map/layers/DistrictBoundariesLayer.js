import React, { useEffect } from 'react';
import { useIndiaDistrictsData, useDistrictBoundariesLayer } from '../../../hooks';

/**
 * Optimized District Boundaries Layer Component
 * Renders district boundaries on the map with state-based filtering
 */
const DistrictBoundariesLayer = ({ 
  map, 
  selectedState = null, 
  isVisible = true, 
  onDistrictClick = null,
  selectedDistrict = null
}) => {
  // Fetch districts data with caching
  const { data: districtsData, loading, error } = useIndiaDistrictsData();

  // Handle district click events
  const handleDistrictClick = (feature, event) => {
    if (onDistrictClick && feature.properties) {
      const district = feature.properties;
      console.log('🗺️ District clicked:', district.district);
      onDistrictClick(district);
    }
  };

  // Use the district boundaries layer hook
  const { updateLayer } = useDistrictBoundariesLayer(map, districtsData, {
    onLayerClick: handleDistrictClick,
    dependencies: [selectedState, selectedDistrict, isVisible]
  });

  // Update layer visibility and filters when props change
  useEffect(() => {
    if (!map || !updateLayer || !districtsData) return;

    console.log('🗺️ DistrictBoundariesLayer - Updating layer properties:', {
      selectedState,
      selectedDistrict,
      isVisible,
      currentZoom: map.getZoom()
    });

    const layers = ['district-boundaries', 'district-fill', 'district-labels'];
    const currentZoom = map.getZoom();
    
    layers.forEach(layerId => {
      if (isVisible) {
        if (selectedState) {
          // Show districts for the selected state
          console.log(`🗺️ Setting filter for ${layerId}: st_nm = ${selectedState}`);
          updateLayer(layerId, 'filter', ['==', ['get', 'st_nm'], selectedState]);
          updateLayer(layerId, 'layout.visibility', 'visible');
        } else if (currentZoom >= 6) {
          // Show all districts when zoomed in enough, regardless of state selection
          console.log(`🗺️ Showing all districts at zoom level ${currentZoom}`);
          updateLayer(layerId, 'filter', ['!=', ['get', 'st_nm'], '']); // Show all districts
          updateLayer(layerId, 'layout.visibility', 'visible');
        } else {
          // Hide districts when zoomed out and no state selected
          console.log(`🗺️ Hiding districts at zoom level ${currentZoom}`);
          updateLayer(layerId, 'filter', ['==', ['get', 'st_nm'], '']);
          updateLayer(layerId, 'layout.visibility', 'none');
        }
      } else {
        // Hide all districts when not visible
        console.log(`🗺️ Hiding ${layerId} - not visible`);
        updateLayer(layerId, 'filter', ['==', ['get', 'st_nm'], '']);
        updateLayer(layerId, 'layout.visibility', 'none');
      }
    });

    // Handle selected district highlighting
    if (selectedDistrict && selectedDistrict.district) {
      // Set feature state for selected district
      if (map.getSource('india-districts')) {
        // Find the feature and set its state
        const features = map.querySourceFeatures('india-districts', {
          filter: ['==', ['get', 'district'], selectedDistrict.district]
        });
        
        if (features.length > 0) {
          // Reset all feature states first
          map.removeFeatureState({ source: 'india-districts' });
          
          // Set selected state for the clicked district
          map.setFeatureState(
            { source: 'india-districts', id: features[0].id },
            { selected: true }
          );
          
          console.log(`🗺️ Highlighted district: ${selectedDistrict.district}`);
        }
      }
    } else {
      // Clear all feature states
      if (map.getSource('india-districts')) {
        map.removeFeatureState({ source: 'india-districts' });
      }
    }

    // Debug: Check how many features match the filter
    if (map.getSource('india-districts')) {
      const filter = selectedState 
        ? ['==', ['get', 'st_nm'], selectedState]
        : currentZoom >= 6 
          ? ['!=', ['get', 'st_nm'], '']
          : ['==', ['get', 'st_nm'], ''];
          
      const features = map.querySourceFeatures('india-districts', { filter });
      console.log(`🗺️ Found ${features.length} district features visible`);
      if (features.length > 0 && selectedState) {
        console.log('🗺️ Sample district:', features[0].properties);
      }
    }
  }, [map, updateLayer, selectedState, selectedDistrict, isVisible, districtsData]);

  // Handle zoom changes to show/hide districts
  useEffect(() => {
    if (!map) return;

    const handleZoomChange = () => {
      const currentZoom = map.getZoom();
      console.log(`🗺️ Zoom changed to: ${currentZoom}`);
      
      // Trigger re-evaluation of district visibility
      if (!selectedState && isVisible) {
        const layers = ['district-boundaries', 'district-fill', 'district-labels'];
        
        layers.forEach(layerId => {
          if (currentZoom >= 6) {
            updateLayer(layerId, 'filter', ['!=', ['get', 'st_nm'], '']);
            updateLayer(layerId, 'layout.visibility', 'visible');
          } else {
            updateLayer(layerId, 'filter', ['==', ['get', 'st_nm'], '']);
            updateLayer(layerId, 'layout.visibility', 'none');
          }
        });
      }
    };

    map.on('zoom', handleZoomChange);
    return () => map.off('zoom', handleZoomChange);
  }, [map, selectedState, isVisible, updateLayer]);

  // Handle loading and error states
  if (loading) {
    console.log('🗺️ Loading districts data...');
    return null;
  }

  if (error) {
    console.error('❌ Error loading districts data:', error);
    return null;
  }

  if (!districtsData) {
    console.warn('⚠️ No districts data available');
    return null;
  }

  // This component renders to the map, not the DOM
  return null;
};

// Helper function to create district popup content (preserved from original)
export const createDistrictPopup = (district) => {
  return `
    <div class="district-popup">
      <div class="district-popup-header">
        <h3>${district.district}</h3>
        <span class="district-popup-code">${district.dt_code || 'N/A'}</span>
      </div>
      <div class="district-popup-content">
        <p><strong>State:</strong> ${district.st_nm}</p>
        <p><strong>District Code:</strong> ${district.dt_code || 'N/A'}</p>
        <p><strong>State Code:</strong> ${district.st_code || 'N/A'}</p>
      </div>
    </div>
  `;
};

// Helper function to get districts by state (preserved from original)
export const getDistrictsByState = (stateName, districtsData = null) => {
  const data = districtsData || window.indiaDistrictsData;
  
  if (!data || !data.features) {
    console.warn('Districts data not loaded yet');
    return [];
  }
  
  if (!stateName) {
    // Return all districts
    return data.features;
  }
  
  return data.features.filter(
    feature => feature.properties?.st_nm === stateName
  );
};

// Helper function to get district statistics (preserved from original)
export const getDistrictStats = (stateName = null, districtsData = null) => {
  const data = districtsData || window.indiaDistrictsData;
  
  if (!data || !data.features) {
    return { total: 0 };
  }
  
  let features = data.features;
  if (stateName) {
    features = features.filter(f => f.properties?.st_nm === stateName);
  }
  
  return {
    total: features.length,
    withCodes: features.filter(f => f.properties?.dt_code).length,
    byState: stateName ? features.length : undefined,
    states: [...new Set(data.features.map(f => f.properties?.st_nm))].filter(Boolean).length
  };
};

// Helper function to get all unique states from districts data
export const getStatesFromDistricts = (districtsData = null) => {
  const data = districtsData || window.indiaDistrictsData;
  
  if (!data || !data.features) {
    return [];
  }
  
  return [...new Set(data.features.map(f => f.properties?.st_nm))]
    .filter(Boolean)
    .sort();
};

export default DistrictBoundariesLayer; 