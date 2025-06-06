import React, { useCallback, useMemo } from 'react';
import { DataLoadingSpinner, EmptyState } from '../ui/LoadingStates';

const VIEW_MODES = {
  STATE_SELECTION: 'state_selection',
  STATE_FOCUSED: 'state_focused',
  LOCATION_NAVIGATION: 'location_navigation'
};

const GameUI = ({
  viewMode,
  apiTestResult,
  availableStates = [],
  selectedState,
  stateLocations = [],
  currentLocationIndex = 0,
  isAnimating = false,
  onSelectState,
  onBackToStateSelection,
  onPrevLocation,
  onNextLocation,
  loading = false,
  error = null
}) => {
  // Memoized event handlers for better performance
  const handleStateSelect = useCallback((state) => {
    if (onSelectState && !isAnimating) {
      onSelectState(state);
    }
  }, [onSelectState, isAnimating]);

  const handleBackToStateSelection = useCallback(() => {
    if (onBackToStateSelection) {
      onBackToStateSelection();
    }
  }, [onBackToStateSelection]);

  const handlePrevLocation = useCallback(() => {
    if (onPrevLocation && currentLocationIndex > 0) {
      onPrevLocation();
    }
  }, [onPrevLocation, currentLocationIndex]);

  const handleNextLocation = useCallback(() => {
    if (onNextLocation && currentLocationIndex < stateLocations.length - 1) {
      onNextLocation();
    }
  }, [onNextLocation, currentLocationIndex, stateLocations.length]);

  // Memoized current location data
  const currentLocation = useMemo(() => {
    return stateLocations[currentLocationIndex] || null;
  }, [stateLocations, currentLocationIndex]);

  // Memoized status information
  const locationStatus = useMemo(() => {
    if (!currentLocation) return null;
    
    const status = currentLocation.operational_status || currentLocation.current_status || 'Unknown';
    return {
      status,
      isActive: status === 'Active',
      className: status === 'Active' ? 'active' : 'inactive'
    };
  }, [currentLocation]);
  // Handle loading state
  if (loading) {
    return (
      <div className="game-ui modern-ui">
        <div className="game-header">
          <h2>🏗️ ClayGrounds Tycoon 3D</h2>
        </div>
        <DataLoadingSpinner type="game" message="Loading game interface..." />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="game-ui modern-ui">
        <div className="game-header">
          <h2>🏗️ ClayGrounds Tycoon 3D</h2>
        </div>
        <EmptyState 
          icon="❌"
          title="Game Interface Error"
          message={error.message || "Failed to load game interface"}
        />
      </div>
    );
  }

  return (
    <div className="game-ui modern-ui">
      <div className="game-header">
        <h2>🏗️ ClayGrounds Tycoon 3D</h2>
        {apiTestResult && (
          <div className={`api-status ${apiTestResult.success ? 'connected' : 'failed'}`}>
            {apiTestResult.success ? '✅ Connected' : '❌ Failed'}
          </div>
        )}
      </div>
      
      {viewMode === VIEW_MODES.STATE_SELECTION && (
        <div className="state-selection-ui">
          <h3>🗺️ Select Your Territory</h3>
          <p>Choose a state to explore in 3D urban environment</p>
          <div className="available-states">
            {availableStates.length > 0 ? (
              availableStates.map(state => (
                <button 
                  key={state} 
                  className="state-button modern-button"
                  onClick={() => handleStateSelect(state)}
                  disabled={isAnimating}
                >
                  {state}
                </button>
              ))
            ) : (
              <EmptyState 
                icon="🗺️"
                title="No states available"
                message="No states are currently available for exploration."
              />
            )}
          </div>
          <p className="instruction">💡 Click on a state on the map or use buttons above</p>
        </div>
      )}
      
      {viewMode === VIEW_MODES.STATE_FOCUSED && (
        <div className="loading-state">
          <h3>🏗️ Entering {selectedState}...</h3>
          <p>Loading 3D urban environment...</p>
        </div>
      )}
      
      {viewMode === VIEW_MODES.LOCATION_NAVIGATION && stateLocations.length > 0 && (
        <div className="location-navigation-ui">
          <div className="current-state">
            <h3>🏗️ {selectedState}</h3>
            <button className="back-button" onClick={handleBackToStateSelection}>
              ← Back to Map
            </button>
          </div>
          
          {currentLocation ? (
            <>
              <div className="facility-info">
                <h4>🏟️ {currentLocation.location_name}</h4>
                <p>{currentLocationIndex + 1} of {stateLocations.length} facilities</p>
                {locationStatus && (
                  <div className="facility-status">
                    <span className={`status-badge ${locationStatus.className}`}>
                      {locationStatus.status}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="navigation-controls">
                <button 
                  onClick={handlePrevLocation} 
                  disabled={currentLocationIndex === 0}
                  className="nav-button"
                >
                  ← Previous
                </button>
                <button 
                  onClick={handleNextLocation} 
                  disabled={currentLocationIndex === stateLocations.length - 1}
                  className="nav-button"
                >
                  Next →
                </button>
              </div>
              
              <div className="keyboard-hint">
                <p>🎮 Use ← → arrow keys to navigate | ESC to go back</p>
              </div>
            </>
          ) : (
            <EmptyState 
              icon="🏟️"
              title="No facilities found"
              message={`No facilities available in ${selectedState}.`}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(GameUI);
export { VIEW_MODES }; 