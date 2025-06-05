import { useEffect, useRef, useState } from 'react';

const DistrictBoundariesLayer = ({ 
  map, 
  selectedState = null, 
  isVisible = true, 
  onDistrictClick = null,
  selectedDistrict = null 
}) => {
  const layersAddedRef = useRef(false);
  const [indiaDistricts, setIndiaDistricts] = useState(null);

  // Load districts data
  useEffect(() => {
    const loadDistrictsData = async () => {
      try {
        const response = await fetch('/india_districts.geojson');
        const data = await response.json();
        console.log('🗺️ Districts GeoJSON loaded:', {
          type: data?.type,
          featuresCount: data?.features?.length,
          sampleFeature: data?.features?.[0]?.properties
        });
        setIndiaDistricts(data);
        // Store globally for helper functions
        window.indiaDistrictsData = data;
      } catch (error) {
        console.error('❌ Error loading districts data:', error);
      }
    };

    loadDistrictsData();
  }, []);

  useEffect(() => {
    if (!map || !indiaDistricts || layersAddedRef.current) return;

    const addDistrictLayers = () => {
      try {
        console.log('🗺️ Adding district layers...');
        console.log('🗺️ Map style loaded:', map.isStyleLoaded());
        console.log('🗺️ Districts data:', {
          type: indiaDistricts?.type,
          featuresCount: indiaDistricts?.features?.length
        });

        // Add districts data source
        if (!map.getSource('india-districts')) {
          console.log('🗺️ Adding districts source...');
          map.addSource('india-districts', {
            type: 'geojson',
            data: indiaDistricts,
          });
          console.log('✅ Districts source added');
        } else {
          console.log('🗺️ Districts source already exists');
        }

        // Add district boundaries layer
        if (!map.getLayer('district-boundaries')) {
          console.log('🗺️ Adding district-boundaries layer...');
          map.addLayer({
            id: 'district-boundaries',
            type: 'line',
            source: 'india-districts',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#d23a35', // Blue color for all districts
              'line-width': 2, // Consistent width
              'line-opacity': 0.8 // Semi-transparent
            },
            filter: ['==', ['get', 'st_nm'], ''] // Initially hidden
          });
          console.log('✅ District boundaries layer added');
        }

        // Add district fill layer for selected district
        if (!map.getLayer('district-fill')) {
          console.log('🗺️ Adding district-fill layer...');
          map.addLayer({
            id: 'district-fill',
            type: 'fill',
            source: 'india-districts',
            paint: {
              'fill-color': '#3b82f6', // Blue fill
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false], 0.3,
                0
              ]
            },
            filter: ['==', ['get', 'st_nm'], ''] // Initially hidden
          });
          console.log('✅ District fill layer added');
        }

        // Add district labels layer
        if (!map.getLayer('district-labels')) {
          console.log('🗺️ Adding district-labels layer...');
          map.addLayer({
            id: 'district-labels',
            type: 'symbol',
            source: 'india-districts',
            layout: {
              'text-field': ['get', 'district'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': 12,
              'text-anchor': 'center',
              'text-offset': [0, 0],
              'text-allow-overlap': false,
              'text-ignore-placement': false
            },
            paint: {
              'text-color': '#1e40af',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
              'text-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0,
                8, 1
              ]
            },
            filter: ['==', ['get', 'st_nm'], ''] // Initially hidden
          });
          console.log('✅ District labels layer added');
        }

        // Add click handlers
        map.on('click', 'district-boundaries', (e) => {
          if (onDistrictClick && e.features.length > 0) {
            const district = e.features[0];
            onDistrictClick(district.properties);
          }
        });

        map.on('click', 'district-fill', (e) => {
          if (onDistrictClick && e.features.length > 0) {
            const district = e.features[0];
            onDistrictClick(district.properties);
          }
        });

        // Add hover effects
        map.on('mouseenter', 'district-boundaries', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'district-boundaries', () => {
          map.getCanvas().style.cursor = '';
        });

        map.on('mouseenter', 'district-fill', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'district-fill', () => {
          map.getCanvas().style.cursor = '';
        });

        layersAddedRef.current = true;
        console.log('✅ District boundaries layers added successfully');
      } catch (error) {
        console.error('❌ Error adding district layers:', error);
      }
    };

    // Wait for both map and style to be ready
    const checkAndAddLayers = () => {
      if (map.isStyleLoaded() && map.getSource) {
        addDistrictLayers();
      } else {
        console.log('🗺️ Waiting for map style to load...');
        setTimeout(checkAndAddLayers, 100);
      }
    };

    if (map.isStyleLoaded()) {
      addDistrictLayers();
    } else {
      map.on('style.load', addDistrictLayers);
      // Also try with a timeout as backup
      setTimeout(checkAndAddLayers, 1000);
    }

    return () => {
      if (map && layersAddedRef.current) {
        try {
          if (map.getStyle()) {
            ['district-boundaries', 'district-fill', 'district-labels'].forEach(layerId => {
              if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
              }
            });
            if (map.getSource('india-districts')) {
              map.removeSource('india-districts');
            }
          }
          layersAddedRef.current = false;
        } catch (error) {
          console.warn('Error removing district layers:', error);
          layersAddedRef.current = false;
        }
      }
    };
  }, [map, indiaDistricts, onDistrictClick]);

  // Update visibility and filters based on selected state and zoom level
  useEffect(() => {
    if (!map || !layersAddedRef.current) return;

    console.log('🗺️ DistrictBoundariesLayer - State changed:', {
      selectedState,
      isVisible,
      layersAdded: layersAddedRef.current,
      currentZoom: map.getZoom()
    });

    try {
      const layers = ['district-boundaries', 'district-fill', 'district-labels'];
      const currentZoom = map.getZoom();
      
      layers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          if (isVisible) {
            if (selectedState) {
              // Show districts for the selected state
              console.log(`🗺️ Setting filter for ${layerId}: st_nm = ${selectedState}`);
              map.setFilter(layerId, ['==', ['get', 'st_nm'], selectedState]);
              map.setLayoutProperty(layerId, 'visibility', 'visible');
            } else if (currentZoom >= 6) {
              // Show all districts when zoomed in enough, regardless of state selection
              console.log(`🗺️ Showing all districts at zoom level ${currentZoom}`);
              map.setFilter(layerId, ['!=', ['get', 'st_nm'], '']); // Show all districts
              map.setLayoutProperty(layerId, 'visibility', 'visible');
            } else {
              // Hide districts when zoomed out and no state selected
              console.log(`🗺️ Hiding districts at zoom level ${currentZoom}`);
              map.setFilter(layerId, ['==', ['get', 'st_nm'], '']);
              map.setLayoutProperty(layerId, 'visibility', 'none');
            }
          } else {
            // Hide all districts when not visible
            console.log(`🗺️ Hiding ${layerId} - not visible`);
            map.setFilter(layerId, ['==', ['get', 'st_nm'], '']);
            map.setLayoutProperty(layerId, 'visibility', 'none');
          }
        } else {
          console.warn(`🗺️ Layer ${layerId} not found`);
        }
      });
      
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
    } catch (error) {
      console.error('Error updating district layer visibility:', error);
    }
  }, [map, selectedState, isVisible]);

  // Add zoom change listener to update district visibility
  useEffect(() => {
    if (!map || !layersAddedRef.current) return;

    const handleZoomChange = () => {
      const currentZoom = map.getZoom();
      console.log(`🗺️ Zoom changed to: ${currentZoom}`);
      
      // Trigger re-evaluation of district visibility
      const layers = ['district-boundaries', 'district-fill', 'district-labels'];
      
      layers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          if (isVisible && !selectedState && currentZoom >= 6) {
            // Show all districts when zoomed in enough
            map.setFilter(layerId, ['!=', ['get', 'st_nm'], '']);
            map.setLayoutProperty(layerId, 'visibility', 'visible');
          } else if (!selectedState && currentZoom < 6) {
            // Hide districts when zoomed out
            map.setFilter(layerId, ['==', ['get', 'st_nm'], '']);
            map.setLayoutProperty(layerId, 'visibility', 'none');
          }
        }
      });
    };

    map.on('zoom', handleZoomChange);
    
    return () => {
      map.off('zoom', handleZoomChange);
    };
  }, [map, selectedState, isVisible]);

  return null;
};

