import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StateBoundariesLayer, DistrictBoundariesLayer } from '../map/layers';
import { useMapControls } from '../../hooks/useMapControls';
import { useAllStatesOverview, useStateTerritory } from '../../hooks/useTerritoryData';

const MapContainer = ({ 
  className = "",
  onStateSelect,
  onDistrictSelect,
  selectedState = null,
  selectedDistrict = null,
  showBusinessData = true,
  mapStyle = 'mapbox://styles/mapbox/navigation-night-v1'
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

  // Business intelligence data
  const { 
    allStatesData, 
    formatCurrency, 
    formatPercentage 
  } = useAllStatesOverview();
  
  const { 
    stateData 
  } = useStateTerritory(selectedState);

  // Map controls for territory management
  const {
    controlState,
    setSelectedState,
    setSelectedDistrict,
    toggleLayer
  } = useMapControls(mapRef.current, {
    selectedState,
    selectedDistrict,
    showStates: true,
    showDistricts: !!selectedState,
    viewMode: selectedState ? 'STATE_FOCUSED' : 'STATE_SELECTION'
  });

  // Available states from business data
  const availableStates = useMemo(() => {
    return allStatesData?.states?.map(state => state.name) || [];
  }, [allStatesData]);

  // Handle state selection
  const handleStateClick = useCallback((stateName) => {
    console.log('🗺️ State selected from map:', stateName);
    setSelectedState(stateName);
    if (onStateSelect) {
      onStateSelect(stateName);
    }
  }, [setSelectedState, onStateSelect]);

  // Handle district selection
  const handleDistrictClick = useCallback((district) => {
    console.log('🗺️ District selected from map:', district);
    setSelectedDistrict(district);
    if (onDistrictSelect) {
      onDistrictSelect(district);
    }
  }, [setSelectedDistrict, onDistrictSelect]);

  // Create business-enhanced popup content for states
  const createBusinessStatePopup = useCallback((stateName) => {
    const businessData = allStatesData?.states?.find(s => s.name === stateName);
    
    if (!businessData && !showBusinessData) {
      return `
        <div class="territory-popup state-popup">
          <div class="popup-header">
            <h3>🗺️ ${stateName}</h3>
          </div>
          <div class="popup-content">
            <p>Click to explore this territory</p>
          </div>
        </div>
      `;
    }

    if (!businessData) {
      return `
        <div class="territory-popup state-popup loading">
          <div class="popup-header">
            <h3>🗺️ ${stateName}</h3>
          </div>
          <div class="popup-content">
            <p>Loading business data...</p>
          </div>
        </div>
      `;
    }

    const { preview } = businessData;
    return `
      <div class="territory-popup state-popup">
        <div class="popup-header">
          <h3>🗺️ ${stateName}</h3>
          <span class="trend-indicator ${preview.trend}">
            ${preview.trend === 'up' ? '📈' : '📉'}
          </span>
        </div>
        <div class="popup-content">
          <div class="business-metrics">
            <div class="metric">
              <span class="metric-icon">🏟️</span>
              <span class="metric-value">${preview.facilities}</span>
              <span class="metric-label">Facilities</span>
            </div>
            <div class="metric">
              <span class="metric-icon">💰</span>
              <span class="metric-value">${formatCurrency(preview.revenue)}</span>
              <span class="metric-label">Revenue</span>
            </div>
            <div class="metric">
              <span class="metric-icon">📊</span>
              <span class="metric-value">${formatPercentage(preview.growth)}</span>
              <span class="metric-label">Growth</span>
            </div>
          </div>
          <div class="popup-action">
            <button class="explore-btn" onclick="window.selectStateFromMap('${stateName}')">
              🎯 Explore Territory
            </button>
          </div>
        </div>
      </div>
    `;
  }, [allStatesData, showBusinessData, formatCurrency, formatPercentage]);

  // Create business-enhanced popup content for districts
  const createBusinessDistrictPopup = useCallback((district) => {
    return `
      <div class="territory-popup district-popup">
        <div class="popup-header">
          <h3>🏛️ ${district.district}</h3>
        </div>
        <div class="popup-content">
          <div class="district-info">
            <div class="info-item">
              <span class="info-icon">🗺️</span>
              <span class="info-text">${district.st_nm}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">🏷️</span>
              <span class="info-text">Code: ${district.dt_code || 'N/A'}</span>
            </div>
          </div>
          <div class="popup-action">
            <button class="explore-btn" onclick="window.selectDistrictFromMap('${JSON.stringify(district).replace(/'/g, "\\'")}')">
              🎯 Explore District
            </button>
          </div>
        </div>
      </div>
    `;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const indiaCenter = [78.9629, 20.5937];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
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

    // Global functions for popup interactions
    window.selectStateFromMap = (stateName) => {
      handleStateClick(stateName);
    };

    window.selectDistrictFromMap = (districtJson) => {
      try {
        const district = JSON.parse(districtJson);
        handleDistrictClick(district);
      } catch (error) {
        console.error('Error parsing district data:', error);
      }
    };

    map.on('load', () => {
      setMapLoaded(true);
      console.log('🗺️ Enhanced map loaded successfully');
      
      // Add business intelligence center marker
      const centerMarker = new mapboxgl.Marker({ 
        color: '#00D4FF',
        scale: 1.2
      })
        .setLngLat(indiaCenter)
        .setPopup(
          new mapboxgl.Popup({ 
            offset: 25,
            className: 'center-popup'
          })
            .setHTML(`
              <div class="center-popup-content">
                <h3>🏗️ ClayGrounds Tycoon</h3>
                <p>Territory Management Hub</p>
                ${allStatesData ? `
                  <div class="hub-stats">
                    <div class="hub-stat">
                      <span>🏢 ${allStatesData.summary?.totalFacilities || 0}</span>
                      <small>Total Facilities</small>
                    </div>
                    <div class="hub-stat">
                      <span>💰 ${formatCurrency(allStatesData.summary?.totalRevenue || 0)}</span>
                      <small>Total Revenue</small>
                    </div>
                  </div>
                ` : '<p>Loading business data...</p>'}
              </div>
            `)
        )
        .addTo(map);

      // Store marker reference for updates
      mapRef.current.centerMarker = centerMarker;
    });

    return () => {
      // Cleanup global functions
      delete window.selectStateFromMap;
      delete window.selectDistrictFromMap;
      map.remove();
    };
  }, [MAPBOX_TOKEN, mapStyle, handleStateClick, handleDistrictClick, allStatesData, formatCurrency]);

  // Update center marker when business data changes
  useEffect(() => {
    if (mapRef.current?.centerMarker && allStatesData) {
      const popup = mapRef.current.centerMarker.getPopup();
      popup.setHTML(`
        <div class="center-popup-content">
          <h3>🏗️ ClayGrounds Tycoon</h3>
          <p>Territory Management Hub</p>
          <div class="hub-stats">
            <div class="hub-stat">
              <span>🏢 ${allStatesData.summary?.totalFacilities || 0}</span>
              <small>Total Facilities</small>
            </div>
            <div class="hub-stat">
              <span>💰 ${formatCurrency(allStatesData.summary?.totalRevenue || 0)}</span>
              <small>Total Revenue</small>
            </div>
            <div class="hub-stat">
              <span>📈 ${formatPercentage(allStatesData.summary?.averageGrowth || 0)}</span>
              <small>Avg Growth</small>
            </div>
          </div>
        </div>
      `);
    }
  }, [allStatesData, formatCurrency, formatPercentage]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`cg-map-container cg-map-placeholder ${className}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div className="cg-map-placeholder-content">
          <div className="cg-map-placeholder-icon">🗺️</div>
          <h3>Interactive Territory Map</h3>
          <p>Your business empire visualization will appear here</p>
          <div className="cg-map-placeholder-features">
            <div className="cg-placeholder-feature">📍 Territory Boundaries</div>
            <div className="cg-placeholder-feature">🏟️ Facility Locations</div>
            <div className="cg-placeholder-feature">📊 Performance Data</div>
            <div className="cg-placeholder-feature">💰 Business Intelligence</div>
          </div>
          <div className="cg-map-placeholder-note">
            <small>Map requires Mapbox token configuration</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cg-map-container enhanced ${className}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={mapContainerRef} 
        className="cg-map"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Integrate boundary layers when map is loaded */}
      {mapLoaded && mapRef.current && (
        <>
          <StateBoundariesLayer
            map={mapRef.current}
            selectedState={selectedState}
            availableStates={availableStates}
            isVisible={true}
            onStateClick={handleStateClick}
            viewMode={controlState.viewMode}
            createPopup={createBusinessStatePopup}
          />
          
          <DistrictBoundariesLayer
            map={mapRef.current}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            isVisible={!!selectedState}
            onDistrictClick={handleDistrictClick}
            createPopup={createBusinessDistrictPopup}
          />
        </>
      )}
      
      {/* Territory Info Overlay */}
      {selectedState && stateData && (
        <div className="territory-info-overlay">
          <div className="territory-info-content">
            <h4>🗺️ {selectedState}</h4>
            <div className="territory-metrics">
              <div className="territory-metric">
                <span className="metric-icon">🏟️</span>
                <span className="metric-value">{stateData.metrics.facilities}</span>
                <span className="metric-label">Facilities</span>
              </div>
              <div className="territory-metric">
                <span className="metric-icon">💰</span>
                <span className="metric-value">{formatCurrency(stateData.metrics.revenue)}</span>
                <span className="metric-label">Revenue</span>
              </div>
              <div className="territory-metric">
                <span className="metric-icon">📈</span>
                <span className="metric-value">{formatPercentage(stateData.metrics.growth)}</span>
                <span className="metric-label">Growth</span>
              </div>
            </div>
            {selectedDistrict && (
              <div className="district-info">
                <h5>🏛️ {selectedDistrict.district}</h5>
                <p>District Code: {selectedDistrict.dt_code || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer; 