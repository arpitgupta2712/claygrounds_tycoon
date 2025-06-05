import React from 'react';

const SidebarToggle = ({ isOpen, onToggle, className = "" }) => {
  return (
    <button
      className={`cg-sidebar-toggle ${className}`}
      onClick={() => onToggle(!isOpen)}
      title={isOpen ? "Close controls" : "Open controls"}
    >
      <span className="cg-sidebar-toggle-icon">
        {isOpen ? '✕' : '⚙️'}
      </span>
      {!isOpen && (
        <span className="cg-sidebar-toggle-text">Controls</span>
      )}
    </button>
  );
};

export default SidebarToggle; 