import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapContainer = ({ className = "" }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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

    // Add a welcome message
    map.on('load', () => {
      // Add a simple marker at India center
      new mapboxgl.Marker({
        color: '#10B981'
      })
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
  }, [MAPBOX_TOKEN]);

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
    <div className={`cg-map-container ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="cg-map"
        style={{ width: '100%', height: '100%' }}
      />
      
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