import React, { useState, useMemo, useCallback } from 'react';
import ControlPanel from './ControlPanel';
import { getDistrictsByState, getDistrictStats } from '../map/layers/DistrictBoundariesLayer';
import { useIndiaDistrictsData } from '../../hooks';
import { DataLoadingSpinner, DataError } from './LoadingStates';

const DistrictsControlPanel = ({ 
  selectedState = null,
  selectedDistrict = null,
  onDistrictSelect = null,
  onClearSelection = null,
  isVisible = true 
}) => {
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  
  // Use optimized data fetching hook
  const { data: districtsData, loading, error, refetch } = useIndiaDistrictsData();

  // Memoized computed values for better performance
  const { districts, stats } = useMemo(() => {
    if (!districtsData) {
      return { districts: [], stats: { total: 0 } };
    }

    if (selectedState) {
      const stateDistricts = getDistrictsByState(selectedState, districtsData);
      const stateStats = getDistrictStats(selectedState, districtsData);
      return { districts: stateDistricts, stats: stateStats };
    } else if (showAllDistricts) {
      const allDistricts = getDistrictsByState(null, districtsData);
      const allStats = getDistrictStats(null, districtsData);
      return { 
        districts: allDistricts.slice(0, 50), // Limit for performance
        stats: allStats 
      };
    } else {
      return { districts: [], stats: { total: 0 } };
    }
  }, [districtsData, selectedState, showAllDistricts]);

  // Memoized event handlers for better performance
  const handleDistrictClick = useCallback((district) => {
    if (onDistrictSelect) {
      onDistrictSelect(district.properties);
    }
  }, [onDistrictSelect]);

  const handleClearSelection = useCallback(() => {
    if (onClearSelection) {
      onClearSelection();
    }
  }, [onClearSelection]);

  const handleToggleAllDistricts = useCallback(() => {
    setShowAllDistricts(prev => !prev);
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

  const title = selectedState 
    ? `Districts - ${selectedState}` 
    : showAllDistricts 
      ? 'Districts - All India' 
      : 'Districts';

  // Handle loading state
  if (loading) {
    return (
      <ControlPanel
        title="Districts"
        icon="🗺️"
        defaultExpanded={selectedState !== null}
      >
        <DataLoadingSpinner type="districts" size="small" />
      </ControlPanel>
    );
  }

  // Handle error state
  if (error) {
    return (
      <ControlPanel
        title="Districts"
        icon="🗺️"
        defaultExpanded={selectedState !== null}
      >
        <DataError 
          error={error} 
          retry={refetch} 
          dataType="districts data"
          compact={true}
        />
      </ControlPanel>
    );
  }

  return (
    <ControlPanel
      title={title}
      icon="🗺️"
      badge={districts.length > 0 ? districts.length : null}
      headerActions={clearButton}
      defaultExpanded={selectedState !== null}
    >
      {!selectedState ? (
        <div className="cg-control-group">
          <div className="cg-control-item">
            <div className="cg-control-item-icon">🗺️</div>
            <div className="cg-control-item-content">
              <div className="cg-control-item-title">
                {showAllDistricts ? 'Showing all districts' : 'Select a state to view districts'}
              </div>
              <div className="cg-control-item-description">
                {showAllDistricts ? 'Displaying districts from all states' : 'Choose a state from the States panel above'}
              </div>
            </div>
          </div>
          
          {/* Show All Districts Toggle */}
          <div 
            className="cg-toggle"
            onClick={handleToggleAllDistricts}
          >
            <div className={`cg-toggle-switch ${showAllDistricts ? 'active' : ''}`}></div>
            <div className="cg-toggle-label">
              {showAllDistricts ? 'Hide all districts' : 'Show all districts'}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* District Statistics */}
          <div className="cg-stats-grid">
            <div className="cg-stat-item">
              <span className="cg-stat-number">{stats.total}</span>
              <span className="cg-stat-label">
                {selectedState ? `Districts in ${selectedState}` : 'Total Districts'}
              </span>
            </div>
          </div>
        </>
      )}

      {/* District List */}
      {districts.length > 0 && (
        <div className="cg-control-group">
          <div className="cg-control-group-title">
            {selectedState ? `${selectedState} Districts` : 'All Districts'}
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {districts.map((district, index) => (
              <div
                key={district.properties.district || index}
                className={`cg-control-item cg-control-item-clickable ${
                  selectedDistrict?.district === district.properties.district ? 'cg-control-item-selected' : ''
                }`}
                onClick={() => handleDistrictClick(district)}
                title={`Click to select ${district.properties.district}`}
              >
                <div className="cg-control-item-icon">🏛️</div>
                <div className="cg-control-item-content">
                  <div className="cg-control-item-title">
                    {district.properties.district}
                  </div>
                  <div className="cg-control-item-description">
                    {district.properties.st_nm} • Code: {district.properties.dt_code || 'N/A'}
                  </div>
                </div>
              </div>
            ))}
            {!selectedState && showAllDistricts && districts.length >= 50 && (
              <div className="cg-control-item">
                <div className="cg-control-item-content">
                  <div className="cg-control-item-description">
                    Showing first 50 districts. Select a state to see all districts.
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
export default React.memo(DistrictsControlPanel); 