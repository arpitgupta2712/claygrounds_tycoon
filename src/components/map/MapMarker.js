import mapboxgl from 'mapbox-gl';

class MapMarker {
  constructor(location, index, currentIndex, onSelect) {
    this.location = location;
    this.index = index;
    this.currentIndex = currentIndex;
    this.onSelect = onSelect;
    this.popup = null;
    this.coordinates = null;
    
    // Validate coordinates once and store them
    this.coordinates = this.parseCoordinates();
    if (!this.coordinates) {
      console.warn(`Invalid coordinates for ${location.location_name}`);
      return;
    }
    
    console.log(`Creating fixed popup marker for ${location.location_name} at [${this.coordinates[0]}, ${this.coordinates[1]}]`);
    this.createFixedPopup();
  }

  parseCoordinates() {
    const lng = parseFloat(this.location.longitude);
    const lat = parseFloat(this.location.latitude);
    
    // Validate coordinates
    if (isNaN(lng) || isNaN(lat)) return null;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
    
    return [lng, lat];
  }

  createFixedPopup() {
    const status = this.location.operational_status || this.location.current_status || 'Unknown';
    const isActive = status === 'Active';
    const isCurrent = this.index === this.currentIndex;
    
    // Create HTML content for the popup
    const popupContent = `
      <div class="popup-marker ${isCurrent ? 'current' : ''}" data-index="${this.index}">
        <div class="popup-marker-circle ${isActive ? 'active' : 'inactive'}"></div>
        <div class="popup-marker-name">${this.location.location_name}</div>
      </div>
    `;
    
    // Create a permanent popup (no close button, always open)
    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      closeOnMove: false,
      anchor: 'bottom',
      offset: [0, 0],
      className: 'fixed-marker-popup'
    })
    .setLngLat(this.coordinates)
    .setHTML(popupContent);
    
    console.log(`✓ Created fixed popup for ${this.location.location_name}`);
  }

  addToMap(map) {
    if (this.popup && map) {
      this.popup.addTo(map);
      
      // Add click event listener to the popup content
      setTimeout(() => {
        const popupElement = document.querySelector(`[data-index="${this.index}"]`);
        if (popupElement) {
          popupElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Fixed popup clicked: ${this.location.location_name}`);
            if (this.onSelect) {
              this.onSelect(this.index);
            }
          });
          
          popupElement.style.cursor = 'pointer';
        }
      }, 100);
      
      console.log(`✓ Added fixed popup to map: ${this.location.location_name}`);
    }
  }

  removeFromMap() {
    if (this.popup) {
      this.popup.remove();
    }
  }

  updateCurrentState(currentIndex) {
    if (this.currentIndex !== currentIndex) {
      this.currentIndex = currentIndex;
      
      // Update the popup content to reflect current state
      const isCurrent = this.index === currentIndex;
      const status = this.location.operational_status || this.location.current_status || 'Unknown';
      const isActive = status === 'Active';
      
      const newContent = `
        <div class="popup-marker ${isCurrent ? 'current' : ''}" data-index="${this.index}">
          <div class="popup-marker-circle ${isActive ? 'active' : 'inactive'}"></div>
          <div class="popup-marker-name">${this.location.location_name}</div>
        </div>
      `;
      
      if (this.popup) {
        this.popup.setHTML(newContent);
        
        // Re-add click event listener
        setTimeout(() => {
          const popupElement = document.querySelector(`[data-index="${this.index}"]`);
          if (popupElement) {
            popupElement.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(`Fixed popup clicked: ${this.location.location_name}`);
              if (this.onSelect) {
                this.onSelect(this.index);
              }
            });
            
            popupElement.style.cursor = 'pointer';
          }
        }, 100);
      }
    }
  }

  // Get the FIXED coordinates
  getCoordinates() {
    return this.coordinates;
  }

  // Check if marker should be visible (simple bounds check)
  isInViewport(map) {
    if (!map || !this.coordinates) return true;
    
    try {
      const bounds = map.getBounds();
      return bounds.contains(this.coordinates);
    } catch (error) {
      return true;
    }
  }

  destroy() {
    // Remove click event listeners
    const popupElement = document.querySelector(`[data-index="${this.index}"]`);
    if (popupElement) {
      popupElement.removeEventListener('click', this.handleClick);
    }
    
    this.removeFromMap();
    this.popup = null;
    this.coordinates = null;
  }
}

export default MapMarker; 