import { useEffect, useRef, useState } from 'react';

const StateBoundariesLayer = ({ 
  map, 
  selectedState = null,
  availableStates = [],
  isVisible = true, 
  onStateClick = null,
  viewMode = null
}) => {
  const layersAddedRef = useRef(false);
  const [indiaStates, setIndiaStates] = useState(null);

  // Load states data
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/india_states.geojson');
        const data = await response.json();
        console.log('🗺️ States GeoJSON loaded:', {
          type: data?.type,
          featuresCount: data?.features?.length,
          sampleFeature: data?.features?.[0]?.properties
        });
        setIndiaStates(data);
        // Store globally for helper functions
        window.indiaStatesData = data;
      } catch (error) {
        console.error('❌ Error loading states data:', error);
      }
    };

    loadStatesData();
  }, []);

  useEffect(() => {
    if (!map || !indiaStates || layersAddedRef.current) return;

    const addStateLayers = () => {
      try {
        console.log('🗺️ Adding state layers...');
        console.log('🗺️ Map style loaded:', map.isStyleLoaded());
        console.log('🗺️ States data:', {
          type: indiaStates?.type,
          featuresCount: indiaStates?.features?.length
        });

        // Add India states data source
        if (!map.getSource('india-states')) {
          console.log('🗺️ Adding states source...');
          map.addSource('india-states', {
            type: 'geojson',
            data: indiaStates,
          });
          console.log('✅ States source added');
        } else {
          console.log('🗺️ States source already exists');
        }

        // Remove existing state layers to avoid conflicts
        const stateLayers = ['state-highlight', 'state-boundaries', 'state-outline'];
        stateLayers.forEach(layerId => {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
        });

        // Add state highlight layer (for fill)
        map.addLayer({
          id: 'state-highlight',
          type: 'fill',
          source: 'india-states',
          paint: {
            'fill-color': '#B1F727',
            'fill-opacity': 0.1,
          },
        });
        console.log('✅ State highlight layer added');

        // Add state boundaries layer (for outlines)
        map.addLayer({
          id: 'state-boundaries',
          type: 'line',
          source: 'india-states',
          paint: {
            'line-color': '#013540',
            'line-width': 2,
            'line-opacity': 0.8
          },
        });
        console.log('✅ State boundaries layer added');

        // Add state outline layer (for hover effects)
        map.addLayer({
          id: 'state-outline',
          type: 'line',
          source: 'india-states',
          paint: {
            'line-color': '#809AA0',
            'line-width': 4,
            'line-opacity': 0.9
          },
          filter: ['==', ['get', 'st_nm'], ''], // Initially hidden
        });
        console.log('✅ State outline layer added');

        // Add click handlers
        map.on('click', 'state-highlight', (e) => {
          if (onStateClick && e.features.length > 0) {
            const stateName = e.features[0].properties?.st_nm;
            console.log('🗺️ Clicked state from map:', stateName);
            console.log('🗺️ Available states:', availableStates);
            console.log('🗺️ State name match:', availableStates.includes(stateName));
            if (stateName && availableStates.includes(stateName)) {
              onStateClick(stateName);
            } else {
              console.warn('⚠️ State not found in available states:', stateName);
            }
          }
        });

        // Add hover effects
        map.on('mouseenter', 'state-highlight', (e) => {
          if (viewMode !== 'STATE_SELECTION') return;
          map.getCanvas().style.cursor = 'pointer';
          const stateName = e.features[0].properties?.st_nm;
          if (stateName && availableStates.includes(stateName)) {
            if (map.getLayer('state-outline')) {
              map.setFilter('state-outline', ['==', ['get', 'st_nm'], stateName]);
            }
          }
        });

        map.on('mouseleave', 'state-highlight', () => {
          if (viewMode !== 'STATE_SELECTION') return;
          map.getCanvas().style.cursor = '';
          if (map.getLayer('state-outline')) {
            map.setFilter('state-outline', ['==', ['get', 'st_nm'], '']);
          }
        });

        layersAddedRef.current = true;
        console.log('✅ State boundaries layers added successfully');
      } catch (error) {
        console.error('❌ Error adding state layers:', error);
      }
    };

    // Wait for both map and style to be ready
    const checkAndAddLayers = () => {
      if (map.isStyleLoaded() && map.getSource) {
        addStateLayers();
      } else {
        console.log('🗺️ Waiting for map style to load...');
        setTimeout(checkAndAddLayers, 100);
      }
    };

    if (map.isStyleLoaded()) {
      addStateLayers();
    } else {
      map.on('style.load', addStateLayers);
      // Also try with a timeout as backup
      setTimeout(checkAndAddLayers, 1000);
    }

    return () => {
      if (map && layersAddedRef.current) {
        try {
          if (map.getStyle()) {
            ['state-highlight', 'state-boundaries', 'state-outline'].forEach(layerId => {
              if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
              }
            });
            if (map.getSource('india-states')) {
              map.removeSource('india-states');
            }
          }
          layersAddedRef.current = false;
        } catch (error) {
          console.warn('Error removing state layers:', error);
          layersAddedRef.current = false;
        }
      }
    };
  }, [map, indiaStates, onStateClick, availableStates, viewMode]);

  // Update state layer filters based on selected state
  useEffect(() => {
    if (!map || !layersAddedRef.current) return;

    console.log('🗺️ StateBoundariesLayer - State changed:', {
      selectedState,
      isVisible,
      layersAdded: layersAddedRef.current
    });

    try {
      const layers = ['state-boundaries', 'state-highlight', 'state-outline'];
      
      layers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          if (isVisible) {
            if (selectedState) {
              // Show only the selected state
              console.log(`🗺️ Setting filter for ${layerId}: st_nm = ${selectedState}`);
              map.setFilter(layerId, ['==', ['get', 'st_nm'], selectedState]);
              map.setLayoutProperty(layerId, 'visibility', 'visible');
            } else {
              // Show all states
              console.log(`🗺️ Showing all states for ${layerId}`);
              map.setFilter(layerId, null);
              map.setLayoutProperty(layerId, 'visibility', 'visible');
            }
          } else {
            // Hide all states
            console.log(`🗺️ Hiding ${layerId}`);
            map.setLayoutProperty(layerId, 'visibility', 'none');
          }
        } else {
          console.warn(`🗺️ Layer ${layerId} not found`);
        }
      });
      
      // Debug: Check how many features match the filter
      if (map.getSource('india-states')) {
        const filter = selectedState 
          ? ['==', ['get', 'st_nm'], selectedState]
          : null;
            
        const features = map.querySourceFeatures('india-states', { filter });
        console.log(`🗺️ Found ${features.length} state features visible`);
        if (features.length > 0 && selectedState) {
          console.log('🗺️ Sample state:', features[0].properties);
        }
      }
    } catch (error) {
      console.error('Error updating state layer visibility:', error);
    }
  }, [map, selectedState, isVisible]);

  return null;
};

// Helper function to create state popup content
export const createStatePopup = (state) => {
  return `
    <div class="state-popup">
      <div class="state-popup-header">
        <h3>${state.st_nm}</h3>
        <span class="state-type">🏛️ State</span>
      </div>
      <div class="state-popup-content">
        <p><strong>State Code:</strong> ${state.st_code || 'N/A'}</p>
        <p><strong>Type:</strong> ${state.type || 'State'}</p>
      </div>
    </div>
  `;
};

// Helper function to filter states by availability
export const getAvailableStatesFromData = () => {
  const data = window.indiaStatesData;
  
  if (!data || !data.features) {
    console.warn('States data not loaded yet');
    return [];
  }
  
  return data.features.map(state => state.properties.st_nm).filter(Boolean).sort();
};

// Helper function to get state statistics
export const getStateStats = () => {
  const data = window.indiaStatesData;
  
  if (!data || !data.features) {
    console.warn('States data not loaded yet');
    return { total: 0 };
  }
  
  return {
    total: data.features.length
  };
};

export default StateBoundariesLayer; 