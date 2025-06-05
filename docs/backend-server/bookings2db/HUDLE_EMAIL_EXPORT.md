# Email Export Endpoints Documentation

This document provides detailed information about the email export functionality in the Claygrounds Server application.

## Overview

The email export endpoints handle the generation and delivery of booking reports via email for Hudle venues. This functionality allows for:

1. Exporting booking data for specific date ranges
2. Processing multiple venues in batch
3. Customizing report types
4. Tracking export status and results

## Endpoints

### Email Export Request

**Endpoint:** `POST /api/hudle/emailExport`

Requests email exports for selected locations within a specified date range.

#### Request

```json
{
    "startDate": "2025-05-01",
    "endDate": "2025-05-31"
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Start date in YYYY-MM-DD format |
| endDate | string | Yes | End date in YYYY-MM-DD format |
| locationIds | string[] | No | Array of location IDs to process. If not provided, all approved locations will be processed |
| reportType | number | No | Type of report to generate (default: 1) |

#### Response

Success Response (200 OK):
```json
{
    "success": true,
    "summary": {
        "dateRange": {
            "start": "2025-05-01",
            "end": "2025-05-31"
        },
        "locations": {
            "total": 20,
            "successful": 20,
            "failed": 0
        },
        "duration": 16.2,
        "processedLocations": [
            {
                "id": "7977b941-171f-4ce8-99d4-b23a5e293677",
                "name": "Dum Dum Kolkata",
                "status": "success",
                "timestamp": "2025-06-02T09:26:09.170Z"
            }
        ],
        "errors": []
    }
}
```

## API Integration

### Hudle API Requirements

1. **Authentication**
   - Bearer token authentication
   - Token obtained through `getHudleToken()`
   - Automatic token refresh handling

2. **Headers**
   ```javascript
   {
       'Accept': '*/*',
       'Accept-Language': 'en-GB,en;q=0.7',
       'Authorization': 'Bearer ${token}',
       'Content-Type': 'application/json',
       'Origin': 'https://partner.hudle.in',
       'Referer': 'https://partner.hudle.in/',
       'api-secret': 'hudle-api1798@prod',
       'x-app-id': 'web',
       'x-app-source': 'partner',
       'x-device-source': '3'
   }
   ```

3. **Request Format**
   - Endpoint: `/api/v1/venues/{venueId}/bookings/export`
   - Method: POST
   - Body:
     ```json
     {
         "from_date": "2025-05-01",
         "to_date": "2025-05-31",
         "report_type": 1
     }
     ```

## Example: Email Export cURL Command

Below is the exact working example of how to use the email export endpoint:

```bash
curl --location 'https://partner.claygrounds.com/api/hudle/emailExport' \
--header 'Accept: */*' \
--header 'Accept-Language: en-GB,en;q=0.7' \
--header 'Authorization: Bearer <your_token_here>' \
--header 'Content-Type: application/json' \
--header 'Origin: https://partner.hudle.in' \
--header 'Referer: https://partner.hudle.in/' \
--header 'api-secret: hudle-api1798@prod' \
--header 'x-app-id: web' \
--header 'x-app-source: partner' \
--header 'x-device-source: 3' \
--data-raw '{
    "startDate": "2025-05-01",
    "endDate": "2025-05-31"
}'
```

## Troubleshooting

1. **Common Issues**
   - Invalid date formats
   - Missing location IDs
   - API authentication failures
   - Rate limiting errors

2. **Solutions**
   - Verify date format (YYYY-MM-DD)
   - Check location ID validity
   - Ensure valid API credentials
   - Adjust request delay if needed

3. **Monitoring**
   - Check success rates
   - Monitor processing times
   - Review error logs
   - Track API response times

## Best Practices

1. **Date Range Selection**
   - Keep date ranges reasonable (e.g., monthly)
   - Avoid very large date ranges
   - Consider timezone implications

2. **Location Selection**
   - Process specific locations when possible
   - Use all locations only when necessary
   - Verify location IDs before processing

3. **Error Handling**
   - Monitor failed locations
   - Retry failed exports if needed
   - Maintain error logs for debugging

4. **Performance**
   - Monitor processing times
   - Adjust delay if needed
   - Track success rates

## Report Types

The system supports different types of reports that can be generated:

1. **Type 1 (Default)**
   - Standard booking report
   - Includes all booking details
   - Most commonly used format

2. **Type 2**
   - Detailed financial report
   - Includes payment breakdowns
   - Additional financial metrics

## Location Handling

### Location Selection

1. **Specific Locations**
   - When `locationIds` is provided, only those locations will be processed
   - Each location ID must be valid and active

2. **All Approved Locations**
   - When `locationIds` is not provided, all approved locations are processed
   - Only locations with `is_approved: true` are included
   - Locations are fetched from the Hudle API

### Location Processing

1. **Batch Processing**
   - Locations are processed sequentially
   - 1-second delay between requests to prevent rate limiting
   - Progress tracking for each location

2. **Error Handling**
   - Individual location failures don't stop the entire process
   - Failed locations are tracked and reported
   - Detailed error information is maintained

## Performance Considerations

1. **Rate Limiting**
   - 1-second delay between requests
   - Prevents API throttling
   - Configurable through `REQUEST_DELAY` constant

2. **Batch Processing**
   - Sequential processing to maintain order
   - Progress tracking for each location
   - Detailed timing information

3. **Memory Management**
   - Efficient handling of multiple locations
   - No memory leaks
   - Proper cleanup after processing

## Error Handling

1. **Validation Errors**
   - Date format validation
   - Date range validation
   - Location ID validation

2. **API Errors**
   - Network failures
   - Authentication errors
   - Rate limiting errors

3. **Processing Errors**
   - Individual location failures
   - Report generation errors
   - Email delivery issues

## Logging

The system provides comprehensive logging:

1. **Operation Logs**
   ```
   📧 Date range: 2024-03-01 to 2024-03-31
   🚀 Starting batch email export for 5 locations
   ⚙️ Using 1000ms delay between requests
   ➡️ [1/5] Processing: ClayGrounds | Sec 56 (loc_123456)
   ✅ [loc_123456] Email export requested successfully
   ⏱️ Adding 1000ms delay...
   ```

2. **Summary Logs**
   ```
   🏁 Email export process finished.
   📋 BATCH EXPORT SUMMARY:
   📅 Date Range: 2024-03-01 to 2024-03-31
   ⏱️ Total Duration: 5.2 seconds
   🏆 Success Rate: 4/5 locations (80%)
   ```

## Obtaining the Bearer Token

If your token expires or changes, you can obtain a new one using the following endpoint:

- **Endpoint:** `POST /api/hudle/auth/token`
- This endpoint will return a new Bearer token to use in the `Authorization` header for all Hudle API requests.
- Refer to the authentication documentation for the required request body and usage details. 