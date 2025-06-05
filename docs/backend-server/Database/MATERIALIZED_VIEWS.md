# Database Materialized Views

_Last updated: 2025-06-02_

This document lists all materialized views in the database, their purpose, and their SQL definitions for reference.

---

## 1. mv_sport_base_metrics
**Purpose:**
Aggregates booking and payment metrics by location and sport, including total bookings, unique customers, payment breakdowns, and cancellations.

**SQL Definition:**
```sql
SELECT b.location_id,
    l.location_name,
    b.sport,
    count(b.booking_id) AS total_bookings,
    count(DISTINCT b.phone) AS unique_customers,
    count(
        CASE
            WHEN (b.source = 'Online'::text) THEN 1
            ELSE NULL::integer
        END) AS online_bookings,
    count(
        CASE
            WHEN ((b.source <> 'Online'::text) OR (b.source IS NULL)) THEN 1
            ELSE NULL::integer
        END) AS offline_bookings,
    sum(p.total_paid) AS total_paid,
    round(avg(p.total_paid), 0) AS avg_booking_value,
    sum(p.cash_amount) AS cash_payment,
    sum((p.bank_amount + p.hudle_amount)) AS digital_payment,
    sum(
        CASE
            WHEN (b.status = 'Cancelled'::text) THEN 1
            ELSE 0
        END) AS cancelled_bookings
FROM ((bookings b
  JOIN bookings_payments p ON ((b.booking_id = p.booking_id)))
  JOIN locations l ON ((b.location_id = l.location_id)))
WHERE (b.sport IS NOT NULL)
GROUP BY b.location_id, l.location_name, b.sport;
```

---

## 2. mv_sport_preferred_times
**Purpose:**
Finds the most common booking weekday and time for each sport at each location.

**SQL Definition:**
```sql
SELECT b.location_id,
    l.location_name,
    b.sport,
    mode() WITHIN GROUP (ORDER BY (EXTRACT(dow FROM b.slot_date))) FILTER (WHERE ((EXTRACT(dow FROM b.slot_date) >= (1)::numeric) AND (EXTRACT(dow FROM b.slot_date) <= (5)::numeric))) AS preferred_weekday_number,
    to_char((mode() WITHIN GROUP (ORDER BY b.slot_date) FILTER (WHERE ((EXTRACT(dow FROM b.slot_date) >= (1)::numeric) AND (EXTRACT(dow FROM b.slot_date) <= (5)::numeric))))::timestamp with time zone, 'Day'::text) AS preferred_weekday,
    to_char((mode() WITHIN GROUP (ORDER BY b.slot_time))::interval, 'HH12:MI AM'::text) AS preferred_time_formatted
FROM (bookings b
  JOIN locations l ON ((b.location_id = l.location_id)))
WHERE (b.sport IS NOT NULL)
GROUP BY b.location_id, l.location_name, b.sport;
```

---

## 3. mv_financial_year_summary
**Purpose:**
Summarizes bookings, customers, and payment totals by financial year, location, and sport.

**SQL Definition:**
```sql
SELECT p.financial_year,
    l.location_id,
    l.location_name,
    b.sport,
    count(DISTINCT b.booking_id) AS total_bookings,
    count(DISTINCT b.phone) AS unique_customers,
    sum(p.total_paid) AS total_collections,
    sum(p.cash_amount) AS cash_collections,
    sum(p.bank_amount) AS bank_collections,
    sum(p.hudle_amount) AS hudle_collections,
    round(avg(p.total_paid), 2) AS avg_collection_per_booking,
    sum(
        CASE
            WHEN (p.balance > (0)::numeric) THEN 1
            ELSE 0
        END) AS outstanding_bookings,
    sum(p.balance) AS total_outstanding_amount,
    round(((sum(p.balance) * 100.0) / NULLIF(sum((p.total_paid + p.balance)), (0)::numeric)), 2) AS outstanding_percentage
FROM ((bookings_payments p
  JOIN bookings b ON ((p.booking_id = b.booking_id)))
  JOIN locations l ON ((b.location_id = l.location_id)))
GROUP BY p.financial_year, l.location_id, l.location_name, b.sport;
```

---

## 4. mv_monthly_payment_summary
**Purpose:**
Summarizes monthly payment and booking metrics by location and sport.

