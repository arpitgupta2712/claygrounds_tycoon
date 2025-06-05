import React from 'react';

const RightNavigation = ({ 
  isOpen = false, 
  onToggle,
  className = "" 
}) => {
  const controlSections = [
    {
      id: 'view-controls',
      title: 'View Controls',
      icon: '👁️',
      items: [
        { id: 'zoom-in', icon: '🔍', label: 'Zoom In', shortcut: '+' },
        { id: 'zoom-out', icon: '🔍', label: 'Zoom Out', shortcut: '-' },
        { id: 'reset-view', icon: '🎯', label: 'Reset View', shortcut: 'R' },
        { id: 'fullscreen', icon: '⛶', label: 'Fullscreen', shortcut: 'F' }
      ]
    },
    {
      id: 'map-layers',
      title: 'Map Layers',
      icon: '🗺️',
      items: [
        { id: 'satellite', icon: '🛰️', label: 'Satellite View', toggle: true, active: false },
        { id: 'terrain', icon: '🏔️', label: 'Terrain', toggle: true, active: true },
        { id: 'traffic', icon: '🚦', label: 'Traffic', toggle: true, active: false },
        { id: 'labels', icon: '🏷️', label: 'Labels', toggle: true, active: true }
      ]
    },
    {
      id: 'filters',
      title: 'Data Filters',
      icon: '🔍',
      items: [
        { id: 'active-facilities', icon: '✅', label: 'Active Facilities', toggle: true, active: true },
        { id: 'inactive-facilities', icon: '❌', label: 'Inactive Facilities', toggle: true, active: false },
        { id: 'high-performance', icon: '⭐', label: 'High Performance', toggle: true, active: false },
        { id: 'recent-updates', icon: '🕒', label: 'Recent Updates', toggle: true, active: true }
      ]
    }
  ];

  const quickTools = [
    { id: 'export-map', icon: '📤', label: 'Export Map', color: 'primary' },
    { id: 'share-view', icon: '🔗', label: 'Share View', color: 'secondary' },
    { id: 'print', icon: '🖨️', label: 'Print', color: 'outline' },
    { id: 'help', icon: '❓', label: 'Help', color: 'info' }
  ];

  if (!isOpen) return null;

  return (
    <aside className={`cg-right-nav ${className}`}>
      {/* Navigation Header */}
      <div className="cg-nav-header">
        <div className="cg-nav-title">
          <span className="cg-nav-icon">⚙️</span>
          <span className="cg-nav-title-text">Controls</span>
        </div>
        <button
          className="cg-btn cg-btn-ghost cg-btn-icon-sm"
          onClick={() => onToggle && onToggle(false)}
          title="Close controls"
        >
          ✕
        </button>
      </div>

      {/* Controls Content */}
      <div className="cg-nav-content">
        {/* Control Sections */}
        {controlSections.map((section) => (
          <div key={section.id} className="cg-nav-section">
            <h3 className="cg-nav-section-title">
              <span className="cg-nav-section-icon">{section.icon}</span>
              {section.title}
            </h3>
            
            <div className="cg-control-items">
              {section.items.map((item) => (
                <div key={item.id} className="cg-control-item">
                  {item.toggle ? (
                    // Toggle Control
                    <label className="cg-toggle-control">
                      <input 
                        type="checkbox" 
                        defaultChecked={item.active}
                        className="cg-toggle-input"
                      />
                      <div className="cg-toggle-switch"></div>
                      <div className="cg-toggle-content">
                        <span className="cg-toggle-icon">{item.icon}</span>
                        <span className="cg-toggle-label">{item.label}</span>
                      </div>
                    </label>
                  ) : (
                    // Button Control
                    <button className="cg-control-button">
                      <span className="cg-control-icon">{item.icon}</span>
                      <span className="cg-control-label">{item.label}</span>
                      {item.shortcut && (
                        <span className="cg-control-shortcut">{item.shortcut}</span>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Tools */}
        <div className="cg-nav-section">
          <h3 className="cg-nav-section-title">
            <span className="cg-nav-section-icon">🛠️</span>
            Quick Tools
          </h3>
          
          <div className="cg-quick-tools">
            {quickTools.map((tool) => (
              <button
                key={tool.id}
                className={`cg-btn cg-btn-${tool.color} cg-btn-sm cg-quick-tool`}
                title={tool.label}
              >
                <span className="cg-tool-icon">{tool.icon}</span>
                <span className="cg-tool-label">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="cg-nav-section cg-system-status">
          <h3 className="cg-nav-section-title">
            <span className="cg-nav-section-icon">📊</span>
            System Status
          </h3>
          
          <div className="cg-status-items">
            <div className="cg-status-item">
              <span className="cg-status-indicator active"></span>
              <span className="cg-status-label">Map Service</span>
              <span className="cg-status-value">Online</span>
            </div>
            <div className="cg-status-item">
              <span className="cg-status-indicator active"></span>
              <span className="cg-status-label">API Connection</span>
              <span className="cg-status-value">Connected</span>
            </div>
            <div className="cg-status-item">
              <span className="cg-status-indicator warning"></span>
              <span className="cg-status-label">Data Sync</span>
              <span className="cg-status-value">Syncing</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightNavigation; 