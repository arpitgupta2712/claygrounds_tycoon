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
    <header className={`cg-header ${className}`}>
      <div className="cg-header-content">
        {/* Left Navigation Toggle */}
        <div className="cg-header-left">
          <button
            className="cg-btn cg-btn-ghost cg-btn-icon"
            onClick={onLeftNavToggle}
            title={leftNavOpen ? "Close navigation" : "Open navigation"}
          >
            <span className="cg-header-nav-icon">
              {leftNavOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>

        {/* Brand/Logo */}
        <div className="cg-header-brand">
          <div className="cg-brand-icon">🏗️</div>
          <div className="cg-brand-text">
            <h1 className="cg-brand-title">ClayGrounds Tycoon</h1>
            <span className="cg-brand-subtitle">3D Sports Empire</span>
          </div>
        </div>

        {/* Right Navigation Toggle and Logout */}
        <div className="cg-header-right">
          <button
            className="cg-btn cg-btn-ghost cg-btn-icon"
            onClick={onRightNavToggle}
            title={rightNavOpen ? "Close controls" : "Open controls"}
          >
            <span className="cg-header-nav-icon">
              {rightNavOpen ? '✕' : '⚙️'}
            </span>
          </button>
          <button
            className="cg-btn cg-btn-outline cg-btn-sm"
            style={{ marginLeft: 12 }}
            onClick={handleLogout}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 