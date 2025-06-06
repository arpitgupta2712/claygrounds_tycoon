import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing Mapbox GL layers
 * @param {Object} map - Mapbox GL map instance
 * @param {Object} data - GeoJSON data for the layer
 * @param {Object} config - Layer configuration
 * @returns {Object} { isLayerAdded, addLayer, removeLayer, updateLayer }
 */
export const useMapLayer = (map, data, config = {}) => {
  const {
    sourceId,
    layers = [],
    onLayerClick,
    onLayerHover,
    onLayerLeave,
    dependencies = []
  } = config;

  const layersAddedRef = useRef(false);
  const eventHandlersRef = useRef(new Map());

  // Add layer to map
  const addLayer = useCallback(() => {
    if (!map || !data || !sourceId || layersAddedRef.current) return;

    try {
      console.log(`🗺️ Adding layer source: ${sourceId}`);

      // Add source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: data
        });
        console.log(`✅ Added source: ${sourceId}`);
      } else {
        // Update existing source data
        map.getSource(sourceId).setData(data);
        console.log(`🔄 Updated source data: ${sourceId}`);
      }

      // Add layers
      layers.forEach((layerConfig, index) => {
        const layerId = layerConfig.id;
        
        // Remove existing layer if it exists
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }

        // Add the layer
        map.addLayer({
          ...layerConfig,
          source: sourceId
        });

        console.log(`✅ Added layer: ${layerId}`);

        // Add event handlers
        if (onLayerClick) {
          const clickHandler = (e) => {
            if (e.features && e.features.length > 0) {
              onLayerClick(e.features[0], e);
            }
          };
          map.on('click', layerId, clickHandler);
          eventHandlersRef.current.set(`${layerId}-click`, clickHandler);
        }

        if (onLayerHover) {
          const hoverHandler = (e) => {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features && e.features.length > 0) {
              onLayerHover(e.features[0], e);
            }
          };
          map.on('mouseenter', layerId, hoverHandler);
          eventHandlersRef.current.set(`${layerId}-hover`, hoverHandler);
        }

        if (onLayerLeave) {
          const leaveHandler = (e) => {
            map.getCanvas().style.cursor = '';
            onLayerLeave(e);
          };
          map.on('mouseleave', layerId, leaveHandler);
          eventHandlersRef.current.set(`${layerId}-leave`, leaveHandler);
        }
      });

      layersAddedRef.current = true;
      console.log(`✅ All layers added for source: ${sourceId}`);
    } catch (error) {
      console.error(`❌ Error adding layers for ${sourceId}:`, error);
    }
  }, [map, data, sourceId, layers, onLayerClick, onLayerHover, onLayerLeave]);

  // Remove layer from map
  const removeLayer = useCallback(() => {
    if (!map || !layersAddedRef.current) return;

    try {
      // Remove event handlers
      eventHandlersRef.current.forEach((handler, key) => {
        const [layerId, eventType] = key.split('-');
        map.off(eventType === 'hover' ? 'mouseenter' : eventType === 'leave' ? 'mouseleave' : eventType, layerId, handler);
      });
      eventHandlersRef.current.clear();

      // Remove layers in reverse order
      [...layers].reverse().forEach((layerConfig) => {
        const layerId = layerConfig.id;
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
          console.log(`🗑️ Removed layer: ${layerId}`);
        }
      });

      // Remove source
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
        console.log(`🗑️ Removed source: ${sourceId}`);
      }

      layersAddedRef.current = false;
    } catch (error) {
      console.warn(`⚠️ Error removing layers for ${sourceId}:`, error);
      layersAddedRef.current = false;
    }
  }, [map, sourceId, layers]);

  // Update layer properties
  const updateLayer = useCallback((layerId, property, value) => {
    if (!map || !layersAddedRef.current) return;

    try {
      if (map.getLayer(layerId)) {
        if (property.startsWith('paint.')) {
          const paintProperty = property.replace('paint.', '');
          map.setPaintProperty(layerId, paintProperty, value);
        } else if (property.startsWith('layout.')) {
          const layoutProperty = property.replace('layout.', '');
          map.setLayoutProperty(layerId, layoutProperty, value);
        } else if (property === 'filter') {
          map.setFilter(layerId, value);
        }
        console.log(`🔄 Updated ${property} for layer: ${layerId}`);
      }
    } catch (error) {
      console.error(`❌ Error updating layer ${layerId}:`, error);
    }
  }, [map]);

  // Add layers when map and data are ready
  useEffect(() => {
    if (!map || !data) return;

    const checkAndAddLayers = () => {
      if (map.isStyleLoaded() && map.getSource) {
        addLayer();
      } else {
        console.log(`🗺️ Waiting for map style to load for ${sourceId}...`);
        setTimeout(checkAndAddLayers, 100);
      }
    };

    if (map.isStyleLoaded()) {
      addLayer();
    } else {
      map.on('style.load', addLayer);
      setTimeout(checkAndAddLayers, 1000);
    }

    return () => {
      removeLayer();
    };
  }, [map, data, addLayer, removeLayer, ...dependencies]);

  return {
    isLayerAdded: layersAddedRef.current,
    addLayer,
    removeLayer,
    updateLayer
  };
};

