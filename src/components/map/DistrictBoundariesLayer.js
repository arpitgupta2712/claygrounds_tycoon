import React, { useEffect, useRef } from 'react';
import indiaDistricts from '../../assets/geojson/india_districts.geojson';

const DistrictBoundariesLayer = ({ 
  map, 
  selectedState = null, 
  isVisible = true, 
  onDistrictClick = null,
  selectedDistrict = null 
}) => {
  const layersAddedRef = useRef(false);

  useEffect(() => {
    if (!map || layersAddedRef.current) return;

    const addDistrictLayers = () => {
      try {
        // Add districts data source
        if (!map.getSource('india-districts')) {
          map.addSource('india-districts', {
            type: 'geojson',
            data: indiaDistricts,
          });
        }

        // Add district boundaries layer
        if (!map.getLayer('district-boundaries')) {
          map.addLayer({
            id: 'district-boundaries',
            type: 'line',
            source: 'india-districts',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': [
                'case',
                ['==', ['get', 'district_type'], 'metro'], '#e74c3c',
                ['==', ['get', 'district_type'], 'major'], '#f39c12',
                ['==', ['get', 'district_type'], 'city'], '#3498db',
                '#95a5a6' // regional
              ],
              'line-width': [
                'case',
                ['==', ['get', 'district_type'], 'metro'], 3,
                ['==', ['get', 'district_type'], 'major'], 2.5,
                ['==', ['get', 'district_type'], 'city'], 2,
                1.5 // regional
              ],
              'line-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false], 1,
                0.7
              ]
            },
            filter: ['==', ['get', 'state'], ''] // Initially hidden
          });
        }

        // Add district fill layer for selected district
        if (!map.getLayer('district-fill')) {
          map.addLayer({
            id: 'district-fill',
            type: 'fill',
            source: 'india-districts',
            paint: {
              'fill-color': [
                'case',
                ['==', ['get', 'district_type'], 'metro'], '#e74c3c',
                ['==', ['get', 'district_type'], 'major'], '#f39c12',
                ['==', ['get', 'district_type'], 'city'], '#3498db',
                '#95a5a6' // regional
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false], 0.3,
                0
              ]
            },
            filter: ['==', ['get', 'state'], ''] // Initially hidden
          });
        }

        // Add district labels layer
        if (!map.getLayer('district-labels')) {
          map.addLayer({
            id: 'district-labels',
            type: 'symbol',
            source: 'india-districts',
            layout: {
              'text-field': ['get', 'city_name'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': [
                'case',
                ['==', ['get', 'district_type'], 'metro'], 14,
                ['==', ['get', 'district_type'], 'major'], 12,
                ['==', ['get', 'district_type'], 'city'], 11,
                10 // regional
              ],
              'text-anchor': 'center',
              'text-offset': [0, 0],
              'text-allow-overlap': false,
              'text-ignore-placement': false
            },
            paint: {
              'text-color': '#2c3e50',
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
            filter: ['==', ['get', 'state'], ''] // Initially hidden
          });
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

    if (map.isStyleLoaded()) {
      addDistrictLayers();
    } else {
      map.on('style.load', addDistrictLayers);
    }

    return () => {
      if (map && layersAddedRef.current) {
        try {
          ['district-boundaries', 'district-fill', 'district-labels'].forEach(layerId => {
            if (map.getLayer(layerId)) {
              map.removeLayer(layerId);
            }
          });
          if (map.getSource('india-districts')) {
            map.removeSource('india-districts');
          }
          layersAddedRef.current = false;
        } catch (error) {
          console.error('Error removing district layers:', error);
        }
      }
    };
  }, [map]);

  // Update visibility and filters based on selected state
  useEffect(() => {
    if (!map || !layersAddedRef.current) return;

    try {
      const layers = ['district-boundaries', 'district-fill', 'district-labels'];
      
      layers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          if (isVisible && selectedState) {
            // Show districts for the selected state
            map.setFilter(layerId, ['==', ['get', 'state'], selectedState]);
            map.setLayoutProperty(layerId, 'visibility', 'visible');
          } else {
            // Hide all districts
            map.setFilter(layerId, ['==', ['get', 'state'], '']);
            map.setLayoutProperty(layerId, 'visibility', 'none');
          }
        }
      });
    } catch (error) {
      console.error('Error updating district layer visibility:', error);
    }
  }, [map, selectedState, isVisible]);

  // Update selected district highlighting
  useEffect(() => {
    if (!map || !layersAddedRef.current) return;

    try {
      // Clear all previous selections
      map.querySourceFeatures('india-districts').forEach(feature => {
        map.setFeatureState(
          { source: 'india-districts', id: feature.id },
          { selected: false }
        );
      });

      // Highlight selected district
      if (selectedDistrict) {
        const features = map.querySourceFeatures('india-districts', {
          filter: ['==', ['get', 'id'], selectedDistrict.id]
        });

        if (features.length > 0) {
          map.setFeatureState(
            { source: 'india-districts', id: features[0].id },
            { selected: true }
          );
        }
      }
    } catch (error) {
      console.error('Error updating selected district:', error);
    }
  }, [map, selectedDistrict]);

  return null; // This is a layer component, no UI to render
};

// Helper function to create district popup content
export const createDistrictPopup = (district) => {
  const typeIcons = {
    metro: '🏙️',
    major: '🌆',
    city: '🏘️',
    regional: '🌾'
  };

  const typeNames = {
    metro: 'Metro District',
    major: 'Major City District',
    city: 'City District',
    regional: 'Regional District'
  };

  return `
    <div class="district-popup">
      <div class="district-popup-header">
        <h3>${district.name}</h3>
        <span class="district-type">${typeIcons[district.district_type]} ${typeNames[district.district_type]}</span>
      </div>
      <div class="district-popup-content">
        <p><strong>State:</strong> ${district.state}</p>
        <p><strong>Primary City:</strong> ${district.city_name}</p>
        ${district.cities_count ? `<p><strong>Cities:</strong> ${district.cities_count}</p>` : ''}
        ${district.population_rank < 500 ? `<p><strong>Population Rank:</strong> #${district.population_rank}</p>` : ''}
      </div>
    </div>
  `;
};

// Helper function to filter districts by state
export const getDistrictsByState = (stateName) => {
  return indiaDistricts.features.filter(
    district => district.properties.state === stateName
  );
};

// Helper function to get district statistics
export const getDistrictStats = (stateName = null) => {
  const districts = stateName 
    ? getDistrictsByState(stateName)
    : indiaDistricts.features;

  const stats = {
    total: districts.length,
    metro: 0,
    major: 0,
    city: 0,
    regional: 0
  };

  districts.forEach(district => {
    stats[district.properties.district_type]++;
  });

  return stats;
};

export default DistrictBoundariesLayer; 