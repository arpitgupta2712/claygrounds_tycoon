import React from 'react';

const Header = ({ 
  onLeftNavToggle, 
  onRightNavToggle, 
  leftNavOpen = false, 
  rightNavOpen = false,
  className = "" 
}) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  return (
    <header className={`cg-header cg-header-game ${className}`}>
      <div className="cg-header-container">
        {/* Game Navigation Toggle */}
        <div className="cg-header-nav-controls">
          <button
            className={`cg-btn cg-btn-game cg-btn-icon ${leftNavOpen ? 'active' : ''}`}
            onClick={onLeftNavToggle}
            title={leftNavOpen ? "Close Command Panel" : "Open Command Panel"}
          >
            <span className="cg-nav-icon">⚡</span>
          </button>
        </div>

        {/* Game Brand/Logo */}
        <div className="cg-header-brand">
          <div className="cg-header-logo">🏗️</div>
          <div className="cg-header-title-group">
            <h1 className="cg-header-title">ClayGrounds Tycoon</h1>
            <div className="cg-header-subtitle">Sports Empire Builder</div>
          </div>
        </div>

        {/* Game Stats in Header */}
        <div className="cg-header-stats">
          <div className="cg-header-stat">
            <span className="cg-header-stat-icon">💰</span>
            <span className="cg-header-stat-value">₹0</span>
            <span className="cg-header-stat-label">Revenue</span>
          </div>
          <div className="cg-header-stat">
            <span className="cg-header-stat-icon">🏟️</span>
            <span className="cg-header-stat-value">0</span>
            <span className="cg-header-stat-label">Facilities</span>
          </div>
          <div className="cg-header-stat">
            <span className="cg-header-stat-icon">⭐</span>
            <span className="cg-header-stat-value">100</span>
            <span className="cg-header-stat-label">Empire Score</span>
          </div>
        </div>

        {/* Game Controls */}
        <div className="cg-header-actions">
          <button
            className={`cg-btn cg-btn-game cg-btn-icon ${rightNavOpen ? 'active' : ''}`}
            onClick={onRightNavToggle}
            title={rightNavOpen ? "Close Control Panel" : "Open Control Panel"}
          >
            <span className="cg-nav-icon">⚙️</span>
          </button>
          
          <div className="cg-header-user-menu">
            <button className="cg-btn cg-btn-game cg-btn-sm">
              <span className="cg-user-avatar">👤</span>
              <span className="cg-user-name">CEO</span>
            </button>
          </div>
          
          <button
            className="cg-btn cg-btn-danger cg-btn-sm"
            onClick={handleLogout}
            title="Exit Game"
          >
            <span>🚪</span>
            Exit
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 