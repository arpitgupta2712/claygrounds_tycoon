import React from 'react';

const LocationModal = ({ location, isOpen, onClose, onNavigate, locationIndex, totalLocations }) => {
  console.log(`🔄 LocationModal render - isOpen: ${isOpen}, location:`, location?.location_name);
  
  if (!isOpen || !location) return null;

  const status = location.operational_status || location.current_status || 'Unknown';
  const isActive = status === 'Active';

  console.log(`📋 Rendering modal for: ${location.location_name}`);

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal" onClick={(e) => e.stopPropagation()}>
        <div className="location-modal-header">
          <div className="location-header-content">
            <h2>🏟️ {location.location_name}</h2>
            <div className="location-counter">
              {locationIndex + 1} of {totalLocations}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="location-modal-body">
          <div className="location-main-info">
            <div className="location-status-section">
              <span className={`location-status-badge ${isActive ? 'active' : 'inactive'}`}>
                {status}
              </span>
              <div className="location-coordinates">
                📍 {location.latitude}, {location.longitude}
              </div>
            </div>

            <div className="location-details-grid">
              <div className="detail-card">
                <div className="detail-icon">🏙️</div>
                <div className="detail-content">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{location.city}, {location.state}</span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">🏗️</div>
                <div className="detail-content">
                  <span className="detail-label">Property Type</span>
                  <span className="detail-value">{location.property_type || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">👔</div>
                <div className="detail-content">
                  <span className="detail-label">Management</span>
                  <span className="detail-value">{location.management_status || 'N/A'}</span>
                </div>
              </div>

              {location.opening_date && (
                <div className="detail-card">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Opening Date</span>
                    <span className="detail-value">
                      {new Date(location.opening_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {location.contact_info && (
                <div className="detail-card">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{location.contact_info}</span>
                  </div>
                </div>
              )}

              {location.facilities && (
                <div className="detail-card full-width">
                  <div className="detail-icon">🏟️</div>
                  <div className="detail-content">
                    <span className="detail-label">Facilities</span>
                    <span className="detail-value">{location.facilities}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="location-actions">
            <button 
              className="primary-action-btn"
              onClick={() => {
                console.log('🎯 Navigate button clicked');
                onNavigate && onNavigate();
              }}
            >
              🎯 Navigate to This Location
            </button>
            
            <div className="secondary-actions">
              <button className="secondary-action-btn">
                📊 View Analytics
              </button>
              <button className="secondary-action-btn">
                📋 View Reports
              </button>
              <button className="secondary-action-btn">
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>

        <div className="location-modal-footer">
          <div className="modal-navigation">
            <button 
              className="nav-modal-btn"
              disabled={locationIndex === 0}
              onClick={() => {
                console.log('⬅️ Previous location clicked');
                onNavigate && onNavigate(locationIndex - 1);
              }}
            >
              ← Previous Location
            </button>
            <button 
              className="nav-modal-btn"
              disabled={locationIndex === totalLocations - 1}
              onClick={() => {
                console.log('➡️ Next location clicked');
                onNavigate && onNavigate(locationIndex + 1);
              }}
            >
              Next Location →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal; 