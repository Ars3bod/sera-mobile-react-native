# SERA Mobile App - API Integration Wiki

## Table of Contents
1. [Overview](#overview)
2. [Authentication & User Management](#authentication--user-management)
3. [Complaints Management](#complaints-management)
4. [Survey System](#survey-system)
5. [Comment System](#comment-system)
6. [Deep Linking](#deep-linking)
7. [Configuration & Environment](#configuration--environment)
8. [Error Handling & Data Flow](#error-handling--data-flow)
9. [Security & Best Practices](#security--best-practices)

---

## Overview

The SERA Mobile app integrates with multiple backend services to provide a comprehensive government service experience. The app follows a service-oriented architecture with centralized configuration and error handling.

### Key Features
- **Nafath Authentication**: Government digital identity verification
- **Complaints Management**: Create, view, and track complaints
- **Survey System**: Customer feedback collection
- **Comment System**: Communication between users and SERA
- **Multi-language Support**: Arabic and English with RTL support
- **File Attachments**: Support for document uploads

### Technology Stack
- **Frontend**: React Native with Expo
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Internationalization**: react-i18next
- **Environment**: Production (SERA) and Staging (Flux)

---

## Authentication & User Management

### 1. Nafath Authentication Service (`nafathService.js`)

#### Overview
Nafath is the Saudi government's digital identity platform. The app integrates with Nafath for secure user authentication and identity verification.

#### Endpoints

##### Login Nafath
- **URL**: `POST /api/Nafath/LoginNafath`
- **Purpose**: Initiate Nafath authentication process
- **Request Format**:
```json
{
  "id": "string" // User's national ID
}
```
- **Response Format**:
```json
{
  "transId": "string",
  "random": "string",
  "status": "string"
}
```

##### Check Status
- **URL**: `POST /api/Nafath/CheckStatus`
- **Purpose**: Poll authentication status
- **Request Format**:
```json
{
  "transId": "string",
  "random": "string", 
  "id": "string"
}
```
- **Response Format**:
```json
{
  "status": "COMPLETED|EXPIRED|REJECTED",
  "wToken": "string",
  "userData": "object"
}
```

##### User Info
- **URL**: `POST /api/Nafath/UserInfo`
- **Purpose**: Get authenticated user information
- **Request Format**:
```json
{
  "token": "string"
}
```

#### Data Flow
1. User enters national ID
2. App calls `LoginNafath` to initiate authentication
3. App polls `CheckStatus` every 30ms for up to 2 minutes
4. On completion, app stores `wToken` and user data
5. App calls contact validation service with user data

#### Business Logic
- **Timeout**: 2 minutes maximum polling time
- **Polling Interval**: 30ms between requests
- **Status Mapping**: 
  - `COMPLETED` → Success, store token
  - `EXPIRED` → Error, restart process
  - `REJECTED` → Error, show rejection message
- **Integration**: Automatically calls contact validation on success

### 2. Contact Validation Service (`contactService.js`)

#### Overview
Validates user contact information against SERA's database and retrieves additional user profile data.

#### Endpoints

##### Validate Contact
- **URL**: `POST /contact/validatecontact`
- **Purpose**: Validate user contact information
- **Request Format**:
```json
{
  "Id": "string",
  "BirthDate": "string",
  "BirthDateH": "string", 
  "ContactType": "string",
  "Email": "string",
  "FName": "string",
  "FNameT": "string",
  "LName": "string", 
  "LNameT": "string",
  "MName": "string",
  "MNameT": "string",
  "MobilePhone": "string",
  "NIN": "string",
  "Nationality": "string",
  "IdType": "string",
  "Image": "string"
}
```
- **Response Format**:
```json
{
  "isSuccess": "boolean",
  "message": "string", // JSON string containing user info
  "errorMessage": "string"
}
```

#### Data Mapping
- **Input**: Nafath user data
- **Output**: Enhanced user profile with contact validation
- **Key Fields**:
  - `MobilePhone` → `user.phone`
  - `Id` → `user.contactId`
  - `NIN` → `user.nationalId`

#### Business Logic
- **Environment**: Defaults to 'flux' environment
- **Validation**: Ensures all required fields are present
- **Integration**: Called automatically after successful Nafath authentication
- **Error Handling**: Graceful fallback if validation fails

---

## Complaints Management

### 1. Complaints Service (`complaintsService.js`)

#### Overview
Manages complaint viewing, searching, and status tracking. Provides comprehensive complaint lifecycle management.

#### Endpoints

##### Search Complaints
- **URL**: `POST /case/casesearch`
- **Purpose**: Get user's complaints list
- **Request Format**:
```json
{
  "langCode": "number", // 1025 (Arabic) or 1033 (English)
  "pageNumber": "number",
  "cid": "string", // Contact ID
  "pageSize": "number",
  "phoneNumber": "string",
  "nin": "string",
  "channel": "string" // Fixed: "a352fcbb-bb51-f011-b820-c260552d74b3"
}
```
- **Response Format**:
```json
{
  "success": "boolean",
  "count": "number",
  "caseObjectResult": "string" // JSON string containing complaints array
}
```

##### Get Complaint Details
- **URL**: `POST /case/details`
- **Purpose**: Get detailed information about a specific complaint
- **Request Format**:
```json
{
  "caseNumber": "string"
}
```
- **Response Format**:
```json
{
  "success": "boolean",
  "caseObjectResult": "string" // JSON string containing complaint details
}
```

##### Mark Result as Read
- **URL**: `POST /case/markresultread`
- **Purpose**: Mark complaint result as read
- **Request Format**:
```json
{
  "caseNumber": "string"
}
```

#### Data Mapping

##### Complaint List Mapping
```javascript
// API Response → UI Model
{
  CaseId → id,
  CaseNumber → caseNumber,
  CaseType.Value → title,
  Status.Value → status,
  Status.Key → statusValue,
  CreationDate → creationDate,
  CanReopen → canReopen
}
```

##### Status Mapping
- `1` → `open`
- `266990010` → `closed`
- `266990011` → `closed`
- Others → `open`

##### Priority Mapping
- Based on `CaseStage.Key`:
  - High priority stages → `high`
  - Medium priority stages → `medium`
  - Default → `low`

#### Business Logic
- **Pagination**: Default page size 99, supports custom pagination
- **Language Support**: Converts language codes (ar→1025, en→1033)
- **Status Categories**: 
  - Open: Under processing, checking complaint
  - Closed: Completed, closed as inquiry
- **Auto-read**: Automatically marks results as read for completed complaints
- **Mock Data**: Falls back to mock data on network errors

### 2. Complaint Creation Service (`complaintCreationService.js`)

#### Overview
Handles complaint creation, form data management, and file attachments.

#### Endpoints

##### Get Service Providers
- **URL**: `GET /against/list?PageSize=10&PageNumber=1`
- **Purpose**: Get list of electricity service providers
- **Response Format**:
```json
{
  "success": "boolean",
  "result": "array"
}
```

##### Get Consumption Categories
- **URL**: `GET /optionsets/nw_complainertype?lcid={langCode}`
- **Purpose**: Get customer type categories
- **Parameters**:
  - `lcid`: 1025 (Arabic) or 1033 (English)

##### Get Complaint Types
- **URL**: `GET /casetype/list?PageSize=100&PageNumber=1`
- **Purpose**: Get available complaint types
- **Response Format**:
```json
{
  "success": "boolean",
  "result": "array"
}
```

##### Check Field Visibility
- **URL**: `POST /case/showhideaccountorordernumber`
- **Purpose**: Determine which fields to show based on complaint type
- **Request Format**:
```json
{
  "caseTypeId": "string"
}
```

##### Create Complaint
- **URL**: `POST /case/createcase`
- **Purpose**: Submit new complaint
- **Request Format**:
```json
{
  // Complaint form data
  "attachmentsObject": "string" // XML format if attachments exist
}
```
- **Response Format**:
```json
{
  "success": "boolean",
  "caseId": "string",
  "message": "string",
  "surveyResponseId": "string"
}
```

##### Upload Attachment
- **URL**: `POST /attachment/uploadattachment`
- **Purpose**: Upload file attachments
- **Request Format**:
```json
{
  "fileNameWithExtention": "string",
  "titleInArabic": "string",
  "titleInEnglish": "string",
  "entitylogicalname": "ntw_case",
  "beneficiary": "string",
  "attachmentId": "ntw_attachments",
  "stepNumber": "0",
  "recordId": "string",
  "base64Data": "string",
  "token": "yI0vI0f4ba78wewqeWER$!!77"
}
```

##### Get Attachments
- **URL**: `POST /file/getattachmentsbyrecordid`
- **Purpose**: Retrieve attachments for a complaint
- **Request Format**:
```json
{
  "RecordId": "string",
  "Step": "number"
}
```

#### Data Flow
1. **Form Initialization**:
   - Load service providers
   - Load consumption categories
   - Load complaint types
2. **Dynamic Form**:
   - User selects complaint type
   - Check field visibility
   - Show/hide relevant fields
3. **File Upload**:
   - Validate file (type, size)
   - Convert to base64
   - Upload to server
4. **Complaint Submission**:
   - Validate form data
   - Create attachments XML
   - Submit complaint
   - Return case ID and survey response ID

#### Business Logic
- **File Validation**: 
  - Max size: 20MB
  - Allowed types: png, jpg, jpeg, pdf, doc, docx, zip, xls, xlsx, svg
- **Dynamic Forms**: Field visibility based on complaint type
- **Attachments**: XML format for multiple files
- **Survey Integration**: Returns survey response ID for feedback collection

---

## Survey System

### Survey Service (`surveyService.js`)

#### Overview
Manages customer feedback surveys with support for both complaint-related and standalone surveys.

#### Endpoints

##### Get Survey by Code
- **URL**: `GET /survey/getsurveybycode`
- **Purpose**: Retrieve survey questions and metadata
- **Parameters**:
  - `SurveyCode`: Survey identifier (e.g., 'SURV-1001')
  - `PageNumber`: 1
  - `PageSize`: 50
- **Response Format**:
```json
{
  "result": [
    {
      "ntw_surveyid": "string",
      "ntw_name": "string",
      "ntw_jsonmetadata": "string" // JSON string containing survey structure
    }
  ]
}
```

##### Get Survey Status
- **URL**: `GET /survey/GetStatusFullSurvey`
- **Purpose**: Check survey completion status
- **Parameters**:
  - `InvitationNumber`: Survey invitation identifier
- **Response Format**:
```json
{
  "statecode": "number", // 0 = active, 1 = inactive
  "statuscode": "number"
}
```

##### Update Survey Response
- **URL**: `POST /survey/updatesurveyresponse`
- **Purpose**: Submit survey responses for complaint-related surveys
- **Request Format**:
```json
{
  "json": "string", // Double-encoded JSON survey data
  "actionType": "string", // Action type GUID
  "surveyResponse": "string" // Survey response ID
}
```

##### Update Full Survey
- **URL**: `POST /survey/surveyupdatefullsurvey`
- **Purpose**: Submit standalone survey responses
- **Request Format**:
```json
{
  "json": "string", // Double-encoded JSON survey data
  "actionType": "string", // Action type GUID
  "surveyResponse": "string" // Invitation number
}
```

##### Get Action Types
- **URL**: `GET /lookupscode/listactiontypes`
- **Purpose**: Get available action types for surveys
- **Parameters**:
  - `PageNumber`: 1
  - `PageSize`: 100
- **Response Format**:
```json
{
  "result": [
    {
      "ntw_actiontypeid": "string",
      "ntw_name": "string"
    }
  ]
}
```

#### Data Mapping

##### Survey Metadata Parsing
```javascript
// Parse ntw_jsonmetadata string
const surveyMetadata = JSON.parse(ntw_jsonmetadata);

// Convert SurveyJS format to app format
{
  title → surveyData.title,
  elements → surveyData.questions,
  showQuestionNumbers → surveyData.showNumbers
}
```

##### Question Type Mapping
- `comment` → Text input
- `rating` → Star rating
- `boolean` → Yes/No
- `dropdown` → Select dropdown
- `radiogroup` → Radio buttons
- `checkbox` → Checkboxes

#### Business Logic
- **Double JSON Encoding**: Survey data is JSON.stringify() twice for safe transmission
- **Action Type Caching**: Action types are cached to avoid repeated API calls
- **SurveyJS Integration**: Converts SurveyJS format to app-compatible format
- **Fallback Handling**: Creates simple survey structure if metadata parsing fails
- **Mock Data Support**: Provides mock surveys for development

#### Data Flow
1. **Survey Loading**:
   - Get survey by code
   - Parse JSON metadata
   - Convert to app format
   - Cache action types
2. **Response Submission**:
   - Validate survey data
   - Double-encode JSON
   - Get action type GUID
   - Submit response
3. **Status Checking**:
   - Check if survey is active
   - Determine completion status

---

## Comment System

### Comment Service (`commentService.js`)

#### Overview
Manages communication between users and SERA through comments and file attachments on complaints.

#### Endpoints

##### Add Comment
- **URL**: `POST /case/addcomment`
- **Purpose**: Add a comment to a complaint
- **Request Format**:
```json
{
  "caseNumber": "string",
  "commentText": "string",
  "beneficiary": "string",
  "attachmentsObject": "string" // XML format if attachments exist
}
```
- **Response Format**:
```json
{
  "success": "boolean",
  "message": "string",
  "commentId": "string"
}
```

##### Get Comments
- **URL**: `POST /case/getcomments`
- **Purpose**: Retrieve comments for a complaint
- **Request Format**:
```json
{
  "caseNumber": "string"
}
```
- **Response Format**:
```json
{
  "success": "boolean",
  "comments": "array"
}
```

**Note**: The comment system includes comprehensive fallback mechanisms. When API endpoints return 404 errors or are unavailable, the service automatically falls back to mock data in development mode to ensure continuous functionality.

##### Upload Comment Attachment
- **URL**: `POST /attachment/uploadattachment`
- **Purpose**: Upload file attachments for comments
- **Request Format**:
```json
{
  "fileNameWithExtention": "string",
  "titleInArabic": "string",
  "titleInEnglish": "string",
  "entitylogicalname": "ntw_case",
  "beneficiary": "string",
  "attachmentId": "ntw_comments_attachments",
  "stepNumber": "1",
  "recordId": "string",
  "base64Data": "string",
  "token": "yI0vI0f4ba78wewqeWER$!!77"
}
```

#### Data Mapping

##### Comment Structure
```javascript
{
  id: "string",
  text: "string",
  author: "string",
  date: "ISO string",
  attachments: "array",
  isFromUser: "boolean"
}
```

##### Attachment XML Format
```xml
<?xml version="1.0" encoding="utf-16"?>
<ArrayOfAttachmentData xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <AttachmentData>
    <Name>filename.pdf</Name>
    <Type>application/pdf</Type>
    <Body>base64data</Body>
  </AttachmentData>
</ArrayOfAttachmentData>
```

#### Business Logic
- **File Validation**: Same as complaint attachments (20MB max, specific file types)
- **Step Numbering**: Comments use step 1, complaints use step 0
- **Attachment ID**: `ntw_comments_attachments` for comment-specific attachments
- **Mock Data**: Provides mock comments for development
- **Error Handling**: Graceful fallback for network issues

---

## Deep Linking

### Deep Link Service (`deepLinkService.js`)

#### Overview
Manages integration with the Nafath mobile app for seamless authentication flow.

#### Features

##### App Detection
- **iOS**: Check `nafath://` URL scheme
- **Android**: Multiple methods:
  - Package name: `sa.gov.nic.myid`
  - URL schemes: `nafath://`, `intent://sa.gov.nic.myid`
  - Universal link: `https://nafath.gov.sa`

##### App Launch
- **iOS**: Direct URL scheme launch
- **Android**: Multiple fallback methods:
  1. Package name launch
  2. Intent-based launch
  3. URL scheme launch

##### Store Redirection
- **iOS**: App Store link
- **Android**: Google Play Store link

#### Business Logic
- **Fallback Strategy**: Multiple launch methods for Android compatibility
- **Error Handling**: Graceful degradation if app not installed
- **Store Integration**: Automatic redirection to download Nafath app
- **Parameter Passing**: Support for query parameters in launch URLs

---

## Configuration & Environment

### API Configuration (`apiConfig.js`)

#### Environment Domains
- **Production**: `https://eservicesapi.sera.gov.sa`
- **Staging/Flux**: `https://eservicesapiflux.sera.gov.sa`

#### Endpoint Structure
```javascript
const API_ENDPOINTS = {
  nafath: {
    base: '/api/Nafath',
    loginNafath: '/LoginNafath',
    checkStatus: '/CheckStatus',
    userInfo: '/UserInfo',
  },
  contact: {
    base: '/contact',
    validateContact: '/validatecontact',
  },
  case: {
    base: '/case',
    search: '/casesearch',
    details: '/details',
    addComment: '/addcomment',
    getComments: '/getcomments',
    markResultRead: '/markresultread',
  },
  survey: {
    base: '/survey',
    getSurveyByCode: '/getsurveybycode',
    updateSurveyResponse: '/updatesurveyresponse',
    updateFullSurvey: '/surveyupdatefullsurvey',
  }
};
```

### App Configuration (`appConfig.js`)

#### Key Settings
```javascript
{
  api: {
    useMockData: false,
    defaultEnvironment: 'flux',
    requestTimeout: 30000,
  },
  development: {
    enableDebugLogs: __DEV__,
    mockServices: {
      complaints: false,
      complaintCreation: false,
      survey: false,
      comments: true,
    }
  }
}
```

---

## Error Handling & Data Flow

### Error Handling Strategy

#### Network Errors
- **Timeout**: 30 seconds default, 90 seconds for file uploads
- **Retry Logic**: No automatic retries, manual retry required
- **Fallback**: Mock data for development, error messages for production

#### API Errors
- **HTTP Status Codes**: Proper error message mapping
- **Validation Errors**: Field-specific error messages
- **Business Logic Errors**: Custom error messages from API

#### Data Flow Patterns

##### Authentication Flow 