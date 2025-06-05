# Database Schema Documentation

Last Updated: 2025-06-02T15:24:42.237Z

## Tables


### locations

#### Columns
- s_no
- location_name
- location_id
- city
- state
- address
- pin_code
- property_type
- opening_date
- created_at
- updated_at
- nickname
- operational_status
- google_business_name
- hudle_name
- location_manager_id
- region_id
- management_status

#### Constraints
- No constraints found

#### Sample Data
```json
{
  "s_no": 5,
  "location_name": "Faridabad 11",
  "location_id": "23484553-2add-4835-96e3-75f70bb419a6",
  "city": "Faridabad",
  "state": "Haryana",
  "address": null,
  "pin_code": null,
  "property_type": "Farm Land",
  "opening_date": "2021-06-30",
  "created_at": "2025-03-18T17:09:28.340366+00:00",
  "updated_at": "2025-05-24T10:58:55.403188+00:00",
  "nickname": "Nagar Farm & Banquets",
  "operational_status": "Active",
  "google_business_name": "ClayGrounds Arena | Faridabad",
  "hudle_name": "ClayGrounds Arena | Faridabad",
  "location_manager_id": "938fe455-5ddc-479e-b39d-47cc05b6ef86",
  "region_id": "327997a2-ad1e-4fb4-8377-c55d2596b891",
  "management_status": "Owned"
}
```


### bookings

#### Columns
- booking_id
- booking_reference
- location_id
- slot_date
- slot_time
- number_of_slots
- slot_details
- slot_price
- sport
- status
- source
- facility
- venue_discount
- cash
- upi
- bank_transfer
- hudle_app
- hudle_qr
- hudle_wallet
- venue_wallet
- hudle_pass
- hudle_discount
- customer_name
- phone
- created_at
- updated_at
- financial_year

#### Constraints
- No constraints found

#### Sample Data
```json
{
  "booking_id": "06ec83a3-1be3-483d-a12e-9f7660fb89f0",
  "booking_reference": "HUD2505780216",
  "location_id": "122e3970-a809-474e-9078-fd491771eb10",
  "slot_date": "2023-04-01",
  "slot_time": "00:00:00",
  "number_of_slots": 2,
  "slot_details": "Apr 1, 2023 12:00 AM - 12:30 AM, 12:30 AM - 01:00 AM",
  "slot_price": 1500,
  "sport": "Football",
  "status": "Confirmed",
  "source": "Offline",
  "facility": "Turf - 5v5",
  "venue_discount": 0,
  "cash": 3000,
  "upi": 0,
  "bank_transfer": 0,
  "hudle_app": 0,
  "hudle_qr": 0,
  "hudle_wallet": 0,
  "venue_wallet": 0,
  "hudle_pass": 0,
  "hudle_discount": 0,
  "customer_name": "Nadeem",
  "phone": "9319763147",
  "created_at": "2025-03-28T07:44:45.130311+00:00",
  "updated_at": "2025-04-02T08:24:20.042561+00:00",
  "financial_year": "2023-2024"
}
```


### bookings_payments

#### Columns
- payment_id
- booking_id
- slot_date
- slot_time
- month
- year
- financial_year
- location_id
- location_name
- cash_amount
- bank_amount
- hudle_amount
- venue_discount_amount
- total_paid
- revenue
- balance
- payment_status
- created_at
- updated_at
- booking_reference
- customer_id

#### Constraints
- No constraints found

#### Sample Data
```json
{
  "payment_id": "4b0c8b5b-4339-40f2-8761-27a6c5bdcb00",
  "booking_id": "84835861-e309-4c9e-bf57-cbc88305c7de",
  "slot_date": "2025-03-16",
  "slot_time": "19:00:00",
  "month": "March",
  "year": 2025,
  "financial_year": "2024-2025",
  "location_id": "23484553-2add-4835-96e3-75f70bb419a6",
  "location_name": "Faridabad 11",
  "cash_amount": 0,
  "bank_amount": 3600,
  "hudle_amount": 0,
  "venue_discount_amount": 1200,
  "total_paid": 3600,
  "revenue": 4800,
  "balance": 0,
  "payment_status": "Paid",
  "created_at": "2025-04-03T19:20:52.755845+00:00",
  "updated_at": "2025-05-14T10:40:51.939523+00:00",
  "booking_reference": "HUD1763388333",
  "customer_id": "5a224be9-3a03-4fcd-94ad-f68a61455fde"
}
```


### customers

#### Columns
- customer_name
- phone
- email
- registration_date
- created_at
- updated_at
- customer_id

#### Constraints
- No constraints found

#### Sample Data
```json
{
  "customer_name": "Arpit Gupta",
  "phone": "9910545678",
  "email": null,
  "registration_date": "2025-03-18",
  "created_at": "2025-03-18T18:30:18.60785+00:00",
  "updated_at": "2025-03-18T18:30:18.60785+00:00",
  "customer_id": "d8377c2a-133f-48bd-bf39-67e7fc8fa55b"
}
```


### customers_claygrounds

