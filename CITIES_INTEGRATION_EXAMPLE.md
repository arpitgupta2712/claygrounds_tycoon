# Indian Cities Integration Example

This document shows how to integrate the Indian cities GeoJSON data into your existing MapBox application.

## Files Created

1. **`src/assets/geojson/india_cities.geojson`** - GeoJSON file with 200 Indian cities
2. **`src/components/map/CitiesLayer.js`** - React component for cities layer
3. **`src/components/map/CitiesControl.js`** - Control component for toggling cities
4. **`src/styles/cities.css`** - Styles for cities components

## Integration Steps

### 1. Import the Required Components

Add these imports to your `MapContainer.js`:

```javascript
import CitiesLayer, { createCityPopup } from './CitiesLayer';
import CitiesControl, { CITY_FILTERS } from './CitiesControl';
import '../styles/cities.css';
```

### 2. Add State Management

Add these state variables to your MapContainer component:

```javascript
const [showCities, setShowCities] = useState(false);
const [cityFilter, setCityFilter] = useState('all');
const [cityPopup, setCityPopup] = useState(null);
```

### 3. Add City Click Handler

Add this function to handle city clicks:

```javascript
const handleCityClick = useCallback((city, coordinates) => {
  // Close existing popup
  if (cityPopup) {
    cityPopup.remove();
  }
  
  // Create new popup
  const popup = new mapboxgl.Popup({ offset: 15 })
    .setLngLat([coordinates.lng, coordinates.lat])
    .setHTML(createCityPopup(city, coordinates))
    .addTo(mapRef.current);
  
  setCityPopup(popup);
  
  console.log(`🏙️ Clicked city: ${city.name}, ${city.state}`);
}, [cityPopup]);
```

### 4. Add Cities Components to JSX

Add these components to your MapContainer's return statement:

```javascript
return (
  <div className="mapbox-map-container urban-3d">
    {/* ... existing content ... */}
    
    <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    
    {/* Add Cities Layer */}
    <CitiesLayer
      map={mapRef.current}
      isVisible={showCities}
      onCityClick={handleCityClick}
    />
    
    {/* Add Cities Control */}
    <CitiesControl
      showCities={showCities}
      onToggleCities={setShowCities}
      currentFilter={cityFilter}
      onFilterChange={setCityFilter}
      isControlVisible={viewMode === VIEW_MODES.STATE_SELECTION}
    />
    
    {/* ... existing components ... */}
  </div>
);
```

### 5. Cleanup on Unmount

Add cleanup for city popup in your useEffect cleanup:

```javascript
useEffect(() => {
  // ... existing map initialization ...
  
  return () => {
    clearMarkers();
    if (cityPopup) {
      cityPopup.remove();
    }
    map.remove();
  };
}, []);
```

## Features

### Cities Data
- **200 Indian cities** with coordinates
- **Population ranking** (1-200)
- **State information** for each city
- **Major metros** like Mumbai, Delhi, Bangalore, etc.

### Visual Features
- **Color-coded markers**: Red for top 10, orange for top 50, gray for others
- **Zoom-based visibility**: Shows more cities as you zoom in
- **Interactive popups**: Click cities to see details
- **Responsive labels**: City names appear based on zoom level

### Controls
- **Toggle cities on/off**
- **Filter options**:
  - All Cities (200 cities)
  - Top 10 (major metros)
  - Top 50 (important cities)
  - Metros (can be customized)

## Usage Examples

### Get Cities by State
```javascript
import { filterCitiesByState } from './CitiesLayer';

const maharashtraCities = filterCitiesByState('Maharashtra');
console.log(`Maharashtra has ${maharashtraCities.features.length} cities`);
```

### Get Top Cities
```javascript
import { getTopCities } from './CitiesLayer';

const top10Cities = getTopCities(10);
console.log('Top 10 cities:', top10Cities.features.map(f => f.properties.name));
```

### Custom City Popup
```javascript
import { createCityPopup } from './CitiesLayer';

const customPopup = createCityPopup(cityData, coordinates);
// Use this HTML in your MapBox popup
```

## Styling

The cities layer uses these CSS classes:
- `.city-popup` - Main popup container
- `.city-popup-header` - Popup header with city name and rank
- `.city-rank` - Population rank badge
- `.cities-toggle` - Control panel for cities
- `.cities-filter-button` - Filter buttons

## Data Structure

Each city feature has these properties:
```javascript
{
  "id": 1,
  "name": "Mumbai",
  "state": "Maharashtra", 
  "type": "city",
  "population_rank": 1
}
```

## Performance Notes

- Cities are filtered by zoom level to improve performance
- Only top cities show at low zoom levels
- Labels have collision detection to prevent overlap
- Layer can be toggled on/off to save resources

## Next Steps

1. **Integrate into your MapContainer** following the steps above
2. **Customize the styling** in `cities.css` to match your theme
3. **Add more city data** if needed (population, area, etc.)
4. **Create city-based game mechanics** for your tycoon game

The cities layer is now ready to use alongside your existing states layer! 