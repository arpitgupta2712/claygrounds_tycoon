import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing map control states
 * @param {Object} map - Mapbox GL map instance
 * @param {Object} initialState - Initial control state
 * @returns {Object} Control state and handlers
 */
export const useMapControls = (map, initialState = {}) => {
  const [controlState, setControlState] = useState({
    selectedState: null,
    selectedDistrict: null,
    selectedCity: null,
    showStates: true,
    showDistricts: false,
    showCities: false,
    currentView: 'top-down',
    mapStyle: 'mapbox://styles/mapbox/streets-v11',
    cityFilter: 'all',
    viewMode: 'STATE_SELECTION',
    isAnimating: false,
    ...initialState
  });

  // Update state selection
  const setSelectedState = useCallback((stateName) => {
    setControlState(prev => ({
      ...prev,
      selectedState: stateName,
      selectedDistrict: null, // Clear district when state changes
      showDistricts: !!stateName, // Show districts when state is selected
      viewMode: stateName ? 'STATE_FOCUSED' : 'STATE_SELECTION'
    }));
  }, []);

  // Update district selection
  const setSelectedDistrict = useCallback((district) => {
    setControlState(prev => ({
      ...prev,
      selectedDistrict: district
    }));
  }, []);

  // Update city selection
  const setSelectedCity = useCallback((city) => {
    setControlState(prev => ({
      ...prev,
      selectedCity: city
    }));
  }, []);

  // Toggle layer visibility
  const toggleLayer = useCallback((layerType, visible) => {
    setControlState(prev => ({
      ...prev,
      [`show${layerType.charAt(0).toUpperCase() + layerType.slice(1)}`]: visible
    }));
  }, []);

  // Change map view
  const changeView = useCallback((viewConfig) => {
    if (!map) return;

    setControlState(prev => ({
      ...prev,
      currentView: viewConfig.id,
      isAnimating: true
    }));

    // Animate map to new view
    map.easeTo({
      pitch: viewConfig.pitch,
      bearing: viewConfig.bearing,
      duration: 1000
    });

    // Reset animation state after transition
    setTimeout(() => {
      setControlState(prev => ({
        ...prev,
        isAnimating: false
      }));
    }, 1000);
  }, [map]);

  // Change map style
  const changeMapStyle = useCallback((styleUrl) => {
    if (!map) return;

    setControlState(prev => ({
      ...prev,
      mapStyle: styleUrl,
      isAnimating: true
    }));

    map.setStyle(styleUrl);

    // Reset animation state after style loads
    map.once('style.load', () => {
      setControlState(prev => ({
        ...prev,
        isAnimating: false
      }));
    });
  }, [map]);

  // Change city filter
  const changeCityFilter = useCallback((filter) => {
    setControlState(prev => ({
      ...prev,
      cityFilter: filter
    }));
  }, []);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setControlState(prev => ({
      ...prev,
      selectedState: null,
      selectedDistrict: null,
      selectedCity: null,
      showDistricts: false,
      viewMode: 'STATE_SELECTION'
    }));
  }, []);

  // Reset to initial view
  const resetView = useCallback(() => {
    if (!map) return;

    const indiaCenter = [78.9629, 20.5937];
    
    setControlState(prev => ({
      ...prev,
      isAnimating: true
    }));

    map.easeTo({
      center: indiaCenter,
      zoom: 4,
      pitch: 0,
      bearing: 0,
      duration: 1500
    });

    setTimeout(() => {
      setControlState(prev => ({
        ...prev,
        isAnimating: false
      }));
    }, 1500);
  }, [map]);

  // Fly to location
  const flyToLocation = useCallback((coordinates, zoom = 10) => {
    if (!map || !coordinates) return;

    setControlState(prev => ({
      ...prev,
      isAnimating: true
    }));

    map.flyTo({
      center: coordinates,
      zoom: zoom,
      duration: 2000
    });

    setTimeout(() => {
      setControlState(prev => ({
        ...prev,
        isAnimating: false
      }));
    }, 2000);
  }, [map]);

  // Fit bounds to features
  const fitBounds = useCallback((bounds, options = {}) => {
    if (!map || !bounds) return;

    setControlState(prev => ({
      ...prev,
      isAnimating: true
    }));

    map.fitBounds(bounds, {
      padding: 50,
      duration: 1500,
      ...options
    });

    setTimeout(() => {
      setControlState(prev => ({
        ...prev,
        isAnimating: false
      }));
    }, 1500);
  }, [map]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!map) return;

      switch (event.key) {
        case 'Escape':
          clearSelections();
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetView();
          }
          break;
        case '1':
          changeView({ id: 'top-down', pitch: 0, bearing: 0 });
          break;
        case '2':
          changeView({ id: 'isometric', pitch: 60, bearing: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [map, clearSelections, resetView, changeView]);

  return {
    // State
    ...controlState,
    
    // Actions
    setSelectedState,
    setSelectedDistrict,
    setSelectedCity,
    toggleLayer,
    changeView,
    changeMapStyle,
    changeCityFilter,
    clearSelections,
    resetView,
    flyToLocation,
    fitBounds,
    
    // Computed values
    hasSelection: !!(controlState.selectedState || controlState.selectedDistrict || controlState.selectedCity),
    isStateSelected: !!controlState.selectedState,
    isDistrictSelected: !!controlState.selectedDistrict,
    isCitySelected: !!controlState.selectedCity
  };
};

