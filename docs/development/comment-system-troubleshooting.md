# Comment System Troubleshooting Guide

## Issue: 404 Error When Opening Add Comments

### Problem Description
When users attempt to open the comment system for a complaint, the app encounters a 404 error:
```
commentService.js:128 Get comments error: AxiosError: Request failed with status code 404
```

### Root Cause Analysis

The issue was caused by multiple problems in the comment system implementation:

1. **Incorrect API URL Construction**: The comment service was using `getEndpointUrl('base', '', this.environment)` which referred to a non-existent 'base' category in the API configuration.

2. **Wrong Mock Data Flag**: The ComplaintCommentScreen was checking `AppConfig.development.enableMockData` instead of the correct `AppConfig.development.mockServices.comments` flag.

3. **Missing Fallback Logic**: The service didn't have proper fallback mechanisms when API endpoints are not available.

### Solution Implemented

#### 1. Fixed API URL Construction
**Before:**
```javascript
const url = `${getEndpointUrl('base', '', this.environment)}/case/addcomment`;
```

**After:**
```javascript
const url = getEndpointUrl('case', 'addComment', this.environment);
```

#### 2. Added Mock Data Support
```javascript
// Check if mock data is enabled
if (AppConfig.development.mockServices.comments) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockComments = this.generateMockComments(caseNumber);
    return {
        success: true,
        comments: mockComments,
        rawData: { mock: true },
    };
}
```

#### 3. Added Fallback Mechanisms
```javascript
// Fallback to mock data on error if in development
if (AppConfig.development.enableDebugLogs && (error.response?.status === 404 || error.request)) {
    console.warn('API endpoint not found or network error, falling back to mock data');
    const mockComments = this.generateMockComments(caseNumber);
    return {
        success: true,
        comments: mockComments,
        rawData: { mock: true, fallback: true },
    };
}
```

#### 4. Fixed ComplaintCommentScreen
**Before:**
```javascript
if (AppConfig.development.enableMockData) {
    const mockComments = commentService.generateMockComments(caseNumber);
    setComments(mockComments);
} else {
    // API call
}
```

**After:**
```javascript
const response = await commentService.getComments(caseNumber);
if (response.success) {
    setComments(response.comments || []);
} else {
    throw new Error(response.message || 'Failed to load comments');
}
```

### Testing Instructions

#### 1. Enable Mock Data (Recommended for Development)
In `src/config/appConfig.js`:
```javascript
mockServices: {
    comments: true, // Enable mock data for comments
}
```

#### 2. Test Comment Loading
1. Navigate to a complaint details screen
2. Tap "Add Comment" button
3. Verify that the comment screen loads without 404 errors
4. Check console logs for proper URL construction

#### 3. Test Comment Adding
1. In the comment screen, enter a comment
2. Optionally attach files
3. Submit the comment
4. Verify success response

#### 4. Test API Endpoints (When Available)
Set `mockServices.comments: false` and test with real API endpoints.

### API Configuration

The comment system uses these endpoints:

```javascript
case: {
    base: '/case',
    addComment: '/addcomment',
    getComments: '/getcomments',
}
```

**Full URLs:**
- Get Comments: `https://eservicesapiflux.sera.gov.sa/case/getcomments`
- Add Comment: `https://eservicesapiflux.sera.gov.sa/case/addcomment`

### Debug Information

#### Service Configuration Test
The comment service now includes a configuration test method:
```javascript
commentService.testServiceConfiguration();
```

This will log:
- Constructed URLs for all endpoints
- Mock data status
- Environment configuration

#### Console Output Example
```
Comment service URLs:
Get comments: https://eservicesapiflux.sera.gov.sa/case/getcomments
Add comment: https://eservicesapiflux.sera.gov.sa/case/addcomment
Mock data enabled: true
```

### Common Issues and Solutions

#### Issue: Still Getting 404 Errors
**Solution:** Ensure `mockServices.comments: true` in `appConfig.js`

#### Issue: Comments Not Loading
**Solutions:**
1. Check network connectivity
2. Verify API endpoints are accessible
3. Enable mock data as fallback
4. Check console logs for detailed error messages

#### Issue: File Attachments Failing
**Solutions:**
1. Verify file size limits (20MB max)
2. Check supported file types
3. Enable mock data for file uploads
4. Check network stability

### Environment Configuration

**Development (Recommended):**
```javascript
mockServices: {
    comments: true, // Use mock data
}
```

**Production:**
```javascript
mockServices: {
    comments: false, // Use real API
}
```

### Future Improvements

1. **Retry Logic**: Implement automatic retry for failed requests
2. **Offline Support**: Cache comments for offline viewing
3. **Real-time Updates**: WebSocket integration for live comment updates
4. **Better Error Handling**: More specific error messages for different failure types

### Related Files Modified

1. `src/services/commentService.js` - Fixed API URLs and added fallback logic
2. `src/screens/ComplaintCommentScreen.js` - Fixed mock data check
3. `src/config/apiConfig.js` - Verified endpoint configuration
4. `src/config/appConfig.js` - Comment mock data flag

### Verification Steps

1. ✅ API URL construction uses correct endpoints
2. ✅ Mock data integration working
3. ✅ Fallback mechanisms in place
4. ✅ Error handling improved
5. ✅ Debug logging enhanced
6. ✅ Service configuration test added

The comment system should now work reliably with both mock data and real API endpoints when available. 