# Employee Management API Documentation

Last Updated: 2025-01-27

## Overview

The Employee Management API provides comprehensive endpoints for managing employees and their access credentials in the Claygrounds system. This includes CRUD operations, search functionality, and access management for employee authentication.

## Base URL
```
/api/employees
```

## Authentication
All endpoints require proper authentication. Include appropriate headers as configured in your application.

---

## Employee Management Endpoints

### 1. Get All Employees

**Endpoint:** `GET /api/employees`

**Description:** Retrieve all employees with optional filtering and pagination.

**Query Parameters:**
- `company_id` (string, optional) - Filter by company ID
- `employment_status` (string, optional) - Filter by employment status
- `designation` (string, optional) - Filter by designation
- `limit` (number, optional) - Limit number of results (default: 100)
- `offset` (number, optional) - Offset for pagination (default: 0)

**Example Request:**
```bash
GET /api/employees?company_id=COMP001&employment_status=Active&limit=50&offset=0
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "employee_id": "123e4567-e89b-12d3-a456-426614174000",
      "company_id": "COMP001",
      "employee_name": "John Doe",
      "nickname": "Johnny",
      "phone": "+1234567890",
      "salary_package": 50000,
      "employment_status": "Active",
      "company_billed_to": "Main Office",
      "fathers_name": "Robert Doe",
      "date_of_birth": "1990-05-15",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "pan_number": "ABCDE1234F",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "date_of_joining": "2024-01-01",
      "designation": "Manager",
      "conveyance": 5000.00,
      "pf_registered": "Yes",
      "salary_bank_account": "1234567890",
      "IFSC_code": "BANK0001234",
      "name_on_bank": "John Doe",
      "bank_name": "Example Bank",
      "email": "john.doe@example.com"
    }
  ],
  "metadata": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "filters": {
      "company_id": "COMP001",
      "employment_status": "Active"
    }
  }
}
```

### 2. Get Employee by ID

**Endpoint:** `GET /api/employees/:employee_id`

**Description:** Retrieve a specific employee by their UUID.

**Path Parameters:**
- `employee_id` (string, required) - Employee UUID

**Example Request:**
```bash
GET /api/employees/123e4567-e89b-12d3-a456-426614174000
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "employee_id": "123e4567-e89b-12d3-a456-426614174000",
    "company_id": "COMP001",
    "employee_name": "John Doe",
    "nickname": "Johnny",
    "phone": "+1234567890",
    "salary_package": 50000,
    "employment_status": "Active",
    "designation": "Manager",
    "email": "john.doe@example.com",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Create New Employee

**Endpoint:** `POST /api/employees`

**Description:** Create a new employee record.

**Required Fields:**
- `company_id` (string) - Company identifier
- `employee_name` (string) - Full name of employee
- `phone` (string) - Phone number (must be unique)

**Optional Fields:**
- `nickname` (string) - Employee nickname
- `salary_package` (integer) - Annual salary package
- `employment_status` (string) - Employment status
- `company_billed_to` (string) - Billing company
- `fathers_name` (string) - Father's name
- `date_of_birth` (date) - Date of birth
- `address` (string) - Address
- `city` (string) - City
- `state` (string) - State
- `pan_number` (string) - PAN number (must be unique)
- `date_of_joining` (date) - Date of joining
- `designation` (string) - Job designation
- `conveyance` (numeric) - Conveyance allowance
- `pf_registered` (string) - PF registration status
- `salary_bank_account` (string) - Bank account number (must be unique)
- `IFSC_code` (string) - Bank IFSC code
- `name_on_bank` (string) - Name on bank account
- `bank_name` (string) - Bank name
- `email` (string) - Email address (must be unique)

**Example Request:**
```bash
POST /api/employees
Content-Type: application/json

