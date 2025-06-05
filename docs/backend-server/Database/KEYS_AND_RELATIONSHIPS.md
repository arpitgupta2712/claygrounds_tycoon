# Database Keys and Relationships

_Last updated: 2025-06-02_

## 1. Primary Keys

| Table Name                  | Primary Key Column   |
|----------------------------|---------------------|
| agreements                  | agreement_id        |
| bookings                    | booking_id          |
| bookings_payments           | payment_id          |
| customers                   | customer_id         |
| customers_claygrounds       | customer_id         |
| employees                   | employee_id         |
| equipment                   | id                  |
| error_log                   | error_id            |
| expenses                    | expense_id          |
| hudle_bookings              | booking_id          |
| licenses                    | license_id          |
| licenses_payments           | payment_id          |
| location_branding           | location_id         |
| locations                   | location_id         |
| locations_hudle             | id                  |
| materialized_view_refreshes | view_name           |
| regions                     | region_id           |
| submissions                 | submission_id       |
| tasks                       | id                  |

## 2. Foreign Key Relationships

| Table Name            | Foreign Key Column     | References Table   | References Column   |
|----------------------|-----------------------|-------------------|--------------------|
| bookings_payments    | booking_id            | bookings          | booking_id         |
| bookings_payments    | customer_id           | customers         | customer_id        |
| customers_claygrounds| preferred_location_id | locations         | location_id        |
| expenses             | location_name         | locations         | location_name      |
| licenses             | location_id           | locations         | location_id        |
| licenses_payments    | license_number        | licenses          | license_number     |
| location_branding    | location_id           | locations         | location_id        |
| locations            | location_manager_id   | employees         | employee_id        |
| locations            | region_id             | regions           | region_id          |
| regions              | region_manager        | employees         | employee_id        |
| submissions          | location_id           | locations         | location_id        |
| tasks                | assigned_to           | employees         | employee_id        |

---

**How to use:**
- Use this document as a reference for understanding table relationships and for planning migrations, queries, and data integrity checks.
- Update this file if you add or change keys/relationships in the schema. 