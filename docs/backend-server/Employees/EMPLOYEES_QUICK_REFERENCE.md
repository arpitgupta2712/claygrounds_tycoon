# Employee API Quick Reference

## Base URL: `/api/employees`

### Core Employee Operations

| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|-----------------|
| `GET` | `/` | List all employees | - |
| `GET` | `/:employee_id` | Get employee by ID | - |
| `POST` | `/` | Create employee | `company_id`, `employee_name`, `phone` |
| `PUT` | `/:employee_id` | Update employee | - |
| `DELETE` | `/:employee_id` | Delete employee (soft) | - |

### Search Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/search/name/:name` | Search by name/nickname |
| `GET` | `/search/phone/:phone` | Find by phone number |
| `GET` | `/company/:company_id` | Get company employees |

### Access Management

| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|-----------------|
| `POST` | `/:employee_id/access` | Create access | `access_role`, `password` |
| `GET` | `/:employee_id/access` | Get access info | - |
| `PUT` | `/:employee_id/access` | Update access | - |
| `DELETE` | `/:employee_id/access` | Delete access | - |

### Query Parameters (GET /)

- `company_id` - Filter by company
- `employment_status` - Filter by status
- `designation` - Filter by role
- `limit` - Results limit (default: 100)
- `offset` - Pagination offset (default: 0)

### Common Response Format

```json
{
  "success": true,
  "data": { /* employee data */ },
  "message": "Operation completed successfully"
}
```

### Error Responses

- `400` - Bad Request (missing fields, validation errors)
- `404` - Not Found (employee doesn't exist)
- `500` - Server Error (database errors, constraints)

### Employee Fields

**Required:** `company_id`, `employee_name`, `phone`

**Optional:** `nickname`, `salary_package`, `employment_status`, `designation`, `email`, `date_of_joining`, `address`, `city`, `state`, `pan_number`, `conveyance`, `pf_registered`, `salary_bank_account`, `IFSC_code`, `name_on_bank`, `bank_name`, `fathers_name`, `date_of_birth`, `company_billed_to`

### Access Roles

Available roles in `access_role_enum` (check database for current values):
- `admin`
- `manager` 
- `employee`
- `hr_manager`
- (others as defined in enum)

### Testing

Run endpoint tests:
```bash
node src/utils/testEmployeeEndpoints.js
```

### Security Notes

- Passwords are hashed with bcrypt (salt rounds: 10)
- Unique constraints: `phone`, `email`, `pan_number`, `salary_bank_account`
- Soft delete: Sets `employment_status` to 'Terminated'
- Access passwords never returned in responses 