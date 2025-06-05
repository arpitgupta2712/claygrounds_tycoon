// Simple test utility to check API connection
import { api } from '../services/api';

export const testApiConnection = async () => {
  console.log('🧪 Testing ClayGrounds API connection...');
  
  try {
    // Test basic connection with basic endpoint
    console.log('📡 Fetching basic location data...');
    const basicLocations = await api.locations.getBasic();
    console.log('✅ Basic locations fetched:', basicLocations.length, 'locations');
    console.log('📍 Sample basic location:', basicLocations[0]);
    
    // Test full location data
    console.log('📡 Fetching all location data...');
    const allLocations = await api.locations.getAll();
    console.log('✅ All locations fetched:', allLocations.length, 'locations');
    
    // Check for locations with coordinates
    const locationsWithCoords = allLocations.filter(loc => loc.latitude && loc.longitude);
    console.log('🗺️ Locations with coordinates:', locationsWithCoords.length);
    
    if (locationsWithCoords.length > 0) {
      console.log('📍 Sample location with coordinates:', locationsWithCoords[0]);
    }
    
    // Test state filtering
    const states = await api.utils.getStates();
    console.log('🏛️ Available states:', states);
    
    return {
      success: true,
      totalLocations: allLocations.length,
      locationsWithCoords: locationsWithCoords.length,
      states: states,
    };
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Auto-run test when this file is imported in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below to auto-test API on app load
  // testApiConnection();
} 