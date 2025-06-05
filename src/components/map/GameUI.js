import React from 'react';

const VIEW_MODES = {
  STATE_SELECTION: 'state_selection',
  STATE_FOCUSED: 'state_focused',
  LOCATION_NAVIGATION: 'location_navigation'
};

const GameUI = ({
  viewMode,
  apiTestResult,
  availableStates,
  selectedState,
  stateLocations,
  currentLocationIndex,
  isAnimating,
  onSelectState,
  onBackToStateSelection,
  onPrevLocation,
  onNextLocation
}) => {
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
            {availableStates.map(state => (
              <button 
                key={state} 
                className="state-button modern-button"
                onClick={() => onSelectState(state)}
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
          <h3>🏗️ Entering {selectedState}...</h3>
          <p>Loading 3D urban environment...</p>
        </div>
      )}
      
      {viewMode === VIEW_MODES.LOCATION_NAVIGATION && stateLocations.length > 0 && (
        <div className="location-navigation-ui">
          <div className="current-state">
            <h3>🏗️ {selectedState}</h3>
            <button className="back-button" onClick={onBackToStateSelection}>
              ← Back to Map
            </button>
          </div>
          
          <div className="facility-info">
            <h4>🏟️ {stateLocations[currentLocationIndex]?.location_name}</h4>
            <p>{currentLocationIndex + 1} of {stateLocations.length} facilities</p>
            <div className="facility-status">
              <span className={`status-badge ${(stateLocations[currentLocationIndex]?.operational_status || stateLocations[currentLocationIndex]?.current_status) === 'Active' ? 'active' : 'inactive'}`}>
                {(stateLocations[currentLocationIndex]?.operational_status || stateLocations[currentLocationIndex]?.current_status) || 'Unknown'}
              </span>
            </div>
          </div>
          
          <div className="navigation-controls">
            <button 
              onClick={onPrevLocation} 
              disabled={currentLocationIndex === 0}
              className="nav-button"
            >
              ← Previous
            </button>
            <button 
              onClick={onNextLocation} 
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
  );
};

export default GameUI;
export { VIEW_MODES }; 