{
  "company_id": "COMP001",
  "employee_name": "Jane Smith",
  "nickname": "Jane",
  "phone": "+1987654321",
  "salary_package": 45000,
  "employment_status": "Active",
  "designation": "Developer",
  "email": "jane.smith@example.com",
  "date_of_joining": "2024-02-01",
  "city": "San Francisco",
  "state": "CA"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "employee_id": "456e7890-e89b-12d3-a456-426614174001",
    "company_id": "COMP001",
    "employee_name": "Jane Smith",
    "nickname": "Jane",
    "phone": "+1987654321",
    "salary_package": 45000,
    "employment_status": "Active",
    "designation": "Developer",
    "email": "jane.smith@example.com",
    "created_at": "2024-01-27T15:30:00Z",
    "updated_at": "2024-01-27T15:30:00Z"
  },
  "message": "Employee created successfully"
}
```

### 4. Update Employee

**Endpoint:** `PUT /api/employees/:employee_id`

**Description:** Update an existing employee record.

**Path Parameters:**
- `employee_id` (string, required) - Employee UUID

**Example Request:**
```bash
PUT /api/employees/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "salary_package": 55000,
  "designation": "Senior Manager",
  "employment_status": "Active"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "employee_id": "123e4567-e89b-12d3-a456-426614174000",
    "company_id": "COMP001",
    "employee_name": "John Doe",
    "salary_package": 55000,
    "designation": "Senior Manager",
    "employment_status": "Active",
    "updated_at": "2024-01-27T16:00:00Z"
  },
  "message": "Employee updated successfully"
}
```

### 5. Delete Employee (Soft Delete)

**Endpoint:** `DELETE /api/employees/:employee_id`

**Description:** Soft delete an employee by setting employment_status to 'Terminated'.

**Path Parameters:**
- `employee_id` (string, required) - Employee UUID

**Example Request:**
```bash
DELETE /api/employees/123e4567-e89b-12d3-a456-426614174000
```

**Example Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "employee_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

---

## Search Endpoints

### 6. Search Employees by Name

**Endpoint:** `GET /api/employees/search/name/:name`

**Description:** Search employees by name or nickname (partial match, case-insensitive).

**Path Parameters:**
- `name` (string, required) - Name to search for

**Example Request:**
```bash
GET /api/employees/search/name/john
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "employee_id": "123e4567-e89b-12d3-a456-426614174000",
      "employee_name": "John Doe",
      "nickname": "Johnny",
      "phone": "+1234567890",
      "designation": "Manager",
      "employment_status": "Active"
    }
  ],
  "search_term": "john",
  "count": 1
}
```

### 7. Search Employee by Phone

**Endpoint:** `GET /api/employees/search/phone/:phone`

**Description:** Find employee by exact phone number match.

**Path Parameters:**
- `phone` (string, required) - Phone number to search for

**Example Request:**
```bash
GET /api/employees/search/phone/+1234567890
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "employee_id": "123e4567-e89b-12d3-a456-426614174000",
    "employee_name": "John Doe",
    "phone": "+1234567890",
    "email": "john.doe@example.com",
    "designation": "Manager",
    "employment_status": "Active"
  }
}
```

### 8. Get Employees by Company

**Endpoint:** `GET /api/employees/company/:company_id`

**Description:** Retrieve all employees for a specific company.

**Path Parameters:**
- `company_id` (string, required) - Company ID

**Example Request:**
```bash
GET /api/employees/company/COMP001
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "employee_id": "123e4567-e89b-12d3-a456-426614174000",
      "employee_name": "John Doe",
      "designation": "Manager",
      "employment_status": "Active"
    },
    {
      "employee_id": "456e7890-e89b-12d3-a456-426614174001",
      "employee_name": "Jane Smith",
      "designation": "Developer",
      "employment_status": "Active"
    }
  ],
  "company_id": "COMP001",
  "count": 2
}
```

---

## Employee Access Management Endpoints

### 9. Create Employee Access

**Endpoint:** `POST /api/employees/:employee_id/access`

**Description:** Create access credentials for an employee.

**Path Parameters:**
- `employee_id` (string, required) - Employee UUID

**Required Fields:**
- `access_role` (enum, required) - Access role from access_role_enum
- `password` (string, required) - Plain text password (will be hashed)

**Optional Fields:**
- `phone` (string) - Phone for access (defaults to employee phone)
- `email` (string) - Email for access (defaults to employee email)

**Example Request:**
```bash
POST /api/employees/123e4567-e89b-12d3-a456-426614174000/access
Content-Type: application/json

{
  "access_role": "manager",
  "password": "securePassword123",
  "email": "john.doe@company.com"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": "123e4567-e89b-12d3-a456-426614174000",
    "company_id": "COMP001",
    "phone": "+1234567890",
    "email": "john.doe@company.com",
    "access_role": "manager",
    "created_at": "2024-01-27T16:30:00Z",
    "updated_at": "2024-01-27T16:30:00Z"
  },
  "message": "Employee access created successfully"
}
```

### 10. Get Employee Access

**Endpoint:** `GET /api/employees/:employee_id/access`

**Description:** Retrieve access information for an employee.

**Path Parameters:**
- `employee_id` (string, required) - Employee UUID

**Example Request:**
```bash
GET /api/employees/123e4567-e89b-12d3-a456-426614174000/access
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": "123e4567-e89b-12d3-a456-426614174000",
    "company_id": "COMP001",
    "phone": "+1234567890",
    "email": "john.doe@company.com",
    "access_role": "manager",
    "created_at": "2024-01-27T16:30:00Z",
    "updated_at": "2024-01-27T16:30:00Z"
  }
}
```

### 11. Update Employee Access

**Endpoint:** `PUT /api/employees/:employee_id/access`

**Description:** Update employee access information.

**Path Parameters:**
- `employee_id` (string, required) - Employee UUID

**Example Request:**
```bash
PUT /api/employees/123e4567-e89b-12d3-a456-426614174000/access
Content-Type: application/json

