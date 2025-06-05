import React, { useState, useEffect } from 'react';
import ControlPanel from './ControlPanel';
import { getDistrictsByState, getDistrictStats } from '../map/DistrictBoundariesLayer';

const DistrictsControlPanel = ({ 
  selectedState = null,
  selectedDistrict = null,
  onDistrictSelect = null,
  onClearSelection = null,
  isVisible = true 
}) => {
  const [districts, setDistricts] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  // Update districts and stats when state changes
  useEffect(() => {
    if (selectedState) {
      const stateDistricts = getDistrictsByState(selectedState);
      const stateStats = getDistrictStats(selectedState);
      setDistricts(stateDistricts);
      setStats(stateStats);
      setShowAllDistricts(false);
    } else {
      // When no state is selected, optionally show all districts
      if (showAllDistricts) {
        const allDistricts = getDistrictsByState(null); // This should return all districts
        const allStats = getDistrictStats(null);
        setDistricts(allDistricts.slice(0, 50)); // Limit to first 50 for performance
        setStats(allStats);
      } else {
        setDistricts([]);
        setStats({ total: 0 });
      }
    }
  }, [selectedState, showAllDistricts]);

  if (!isVisible) return null;

  const handleDistrictClick = (district) => {
    if (onDistrictSelect) {
      onDistrictSelect(district.properties);
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

  const title = selectedState 
    ? `Districts - ${selectedState}` 
    : showAllDistricts 
      ? 'Districts - All India' 
      : 'Districts';

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
            onClick={() => setShowAllDistricts(!showAllDistricts)}
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

export default DistrictsControlPanel; 