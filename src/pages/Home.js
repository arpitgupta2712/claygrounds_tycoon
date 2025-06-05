import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import MapContainer from '../components/layout/MapContainer';

const Home = () => {
  return (
    <MainLayout>
      <div className="cg-home-page">
        {/* Welcome Section */}
        <div className="cg-welcome-section">
          <div className="cg-welcome-content">
            <h2 className="cg-welcome-title">
              Welcome to ClayGrounds Tycoon
            </h2>
            <p className="cg-welcome-description">
              Build and manage your sports empire across India. Explore territories, 
              manage facilities, and grow your business in this interactive 3D environment.
            </p>
          </div>
          
          <div className="cg-quick-stats">
            <div className="cg-stat-card">
              <div className="cg-stat-icon">🏟️</div>
              <div className="cg-stat-content">
                <div className="cg-stat-number">0</div>
                <div className="cg-stat-label">Facilities</div>
              </div>
            </div>
            
            <div className="cg-stat-card">
              <div className="cg-stat-icon">🗺️</div>
              <div className="cg-stat-content">
                <div className="cg-stat-number">36</div>
                <div className="cg-stat-label">States & UTs</div>
              </div>
            </div>
            
            <div className="cg-stat-card">
              <div className="cg-stat-icon">💰</div>
              <div className="cg-stat-content">
                <div className="cg-stat-number">₹0</div>
                <div className="cg-stat-label">Revenue</div>
              </div>
            </div>
            
            <div className="cg-stat-card">
              <div className="cg-stat-icon">📈</div>
              <div className="cg-stat-content">
                <div className="cg-stat-number">0%</div>
                <div className="cg-stat-label">Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="cg-map-section">
          <div className="cg-map-header">
            <h3 className="cg-map-title">Interactive Territory Map</h3>
            <div className="cg-map-actions">
              <button className="cg-btn cg-btn-primary cg-btn-sm">
                🎯 Start Exploring
              </button>
              <button className="cg-btn cg-btn-outline cg-btn-sm">
                📊 View Analytics
              </button>
            </div>
          </div>
          
          <div className="cg-map-wrapper">
            <MapContainer />
          </div>
        </div>

        {/* Action Cards */}
        <div className="cg-action-section">
          <h3 className="cg-section-title">Quick Actions</h3>
          
          <div className="cg-action-grid">
            <div className="cg-action-card">
              <div className="cg-action-icon">🏗️</div>
              <div className="cg-action-content">
                <h4 className="cg-action-title">Build New Facility</h4>
                <p className="cg-action-description">
                  Start construction of a new sports facility in your chosen territory.
                </p>
                <button className="cg-btn cg-btn-primary cg-btn-sm">
                  Get Started
                </button>
              </div>
            </div>
            
            <div className="cg-action-card">
              <div className="cg-action-icon">📊</div>
              <div className="cg-action-content">
                <h4 className="cg-action-title">View Analytics</h4>
                <p className="cg-action-description">
                  Analyze performance metrics and revenue across all your facilities.
                </p>
                <button className="cg-btn cg-btn-secondary cg-btn-sm">
                  View Reports
                </button>
              </div>
            </div>
            
            <div className="cg-action-card">
              <div className="cg-action-icon">🎯</div>
              <div className="cg-action-content">
                <h4 className="cg-action-title">Explore Territories</h4>
                <p className="cg-action-description">
                  Discover new markets and expansion opportunities across India.
                </p>
                <button className="cg-btn cg-btn-info cg-btn-sm">
                  Explore Map
                </button>
              </div>
            </div>
            
            <div className="cg-action-card">
              <div className="cg-action-icon">⚙️</div>
              <div className="cg-action-content">
                <h4 className="cg-action-title">Manage Settings</h4>
                <p className="cg-action-description">
                  Configure your empire settings and preferences.
                </p>
                <button className="cg-btn cg-btn-outline cg-btn-sm">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home; 