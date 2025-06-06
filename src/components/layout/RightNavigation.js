import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

const RightNavigation = ({ 
  isOpen = false, 
  onToggle,
  className = "" 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navRef = useRef(null);
  const itemsRef = useRef([]);
  const gameControlSections = useMemo(() => [
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
  ], []);

  const quickTools = useMemo(() => [
    { id: 'export-map', icon: '📤', label: 'Export Map', color: 'primary', shortcut: '4' },
    { id: 'share-view', icon: '🔗', label: 'Share View', color: 'secondary' },
    { id: 'print', icon: '🖨️', label: 'Print', color: 'outline' },
    { id: 'help', icon: '❓', label: 'Help', color: 'info', shortcut: 'h' }
  ], []);

  // Get all interactive items for keyboard navigation (memoized)
  const allItems = useMemo(() => {
    const items = [];
    
    // Add all control items
    gameControlSections.forEach(section => {
      section.items.forEach(item => {
        items.push({ ...item, sectionId: section.id, type: item.toggle ? 'toggle' : 'action' });
      });
    });
    
    // Add quick tools
    quickTools.forEach(tool => {
      items.push({ ...tool, type: 'tool' });
    });
    
    return items;
  }, [gameControlSections, quickTools]);

  // Handle keyboard navigation
  const handleNavigation = useCallback((direction) => {
    if (!isOpen) return;
    
    const maxIndex = allItems.length - 1;
    let newIndex = selectedIndex;
    
    switch (direction) {
      case 'up':
        newIndex = selectedIndex > 0 ? selectedIndex - 1 : maxIndex;
        break;
      case 'down':
        newIndex = selectedIndex < maxIndex ? selectedIndex + 1 : 0;
        break;
      default:
        return;
    }
    
    setSelectedIndex(newIndex);
    
    // Focus the selected item
    const selectedItem = itemsRef.current[newIndex];
    if (selectedItem) {
      selectedItem.focus();
    }
  }, [isOpen, selectedIndex, allItems.length]);

  // Handle item selection/toggle
  const handleItemAction = useCallback((index) => {
    const item = allItems[index];
    if (!item) return;
    
    console.log(`Action on: ${item.label} (${item.type})`);
    
    if (item.type === 'toggle') {
      // Handle toggle action
      console.log(`Toggling ${item.label}`);
    } else if (item.type === 'action') {
      // Handle action button
      console.log(`Executing ${item.label}`);
    } else if (item.type === 'tool') {
      // Handle quick tool
      console.log(`Using tool: ${item.label}`);
    }
  }, [allItems]);

  // Initialize keyboard navigation
  useKeyboardNavigation({
    enabled: isOpen,
    onAction: useCallback((action, event) => {
      if (!isOpen) return;
      
      switch (action) {
        case 'navigate-up':
          handleNavigation('up');
          break;
        case 'navigate-down':
          handleNavigation('down');
          break;
        case 'select-action':
        case 'confirm-action':
          handleItemAction(selectedIndex);
          break;
        case 'zoom-in':
          // Find zoom in item and trigger it
          const zoomInIndex = allItems.findIndex(item => item.id === 'zoom-in');
          if (zoomInIndex !== -1) handleItemAction(zoomInIndex);
          break;
        case 'zoom-out':
          // Find zoom out item and trigger it
          const zoomOutIndex = allItems.findIndex(item => item.id === 'zoom-out');
          if (zoomOutIndex !== -1) handleItemAction(zoomOutIndex);
          break;
        case 'reset-view':
          // Find reset view item and trigger it
          const resetIndex = allItems.findIndex(item => item.id === 'reset-view');
          if (resetIndex !== -1) handleItemAction(resetIndex);
          break;
        case 'fullscreen':
          // Find fullscreen item and trigger it
          const fullscreenIndex = allItems.findIndex(item => item.id === 'fullscreen');
          if (fullscreenIndex !== -1) handleItemAction(fullscreenIndex);
          break;
        case 'toggle-help':
          // Find help item and trigger it
          const helpIndex = allItems.findIndex(item => item.id === 'help');
          if (helpIndex !== -1) handleItemAction(helpIndex);
          break;
        case 'quick-action-4':
          // Export map quick action
          const exportIndex = allItems.findIndex(item => item.id === 'export-map');
          if (exportIndex !== -1) handleItemAction(exportIndex);
          break;
        default:
          break;
      }
    }, [isOpen, handleNavigation, handleItemAction, selectedIndex, allItems])
  });

  if (!isOpen) return null;

  return (
    <aside 
      ref={navRef}
      className={`cg-nav cg-nav-right ${isOpen ? 'open' : ''} ${className}`}
      aria-label="Game Control Panel"
    >
      <div className="cg-nav-container">
        {/* Game Control Header */}
        <div className="cg-nav-header">
          <h2 className="cg-nav-title">⚙️ Control Panel</h2>
          <p className="cg-nav-subtitle">Game Controls & Settings</p>
          <div className="cg-nav-hint">
            <small>Use ↑↓ to navigate, Enter to toggle/select</small>
          </div>
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