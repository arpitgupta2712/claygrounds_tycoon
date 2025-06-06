import React, { useCallback, useMemo } from 'react';
import { DataLoadingSpinner, EmptyState } from '../ui/LoadingStates';
import { useAllStatesOverview, useStateTerritory } from '../../hooks/useTerritoryData';

const VIEW_MODES = {
  STATE_SELECTION: 'state_selection',
  STATE_FOCUSED: 'state_focused',
  LOCATION_NAVIGATION: 'location_navigation',
  BUSINESS_ANALYTICS: 'business_analytics'
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
  onViewModeChange,
  loading = false,
  error = null
}) => {
  // Business intelligence hooks
  const { 
    allStatesData, 
    territoryAnalytics, 
    loading: businessLoading, 
    formatCurrency, 
    formatPercentage 
  } = useAllStatesOverview();
  
  const { 
    stateData, 
    loading: stateLoading 
  } = useStateTerritory(selectedState);

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

  const handleViewModeChange = useCallback((newMode) => {
    if (onViewModeChange) {
      onViewModeChange(newMode);
    }
  }, [onViewModeChange]);

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

  // Enhanced state data with business metrics
  const enhancedAvailableStates = useMemo(() => {
    if (!allStatesData?.states) return availableStates.map(state => ({ name: state }));
    
    return availableStates.map(stateName => {
      const businessData = allStatesData.states.find(s => s.name === stateName);
      return {
        name: stateName,
        business: businessData?.preview || null
      };
    });
  }, [availableStates, allStatesData]);

  // Handle loading state
  if (loading) {
    return (
      <div className="game-ui modern-ui">
        <div className="game-header">
          <h2>🏗️ ClayGrounds Tycoon</h2>
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
          <h2>🏗️ ClayGrounds Tycoon</h2>
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
        <h2>🏗️ ClayGrounds Tycoon</h2>
        {apiTestResult && (
          <div className={`api-status ${apiTestResult.success ? 'connected' : 'failed'}`}>
            {apiTestResult.success ? '✅ Connected' : '❌ Failed'}
          </div>
        )}
        
        {/* Business Intelligence Toggle */}
        <div className="view-mode-controls">
          <button 
            className={`view-mode-btn ${viewMode === VIEW_MODES.STATE_SELECTION ? 'active' : ''}`}
            onClick={() => handleViewModeChange(VIEW_MODES.STATE_SELECTION)}
          >
            🗺️ Territory
          </button>
          <button 
            className={`view-mode-btn ${viewMode === VIEW_MODES.BUSINESS_ANALYTICS ? 'active' : ''}`}
            onClick={() => handleViewModeChange(VIEW_MODES.BUSINESS_ANALYTICS)}
          >
            📊 Analytics
          </button>
        </div>
      </div>
      
      {viewMode === VIEW_MODES.STATE_SELECTION && (
        <div className="state-selection-ui">
          <h3>🗺️ Select Your Territory</h3>
          <p>Choose a state to explore business opportunities</p>
          
          {/* Business Summary */}
          {allStatesData?.summary && (
            <div className="business-summary">
              <div className="summary-card">
                <span className="summary-icon">🏢</span>
                <div className="summary-content">
                  <span className="summary-value">{allStatesData.summary.totalFacilities}</span>
                  <span className="summary-label">Total Facilities</span>
                </div>
              </div>
              <div className="summary-card">
                <span className="summary-icon">💰</span>
                <div className="summary-content">
                  <span className="summary-value">{formatCurrency(allStatesData.summary.totalRevenue)}</span>
                  <span className="summary-label">Total Revenue</span>
                </div>
              </div>
              <div className="summary-card">
                <span className="summary-icon">📈</span>
                <div className="summary-content">
                  <span className="summary-value">{formatPercentage(allStatesData.summary.averageGrowth)}</span>
                  <span className="summary-label">Avg Growth</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="available-states">
            {enhancedAvailableStates.length > 0 ? (
              enhancedAvailableStates.map(state => (
                <button 
                  key={state.name} 
                  className="state-button modern-button enhanced"
                  onClick={() => handleStateSelect(state.name)}
                  disabled={isAnimating}
                >
                  <div className="state-button-header">
                    <span className="state-name">{state.name}</span>
                    {state.business && (
                      <span className={`trend-indicator ${state.business.trend}`}>
                        {state.business.trend === 'up' ? '📈' : '📉'}
                      </span>
                    )}
                  </div>
                  {state.business && (
                    <div className="state-business-preview">
                      <div className="business-metric">
                        <span className="metric-icon">🏟️</span>
                        <span className="metric-value">{state.business.facilities}</span>
                      </div>
                      <div className="business-metric">
                        <span className="metric-icon">💰</span>
                        <span className="metric-value">{formatCurrency(state.business.revenue)}</span>
                      </div>
                      <div className="business-metric">
                        <span className="metric-icon">📊</span>
                        <span className="metric-value">{formatPercentage(state.business.growth)}</span>
                      </div>
                    </div>
                  )}
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

      {viewMode === VIEW_MODES.BUSINESS_ANALYTICS && (
        <div className="business-analytics-ui">
          <h3>📊 Territory Analytics</h3>
          
          {businessLoading ? (
            <DataLoadingSpinner type="inline" message="Loading analytics..." />
          ) : territoryAnalytics ? (
            <div className="analytics-dashboard">
              {/* Top Performers */}
              <div className="analytics-section">
                <h4>🏆 Top Performers</h4>
                <div className="performance-list">
                  {territoryAnalytics.topPerformers.map((state, index) => (
                    <div key={state.name} className="performance-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="state-name">{state.name}</span>
                      <span className="revenue">{formatCurrency(state.preview.revenue)}</span>
                      <button 
                        className="select-btn"
                        onClick={() => handleStateSelect(state.name)}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fastest Growing */}
              <div className="analytics-section">
                <h4>🚀 Fastest Growing</h4>
                <div className="performance-list">
                  {territoryAnalytics.fastestGrowing.map((state, index) => (
                    <div key={state.name} className="performance-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="state-name">{state.name}</span>
                      <span className="growth">{formatPercentage(state.preview.growth)}</span>
                      <button 
                        className="select-btn"
                        onClick={() => handleStateSelect(state.name)}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Opportunities */}
              <div className="analytics-section">
                <h4>💎 Market Opportunities</h4>
                <div className="performance-list">
                  {territoryAnalytics.highestOpportunity.map((state, index) => (
                    <div key={state.name} className="performance-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="state-name">{state.name}</span>
                      <span className="opportunity">{state.preview.marketOpportunity.toFixed(0)}%</span>
                      <button 
                        className="select-btn"
                        onClick={() => handleStateSelect(state.name)}
                      >
                        Explore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState 
              icon="📊"
              title="Analytics Loading"
              message="Territory analytics will appear here once data is loaded."
            />
          )}
        </div>
      )}
      
      {viewMode === VIEW_MODES.STATE_FOCUSED && (
        <div className="loading-state">
          <h3>🏗️ Entering {selectedState}...</h3>
          <p>Loading territory business environment...</p>
          {stateLoading && <DataLoadingSpinner type="inline" message="Loading business data..." />}
          {stateData && (
            <div className="state-preview">
              <div className="preview-metric">
                <span>🏟️ {stateData.metrics.facilities} Facilities</span>
              </div>
              <div className="preview-metric">
                <span>💰 {formatCurrency(stateData.metrics.revenue)} Revenue</span>
              </div>
              <div className="preview-metric">
                <span>📈 {formatPercentage(stateData.metrics.growth)} Growth</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {viewMode === VIEW_MODES.LOCATION_NAVIGATION && stateLocations.length > 0 && (
        <div className="location-navigation-ui">
          <div className="current-state">
            <h3>🏗️ {selectedState}</h3>
            {stateData && (
              <div className="state-business-info">
                <span className="business-info-item">
                  🏟️ {stateData.metrics.facilities} facilities
                </span>
                <span className="business-info-item">
                  💰 {formatCurrency(stateData.metrics.revenue)}
                </span>
                <span className="business-info-item">
                  📈 {formatPercentage(stateData.metrics.growth)}
                </span>
              </div>
            )}
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