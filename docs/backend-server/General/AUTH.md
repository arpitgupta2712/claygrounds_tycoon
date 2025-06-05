# Hudle API & Database Authentication & Token Management

## Overview
This document describes the authentication flow, token management, and best practices for securely accessing the Hudle API and the Supabase PostgreSQL database from both server and client scripts in this project.

---

## File Structure & Responsibilities
- **`src/routes/api/hudleAuth.js`**: Express route handler for `/api/auth/token`. Handles login to Hudle API and returns a token to clients/scripts. Used by the backend server.
- **`src/api/hudleAuthUtils.js`**: Utility module for scripts and backend code to fetch a valid Hudle API token and headers. Calls the `/api/auth/token` endpoint (handled by the above route) to get a token for use in API requests.

---

## Environment Variables
- **Hudle API:**
  - `HUDLE_API_EMAIL`: Hudle account email (required)
  - `HUDLE_API_PASSWORD`: Hudle account password (required)
  - `API_SECRET`: Static API secret provided by Hudle (required)
- **Database:**
  - `SUPABASE_PASSWORD`: Your Supabase PostgreSQL database password (required)

## Hudle API Authentication Flow
1. **Login Request**
   - Send a POST request to `/api/auth/token` with:
     - Body: `{ "forceRefresh": false }`
   - The response contains a JWT token if successful.

2. **Token Storage**
   - On the backend, the token is cached in memory (`app.locals.authToken`) with an expiration timestamp.
   - On the client or in scripts, the token can be stored in memory or persisted as needed.

3. **Authenticated Requests**
   - For all subsequent API calls, include:
     - Header: `Authorization: Bearer <token>`
     - Header: `api-secret: <static secret>`
   - The backend automatically refreshes the token if expired.

## Database Authentication
1. **Connection Details**
   - Use the `SUPABASE_PASSWORD` environment variable to authenticate with the Supabase PostgreSQL database.
   - Ensure the database connection is established securely.

2. **Best Practices**
   - Never hardcode database credentials in source files.
   - Use environment variables for sensitive data.
   - Handle database connection errors gracefully.

## Utility Functions
- `getHudleToken(forceRefresh)`: Retrieves a valid JWT token, refreshing if needed.
- `getHudleHeaders()`: Returns headers for authenticated requests, including the token and api-secret.

## Example Usage
```js
import { getHudleToken, getHudleHeaders } from './src/api/hudleAuthUtils.js';
const token = await getHudleToken();
const headers = await getHudleHeaders();
const response = await fetch('https://api.hudle.in/api/v1/user/venues', { headers });
```

## Best Practices
- Never hardcode credentials or tokens in source files.
- Always use environment variables for sensitive data.
- Use the provided utility functions to ensure consistent and secure authentication.
- Handle token expiration and errors gracefully.

## References
- [Hudle API Documentation](https://api.hudle.in/api/v1/login)
- [Supabase Documentation](https://supabase.io/docs) 