import React, { useState, useEffect } from 'react';
import { getAvailableStatesFromData, getStateStats } from './StateBoundariesLayer';

const StateControl = ({ 
  availableStates = [],
  selectedState = null,
  onStateSelect = null,
  onClearSelection = null,
  isVisible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [allStates, setAllStates] = useState([]);
  const [stats, setStats] = useState({ total: 0 });

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

  return (
    <div className="state-control">
      <div className="state-control-header">
        <span className="state-control-title">
          🏛️ States {selectedState ? `- ${selectedState}` : ''}
        </span>
        <div className="state-control-buttons">
          {selectedState && onClearSelection && (
            <button 
              className="state-clear-btn"
              onClick={handleClearSelection}
              title="Clear state selection"
            >
              ✕
            </button>
          )}
          <button 
            className="state-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* State Statistics */}
          <div className="state-stats">
            <div className="state-stat">
              <span className="state-stat-number">{stats.total}</span>
              <span className="state-stat-label">Total States</span>
            </div>
            <div className="state-stat">
              <span className="state-stat-number">{availableStates.length}</span>
              <span className="state-stat-label">Available</span>
            </div>
          </div>

          {/* Available States List */}
          {availableStates.length > 0 && (
            <div className="state-section">
              <div className="state-section-title">Available States</div>
              <div className="state-list">
                {availableStates.map((stateName, index) => (
                  <div
                    key={stateName || index}
                    className={`state-list-item ${
                      selectedState === stateName ? 'selected' : ''
                    }`}
                    onClick={() => handleStateClick(stateName)}
                    title={`Click to select ${stateName}`}
                  >
                    <div className="state-list-item-info">
                      <div className="state-list-item-name">
                        {stateName}
                      </div>
                      <div className="state-list-item-type">
                        Available for exploration
                      </div>
                    </div>
                    <div className="state-list-item-icon">
                      🏛️
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All States List (collapsed by default) */}
          {allStates.length > availableStates.length && (
            <div className="state-section">
              <div className="state-section-title">
                Other States ({allStates.length - availableStates.length})
              </div>
              <div className="state-list collapsed">
                {allStates
                  .filter(stateName => !availableStates.includes(stateName))
                  .slice(0, 5)
                  .map((stateName, index) => (
                    <div
                      key={stateName || index}
                      className="state-list-item disabled"
                      title={`${stateName} - No locations available`}
                    >
                      <div className="state-list-item-info">
                        <div className="state-list-item-name">
                          {stateName}
                        </div>
                        <div className="state-list-item-type">
                          No locations available
                        </div>
                      </div>
                      <div className="state-list-item-icon">
                        🏛️
                      </div>
                    </div>
                  ))}
                {allStates.length - availableStates.length > 5 && (
                  <div className="state-list-more">
                    +{allStates.length - availableStates.length - 5} more states
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StateControl; 