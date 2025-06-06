import React from 'react';

const RightNavigation = ({ 
  isOpen = false, 
  onToggle,
  className = "" 
}) => {
  const gameControlSections = [
    {
      id: 'map-controls',
      title: 'Map Controls',
      icon: '🗺️',
      items: [
        { id: 'zoom-in', icon: '🔍+', label: 'Zoom In', shortcut: '+', action: true },
        { id: 'zoom-out', icon: '🔍-', label: 'Zoom Out', shortcut: '-', action: true },
        { id: 'reset-view', icon: '🎯', label: 'Reset View', shortcut: 'R', action: true },
        { id: 'fullscreen', icon: '⛶', label: 'Fullscreen', shortcut: 'F11', action: true }
      ]
    },
    {
      id: 'view-modes',
      title: 'View Modes',
      icon: '👁️',
      items: [
        { id: 'satellite', icon: '🛰️', label: 'Satellite View', toggle: true, active: false },
        { id: 'terrain', icon: '🏔️', label: 'Terrain Mode', toggle: true, active: true },
        { id: 'economic', icon: '💰', label: 'Economic View', toggle: true, active: false },
        { id: 'population', icon: '👥', label: 'Population Density', toggle: true, active: false }
      ]
    },
    {
      id: 'game-filters',
      title: 'Game Filters',
      icon: '🎮',
      items: [
        { id: 'my-facilities', icon: '🏟️', label: 'My Facilities', toggle: true, active: true },
        { id: 'competitors', icon: '⚔️', label: 'Competitors', toggle: true, active: true },
        { id: 'opportunities', icon: '💎', label: 'Opportunities', toggle: true, active: true },
        { id: 'threats', icon: '⚠️', label: 'Threats', toggle: true, active: false }
      ]
    },
    {
      id: 'game-settings',
      title: 'Game Settings',
      icon: '⚙️',
      items: [
        { id: 'auto-save', icon: '💾', label: 'Auto-Save', toggle: true, active: true },
        { id: 'notifications', icon: '🔔', label: 'Notifications', toggle: true, active: true },
        { id: 'sound-effects', icon: '🔊', label: 'Sound Effects', toggle: true, active: true },
        { id: 'tutorial-mode', icon: '🎓', label: 'Tutorial Mode', toggle: true, active: false }
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
    <aside className={`cg-nav cg-nav-right ${isOpen ? 'open' : ''} ${className}`}>
      <div className="cg-nav-container">
        {/* Game Control Header */}
        <div className="cg-nav-header">
          <h2 className="cg-nav-title">⚙️ Control Panel</h2>
          <p className="cg-nav-subtitle">Game Controls & Settings</p>
        </div>

        {/* Game Controls Content */}
        <div className="cg-nav-body">
        {/* Game Control Sections */}
        {gameControlSections.map((section) => (
          <div key={section.id} className="cg-nav-section">
            <h3 className="cg-nav-section-title">
              <span className="cg-nav-section-icon">{section.icon}</span>
              {section.title}
            </h3>
            
            <div className="cg-control-items">
              {section.items.map((item) => (
                <div key={item.id} className="cg-control-item">
                  {item.toggle ? (
                    // Toggle Control for Game Settings
                    <label className="cg-game-toggle">
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
                    // Action Button Control
                    <button className="cg-game-control-btn">
                      <span className="cg-control-icon">{item.icon}</span>
                      <span className="cg-control-label">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="cg-control-shortcut">{item.shortcut}</kbd>
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
      </div>
    </aside>
  );
};

export default RightNavigation; 