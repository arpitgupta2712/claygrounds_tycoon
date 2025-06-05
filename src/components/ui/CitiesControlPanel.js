import React from 'react';
import ControlPanel from './ControlPanel';

const CITY_FILTERS = {
  ALL: { id: 'all', name: 'All Cities', icon: '🏙️', description: 'Show all cities' },
  TOP_10: { id: 'top-10', name: 'Top 10', icon: '🔥', description: 'Top 10 largest cities' },
  TOP_50: { id: 'top-50', name: 'Top 50', icon: '⭐', description: 'Top 50 largest cities' },
  METROS: { id: 'metros', name: 'Metros', icon: '🚇', description: 'Metropolitan cities' }
};

const CitiesControlPanel = ({ 
  isVisible = true, 
  showCities = false, 
  onToggleCities, 
  currentFilter = 'all',
  onFilterChange,
  isControlVisible = true 
}) => {
  if (!isControlVisible || !isVisible) return null;

  return (
    <ControlPanel
      title="Cities"
      icon="🏙️"
      badge={showCities ? "ON" : "OFF"}
      defaultExpanded={showCities}
    >
      {/* Cities Toggle */}
      <div className="cg-control-group">
        <div 
          className="cg-toggle"
          onClick={() => onToggleCities && onToggleCities(!showCities)}
        >
          <div className={`cg-toggle-switch ${showCities ? 'active' : ''}`}></div>
          <div className="cg-toggle-label">Show Cities</div>
        </div>
      </div>
      
      {/* City Filters */}
      {showCities && (
        <div className="cg-control-group">
          <div className="cg-control-group-title">Filter Cities</div>
          <div className="cg-filter-buttons">
            {Object.values(CITY_FILTERS).map((filter) => (
              <button
                key={filter.id}
                className={`cg-filter-button ${currentFilter === filter.id ? 'active' : ''}`}
                onClick={() => onFilterChange && onFilterChange(filter.id)}
                title={filter.description}
              >
                <span>{filter.icon}</span>
                <span>{filter.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Description */}
      {showCities && currentFilter && (
        <div className="cg-control-group">
          <div className="cg-control-item">
            <div className="cg-control-item-icon">
              {CITY_FILTERS[currentFilter]?.icon || '🏙️'}
            </div>
            <div className="cg-control-item-content">
              <div className="cg-control-item-title">
                {CITY_FILTERS[currentFilter]?.name || 'Current Filter'}
              </div>
              <div className="cg-control-item-description">
                {CITY_FILTERS[currentFilter]?.description || 'Active city filter'}
              </div>
            </div>
          </div>
        </div>
      )}
    </ControlPanel>
  );
};

export default CitiesControlPanel;
export { CITY_FILTERS }; 