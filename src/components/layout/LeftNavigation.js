import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

const LeftNavigation = ({ 
  isOpen = false, 
  onToggle,
  className = "" 
}) => {
  const [user, setUser] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  const empireCommands = useMemo(() => [
    {
      id: 'empire-overview',
      icon: '🏛️',
      label: 'Empire Overview',
      description: 'Your sports empire at a glance',
      active: true,
      badge: 'NEW'
    },
    {
      id: 'build-facility',
      icon: '🏗️',
      label: 'Build Facility',
      description: 'Construct new sports venues',
      active: false,
      badge: '3'
    },
    {
      id: 'manage-territories',
      icon: '🗺️',
      label: 'Territory Control',
      description: 'Expand your influence',
      active: false,
      badge: '36'
    },
    {
      id: 'financial-center',
      icon: '💰',
      label: 'Financial Center',
      description: 'Revenue and investments',
      active: false,
      badge: '₹0'
    },
    {
      id: 'research-tech',
      icon: '🔬',
      label: 'Research & Tech',
      description: 'Unlock new capabilities',
      active: false,
      badge: '5'
    },
    {
      id: 'staff-management',
      icon: '👥',
      label: 'Staff Management',
      description: 'Hire and manage your team',
      active: false,
      badge: '12'
    }
  ], []);

  const quickActions = useMemo(() => [
    {
      id: 'emergency-mode',
      icon: '🚨',
      label: 'Emergency Mode',
      color: 'danger',
      description: 'Crisis management',
      shortcut: '1'
    },
    {
      id: 'auto-pilot',
      icon: '🤖',
      label: 'Auto-Pilot',
      color: 'info',
      description: 'AI assistance',
      shortcut: '2'
    },
    {
      id: 'market-analysis',
      icon: '📈',
      label: 'Market Intel',
      color: 'accent',
      description: 'Real-time insights',
      shortcut: '3'
    }
  ], []);

  // Combine all navigable items (memoized to prevent unnecessary re-renders)
  const allItems = useMemo(() => [...empireCommands, ...quickActions], [empireCommands, quickActions]);

  // Handle keyboard navigation within the nav
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

  // Handle item selection
  const handleItemSelect = useCallback((index) => {
    const item = allItems[index];
    if (item) {
      console.log(`Selected: ${item.label}`);
      // Add your item selection logic here
    }
  }, [allItems]);

  // Initialize keyboard navigation for this component
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
          handleItemSelect(selectedIndex);
          break;
        case 'quick-action-1':
          handleItemSelect(empireCommands.length); // First quick action
          break;
        case 'quick-action-2':
          handleItemSelect(empireCommands.length + 1); // Second quick action
          break;
        case 'quick-action-3':
          handleItemSelect(empireCommands.length + 2); // Third quick action
          break;
        default:
          break;
      }
    }, [isOpen, handleNavigation, handleItemSelect, selectedIndex, empireCommands.length])
  });



  if (!isOpen) return null;

  return (
    <nav 
      ref={navRef}
      className={`cg-nav cg-nav-left ${isOpen ? 'open' : ''} ${className}`}
      role="navigation"
      aria-label="Empire Command Center"
    >
      <div className="cg-nav-container">
        {/* Command Center Header */}
        <div className="cg-nav-header">
          <h2 className="cg-nav-title">⚡ Command Center</h2>
          <p className="cg-nav-subtitle">Empire Management</p>
          <div className="cg-nav-hint">
            <small>Use ↑↓ to navigate, Enter to select</small>
          </div>
        </div>

        {/* Empire Commands */}
        <div className="cg-nav-body">
          <div className="cg-nav-section">
            <h3 className="cg-nav-section-title">Empire Commands</h3>
            <ul className="cg-nav-menu" role="menu">
              {empireCommands.map((command, index) => (
                <li key={command.id} className="cg-nav-item" role="none">
                  <button 
                    ref={el => itemsRef.current[index] = el}
                    className={`cg-nav-link ${command.active ? 'active' : ''} ${selectedIndex === index ? 'focused' : ''}`}
                    title={command.description}
                    role="menuitem"
                    tabIndex={selectedIndex === index ? 0 : -1}
                    onClick={() => handleItemSelect(index)}
                    onFocus={() => setSelectedIndex(index)}
                  >
                    <span className="cg-nav-icon">{command.icon}</span>
                    <span className="cg-nav-text">{command.label}</span>
                    {command.badge && <span className="cg-nav-badge">{command.badge}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="cg-nav-section">
            <h3 className="cg-nav-section-title">Quick Actions</h3>
            <div className="cg-nav-actions" role="group" aria-label="Quick Actions">
              {quickActions.map((action, index) => {
                const globalIndex = empireCommands.length + index;
                return (
                  <button
                    key={action.id}
                    ref={el => itemsRef.current[globalIndex] = el}
                    className={`cg-btn cg-btn-${action.color} cg-btn-sm cg-nav-action ${selectedIndex === globalIndex ? 'focused' : ''}`}
                    title={`${action.description} (Press ${action.shortcut})`}
                    tabIndex={selectedIndex === globalIndex ? 0 : -1}
                    onClick={() => handleItemSelect(globalIndex)}
                    onFocus={() => setSelectedIndex(globalIndex)}
                  >
                    <span className="cg-nav-action-icon">{action.icon}</span>
                    <span className="cg-nav-action-label">{action.label}</span>
                    <span className="cg-nav-action-shortcut">{action.shortcut}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* User Profile Section */}
        <div className="cg-nav-footer">
          <div className="cg-nav-user">
            <div className="cg-nav-user-avatar">👤</div>
            <div className="cg-nav-user-info">
              <div className="cg-nav-user-name">{user?.employee_name || 'User'}</div>
              <div className="cg-nav-user-role">{user?.designation || 'Employee'}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LeftNavigation; 