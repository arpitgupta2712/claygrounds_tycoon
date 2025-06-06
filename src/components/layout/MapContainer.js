import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ControlSidebar from '../ui/ControlSidebar';
import StatesControlPanel from '../ui/StatesControlPanel';
import DistrictsControlPanel from '../ui/DistrictsControlPanel';
import MapStyleControlPanel from '../ui/MapStyleControlPanel';
import ViewControlPanel from '../ui/ViewControlPanel';
// DataLoadingSpinner import removed as it's not used
import { mapApiStateToGeoJson } from '../../utils/stateNameMap';
import { getStateFillColorExpression } from '../../utils/mapHighlightUtils';

const MapContainer = ({ className = "" }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [boundaryView, setBoundaryView] = useState('state'); // 'state' or 'district'
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locations, setLocations] = useState([]);
  const [activeStates, setActiveStates] = useState(new Set());
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [selectedDistricts, setSelectedDistricts] = useState(new Set());

  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

  // Get theme colors from CSS variables
  const getThemeColor = (varName, fallback) => {
    if (typeof window === 'undefined') return fallback;
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
  };
  const stateFill = getThemeColor('--cg-map-state-fill', '#416870');
  const stateLine = getThemeColor('--cg-map-state-line', '#013540');
  const districtFill = getThemeColor('--cg-map-district-fill', '#b1f727');
  const districtLine = getThemeColor('--cg-map-district-line', '#013540');
  const activeStateFill = getThemeColor('--cg-primary', '#10B981');

  // Fetch and process locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://partner.claygrounds.com/api/locations/all');
        const data = await response.json();
        setLocations(data);
        // Use mapping utility for robust state matching
        const states = new Set(data.map(loc => mapApiStateToGeoJson(loc.state)));
        setActiveStates(states);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const indiaCenter = [78.9629, 20.5937];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11', // Using light style for better contrast
      center: indiaCenter,
      zoom: 4,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    mapRef.current = map;

    // Add basic controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);
      // Only set filter if the layer exists
      if (map.getLayer('country-label')) {
        map.setFilter('country-label', ['==', ['get', 'country_code'], 'IND']);
      }
      if (map.getLayer('country')) {
        map.setFilter('country', ['==', ['get', 'country_code'], 'IND']);
      }
      // Add markers for each location
      locations.forEach(location => {
        if (location.latitude && location.longitude) {
          new mapboxgl.Marker({ color: activeStateFill })
            .setLngLat([location.longitude, location.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <h3>${location.location_name}</h3>
                  <p>${location.city}, ${location.state}</p>
                  <p>Status: ${location.operational_status}</p>
                `)
            )
            .addTo(map);
        }
      });
    });

    return () => {
      map.remove();
    };
  }, [MAPBOX_TOKEN, locations, activeStateFill]);

  // Effect to handle boundary layer switching
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Helper to remove both layers and sources
    const removeLayersAndSources = () => {
      if (map.getLayer('state-boundaries')) map.removeLayer('state-boundaries');
      if (map.getLayer('state-fill')) map.removeLayer('state-fill');
      if (map.getSource('india-states')) map.removeSource('india-states');
      if (map.getLayer('district-boundaries')) map.removeLayer('district-boundaries');
      if (map.getLayer('district-fill')) map.removeLayer('district-fill');
      if (map.getSource('india-districts')) map.removeSource('india-districts');
    };

    removeLayersAndSources();

    if (boundaryView === 'state' && activeStates.size > 0) {
      fetch('/india_states.geojson')
        .then(res => res.json())
        .then(data => {
          // Debug: Compare activeStates and geojson ST_NM
          const geoStates = new Set(data.features.map(f => (f.properties.ST_NM || '').trim().toLowerCase()));
          const userStates = new Set(Array.from(activeStates).map(s => (s || '').trim().toLowerCase()));
          console.log('GeoJSON states:', geoStates);
          console.log('Active user states:', userStates);
          const missing = Array.from(userStates).filter(s => !geoStates.has(s));
          if (missing.length) {
            console.warn('States in user locations but not in GeoJSON:', missing);
          }
          map.addSource('india-states', {
            type: 'geojson',
            data: data
          });
          map.addLayer({
            id: 'state-fill',
            type: 'fill',
            source: 'india-states',
            paint: {
              'fill-color': getStateFillColorExpression(activeStates, activeStateFill, stateFill),
              'fill-opacity': 0.5
            }
          });
          map.addLayer({
            id: 'state-boundaries',
            type: 'line',
            source: 'india-states',
            paint: {
              'line-color': stateLine,
              'line-width': 2
            }
          });
        })
        .catch(err => {
          console.error('❌ Error loading india_states.geojson:', err);
        });
    } else if (boundaryView === 'district') {
      // --- District Boundaries Debug ---
      fetch('/india_districts.geojson')
        .then(res => res.json())
        .then(data => {
          console.log('🗺️ Loaded india_districts.geojson:', data);
          map.addSource('india-districts', {
            type: 'geojson',
            data: data
          });
          console.log('✅ Added india-districts source');

          map.addLayer({
            id: 'district-fill',
            type: 'fill',
            source: 'india-districts',
            paint: {
              'fill-color': districtFill,
              'fill-opacity': 0.5
            }
          });
          console.log('✅ Added district-fill layer');

          map.addLayer({
            id: 'district-boundaries',
            type: 'line',
            source: 'india-districts',
            paint: {
              'line-color': districtLine,
              'line-width': 1.5
            }
          });
          console.log('✅ Added district-boundaries layer');
        })
        .catch(err => {
          console.error('❌ Error loading india_districts.geojson:', err);
        });
      // --- End District Boundaries Debug ---
    }
  }, [boundaryView, mapLoaded, activeStates, stateFill, stateLine, districtFill, districtLine, activeStateFill]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`cg-map-container cg-map-error ${className}`}>
        <div className="cg-map-error-content">
          <div className="cg-map-error-icon">🗺️</div>
          <h3>Map Configuration Required</h3>
          <p>Please add your Mapbox access token to the environment variables.</p>
          <code>REACT_APP_MAPBOX_ACCESS_TOKEN=your_token_here</code>
        </div>
      </div>
    );
  }

  return (
    <div className={`cg-map-container ${className}`} style={{ position: 'relative' }}>
      <div 
        ref={mapContainerRef} 
        className="cg-map"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Advanced Control Sidebar */}
      <ControlSidebar 
        isOpen={isControlsOpen}
        onToggle={() => setIsControlsOpen(!isControlsOpen)}
        position="left"
      >
        <ViewControlPanel 
          boundaryView={boundaryView}
          onBoundaryViewChange={setBoundaryView}
        />
        
        {boundaryView === 'state' && (
          <StatesControlPanel
            selectedStates={selectedStates}
            onStatesChange={setSelectedStates}
            activeStates={activeStates}
          />
        )}
        
        {boundaryView === 'district' && (
          <DistrictsControlPanel
            selectedDistricts={selectedDistricts}
            onDistrictsChange={setSelectedDistricts}
            selectedStates={selectedStates}
          />
        )}
        
        <MapStyleControlPanel />
      </ControlSidebar>
      
      {/* Control Toggle Button */}
      {!isControlsOpen && (
        <button
          className="cg-btn cg-btn-primary cg-map-controls-toggle"
          onClick={() => setIsControlsOpen(true)}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 1000,
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Open Map Controls"
        >
          ⚙️
        </button>
      )}
      {/* Map Overlay Info */}
      <div className="cg-map-overlay">
        <div className="cg-map-info">
          <h3>🗺️ Interactive Map</h3>
          <p>Explore India and build your sports empire</p>
        </div>
      </div>
    </div>
  );
};

export default MapContainer; 