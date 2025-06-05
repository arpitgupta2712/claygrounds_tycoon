import React, { useState, useEffect } from 'react';
import { getDistrictsByState, getDistrictStats } from './DistrictBoundariesLayer';
import '../../styles/districts.css';

const DistrictControl = ({ 
  selectedState = null,
  selectedDistrict = null,
  onDistrictSelect = null,
  onClearSelection = null,
  isVisible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
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

  const toggleShowAllDistricts = () => {
    setShowAllDistricts(!showAllDistricts);
  };

  return (
    <div className="district-control">
      <div className="district-control-header">
        <span className="district-control-title">
          🗺️ Districts {selectedState ? `- ${selectedState}` : showAllDistricts ? '- All India' : ''}
        </span>
        <div className="district-control-buttons">
          {selectedState && onClearSelection && (
            <button 
              className="district-clear-btn"
              onClick={handleClearSelection}
              title="Clear state selection"
            >
              ✕
            </button>
          )}
          <button 
            className="district-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {!selectedState ? (
            <div className="district-no-state">
              <span className="district-no-state-icon">🗺️</span>
              <div className="district-no-state-text">
                {showAllDistricts ? 'Showing all districts' : 'Select a state or zoom in to view districts'}
              </div>
              <div className="district-no-state-hint">
                <button 
                  className="district-show-all-btn"
                  onClick={toggleShowAllDistricts}
                >
                  {showAllDistricts ? 'Hide all districts' : 'Show all districts'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* District Statistics */}
              <div className="district-stats">
                <div className="district-stat">
                  <span className="district-stat-number">{stats.total}</span>
                  <span className="district-stat-label">
                    {selectedState ? `Districts in ${selectedState}` : 'Total Districts'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* District List */}
          {districts.length > 0 && (
            <div className="district-list">
              {districts.map((district, index) => (
                <div
                  key={district.properties.district || index}
                  className={`district-list-item ${
                    selectedDistrict?.district === district.properties.district ? 'selected' : ''
                  }`}
                  onClick={() => handleDistrictClick(district)}
                  title={`Click to select ${district.properties.district}`}
                >
                  <div className="district-list-item-info">
                    <div className="district-list-item-name">
                      {district.properties.district}
                    </div>
                    <div className="district-list-item-type">
                      {district.properties.st_nm} • Code: {district.properties.dt_code || 'N/A'}
                    </div>
                  </div>
                  <div className="district-list-item-icon">
                    🏛️
                  </div>
                </div>
              ))}
              {!selectedState && showAllDistricts && districts.length >= 50 && (
                <div className="district-list-more">
                  Showing first 50 districts. Select a state to see all districts.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DistrictControl; 