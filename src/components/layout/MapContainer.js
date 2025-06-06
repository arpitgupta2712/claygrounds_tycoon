import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapContainer = ({ className = "" }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [boundaryView, setBoundaryView] = useState('state'); // 'state' or 'district'
  const [mapLoaded, setMapLoaded] = useState(false);

  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
  const indiaCenter = [78.9629, 20.5937];

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: indiaCenter,
      zoom: 5,
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
      new mapboxgl.Marker({ color: '#10B981' })
        .setLngLat(indiaCenter)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML('<h3>🏗️ ClayGrounds Tycoon</h3><p>Welcome to your Sports Empire!</p>')
        )
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [MAPBOX_TOKEN, indiaCenter]);

  // Effect to handle boundary layer switching
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Helper to remove both layers and sources
    const removeLayersAndSources = () => {
      // State
      if (map.getLayer('state-boundaries')) map.removeLayer('state-boundaries');
      if (map.getLayer('state-fill')) map.removeLayer('state-fill');
      if (map.getSource('india-states')) map.removeSource('india-states');
      // District
      if (map.getLayer('district-boundaries')) map.removeLayer('district-boundaries');
      if (map.getLayer('district-fill')) map.removeLayer('district-fill');
      if (map.getSource('india-districts')) map.removeSource('india-districts');
    };

    removeLayersAndSources();

    if (boundaryView === 'state') {
      // --- State Boundaries Debug ---
      fetch('/india_states.geojson')
        .then(res => res.json())
        .then(data => {
          console.log('🗺️ Loaded india_states.geojson:', data);
          map.addSource('india-states', {
            type: 'geojson',
            data: data
          });
          console.log('✅ Added india-states source');

          map.addLayer({
            id: 'state-fill',
            type: 'fill',
            source: 'india-states',
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.2
            }
          });
          console.log('✅ Added state-fill layer');

          map.addLayer({
            id: 'state-boundaries',
            type: 'line',
            source: 'india-states',
            paint: {
              'line-color': '#000',
              'line-width': 2
            }
          });
          console.log('✅ Added state-boundaries layer');
        })
        .catch(err => {
          console.error('❌ Error loading india_states.geojson:', err);
        });
      // --- End State Boundaries Debug ---
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
              'fill-color': '#f39c12',
              'fill-opacity': 0.15
            }
          });
          console.log('✅ Added district-fill layer');

          map.addLayer({
            id: 'district-boundaries',
            type: 'line',
            source: 'india-districts',
            paint: {
              'line-color': '#c0392b',
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
  }, [boundaryView, mapLoaded]);

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
      {/* Toggle for boundaries - moved after map for visibility */}
      <div style={{ position: 'absolute', zIndex: 1000, top: 16, left: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 8 }}>
        <button
          onClick={() => setBoundaryView('state')}
          style={{ marginRight: 8, fontWeight: boundaryView === 'state' ? 'bold' : 'normal' }}
        >
          State Boundaries
        </button>
        <button
          onClick={() => setBoundaryView('district')}
          style={{ fontWeight: boundaryView === 'district' ? 'bold' : 'normal' }}
        >
          District Boundaries
        </button>
      </div>
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