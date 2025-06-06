import React, { useMemo, useCallback } from 'react';
import { InlineLoader, ErrorBoundary } from '../ui/LoadingStates';

const LocationModal = ({ 
  location, 
  isOpen, 
  onClose, 
  onNavigate, 
  locationIndex = 0, 
  totalLocations = 1,
  loading = false,
  error = null 
}) => {
  console.log(`🔄 LocationModal render - isOpen: ${isOpen}, location:`, location?.location_name);
  
  if (!isOpen) return null;

  // Memoized status calculation
  const { status, isActive } = useMemo(() => {
    if (!location) return { status: 'Unknown', isActive: false };
    const locationStatus = location.operational_status || location.current_status || 'Unknown';
    return {
      status: locationStatus,
      isActive: locationStatus === 'Active'
    };
  }, [location]);

  // Memoized navigation handlers
  const handlePrevious = useCallback(() => {
    if (locationIndex > 0 && onNavigate) {
      console.log('⬅️ Previous location clicked');
      onNavigate(locationIndex - 1);
    }
  }, [locationIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (locationIndex < totalLocations - 1 && onNavigate) {
      console.log('➡️ Next location clicked');
      onNavigate(locationIndex + 1);
    }
  }, [locationIndex, totalLocations, onNavigate]);

  const handleNavigateToLocation = useCallback(() => {
    console.log('🎯 Navigate button clicked');
    if (onNavigate) {
      onNavigate();
    }
  }, [onNavigate]);

  // Handle loading state
  if (loading) {
    return (
      <div className="location-modal-overlay" onClick={onClose}>
        <div className="location-modal" onClick={(e) => e.stopPropagation()}>
          <div className="location-modal-header">
            <h2>Loading Location...</h2>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>
          <div className="location-modal-body">
            <InlineLoader message="Loading location details..." />
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="location-modal-overlay" onClick={onClose}>
        <div className="location-modal" onClick={(e) => e.stopPropagation()}>
          <div className="location-modal-header">
            <h2>Error Loading Location</h2>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>
          <div className="location-modal-body">
            <ErrorBoundary 
              error={error} 
              title="Failed to load location details"
              showDetails={false}
            />
          </div>
        </div>
      </div>
    );
  }

  // Handle missing location
  if (!location) {
    return (
      <div className="location-modal-overlay" onClick={onClose}>
        <div className="location-modal" onClick={(e) => e.stopPropagation()}>
          <div className="location-modal-header">
            <h2>Location Not Found</h2>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>
          <div className="location-modal-body">
            <div className="cg-empty-state">
              <div className="cg-empty-icon">📍</div>
              <h4 className="cg-empty-title">Location not available</h4>
              <p className="cg-empty-message">The requested location could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={handleNavigateToLocation}
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
              onClick={handlePrevious}
            >
              ← Previous Location
            </button>
            <button 
              className="nav-modal-btn"
              disabled={locationIndex === totalLocations - 1}
              onClick={handleNext}
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