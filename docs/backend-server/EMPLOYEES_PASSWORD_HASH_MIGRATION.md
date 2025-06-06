# Guide: Migrating Plain Text Passwords to Bcrypt Hashes & Implementing Secure Auth Endpoint

## 1. Password Hash Migration

### Why?
Storing plain text passwords is insecure. All passwords must be hashed (e.g., with bcrypt) to protect user data.

### Migration Steps

#### a. Install Dependencies
If you use Node.js, install `bcrypt` and `pg`:
```bash
npm install bcrypt pg
```

#### b. Migration Script Example (Node.js)
This script will:
- Fetch all rows from `employees_access`
- Hash any password that is not already a bcrypt hash
- Update the table with the hashed password

```js
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or your DB config
});

async function isBcryptHash(str) {
  return str.startsWith('$2a$') || str.startsWith('$2b$') || str.startsWith('$2y$');
}

async function migratePasswords() {
  const res = await pool.query('SELECT id, password FROM employees_access');
  for (const row of res.rows) {
    if (await isBcryptHash(row.password)) continue; // Already hashed
    const hash = await bcrypt.hash(row.password, 10);
    await pool.query('UPDATE employees_access SET password = $1 WHERE id = $2', [hash, row.id]);
    console.log(`Updated password for id ${row.id}`);
  }
  console.log('Migration complete.');
  await pool.end();
}

migratePasswords().catch(console.error);
```

#### c. Run the Script
- Set your DB connection string in the environment (or edit the script).
- Run:
```bash
node migratePasswords.js
```
- All plain text passwords will be replaced with bcrypt hashes.

---

## 2. Implementing the `/api/auth/login` Endpoint

### Endpoint
- **POST** `/api/auth/login`
- **Body:** `{ "phone": "<phone>", "password": "<password>" }`

### Steps
1. Find the employee in `employees_access` by phone.
2. Compare the provided password with the stored bcrypt hash.
3. If valid, return a JWT and user info. If not, return an error.

### Example (Node.js/Express)
See the following code:

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

### Integration
- Add this route to your Express app:
  ```js
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  ```
- Set your `JWT_SECRET` in environment variables.

---

## 3. Security Checklist
- All passwords in `employees_access` are bcrypt hashes.
- Never store or log plain text passwords.
- Rate-limit login attempts to prevent brute force.
- Use HTTPS in production.

---

**Follow this guide to migrate passwords and implement secure authentication in your backend.** 