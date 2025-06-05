# Hudle API Endpoints Documentation

## Overview
This document describes the RESTful API endpoints for fetching and managing Hudle venues data in the Claygrounds Server. The API supports batch/global, single-region/city, and user-specific venue fetches, with incremental file writing and region mapping for robust automation and integration.

All endpoints support optional detailed venue information via the `includeDetails` query parameter.

For slot-related endpoints and analysis, please refer to [HUDLE_SLOTS.md](./HUDLE_SLOTS.md).

---

## Endpoints

### 1. **Batch/Global Venues**
- **URL:** `/api/hudle/venues/global`
- **Method:** `GET`
- **Description:** Fetches venues for all regions (city IDs) as defined in `regions.json`. Writes output incrementally to `data/hudle/locations/global_hudle_locations.json`.
- **Query Parameters:**
  - `includeDetails` (boolean, optional): Whether to include detailed venue information (admin, facilities, etc.)
- **Response:**
  - `status`: `success` or `error`
  - `meta_summary`: Object with total regions, total locations, etc.
  - `last_updated`: ISO timestamp
- **Example:**
  ```sh
  # Basic fetch
  curl -s 'http://localhost:3001/api/hudle/venues/global' | jq
  
  # With detailed information
  curl -s 'http://localhost:3001/api/hudle/venues/global?includeDetails=true' | jq
  ```

---

### 2. **Single Region/City Venues**
- **URL:** `/api/hudle/venues/region/:cityId`
- **Method:** `GET`
- **Description:** Fetches venues for a single region/city (by cityId, as per `regions.json`). Writes output incrementally to `data/hudle/locations/city/{cityId}/hudle_locations.json`.
- **Parameters:**
  - `cityId` (URL param, required): The city/region ID (integer, as in `regions.json`)
- **Query Parameters:**
  - `includeDetails` (boolean, optional): Whether to include detailed venue information (admin, facilities, etc.)
- **Response:**
  - `region_name`: Mapped region name from `regions.json`
  - `cityId`: The city/region ID
  - `summary`: Object with pagination and venue stats
  - `venues`: Array of venue objects
  - `lastUpdated`: ISO timestamp
- **Example:**
  ```sh
  # Basic fetch
  curl -s 'http://localhost:3001/api/hudle/venues/region/11' | jq
  
  # With detailed information
  curl -s 'http://localhost:3001/api/hudle/venues/region/11?includeDetails=true' | jq
  ```

---

### 3. **User Venues**
- **URL:** `/api/hudle/venues/user`
- **Method:** `GET`
- **Description:** Fetches venues for the authenticated user (not region/city specific). Writes output to `data/hudle/locations/user_hudle_locations.json`.
- **Query Parameters:**
  - `includeDetails` (boolean, optional): Whether to include detailed venue information (admin, facilities, etc.)
- **Response:**
  - `venues`: Array of venue objects
  - `summary`: Object with pagination and venue stats
  - `lastUpdated`: ISO timestamp
- **Example:**
  ```sh
  # Basic fetch
  curl -s 'http://localhost:3001/api/hudle/venues/user' | jq
  
  # With detailed information
  curl -s 'http://localhost:3001/api/hudle/venues/user?includeDetails=true' | jq
  ```

---

### 4. **Single Venue Details**
- **URL:** `/api/hudle/venues/detail/:venueId`
- **Method:** `GET`
- **Description:** Fetches detailed information about a specific venue
- **Parameters:**
  - `venueId` (path parameter): The ID of the venue to fetch
- **Query Parameters:**
  - `include_facilities` (default: false): Include facility details
  - `include_activities` (default: false): Include activity details
  - `include_admin` (default: true): Include admin information
  - `include_features` (default: false): Include extra features
  - `include_credit_plans` (default: false): Include credit plans
- **Response:**
  - Detailed venue object with requested sections included
  - Basic venue information is always included
- **Example Usage:**
  ```bash
  # Basic usage
  curl http://localhost:3001/api/hudle/venues/detail/3b56540b-f266-49fe-b327-aec2d3ca7bcb

  # Include specific sections
  curl "http://localhost:3001/api/hudle/venues/detail/3b56540b-f266-49fe-b327-aec2d3ca7bcb?include_facilities=true&include_activities=true"
  ```

