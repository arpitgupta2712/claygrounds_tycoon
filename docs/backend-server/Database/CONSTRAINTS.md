# Database Constraints

_Last updated: 2025-06-02_

## 1. Primary Key Constraints

See [KEYS_AND_RELATIONSHIPS.md](./KEYS_AND_RELATIONSHIPS.md) for a full list of primary keys for each table.

## 2. Unique Constraints

| Table Name           | Unique Constraint / Index Name           | Column(s)                |
|----------------------|------------------------------------------|--------------------------|
| bookings             | bookings_booking_reference_key           | booking_reference        |
| bookings_payments    | payments_booking_id_key                  | booking_id               |
| customers_claygrounds| customers_claygrounds_customer_phone_key | customer_phone           |
| employees            | employees_company_id_key                 | company_id               |
| employees            | employees_email_key                      | email                    |
| employees            | employees_pan_number_key                 | pan_number               |
| employees            | employees_phone_key                      | phone                    |
| employees            | employees_salary_bank_account_key        | salary_bank_account      |
| hudle_bookings       | hudle_bookings_booking_reference_key     | booking_reference        |
| licenses             | licenses_license_number_key              | license_number           |
| locations            | locations_location_manager_id_key        | location_manager_id      |
| locations            | locations_location_name_key              | location_name            |
| locations_hudle      | locations_hudle_hudle_location_id_key    | hudle_location_id        |
| regions              | regions_region_name_key                  | region_name              |

## 3. Foreign Key Constraints

See [KEYS_AND_RELATIONSHIPS.md](./KEYS_AND_RELATIONSHIPS.md) for a full list of foreign key relationships.

## 4. Check Constraints

*No explicit check constraints documented in the current schema export. Add here if/when they are defined in the database.*

---

**How to use:**
- Use this document to quickly reference all unique and check constraints in your schema.
- Update this file if you add or change constraints in the schema. 