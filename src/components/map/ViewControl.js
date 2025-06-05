import React from 'react';

const VIEW_TYPES = {
  TOP_DOWN: {
    id: 'top-down',
    name: 'Top View',
    icon: '🗺️',
    pitch: 0,
    bearing: 0,
    description: 'Bird\'s eye view'
  },
  ISOMETRIC: {
    id: 'isometric',
    name: '3D View',
    icon: '🏢',
    pitch: 60,
    bearing: 0,
    description: 'Isometric 3D perspective'
  }
};

const ViewControl = ({ currentView, onViewChange, isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="view-control">
      <div className="view-control-header">
        <span className="view-control-title">View Mode</span>
      </div>
      <div className="view-options">
        {Object.values(VIEW_TYPES).map((view) => (
          <button
            key={view.id}
            className={`view-option ${currentView === view.id ? 'active' : ''}`}
            onClick={() => onViewChange(view)}
            title={view.description}
          >
            <span className="view-icon">{view.icon}</span>
            <span className="view-name">{view.name}</span>
          </button>
        ))}
      </div>
      <div className="view-description">
        <span className="current-view-desc">
          {VIEW_TYPES[currentView]?.description || 'Current view'}
        </span>
      </div>
    </div>
  );
};

export default ViewControl;
export { VIEW_TYPES }; 