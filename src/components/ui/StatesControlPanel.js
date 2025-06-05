import React, { useState, useEffect } from 'react';
import ControlPanel from './ControlPanel';
import { getAvailableStatesFromData, getStateStats } from '../map/StateBoundariesLayer';

const StatesControlPanel = ({ 
  availableStates = [],
  selectedState = null,
  onStateSelect = null,
  onClearSelection = null,
  isVisible = true 
}) => {
  const [allStates, setAllStates] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [showAllStates, setShowAllStates] = useState(false);

  // Load all states data
  useEffect(() => {
    const statesFromData = getAvailableStatesFromData();
    const stateStats = getStateStats();
    setAllStates(statesFromData);
    setStats(stateStats);
  }, []);

  if (!isVisible) return null;

  const handleStateClick = (stateName) => {
    if (onStateSelect) {
      onStateSelect(stateName);
    }
  };

  const handleClearSelection = () => {
    if (onClearSelection) {
      onClearSelection();
    }
  };

  const clearButton = selectedState && onClearSelection ? (
    <button 
      className="cg-btn cg-btn-ghost cg-btn-sm"
      onClick={handleClearSelection}
      title="Clear state selection"
    >
      Clear
    </button>
  ) : null;

  return (
    <ControlPanel
      title={selectedState ? `States - ${selectedState}` : "States"}
      icon="🏛️"
      badge={availableStates.length > 0 ? availableStates.length : null}
      headerActions={clearButton}
      defaultExpanded={true}
    >
      {/* State Statistics */}
      <div className="cg-stats-grid">
        <div className="cg-stat-item">
          <span className="cg-stat-number">{stats.total}</span>
          <span className="cg-stat-label">Total States</span>
        </div>
        <div className="cg-stat-item">
          <span className="cg-stat-number">{availableStates.length}</span>
          <span className="cg-stat-label">Available</span>
        </div>
      </div>

      {/* Available States List */}
      {availableStates.length > 0 && (
        <div className="cg-control-group">
          <div className="cg-control-group-title">Available States</div>
          {availableStates.map((stateName, index) => (
            <div
              key={stateName || index}
              className={`cg-control-item cg-control-item-clickable ${
                selectedState === stateName ? 'cg-control-item-selected' : ''
              }`}
              onClick={() => handleStateClick(stateName)}
              title={`Click to select ${stateName}`}
            >
              <div className="cg-control-item-icon">🏛️</div>
              <div className="cg-control-item-content">
                <div className="cg-control-item-title">{stateName}</div>
                <div className="cg-control-item-description">
                  Available for exploration
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All States Toggle */}
      <div className="cg-control-group">
        <div 
          className="cg-toggle"
          onClick={() => setShowAllStates(!showAllStates)}
        >
          <div className={`cg-toggle-switch ${showAllStates ? 'active' : ''}`}></div>
          <div className="cg-toggle-label">Show all states</div>
        </div>
      </div>

      {/* All States List */}
      {showAllStates && allStates.length > 0 && (
        <div className="cg-control-group">
          <div className="cg-control-group-title">All States</div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {allStates.slice(0, 20).map((stateName, index) => (
              <div
                key={stateName || index}
                className="cg-control-item cg-control-item-clickable"
                onClick={() => handleStateClick(stateName)}
                title={`Click to select ${stateName}`}
              >
                <div className="cg-control-item-icon">🗺️</div>
                <div className="cg-control-item-content">
                  <div className="cg-control-item-title">{stateName}</div>
                  <div className="cg-control-item-description">
                    {availableStates.includes(stateName) ? 'Available' : 'View only'}
                  </div>
                </div>
              </div>
            ))}
            {allStates.length > 20 && (
              <div className="cg-control-item">
                <div className="cg-control-item-content">
                  <div className="cg-control-item-description">
                    Showing first 20 of {allStates.length} states
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ControlPanel>
  );
};

export default StatesControlPanel; 