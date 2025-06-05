# Custom Token Testing for Hudle API

This document outlines how to implement a testing endpoint for using custom tokens with Hudle API endpoints.

## Implementation

To test Hudle API endpoints with a custom token, you can implement a test endpoint like this:

```javascript
/**
 * @route GET /api/hudle/auth/test
 * @description Test endpoint to try local endpoints with a custom token
 */
router.get('/test', async (req, res) => {
  try {
    const testToken = 'YOUR_CUSTOM_TOKEN';
    
    // Using local endpoint with the custom token
    const response = await axios.get('http://localhost:3001/api/hudle/venues/region/11', {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'content-type': 'application/json'
      }
    });

    return res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Test endpoint error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});
```

## Usage

1. Replace `YOUR_CUSTOM_TOKEN` with the actual token you want to test
2. Modify the endpoint URL to test different Hudle API endpoints
3. Make a GET request to `/api/hudle/auth/test`

## Example Token

Here's an example of a valid token format:
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE5MTIsImlzcyI6Imh0dHBzOi8vYXBpLmh1ZGxlLmluL2FwaS92MS9sb2dpbiIsImlhdCI6MTc0ODUwOTIwOSwiZXhwIjoxNzc5NjEzMjA5LCJuYmYiOjE3NDg1MDkyMDksImp0aSI6InhtOUVMQjlHbllLeEJIN3UifQ.JXKf6O0qAaA040V7EXZXu3qz4f_PaMwGWLlBYMwSO_Y
```

## Notes

- This testing approach is useful for:
  - Verifying token validity
  - Testing API endpoints with different tokens
  - Debugging authentication issues
- Remember to remove or secure this endpoint in production
- Consider adding token validation before making the request
- You may want to add query parameters to make the endpoint more flexible (e.g., for different city IDs) 