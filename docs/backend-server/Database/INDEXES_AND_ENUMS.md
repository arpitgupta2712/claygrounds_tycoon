# Database Indexes and Enums

_Last updated: 2025-06-02_

## 1. Indexes

| Table Name           | Index Name                              | Column(s)                        | Unique | Primary |
|----------------------|-----------------------------------------|-----------------------------------|--------|---------|
| agreements           | agreements_pkey                         | agreement_id                      | Yes    | Yes     |
| agreements           | idx_agreements_agreement_status         | agreement_status                  | No     | No      |
| agreements           | idx_agreements_location_id              | location_id                       | No     | No      |
| agreements           | idx_agreements_location_name            | location_name                     | No     | No      |
| agreements           | idx_agreements_operational_status       | operational_status                | No     | No      |
| bookings             | bookings_booking_reference_key           | booking_reference                 | Yes    | No      |
| bookings             | bookings_pkey                           | booking_id                        | Yes    | Yes     |
| bookings             | idx_bookings_active                     | slot_date, location_id            | No     | No      |
| bookings             | idx_bookings_date                       | slot_date                         | No     | No      |
| bookings             | idx_bookings_location_date              | location_id, slot_date            | No     | No      |
| bookings             | idx_bookings_location_date_status       | slot_date, location_id, status    | No     | No      |
| bookings             | idx_bookings_phone                      | phone                             | No     | No      |
| bookings             | idx_bookings_sport                      | sport                             | No     | No      |
| bookings             | idx_bookings_status                     | status                            | No     | No      |
| bookings_payments    | idx_payments_booking_id                 | booking_id                        | No     | No      |
| bookings_payments    | idx_payments_booking_reference          | booking_reference                 | No     | No      |
| bookings_payments    | idx_payments_completed                  | location_id, slot_date            | No     | No      |
| bookings_payments    | idx_payments_date                       | slot_date                         | No     | No      |
| bookings_payments    | idx_payments_financial_year             | financial_year, month             | No     | No      |
| bookings_payments    | idx_payments_location_date_status       | slot_date, location_id, payment_status | No | No      |
| bookings_payments    | idx_payments_location_id                | location_id                       | No     | No      |
| bookings_payments    | payments_booking_id_key                 | booking_id                        | Yes    | No      |
| bookings_payments    | payments_pkey                           | payment_id                        | Yes    | Yes     |
| customers            | customers_pkey                          | customer_id                       | Yes    | Yes     |
| customers            | idx_customers_phone                     | phone                             | No     | No      |
| customers_claygrounds| customers_claygrounds_customer_phone_key| customer_phone                    | Yes    | No      |
| customers_claygrounds| customers_claygrounds_pkey              | customer_id                       | Yes    | Yes     |
| customers_claygrounds| idx_customer_email                      | customer_email                    | No     | No      |
| customers_claygrounds| idx_last_booking_date                   | last_booking_date                 | No     | No      |
| customers_claygrounds| idx_last_booking_location               | last_booking_location_id          | No     | No      |
| customers_claygrounds| idx_preferred_booking_source            | preferred_booking_source          | No     | No      |
| customers_claygrounds| idx_preferred_location                  | preferred_location_id             | No     | No      |
| employees            | employees_company_id_key                | company_id                        | Yes    | No      |
| employees            | employees_email_key                     | email                             | Yes    | No      |
| employees            | employees_pan_number_key                | pan_number                        | Yes    | No      |
| employees            | employees_phone_key                     | phone                             | Yes    | No      |
| employees            | employees_pkey                          | employee_id                       | Yes    | Yes     |
| employees            | employees_salary_bank_account_key       | salary_bank_account               | Yes    | No      |
| employees            | idx_employees_company_id                | company_id                        | No     | No      |
| employees            | idx_employees_company_status            | employment_status, company_id     | No     | No      |
| employees            | idx_employees_date_of_joining           | date_of_joining                   | No     | No      |
| employees            | idx_employees_designation               | designation                       | No     | No      |
| employees            | idx_employees_employee_name             | employee_name                     | No     | No      |
| employees            | idx_employees_employment_status         | employment_status                 | No     | No      |
| equipment            | equipment_pkey                          | id                                | Yes    | Yes     |
| equipment            | idx_equipment_category                  | category                          | No     | No      |
| equipment            | idx_equipment_status                    | status                            | No     | No      |
| error_log            | error_log_pkey                          | error_id                          | Yes    | Yes     |
| error_log            | idx_error_log_process                   | process_name                      | No     | No      |
| error_log            | idx_error_log_record_id                 | record_id                         | No     | No      |
| error_log            | idx_error_log_timestamp                 | error_timestamp                   | No     | No      |
| events_payments      | idx_events_payments_balance             | balance                           | No     | No      |
| events_payments      | idx_events_payments_event_customer      | event_name, customer_phone        | No     | No      |
| events_payments      | idx_events_payments_location_id         | location_id                       | No     | No      |
| events_payments      | idx_events_payments_time_period         | year_of_event, month_of_event     | No     | No      |
| expenses             | expenses_pkey                           | expense_id                        | Yes    | Yes     |
| expenses             | idx_expenses_location_name              | location_name                     | No     | No      |
| expenses             | idx_expenses_month                      | month_of_expense                  | No     | No      |
| expenses             | idx_expenses_year                       | year_of_expense                   | No     | No      |
| hudle_bookings       | hudle_bookings_booking_reference_key    | booking_reference                 | Yes    | No      |
| hudle_bookings       | hudle_bookings_pkey                     | booking_id                        | Yes    | Yes     |
| hudle_bookings       | idx_financial_year                      | financial_year                    | No     | No      |
| hudle_bookings       | idx_location_id                         | location_id                       | No     | No      |
| hudle_bookings       | idx_slot_date                           | slot_date                         | No     | No      |
| licenses             | idx_licenses_location_id                | location_id                       | No     | No      |
| licenses             | licenses_license_number_key              | license_number                    | Yes    | No      |
| licenses             | licenses_pkey                           | license_id                        | Yes    | Yes     |
| licenses_payments    | licenses_payments_pkey                  | payment_id                        | Yes    | Yes     |
| location_branding    | location_branding_pkey                  | location_id                       | Yes    | Yes     |
| locations            | locations_location_manager_id_key        | location_manager_id               | Yes    | No      |
| locations            | locations_location_name_key              | location_name                     | Yes    | No      |
| locations            | locations_pkey                          | location_id                       | Yes    | Yes     |
| locations_hudle      | idx_city                                | city                              | No     | No      |
| locations_hudle      | idx_city_id                             | city_id                           | No     | No      |
| locations_hudle      | idx_hudle_location_id                   | hudle_location_id                 | No     | No      |
| locations_hudle      | idx_opening_date_desc                    | opening_date                      | No     | No      |
| locations_hudle      | idx_state                               | state                             | No     | No      |
| locations_hudle      | locations_hudle_hudle_location_id_key   | hudle_location_id                 | Yes    | No      |
| locations_hudle      | locations_hudle_pkey                    | id                                | Yes    | Yes     |
| materialized_view_refreshes | materialized_view_refreshes_pkey   | view_name                         | Yes    | Yes     |
| regions              | regions_pkey                            | region_id                         | Yes    | Yes     |
| regions              | regions_region_name_key                 | region_name                       | Yes    | No      |
| submissions          | idx_submissions_location_id              | location_id                       | No     | No      |
| submissions          | submissions_pkey                        | submission_id                     | Yes    | Yes     |
| tasks                | idx_tasks_assigned_to                   | assigned_to                       | No     | No      |
| tasks                | idx_tasks_deadline                      | deadline                          | No     | No      |
| tasks                | idx_tasks_priority                      | priority                          | No     | No      |
| tasks                | idx_tasks_status                        | status                            | No     | No      |
| tasks                | idx_tasks_status_deadline               | status, deadline                  | No     | No      |
| tasks                | idx_tasks_status_priority               | status, priority                  | No     | No      |
| tasks                | tasks_pkey                              | id                                | Yes    | Yes     |

