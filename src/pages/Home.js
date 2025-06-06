import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import MapContainer from '../components/layout/MapContainer';

const Home = () => {
  return (
    <MainLayout>
      <div className="cg-game-interface">
        {/* Main Game Map - Central Focus */}
        <div className="cg-game-map-container">
          <div className="cg-map-overlay-ui">
            {/* Map Title Overlay */}
            <div className="cg-map-title-overlay">
              <h1 className="cg-map-title">🗺️ Territory Command Center</h1>
              <div className="cg-map-subtitle">Interactive 3D Sports Empire Management</div>
            </div>
            
            {/* Quick Stats Overlay */}
            <div className="cg-quick-stats-overlay">
              <div className="cg-stat-mini">
                <span className="cg-stat-mini-icon">🏟️</span>
                <span className="cg-stat-mini-value">0</span>
              </div>
              <div className="cg-stat-mini">
                <span className="cg-stat-mini-icon">💰</span>
                <span className="cg-stat-mini-value">₹0</span>
              </div>
              <div className="cg-stat-mini">
                <span className="cg-stat-mini-icon">📈</span>
                <span className="cg-stat-mini-value">0%</span>
              </div>
            </div>
          </div>
          
          {/* The Main Map */}
          <div className="cg-main-game-map">
            <MapContainer />
          </div>
          
          {/* Map Controls Overlay */}
          <div className="cg-map-controls-overlay">
            <div className="cg-map-zoom-controls">
              <button className="cg-btn cg-btn-game cg-btn-icon">🔍+</button>
              <button className="cg-btn cg-btn-game cg-btn-icon">🔍-</button>
              <button className="cg-btn cg-btn-game cg-btn-icon">🎯</button>
            </div>
            
            <div className="cg-map-view-controls">
              <button className="cg-btn cg-btn-game cg-btn-sm">🛰️ Satellite</button>
              <button className="cg-btn cg-btn-game cg-btn-sm">🗺️ Terrain</button>
              <button className="cg-btn cg-btn-game cg-btn-sm">🏙️ Cities</button>
            </div>
          </div>
        </div>
        
        {/* Game Status Bar */}
        <div className="cg-game-status-bar">
          <div className="cg-status-section">
            <span className="cg-status-indicator online"></span>
            <span className="cg-status-text">System Online</span>
          </div>
          <div className="cg-status-section">
            <span className="cg-status-text">Last Updated: Just now</span>
          </div>
          <div className="cg-status-section">
            <span className="cg-status-text">Active Players: 1,247</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home; 