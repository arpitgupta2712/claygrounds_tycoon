# Supabase Migration Context Document

## Project Overview

This is a comprehensive sports venue booking and management application that handles multiple aspects of business operations including bookings, payments, customer management, employee management, and financial tracking. The application currently needs to migrate from PostgreSQL connection pooling (pg-pool) to Supabase client library while maintaining all existing functionality.

## Current Database Structure

### Database Type
The database is already Supabase-compatible with the following schemas:
- **public**: Main application data
- **auth**: Supabase authentication system
- **storage**: Supabase storage system  
- **realtime**: Supabase realtime subscriptions
- **vault**: Supabase secrets management

### Core Application Tables

#### 1. **locations** - Venue Management
- **Primary Key**: `location_id` (text)
- **Key Fields**: location_name, city, state, address, operational_status, management_status
- **Purpose**: Manages sports venues/locations across different cities
- **Relationships**: Connected to bookings, employees, agreements
- **Indexes**: Optimized for location searches, operational status queries

#### 2. **bookings** - Core Booking System
- **Primary Key**: `booking_id` (uuid)
- **Key Fields**: booking_reference, location_id, slot_date, slot_time, customer_name, phone, sport, status
- **Purpose**: Manages all booking transactions
- **Payment Fields**: Multiple payment methods (cash, upi, bank_transfer, hudle_app, etc.)
- **Indexes**: Optimized for date ranges, location queries, active bookings

#### 3. **bookings_payments** - Financial Tracking
- **Primary Key**: `payment_id` (uuid)
- **Key Fields**: booking_id, financial_year, month, location_id, revenue, balance, payment_status
- **Purpose**: Detailed payment tracking and financial reporting
- **Relationships**: One-to-one with bookings table

#### 4. **customers** - Customer Management
- **Primary Key**: `customer_id` (uuid)
- **Key Fields**: customer_name, phone, email, registration_date
- **Purpose**: Basic customer information
- **Related Table**: `customers_claygrounds` (detailed analytics)

#### 5. **customers_claygrounds** - Customer Analytics
- **Primary Key**: `customer_id` (uuid)
- **Advanced Analytics**: booking patterns, preferences, lifetime value, frequency analysis
- **Key Metrics**: total_spend, booking_frequency, favorite_activity, preferred_location

#### 6. **employees** - HR Management  
- **Primary Key**: `employee_id` (uuid)
- **Key Fields**: company_id, employee_name, phone, salary_package, employment_status
- **Purpose**: Complete employee management with payroll integration

#### 7. **hudle_bookings** - Platform-Specific Bookings
- **Primary Key**: `booking_id` (uuid)
- **Purpose**: Bookings made through Hudle platform specifically
- **Similar Structure**: Mirror of main bookings table with platform-specific fields

### Supporting Tables

- **agreements**: Legal agreements with venue partners
- **licenses**: Licensing and permits management
- **equipment**: Equipment tracking and maintenance
- **expenses**: Expense management by location
- **submissions**: Financial submissions tracking
- **tasks**: Task management system
- **regions**: Geographic organization
- **error_log**: System error tracking

### Materialized Views & Analytics

The system includes several materialized views for performance:
- **Daily/Monthly Cash Collections**: Financial reporting by time periods
- **Payment Status Metrics**: Payment completion analytics  
- **Customer Analytics**: Customer behavior patterns
- **Location Performance**: Venue-wise performance metrics

### Key Database Features

#### Indexes & Performance
- **Composite Indexes**: location_id + slot_date combinations
- **Partial Indexes**: Active bookings, completed payments
- **Full-Text Search**: Task title/description search
- **Time-based Indexes**: Financial year, monthly reporting

#### Data Types & Constraints
- **UUIDs**: Primary keys for most entities
- **Custom Enums**: management status, task priority, task status
- **JSONB**: Additional metadata storage in error_log
- **Timestamp Tracking**: created_at/updated_at on all major tables


## Application Architecture Context

### Current File Structure
```
src/
├── routes/
│   ├── locations/           # Location management endpoints
│   │   ├── search-dbLocations.js
│   │   ├── id-dbLocations.js
│   │   ├── general-dbLocations.js
│   │   └── name-dbLocations.js
│   └── bookings/            # Booking management
│       └── monthlyCollections.js
├── utils/
│   ├── pgDatabaseUtils.js   # Current PostgreSQL utilities
│   ├── apiDatabaseClient.js # API client utilities
│   └── generalUtils.js      # General utilities
└── config/
    ├── db.config.js         # Database configuration
    └── api.config.js        # API configuration
```


## Business Logic Patterns

### Common Query Patterns
1. **Location-based Filtering**: Most queries filter by location_id
2. **Date Range Queries**: Financial reporting uses slot_date ranges
3. **Status-based Filtering**: Active bookings, completed payments
4. **Customer Lookup**: Phone number-based customer identification
5. **Financial Aggregations**: Monthly/yearly revenue calculations

### Critical Business Rules
1. **Booking Uniqueness**: booking_reference must be unique
2. **Payment Completion**: booking and payment records must be consistent
3. **Financial Year Logic**: Custom financial year calculations
4. **Location Availability**: Real-time slot availability checking
5. **Customer Deduplication**: Phone number-based customer matching

## Performance Requirements

### Expected Load
- **Daily Bookings**: High volume during peak hours
- **Concurrent Users**: Multiple location staff simultaneously
- **Report Generation**: Monthly financial reports
- **Real-time Updates**: Booking availability changes

### Critical Performance Areas
1. **Booking Availability Queries**: Sub-second response
2. **Customer Lookup**: Fast phone number searches
3. **Financial Reports**: Complex aggregation queries
4. **Dashboard Loading**: Multiple data source consolidation

## Security & Compliance

### Data Sensitivity
- **Customer PII**: Phone numbers, names, emails
- **Financial Data**: Payment information, revenue tracking
- **Employee Data**: Salary information, personal details

### Access Control Needs
- **Location-based Access**: Staff limited to their venues
- **Role-based Permissions**: Different access levels
- **Financial Data Protection**: Restricted financial information access

## Integration Points

### External Systems
- **Payment Gateways**: Multiple payment method integration
- **Hudle Platform**: Platform-specific booking processing
- **Analytics Systems**: Customer behavior tracking
- **Financial Reporting**: Accounting system integration

### API Requirements
- **REST Endpoints**: Existing API consumers
- **Real-time Updates**: Live booking status changes
- **Batch Processing**: Monthly report generation
- **Mobile App Support**: Mobile booking applications
