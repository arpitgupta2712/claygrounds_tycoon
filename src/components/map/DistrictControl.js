import React, { useState, useEffect } from 'react';
import { getDistrictsByState, getDistrictStats } from './DistrictBoundariesLayer';
import '../../styles/districts.css';

const DistrictControl = ({ 
  selectedState = null,
  selectedDistrict = null,
  onDistrictSelect = null,
  isVisible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [stats, setStats] = useState({ total: 0, metro: 0, major: 0, city: 0, regional: 0 });

  // Update districts and stats when state changes
  useEffect(() => {
    if (selectedState) {
      const stateDistricts = getDistrictsByState(selectedState);
      const stateStats = getDistrictStats(selectedState);
      setDistricts(stateDistricts);
      setStats(stateStats);
    } else {
      setDistricts([]);
      setStats({ total: 0, metro: 0, major: 0, city: 0, regional: 0 });
    }
  }, [selectedState]);

  if (!isVisible) return null;

  const typeIcons = {
    metro: '🏙️',
    major: '🌆',
    city: '🏘️',
    regional: '🌾'
  };

  const handleDistrictClick = (district) => {
    if (onDistrictSelect) {
      onDistrictSelect(district.properties);
    }
  };

  return (
    <div className="district-control">
      <div className="district-control-header">
        <span className="district-control-title">
          🗺️ Districts {selectedState ? `- ${selectedState}` : ''}
        </span>
        <button 
          className="district-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <>
          {!selectedState ? (
            <div className="district-no-state">
              <span className="district-no-state-icon">🗺️</span>
              <div className="district-no-state-text">Select a state to view districts</div>
              <div className="district-no-state-hint">Click on any state on the map</div>
            </div>
          ) : (
            <>
              {/* District Statistics */}
              <div className="district-stats">
                <div className="district-stat">
                  <span className="district-stat-number">{stats.total}</span>
                  <span className="district-stat-label">Total</span>
                </div>
                <div className="district-stat">
                  <span className="district-stat-number">{stats.metro + stats.major}</span>
                  <span className="district-stat-label">Major</span>
                </div>
              </div>

              {/* District Legend */}
              <div className="district-legend">
                <div className="district-legend-title">District Types</div>
                {stats.metro > 0 && (
                  <div className="district-legend-item">
                    <div className="district-legend-color metro"></div>
                    <span className="district-legend-label">Metro ({stats.metro})</span>
                  </div>
                )}
                {stats.major > 0 && (
                  <div className="district-legend-item">
                    <div className="district-legend-color major"></div>
                    <span className="district-legend-label">Major City ({stats.major})</span>
                  </div>
                )}
                {stats.city > 0 && (
                  <div className="district-legend-item">
                    <div className="district-legend-color city"></div>
                    <span className="district-legend-label">City ({stats.city})</span>
                  </div>
                )}
                {stats.regional > 0 && (
                  <div className="district-legend-item">
                    <div className="district-legend-color regional"></div>
                    <span className="district-legend-label">Regional ({stats.regional})</span>
                  </div>
                )}
              </div>

              {/* District List */}
              {districts.length > 0 && (
                <div className="district-list">
                  {districts.map((district, index) => (
                    <div
                      key={district.properties.id}
                      className={`district-list-item ${
                        selectedDistrict?.id === district.properties.id ? 'selected' : ''
                      }`}
                      onClick={() => handleDistrictClick(district)}
                      title={`Click to select ${district.properties.name}`}
                    >
                      <div className="district-list-item-info">
                        <div className="district-list-item-name">
                          {district.properties.city_name}
                        </div>
                        <div className="district-list-item-type">
                          {district.properties.district_type} district
                          {district.properties.cities_count && 
                            ` • ${district.properties.cities_count} cities`
                          }
                        </div>
                      </div>
                      <div className="district-list-item-icon">
                        {typeIcons[district.properties.district_type]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DistrictControl; 