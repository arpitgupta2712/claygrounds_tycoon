import React, { useEffect, useRef } from 'react';
import indiaCities from '../../assets/geojson/india_cities.geojson';

const CitiesLayer = ({ map, isVisible = true, onCityClick = null }) => {
  const layersAddedRef = useRef(false);

  useEffect(() => {
    if (!map || layersAddedRef.current) return;

    const addCitiesLayer = () => {
      try {
        // Add cities data source
        if (!map.getSource('india-cities')) {
          map.addSource('india-cities', {
            type: 'geojson',
            data: indiaCities,
          });
        }

        // Add city points layer
        if (!map.getLayer('cities-points')) {
          map.addLayer({
            id: 'cities-points',
            type: 'circle',
            source: 'india-cities',
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 3,
                8, 6,
                12, 10
              ],
              'circle-color': [
                'case',
                ['<=', ['get', 'population_rank'], 10], '#ef4444', // Top 10 cities - red
                ['<=', ['get', 'population_rank'], 50], '#f97316', // Top 50 cities - orange
                '#64748b' // Other cities - gray
              ],
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1,
              'circle-opacity': 0.8
            }
          });
        }

        // Add city labels layer
        if (!map.getLayer('cities-labels')) {
          map.addLayer({
            id: 'cities-labels',
            type: 'symbol',
            source: 'india-cities',
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 8,
                8, 12,
                12, 16
              ],
              'text-offset': [0, 1.5],
              'text-anchor': 'top',
              'text-allow-overlap': false,
              'text-ignore-placement': false
            },
            paint: {
              'text-color': '#1f2937',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1
            },
            filter: [
              'case',
              ['<', ['zoom'], 6], ['<=', ['get', 'population_rank'], 10], // Show only top 10 cities at low zoom
              ['<', ['zoom'], 8], ['<=', ['get', 'population_rank'], 25], // Show top 25 cities at medium zoom
              true // Show all cities at high zoom
            ]
          });
        }

        // Add click handlers
        map.on('click', 'cities-points', (e) => {
          if (onCityClick && e.features.length > 0) {
            const city = e.features[0].properties;
            onCityClick(city, e.lngLat);
          }
        });

        // Add hover effects
        map.on('mouseenter', 'cities-points', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'cities-points', () => {
          map.getCanvas().style.cursor = '';
        });

        layersAddedRef.current = true;
        console.log('✅ Cities layer added successfully');
      } catch (error) {
        console.error('❌ Error adding cities layer:', error);
      }
    };

    // Add layers when map style is loaded
    if (map.isStyleLoaded()) {
      addCitiesLayer();
    } else {
      map.on('style.load', addCitiesLayer);
    }

    return () => {
      // Cleanup function
      if (map.getLayer('cities-labels')) {
        map.removeLayer('cities-labels');
      }
      if (map.getLayer('cities-points')) {
        map.removeLayer('cities-points');
      }
      if (map.getSource('india-cities')) {
        map.removeSource('india-cities');
      }
      layersAddedRef.current = false;
    };
  }, [map, onCityClick]);

  // Toggle layer visibility
  useEffect(() => {
    if (!map || !layersAddedRef.current) return;

    const visibility = isVisible ? 'visible' : 'none';
    
    if (map.getLayer('cities-points')) {
      map.setLayoutProperty('cities-points', 'visibility', visibility);
    }
    if (map.getLayer('cities-labels')) {
      map.setLayoutProperty('cities-labels', 'visibility', visibility);
    }
  }, [map, isVisible]);

  return null; // This component doesn't render anything
};

// Helper function to create a city popup
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

// Helper function to filter cities by state
export const filterCitiesByState = (stateName) => {
  return {
    type: 'FeatureCollection',
    features: indiaCities.features.filter(
      feature => feature.properties.state === stateName
    )
  };
};

// Helper function to get top N cities
export const getTopCities = (n = 10) => {
  return {
    type: 'FeatureCollection',
    features: indiaCities.features
      .filter(feature => feature.properties.population_rank <= n)
      .sort((a, b) => a.properties.population_rank - b.properties.population_rank)
  };
};

export default CitiesLayer; 