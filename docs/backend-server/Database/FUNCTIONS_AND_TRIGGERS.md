# Database Functions and Triggers

_Last updated: 2025-06-02_

This document lists all triggers and user-defined functions in the database for reference and migration planning.

---

## 1. Triggers (by Table)

| Table Name         | Trigger Name                       |
|--------------------|------------------------------------|
| agreements         | trg_agreements_modified            |
| bookings           | trg_ensure_customer_exists         |
| bookings           | trg_populate_payments_table        |
| bookings           | trg_handle_booking_deletion        |
| bookings           | trg_bookings_modified              |
| bookings           | update_booking_financial_year_trigger |
| hudle_bookings     | update_hudle_bookings_updated_at   |
| equipment          | update_equipment_updated_at         |
| submissions        | trg_populate_location_id           |
| submissions        | trg_populate_employee_name         |
| expenses           | trg_expense_date_to_month_year     |
| expenses           | trg_expense_employee_info          |
| events_payments    | before_events_payments_change      |
| locations          | trg_locations_modified             |
| customers          | trg_customers_modified             |
| employees          | trg_employees_updated_at           |
| licenses           | tr_set_license_number              |
| tasks              | update_task_timestamp              |

---

## 2. User-Defined Functions

| Function Name                      |
|------------------------------------|
| update_task_timestamp              |
| check_materialized_view_freshness  |
| refresh_all_materialized_views     |
| update_updated_at_column           |
| update_location_name               |
| set_license_number                 |
| populate_location_id               |
| update_all_employee_names          |
| fix_payment_statuses               |
| update_booking_financial_year      |
| handle_new_user                    |
| populate_employee_name             |
| check_location_access              |
| get_financial_year                 |
| get_accessible_locations           |
| update_modified_column             |
| ensure_customer_exists             |
| handle_booking_deletion            |
| analyze_index_usage                |
| update_expense_month_year          |
| set_formatted_customer_id          |
| update_employee_name               |
| populate_payment                   |
| log_error                          |
| find_customer_by_phone             |
| generate_new_customer_id           |
| generate_daily_cash_payments_view  |
| check_view_refresh_status          |
| view_usage_statistics              |
| test_rls_policies                  |
| update_agreements_modified_column  |
| get_user_access_level              |
| test_access_levels                 |
| test_access_level_for_user         |
| get_user_locations                 |
| assign_user_locations              |
| assign_user_all_locations          |
| revoke_user_locations              |

---

**How to use:**
- Use this document to quickly reference all triggers and functions in your schema.
- Update this file if you add or change triggers or functions in the schema. 