**SQL Definition:**
```sql
SELECT p.financial_year,
    p.month,
    EXTRACT(month FROM to_date(p.month, 'Month'::text)) AS month_number,
    l.location_id,
    l.location_name,
    count(DISTINCT b.booking_id) AS total_bookings,
    sum(p.total_paid) AS total_collections,
    sum(p.cash_amount) AS cash_collections,
    sum(p.bank_amount) AS bank_collections,
    sum(p.hudle_amount) AS hudle_collections,
    round(avg(p.total_paid), 2) AS avg_collection_per_booking,
    round(((sum(p.cash_amount) * 100.0) / NULLIF(sum(p.total_paid), (0)::numeric)), 2) AS cash_percentage,
    round(((sum(p.bank_amount) * 100.0) / NULLIF(sum(p.total_paid), (0)::numeric)), 2) AS bank_percentage,
    round(((sum(p.hudle_amount) * 100.0) / NULLIF(sum(p.total_paid), (0)::numeric)), 2) AS hudle_percentage,
    sum(
        CASE
            WHEN (p.balance > (0)::numeric) THEN 1
            ELSE 0
        END) AS outstanding_bookings,
    sum(p.balance) AS total_outstanding_amount,
    round(((sum(p.balance) * 100.0) / NULLIF(sum((p.total_paid + p.balance)), (0)::numeric)), 2) AS outstanding_percentage
FROM ((bookings_payments p
  JOIN bookings b ON ((p.booking_id = b.booking_id)))
  JOIN locations l ON ((b.location_id = l.location_id)))
GROUP BY p.financial_year, p.month, l.location_id, l.location_name;
```

---

## 5. mv_sport_time_distribution
**Purpose:**
Calculates the percentage of bookings for each sport at each location by time of day (morning, afternoon, evening, night, late night).

**SQL Definition:**
```sql
SELECT b.location_id,
    l.location_name,
    b.sport,
    round((((count(
        CASE
            WHEN ((b.slot_time >= '05:00:00'::time without time zone) AND (b.slot_time < '11:00:00'::time without time zone)) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (NULLIF(count(*), 0))::numeric), 1) AS morning_percentage,
    round((((count(
        CASE
            WHEN ((b.slot_time >= '11:00:00'::time without time zone) AND (b.slot_time < '17:00:00'::time without time zone)) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (NULLIF(count(*), 0))::numeric), 1) AS afternoon_percentage,
    round((((count(
        CASE
            WHEN ((b.slot_time >= '17:00:00'::time without time zone) AND (b.slot_time < '20:00:00'::time without time zone)) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (NULLIF(count(*), 0))::numeric), 1) AS evening_percentage,
    round((((count(
        CASE
            WHEN ((b.slot_time >= '20:00:00'::time without time zone) AND (b.slot_time < '23:00:00'::time without time zone)) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (NULLIF(count(*), 0))::numeric), 1) AS night_percentage,
    round((((count(
        CASE
            WHEN ((b.slot_time >= '23:00:00'::time without time zone) OR (b.slot_time < '05:00:00'::time without time zone)) THEN 1
            ELSE NULL::integer
        END))::numeric * 100.0) / (NULLIF(count(*), 0))::numeric), 1) AS late_night_percentage
FROM (bookings b
  JOIN locations l ON ((b.location_id = l.location_id)))
WHERE (b.sport IS NOT NULL)
GROUP BY b.location_id, l.location_name, b.sport;
```

---

## 6. mv_payment_method_analysis
**Purpose:**
Analyzes payment methods and booking counts by financial year, location, and sport.

**SQL Definition:**
```sql
SELECT p.financial_year,
    l.location_id,
    l.location_name,
    b.sport,
    count(DISTINCT b.booking_id) AS total_bookings,
    sum(p.total_paid) AS total_collections,
    sum(p.cash_amount) AS cash_collections,
    sum(p.bank_amount) AS bank_collections,
    sum(p.hudle_amount) AS hudle_collections,
    round(avg(p.total_paid), 2) AS avg_collection_per_booking,
    round(((sum(p.cash_amount) * 100.0) / NULLIF(sum(p.total_paid), (0)::numeric)), 2) AS cash_percentage,
    round(((sum(p.bank_amount) * 100.0) / NULLIF(sum(p.total_paid), (0)::numeric)), 2) AS bank_percentage,
    round(((sum(p.hudle_amount) * 100.0) / NULLIF(sum(p.total_paid), (0)::numeric)), 2) AS hudle_percentage,
    count(DISTINCT
        CASE
            WHEN (p.cash_amount > (0)::numeric) THEN b.booking_id
            ELSE NULL::uuid
        END) AS cash_booking_count,
    count(DISTINCT
        CASE
            WHEN (p.bank_amount > (0)::numeric) THEN b.booking_id
            ELSE NULL::uuid
        END) AS bank_booking_count,
    count(DISTINCT
        CASE
            WHEN (p.hudle_amount > (0)::numeric) THEN b.booking_id
            ELSE NULL::uuid
        END) AS hudle_booking_count,
    round(avg(
        CASE
            WHEN (p.cash_amount > (0)::numeric) THEN p.cash_amount
            ELSE NULL::numeric
        END), 2) AS avg_cash_amount,
    round(avg(
        CASE
            WHEN (p.bank_amount > (0)::numeric) THEN p.bank_amount
            ELSE NULL::numeric
        END), 2) AS avg_bank_amount,
    round(avg(
        CASE
            WHEN (p.hudle_amount > (0)::numeric) THEN p.hudle_amount
            ELSE NULL::numeric
        END), 2) AS avg_hudle_amount
FROM ((bookings_payments p
  JOIN bookings b ON ((p.booking_id = b.booking_id)))
  JOIN locations l ON ((b.location_id = l.location_id)))
GROUP BY p.financial_year, l.location_id, l.location_name, b.sport;
```

