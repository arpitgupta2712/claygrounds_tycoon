import React from 'react';

const Footer = ({ className = "" }) => {
  return (
    <footer className={`cg-footer ${className}`}>
      <div className="cg-footer-content">
        {/* Left Section - Branding */}
        <div className="cg-footer-brand">
          <div className="cg-footer-logo">
            <span className="cg-footer-icon">🏗️</span>
            <span className="cg-footer-text">ClayGrounds Tycoon</span>
          </div>
          <div className="cg-footer-tagline">
            Building Sports Empires Across India
          </div>
        </div>

        {/* Center Section - Quick Links */}
        <div className="cg-footer-links">
          <div className="cg-footer-link-group">
            <h4 className="cg-footer-link-title">Explore</h4>
            <ul className="cg-footer-link-list">
              <li><a href="#map" className="cg-footer-link">Interactive Map</a></li>
              <li><a href="#states" className="cg-footer-link">States</a></li>
              <li><a href="#facilities" className="cg-footer-link">Facilities</a></li>
            </ul>
          </div>
          
          <div className="cg-footer-link-group">
            <h4 className="cg-footer-link-title">Tools</h4>
            <ul className="cg-footer-link-list">
              <li><a href="#analytics" className="cg-footer-link">Analytics</a></li>
              <li><a href="#reports" className="cg-footer-link">Reports</a></li>
              <li><a href="#settings" className="cg-footer-link">Settings</a></li>
            </ul>
          </div>
        </div>

        {/* Right Section - Status & Info */}
        <div className="cg-footer-info">
          <div className="cg-footer-status">
            <span className="cg-status-indicator active"></span>
            <span className="cg-status-text">System Online</span>
          </div>
          <div className="cg-footer-version">
            Version 3.0.0
          </div>
          <div className="cg-footer-copyright">
            © 2024 ClayGrounds Tycoon
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 