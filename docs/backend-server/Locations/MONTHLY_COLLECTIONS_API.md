# Monthly Collections API Documentation

## Overview

The `/api/reports/locations` endpoint provides access to monthly financial collection data for all or specific locations, with flexible filtering options. It is designed to support reporting and analytics for the Claygrounds platform, leveraging data from the Supabase-connected Postgres database.

---

## Endpoint

```
GET /api/reports/locations
```

---

## Description

Returns monthly collection data for locations, optionally filtered by location ID, location name, financial year, and/or month. The data is sourced from the `vw_monthly_location_total_collection` view, which aggregates information from bookings, licenses, and events payments.

---

## Related Tables & View

- **locations**: Stores location metadata (location_id, location_name, city, etc.)
- **vw_monthly_location_total_collection** (view): Provides monthly totals for each location, including:
  - `location_id`
  - `location_name`
  - `financial_year`
  - `month`
  - `bookings_total`
  - `licenses_total`
  - `events_total`
  - `grand_total_collected`

---

## Request Headers

- `Content-Type: application/json` (default for most clients)
- No authentication required (unless your server enforces it)

---

## Query Parameters (Filters)

| Parameter      | Type   | Description                                      | Example                  |
| --------------|--------|--------------------------------------------------|--------------------------|
| id            | string | Filter by unique location_id                     | `id=d40dba96-...`        |
| name          | string | Filter by unique location_name                   | `name=Rajouri`           |
| financialYear | string | Filter by financial year (format: YYYY-YYYY)     | `financialYear=2024-2025`|
| month         | string | Filter by month name (April, May, ..., March)    | `month=January`          |

**Note:** Only one of `id` or `name` can be used at a time.

---

## Summary Object

The response includes a `summary` object at the top, which provides the cumulative totals for all returned records based on the applied filters. This makes it easy to see the overall totals for:
- `bookings_total`
- `licenses_total`
- `events_total`
- `grand_total_collected`

---

## Example Requests

- **All locations, all periods:**
  ```bash
  curl -X GET 'http://localhost:3001/api/reports/locations'
  ```
- **All locations for a financial year:**
  ```bash
  curl -X GET 'http://localhost:3001/api/reports/locations?financialYear=2024-2025'
  ```
- **All locations for a financial year and month:**
  ```bash
  curl -X GET 'http://localhost:3001/api/reports/locations?financialYear=2024-2025&month=January'
  ```
- **Specific location by ID:**
  ```bash
  curl -X GET 'http://localhost:3001/api/reports/locations?id=d40dba96-8e55-487e-b0ef-e0d2f738bdc6'
  ```
- **Specific location by name:**
  ```bash
  curl -X GET 'http://localhost:3001/api/reports/locations?name=Rajouri'
  ```
- **Specific location, year, and month:**
  ```bash
  curl -X GET 'http://localhost:3001/api/reports/locations?id=d40dba96-8e55-487e-b0ef-e0d2f738bdc6&financialYear=2024-2025&month=January'
  # or
  curl -X GET 'http://localhost:3001/api/reports/locations?name=Rajouri&financialYear=2024-2025&month=January'
  ```

---

## Example Response

```
{
  "success": true,
  "summary": {
    "bookings_total": 123456,
    "licenses_total": 23456,
    "events_total": 3456,
    "grand_total_collected": 150000
  },
  "data": [
    {
      "location_id": "d40dba96-8e55-487e-b0ef-e0d2f738bdc6",
      "location_name": "Rajouri",
      "financial_year": "2024-2025",
      "month": "January",
      "bookings_total": 12000,
      "licenses_total": 5000,
      "events_total": 2000,
      "grand_total_collected": 19000
    },
    ...
  ],
  "count": 1
}
```

---

## Error Responses

- **400 Bad Request** (invalid input):
  ```json
  { "success": false, "error": "Invalid financial year format. Use YYYY-YYYY" }
  ```
- **500 Internal Server Error** (server/database error):
  ```json
  { "success": false, "error": "<error message>", "details": { ... } }
  ```

---

## Imports (for developers)

If you want to use this endpoint in your Node.js/Express app:

```js
import express from 'express';
import monthlyCollectionsRouter from './src/routes/bookings/monthlyCollections.js';

app.use('/api/reports', monthlyCollectionsRouter);
```

---

## Route Summary

- **Base route:** `/api/reports/locations`
- **Method:** `GET`
- **Filters:** `id`, `name`, `financialYear`, `month` (as query parameters)
- **Returns:** Array of monthly collection records, with totals for bookings, licenses, and events, and a summary object

---

## Notes
- The endpoint is flexible and can be extended with more filters as needed.
- Data is sourced from a materialized view for performance and aggregation.
- Only one of `id` or `name` should be provided per request.
- All filters are optional; omitting them returns all data. 