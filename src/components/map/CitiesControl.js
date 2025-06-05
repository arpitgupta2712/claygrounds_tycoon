import React, { useState } from 'react';
import '../../styles/cities.css';

const CITY_FILTERS = {
  ALL: { id: 'all', name: 'All Cities', icon: '🏙️' },
  TOP_10: { id: 'top-10', name: 'Top 10', icon: '🔥' },
  TOP_50: { id: 'top-50', name: 'Top 50', icon: '⭐' },
  METROS: { id: 'metros', name: 'Metros', icon: '🚇' }
};

const CitiesControl = ({ 
  isVisible = true, 
  showCities = false, 
  onToggleCities, 
  currentFilter = 'all',
  onFilterChange,
  isControlVisible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isControlVisible) return null;

  return (
    <div className="cities-toggle">
      <div className="cities-toggle-header">
        <span className="cities-toggle-title">🏙️ Cities</span>
      </div>
      
      <div className="cities-toggle-content">
        <div className="cities-toggle-switch">
          <input
            type="checkbox"
            id="cities-visibility"
            checked={showCities}
            onChange={(e) => onToggleCities && onToggleCities(e.target.checked)}
          />
          <label htmlFor="cities-visibility">Show Cities</label>
        </div>
        
        {showCities && (
          <div className="cities-filter">
            <span className="cities-filter-label">Filter:</span>
            <div className="cities-filter-buttons">
              {Object.values(CITY_FILTERS).map((filter) => (
                <button
                  key={filter.id}
                  className={`cities-filter-button ${currentFilter === filter.id ? 'active' : ''}`}
                  onClick={() => onFilterChange && onFilterChange(filter.id)}
                  title={filter.name}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { CITY_FILTERS };
export default CitiesControl; 