import React, { useState, useMemo, useCallback } from 'react';
import ControlPanel from './ControlPanel';
import { getAvailableStatesFromData, getStateStats } from '../map/layers/StateBoundariesLayer';
import { useIndiaStatesData } from '../../hooks';
import { DataLoadingSpinner, DataError, EmptyState } from './LoadingStates';

const StatesControlPanel = ({ 
  availableStates = [],
  selectedState = null,
  onStateSelect = null,
  onClearSelection = null,
  isVisible = true 
}) => {
  const [showAllStates, setShowAllStates] = useState(false);
  
  // Use optimized data fetching hook
  const { data: statesData, loading, error, refetch } = useIndiaStatesData();

  // Memoized computed values for better performance
  const { allStates, stats } = useMemo(() => {
    if (!statesData) {
      return { allStates: [], stats: { total: 0 } };
    }
    
    return {
      allStates: getAvailableStatesFromData(),
      stats: getStateStats()
    };
  }, [statesData]);

  // Memoized event handlers for better performance
  const handleStateClick = useCallback((stateName) => {
    if (onStateSelect) {
      onStateSelect(stateName);
    }
  }, [onStateSelect]);

  const handleClearSelection = useCallback(() => {
    if (onClearSelection) {
      onClearSelection();
    }
  }, [onClearSelection]);

  const handleToggleAllStates = useCallback(() => {
    setShowAllStates(prev => !prev);
  }, []);

  if (!isVisible) return null;

  const clearButton = selectedState && onClearSelection ? (
    <button 
      className="cg-btn cg-btn-ghost cg-btn-sm"
      onClick={handleClearSelection}
      title="Clear state selection"
    >
      Clear
    </button>
  ) : null;

  // Handle loading state
  if (loading) {
    return (
      <ControlPanel
        title="States"
        icon="🏛️"
        defaultExpanded={true}
      >
        <DataLoadingSpinner type="states" size="small" />
      </ControlPanel>
    );
  }

  // Handle error state
  if (error) {
    return (
      <ControlPanel
        title="States"
        icon="🏛️"
        defaultExpanded={true}
      >
        <DataError 
          error={error} 
          retry={refetch} 
          dataType="states data"
          compact={true}
        />
      </ControlPanel>
    );
  }

  // Handle empty state
  if (!statesData || allStates.length === 0) {
    return (
      <ControlPanel
        title="States"
        icon="🏛️"
        defaultExpanded={true}
      >
        <EmptyState 
          icon="🗺️"
          title="No states data"
          message="States information is not available."
          action={
            <button 
              className="cg-btn cg-btn-primary cg-btn-sm"
              onClick={refetch}
            >
              🔄 Reload Data
            </button>
          }
        />
      </ControlPanel>
    );
  }

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
          onClick={handleToggleAllStates}
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

// Memoize component to prevent unnecessary re-renders
export default React.memo(StatesControlPanel); 