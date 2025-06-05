// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://partner.claygrounds.com';
const API_ENDPOINTS = {
  locations: {
    all: '/api/locations/all',
    basic: '/api/locations/basic',
    active: '/api/locations/active',
    inactive: '/api/locations/inactive',
    owned: '/api/locations/owned',
    managed: '/api/locations/managed',
    outsourced: '/api/locations/outsourced',
    unassigned: '/api/locations/unassigned',
    byName: (name) => `/api/locations/name/${encodeURIComponent(name)}`,
    byId: (id) => `/api/locations/id/${id}`,
    search: (query) => `/api/locations/search/location/${encodeURIComponent(query)}`,
    byCity: (city) => `/api/locations/search/city/${encodeURIComponent(city)}`,
    byRegion: (region) => `/api/locations/search/region/${encodeURIComponent(region)}`,
    byManager: (manager) => `/api/locations/search/manager/${encodeURIComponent(manager)}`,
    managerByLocation: (name) => `/api/locations/name/${encodeURIComponent(name)}/manager`,
  },
  reports: {
    monthlyCollections: '/api/reports/locations',
  },
};

// Generic API request function with error handling
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers here if needed
      // 'Authorization': `Bearer ${token}`,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
}

// Location API Services
export const locationsApi = {
  // Get all locations with full details
  async getAll() {
    return apiRequest(API_ENDPOINTS.locations.all);
  },

  // Get basic location info for dropdowns/lists
  async getBasic() {
    return apiRequest(API_ENDPOINTS.locations.basic);
  },

  // Get only active locations
  async getActive() {
    return apiRequest(API_ENDPOINTS.locations.active);
  },

  // Get only inactive/closed locations
  async getInactive() {
    return apiRequest(API_ENDPOINTS.locations.inactive);
  },

  // Get owned locations
  async getOwned() {
    return apiRequest(API_ENDPOINTS.locations.owned);
  },

  // Get managed locations
  async getManaged() {
    return apiRequest(API_ENDPOINTS.locations.managed);
  },

  // Get outsourced locations
  async getOutsourced() {
    return apiRequest(API_ENDPOINTS.locations.outsourced);
  },

  // Get locations needing managers
  async getUnassigned() {
    return apiRequest(API_ENDPOINTS.locations.unassigned);
  },

  // Get location by name
  async getByName(name) {
    return apiRequest(API_ENDPOINTS.locations.byName(name));
  },

  // Get location by ID
  async getById(id) {
    return apiRequest(API_ENDPOINTS.locations.byId(id));
  },

  // Search locations by name
  async searchByName(query) {
    return apiRequest(API_ENDPOINTS.locations.search(query));
  },

  // Get locations by city
  async getByCity(city) {
    return apiRequest(API_ENDPOINTS.locations.byCity(city));
  },

  // Get locations by region
  async getByRegion(region) {
    return apiRequest(API_ENDPOINTS.locations.byRegion(region));
  },

  // Get locations by manager
  async getByManager(manager) {
    return apiRequest(API_ENDPOINTS.locations.byManager(manager));
  },

  // Get manager details by location name
  async getManagerByLocation(locationName) {
    return apiRequest(API_ENDPOINTS.locations.managerByLocation(locationName));
  },

  // Filter locations (client-side filtering for now)
  async getFiltered(filters) {
    let locations;
    
    // Choose the appropriate endpoint based on filters
    if (filters.status === 'Active') {
      locations = await this.getActive();
    } else if (filters.status === 'Closed') {
      locations = await this.getInactive();
    } else if (filters.management_status === 'Owned') {
      locations = await this.getOwned();
    } else if (filters.management_status === 'Managed') {
      locations = await this.getManaged();
    } else if (filters.management_status === 'Outsourced') {
      locations = await this.getOutsourced();
    } else {
      locations = await this.getAll();
    }

    // Apply additional filters client-side
    if (filters.state) {
      locations = locations.filter(loc => loc.state === filters.state);
    }
    if (filters.city) {
      locations = locations.filter(loc => loc.city === filters.city);
    }
    if (filters.property_type) {
      locations = locations.filter(loc => loc.property_type === filters.property_type);
    }

    return locations;
  },
};

// Reports API Services
export const reportsApi = {
  // Get monthly collections data
  async getMonthlyCollections(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const endpoint = `${API_ENDPOINTS.reports.monthlyCollections}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },
};

// Utility functions for the map
export const mapUtils = {
  // Get locations with coordinates only (for map display)
  async getLocationsWithCoordinates() {
    const locations = await locationsApi.getAll();
    return locations.filter(loc => loc.latitude && loc.longitude);
  },

  // Get unique states from locations
  async getStates() {
    const locations = await locationsApi.getAll();
    const states = [...new Set(locations.map(loc => loc.state))];
    return states.sort();
  },

  // Get unique cities from locations
  async getCities() {
    const locations = await locationsApi.getAll();
    const cities = [...new Set(locations.map(loc => loc.city))];
    return cities.sort();
  },

  // Get locations by state (for state filtering)
  async getLocationsByState(state) {
    const locations = await locationsApi.getAll();
    return locations.filter(loc => loc.state === state);
  },
};

// Export the main API object
export const api = {
  locations: locationsApi,
  reports: reportsApi,
  utils: mapUtils,
};

export default api; 