// Modern Map Components
export { default as MapMarker, useMapMarkers, isMarkerInViewport } from './MapMarker';

// Re-export optimized layer components for convenience
export { 
  StateBoundariesLayer,
  CitiesLayer, 
  DistrictBoundariesLayer 
} from '../layers';

// Future components can be added here
// export { default as MapTooltip } from './MapTooltip';
// export { default as MapControls } from './MapControls';
// export { default as MapLegend } from './MapLegend'; 