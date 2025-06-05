import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../styles/map.css';
import '../../styles/components.css';
import '../../styles/cities.css';
import '../../styles/districts.css';
import '../../styles/states.css';
import { api } from '../../services/api';
import { testApiConnection } from '../../utils/testApi';
import MapMarker from './MapMarker';
import GameUI, { VIEW_MODES } from './GameUI';
import MapStyleSwitcher, { MAP_STYLES } from './MapStyleSwitcher';
import ViewControl, { VIEW_TYPES } from './ViewControl';
import LocationModal from './LocationModal';
import CitiesLayer, { createCityPopup } from './CitiesLayer';
import CitiesControl from './CitiesControl';
import DistrictBoundariesLayer, { createDistrictPopup } from './DistrictBoundariesLayer';
import DistrictControl from './DistrictControl';
import StateBoundariesLayer from './StateBoundariesLayer';
import StateControl from './StateControl';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
const indiaCenter = [78.9629, 20.5937];

// Enhanced 3D urban environment settings with view modes
const VIEW_SETTINGS = {
  [VIEW_TYPES.TOP_DOWN.id]: {
    pitch: 0,
    bearing: 0,
    zoom: 16,
    stateZoom: 8,
    overviewZoom: 5
  },
  [VIEW_TYPES.ISOMETRIC.id]: {
    pitch: 60,
    bearing: 0,
    zoom: 16,
    stateZoom: 10,
    overviewZoom: 5
  }
};

