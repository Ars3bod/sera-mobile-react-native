# Complaints API Integration

## Overview

This document describes the integration between the SERA mobile app and the complaints API endpoints. The integration allows users to view their existing complaints fetched from the real SERA backend.

## Screen Integration Status

### 1. ViewComplaintsScreen (✅ Complete)

- Fetches and displays individual complaints with full details
- Filter functionality by status (all, open, closed, rejected)
- Pull-to-refresh support with error handling
- Configuration-driven data source selection

### 2. ComplaintsScreen (✅ Complete)

- Displays complaint counts in the "Your Complaints" section
- Real-time count updates when screen focuses
- Pull-to-refresh support for count updates
- Loading state with spinner during API calls
- Configuration-driven mode switching (real API vs mock data)

## Configuration

The integration can be controlled through the app configuration file at `src/config/appConfig.js`:

```javascript
const AppConfig = {
  api: {
    // Set to true to use mock data, false to use real API
    useMockData: false, // Change this to switch between modes
    defaultEnvironment: 'flux',
    requestTimeout: 30000,
  },
  development: {
    enableDebugLogs: __DEV__,
    mockServices: {
      complaints: false, // Set to true to force mock data for complaints only
    },
  },
  pagination: {
    defaultPageSize: 20,
  },
};
```

### Configuration Options

| Setting                               | Type    | Description                                 | Default   |
| ------------------------------------- | ------- | ------------------------------------------- | --------- |
| `api.useMockData`                     | boolean | Global switch for mock data                 | `false`   |
| `api.defaultEnvironment`              | string  | API environment ('prod' or 'flux')          | `'flux'`  |
| `api.requestTimeout`                  | number  | Request timeout in milliseconds             | `30000`   |
| `development.mockServices.complaints` | boolean | Force mock data for complaints service only | `false`   |
| `development.enableDebugLogs`         | boolean | Enable console logging                      | `__DEV__` |
| `pagination.defaultPageSize`          | number  | Default page size for API requests          | `20`      |

## API Endpoint

**URL**: `https://eservicesapiflux.sera.gov.sa/case/list`
**Method**: POST
**Environment**: Flux (staging)

## Request Format

```json
{
  "langCode": "1033",
  "cid": "3f2507b6-e436-f011-baff-aa5fa518ce00",
  "searchKey": "",
  "statusCode": "2",
  "desc": "",
  "pageNumber": "1",
  "pageSize": "20"
}
```

### Request Parameters

| Parameter    | Type   | Description                         | Values                              |
| ------------ | ------ | ----------------------------------- | ----------------------------------- |
| `langCode`   | string | Language code (hardcoded)           | "1033"                              |
| `cid`        | string | Contact ID from validatecontact API | UUID format                         |
| `searchKey`  | string | Search keyword (optional)           | Empty string                        |
| `statusCode` | string | Status filter                       | "1" (open), "2" (closed), "3" (all) |
| `desc`       | string | Description filter (optional)       | Empty string                        |
| `pageNumber` | string | Page number for pagination          | "1", "2", etc.                      |
| `pageSize`   | string | Number of items per page            | From config (default: "20")         |

## Response Format

```json
{
  "count": 1,
  "caseObjectResult": "[{\"CanReopen\":false,\"CaseId\":\"1b084b64-4239-f011-b81a-cb09d35d5038\",\"CaseNumber\":\"25010898\",\"CaseStage\":{\"Key\":\"266990001\",\"Value\":\"Complaint Check\"},\"CaseType\":{\"Key\":\"7cd56897-210c-ee11-bae7-00155d007258\",\"Value\":\"السلامة الكهربائية\"},\"ClosedDate\":null,\"CreationDate\":\"5\\/25\\/2025 8:29:37 AM\",\"Logo\":\"data:image\\/png;base64,...\",\"Status\":{\"Key\":\"under verification\",\"Value\":\"266990000\"}}]",
  "errorCode": null,
  "errorMessage": null,
  "success": true
}
```

## Data Mapping

The API response contains a JSON string in `caseObjectResult` that needs to be parsed. Each complaint object is mapped as follows:

| API Field         | App Field       | Description                            |
| ----------------- | --------------- | -------------------------------------- |
| `CaseId`          | `id`            | Unique case identifier                 |
| `CaseNumber`      | `caseNumber`    | Human-readable case number             |
| `CaseType.Value`  | `title`         | Complaint type/title                   |
| `CaseType.Value`  | `description`   | Complaint description                  |
| `Status.Key`      | `status`        | Mapped to 'open', 'closed', 'rejected' |
| `CaseStage.Value` | `stage`         | Current stage of the complaint         |
| `CreationDate`    | `dateSubmitted` | Date when complaint was created        |
| `ClosedDate`      | `closedDate`    | Date when complaint was closed         |
| `CanReopen`       | `canReopen`     | Whether complaint can be reopened      |

