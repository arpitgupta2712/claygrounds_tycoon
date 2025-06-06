import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapContainer = ({ className = "" }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const indiaCenter = [78.9629, 20.5937];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1', // Dark theme for game
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

    map.on('load', () => {
      setMapLoaded(true);
      console.log('🗺️ Map loaded successfully');
      
      // Add a sample marker for India center
      new mapboxgl.Marker({ color: '#00D4FF' })
        .setLngLat(indiaCenter)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 10px;">
                <h3>🏗️ ClayGrounds Tycoon</h3>
                <p>Your sports empire starts here!</p>
              </div>
            `)
        )
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [MAPBOX_TOKEN]);



  if (!MAPBOX_TOKEN) {
    return (
      <div className={`cg-map-container cg-map-placeholder ${className}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div className="cg-map-placeholder-content">
          <div className="cg-map-placeholder-icon">🗺️</div>
          <h3>Interactive Territory Map</h3>
          <p>Your sports empire visualization will appear here</p>
          <div className="cg-map-placeholder-features">
            <div className="cg-placeholder-feature">📍 Territory Markers</div>
            <div className="cg-placeholder-feature">🏟️ Facility Locations</div>
            <div className="cg-placeholder-feature">📊 Performance Data</div>
          </div>
          <div className="cg-map-placeholder-note">
            <small>Map requires Mapbox token configuration</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cg-map-container ${className}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={mapContainerRef} 
        className="cg-map"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default MapContainer; 