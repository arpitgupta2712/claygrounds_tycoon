import React from 'react';

const MAP_STYLES = {
  STREETS: {
    id: 'streets-v11',
    name: 'Streets',
    style: 'mapbox://styles/mapbox/streets-v11',
    icon: '🏙️'
  },
  SATELLITE: {
    id: 'satellite-v9',
    name: 'Satellite',
    style: 'mapbox://styles/mapbox/satellite-v9',
    icon: '🛰️'
  },
  NAVIGATION_NIGHT: {
    id: 'navigation-night-v1',
    name: 'Navigation Night',
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    icon: '🌙'
  },
  OUTDOORS: {
    id: 'outdoors-v11',
    name: 'Outdoors',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    icon: '🏔️'
  }
};

const MapStyleSwitcher = ({ currentStyle, onStyleChange, isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="map-style-switcher">
      <div className="style-switcher-header">
        <span className="style-switcher-title">Map Style</span>
      </div>
      <div className="style-options">
        {Object.values(MAP_STYLES).map((style) => (
          <button
            key={style.id}
            className={`style-option ${currentStyle === style.style ? 'active' : ''}`}
            onClick={() => onStyleChange(style.style)}
            title={style.name}
          >
            <span className="style-icon">{style.icon}</span>
            <span className="style-name">{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapStyleSwitcher;
export { MAP_STYLES }; 