## Implementation Files

### Configuration

- **`src/config/appConfig.js`**: Central app configuration
  - Control mock vs real API usage
  - Set timeouts, page sizes, and other parameters
  - Enable/disable debug logging

### Service Layer

- **`src/services/complaintsService.js`**: Main service for API calls
  - `getComplaintsList()`: Fetch complaints with filtering
  - `parseComplaintsData()`: Parse API response data
  - `mapStatus()`: Map API status to UI status
  - `getStatusCodeForFilter()`: Convert UI filter to API status code

### UI Components

- **`src/screens/ViewComplaintsScreen.js`**: Screen for displaying complaints
  - Real API integration with fallback to mock data
  - Filter functionality (all, open, closed, rejected)
  - Pull-to-refresh support
  - Error handling with retry option
  - Configuration-driven data source selection

### Configuration

- **`src/config/apiConfig.js`**: API endpoint configuration
  - Added `case` category with `list`, `create`, `details` endpoints
  - Support for flux environment

## Data Flow

1. **User Authentication**: User logs in via Nafath
2. **Contact Validation**: `validatecontact` API is called, returns contact ID
3. **Contact ID Storage**: ID is stored in UserContext as `user.contactInfo.id`
4. **Configuration Check**: App checks config to determine data source
5. **Complaints Fetch**: Based on config, either real API or mock data is used
6. **Data Display**: Parsed complaints are displayed with appropriate filtering

## Status Mapping

| API Status           | UI Status  | Description                  |
| -------------------- | ---------- | ---------------------------- |
| "under verification" | "open"     | Complaint is being processed |
| "closed"             | "closed"   | Complaint has been resolved  |
| "rejected"           | "rejected" | Complaint was rejected       |

## Error Handling

The implementation includes comprehensive error handling:

- **Network Errors**: Fallback to mock data for presentation
- **Authentication Errors**: User is prompted to re-authenticate
- **API Errors**: Error message displayed with retry option
- **Parsing Errors**: Graceful fallback with console warnings

## Configuration Examples

### Using Real API (Production)

```javascript
// In src/config/appConfig.js
const AppConfig = {
  api: {
    useMockData: false,
    defaultEnvironment: 'prod',
  },
  development: {
    mockServices: {
      complaints: false,
    },
  },
};
```

### Using Mock Data (Demo/Testing)

```javascript
// In src/config/appConfig.js
const AppConfig = {
  api: {
    useMockData: true, // Global mock mode
    defaultEnvironment: 'flux',
  },
  // OR use service-specific mock:
  development: {
    mockServices: {
      complaints: true, // Only complaints use mock data
    },
  },
};
```

### Development with Debug Logging

```javascript
// In src/config/appConfig.js
const AppConfig = {
  api: {
    useMockData: false,
  },
  development: {
    enableDebugLogs: true, // Enable detailed logging
  },
};
```

## Usage Example

```javascript
import complaintsService from '../services/complaintsService';
import {useUser} from '../context/UserContext';
import AppConfig from '../config/appConfig';

const {user} = useUser();
const contactId = user?.contactInfo?.id;

// The service automatically uses config to determine data source
const response = await complaintsService.getComplaintsList({
  cid: contactId,
  statusCode: '3', // All complaints
  pageNumber: '1',
  pageSize: AppConfig.pagination.defaultPageSize.toString(),
});

if (response.success) {
  setComplaints(response.complaints);
}
```

## Testing

The integration can be tested in multiple ways:

1. **Real API**: Set `useMockData: false` in config
2. **Mock Data**: Set `useMockData: true` or `mockServices.complaints: true`
3. **Error Scenarios**: Network disconnection, invalid contact ID
4. **Filtering**: Test all status filters (all, open, closed, rejected)
5. **Configuration Changes**: Switch between modes by editing config file

## Future Enhancements

- **Complaint Details**: Individual complaint detail view
- **Complaint Creation**: Integration with complaint submission API
- **Real-time Updates**: WebSocket or polling for status updates
- **Offline Support**: Cache complaints for offline viewing
- **Search**: Full-text search within complaints
- **Pagination**: Implement infinite scroll or pagination

## Dependencies

- **axios**: HTTP client for API calls
- **@react-navigation/native**: Navigation between screens
- **react-i18next**: Internationalization support
- **@react-native-async-storage/async-storage**: User data persistence
