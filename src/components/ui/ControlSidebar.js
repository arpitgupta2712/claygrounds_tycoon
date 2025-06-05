import React, { useState, useEffect } from 'react';
import '../../styles/sidebar.css';

const ControlSidebar = ({ 
  isOpen = true, 
  onToggle,
  children,
  title = "Controls",
  className = ""
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isOpen) {
        // On mobile, start collapsed if sidebar is open
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isOpen]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleCloseSidebar = () => {
    if (onToggle) {
      onToggle(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <div 
          className="cg-sidebar-backdrop"
          onClick={handleCloseSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`cg-sidebar ${isCollapsed ? 'cg-sidebar-collapsed' : ''} ${className}`}>
        {/* Sidebar Header */}
        <div className="cg-sidebar-header">
          <div className="cg-sidebar-title">
            <span className="cg-sidebar-icon">🎮</span>
            {!isCollapsed && <span className="cg-sidebar-title-text">{title}</span>}
          </div>
          
          <div className="cg-sidebar-actions">
            <button
              className="cg-btn cg-btn-ghost cg-btn-icon-sm"
              onClick={handleToggleCollapse}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? '▶' : '◀'}
            </button>
            
            {isMobile && (
              <button
                className="cg-btn cg-btn-ghost cg-btn-icon-sm"
                onClick={handleCloseSidebar}
                title="Close sidebar"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="cg-sidebar-content">
          {children}
        </div>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="cg-sidebar-footer">
            <div className="cg-sidebar-footer-text">
              <span className="cg-text-muted">ClayGrounds Tycoon</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ControlSidebar; 