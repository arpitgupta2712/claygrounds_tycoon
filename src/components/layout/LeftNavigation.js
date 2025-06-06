import React, { useState, useEffect } from 'react';

const LeftNavigation = ({ 
  isOpen = false, 
  onToggle,
  className = "" 
}) => {
  const [user, setUser] = useState(null);

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
  const empireCommands = [
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
  ];

  const quickActions = [
    {
      id: 'emergency-mode',
      icon: '🚨',
      label: 'Emergency Mode',
      color: 'danger',
      description: 'Crisis management'
    },
    {
      id: 'auto-pilot',
      icon: '🤖',
      label: 'Auto-Pilot',
      color: 'info',
      description: 'AI assistance'
    },
    {
      id: 'market-analysis',
      icon: '📈',
      label: 'Market Intel',
      color: 'accent',
      description: 'Real-time insights'
    }
  ];



  if (!isOpen) return null;

  return (
    <nav className={`cg-nav cg-nav-left ${isOpen ? 'open' : ''} ${className}`}>
      <div className="cg-nav-container">
        {/* Command Center Header */}
        <div className="cg-nav-header">
          <h2 className="cg-nav-title">⚡ Command Center</h2>
          <p className="cg-nav-subtitle">Empire Management</p>
        </div>

        {/* Empire Commands */}
        <div className="cg-nav-body">
          <div className="cg-nav-section">
            <h3 className="cg-nav-section-title">Empire Commands</h3>
            <ul className="cg-nav-menu">
              {empireCommands.map((command) => (
                <li key={command.id} className="cg-nav-item">
                  <button 
                    className={`cg-nav-link ${command.active ? 'active' : ''}`}
                    title={command.description}
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
            <div className="cg-nav-actions">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className={`cg-btn cg-btn-${action.color} cg-btn-sm cg-nav-action`}
                  title={action.description}
                >
                  <span className="cg-nav-action-icon">{action.icon}</span>
                  <span className="cg-nav-action-label">{action.label}</span>
                </button>
              ))}
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