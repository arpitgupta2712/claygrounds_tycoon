import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../styles/map.css';
import { api } from '../../services/api';
import { testApiConnection } from '../../utils/testApi';

// Path to the GeoJSON file 
import indiaStates from '../../assets/geojson/india_states.geojson';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
const indiaCenter = [78.9629, 20.5937]; // Center of India
const delhiCenter = [77.2090, 28.6139];

// Map view modes
const VIEW_MODES = {
  STATE_SELECTION: 'state_selection',
  STATE_FOCUSED: 'state_focused',
  LOCATION_NAVIGATION: 'location_navigation'
};

const MapContainer = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiTestResult, setApiTestResult] = useState(null);
  
  // Game state management
  const [viewMode, setViewMode] = useState(VIEW_MODES.STATE_SELECTION);
  const [selectedState, setSelectedState] = useState(null);
  const [stateLocations, setStateLocations] = useState([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [availableStates, setAvailableStates] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Test API connection and fetch locations
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        console.log('🚀 Initializing ClayGrounds Tycoon...');
        const testResult = await testApiConnection();
        setApiTestResult(testResult);
        
        if (testResult.success) {
          const locationData = await api.utils.getLocationsWithCoordinates();
          setLocations(locationData);
          
          // Get available states that have locations
          const states = [...new Set(locationData.map(loc => loc.state))].sort();
          setAvailableStates(states);
          
          setError(null);
        } else {
          setError(`API Connection Failed: ${testResult.error}`);
        }
      } catch (err) {
        console.error('Failed to initialize data:', err);
        setError('Failed to load ClayGrounds data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Create popup content for locations
  const createLocationPopup = (location, index) => {
    const status = location.operational_status || location.current_status || 'Unknown';
    const statusClass = status === 'Active' ? 'status-active' : 'status-closed';
    
    return new mapboxgl.Popup({ offset: 28 })
      .setHTML(`
        <div class="popup-content game-popup">
          <div class="popup-header">
            <div class="popup-title">🏟️ ${location.location_name}</div>
            <div class="location-counter">${index + 1}/${stateLocations.length}</div>
          </div>
          <div class="popup-details">
            <p><strong>📍 Location:</strong> ${location.city}, ${location.state}</p>
            <p><strong>🔋 Status:</strong> <span class="${statusClass}">${status}</span></p>
            <p><strong>🏗️ Type:</strong> ${location.property_type}</p>
            <p><strong>👔 Management:</strong> ${location.management_status || 'N/A'}</p>
            ${location.nickname ? `<p><strong>🏷️ Nickname:</strong> ${location.nickname}</p>` : ''}
            ${location.opening_date ? `<p><strong>📅 Opened:</strong> ${new Date(location.opening_date).toLocaleDateString()}</p>` : ''}
          </div>
          <div class="popup-navigation">
            <button onclick="window.mapNavigation?.prevLocation()" ${index === 0 ? 'disabled' : ''}>← Prev</button>
            <button onclick="window.mapNavigation?.nextLocation()" ${index === stateLocations.length - 1 ? 'disabled' : ''}>Next →</button>
          </div>
        </div>
      `);
  };

  // Add location markers to map
  const addLocationMarkers = (locationsToShow) => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    console.log(`🎯 Adding ${locationsToShow.length} markers to map`);

    locationsToShow.forEach((location, index) => {
      if (!location.latitude || !location.longitude) return;

      // Create marker element with game-like styling
      const el = document.createElement('div');
      el.className = `location-marker ${index === currentLocationIndex ? 'current-location' : ''}`;
      el.innerHTML = index === currentLocationIndex ? '🎯' : '⚽';
      el.title = location.location_name;

      // Add click event for marker
      el.addEventListener('click', () => {
        selectLocation(index);
      });

      // Create marker with popup
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(createLocationPopup(location, index))
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });

    console.log(`✅ Successfully added ${markersRef.current.length} markers`);
  };

  // Select a state and focus on it
  const selectState = useCallback(async (stateName) => {
    if (isAnimating || !mapRef.current) return;
    
    setIsAnimating(true);
    setSelectedState(stateName);
    setViewMode(VIEW_MODES.STATE_FOCUSED);
    
    // Get locations for this state
    const stateFilteredLocations = locations.filter(loc => loc.state === stateName);
    setStateLocations(stateFilteredLocations);
    setCurrentLocationIndex(0);
    
    console.log(`🏛️ Focusing on ${stateName} with ${stateFilteredLocations.length} locations`);
    
    // Hide all states except selected one
    if (mapRef.current.getLayer('state-boundaries')) {
      mapRef.current.setFilter('state-boundaries', ['==', ['get', 'st_nm'], stateName]);
      mapRef.current.setFilter('state-highlight', ['==', ['get', 'st_nm'], stateName]);
      mapRef.current.setFilter('state-outline', ['==', ['get', 'st_nm'], stateName]);
    }
    
    // Calculate bounds for the selected state and zoom in
    if (stateFilteredLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      stateFilteredLocations.forEach(loc => {
        bounds.extend([loc.longitude, loc.latitude]);
      });
      
      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 2000, // 2 second animation
        essential: true
      });
    }
    
    // Add markers after animation
    setTimeout(() => {
      addLocationMarkers(stateFilteredLocations);
      setViewMode(VIEW_MODES.LOCATION_NAVIGATION);
      setIsAnimating(false);
    }, 2200);
    
  }, [locations, isAnimating]);

  // Select a specific location within the state
  const selectLocation = useCallback((index) => {
    if (index < 0 || index >= stateLocations.length || isAnimating) return;
    
    setCurrentLocationIndex(index);
    const location = stateLocations[index];
    
    console.log(`🎯 Navigating to location ${index + 1}/${stateLocations.length}: ${location.location_name}`);
    
    // Update marker styles
    markersRef.current.forEach((marker, i) => {
      const el = marker.getElement();
      if (i === index) {
        el.className = 'location-marker current-location';
        el.innerHTML = '🎯';
      } else {
        el.className = 'location-marker';
        el.innerHTML = '⚽';
      }
    });
    
    // Animate to the location
    mapRef.current.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 14,
      duration: 1500,
      essential: true
    });
    
  }, [stateLocations, isAnimating]);

  // Navigation functions
  const nextLocation = useCallback(() => {
    if (currentLocationIndex < stateLocations.length - 1) {
      selectLocation(currentLocationIndex + 1);
    }
  }, [currentLocationIndex, stateLocations.length, selectLocation]);

  const prevLocation = useCallback(() => {
    if (currentLocationIndex > 0) {
      selectLocation(currentLocationIndex - 1);
    }
  }, [currentLocationIndex, selectLocation]);

  const backToStateSelection = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setViewMode(VIEW_MODES.STATE_SELECTION);
    setSelectedState(null);
    setStateLocations([]);
    setCurrentLocationIndex(0);
    
    // Remove all markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Show all states again
    if (mapRef.current.getLayer('state-boundaries')) {
      mapRef.current.setFilter('state-boundaries', null);
      mapRef.current.setFilter('state-highlight', null);
      mapRef.current.setFilter('state-outline', null);
    }
    
    // Zoom out to show all of India
    mapRef.current.flyTo({
      center: indiaCenter,
      zoom: 5,
      duration: 2000,
      essential: true
    });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 2200);
    
  }, [isAnimating]);

  // Expose navigation functions globally for popup buttons
  useEffect(() => {
    window.mapNavigation = {
      nextLocation,
      prevLocation,
      selectLocation
    };
    
    return () => {
      delete window.mapNavigation;
    };
  }, [nextLocation, prevLocation, selectLocation]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (viewMode !== VIEW_MODES.LOCATION_NAVIGATION || isAnimating) return;
      
      switch (event.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          nextLocation();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          prevLocation();
          break;
        case 'Escape':
          event.preventDefault();
          backToStateSelection();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, isAnimating, nextLocation, prevLocation, backToStateSelection]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    if (!MAPBOX_TOKEN) {
      console.error('❌ Mapbox access token not found. Please add REACT_APP_MAPBOX_ACCESS_TOKEN to your .env file');
      return;
    }
    
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    console.log('🗺️ Initializing ClayGrounds Tycoon Map...');
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: indiaCenter,
      zoom: 5,
      antialias: true,
    });
    mapRef.current = map;

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    // Add GeoJSON source and state boundaries layer
    map.on('load', () => {
      console.log('✅ Map loaded, adding India state boundaries...');
      try {
        map.addSource('india-states', {
          type: 'geojson',
          data: indiaStates,
        });
        
        // Add state fill layer (highlight)
        map.addLayer({
          id: 'state-highlight',
          type: 'fill',
          source: 'india-states',
          paint: {
            'fill-color': '#3B82F6',
            'fill-opacity': 0.3,
          },
        });
        
        // Add state boundaries
        map.addLayer({
          id: 'state-boundaries',
          type: 'line',
          source: 'india-states',
          paint: {
            'line-color': '#10B981',
            'line-width': 2,
          },
        });

        // Add state outline for hover effect
        map.addLayer({
          id: 'state-outline',
          type: 'line',
          source: 'india-states',
          paint: {
            'line-color': '#F59E0B',
            'line-width': 4,
          },
          filter: ['==', ['get', 'st_nm'], ''],
        });

        console.log('✅ State layers added successfully');

      } catch (err) {
        console.error('❌ Error loading GeoJSON or adding layer:', err);
      }
    });

    // Handle map click for state selection
    map.on('click', 'state-highlight', (e) => {
      if (viewMode !== VIEW_MODES.STATE_SELECTION || isAnimating) return;
      
      const stateName = e.features[0].properties?.st_nm;
      if (stateName && availableStates.includes(stateName)) {
        selectState(stateName);
      }
    });

    // Add hover effects for states
    map.on('mouseenter', 'state-highlight', (e) => {
      if (viewMode !== VIEW_MODES.STATE_SELECTION) return;
      
      map.getCanvas().style.cursor = 'pointer';
      const stateName = e.features[0].properties?.st_nm;
      if (stateName && availableStates.includes(stateName)) {
        map.setFilter('state-outline', ['==', ['get', 'st_nm'], stateName]);
      }
    });

    map.on('mouseleave', 'state-highlight', () => {
      if (viewMode !== VIEW_MODES.STATE_SELECTION) return;
      
      map.getCanvas().style.cursor = '';
      map.setFilter('state-outline', ['==', ['get', 'st_nm'], '']);
    });

    // Clean up on unmount
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.remove();
    };
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="mapbox-map-container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#1f2937', 
        color: '#ffffff',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>🗺️ ClayGrounds Tycoon</h2>
        <p>Mapbox token not configured.</p>
        <p>Please add <code>REACT_APP_MAPBOX_ACCESS_TOKEN</code> to your .env file</p>
      </div>
    );
  }

  return (
    <div className="mapbox-map-container">
      {loading && (
        <div className="loading-overlay">
          <h3>🏟️ Loading ClayGrounds Tycoon...</h3>
          <p>Preparing your empire...</p>
        </div>
      )}
      {error && (
        <div className="error-overlay">
          <h3>⚠️ Connection Error</h3>
          <p>{error}</p>
          <p>Check console for details</p>
        </div>
      )}
      
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
      
      {/* Game UI Controls */}
      <div className="game-ui">
        <div className="game-header">
          <h2>🏟️ ClayGrounds Tycoon</h2>
          {apiTestResult && (
            <div className={`api-status ${apiTestResult.success ? 'connected' : 'failed'}`}>
              {apiTestResult.success ? '✅ Connected' : '❌ Failed'}
            </div>
          )}
        </div>
        
        {viewMode === VIEW_MODES.STATE_SELECTION && (
          <div className="state-selection-ui">
            <h3>🗺️ Select Your State</h3>
            <p>Choose a state to manage your sports facilities</p>
            <div className="available-states">
              {availableStates.map(state => (
                <button 
                  key={state} 
                  className="state-button"
                  onClick={() => selectState(state)}
                  disabled={isAnimating}
                >
                  {state}
                </button>
              ))}
            </div>
            <p className="instruction">💡 Click on a state on the map or use buttons above</p>
          </div>
        )}
        
        {viewMode === VIEW_MODES.STATE_FOCUSED && (
          <div className="loading-state">
            <h3>🎯 Focusing on {selectedState}...</h3>
            <p>Loading your facilities...</p>
          </div>
        )}
        
        {viewMode === VIEW_MODES.LOCATION_NAVIGATION && stateLocations.length > 0 && (
          <div className="location-navigation-ui">
            <div className="current-state">
              <h3>🏛️ {selectedState}</h3>
              <button className="back-button" onClick={backToStateSelection}>
                ← Back to State Selection
              </button>
            </div>
            
            <div className="location-info">
              <h4>🎯 Current Location: {stateLocations[currentLocationIndex]?.location_name}</h4>
              <p>{currentLocationIndex + 1} of {stateLocations.length} facilities</p>
            </div>
            
            <div className="navigation-controls">
              <button 
                onClick={prevLocation} 
                disabled={currentLocationIndex === 0}
                className="nav-button"
              >
                ← Previous
              </button>
              <button 
                onClick={nextLocation} 
                disabled={currentLocationIndex === stateLocations.length - 1}
                className="nav-button"
              >
                Next →
              </button>
            </div>
            
            <div className="keyboard-hint">
              <p>🎮 Use ← → arrow keys to navigate | ESC to go back</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContainer; 