// Helper function to map API state names to GeoJSON state names
const mapApiStateToGeoJSONState = (apiStateName) => {
  const stateMapping = {
    'Delhi': 'Delhi',
    'Uttar Pradesh': 'Uttar Pradesh', 
    'Maharashtra': 'Maharashtra',
    'Karnataka': 'Karnataka',
    'Tamil Nadu': 'Tamil Nadu',
    'West Bengal': 'West Bengal',
    'Gujarat': 'Gujarat',
    'Rajasthan': 'Rajasthan',
    'Andhra Pradesh': 'Andhra Pradesh',
    'Telangana': 'Telangana',
    'Bihar': 'Bihar',
    'Madhya Pradesh': 'Madhya Pradesh',
    'Haryana': 'Haryana',
    'Punjab': 'Punjab',
    'Assam': 'Assam',
    'Odisha': 'Odisha',
    'Kerala': 'Kerala',
    'Jharkhand': 'Jharkhand',
    'Chhattisgarh': 'Chhattisgarh',
    'Himachal Pradesh': 'Himachal Pradesh',
    'Uttarakhand': 'Uttarakhand',
    'Goa': 'Goa',
    'Tripura': 'Tripura',
    'Manipur': 'Manipur',
    'Meghalaya': 'Meghalaya',
    'Nagaland': 'Nagaland',
    'Mizoram': 'Mizoram',
    'Arunachal Pradesh': 'Arunachal Pradesh',
    'Sikkim': 'Sikkim',
    'Chandigarh': 'Chandigarh',
    'Andaman and Nicobar Islands': 'Andaman & Nicobar Island',
    'Dadra and Nagar Haveli': 'Dadara & Nagar Havelli',
    'Daman and Diu': 'Daman & Diu',
    'Lakshadweep': 'Lakshadweep',
    'Puducherry': 'Puducherry',
    'Jammu and Kashmir': 'Jammu & Kashmir',
    'Ladakh': 'Ladakh'
  };
  
  return stateMapping[apiStateName] || apiStateName;
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
  
  // Map style and view management
  const [currentMapStyle, setCurrentMapStyle] = useState(MAP_STYLES.STREETS.style);
  const [currentView, setCurrentView] = useState(VIEW_TYPES.TOP_DOWN.id);

  // Modal state
  const [selectedLocationForModal, setSelectedLocationForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cities and Districts state
  const [showCities, setShowCities] = useState(true);
  const [cityFilter, setCityFilter] = useState('all');
  const [cityPopup, setCityPopup] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showDistricts] = useState(true);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        console.log('🚀 Initializing ClayGrounds Tycoon 3D...');
        
        const testResult = await testApiConnection();
        setApiTestResult(testResult);
        
        if (testResult.success) {
          const locationData = await api.utils.getLocationsWithCoordinates();
          console.log('📍 Fetched locations:', locationData.length);
          setLocations(locationData);
          
          // Map API state names to GeoJSON state names
          const apiStates = [...new Set(locationData.map(loc => loc.state))].sort();
          const mappedStates = apiStates.map(mapApiStateToGeoJSONState).filter(Boolean);
          const uniqueMappedStates = [...new Set(mappedStates)].sort();
          
          console.log('🗺️ API states:', apiStates);
          console.log('🗺️ Mapped to GeoJSON states:', uniqueMappedStates);
          
          setAvailableStates(uniqueMappedStates);
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

  // Clear all markers with proper cleanup
  const clearMarkers = useCallback(() => {
    console.log('🧹 Clearing markers:', markersRef.current.length);
    markersRef.current.forEach(marker => marker.destroy());
    markersRef.current = [];
  }, []);

  // Add custom layers (3D buildings) - moved up to avoid circular dependency
  const addCustomLayers = useCallback(() => {
    if (!mapRef.current) return;
    
    try {
      // Add 3D buildings
      if (!mapRef.current.getLayer('add-3d-buildings')) {
        mapRef.current.addLayer({
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 10,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        });
      }

      console.log('✅ Custom layers added successfully');
    } catch (err) {
      console.error('❌ Error adding custom layers:', err);
    }
  }, []);

  // Select a specific location (moved up to avoid circular dependency)
  const selectLocation = useCallback((index) => {
    if (index < 0 || index >= stateLocations.length || isAnimating) return;
    
    setCurrentLocationIndex(index);
    const location = stateLocations[index];
    
    console.log(`🎯 Navigating to facility ${index + 1}/${stateLocations.length}: ${location.location_name}`);
    
    // Update all markers
    markersRef.current.forEach((marker, i) => {
      marker.updateCurrentState(index);
    });
    
    // Fly to location with current view settings
    const lng = parseFloat(location.longitude);
    const lat = parseFloat(location.latitude);
    
    if (!isNaN(lng) && !isNaN(lat)) {
      const settings = VIEW_SETTINGS[currentView];
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: settings.zoom,
        pitch: settings.pitch,
        bearing: settings.bearing,
        duration: 1500,
        essential: true
      });
    }
    
  }, [stateLocations, isAnimating, currentView]);

  // Handle marker click - open modal
  const handleMarkerClick = useCallback((index) => {
    console.log(`🎯 Marker clicked - Index: ${index}, Total locations: ${stateLocations.length}`);
    
    if (index >= 0 && index < stateLocations.length) {
      const selectedLocation = stateLocations[index];
      console.log(`📍 Opening modal for: ${selectedLocation.location_name}`);
      
      setCurrentLocationIndex(index);
      setSelectedLocationForModal(selectedLocation);
      setIsModalOpen(true);
      
      // Update marker states
      markersRef.current.forEach((marker, i) => {
        marker.updateCurrentState(index);
      });
      
      console.log(`✅ Modal should now be open for ${selectedLocation.location_name}`);
    } else {
      console.warn(`❌ Invalid marker index: ${index}`);
    }
  }, [stateLocations]);

  // Add location markers - SIMPLE AND FIXED
  const addLocationMarkers = useCallback((locationsToShow, currentIndex = 0) => {
    if (!mapRef.current) return;

    clearMarkers();
    console.log(`📍 Adding ${locationsToShow.length} FIXED markers`);

    const validMarkers = [];
    locationsToShow.forEach((location, index) => {
      if (!location.latitude || !location.longitude) {
        console.warn(`Skipping location with missing coordinates: ${location.location_name}`);
        return;
      }

      const marker = new MapMarker(
        location, 
        index, 
        currentIndex, 
        (selectedIndex) => handleMarkerClick(selectedIndex)
      );
      
      if (marker.coordinates) {
        marker.addToMap(mapRef.current);
        validMarkers.push(marker);
      }
    });

    markersRef.current = validMarkers;
    console.log(`✅ Successfully added ${markersRef.current.length} FIXED markers`);
  }, [clearMarkers, handleMarkerClick]);

  // Handle modal navigation
  const handleModalNavigation = useCallback((targetIndex) => {
    if (typeof targetIndex === 'number') {
      if (targetIndex >= 0 && targetIndex < stateLocations.length) {
        handleMarkerClick(targetIndex);
        selectLocation(targetIndex);
      }
    } else {
      // Just close modal and navigate to current location
      setIsModalOpen(false);
      selectLocation(currentLocationIndex);
    }
  }, [stateLocations.length, currentLocationIndex, handleMarkerClick, selectLocation]);

  // Handle view change (Top-down vs 3D Isometric)
  const handleViewChange = useCallback((viewType) => {
    if (!mapRef.current || currentView === viewType.id || isAnimating) return;
    
    console.log(`🎮 Changing view to: ${viewType.name}`);
    setCurrentView(viewType.id);
    
    const settings = VIEW_SETTINGS[viewType.id];
    const currentZoom = mapRef.current.getZoom();
    
    // Animate to new view
    mapRef.current.easeTo({
      pitch: viewType.pitch,
      bearing: viewType.bearing,
      zoom: Math.max(currentZoom, settings.zoom - 2), // Maintain reasonable zoom
      duration: 1500,
      essential: true
    });
    
  }, [currentView, isAnimating]);

  // Handle map style change
  const handleStyleChange = useCallback((newStyle) => {
    if (!mapRef.current || newStyle === currentMapStyle) return;
    
    console.log(`🎨 Changing map style to: ${newStyle}`);
    setCurrentMapStyle(newStyle);
    mapRef.current.setStyle(newStyle);
    
    // Re-add custom layers after style change
    mapRef.current.once('style.load', () => {
      addCustomLayers();
    });
  }, [currentMapStyle, addCustomLayers]);

  // Handle city click
  const handleCityClick = useCallback((city, coordinates) => {
    // Close existing popup
    if (cityPopup) {
      cityPopup.remove();
    }
    
    // Create new popup
    const popup = new mapboxgl.Popup({ offset: 15 })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setHTML(createCityPopup(city, coordinates))
      .addTo(mapRef.current);
    
    setCityPopup(popup);
    
    console.log(`🏙️ Clicked city: ${city.name}, ${city.state}`);
  }, [cityPopup]);

  // Handle district click
  const handleDistrictClick = useCallback((district) => {
    console.log('🗺️ District clicked:', district);
    setSelectedDistrict(district);
    
    // Optional: Show popup
    if (mapRef.current) {
      new mapboxgl.Popup()
        .setLngLat([district.lng || 77.2090, district.lat || 28.6139]) // Default to Delhi if no coordinates
        .setHTML(createDistrictPopup(district))
        .addTo(mapRef.current);
    }
    
    // Optional: Filter locations by district if we have district-location mapping
    // This could be implemented later when we have more detailed location data
  }, []);

  // Handle district selection from control
  const handleDistrictSelect = useCallback((district) => {
    console.log('🗺️ District selected from control:', district);
    setSelectedDistrict(district);
    
    // Optionally zoom to district bounds
    if (mapRef.current && district) {
      // This would require district center coordinates
      // For now, just log the selection
      console.log('🗺️ Would zoom to district:', district.district);
    }
  }, []);

  // Enhanced back to state selection that doesn't clear everything
  const backToStateSelection = useCallback(() => {
    if (isAnimating) return;
    
    console.log('🗺️ Going back to state selection (enhanced)');
    setIsAnimating(true);
    
    // Clear current state selection but keep districts visible at appropriate zoom
    setSelectedState(null);
    setStateLocations([]);
    setCurrentLocationIndex(0);
    setIsModalOpen(false);
    setSelectedDistrict(null);
    
    // Clear city popup
    if (cityPopup) {
      cityPopup.remove();
      setCityPopup(null);
    }
    
    // Clear location markers
    clearMarkers();
    
    // Zoom out to show all of India
    const settings = VIEW_SETTINGS[currentView];
    mapRef.current.flyTo({
      center: indiaCenter,
      zoom: settings.overviewZoom,
      pitch: settings.pitch,
      bearing: settings.bearing,
      duration: 2000,
      essential: true
    });
    
    // Set view mode back to state selection
    setViewMode(VIEW_MODES.STATE_SELECTION);
    
    setTimeout(() => setIsAnimating(false), 2200);
  }, [isAnimating, clearMarkers, currentView, cityPopup]);

  // Add a new function to clear state selection but stay in current view
  const clearStateSelection = useCallback(() => {
    console.log('🗺️ Clearing state selection but keeping current view');
    setSelectedState(null);
    setStateLocations([]);
    setCurrentLocationIndex(0);
    setSelectedDistrict(null);
    clearMarkers();
  }, [clearMarkers]);

  // Select a state (moved up to avoid reference error)
  const selectState = useCallback(async (stateName) => {
    if (isAnimating || !mapRef.current) return;
    
    console.log('🏛️ selectState called with:', stateName);
    console.log('🏛️ Current viewMode:', viewMode);
    console.log('🏛️ isAnimating:', isAnimating);
    
    setIsAnimating(true);
    setSelectedState(stateName);
    setViewMode(VIEW_MODES.STATE_FOCUSED);
    
    console.log('🗺️ State selected for districts:', stateName);
    console.log('🗺️ This should trigger DistrictBoundariesLayer update');
    
    // Filter locations by their mapped GeoJSON state name
    const stateFilteredLocations = locations.filter(location => {
      const mappedStateName = mapApiStateToGeoJSONState(location.state);
      return mappedStateName === stateName;
    });
    
    console.log(`🏛️ Found ${stateFilteredLocations.length} locations for ${stateName} (mapped from API states)`);
    setStateLocations(stateFilteredLocations);
    setCurrentLocationIndex(0);
    
    console.log(`🏛️ Focusing on ${stateName} with ${stateFilteredLocations.length} locations`);
    
    // Fly to state bounds with current view settings
    if (stateFilteredLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      stateFilteredLocations.forEach(loc => {
        if (loc.longitude && loc.latitude) {
          bounds.extend([parseFloat(loc.longitude), parseFloat(loc.latitude)]);
        }
      });
      
      const settings = VIEW_SETTINGS[currentView];
      mapRef.current.fitBounds(bounds, {
        padding: 80,
        duration: 2000,
        pitch: settings.pitch,
        bearing: settings.bearing,
        essential: true
      });
    }
    
    setTimeout(() => {
      addLocationMarkers(stateFilteredLocations, 0);
      setViewMode(VIEW_MODES.LOCATION_NAVIGATION);
      setIsAnimating(false);
    }, 2200);
    
  }, [locations, isAnimating, addLocationMarkers, currentView, viewMode]);

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
          if (isModalOpen) {
            setIsModalOpen(false);
          } else {
            backToStateSelection();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, isAnimating, nextLocation, prevLocation, backToStateSelection, isModalOpen]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    console.log('🗺️ Initializing ClayGrounds Tycoon with Enhanced 3D Environment...');
    
    const initialSettings = VIEW_SETTINGS[currentView];
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: currentMapStyle,
      center: indiaCenter,
      zoom: initialSettings.overviewZoom,
      pitch: initialSettings.pitch,
      bearing: initialSettings.bearing,
      antialias: true,
    });
    
    mapRef.current = map;

    // Add controls
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }));

    // Add custom layers on style load
    map.on('style.load', addCustomLayers);

    return () => {
      clearMarkers();
      if (cityPopup) {
        cityPopup.remove();
      }
      map.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Clear district selection when state changes
  useEffect(() => {
    if (selectedState) {
      setSelectedDistrict(null); // Clear district when state changes
    }
  }, [selectedState]);

  // Cleanup city popup when component unmounts
  useEffect(() => {
    return () => {
      if (cityPopup) {
        cityPopup.remove();
      }
    };
  }, [cityPopup]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="mapbox-map-container" style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        background: '#0f172a', color: '#ffffff', flexDirection: 'column',
        textAlign: 'center', padding: '20px'
      }}>
        <h2>🏗️ ClayGrounds Tycoon 3D</h2>
        <p>Mapbox token not configured.</p>
        <p>Please add <code>REACT_APP_MAPBOX_ACCESS_TOKEN</code> to your .env file</p>
      </div>
    );
  }

  return (
    <div className="mapbox-map-container urban-3d">
      {loading && (
        <div className="loading-overlay">
          <h3>🏗️ Loading Urban Environment...</h3>
          <p>Preparing 3D city view...</p>
        </div>
      )}
      {error && (
        <div className="error-overlay">
          <h3>⚠️ Connection Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
      
      {/* Add State Boundaries Layer */}
      <StateBoundariesLayer
        map={mapRef.current}
        selectedState={selectedState}
        availableStates={availableStates}
        isVisible={true}
        onStateClick={selectState}
        viewMode={viewMode}
      />
      
      {/* Add Cities Layer */}
      <CitiesLayer
        map={mapRef.current}
        isVisible={showCities}
        onCityClick={handleCityClick}
      />
      
      {/* Add District Boundaries Layer */}
      <DistrictBoundariesLayer
        map={mapRef.current}
        selectedState={selectedState}
        isVisible={showDistricts}
        onDistrictClick={handleDistrictClick}
        selectedDistrict={selectedDistrict}
      />
      
      <GameUI
        viewMode={viewMode}
        apiTestResult={apiTestResult}
        availableStates={availableStates}
        selectedState={selectedState}
        stateLocations={stateLocations}
        currentLocationIndex={currentLocationIndex}
        isAnimating={isAnimating}
        onSelectState={selectState}
        onBackToStateSelection={backToStateSelection}
        onPrevLocation={prevLocation}
        onNextLocation={nextLocation}
      />
      
      <ViewControl
        currentView={currentView}
        onViewChange={handleViewChange}
        isVisible={viewMode !== VIEW_MODES.STATE_FOCUSED}
      />
      
      <MapStyleSwitcher
        currentStyle={currentMapStyle}
        onStyleChange={handleStyleChange}
        isVisible={viewMode === VIEW_MODES.STATE_SELECTION}
      />

      {/* Add State Control */}
      <StateControl
        availableStates={availableStates}
        selectedState={selectedState}
        onStateSelect={selectState}
        onClearSelection={clearStateSelection}
        isVisible={viewMode === VIEW_MODES.STATE_SELECTION}
      />

      {/* Add Cities Control */}
      <CitiesControl
        showCities={showCities}
        onToggleCities={setShowCities}
        currentFilter={cityFilter}
        onFilterChange={setCityFilter}
        isControlVisible={viewMode === VIEW_MODES.STATE_SELECTION}
      />
      
      {/* Add District Control */}
      <DistrictControl
        selectedState={selectedState}
        selectedDistrict={selectedDistrict}
        onDistrictSelect={handleDistrictSelect}
        onClearSelection={clearStateSelection}
        isVisible={selectedState !== null || showDistricts}
      />

      <LocationModal
        location={selectedLocationForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNavigate={handleModalNavigation}
        locationIndex={currentLocationIndex}
        totalLocations={stateLocations.length}
      />
    </div>
  );
};

export default MapContainer; 