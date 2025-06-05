import React from 'react';

const LeftNavigation = ({ 
  isOpen = false, 
  onToggle,
  className = "" 
}) => {
  const navigationItems = [
    {
      id: 'dashboard',
      icon: '🏠',
      label: 'Dashboard',
      description: 'Overview and analytics',
      active: true
    },
    {
      id: 'map',
      icon: '🗺️',
      label: 'Interactive Map',
      description: 'Explore territories in 3D',
      active: false
    },
    {
      id: 'facilities',
      icon: '🏟️',
      label: 'Facilities',
      description: 'Manage sports facilities',
      active: false
    },
    {
      id: 'analytics',
      icon: '📊',
      label: 'Analytics',
      description: 'Performance insights',
      active: false
    },
    {
      id: 'reports',
      icon: '📈',
      label: 'Reports',
      description: 'Generate reports',
      active: false
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
      description: 'App configuration',
      active: false
    }
  ];

  const quickActions = [
    {
      id: 'add-facility',
      icon: '➕',
      label: 'Add Facility',
      color: 'primary'
    },
    {
      id: 'export-data',
      icon: '📤',
      label: 'Export Data',
      color: 'secondary'
    },
    {
      id: 'help',
      icon: '❓',
      label: 'Help & Support',
      color: 'info'
    }
  ];

  if (!isOpen) return null;

  return (
    <nav className={`cg-left-nav ${className}`}>
      {/* Navigation Header */}
      <div className="cg-nav-header">
        <div className="cg-nav-title">
          <span className="cg-nav-icon">🧭</span>
          <span className="cg-nav-title-text">Navigation</span>
        </div>
        <button
          className="cg-btn cg-btn-ghost cg-btn-icon-sm"
          onClick={() => onToggle && onToggle(false)}
          title="Close navigation"
        >
          ✕
        </button>
      </div>

      {/* Main Navigation */}
      <div className="cg-nav-content">
        <div className="cg-nav-section">
          <h3 className="cg-nav-section-title">Main Menu</h3>
          <ul className="cg-nav-list">
            {navigationItems.map((item) => (
              <li key={item.id} className="cg-nav-item">
                <a 
                  href={`#${item.id}`}
                  className={`cg-nav-link ${item.active ? 'active' : ''}`}
                  title={item.description}
                >
                  <span className="cg-nav-link-icon">{item.icon}</span>
                  <div className="cg-nav-link-content">
                    <span className="cg-nav-link-label">{item.label}</span>
                    <span className="cg-nav-link-description">{item.description}</span>
                  </div>
                </a>
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
                title={action.label}
              >
                <span className="cg-nav-action-icon">{action.icon}</span>
                <span className="cg-nav-action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="cg-nav-section cg-nav-profile">
          <div className="cg-profile-card">
            <div className="cg-profile-avatar">
              <span className="cg-profile-avatar-icon">👤</span>
            </div>
            <div className="cg-profile-info">
              <div className="cg-profile-name">Admin User</div>
              <div className="cg-profile-role">System Administrator</div>
            </div>
            <button className="cg-btn cg-btn-ghost cg-btn-icon-sm cg-profile-menu">
              ⋮
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LeftNavigation; 