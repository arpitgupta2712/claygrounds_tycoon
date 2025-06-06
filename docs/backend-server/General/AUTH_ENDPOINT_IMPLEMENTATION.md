# Implementation Guide: /api/auth/login Endpoint

## Overview
This document describes how to implement a secure authentication endpoint for employee login using phone number and password. The endpoint verifies credentials against the `employees_access` table and returns a JWT token and user info on success.

---

## Endpoint Details
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "phone": "+919876543210",
    "password": "userPassword123"
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN_HERE",
    "user": {
      "employee_id": "uuid",
      "employee_name": "John Doe",
      "access_role": "manager",
      "designation": "Manager"
    }
  }
  ```
- **Failure Response:**
  ```json
  {
    "success": false,
    "message": "Invalid phone or password"
  }
  ```

---

## Backend Implementation (Node.js/Express Example)

### 1. Dependencies
- `express`
- `pg` (node-postgres)
- `bcrypt`
- `jsonwebtoken`

### 2. Example Route
```js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ success: false, message: 'Phone and password required' });
  }
  try {
    const result = await pool.query(
      `SELECT ea.*, e.employee_name, e.designation FROM employees_access ea JOIN employees e ON ea.employee_id = e.employee_id WHERE ea.phone = $1`,
      [phone]
    );
    const access = result.rows[0];
    if (!access) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password' });
    }
    const match = await bcrypt.compare(password, access.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password' });
    }
    const token = jwt.sign(
      {
        employee_id: access.employee_id,
        access_role: access.access_role,
        employee_name: access.employee_name,
        designation: access.designation
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      success: true,
      token,
      user: {
        employee_id: access.employee_id,
        employee_name: access.employee_name,
        access_role: access.access_role,
        designation: access.designation
      }
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
```

### 3. Integration
- Add this route to your Express app:
  ```js
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  ```
- Set your `JWT_SECRET` in environment variables.

---

## Security Notes
- All passwords in `employees_access` must be bcrypt hashes (see password migration guide).
- Never store or log plain text passwords.
- Always use HTTPS in production.
- Rate-limit login attempts to prevent brute force attacks.
- JWT tokens should be signed with a strong secret and have an expiration (e.g., 8 hours).

---

## Testing
- Test with valid and invalid phone/password combinations.
- Ensure error messages do not reveal whether the phone or password was incorrect.
- Confirm the returned JWT can be decoded and contains the correct user info.

---

**This endpoint enables secure, modern authentication for your employee portal.** 