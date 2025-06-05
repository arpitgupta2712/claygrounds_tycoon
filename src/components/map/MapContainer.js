import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../styles/map.css';
import { api } from '../../services/api';
import { testApiConnection } from '../../utils/testApi';

// Path to the GeoJSON file 
import indiaStates from '../../assets/geojson/india_states.geojson';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
const delhiCenter = [77.2090, 28.6139];

const MapContainer = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedState, setHighlightedState] = useState('Delhi');
  const [apiTestResult, setApiTestResult] = useState(null);

  // Test API connection and fetch locations
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Test API connection first
        console.log('🚀 Initializing ClayGrounds data...');
        const testResult = await testApiConnection();
        setApiTestResult(testResult);
        
        if (testResult.success) {
          // Fetch locations with coordinates for map display
          const locationData = await api.utils.getLocationsWithCoordinates();
          console.log('🗺️ Locations with coordinates loaded:', locationData.length);
          setLocations(locationData);
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
  const createPopup = (location) => {
    const status = location.operational_status || location.current_status || 'Unknown';
    const statusClass = status === 'Active' ? 'status-active' : 'status-closed';
    
    return new mapboxgl.Popup({ offset: 28 })
      .setHTML(`
        <div class="popup-content">
          <div class="popup-title">${location.location_name}</div>
          <div class="popup-details">
            <p><strong>City:</strong> ${location.city}, ${location.state}</p>
            <p><strong>Status:</strong> <span class="${statusClass}">${status}</span></p>
            <p><strong>Property Type:</strong> ${location.property_type}</p>
            <p><strong>Management:</strong> ${location.management_status || 'N/A'}</p>
            ${location.nickname ? `<p><strong>Nickname:</strong> ${location.nickname}</p>` : ''}
            ${location.google_business_name ? `<p><strong>Google Business:</strong> ${location.google_business_name}</p>` : ''}
            ${location.opening_date ? `<p><strong>Opened:</strong> ${new Date(location.opening_date).toLocaleDateString()}</p>` : ''}
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

    locationsToShow.forEach(location => {
      if (!location.latitude || !location.longitude) return;

      // Create marker element with sports emoji
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.innerHTML = '⚽'; // Football emoji for sports facilities
      el.title = location.location_name;

      // Add click event for marker
      el.addEventListener('click', () => {
        console.log('🏟️ Location clicked:', location.location_name);
      });

      // Create marker with popup
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(createPopup(location))
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });

    console.log(`✅ Successfully added ${markersRef.current.length} markers`);
  };

  // Filter locations by state
  const filterLocationsByState = (state) => {
    const filtered = locations.filter(loc => loc.state === state);
    console.log(`🔍 Filtering locations for ${state}:`, filtered.length, 'found');
    addLocationMarkers(filtered);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    if (!MAPBOX_TOKEN) {
      console.error('❌ Mapbox access token not found. Please add REACT_APP_MAPBOX_ACCESS_TOKEN to your .env file');
      return;
    }
    
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    console.log('🗺️ Initializing Mapbox map...');
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: delhiCenter,
      zoom: 6,
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
            'fill-opacity': 0.2,
          },
          filter: ['==', ['get', 'st_nm'], highlightedState],
        });
        
        // Add state boundaries
        map.addLayer({
          id: 'state-boundaries',
          type: 'line',
          source: 'india-states',
          paint: {
            'line-color': '#3B82F6',
            'line-width': 2,
          },
        });

        // Add state outline for highlighted state
        map.addLayer({
          id: 'state-outline',
          type: 'line',
          source: 'india-states',
          paint: {
            'line-color': '#10B981',
            'line-width': 3,
          },
          filter: ['==', ['get', 'st_nm'], highlightedState],
        });

        console.log('✅ State layers added successfully');

      } catch (err) {
        console.error('❌ Error loading GeoJSON or adding layer:', err);
      }
    });

    // Handle map click to detect state change
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, { 
        layers: ['state-highlight', 'state-boundaries'] 
      });
      
      if (features.length > 0) {
        const stateName = features[0].properties?.st_nm;
        if (stateName && stateName !== highlightedState) {
          console.log(`🏛️ State changed to: ${stateName}`);
          setHighlightedState(stateName);
          map.setFilter('state-highlight', ['==', ['get', 'st_nm'], stateName]);
          map.setFilter('state-outline', ['==', ['get', 'st_nm'], stateName]);
          filterLocationsByState(stateName);
        }
      }
    });

    // Add hover effects for states
    map.on('mouseenter', 'state-boundaries', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'state-boundaries', () => {
      map.getCanvas().style.cursor = '';
    });

    // Clean up on unmount
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.remove();
    };
  }, [highlightedState]);

  // Add markers when locations are loaded
  useEffect(() => {
    if (locations.length > 0 && mapRef.current) {
      console.log(`🎯 Locations loaded, filtering for ${highlightedState}`);
      filterLocationsByState(highlightedState);
    }
  }, [locations, highlightedState]);

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
        <h2>🗺️ ClayGrounds Map</h2>
        <p>Mapbox token not configured.</p>
        <p>Please add <code>REACT_APP_MAPBOX_ACCESS_TOKEN</code> to your .env file</p>
      </div>
    );
  }

  return (
    <div className="mapbox-map-container">
      {loading && (
        <div className="loading-overlay">
          <h3>🏟️ Loading ClayGrounds locations...</h3>
          <p>Connecting to partner.claygrounds.com</p>
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
      <div className="map-info">
        <h4>🗺️ ClayGrounds Tycoon</h4>
        <p>State: <strong>{highlightedState}</strong></p>
        <p>Total locations: <strong>{locations.length}</strong></p>
        <p>With coordinates: <strong>{locations.filter(l => l.latitude && l.longitude).length}</strong></p>
        {apiTestResult && (
          <p>API Status: <strong style={{ color: apiTestResult.success ? '#10B981' : '#EF4444' }}>
            {apiTestResult.success ? '✅ Connected' : '❌ Failed'}
          </strong></p>
        )}
        <p style={{ fontSize: '12px', opacity: 0.8 }}>Click states to explore</p>
      </div>
    </div>
  );
};

export default MapContainer; 