# District Boundaries Integration Example

This document shows how to integrate district boundaries that appear when you select a state, creating a hierarchical navigation system: **Country → State → District**.

## Files Created

1. **`src/assets/geojson/india_districts.geojson`** - District boundaries data (99 districts)
2. **`src/components/map/DistrictBoundariesLayer.js`** - React component for district boundaries
3. **`src/components/map/DistrictControl.js`** - Control panel for district management
4. **`src/styles/districts.css`** - Styles for district components

## Integration Steps

### 1. Import the Required Components

Add these imports to your main map component (e.g., `MapContainer.js`):

```javascript
import DistrictBoundariesLayer, { createDistrictPopup } from './DistrictBoundariesLayer';
import DistrictControl from './DistrictControl';
import '../styles/districts.css';
```

### 2. Add State Management

Add district-related state to your map component:

```javascript
const [selectedDistrict, setSelectedDistrict] = useState(null);
const [showDistricts, setShowDistricts] = useState(true);
```

### 3. Add the District Components

Add the district layer and control to your map component:

```javascript
return (
  <div className="map-container">
    {/* Your existing map and components */}
    
    {/* Add District Boundaries Layer */}
    <DistrictBoundariesLayer
      map={map}
      selectedState={selectedState} // Your existing state selection
      isVisible={showDistricts}
      onDistrictClick={handleDistrictClick}
      selectedDistrict={selectedDistrict}
    />
    
    {/* Add District Control Panel */}
    <DistrictControl
      selectedState={selectedState}
      selectedDistrict={selectedDistrict}
      onDistrictSelect={handleDistrictSelect}
      isVisible={selectedState !== null} // Only show when state is selected
    />
  </div>
);
```

### 4. Add Event Handlers

Add these handlers to manage district interactions:

```javascript
const handleDistrictClick = (district) => {
  setSelectedDistrict(district);
  
  // Optional: Show popup
  if (map) {
    new mapboxgl.Popup()
      .setLngLat([district.lng, district.lat]) // You'll need to calculate center
      .setHTML(createDistrictPopup(district))
      .addTo(map);
  }
  
  console.log('District selected:', district);
};

const handleDistrictSelect = (district) => {
  setSelectedDistrict(district);
  
  // Optional: Zoom to district
  if (map && district) {
    // You can implement district bounds calculation here
    console.log('District selected from control:', district);
  }
};

// Clear district selection when state changes
useEffect(() => {
  if (selectedState) {
    setSelectedDistrict(null); // Clear district when state changes
  }
}, [selectedState]);
```

### 5. Optional: Add Toggle Control

Add a toggle to show/hide districts:

```javascript
const toggleDistricts = () => {
  setShowDistricts(!showDistricts);
};

// Add this button to your UI
<button onClick={toggleDistricts} className="district-toggle">
  {showDistricts ? 'Hide' : 'Show'} Districts
</button>
```

## How It Works

### 1. **State Selection Flow**
```
User clicks state → selectedState updates → District boundaries appear for that state
```

### 2. **District Selection Flow**
```
User clicks district → handleDistrictClick → selectedDistrict updates → District highlights
```

### 3. **Hierarchical Navigation**
- **Country Level**: Full India map with states
- **State Level**: Selected state with district boundaries
- **District Level**: Selected district highlighted

## District Types

The system creates 4 types of districts:

1. **🏙️ Metro Districts** (Red) - Top 10 cities (Mumbai, Delhi, Bangalore, etc.)
2. **🌆 Major Districts** (Orange) - Cities ranked 11-50
3. **🏘️ City Districts** (Blue) - Other significant cities
4. **🌾 Regional Districts** (Gray) - Groups of smaller cities

## Features

### Visual Features
- **Color-coded boundaries** by district type
- **Responsive line widths** (metro districts have thicker borders)
- **Interactive highlighting** on hover and selection
- **Zoom-based label visibility** (labels appear at higher zoom levels)

### Interactive Features
- **Click to select** districts
- **Hover effects** with cursor changes
- **Popup information** with district details
- **Control panel** with statistics and district list

### Data Features
- **99 total districts** across all states
- **Smart grouping** of cities into logical districts
- **Population-based sizing** (important cities get larger boundaries)
- **State-specific filtering** (only show districts for selected state)

## Example Usage in Your App

```javascript
// In your main map component
import React, { useState, useEffect } from 'react';
import DistrictBoundariesLayer, { createDistrictPopup } from './DistrictBoundariesLayer';
import DistrictControl from './DistrictControl';

const MapContainer = () => {
  const [map, setMap] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const handleStateClick = (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict(null); // Clear district when state changes
  };

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    
    // Show popup with district info
    if (map) {
      new mapboxgl.Popup()
        .setLngLat([/* calculate district center */])
        .setHTML(createDistrictPopup(district))
        .addTo(map);
    }
  };

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
      
      {/* District Boundaries Layer */}
      <DistrictBoundariesLayer
        map={map}
        selectedState={selectedState}
        onDistrictClick={handleDistrictClick}
        selectedDistrict={selectedDistrict}
      />
      
      {/* District Control Panel */}
      <DistrictControl
        selectedState={selectedState}
        selectedDistrict={selectedDistrict}
        onDistrictSelect={setSelectedDistrict}
        isVisible={selectedState !== null}
      />
    </div>
  );
};
```

## Customization Options

### 1. **Styling**
- Modify colors in `districts.css`
- Adjust line widths and opacities
- Customize popup appearance

### 2. **Behavior**
- Change zoom levels for label visibility
- Modify district grouping logic
- Add animation effects

### 3. **Data**
- Add more cities to districts
- Create custom district boundaries
- Include additional district properties

## Performance Notes

- Districts are only rendered when a state is selected
- Uses MapBox's efficient filtering system
- Optimized for smooth interactions
- Responsive design for mobile devices

This creates a smooth, hierarchical navigation experience where users can drill down from country → state → district level with visual feedback at each step! 