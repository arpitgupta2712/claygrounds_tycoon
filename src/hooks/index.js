// GeoJSON Data Hooks
export {
  useGeoJSONData,
  useIndiaStatesData,
  useIndiaDistrictsData,
  useIndiaCitiesData,
  clearGeoJSONCache,
  getCacheStats
} from './useGeoJSONData';

// Map Layer Hooks
export {
  useMapLayer,
  useStateBoundariesLayer,
  useDistrictBoundariesLayer,
  useCitiesLayer
} from './useMapLayer';

// Map Controls Hooks
export {
  useMapControls,
  useGameViewMode,
  useLayerVisibility
} from './useMapControls'; 