---

## 7. mv_monthly_cash_collection
**Purpose:**
Tracks daily cash collections by location, with breakdowns for each venue and financial year.

**SQL Definition:**
```sql
WITH date_series AS (
    SELECT (date_day.date_day)::date AS payment_date,
           CASE
               WHEN (EXTRACT(month FROM date_day.date_day) >= (4)::numeric) THEN (((EXTRACT(year FROM date_day.date_day))::text || '-'::text) || ((EXTRACT(year FROM date_day.date_day) + (1)::numeric))::text)
               ELSE ((((EXTRACT(year FROM date_day.date_day) - (1)::numeric))::text || '-'::text) || (EXTRACT(year FROM date_day.date_day))::text)
           END AS financial_year,
        to_char(date_day.date_day, 'Day'::text) AS day_name,
        to_char(date_day.date_day, 'DD-Mon-YYYY'::text) AS formatted_date,
        EXTRACT(dow FROM date_day.date_day) AS day_of_week
      FROM generate_series(('2023-04-01'::date)::timestamp with time zone, ('2025-03-31'::date)::timestamp with time zone, '1 day'::interval) date_day(date_day)
), cash_payments AS (
    SELECT p.slot_date AS payment_date,
        p.financial_year,
        p.location_id,
        sum(p.cash_amount) AS cash_collected
      FROM bookings_payments p
     WHERE (p.cash_amount > (0)::numeric)
     GROUP BY p.slot_date, p.financial_year, p.location_id
)
SELECT ds.payment_date,
    ds.financial_year,
    ds.day_name,
    ds.formatted_date,
    ds.day_of_week,
    COALESCE(sum(cp.cash_collected), (0)::numeric) AS total_cash_collection,
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = 'd89bf7a4-5981-4012-8431-8f5d73e57351'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Orchids",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = 'e5438e14-eef5-4ef7-8d40-2893200604b0'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "AB Plaza",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '122e3970-a809-474e-9078-fd491771eb10'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Defence Colony",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '06bba2ef-9323-44c6-ae41-8a9276f82efb'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Pioneer",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '005796f6-f3ca-4608-8f92-39ac88fc942a'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Pitampur",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = 'c93ca4dc-78df-42bb-9aec-11ee4ac2e541'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Noida 122",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '23484553-2add-4835-96e3-75f70bb419a6'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Faridabad 11",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '9a950072-9f8d-44c2-ad31-9b778e29f71c'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Naraina",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = 'f3f48654-de20-4d05-a528-7bad4c7125fa'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Ghitorni",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '9487f2b4-80ad-4179-803a-297905bfc3fa'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Charmwood",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = 'a184ae23-d099-4e97-afa5-bbf4dc87bd4c'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Vasant Vihar",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '2eb223fa-f9f5-4f64-a73c-40986bb91442'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Chattarpur",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = 'd40dba96-8e55-487e-b0ef-e0d2f738bdc6'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Rajouri",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = 'bffe005c-32d8-4608-a9fb-a2a89230daa2'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Vasant Kunj",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '26621a5f-1461-488e-b96c-770a70c4d14c'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Omaxe WS",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '9195bf56-b333-4632-9cde-c1f9e28195f9'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Karkardooma",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = 'a391f6a1-b7ef-4e9b-a3eb-c1ff35e625f7'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Anand Vihar",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '81b6978e-1eed-4cd5-8bbc-29054b15cce2'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "DLF 3",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '3bf8a8c0-db91-41db-9777-1f670d83ef27'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "Lajpat Nagar",
    COALESCE(sum(
        CASE
            WHEN (cp.location_id = '29782c27-2f1b-4da4-85f7-f166307f9049'::text) THEN cp.cash_collected
            ELSE (0)::numeric
        END), (0)::numeric) AS "IMS Noida"
FROM (date_series ds
  LEFT JOIN cash_payments cp ON ((ds.payment_date = cp.payment_date)))
GROUP BY ds.payment_date, ds.financial_year, ds.day_name, ds.formatted_date, ds.day_of_week
ORDER BY ds.payment_date DESC;
```

---

**How to use:**
- Use this document to understand the available materialized views and their logic.
- Update this file if you add or change materialized views in the schema. 