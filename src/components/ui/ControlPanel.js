import React, { useState } from 'react';

const ControlPanel = ({ 
  title, 
  icon, 
  children, 
  isCollapsible = true,
  defaultExpanded = true,
  className = "",
  headerActions = null,
  badge = null
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`cg-control-panel ${className}`}>
      <div 
        className={`cg-control-panel-header ${isCollapsible ? 'cg-control-panel-header-clickable' : ''}`}
        onClick={handleToggle}
      >
        <div className="cg-control-panel-title">
          {icon && <span className="cg-control-panel-icon">{icon}</span>}
          <span className="cg-control-panel-title-text">{title}</span>
          {badge && <span className="cg-control-panel-badge">{badge}</span>}
        </div>
        
        <div className="cg-control-panel-actions">
          {headerActions}
          {isCollapsible && (
            <button
              className="cg-btn cg-btn-ghost cg-btn-icon-sm cg-control-panel-toggle"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="cg-control-panel-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default ControlPanel; 