{
  "access_role": "admin",
  "password": "newSecurePassword456"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": "123e4567-e89b-12d3-a456-426614174000",
    "company_id": "COMP001",
    "phone": "+1234567890",
    "email": "john.doe@company.com",
    "access_role": "admin",
    "updated_at": "2024-01-27T17:00:00Z"
  },
  "message": "Employee access updated successfully"
}
```

### 12. Delete Employee Access

**Endpoint:** `DELETE /api/employees/:employee_id/access`

**Description:** Delete employee access credentials.

**Path Parameters:**
- `employee_id` (string, required) - Employee UUID

**Example Request:**
```bash
DELETE /api/employees/123e4567-e89b-12d3-a456-426614174000/access
```

**Example Response:**
```json
{
  "success": true,
  "message": "Employee access deleted successfully",
  "employee_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "error": "Missing required fields",
  "missing_fields": ["company_id", "employee_name"]
}
```

**404 Not Found**
```json
{
  "error": "Employee not found",
  "employee_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to create employee",
  "details": "duplicate key value violates unique constraint \"employees_phone_key\""
}
```

---

## Database Schema Reference

### employees Table
- `employee_id` (uuid, PK) - Auto-generated UUID
- `company_id` (text, unique) - Company identifier
- `employee_name` (text) - Full name
- `nickname` (text, nullable) - Nickname
- `phone` (text, unique) - Phone number
- `salary_package` (integer, nullable) - Annual salary
- `employment_status` (text, nullable) - Employment status
- `company_billed_to` (text, nullable) - Billing company
- `fathers_name` (text, nullable) - Father's name
- `date_of_birth` (date, nullable) - Date of birth
- `address` (text, nullable) - Address
- `city` (text, nullable) - City
- `state` (text, nullable) - State
- `pan_number` (text, unique, nullable) - PAN number
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last update timestamp
- `date_of_joining` (date, nullable) - Joining date
- `designation` (text, nullable) - Job designation
- `conveyance` (numeric, default 0) - Conveyance allowance
- `pf_registered` (text, default 'Yes') - PF registration status
- `salary_bank_account` (text, unique, nullable) - Bank account
- `IFSC_code` (text, nullable) - Bank IFSC code
- `name_on_bank` (text, nullable) - Name on bank account
- `bank_name` (text, nullable) - Bank name
- `email` (text, unique, nullable) - Email address

### employees_access Table
- `id` (serial, PK) - Auto-increment ID
- `employee_id` (uuid, unique, FK) - References employees.employee_id
- `company_id` (text) - Company identifier
- `phone` (text, nullable) - Phone for access
- `email` (text, nullable) - Email for access
- `access_role` (access_role_enum) - Access role
- `password` (text) - Hashed password
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

---

## Usage Examples

### Complete Employee Onboarding Flow

1. **Create Employee**
```bash
POST /api/employees
{
  "company_id": "COMP001",
  "employee_name": "Alice Johnson",
  "phone": "+1555123456",
  "email": "alice.johnson@company.com",
  "designation": "HR Manager",
  "salary_package": 60000,
  "date_of_joining": "2024-02-01"
}
```

2. **Create Access Credentials**
```bash
POST /api/employees/{employee_id}/access
{
  "access_role": "hr_manager",
  "password": "temporaryPassword123"
}
```

3. **Update Employee Information**
```bash
PUT /api/employees/{employee_id}
{
  "address": "456 Oak Street",
  "city": "Boston",
  "state": "MA",
  "bank_name": "First National Bank",
  "salary_bank_account": "9876543210"
}
```

### Employee Search and Management

1. **Search by Name**
```bash
GET /api/employees/search/name/alice
```

2. **Get Company Employees**
```bash
GET /api/employees/company/COMP001
```

3. **Filter Active Employees**
```bash
GET /api/employees?employment_status=Active&limit=25
```

---

## Security Considerations

1. **Password Security**: All passwords are hashed using bcrypt with salt rounds of 10
2. **Unique Constraints**: Phone, email, PAN number, and bank account numbers must be unique
3. **Soft Deletes**: Employee deletion is implemented as soft delete (status change)
4. **Access Control**: Employee access management is separate from employee records
5. **Data Validation**: All required fields are validated before database operations

---

## Performance Notes

1. **Indexes**: The following indexes are available for optimal performance:
   - `idx_employees_company_id` - Company-based queries
   - `idx_employees_employee_name` - Name-based searches
   - `idx_employees_employment_status` - Status filtering
   - `idx_employees_designation` - Designation filtering
   - `idx_employees_date_of_joining` - Date-based queries
   - `idx_employees_company_status` - Composite index for company + status

2. **Pagination**: Use `limit` and `offset` parameters for large datasets
3. **Filtering**: Apply filters at the database level for better performance
4. **Search Optimization**: Name searches use case-insensitive partial matching 