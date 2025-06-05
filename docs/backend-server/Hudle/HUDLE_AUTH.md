# Hudle Authentication & Tokenization

## Overview
This document describes the authentication and tokenization process for the Hudle API integration in the Claygrounds Server. Before making any Hudle API calls, you must authenticate to obtain a valid token. The system uses a cached token that is refreshed hourly to minimize API calls.

---

## File Structure & Responsibilities

- **`src/routes/hudle/hudleAuth.js`**: Express route handler for `/api/auth/token`. Handles login to Hudle API and returns a token to clients/scripts. Used by the backend server.
- **`src/hudle/auth/hudleAuthUtils.js`**: Utility module for scripts and backend code to fetch a valid Hudle API token and headers. Calls the `/api/auth/token` endpoint (handled by the above route) to get a token for use in API requests.

---

## Authentication Flow

1. **Login:**
   - **URL:** `/api/hudle/auth/token`
   - **Method:** `POST`
   - **Body:**
     ```json
     {
       "forceRefresh": false
     }
     ```
   - **Response:**
     ```json
     {
       "token": "your-auth-token",
       "expiresAt": 1715000000000
     }
     ```
   - **Example:**
     ```sh
     curl -X POST -H "Content-Type: application/json" -d '{"forceRefresh":false}' http://localhost:3001/api/hudle/auth/token
     ```

2. **Token Caching:**
   - The token is cached in memory and refreshed hourly.
   - If the token expires, the system automatically refreshes it.

3. **Token Refresh:**
   - To force a refresh, send `{ "forceRefresh": true }` in the POST body to `/api/hudle/auth/token`.

---

## Environment Variables
- `HUDLE_API_EMAIL`: Your Hudle API email
- `HUDLE_API_PASSWORD`: Your Hudle API password
- `API_SECRET`: Your Hudle API secret (e.g., `hudle-api1798@prod`)

Ensure these variables are set in your environment or `.env` file.

---

## Token Expiration & Security
- Tokens expire after 24 hours (or as set by the backend).
- The system automatically refreshes the token to ensure continuous access.
- Store tokens securely and never expose them in client-side code.

---

## Example: Using the Utility in Scripts/Backend
```js
import { getHudleToken, getHudleHeaders } from './src/api/hudleAuthUtils.js';
const token = await getHudleToken();
const headers = await getHudleHeaders();
const response = await fetch('https://api.hudle.in/api/v1/user/venues', { headers });
```

---

## Contact & Support
For questions or issues, contact the Claygrounds Server maintainers or refer to the project README. 