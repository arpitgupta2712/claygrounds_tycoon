# Claygrounds Server File Structure Documentation

## Quick Directory Index

### 1. API Directory (`/src/api/`)
- [Token Management](#1-api-directory-srcapi)
  - `tokenManager.js`: Token refresh and management
  - `hudleAuthUtils.js`: Authentication utilities
  - `hudleVenues.js`: Venue data fetching
  - `hudleVenuesBatch.js`: Batch venue processing
  - `hudleVenuesUtils.js`: Venue data utilities

### 2. Config Directory (`/src/config/`)
- [Configuration Files](#2-config-directory-srcconfig)
  - `api.config.js`: API configuration
  - `db.config.js`: Database configuration
  - `index.js`: Central configuration

### 3. Modules Directory (`/src/modules/`)
- [Core Business Logic](#3-modules-directory-srcmodules)
  - `fileOperations.js`: File handling utilities
  - `analyze.js`: Data analysis functions
  - `upload.js`: Data upload functionality

### 4. Routes Directory (`/src/routes/`)
- [API Route Handlers](#4-routes-directory-srcroutes)
  - [Bookings](#a-bookings-routesbookings)
    - `index.js`: Booking routes
  - [General](#b-general-routesgeneral)
    - `databaseUtils.js`: Database utility routes
  - [Hudle](#c-hudle-routeshudle)
    - `index.js`: Route organization
    - `emailExport.js`: Email export routes
    - `hudleAuth.js`: Authentication routes
    - `hudleVenues.js`: Venue routes
  - [Locations](#d-locations-routeslocations)
    - `index.js`: Route organization
    - `general-dbLocations.js`: General location routes
    - `name-dbLocations.js`: Name-based routes
    - `id-dbLocations.js`: ID-based routes
    - `search-dbLocations.js`: Search routes

### 5. Utils Directory (`/src/utils/`)
- [Utility Functions](#5-utils-directory-srcutils)
  - `pgDatabaseUtils.js`: Database utilities
  - `socketUtils.js`: Socket.IO utilities
  - `apiDatabaseClient.js`: API client utilities
  - `generalUtils.js`: General utilities
  - `environmentUtils.js`: Environment utilities
  - `config.js`: Configuration utilities
  - `ndjsonStream.js`: NDJSON streaming
  - `batchUtils.js`: Batch processing utilities

---

This document provides a comprehensive overview of the Claygrounds Server codebase structure, including all files, their purposes, and the functions/endpoints they contain.

## Directory Structure

```
src/
├── api/          # External API integrations and utilities
├── config/       # Configuration files
├── modules/      # Core business logic modules
├── routes/       # API route handlers
└── utils/        # Utility functions and helpers
```

## Detailed File Structure

### 1. API Directory (`/src/api/`)
Contains external API integrations and utilities.

#### Files:
1. `tokenManager.js`
   - Imports:
     - `API_CONFIG` from '../config/api.config.js'
   - Exports:
     - `startTokenRefresh()`: Function to manage token refresh cycle
     - `getToken()`: Function to get current token
   - Functions:
     - `startTokenRefresh()`: Manages token refresh cycle
       - Handles automatic token refresh
       - Manages token expiration
       - Maintains token state
     - `getHudleToken()`: Retrieves Hudle authentication token
       - Caches token for reuse
       - Handles token refresh when expired
   - Features:
     - Token caching
     - Automatic refresh
     - Error handling
     - State management

2. `hudleAuthUtils.js`
   - Imports:
     - `API_CONFIG` from '../config/api.config.js'
     - `getToken` from './tokenManager.js'
   - Exports:
     - `getApiBaseUrl()`: Function to determine API base URL
     - `getHudleToken()`: Function to get authentication token
     - `getHudleHeaders()`: Function to generate API headers
   - Functions:
     - `getApiBaseUrl()`: Determines appropriate base URL for API requests
       - Handles environment detection
       - Supports local and production URLs
       - Network interface detection
     - `getHudleToken()`: Retrieves authentication token from backend
       - Force refresh option
       - Error handling
       - Token validation
     - `getHudleHeaders()`: Generates headers for Hudle API requests
       - Combines default and auth headers
       - Handles API secret
       - Referer management
   - Features:
     - Environment-aware URL resolution
     - Secure header generation
     - Token management
     - Error handling

3. `hudleVenues.js`
   - Imports:
     - `getHudleHeaders` from './hudleAuthUtils.js'
     - `API_CONFIG` from '../config/api.config.js'
   - Exports:
     - `fetchAllVenues()`: Function to fetch all venues
     - `fetchVenueDetails()`: Function to fetch venue details
   - Functions:
     - `fetchAllVenues()`: Fetches all venues from Hudle API
       - Pagination handling
       - Rate limiting
       - Error retry
     - `fetchVenueDetails()`: Gets detailed information for a specific venue
       - Venue ID validation
       - Data transformation
       - Error handling
   - Features:
     - Pagination support
     - Rate limiting
     - Error retry mechanism
     - Data validation

4. `hudleVenuesBatch.js`
   - Imports:
     - `fetchAllVenues` from './hudleVenues.js'
     - `writeVenuesOutput`, `updateRegionSummary` from './hudleVenuesUtils.js'
   - Exports:
     - `fetchAllCitiesVenues()`: Main batch processing function
     - `fetchAllCitiesVenuesStream()`: Streaming version
   - Functions:
     - `fetchAllCitiesVenues()`: Fetches venues for all regions defined in regions.json
       - Region-based processing
       - Progress tracking
       - Error handling
     - `fetchAllCitiesVenuesStream()`: Streaming version of venue fetching with callback support
       - Real-time progress updates
       - Callback handling
       - Error propagation
   - Features:
     - Handles incremental file writing
     - Maintains region and meta summaries
     - Detects new venues compared to previous runs
     - Supports both batch and streaming operations
     - Progress tracking
     - Error recovery

5. `hudleVenuesUtils.js`
   - Imports:
     - `fs` from 'fs'
     - `path` from 'path'
   - Exports:
     - `writeVenuesOutput()`: File writing utility
     - `getVenueIdSet()`: Venue ID set creation
     - `getVenueMap()`: Venue mapping utility
     - `updateRegionSummary()`: Summary update function
   - Functions:
     - `writeVenuesOutput()`: Writes JSON data to file with directory creation
       - Directory creation
       - File writing
       - Error handling
     - `getVenueIdSet()`: Creates Set of unique venue IDs
       - Duplicate handling
       - Data validation
     - `getVenueMap()`: Creates map of venue IDs to venue objects
       - Key-value mapping
       - Data transformation
     - `updateRegionSummary()`: Updates region summary with current/previous counts
       - Count tracking
       - Change detection
       - Summary generation
   - Features:
     - File system operations
     - Data structure utilities
     - Summary management
     - Error handling

### 2. Config Directory (`/src/config/`)
Contains configuration files and settings.

#### Files:
1. `api.config.js`
   - Exports:
     - `API_CONFIG`: Comprehensive API configuration object containing:
       - `BASE_PORT`: API server port (default: 3001)
       - `API_SECRET`: Authentication secret key
       - `REFERER`: API request referer URL
       - `DEFAULT_HEADERS`: Predefined headers for different request types
       - `REQUEST_DELAY`: Delay between API requests (default: 1000ms)
       - `DEFAULT_TIMEOUT`: Request timeout (default: 30000ms)
       - `HUDLE_API_BASE`: Base URL for Hudle API
       - `ENDPOINTS`: API endpoint definitions
   - Functions:
     - `getHeaders(includeAuth)`: Generates complete headers object
     - `getEndpoint(endpoint)`: Constructs full endpoint URL
   - Features:
     - Environment variable support
     - Configurable request delays and timeouts
     - Structured header management
     - Endpoint URL construction
     - Security headers configuration

2. `db.config.js`
   - Exports:
     - `DB_CONFIG`: Comprehensive database configuration object containing:
       - `CONNECTION`: Database connection parameters
         - Host, port, database name
         - User credentials
         - SSL configuration
       - `POOL`: Connection pool settings
         - Maximum connections
         - Timeout configurations
         - Keep-alive settings
       - `TABLES`: Table definitions
         - BOOKINGS: Booking data structure
         - LOCATIONS: Location data structure
       - `QUERIES`: Common SQL queries
   - Functions:
     - `getConnectionString()`: Generates database connection string
     - `getTableName(tableKey)`: Retrieves full table name
   - Features:
     - Environment variable support
     - Connection pool management
     - Table schema definitions
     - Common query templates
     - SSL configuration
     - Connection string generation

3. `index.js`
   - Functions:
     - `getConfig(path)`: Gets configuration value using dot notation
     - `validateConfig()`: Validates all required configuration values
   - Exports:
     - `CONFIG`: Combined configuration object containing:
       - `api`: API configuration from api.config.js
       - `db`: Database configuration from db.config.js
       - `env`: Environment information
       - `paths`: Application directory paths
       - `files`: File naming and structure configuration
       - `data`: Data processing configuration
       - `time`: Time and date format settings
   - Features:
     - Centralized configuration management
     - Environment-aware configuration
     - Runtime configuration validation
     - Type-safe configuration access

### 3. Modules Directory (`/src/modules/`)
Contains core business logic modules.

#### Files:
1. `fileOperations.js`
   - Imports:
     - `Utils` from '../utils/generalUtils.js'
     - `path` from 'path'
     - `xlsx` from 'xlsx'
     - `fs` from 'fs'
   - Exports:
     - `findBookingFiles()`: Function to find booking files
     - `readFile()`: Function to read file contents
     - `getDefaultValueForField()`: Function to get field defaults
     - `createHeaderMap()`: Function to create header mappings
     - `listFilesWithExtensions()`: Function to list files by extension
   - Functions:
     - `findBookingFiles()`: Finds booking files in directory
       - Searches for .csv, .xlsx, .xls files
       - Returns full file paths
       - Logs found files
     - `readFile()`: Reads file contents
       - Supports Excel and CSV formats
       - Converts to JSON objects
       - Handles empty cells
       - Validates data structure
     - `getDefaultValueForField()`: Gets default values
       - Handles numeric fields
       - Manages string fields
     - `createHeaderMap()`: Creates header mappings
       - Standardizes column names
       - Handles variations
     - `listFilesWithExtensions()`: Lists files by extension
       - Filters by extension
       - Handles errors
   - Features:
     - Multi-format file support
     - Data validation
     - Error handling
     - Logging
     - Header standardization

2. `analyze.js`
   - Imports:
     - `Utils` from '../utils/generalUtils.js'
     - `xlsx` from 'xlsx'
     - `findBookingFiles`, `readFile` from './fileOperations.js'
   - Exports:
     - `analyzeData()`: Main analysis function
     - `validateFile()`: File validation function
     - `parseSlotDetails()`: Slot parsing function
     - `calculateTotalPayment()`: Payment calculation
     - `calculateSlotPrice()`: Price calculation
     - `getFinancialYear()`: Financial year calculation
     - `parseFloatOrDefault()`: Safe float parsing
     - `getValueCaseInsensitive()`: Case-insensitive value retrieval
     - `processData()`: Data processing function
     - `analyzeFile()`: Single file analysis
     - `analyzeFiles()`: Multiple file analysis
   - Functions:
     - `analyzeData()`: Analyzes booking data
       - Validates data structure
       - Processes bookings
       - Generates summaries
     - `validateFile()`: Validates file structure
       - Checks required columns
       - Validates data format
       - Generates validation report
     - `parseSlotDetails()`: Parses slot information
       - Extracts date and time
       - Handles various formats
       - Validates slot data
     - `calculateTotalPayment()`: Calculates payments
       - Sums all payment sources
       - Handles currency values
       - Validates amounts
     - `calculateSlotPrice()`: Calculates slot prices
       - Computes per-slot cost
       - Handles discounts
       - Validates calculations
     - `getFinancialYear()`: Gets financial year
       - Handles April-March year
       - Validates dates
       - Returns formatted year
     - `processData()`: Processes booking data
       - Transforms raw data
       - Validates fields
       - Generates summaries
   - Features:
     - Comprehensive data analysis
     - Financial calculations
     - Date/time handling
     - Data validation
     - Error handling
     - Logging

3. `upload.js`
   - Imports:
     - `Utils` from '../utils/generalUtils.js'
   - Exports:
     - `uploadToSupabase()`: Main upload function
     - `retryUpload()`: Retry mechanism
   - Functions:
     - `uploadToSupabase()`: Uploads data to Supabase
       - Batch processing
       - Error handling
       - Progress tracking
       - Detailed reporting
     - `retryUpload()`: Handles upload retries
       - Configurable retry count
       - Error recovery
       - Progress tracking
   - Features:
     - Batch processing
     - Error handling
     - Retry mechanism
     - Progress tracking
     - Detailed reporting
     - Data validation
     - Transaction management

### 4. Routes Directory (`/src/routes/`)
Contains API route handlers.

#### Subdirectories:

##### a. Bookings (`/routes/bookings/`)
1. `index.js`
   - Imports:
     - `express` from 'express'
     - `analyzeData`, `validateFile` from '../../modules/analyze.js'
     - `uploadToSupabase`, `retryUpload` from '../../modules/upload.js'
     - `Utils` from '../../utils/generalUtils.js'
     - `path` from 'path'
     - `findBookingFiles`, `readFile` from '../../modules/fileOperations.js'
   - Constants:
     - `BOOKINGS_DIR`: Path to bookings directory
   - Routes:
     - `POST /api/bookings/analyze`
       - Purpose: Analyze a single booking file
       - Parameters:
         - `filePath`: Path to the file to analyze
       - Response:
         - Success: Analysis results
         - Error: Validation or processing errors
       - Features:
         - File structure validation
         - Data analysis
         - Error handling
         - Progress tracking
     - `POST /api/bookings/upload`
       - Purpose: Upload analyzed booking data to Supabase
       - Parameters:
         - `data`: Analyzed booking data
       - Response:
         - Success: Upload results
         - Error: Upload failures
       - Features:
         - Batch processing
         - Error handling
         - Progress tracking
         - Detailed reporting
     - `POST /api/bookings/process`
       - Purpose: Process multiple booking files
       - Parameters:
         - `filePaths`: Optional array of specific files to process
       - Response:
         - Success: Processing results with summary
         - Error: Processing failures
       - Features:
         - Batch file processing
         - Progress tracking
         - Detailed reporting
         - Error recovery
         - Summary statistics

##### b. General (`/routes/general/`)
1. `databaseUtils.js`
   - Imports:
     - `express` from 'express'
   - Routes:
     - `POST /api/database/test-connection`
       - Purpose: Test database connection with provided password
       - Parameters:
         - `password`: Database password
       - Response:
         - Success: Connection status
         - Error: Connection failures
       - Features:
         - Password validation
         - Connection testing
         - Error handling
     - `GET /api/database/test-connection`
       - Purpose: Test database connection with current credentials
       - Response:
         - Success: Connection status
         - Error: Connection failures
       - Features:
         - Current credentials testing
         - Connection validation
         - Error handling
     - `POST /api/database/execute-query`
       - Purpose: Execute specific database queries
       - Parameters:
         - `query`: SQL query to execute
       - Response:
         - Success: Query execution results
         - Error: Query failures
       - Features:
         - Query validation
         - Security restrictions
         - Error handling
         - Limited query types (DROP TABLE only)
   - Functions:
     - `testDatabaseConnection(pool)`: Tests database connectivity
       - Validates pool connection
       - Handles connection errors
       - Returns connection status

##### c. Hudle (`/routes/hudle/`)
1. `index.js`
   - Imports:
     - `express` from 'express'
     - `emailExportRouter` from './emailExport.js'
     - `hudleAuthRouter` from './hudleAuth.js'
     - `hudleVenuesRouter` from './hudleVenues.js'
   - Routes:
     - Mounts email export routes at root
     - Mounts auth routes at `/auth`
     - Mounts venues routes at `/venues`
   - Features:
     - Route organization
     - Modular routing
     - Clean separation of concerns

2. `emailExport.js`
   - Imports:
     - `express` from 'express'
     - `fetchAllVenues` from '../../api/hudleVenues.js'
     - `getHudleToken` from '../../api/hudleAuthUtils.js'
   - Constants:
     - `REQUEST_DELAY`: 1000ms delay between requests
   - Routes:
     - `POST /api/hudle/emailExport`
       - Purpose: Request email exports for selected locations
       - Parameters:
         - `startDate`: Start date (YYYY-MM-DD)
         - `endDate`: End date (YYYY-MM-DD)
         - `locationIds`: Optional array of location IDs
         - `reportType`: Optional report type (default: 1)
       - Response:
         - Success: Export operation summary
         - Error: Export failures
       - Features:
         - Date validation
         - Location filtering
         - Batch processing
         - Progress tracking
         - Error handling
         - Rate limiting
         - Detailed reporting
   - Functions:
     - `sleep(ms)`: Helper for request delay
   - Features:
     - Comprehensive error handling
     - Progress tracking
     - Batch processing
     - Rate limiting
     - Detailed reporting

3. `hudleAuth.js`
   - Imports:
     - `express` from 'express'
     - `axios` from 'axios'
   - Variables:
     - `cachedToken`: Token storage
     - `tokenExpiration`: Token expiration time
   - Routes:
     - `POST /api/hudle/auth/token`
       - Purpose: Obtain Hudle API token
       - Parameters:
         - `forceRefresh`: Optional boolean to force new token
       - Response:
         - Success: Token and expiration
         - Error: Authentication failures
       - Features:
         - Token caching
         - Automatic refresh
         - Environment variable support
         - Error handling
   - Features:
     - Token management
     - Caching mechanism
     - Security headers
     - Error handling

4. `hudleVenues.js`
   - Imports:
     - `express` from 'express'
     - `path` from 'path'
     - `fetchAllVenues` from '../../api/hudleVenues.js'
     - `fetchAllCitiesVenuesStream` from '../../api/hudleVenuesBatch.js'
     - `writeVenuesOutput` from '../../api/hudleVenuesUtils.js'
     - `fs` from 'fs'
     - `streamNdjson` from '../../utils/ndjsonStream.js'
   - Routes:
     - `GET /api/hudle/venues/global`
       - Purpose: Stream all venues as NDJSON
       - Response: NDJSON stream of venues
       - Features:
         - Streaming response
         - Pagination
         - Error handling
     - `GET /api/hudle/venues/region/:cityId`
       - Purpose: Stream venues for a region
       - Parameters:
         - `cityId`: Region/city ID
       - Response: NDJSON stream of venues
       - Features:
         - Region filtering
         - Streaming response
         - Pagination
     - `GET /api/hudle/venues/user`
       - Purpose: Stream user's venues
       - Response: NDJSON stream of venues
       - Features:
         - User-specific data
         - Streaming response
         - Pagination
   - Functions:
     - `getRegionName(cityId)`: Helper to get region name
     - `pageGenerator()`: Helper for pagination
   - Features:
     - Streaming responses
     - Pagination
     - Region management
     - Error handling
     - NDJSON formatting

##### d. Locations (`/routes/locations/`)
1. `index.js`
   - Imports:
     - `express` from 'express'
     - `generalDbLocationsRouter` from './general-dbLocations.js'
     - `nameDbLocationsRouter` from './name-dbLocations.js'
     - `idDbLocationsRouter` from './id-dbLocations.js'
     - `searchDbLocationsRouter` from './search-dbLocations.js'
   - Routes:
     - Mounts all location routers at root
   - Features:
     - Route organization
     - Modular routing
     - Clean separation of concerns

2. `general-dbLocations.js`
   - Imports:
     - `express` from 'express'
     - `fileURLToPath` from 'url'
     - `path` from 'path'
     - `getPool` from '../../utils/pgDatabaseUtils.js'
   - Routes:
     - `GET /basic`
       - Purpose: Get locations with basic information
       - Response: Array of minimal location objects
       - Features:
         - Minimal fields for dropdowns
         - Ordered by city and name
     - `GET /active`
       - Purpose: Get all active locations
       - Response: Array of active location objects
       - Features:
         - Operational status filter
         - Ordered by city and name
     - `GET /inactive`
       - Purpose: Get all inactive locations
       - Response: Array of inactive location objects
       - Features:
         - Closed status filter
         - Ordered by city and name
     - `GET /owned`
       - Purpose: List fully owned locations
       - Response: Array of owned location objects
       - Features:
         - Management status filter
         - Ordered by city and name
     - `GET /managed`
       - Purpose: List landlord-invested locations
       - Response: Array of managed location objects
       - Features:
         - Management status filter
         - Ordered by city and name
     - `GET /outsourced`
       - Purpose: List SportVot-managed locations
       - Response: Array of outsourced location objects
       - Features:
         - Management status filter
         - Ordered by city and name
     - `GET /unassigned`
       - Purpose: List locations needing managers
       - Response: Array of unassigned location objects
       - Features:
         - Active and owned filter
         - Manager ID check
         - Ordered by city and name
     - `GET /all`
       - Purpose: Get all locations with full details
       - Response: Array of complete location objects
       - Features:
         - Full location details
         - Ordered by city and name
   - Features:
     - Comprehensive error handling
     - Detailed logging
     - Database connection management
     - Status-based filtering
     - Consistent ordering

3. `name-dbLocations.js`
   - Imports:
     - `express` from 'express'
     - `fileURLToPath` from 'url'
     - `path` from 'path'
     - `getPool` from '../../utils/pgDatabaseUtils.js'
   - Routes:
     - `GET /name/:locationName`
       - Purpose: Get location by name
       - Parameters:
         - `locationName`: Location name
       - Response: Complete location object
       - Features:
         - Exact name matching
         - Full location details
     - `GET /name/:locationName/manager`
       - Purpose: Get manager details for location
       - Parameters:
         - `locationName`: Location name
       - Response: Manager details object
       - Features:
         - Employee-location join
         - Detailed manager info
   - Features:
     - Comprehensive error handling
     - Detailed logging
     - Database connection management
     - Join operations
     - Parameter validation

4. `id-dbLocations.js`
   - Imports:
     - `express` from 'express'
     - `fileURLToPath` from 'url'
     - `path` from 'path'
     - `getPool` from '../../utils/pgDatabaseUtils.js'
   - Routes:
     - `GET /id/:id`
       - Purpose: Get location by ID
       - Parameters:
         - `id`: Location ID
       - Response: Complete location object
       - Features:
         - Exact ID matching
         - Full location details
   - Features:
     - Comprehensive error handling
     - Detailed logging
     - Database connection management
     - Parameter validation

5. `search-dbLocations.js`
   - Imports:
     - `express` from 'express'
     - `getPool` from '../../utils/pgDatabaseUtils.js'
   - Routes:
     - `GET /search/location/:locationName`
       - Purpose: Find locations by name variations
       - Parameters:
         - `locationName`: Search term
       - Response: Array of matching locations
       - Features:
         - Multiple name field search
         - Case-insensitive matching
         - Ordered results
     - `GET /search/region/:regionName`
       - Purpose: Find locations in region
       - Parameters:
         - `regionName`: Region name
       - Response: Array of locations in region
       - Features:
         - Region-location join
         - Case-insensitive matching
         - Ordered results
     - `GET /search/manager/:managerName`
       - Purpose: Find locations by manager
       - Parameters:
         - `managerName`: Manager search term
       - Response: Array of managed locations
       - Features:
         - Employee-location join
         - Multiple manager field search
         - Detailed manager info
     - `GET /search/city/:cityName`
       - Purpose: Find locations in city
       - Parameters:
         - `cityName`: City name
       - Response: Array of locations in city
       - Features:
         - Case-insensitive matching
         - Ordered results
   - Features:
     - Comprehensive error handling
     - Detailed logging
     - Database connection management
     - Join operations
     - Case-insensitive search
     - Multiple field matching

### 5. Utils Directory (`/src/utils/`)
Contains utility functions and helpers.

#### Files:
1. `pgDatabaseUtils.js`
   - Imports:
     - `Pool` from 'pg'
     - `chalk` from 'chalk'
     - `DB_CONFIG` from '../config/db.config.js'
   - Exports:
     - `refreshDbPool()`: Function to refresh database pool
     - `getPool()`: Function to get current pool
     - `initializePool()`: Function to initialize pool
     - `testDbConnection()`: Function to test connection
   - Functions:
     - `getDbConfig()`: Gets database configuration
       - Handles password override
       - Configures pool settings
     - `createPool()`: Creates new connection pool
       - Error handling
       - Connection tracking
       - Operation logging
     - `refreshDbPool()`: Refreshes pool with new credentials
       - Pool cleanup
       - New pool creation
     - `getPool()`: Gets current pool instance
     - `initializePool()`: Initializes pool with credentials
     - `testDbConnection()`: Tests database connectivity
   - Features:
     - Connection pool management
     - Error handling
     - Operation tracking
     - Progress logging
     - Credential management

2. `socketUtils.js`
   - Imports:
     - `Server` from 'socket.io'
   - Exports:
     - `initializeSocketIO()`: Socket.IO initialization
     - `sendProgressUpdate()`: Progress update function
     - `trackExportProcess()`: Export tracking
     - `stopExportProcess()`: Export stopping
     - `cleanupExportProcess()`: Export cleanup
   - Variables:
     - `io`: Socket.IO instance
     - `activeExports`: Map of active exports
   - Functions:
     - `initializeSocketIO()`: Sets up Socket.IO server
       - CORS configuration
       - Connection handling
     - `sendProgressUpdate()`: Sends progress updates
       - Type-based updates
       - Data inclusion
     - `trackExportProcess()`: Tracks export processes
       - Process state management
       - Abort controller setup
     - `stopExportProcess()`: Stops export processes
       - Abort handling
       - Process cleanup
     - `cleanupExportProcess()`: Cleans up exports
       - Process stopping
       - Resource cleanup
   - Features:
     - Real-time updates
     - Process management
     - Error handling
     - Resource cleanup

3. `apiDatabaseClient.js`
   - Imports:
     - `chalk` from 'chalk'
   - Functions:
     - `getApiBaseUrl()`: Gets API base URL
       - Environment variable support
       - Browser detection
       - Network interface detection
   - Variables:
     - `API_BASE_URL`: Base URL storage
     - `isNode`: Node.js detection
   - Features:
     - Environment detection
     - URL resolution
     - Network interface handling
     - Error handling

4. `generalUtils.js`
   - Imports:
     - `Environment` from './environmentUtils.js'
     - `Config` from './config.js'
     - `fs` from 'fs/promises'
     - `path` from 'path'
   - Exports:
     - `Utils`: General utility object
   - Functions:
     - `log()`: Logging function
       - Level-based logging
       - File logging
       - Color support
     - `writeToLogFile()`: File logging
       - Directory creation
       - JSON formatting
     - `ensureDirectoryExists()`: Directory management
       - Path validation
       - Creation handling
     - `sleep()`: Delay function
     - `retry()`: Retry mechanism
       - Exponential backoff
       - Configurable attempts
     - `formatDate()`: Date formatting
     - `sanitizeFilename()`: Filename sanitization
     - `generateUniqueId()`: ID generation
     - `listExcelFiles()`: Excel file listing
     - `isValidDateFormat()`: Date validation
   - Features:
     - Comprehensive logging
     - File operations
     - Date handling
     - Retry logic
     - Validation

5. `environmentUtils.js`
   - Imports:
     - `homedir` from 'os'
     - `join` from 'path'
   - Exports:
     - `Environment`: Environment utility object
   - Properties:
     - `isNode`: Node.js detection
     - `isBrowser`: Browser detection
     - `isDevelopment`: Development mode
     - `platform`: Platform detection
     - `version`: Node.js version
   - Functions:
     - `getEnv()`: Environment variable access
     - `hasEnv()`: Environment check
     - `getRequiredEnv()`: Required variable access
     - `getBoolEnv()`: Boolean variable access
     - `getNumberEnv()`: Number variable access
     - `detectEnvironment()`: Environment detection
     - `getEnvironmentInfo()`: Environment information
     - `getBaseUrl()`: Base URL resolution
     - `getDesktopPath()`: Desktop path resolution
   - Features:
     - Environment detection
     - Variable management
     - Platform handling
     - Path resolution

6. `config.js`
   - Imports:
     - `Environment` from './environmentUtils.js'
     - `join` from 'path'
   - Exports:
     - `Config`: Configuration object
   - Properties:
     - `paths`: Directory paths
     - `api`: API configuration
     - `auth`: Authentication settings
     - `logging`: Logging configuration
     - `extraction`: Data extraction settings
   - Functions:
     - `getFullPath()`: Path resolution
     - `getApiUrl()`: API URL construction
   - Features:
     - Centralized configuration
     - Environment awareness
     - Path management
     - API configuration

7. `ndjsonStream.js`
   - Exports:
     - `streamNdjson()`: NDJSON streaming function
   - Functions:
     - `streamNdjson()`: Streams NDJSON data
       - Content type setting
       - Error handling
       - Chunk processing
   - Features:
     - Streaming support
     - Error handling
     - Content type management

8. `batchUtils.js`
   - Exports:
     - `DEFAULT_BATCH_SIZE`: Default batch size
     - `createStats()`: Stats creation
     - `splitIntoBatches()`: Batch splitting
     - `updateStats()`: Stats updating
   - Functions:
     - `createStats()`: Creates stats object
     - `splitIntoBatches()`: Splits array into batches
     - `updateStats()`: Updates stats with results
   - Features:
     - Batch processing
     - Statistics tracking
     - Error handling
     - Progress monitoring
