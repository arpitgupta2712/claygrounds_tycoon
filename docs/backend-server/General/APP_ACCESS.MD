# Employee Authentication System

## Overview

The employee authentication system provides secure access control for the Claygrounds employee portal. It uses JWT (JSON Web Tokens) for session management and Supabase for data storage and authentication.

## Architecture

- **Authentication Method:** Phone number + Password
- **Token Type:** JWT (JSON Web Token)
- **Token Duration:** 8 hours
- **Storage:** Supabase (employees_access and employees tables)
- **Security:** bcrypt password hashing

## API Endpoints

### 1. Employee Login

Authenticates an employee using their phone number and password.

```http
POST /api/employees/auth/login
```

#### Request Body
```json
{
  "phone": "+919876543210",
  "password": "userPassword123"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "employee_id": "uuid",
    "employee_name": "John Doe",
    "access_role": "manager",
    "designation": "Manager"
  }
}
```

#### Error Responses

1. **Missing Credentials (400 Bad Request)**
```json
{
  "success": false,
  "message": "Phone and password required"
}
```

2. **Invalid Credentials (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Invalid phone or password"
}
```

3. **Server Error (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Server error"
}
```

## Authentication Middleware

The system provides two middleware functions for protecting routes:

### 1. Token Authentication

```javascript
import { authenticateToken } from '../utils/authMiddleware.js';

router.get('/protected-route', authenticateToken, (req, res) => {
  // Access user info via req.user
  res.json({ message: 'Protected route', user: req.user });
});
```

### 2. Role-Based Authorization

```javascript
import { authenticateToken, authorizeRole } from '../utils/authMiddleware.js';

router.get('/admin-route', 
  authenticateToken, 
  authorizeRole(['admin', 'manager']), 
  (req, res) => {
    res.json({ message: 'Admin route', user: req.user });
  }
);
```

## Database Schema

### employees_access Table
```sql
CREATE TABLE employees_access (
  employee_id UUID PRIMARY KEY REFERENCES employees(employee_id),
  phone VARCHAR(15) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL, -- bcrypt hash
  access_role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### employees Table
```sql
CREATE TABLE employees (
  employee_id UUID PRIMARY KEY,
  employee_name VARCHAR(100) NOT NULL,
  designation VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

1. **Password Storage**
   - All passwords are hashed using bcrypt
   - Salt rounds: 10
   - Never store plain text passwords

2. **JWT Security**
   - Tokens expire after 8 hours
   - Signed with a strong secret key
   - Contains minimal necessary user information

3. **Rate Limiting**
   - Implement rate limiting on login attempts
   - Suggested: 5 attempts per 15 minutes

4. **Error Messages**
   - Generic error messages to prevent information leakage
   - No distinction between invalid phone or password

## Usage Examples

### 1. Login Request
```bash
curl -X POST http://localhost:3001/api/employees/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "password": "userPassword123"}'
```

### 2. Accessing Protected Routes
```bash
curl http://localhost:3001/api/employees/protected-route \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Role-Based Route Access
```bash
curl http://localhost:3001/api/employees/admin-route \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Environment Variables

Required environment variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret_key
```

## Error Handling

The system handles various error scenarios:

1. **Invalid Token**
   - Returns 403 Forbidden
   - Message: "Invalid token"

2. **Missing Token**
   - Returns 401 Unauthorized
   - Message: "Access denied. No token provided."

3. **Insufficient Permissions**
   - Returns 403 Forbidden
   - Message: "Access denied. Insufficient permissions."

## Best Practices

1. **Token Management**
   - Store tokens securely (e.g., HttpOnly cookies)
   - Implement token refresh mechanism
   - Clear tokens on logout

2. **Password Requirements**
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, and special characters
   - Regular password rotation

3. **Security Headers**
   - Use HTTPS only
   - Implement CORS properly
   - Set appropriate security headers

4. **Monitoring**
   - Log authentication attempts
   - Monitor for suspicious activities
   - Regular security audits

## Future Improvements

1. **Additional Features**
   - Password reset functionality
   - Two-factor authentication
   - Session management
   - Token refresh endpoint

2. **Security Enhancements**
   - IP-based rate limiting
   - Device fingerprinting
   - Login attempt tracking
   - Account lockout mechanism

---

_Last updated: June 2025_ 