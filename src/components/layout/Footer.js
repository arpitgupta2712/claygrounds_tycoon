import React from 'react';

const Footer = ({ className = "" }) => {
  return (
    <footer className={`cg-footer cg-footer-game ${className}`}>
      <div className="cg-footer-content">
        {/* Game Status */}
        <div className="cg-footer-game-status">
          <div className="cg-game-time">
            <span className="cg-game-time-icon">🕐</span>
            <span className="cg-game-time-text">Game Time: 14:32</span>
          </div>
          <div className="cg-auto-save-status">
            <span className="cg-save-indicator active"></span>
            <span className="cg-save-text">Auto-Save: ON</span>
          </div>
        </div>

        {/* Quick Game Actions */}
        <div className="cg-footer-quick-actions">
          <button className="cg-btn cg-btn-game cg-btn-xs">💾 Save</button>
          <button className="cg-btn cg-btn-game cg-btn-xs">📊 Stats</button>
          <button className="cg-btn cg-btn-game cg-btn-xs">⚙️ Settings</button>
          <button className="cg-btn cg-btn-game cg-btn-xs">❓ Help</button>
        </div>

        {/* Game Info */}
        <div className="cg-footer-game-info">
          <div className="cg-game-version">
            <span className="cg-version-text">ClayGrounds Tycoon v3.0.0</span>
          </div>
          <div className="cg-connection-status">
            <span className="cg-connection-indicator online"></span>
            <span className="cg-connection-text">Connected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 