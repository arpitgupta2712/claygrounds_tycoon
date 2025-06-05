import React from 'react';
import ControlPanel from './ControlPanel';

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

const ViewControlPanel = ({ currentView, onViewChange, isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <ControlPanel
      title="View Mode"
      icon="👁️"
      defaultExpanded={true}
    >
      <div className="cg-control-group">
        {Object.values(VIEW_TYPES).map((view) => (
          <div
            key={view.id}
            className={`cg-control-item cg-control-item-clickable ${
              currentView === view.id ? 'cg-control-item-selected' : ''
            }`}
            onClick={() => onViewChange(view)}
            title={view.description}
          >
            <div className="cg-control-item-icon">{view.icon}</div>
            <div className="cg-control-item-content">
              <div className="cg-control-item-title">{view.name}</div>
              <div className="cg-control-item-description">{view.description}</div>
            </div>
          </div>
        ))}
      </div>
    </ControlPanel>
  );
};

export default ViewControlPanel;
export { VIEW_TYPES }; 