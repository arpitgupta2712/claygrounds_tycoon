import React from 'react';
import ControlPanel from './ControlPanel';

const MAP_STYLES = {
  STREETS: {
    id: 'streets-v11',
    name: 'Streets',
    style: 'mapbox://styles/mapbox/streets-v11',
    icon: '🏙️',
    description: 'Standard street map'
  },
  SATELLITE: {
    id: 'satellite-v9',
    name: 'Satellite',
    style: 'mapbox://styles/mapbox/satellite-v9',
    icon: '🛰️',
    description: 'Satellite imagery'
  },
  NAVIGATION_NIGHT: {
    id: 'navigation-night-v1',
    name: 'Navigation Night',
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    icon: '🌙',
    description: 'Dark navigation theme'
  },
  OUTDOORS: {
    id: 'outdoors-v11',
    name: 'Outdoors',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    icon: '🏔️',
    description: 'Outdoor terrain map'
  }
};

const MapStyleControlPanel = ({ currentStyle, onStyleChange, isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <ControlPanel
      title="Map Style"
      icon="🎨"
      defaultExpanded={false}
    >
      <div className="cg-control-group">
        {Object.values(MAP_STYLES).map((style) => (
          <div
            key={style.id}
            className={`cg-control-item cg-control-item-clickable ${
              currentStyle === style.style ? 'cg-control-item-selected' : ''
            }`}
            onClick={() => onStyleChange(style.style)}
            title={style.description}
          >
            <div className="cg-control-item-icon">{style.icon}</div>
            <div className="cg-control-item-content">
              <div className="cg-control-item-title">{style.name}</div>
              <div className="cg-control-item-description">{style.description}</div>
            </div>
          </div>
        ))}
      </div>
    </ControlPanel>
  );
};

export default MapStyleControlPanel;
export { MAP_STYLES }; 