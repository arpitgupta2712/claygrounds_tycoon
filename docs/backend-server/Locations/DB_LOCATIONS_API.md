# Claygrounds API: Database Locations Endpoints

This document describes the REST API endpoints for managing and retrieving location data from the Claygrounds database. These endpoints are available under `/api/locations` and provide various levels of detail for use in admin panels, dashboards, and integrations.

---

## Overview

- **Base Path:** `/api/locations`
- **Authentication:** Required (see `AUTH.md` for details on authentication methods and token usage)
- **Response Format:** JSON (all responses are structured in JSON format for easy integration)
- **Primary Tables:**
  - `public.locations` — Main table for all location data, including details such as name, city, region, and management status.
  - `public.employees` — Table for employee data, including location managers and their details.
  - `public.regions` — Table for regional data, used for organizing locations by geographical regions.
- **Error Handling:** All endpoints return appropriate HTTP status codes and error messages in case of failures.
- **Pagination:** For endpoints returning large datasets, consider implementing client-side pagination.
- **Data Consistency:** Ensure data consistency by validating inputs and handling transactions appropriately.
- **Security:** All endpoints require authentication, and sensitive data is protected using secure connections.
- **Versioning:** The API is versioned to ensure backward compatibility and smooth transitions during updates.

---

## Index

