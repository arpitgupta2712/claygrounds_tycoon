# ClayGrounds Tycoon - Frontend Quick Reference

## 🚀 Before Creating New Components - Check These First!

### **Already Available Components**

#### **Loading & Error States** ✅ REUSE THESE
```javascript
import { 
  DataLoadingSpinner,    // For data loading
  ErrorBoundary,         // For error handling  
  EmptyState,           // For no data states
  InlineLoader,         // For small loading indicators
  SkeletonLoader        // For content placeholders
} from '../components/ui/LoadingStates';
```

#### **UI Panels** ✅ REUSE THESE
```javascript
import ControlPanel from '../components/ui/ControlPanel';           // Base panel
import ControlSidebar from '../components/ui/ControlSidebar';       // Sidebar container
import StatesControlPanel from '../components/ui/StatesControlPanel';     // State selection
import DistrictsControlPanel from '../components/ui/DistrictsControlPanel'; // District selection
import CitiesControlPanel from '../components/ui/CitiesControlPanel';     // Cities control
```

#### **Map Components** ✅ REUSE THESE
```javascript
import { StateBoundariesLayer, CitiesLayer, DistrictBoundariesLayer } from '../components/map/layers';
import { MapMarker, useMapMarkers } from '../components/map/components';
import LocationModal from '../components/map/LocationModal';
```

#### **Custom Hooks** ✅ REUSE THESE
```javascript
import { 
  useGeoJSONData,      // Smart data fetching with caching
  useMapLayer,         // Map layer management
  useMapControls       // Map control state
} from '../hooks';
```

#### **API Services** ✅ REUSE THESE
```javascript
import { locationsApi, reportsApi, mapUtils } from '../services/api';
import api from '../api/axios';  // Configured axios instance
```

---

## 🔍 Component Finder

### **Need to show loading?** → Use `LoadingStates.js`
- `<DataLoadingSpinner type="states" />`
- `<InlineLoader message="Loading..." />`
- `<SkeletonLoader count={3} />`

### **Need to handle errors?** → Use `LoadingStates.js`
- `<ErrorBoundary error={error} retry={refetch} />`
- `<DataError error={error} dataType="locations" />`

### **Need a control panel?** → Use `ControlPanel.js`
- Base component for all sidebar panels
- Built-in expand/collapse, theming, badges

### **Need map functionality?** → Check `/map/` directory
- **Boundaries**: `StateBoundariesLayer`, `DistrictBoundariesLayer`
- **Markers**: `MapMarker` (modern) or legacy `MapMarker.js`
- **Modals**: `LocationModal` for location details

### **Need data fetching?** → Use custom hooks
- `useGeoJSONData()` for API data with caching
- `useMapLayer()` for map layer management
- `useMapControls()` for control state

### **Need API calls?** → Use `services/api.js`
- `locationsApi.getAll()`, `getByState()`, `getActive()`
- `reportsApi.getMonthlyCollections()`
- `mapUtils.getStates()`, `getCities()`

---

## 🎨 Styling Guidelines

### **CSS Classes** - Always use `cg-` prefix
```css
/* Buttons */
.cg-btn, .cg-btn-primary, .cg-btn-outline, .cg-btn-ghost

/* Panels */
.cg-panel, .cg-control-panel, .cg-sidebar

/* Loading States */
.cg-loading-spinner, .cg-error-boundary, .cg-empty-state

/* Layout */
.cg-container, .cg-grid, .cg-flex
```

### **Available Style Files**
- `theme.css` - Design system variables
- `components.css` - Reusable component styles  
- `layout.css` - Layout and grid styles
- `map.css` - Map-specific styles

---

## 🔧 Common Patterns

### **Data Fetching with Loading States**
```javascript
const MyComponent = () => {
  const { data, loading, error, refetch } = useGeoJSONData();
  
  if (loading) return <DataLoadingSpinner type="states" />;
  if (error) return <DataError error={error} retry={refetch} />;
  if (!data) return <EmptyState title="No data available" />;
  
  return <div>{/* Your component */}</div>;
};
```

### **Control Panel Pattern**
```javascript
const MyControlPanel = ({ isVisible, data }) => {
  if (!isVisible) return null;
  
  return (
    <ControlPanel
      title="My Panel"
      icon="🏛️"
      badge={data?.length}
      defaultExpanded={true}
    >
      {/* Panel content */}
    </ControlPanel>
  );
};
```

### **Map Layer Pattern**
```javascript
const MyMapLayer = ({ map, data, isVisible }) => {
  const { addLayer, removeLayer } = useMapLayer(map, {
    id: 'my-layer',
    type: 'fill',
    source: data,
    visible: isVisible
  });
  
  // Layer automatically managed by hook
  return null;
};
```

---

## 🚫 Don't Create These - They Already Exist!

### **❌ Don't Create:**
- Loading spinners → Use `LoadingStates.js`
- Error handling components → Use `ErrorBoundary`, `DataError`
- Basic panels → Use `ControlPanel.js`
- Map markers → Use `MapMarker` component
- Data fetching logic → Use `useGeoJSONData` hook
- API request functions → Use `services/api.js`
- State/district/city controls → Use existing control panels

### **✅ Instead, Extend Existing:**
- Add new props to existing components
- Create new hooks that use existing patterns
- Extend API services with new endpoints
- Add new loading state types to `LoadingStates.js`

---

## 📁 File Organization

### **Where to Put New Files:**

| Type | Location | Example |
|------|----------|---------|
| UI Component | `/components/ui/` | `NewControlPanel.js` |
| Map Component | `/components/map/` | `NewMapFeature.js` |
| Custom Hook | `/hooks/` | `useNewFeature.js` |
| API Service | `/services/` | Extend existing `api.js` |
| Utility | `/utils/` | `newUtility.js` |
| Page | `/pages/` | `NewPage.js` |
| Style | `/styles/` | `new-feature.css` |

### **Naming Conventions:**
- **Components**: PascalCase (`MyComponent.js`)
- **Hooks**: camelCase with `use` prefix (`useMyHook.js`)
- **Utilities**: camelCase (`myUtility.js`)
- **CSS Classes**: kebab-case with `cg-` prefix (`cg-my-class`)

---

## 🔄 Migration Status

### **✅ Modern (Use These)**
- All `/ui/` components
- All `/hooks/` 
- `/map/layers/` components
- `/map/components/MapMarker.js`
- Enhanced `LocationModal.js`

### **📋 Legacy (Avoid/Replace)**
- `/map/MapMarker.js` (class-based, use `/components/MapMarker.js`)
- Any components without loading states
- Direct API calls (use hooks instead)

---

## 🆘 Quick Help

### **Need help with:**
- **Loading states?** → Check `LoadingStates.js` examples
- **Map integration?** → Look at existing layer components
- **API calls?** → Use `services/api.js` functions
- **Styling?** → Follow `cg-*` convention in `theme.css`
- **Performance?** → Use `useMemo`, `useCallback`, `React.memo`

### **Before coding, ask:**
1. Does this functionality already exist?
2. Can I extend an existing component?
3. Should this be a reusable hook?
4. Am I following the `cg-*` naming convention?
5. Do I need loading/error states?

---

**Quick Reference Version**: 1.0  
**Last Updated**: December 2024 