// Helper function to create district popup content
export const createDistrictPopup = (district) => {
  return `
    <div class="district-popup">
      <div class="district-popup-header">
        <h3>${district.district}</h3>
        <span class="district-type">🏛️ District</span>
      </div>
      <div class="district-popup-content">
        <p><strong>State:</strong> ${district.st_nm}</p>
        <p><strong>District Code:</strong> ${district.dt_code || 'N/A'}</p>
        <p><strong>State Code:</strong> ${district.st_code || 'N/A'}</p>
      </div>
    </div>
  `;
};

// Helper function to filter districts by state
export const getDistrictsByState = (stateName, districtsData = null) => {
  // Try to get data from the module-level variable or parameter
  const data = districtsData || window.indiaDistrictsData;
  
  if (!data || !data.features) {
    console.warn('Districts data not loaded yet');
    return [];
  }
  
  if (!stateName) {
    // Return all districts when no state is specified
    return data.features;
  }
  
  return data.features.filter(
    district => district.properties.st_nm === stateName
  );
};

// Helper function to get district statistics
export const getDistrictStats = (stateName = null, districtsData = null) => {
  // Try to get data from the module-level variable or parameter
  const data = districtsData || window.indiaDistrictsData;
  
  if (!data || !data.features) {
    console.warn('Districts data not loaded yet');
    return { total: 0 };
  }
  
  const districts = stateName 
    ? getDistrictsByState(stateName, data)
    : data.features;

  return {
    total: districts.length
  };
};

export default DistrictBoundariesLayer;