1. [Get All Locations (Full Details)](#1-get-all-locations-full-details)
2. [Get Basic Location Info](#2-get-basic-location-info)
3. [Get All Active Locations](#3-get-all-active-locations)
4. [Get All Inactive Locations](#4-get-all-inactive-locations)
5. [List Locations Fully Owned and Operated](#5-list-locations-fully-owned-and-operated)
6. [List Locations Managed by Us](#6-list-locations-managed-by-us)
7. [List Locations Managed by SportVot](#7-list-locations-managed-by-sportvot)
8. [List Locations Needing a Manager](#8-list-locations-needing-a-manager)
9. [Get Location by Name](#9-get-location-by-name)
10. [Get Manager Details by Location Name](#10-get-manager-details-by-location-name)
11. [Get Location by ID](#11-get-location-by-id)
12. [Search Locations by Name](#12-search-locations-by-name)
13. [List Locations by City](#13-list-locations-by-city)
14. [List Locations by Region](#14-list-locations-by-region)
15. [List Locations by Manager](#15-list-locations-by-manager)

---

## Endpoints

### 1. Get All Locations (Full Details)
- **Endpoint:** `GET /api/locations/all`
- **Description:** Returns all locations with full details from the database.
- **Database Table:** `public.locations`
- **Filters:** None (returns all rows)
- **Response Example:**
```json
[
  {
    "s_no": 2,
    "location_name": "Charmwood",
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "region": "Faridabad",
    "city": "Faridabad",
    "state": "Haryana",
    "address": null,
    "pin_code": null,
    "property_type": "School",
    "opening_date": "2022-04-08T18:30:00.000Z",
    "created_at": "2025-03-18T17:09:28.340Z",
    "updated_at": "2025-04-26T07:56:54.460Z",
    "nickname": "Blue Angels Global School",
    "current_status": "Active",
    "google_business_name": "ClayGrounds - Football Turf | Charmwood Faridabad",
    "hudle_name": "ClayGrounds By Plaza | Charmwood"
  },
  // ... more locations ...
]
```

---

### 2. Get Basic Location Info
- **Endpoint:** `GET /api/locations/basic`
- **Description:** Returns minimal fields for all locations, suitable for dropdowns and lists.
- **Database Table:** `public.locations`
- **Filters:** None (returns all rows, but only selected columns)
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad",
    "current_status": "Active"
  },
  // ... more locations ...
]
```

---

### 3. Get All Active Locations
- **Endpoint:** `GET /api/locations/active`
- **Description:** Returns only active locations with key fields for operational use.
- **Database Table:** `public.locations`
- **Filters:** Only rows where `current_status = 'Active'`
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad",
    "current_status": "Active",
    "opening_date": "2022-04-08T18:30:00.000Z",
    "property_type": "School",
    "nickname": "Blue Angels Global School"
  },
  // ... more locations ...
]
```

---

### 4. Get All Inactive Locations
- **Endpoint:** `GET /api/locations/inactive`
- **Description:** Returns only inactive locations with key fields for operational use.
- **Database Table:** `public.locations`
- **Filters:** Only rows where `current_status = 'Closed'`
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad",
    "current_status": "Closed",
    "opening_date": "2022-04-08T18:30:00.000Z",
    "property_type": "School",
    "nickname": "Blue Angels Global School"
  },
  // ... more locations ...
]
```

---

### 5. List Locations Fully Owned and Operated
- **Endpoint:** `GET /api/locations/owned`
- **Description:** List locations fully owned and operated.
- **Database Table:** `public.locations`
- **Filters:** Only rows where `management_status = 'Owned'`
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad",
    "management_status": "Owned"
  },
  // ... more locations ...
]
```

---

### 6. List Locations Managed by Us
- **Endpoint:** `GET /api/locations/managed`
- **Description:** List locations where the landlord invested but we operate.
- **Database Table:** `public.locations`
- **Filters:** Only rows where `management_status = 'Managed'`
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad",
    "management_status": "Managed"
  },
  // ... more locations ...
]
```

---

### 7. List Locations Managed by SportVot
- **Endpoint:** `GET /api/locations/outsourced`
- **Description:** List locations managed by SportVot.
- **Database Table:** `public.locations`
- **Filters:** Only rows where `management_status = 'Outsourced'`
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad",
    "management_status": "Outsourced"
  },
  // ... more locations ...
]
```

---

### 8. List Locations Needing a Manager
- **Endpoint:** `GET /api/locations/unassigned`
- **Description:** List locations needing a manager.
- **Database Table:** `public.locations`
- **Filters:** Only rows where `location_manager_id IS NULL`
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad",
    "management_status": "Owned"
  },
  // ... more locations ...
]
```

---

### 9. Get Location by Name
- **Endpoint:** `GET /api/locations/name/:locationName`
- **Description:** Get complete details of a specific location by name.
- **Database Table:** `public.locations`
- **Filters:** Matches the specified location name.
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad"
  },
  // ... more locations ...
]
```

---

### 10. Get Manager Details by Location Name
- **Endpoint:** `GET /api/locations/name/:locationName/manager`
- **Description:** Get manager details for a specific location by location name.
- **Database Table:** `public.locations`
- **Filters:** Matches the specified location name.
- **Response Example:**
```json
[
  {
    "employee_name": "John Doe",
    "phone": "1234567890",
    "designation": "Manager",
    "email": "johndoe@example.com"
  },
  // ... more managers ...
]
```

---

### 11. Get Location by ID
- **Endpoint:** `GET /api/locations/id/:id`
- **Description:** Get complete details of a specific location by ID.
- **Database Table:** `public.locations`
- **Filters:** Matches the specified location ID.
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad"
  },
  // ... more locations ...
]
```

---

### 12. Search Locations by Name
- **Endpoint:** `GET /api/locations/search/location/:locationName`
- **Description:** Find locations by location name, nickname, google_business_name, or hudle_name.
- **Database Table:** `public.locations`
- **Filters:** Matches any part of the location name, nickname, google_business_name, or hudle_name.
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "nickname": "Blue Angels Global School",
    "google_business_name": "ClayGrounds - Football Turf | Charmwood Faridabad",
    "hudle_name": "ClayGrounds By Plaza | Charmwood"
  },
  // ... more locations ...
]
```

---

### 13. List Locations by City
- **Endpoint:** `GET /api/locations/search/city/:cityName`
- **Description:** List all locations within a specific city by city_name.
- **Database Table:** `public.locations`
- **Filters:** Matches any part of the city name.
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad"
  },
  // ... more locations ...
]
```

---

### 14. List Locations by Region
- **Endpoint:** `GET /api/locations/search/region/:regionName`
- **Description:** List all locations within a specific region by region_name.
- **Database Table:** `public.locations`
- **Filters:** Matches any part of the region name.
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad"
  },
  // ... more locations ...
]
```

---

### 15. List Locations by Manager
- **Endpoint:** `GET /api/locations/search/manager/:managerName`
- **Description:** List all locations managed by a specific Location Manager (designation).
- **Database Table:** `public.locations`
- **Filters:** Matches any part of the manager's name, nickname, bank name, or phone.
- **Response Example:**
```json
[
  {
    "location_id": "9487f2b4-80ad-4179-803a-297905bfc3fa",
    "location_name": "Charmwood",
    "city": "Faridabad",
    "region": "Faridabad",
    "manager_name": "John Doe"
  },
  // ... more locations ...
]
```

---

## Usage Notes
- All endpoints require authentication.
- For large datasets, consider paginating or filtering on the client side.
- Fields may be `null` if not available in the database.
- Timestamps are in ISO 8601 format (UTC).

---

## See Also
- [AUTH.md](AUTH.md) — Authentication and token usage
- [HUDLE_API.md](HUDLE_API.md) — Hudle venues API endpoints 