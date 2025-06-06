import { useEffect } from 'react';
import { useIndiaStatesData, useStateBoundariesLayer } from '../../../hooks';

/**
 * Optimized State Boundaries Layer Component
 * Renders state boundaries on the map with click and hover interactions
 */
const StateBoundariesLayer = ({ 
  map, 
  selectedState = null,
  availableStates = [],
  isVisible = true, 
  onStateClick = null,
  viewMode = null
}) => {
  // Fetch states data with caching
  const { data: statesData, loading, error } = useIndiaStatesData();

  // Handle state click events
  const handleStateClick = (feature, event) => {
    if (onStateClick && feature.properties) {
      const stateName = feature.properties.st_nm;
      console.log('🗺️ State clicked:', stateName);
      console.log('🗺️ Available states:', availableStates);
      
      if (stateName && availableStates.includes(stateName)) {
        onStateClick(stateName);
      } else {
        console.warn('⚠️ State not found in available states:', stateName);
      }
    }
  };

  // Handle state hover events
  const handleStateHover = (feature, event) => {
    if (viewMode !== 'STATE_SELECTION') return;
    
    const stateName = feature.properties?.st_nm;
    if (stateName && availableStates.includes(stateName) && map) {
      // Update outline layer to show hovered state
      if (map.getLayer('state-outline')) {
        map.setFilter('state-outline', ['==', ['get', 'st_nm'], stateName]);
      }
    }
  };

  // Handle state hover leave events
  const handleStateLeave = () => {
    if (viewMode !== 'STATE_SELECTION') return;
    
    if (map && map.getLayer('state-outline')) {
      map.setFilter('state-outline', ['==', ['get', 'st_nm'], '']);
    }
  };

  // Use the map layer hook
  const { updateLayer } = useStateBoundariesLayer(map, statesData, {
    onLayerClick: handleStateClick,
    onLayerHover: handleStateHover,
    onLayerLeave: handleStateLeave,
    dependencies: [selectedState, availableStates, viewMode]
  });

  // Update layer visibility and filters when props change
  useEffect(() => {
    if (!map || !updateLayer) return;

    console.log('🗺️ StateBoundariesLayer - Updating layer properties:', {
      selectedState,
      isVisible,
      availableStatesCount: availableStates.length
    });

    const layers = ['state-boundaries', 'state-highlight', 'state-outline'];
    
    layers.forEach(layerId => {
      if (isVisible) {
        if (selectedState) {
          // Show only the selected state
          console.log(`🗺️ Setting filter for ${layerId}: st_nm = ${selectedState}`);
          updateLayer(layerId, 'filter', ['==', ['get', 'st_nm'], selectedState]);
          updateLayer(layerId, 'layout.visibility', 'visible');
        } else {
          // Show all states
          console.log(`🗺️ Showing all states for ${layerId}`);
          updateLayer(layerId, 'filter', null);
          updateLayer(layerId, 'layout.visibility', 'visible');
        }
      } else {
        // Hide all states
        console.log(`🗺️ Hiding ${layerId}`);
        updateLayer(layerId, 'layout.visibility', 'none');
      }
    });
  }, [map, selectedState, isVisible, availableStates, updateLayer]);

  // Handle loading and error states
  if (loading) {
    console.log('🗺️ Loading states data...');
    return null;
  }

  if (error) {
    console.error('❌ Error loading states data:', error);
    return null;
  }

  if (!statesData) {
    console.warn('⚠️ No states data available');
    return null;
  }

  // This component renders to the map, not the DOM
  return null;
};

// Helper function to create state popup content (preserved from original)
export const createStatePopup = (state) => {
  return `
    <div class="state-popup">
      <div class="state-popup-header">
        <h3>${state.st_nm}</h3>
        <span class="state-popup-code">${state.st_code || 'N/A'}</span>
      </div>
      <div class="state-popup-content">
        <p><strong>State Code:</strong> ${state.st_code || 'N/A'}</p>
        <p><strong>Census Code:</strong> ${state.census_code || 'N/A'}</p>
      </div>
    </div>
  `;
};

// Helper function to get available states from data (preserved from original)
export const getAvailableStatesFromData = () => {
  const data = window.indiaStatesData;
  
  if (!data || !data.features) {
    console.warn('States data not loaded yet');
    return [];
  }
  
  return data.features
    .map(feature => feature.properties?.st_nm)
    .filter(name => name && name.trim())
    .sort();
};

// Helper function to get state statistics (preserved from original)
export const getStateStats = () => {
  const data = window.indiaStatesData;
  
  if (!data || !data.features) {
    return { total: 0 };
  }
  
  return {
    total: data.features.length,
    withCodes: data.features.filter(f => f.properties?.st_code).length,
    withCensusData: data.features.filter(f => f.properties?.census_code).length
  };
};

export default StateBoundariesLayer; 