import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';

/**
 * Modern functional MapMarker component
 * Renders location markers on the map with popups and click interactions
 */
const MapMarker = ({ 
  map,
  location, 
  index, 
  currentIndex = -1, 
  onSelect = null,
  isVisible = true,
  className = 'fixed-marker-popup'
}) => {
  const popupRef = useRef(null);
  const clickHandlerRef = useRef(null);

  // Memoized coordinate parsing for performance
  const coordinates = useMemo(() => {
    const lng = parseFloat(location.longitude);
    const lat = parseFloat(location.latitude);
    
    // Validate coordinates
    if (isNaN(lng) || isNaN(lat)) return null;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
    
    return [lng, lat];
  }, [location.longitude, location.latitude]);

  // Memoized popup content for performance
  const popupContent = useMemo(() => {
    const status = location.operational_status || location.current_status || 'Unknown';
    const isActive = status === 'Active';
    const isCurrent = index === currentIndex;
    
    return `
      <div class="popup-marker ${isCurrent ? 'current' : ''}" data-index="${index}">
        <div class="popup-marker-circle ${isActive ? 'active' : 'inactive'}"></div>
        <div class="popup-marker-name">${location.location_name}</div>
      </div>
    `;
  }, [location, index, currentIndex]);

  // Handle popup click events
  const handlePopupClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🗺️ Marker clicked: ${location.location_name}`);
    if (onSelect) {
      onSelect(index);
    }
  }, [location.location_name, onSelect, index]);

  // Create popup
  const createPopup = useCallback(() => {
    if (!coordinates || !map) return null;

    console.log(`🗺️ Creating marker for ${location.location_name} at [${coordinates[0]}, ${coordinates[1]}]`);

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      closeOnMove: false,
      anchor: 'bottom',
      offset: [0, 0],
      className: className
    })
    .setLngLat(coordinates)
    .setHTML(popupContent);

    return popup;
  }, [coordinates, map, location.location_name, popupContent, className]);

  // Add popup to map
  useEffect(() => {
    if (!map || !coordinates || !isVisible) return;

    const popup = createPopup();
    if (!popup) return;

    // Add popup to map
    popup.addTo(map);
    popupRef.current = popup;

    // Add click event listener with a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const popupElement = document.querySelector(`[data-index="${index}"]`);
      if (popupElement) {
        popupElement.addEventListener('click', handlePopupClick);
        popupElement.style.cursor = 'pointer';
        clickHandlerRef.current = handlePopupClick;
        console.log(`✅ Added marker to map: ${location.location_name}`);
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      
      // Remove click event listener
      const popupElement = document.querySelector(`[data-index="${index}"]`);
      if (popupElement && clickHandlerRef.current) {
        popupElement.removeEventListener('click', clickHandlerRef.current);
      }
      
      // Remove popup from map
      if (popup) {
        popup.remove();
      }
      
      popupRef.current = null;
      clickHandlerRef.current = null;
    };
  }, [map, coordinates, isVisible, createPopup, index, handlePopupClick, location.location_name]);

  // Update popup content when currentIndex changes
  useEffect(() => {
    if (!popupRef.current) return;

    // Update popup HTML
    popupRef.current.setHTML(popupContent);

    // Re-add click event listener
    setTimeout(() => {
      const popupElement = document.querySelector(`[data-index="${index}"]`);
      if (popupElement) {
        // Remove old listener
        if (clickHandlerRef.current) {
          popupElement.removeEventListener('click', clickHandlerRef.current);
        }
        
        // Add new listener
        popupElement.addEventListener('click', handlePopupClick);
        popupElement.style.cursor = 'pointer';
        clickHandlerRef.current = handlePopupClick;
      }
    }, 50);
  }, [popupContent, index, handlePopupClick]);

  // Log invalid coordinates
  useEffect(() => {
    if (!coordinates) {
      console.warn(`⚠️ Invalid coordinates for ${location.location_name}:`, {
        longitude: location.longitude,
        latitude: location.latitude
      });
    }
  }, [coordinates, location.location_name, location.longitude, location.latitude]);

  // This component doesn't render anything to the DOM
  return null;
};

/**
 * Hook for managing multiple map markers
 */
export const useMapMarkers = (map, locations = [], currentIndex = -1, onSelect = null) => {
  const markersRef = useRef([]);

  useEffect(() => {
    // Clean up existing markers
    markersRef.current.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    markersRef.current = [];

    if (!map || !locations.length) return;

    // Create new markers
    const newMarkers = locations.map((location, index) => {
      const coordinates = parseCoordinates(location);
      if (!coordinates) return null;

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false,
        anchor: 'bottom',
        offset: [0, 0],
        className: 'fixed-marker-popup'
      })
      .setLngLat(coordinates)
      .setHTML(createMarkerHTML(location, index, currentIndex));

      popup.addTo(map);

      // Add click handler
      setTimeout(() => {
        const popupElement = document.querySelector(`[data-index="${index}"]`);
        if (popupElement && onSelect) {
          popupElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(index);
          });
          popupElement.style.cursor = 'pointer';
        }
      }, 100);

      return popup;
    }).filter(Boolean);

    markersRef.current = newMarkers;

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => {
        if (marker && marker.remove) {
          marker.remove();
        }
      });
      markersRef.current = [];
    };
  }, [map, locations, currentIndex, onSelect]);

  // Update markers when currentIndex changes
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      if (marker && locations[index]) {
        const newHTML = createMarkerHTML(locations[index], index, currentIndex);
        marker.setHTML(newHTML);
        
        // Re-add click handler
        setTimeout(() => {
          const popupElement = document.querySelector(`[data-index="${index}"]`);
          if (popupElement && onSelect) {
            popupElement.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(index);
            });
            popupElement.style.cursor = 'pointer';
          }
        }, 50);
      }
    });
  }, [currentIndex, locations, onSelect]);

  return markersRef.current;
};

// Helper functions
const parseCoordinates = (location) => {
  const lng = parseFloat(location.longitude);
  const lat = parseFloat(location.latitude);
  
  if (isNaN(lng) || isNaN(lat)) return null;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
  
  return [lng, lat];
};

const createMarkerHTML = (location, index, currentIndex) => {
  const status = location.operational_status || location.current_status || 'Unknown';
  const isActive = status === 'Active';
  const isCurrent = index === currentIndex;
  
  return `
    <div class="popup-marker ${isCurrent ? 'current' : ''}" data-index="${index}">
      <div class="popup-marker-circle ${isActive ? 'active' : 'inactive'}"></div>
      <div class="popup-marker-name">${location.location_name}</div>
    </div>
  `;
};

/**
 * Utility function to check if coordinates are in viewport
 */
export const isMarkerInViewport = (map, coordinates) => {
  if (!map || !coordinates) return true;
  
  try {
    const bounds = map.getBounds();
    return bounds.contains(coordinates);
  } catch (error) {
    return true;
  }
};

export default MapMarker; 