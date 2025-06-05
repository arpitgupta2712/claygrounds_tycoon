import React from 'react';
import ControlPanel from './ControlPanel';

const TerritorySelectionPanel = ({
  viewMode,
  apiTestResult,
  availableStates,
  selectedState,
  onSelectState,
  isAnimating
}) => {
  return (
    <>
      {/* Header Panel */}
      <ControlPanel
        title="ClayGrounds Tycoon 3D"
        icon="🏗️"
        isCollapsible={false}
        className="cg-territory-header"
      >
        <div className="cg-territory-welcome">
          <div className="cg-territory-subtitle">
            🗺️ Build Your Sports Empire
          </div>
          <div className="cg-territory-description">
            Choose a state to explore in immersive 3D urban environment. 
            Manage facilities, track performance, and expand your territory across India.
          </div>
          
          {/* API Status */}
          {apiTestResult && (
            <div className={`cg-territory-status ${apiTestResult.success ? 'success' : 'error'}`}>
              <span className="cg-territory-status-icon">
                {apiTestResult.success ? '✅' : '❌'}
              </span>
              <span className="cg-territory-status-text">
                {apiTestResult.success ? 'Connected to ClayGrounds API' : 'API Connection Failed'}
              </span>
            </div>
          )}
        </div>
      </ControlPanel>

      {/* Territory Selection */}
      <ControlPanel
        title="Select Your Territory"
        icon="🎯"
        badge={availableStates.length}
        defaultExpanded={true}
        className="cg-territory-selection"
      >
        <div className="cg-territory-instructions">
          <div className="cg-control-item">
            <div className="cg-control-item-icon">💡</div>
            <div className="cg-control-item-content">
              <div className="cg-control-item-description">
                Click on a state below or directly on the map to begin your journey
              </div>
            </div>
          </div>
        </div>

        {/* Available States Grid */}
        {availableStates.length > 0 && (
          <div className="cg-territory-states">
            <div className="cg-control-group-title">Available Territories</div>
            <div className="cg-territory-grid">
              {availableStates.map(state => (
                <button 
                  key={state} 
                  className={`cg-territory-card ${selectedState === state ? 'selected' : ''}`}
                  onClick={() => onSelectState(state)}
                  disabled={isAnimating}
                  title={`Explore ${state}`}
                >
                  <div className="cg-territory-card-icon">🏛️</div>
                  <div className="cg-territory-card-name">{state}</div>
                  <div className="cg-territory-card-action">
                    {selectedState === state ? 'Selected' : 'Explore'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="cg-stats-grid">
          <div className="cg-stat-item">
            <span className="cg-stat-number">{availableStates.length}</span>
            <span className="cg-stat-label">States Available</span>
          </div>
          <div className="cg-stat-item">
            <span className="cg-stat-number">3D</span>
            <span className="cg-stat-label">Urban View</span>
          </div>
        </div>
      </ControlPanel>

      {/* Getting Started Tips */}
      <ControlPanel
        title="Getting Started"
        icon="🚀"
        defaultExpanded={false}
        className="cg-territory-tips"
      >
        <div className="cg-control-group">
          <div className="cg-control-item">
            <div className="cg-control-item-icon">🗺️</div>
            <div className="cg-control-item-content">
              <div className="cg-control-item-title">Explore the Map</div>
              <div className="cg-control-item-description">
                Use mouse/touch to pan, zoom, and rotate the 3D map
              </div>
            </div>
          </div>
          
          <div className="cg-control-item">
            <div className="cg-control-item-icon">🏢</div>
            <div className="cg-control-item-content">
              <div className="cg-control-item-title">Switch Views</div>
              <div className="cg-control-item-description">
                Toggle between top-down and isometric 3D perspectives
              </div>
            </div>
          </div>
          
          <div className="cg-control-item">
            <div className="cg-control-item-icon">🎮</div>
            <div className="cg-control-item-content">
              <div className="cg-control-item-title">Use Controls</div>
              <div className="cg-control-item-description">
                Access map styles, cities, and districts from the right panel
              </div>
            </div>
          </div>
        </div>
      </ControlPanel>
    </>
  );
};

export default TerritorySelectionPanel; 