### 5. **Venue Facilities**
- **URL:** `/api/hudle/venues/detail/:venueId/facilities`
- **Method:** `GET`
- **Description:** Lists all facilities available at a specific venue
- **Parameters:**
  - `venueId` (path parameter): The ID of the venue to fetch facilities for
- **Response:**
  - `venue_id`: The venue ID
  - `facilities`: Array of facility objects with details
  - `total_facilities`: Total number of facilities
  - `lastUpdated`: Timestamp of last update
- **Example Usage:**
  ```bash
  curl http://localhost:3001/api/hudle/venues/detail/3b56540b-f266-49fe-b327-aec2d3ca7bcb/facilities
  ```

---

## Output File Locations
- **Batch/global:** `data/hudle/locations/global_hudle_locations.json`
- **Single region/city:** `data/hudle/locations/city/{cityId}/hudle_locations.json`
- **User venues:** `data/hudle/locations/user_hudle_locations.json`
- **Single venue details:** `data/hudle/locations/venue/{venueId}/venue_details.json`
- **Venue facilities:** `data/hudle/locations/venue/{venueId}/facilities.json`

All files are updated incrementally after each page of API results is fetched.

---

## Logic & Features
- **Incremental Writing:** Output files are updated after every page, ensuring progress is saved and memory usage is minimized.
- **Region Name Mapping:** For city-specific fetches, the mapped `region_name` from `regions.json` is included in both the output file and API response.
- **New Venue Detection:** Batch/global output includes summaries for each region, with new venues detected by comparing with previous runs.
- **Pagination:** All endpoints handle API pagination transparently.
- **Detailed Information:** All endpoints support fetching detailed venue information via the `includeDetails` parameter, which includes:
  - Admin information
  - Extra features
  - Facilities
  - Credit plan statistics
  - All activities

---

## Usage in Frontend/Automation
- Endpoints are designed for both manual and automated use (e.g., scheduled jobs, admin dashboard buttons).
- Output files can be used for analytics, notifications, or further processing.
- Detailed venue information can be fetched on-demand using the `includeDetails` parameter.
- Single venue details endpoint provides granular control over included information.

---

## Authentication & Environment
- The API uses a cached authentication token, refreshed hourly.
- Requires environment variables for Hudle API credentials (see `src/api/hudleAuth.js`).
- Ensure the server has write access to the `data/hudle/locations/` directory.

# Hudle API Integration

## Overview
This document provides an overview of the Hudle API integration in the Claygrounds Server.

## Documentation Structure

### Core Documentation
- [Authentication & Tokenization](./HUDLE_AUTH.md) - Authentication flow and token management
- [Venues API](./HUDLE_VENUES_API.md) - Venue management and data retrieval
- [Slots API](./HUDLE_SLOTS.md) - Slot availability and analysis endpoints

### Additional Resources
- [API Streaming](./HUDLE_API_STREAMING.md) - Streaming data from Hudle API
- [Email Export](./HUDLE_EMAIL_EXPORT.md) - Email report generation

## API Structure

### Base URL
```
https://api.hudle.in/api/v1
```

### Authentication
All API calls require authentication. See [Authentication Documentation](./HUDLE_AUTH.md) for details.

### Main Endpoints

1. **Venues**
   - Global venues
   - Region-specific venues
   - User-specific venues
   - Venue details and facilities

2. **Slots**
   - Slot availability
   - Slot analysis
   - Weekly/monthly summaries
   - Business insights

3. **Email Reports**
   - Venue reports
   - Facility reports
   - Custom reports

## Data Storage
All API responses are cached in the following structure:
```
data/hudle/
├── locations/
│   ├── global/          # Global venue data
│   ├── regions/         # Region-specific data
│   └── venue/           # Individual venue data
│       └── {venueId}/
│           ├── venue_details.json
│           └── facilities/
│               └── {facilityId}/
│                   ├── slots.json
│                   ├── slots_analysis.json
│                   └── slots_availability.json
└── reports/            # Generated reports
```

## Error Handling
All endpoints follow a consistent error response format:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Best Practices
1. Always use authentication
2. Handle rate limiting
3. Cache responses appropriately
4. Use appropriate endpoints for your needs
5. Follow error handling guidelines

## Contact & Support
For questions or issues, contact the Claygrounds Server maintainers or refer to the project README.