# Hudle Slots API Documentation

## Overview
This document describes the slot availability and analysis endpoints for the Hudle API integration in the Claygrounds Server. These endpoints provide comprehensive slot management, availability checking, and analytics capabilities.

## File Structure & Responsibilities

- **`src/routes/hudle/slots/index.js`**: Express route handler for all slot-related endpoints
- **`src/api/upcomingSlots.js`**: Core slot analysis and processing logic
- **`src/api/slotAvailability.js`**: Business-focused slot availability analytics

## Authentication
All endpoints require a valid Hudle API token. See [HUDLE_AUTH.md](./HUDLE_AUTH.md) for authentication details.

## Endpoints

### 1. Fetch Slot Availability
```http
GET /api/hudle/venues/detail/:venueId/facilities/:facilityId/slots
```

Fetches raw slot availability data for a specific facility.

**Parameters:**
- `venueId` (path): The venue ID
- `facilityId` (path): The facility ID
- `start_date` (query, optional): Start date in YYYY-MM-DD format (defaults to today)
- `end_date` (query, optional): End date in YYYY-MM-DD format (defaults to today)

**Response:**
```json
{
  "venue_id": "string",
  "facility_id": "string",
  "date_range": {
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
  },
  "slots": [...],
  "lastUpdated": "ISO timestamp"
}
```

**Example Usage:**
```bash
# Get slots for today (default)
curl "http://localhost:3001/api/hudle/venues/detail/3b56540b-f266-49fe-b327-aec2d3ca7bcb/facilities/caec160c-df3d-497b-b40b-e76d1fa3a383/slots"

# Get slots for specific date range
curl "http://localhost:3001/api/hudle/venues/detail/3b56540b-f266-49fe-b327-aec2d3ca7bcb/facilities/caec160c-df3d-497b-b40b-e76d1fa3a383/slots?start_date=2025-05-30&end_date=2025-06-06"
```

### 2. Get Today's Slot Analysis
```http
GET /api/hudle/venues/detail/:venueId/facilities/:facilityId/slots/today
```

Provides comprehensive analysis of slot availability data for today.

**Parameters:**
- `venueId` (path): The venue ID
- `facilityId` (path): The facility ID
- `start_date` (query, optional): Start date in YYYY-MM-DD format (defaults to today)
- `end_date` (query, optional): End date in YYYY-MM-DD format (defaults to today)

**Response:**
```json
{
  "venue_id": "string",
  "facility_id": "string",
  "facility_details": {
    "name": "string",
    "price": "number",
    "slot_length": "number"
  },
  "date": "YYYY-MM-DD",
  "summary": {
    "total_slots": "number",
    "available_slots": "number",
    "booked_slots": "number",
    "unavailable_slots": "number",
    "availability_percentage": "number"
  },
  "available_slots": [...],
  "booked_slots": [...],
  "lastUpdated": "ISO timestamp"
}
```

**Example Usage:**
```bash
# Get analyzed slots for today (default)
curl "http://localhost:3001/api/hudle/venues/detail/3b56540b-f266-49fe-b327-aec2d3ca7bcb/facilities/caec160c-df3d-497b-b40b-e76d1fa3a383/slots/today"

# Get analyzed slots for specific date
curl "http://localhost:3001/api/hudle/venues/detail/3b56540b-f266-49fe-b327-aec2d3ca7bcb/facilities/caec160c-df3d-497b-b40b-e76d1fa3a383/slots/today?start_date=2025-05-30"
```

### 3. Weekly Availability Summary
```http
GET /api/hudle/venues/detail/:venueId/facilities/:facilityId/slots/week
```

Provides a quick availability summary for the current week.

**Parameters:**
- `venueId` (path): The venue ID
- `facilityId` (path): The facility ID
- `start_date` (query, optional): Start date in YYYY-MM-DD format (defaults to today)
- `end_date` (query, optional): End date in YYYY-MM-DD format (defaults to today + 6 days)

**Response:**
```json
{
  "facility": {...},
  "period": {...},
  "revenue": {...},
  "utilization": {...},
  "time_period_performance": {...},
  "day_type_analysis": {...},
  "daily_trends": [...],
  "peak_performance": {...},
  "opportunities": {...},
  "insights": {...}
}
```

### 4. Monthly Availability Summary
```http
GET /api/hudle/venues/detail/:venueId/facilities/:facilityId/slots/month
```

Provides a quick availability summary for the current month.

**Parameters:**
- `venueId` (path): The venue ID
- `facilityId` (path): The facility ID
- `start_date` (query, optional): Start date in YYYY-MM-DD format (defaults to today)
- `end_date` (query, optional): End date in YYYY-MM-DD format (defaults to today + 29 days)

**Response:**
Same structure as weekly availability summary.

## Data Storage
All slot data is automatically cached in the following structure:
```
data/hudle/locations/venue/{venueId}/facilities/{facilityId}/
├── slots.json              # Raw slot data
├── slots_analysis.json     # Analyzed slot data
└── slots_availability.json # Availability summary
```

## Error Handling
All endpoints return appropriate HTTP status codes and error messages:
- `200`: Success
- `400`: Invalid parameters
- `401`: Authentication error
- `404`: Venue or facility not found
- `500`: Server error

Error response format:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Best Practices
1. Always include appropriate date ranges
2. Use the analysis endpoint for detailed insights
3. Use weekly/monthly endpoints for quick summaries
4. Handle errors appropriately
5. Cache responses when possible

## Contact & Support
For questions or issues, contact the Claygrounds Server maintainers or refer to the project README. 