## 2. Custom Types & Enums

| Schema  | Type              | Enum Value         |
|---------|-------------------|-------------------|
| public  | locations_name    | AB Plaza          |
| public  | locations_name    | Anand Vihar       |
| public  | locations_name    | Charmwood         |
| public  | locations_name    | Chattarpur        |
| public  | locations_name    | DLF 3             |
| public  | locations_name    | Defence Colony    |
| public  | locations_name    | Faridabad 11      |
| public  | locations_name    | Ghitorni          |
| public  | locations_name    | HeadQuarters      |
| public  | locations_name    | IMS Noida         |
| public  | locations_name    | Karkardooma       |
| public  | locations_name    | Lajpat Nagar      |
| public  | locations_name    | Naraina           |
| public  | locations_name    | Noida 122         |
| public  | locations_name    | Omaxe WS          |
| public  | locations_name    | Orchids           |
| public  | locations_name    | Pioneer           |
| public  | locations_name    | Pitampura         |
| public  | locations_name    | Rajouri           |
| public  | locations_name    | Vasant Kunj       |
| public  | locations_name    | Vasant Vihar      |
| public  | management        | Managed           |
| public  | management        | Outsourced        |
| public  | management        | Owned             |
| public  | months            | April             |
| public  | months            | August            |
| public  | months            | December          |
| public  | months            | February          |
| public  | months            | January           |
| public  | months            | July              |
| public  | months            | June              |
| public  | months            | March             |
| public  | months            | May               |
| public  | months            | November          |
| public  | months            | October           |
| public  | months            | September         |
| public  | task_priority     | high              |
| public  | task_priority     | low               |
| public  | task_priority     | medium            |
| public  | task_status       | completed         |
| public  | task_status       | in progress       |
| public  | task_status       | overdue           |
| public  | task_status       | pending           |
| public  | years             | 2023              |
| public  | years             | 2024              |
| public  | years             | 2025              |

---

**How to use:**
- Use this document to quickly reference all indexes and custom types/enums in your schema.
- Update this file if you add or change indexes or enums in the schema. 