/**
 * Hook for managing view modes specifically for the game UI
 */
export const useGameViewMode = (initialMode = 'STATE_SELECTION') => {
  const [viewMode, setViewMode] = useState(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeViewMode = useCallback((newMode, transitionDuration = 500) => {
    setIsTransitioning(true);
    setViewMode(newMode);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  }, []);

  const goToStateSelection = useCallback(() => {
    changeViewMode('STATE_SELECTION');
  }, [changeViewMode]);

  const goToStateFocused = useCallback((stateName) => {
    changeViewMode('STATE_FOCUSED');
  }, [changeViewMode]);

  const goToLocationNavigation = useCallback(() => {
    changeViewMode('LOCATION_NAVIGATION');
  }, [changeViewMode]);

  return {
    viewMode,
    isTransitioning,
    changeViewMode,
    goToStateSelection,
    goToStateFocused,
    goToLocationNavigation
  };
};

/**
 * Hook for managing layer visibility with performance optimization
 */
export const useLayerVisibility = (map, initialVisibility = {}) => {
  const [layerVisibility, setLayerVisibility] = useState({
    states: true,
    districts: false,
    cities: false,
    ...initialVisibility
  });

  const toggleLayerVisibility = useCallback((layerType, visible) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerType]: visible
    }));

    // Update map layer visibility
    if (map) {
      const layerIds = getLayerIdsByType(layerType);
      layerIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
        }
      });
    }
  }, [map]);

  const showOnlyLayer = useCallback((layerType) => {
    const newVisibility = {
      states: false,
      districts: false,
      cities: false,
      [layerType]: true
    };
    
    setLayerVisibility(newVisibility);

    // Update all layer visibility on map
    if (map) {
      Object.entries(newVisibility).forEach(([type, visible]) => {
        const layerIds = getLayerIdsByType(type);
        layerIds.forEach(layerId => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
          }
        });
      });
    }
  }, [map]);

  return {
    layerVisibility,
    toggleLayerVisibility,
    showOnlyLayer
  };
};

// Helper function to get layer IDs by type
const getLayerIdsByType = (layerType) => {
  const layerMap = {
    states: ['state-highlight', 'state-boundaries', 'state-outline'],
    districts: ['district-fill', 'district-boundaries', 'district-labels'],
    cities: ['cities-points', 'cities-labels']
  };
  
  return layerMap[layerType] || [];
}; 