/**
 * Hook for managing state boundaries layer
 */
export const useStateBoundariesLayer = (map, data, config = {}) => {
  const defaultLayers = [
    {
      id: 'state-highlight',
      type: 'fill',
      paint: {
        'fill-color': '#000000',
        'fill-opacity': 0.2
      }
    },
    {
      id: 'state-boundaries',
      type: 'line',
      paint: {
        'line-color': '#013540',
        'line-width': 2,
        'line-opacity': 0.8
      }
    },
    {
      id: 'state-outline',
      type: 'line',
      paint: {
        'line-color': '#809AA0',
        'line-width': 4,
        'line-opacity': 0.9
      },
      filter: ['==', ['get', 'st_nm'], ''] // Initially hidden
    }
  ];

  return useMapLayer(map, data, {
    sourceId: 'india-states',
    layers: config.layers || defaultLayers,
    ...config
  });
};

/**
 * Hook for managing district boundaries layer
 */
export const useDistrictBoundariesLayer = (map, data, config = {}) => {
  const defaultLayers = [
    {
      id: 'district-fill',
      type: 'fill',
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false], 0.3,
          0
        ]
      },
      filter: ['==', ['get', 'st_nm'], ''] // Initially hidden
    },
    {
      id: 'district-boundaries',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#d23a35',
        'line-width': 2,
        'line-opacity': 0.8
      },
      filter: ['==', ['get', 'st_nm'], ''] // Initially hidden
    },
    {
      id: 'district-labels',
      type: 'symbol',
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
    }
  ];

  return useMapLayer(map, data, {
    sourceId: 'india-districts',
    layers: config.layers || defaultLayers,
    ...config
  });
};

/**
 * Hook for managing cities layer
 */
export const useCitiesLayer = (map, data, config = {}) => {
  const defaultLayers = [
    {
      id: 'cities-points',
      type: 'circle',
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
          ['<=', ['get', 'population_rank'], 10], '#ef4444',
          ['<=', ['get', 'population_rank'], 50], '#f97316',
          '#64748b'
        ],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 1,
        'circle-opacity': 0.8
      }
    },
    {
      id: 'cities-labels',
      type: 'symbol',
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
        'text-color': '#00cc81',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1
      },
      filter: [
        'case',
        ['<', ['zoom'], 6], ['<=', ['get', 'population_rank'], 10],
        ['<', ['zoom'], 8], ['<=', ['get', 'population_rank'], 25],
        true
      ]
    }
  ];

  return useMapLayer(map, data, {
    sourceId: 'india-cities',
    layers: config.layers || defaultLayers,
    ...config
  });
}; 