#### Columns
- customer_id
- customer_name
- customer_email
- customer_phone
- date_of_birth
- preferred_location_id
- total_bookings_at_preferred_location
- preferred_start_time
- preferred_play_day
- favorite_activity
- total_paid_at_preferred_location
- average_discount_percentage
- preferred_booking_source
- online_booking_percentage
- offline_booking_percentage
- last_booking_date
- last_booking_location_id
- days_since_last_booking
- first_booking_date
- days_since_first_booking
- total_locations_visited
- total_spend
- discount_savings
- average_booking_value
- booking_frequency
- total_activities_played
- favorite_activity_percentage
- created_at
- updated_at

#### Constraints
- No constraints found

#### Sample Data
```json
{
  "customer_id": "bfda695a-247d-442b-b4d4-7d2544f330d5",
  "customer_name": "Kabir Sharma",
  "customer_email": "arpit@itmagia.com",
  "customer_phone": "7303437320",
  "date_of_birth": "N/A",
  "preferred_location_id": "bffe005c-32d8-4608-a9fb-a2a89230daa2",
  "total_bookings_at_preferred_location": 52,
  "preferred_start_time": "23:00:00",
  "preferred_play_day": "Sunday",
  "favorite_activity": "Football (Turf)",
  "total_paid_at_preferred_location": 212450,
  "average_discount_percentage": 25.95,
  "preferred_booking_source": "Offline",
  "online_booking_percentage": 0,
  "offline_booking_percentage": 100,
  "last_booking_date": "2025-05-16",
  "last_booking_location_id": "f3f48654-de20-4d05-a528-7bad4c7125fa",
  "days_since_last_booking": 3,
  "first_booking_date": "2023-06-25",
  "days_since_first_booking": 695,
  "total_locations_visited": 4,
  "total_spend": 288864,
  "discount_savings": 94725,
  "average_booking_value": 3566.22,
  "booking_frequency": 3.5,
  "total_activities_played": 4,
  "favorite_activity_percentage": 63.64,
  "created_at": "2025-05-20T15:49:51.311127",
  "updated_at": "2025-05-20T15:49:51.311127"
}
```


### employees

#### Columns
- employee_id
- company_id
- employee_name
- nickname
- phone
- salary_package
- employment_status
- company_billed_to
- fathers_name
- date_of_birth
- address
- city
- state
- pan_number
- created_at
- updated_at
- date_of_joining
- designation
- conveyance
- pf_registered
- salary_bank_account
- IFSC_code
- name_on_bank
- bank_name
- email

#### Constraints
- No constraints found

#### Sample Data
```json
{
  "employee_id": "a72f10ed-1a5f-4e67-98b9-ccc2e382cbb4",
  "company_id": "ST0001",
  "employee_name": "Dheeraj Kumar",
  "nickname": "Dheeraj ",
  "phone": "7081049168",
  "salary_package": 12000,
  "employment_status": "Active",
  "company_billed_to": "Sonet & Co",
  "fathers_name": null,
  "date_of_birth": null,
  "address": null,
  "city": null,
  "state": null,
  "pan_number": null,
  "created_at": "2025-04-10T16:50:55.377778+00:00",
  "updated_at": "2025-05-08T16:47:26.754122+00:00",
  "date_of_joining": null,
  "designation": "Cleaner",
  "conveyance": 0,
  "pf_registered": "Yes",
  "salary_bank_account": "433202120004958",
  "IFSC_code": "UBIN0543322",
  "name_on_bank": "Dheeraj Kumar\t",
  "bank_name": "Union Bank of India",
  "email": null
}
```


### hudle_bookings

#### Columns
- booking_id
- booking_reference
- location_id
- slot_date
- slot_time
- number_of_slots
- slot_details
- slot_price
- booking_type
- sport
- status
- source
- facility
- venue_discount
- cash
- upi
- bank_transfer
- hudle_app
- hudle_qr
- hudle_wallet
- venue_wallet
- hudle_pass
- hudle_discount
- customer_name
- phone
- financial_year
- created_at
- updated_at

#### Constraints
- No constraints found

#### Sample Data
```json
{
  "booking_id": "7e9f5858-5028-4b78-90ba-657b7f4694f0",
  "booking_reference": "HUD1763381645",
  "location_id": "9a950072-9f8d-44c2-ad31-9b778e29f71c",
  "slot_date": "2025-05-01",
  "slot_time": "21:00:00",
  "number_of_slots": 3,
  "slot_details": "May 1, 2025 09:00 PM - 09:30 PM, 09:30 PM - 10:00 PM, 10:00 PM - 10:30 PM",
  "slot_price": 1250,
  "booking_type": "Pay n Play",
  "sport": "Football",
  "status": "Confirmed",
  "source": "Offline",
  "facility": "6v6 Turf",
  "venue_discount": 0,
  "cash": 1112,
  "upi": 0,
  "bank_transfer": 0,
  "hudle_app": 0,
  "hudle_qr": 2638,
  "hudle_wallet": 0,
  "venue_wallet": 0,
  "hudle_pass": 0,
  "hudle_discount": 0,
  "customer_name": "Tushar Khattar",
  "phone": "8595122605",
  "financial_year": "2025-26",
  "created_at": "2025-05-28T09:01:51.95231+00:00",
  "updated_at": "2025-05-28T09:01:51.95231+00:00"
}
```

