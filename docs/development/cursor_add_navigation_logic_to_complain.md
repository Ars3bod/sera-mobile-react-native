

## API Integration Summary

### **Primary API Base URLs**
1. **`https://eservicesapiflux.sera.gov.sa`** - Main API for most business logic
2. **`https://eservicesapi.sera.gov.sa`** - Secondary API for authentication and some services

### **Authentication & Integration**

#### **Tawakkalna Integration**
- **Login Flow**: Uses Tawakkalna SDK (`window.TWK`) to get user data and authenticate
- **Token Generation**: `window.TWK.generateToken()` → `https://eservicesapi.sera.gov.sa/api/TawakkalnaService/LoginByTWK`
- **User Data**: Retrieves birth date, mobile number, full name, nationality, and user ID from Tawakkalna

#### **Contact Validation**
- **Endpoint**: `https://eservicesapiflux.sera.gov.sa/contact/validatecontact`
- **Purpose**: Validates user contact information using Tawakkalna data

### **Core API Endpoints by Category**

#### **Complaints Management**
- **List Complaints**: `https://eservicesapiflux.sera.gov.sa/case/casesearch`
- **Complaint Details**: `https://eservicesapiflux.sera.gov.sa/case/details`
- **Create Complaint**: `https://eservicesapiflux.sera.gov.sa/case/create`
- **Update Complaint**: `https://eservicesapiflux.sera.gov.sa/case/readresultupdate`
- **Complaint Stages**: `https://eservicesapiflux.sera.gov.sa/case/bpfstages`

#### **Inquiries Management**
- **List Inquiries**: `https://eservicesapiflux.sera.gov.sa/inquiry/list`
- **Inquiry Details**: `https://eservicesapiflux.sera.gov.sa/inquiry/details`
- **Create Inquiry**: `https://eservicesapiflux.sera.gov.sa/inquiry/create`
- **Inquiry Types**: `https://eservicesapiflux.sera.gov.sa/inquiry/types`

#### **Licenses & Permits**
- **Get Requests**: `https://eservicesapiflux.sera.gov.sa/licensesandpermitrequest/getrequestbyaccountid`
- **Get Pending Requests**: `https://eservicesapiflux.sera.gov.sa/licensesandpermitrequest/getrequestbycontactid`
- **Create District Cooling**: `https://eservicesapiflux.sera.gov.sa/licensesandpermitrequest/createdistrictcoolingrequest`
- **Submit Request**: `https://eservicesapiflux.sera.gov.sa/licensesandpermitrequest/ntw_licensespermitrequest/submitrequest`

#### **Account & Services**
- **Available Services**: `https://eservicesapiflux.sera.gov.sa/account/getserviceavailblebyaccount`
- **All Services**: `https://eservicesapiflux.sera.gov.sa/availableservices/availableservicesshow`
- **Delegated Accounts**: `https://eservicesapiflux.sera.gov.sa/account/getdelegatedcontactbyaccountid`

#### **Lookup & Configuration**
- **Lookup Codes**: `https://eservicesapiflux.sera.gov.sa/lookupscode/getbycode`
- **Action Types**: `https://eservicesapiflux.sera.gov.sa/lookupscode/listactiontypes`
- **Portal Configuration**: `https://eservicesapiflux.sera.gov.sa/portalconfiguration/getserviceproviderticketnumberisrequired`

#### **File Attachments**
- **Upload Attachment**: `https://eservicesapiflux.sera.gov.sa/attachment/uploadattachment`
- **Get Attachment**: `https://eservicesapiflux.sera.gov.sa/attachment/getattachment`
- **Get Attachments by Record**: `https://eservicesapiflux.sera.gov.sa/file/getattachmentsbyrecordid`

#### **Survey & Feedback**
- **Update Survey Response**: `https://eservicesapiflux.sera.gov.sa/survey/updatesurveyresponse`
- **Get Survey**: `https://eservicesapiflux.sera.gov.sa/survey/getsurveybycode`

### **Integration Patterns**

#### **Authentication Headers**
```typescript
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${cookies?.wact}`,
}
```

#### **API Function Wrapper**
The app uses a centralized `ApiFunction` utility in `src/globalFunctions/ApiFunction.tsx` that wraps axios calls with consistent error handling.

#### **Context Management**
- **Login Context**: Manages authentication state, tokens, and user data
- **API Endpoint Context**: Centralizes API endpoint configuration
- **Loading Context**: Manages loading states across the app

#### **Caching Strategy**
- Uses browser cache for dashboard data and table data
- Implements cache invalidation based on user ID changes

### **Key Features**
1. **Multi-language Support**: Arabic and English localization
2. **Dark Mode**: Configurable via LAUNCHPAYLOAD
3. **Responsive Design**: Mobile-first approach
4. **Real-time Updates**: Live status tracking for requests
5. **File Management**: Upload/download attachments
6. **Delegation System**: Account delegation capabilities

The app follows a RESTful API pattern with consistent error handling, loading states, and user feedback throughout the interface.

```typescript
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${cookies?.wact}`,
}
```

---

**User**

for the Core API Endpoints by Category
Complaints Management
 could you tell me more about the bussiness logic like what is the input param and the response data and thier meanings 

---

**Cursor**

I'll analyze the complaints management API endpoints in detail to understand the business logic, input parameters, and response data.


Based on my analysis of the complaints management API endpoints, here's a detailed breakdown of the business logic, input parameters, and response data:

## **Complaints Management API Endpoints - Detailed Analysis**

### **1. Case Search (`/case/casesearch`)**

**Purpose**: Search and retrieve complaints for a specific user

**Input Parameters**:
```typescript
{
  langCode: number,        // 1033 for English, 1025 for Arabic
  pageNumber: number,      // Pagination page number
  cid: string,            // Contact ID (user identifier)
  pageSize: number,       // Number of records per page (default: 99)
  caseNumber: string,     // Specific case number to search (optional)
  originatingNumber: string, // Original complaint number (optional)
  phoneNumber: string,    // User's phone number
  nin: string            // National ID number
}
```

**Response Data**:
```typescript
{
  caseObjectResult: string,  // JSON string containing complaint data
  count: number,            // Total number of complaints
  success: boolean
}
```

**Business Logic**:
- Validates user identity through Tawakkalna integration
- Returns paginated list of user's complaints
- Handles empty results with different status codes (`[]`, `null`, `null`)

---

### **2. Case Details (`/case/details`)**

**Purpose**: Get detailed information about a specific complaint

**Input Parameters**:
```typescript
{
  caseNumber: string      // Case number (e.g., "CN-000349")
}
```

**Response Data**:
```typescript
{
  caseObjectResult: string  // JSON string with detailed case information
}
```

**Parsed Response Structure**:
```typescript
{
  CaseId: string,                    // Internal case ID
  CaseNumber: string,               // Public case number
  Account: { Value: string },       // Service provider name
  Region: { Value: string },        // Region name
  City: { Value: string },          // City name
  Office: { Value: string },        // Office name
  OriginatingCaseNumber: string,    // Original complaint number
  CaseType: { Value: string },      // Type of complaint
  Description: string,              // Complaint description
  Attachment: Array,                // File attachments
  CompalintRegistered: string,      // Whether complaint registered with SP
  CouncilDescription: string,       // Service provider's response
  Comments: Array,                  // Case comments/updates
  ComplainterType: { Key: string, Value: string }, // Customer type
  ProcessingResult: { Value: string }, // Final decision
  ProcessingResultText: string,     // Detailed decision text
  Reopen: { IsReopen: string },     // Whether case can be reopened
  SurveyCode: string,               // Survey code for feedback
  SurveyResponseId: string,         // Survey response ID
  Status: { Key: string },          // Case status
  CaseStage: { Key: string },       // Current stage
  ResultReaded: boolean             // Whether result has been read
}
```

**Business Logic**:
- Retrieves comprehensive case information
- Automatically marks result as read if status is "266990011" or "266990015"
- Triggers read result update for unread cases

---

### **3. Create Case (`/case/createcase`)**

**Purpose**: Submit a new complaint

**Input Parameters** (varies by scenario):

**Scenario 1 - Offline Complaint with Previous Data**:
```typescript
{
  attachmentsObject: string | null,     // Base64 encoded attachments
  complainterType: string,              // Customer type ID
  beneficiary: string,                  // User's contact ID
  descriptionParam: string,             // Complaint description
  isThereAComplaintWithTheServiceProvider: boolean,
  isTheConsumerHasPriority: boolean,
  isThereComplaint: number,             // Always 1
  origatingCaseNumber: string,          // Original complaint number
  region: string,                       // Region GUID
  city: string,                         // City GUID
  office: string,                       // Office GUID
  caseType: string,                     // Case type GUID
  subCaseType: string,                  // Sub-case type GUID
  against: string                       // Service provider account ID
}
```

**Scenario 2 - New Complaint (Standard)**:
```typescript
{
  accountNumber?: string,               // Account number (if applicable)
  orderNumber?: string,                 // Order number (if applicable)
  attachmentsObject: string | null,
  complainterType: string,
  beneficiary: string,
  descriptionParam: string,
  isTheConsumerHasPriority: boolean,
  isThereComplaint: number,
  region: string,
  city: string,
  office: string,
  caseType: string,
  subCaseType: string,
  against: string,
  isThereAComplaintWithTheServiceProvider: boolean,
  origatingCaseNumber?: string
}
```

**Response Data**:
```typescript
{
  caseId: string,           // Newly created case ID
  surveyResponseId: string, // Survey response ID for feedback
  success: boolean,
  errorMessage?: string
}
```

**Business Logic**:
- Validates complaint data before submission
- Handles different service providers with specific region/city mappings
- Creates survey response for user feedback
- Logs errors for debugging purposes

---

### **4. Read Result Update (`/case/readresultupdate`)**

**Purpose**: Mark case result as read

**Input Parameters**:
```typescript
{
  caseNumber: string      // Case ID to mark as read
}
```

**Response**: Success/failure status

**Business Logic**:
- Updates case status to indicate result has been read
- Prevents duplicate read notifications

---

### **5. Case Stages (`/case/bpfstages`)**

**Purpose**: Get workflow stages for a complaint

**Input Parameters**:
```typescript
{
  CaseNumber: string      // Case number to get stages for
}
```

**Response Data**:
```typescript
{
  result: Array<{
    // Stage information including timestamps, status, etc.
  }>
}
```

**Business Logic**:
- Returns chronological workflow stages
- Used for process tracking and timeline display

---

### **6. Validate Case Exists (`/case/validatecaseexists`)**

**Purpose**: Check if a complaint number already exists

**Input Parameters**:
```typescript
{
  originatingCaseNumber: string,  // Complaint number to validate
  cid: string,                    // Contact ID
  against: string                 // Service provider ID
}
```

**Response Data**:
```typescript
{
  caseExists: boolean,    // Whether case already exists
  success: boolean,
  message?: string        // Error message if applicable
}
```

**Business Logic**:
- Prevents duplicate complaint submissions
- Validates complaint number format and existence

---

### **7. Show/Hide Account/Order Number (`/case/showhideaccountorordernumber`)**

**Purpose**: Determine if account/order number fields should be shown based on case type

**Input Parameters**:
```typescript
{
  caseTypeToCheck: string  // Case type to check
}
```

**Response Data**:
```typescript
{
  showAccountNumber: boolean,  // Whether to show account number field
  showOrderNumber: boolean     // Whether to show order number field
}
```

**Business Logic**:
- Dynamic form field visibility based on complaint type
- Improves user experience by showing relevant fields only

---

### **Key Business Rules**:

1. **Authentication**: All endpoints require valid user authentication via Tawakkalna
2. **Validation**: Multiple validation layers (client-side, server-side, business rules)
3. **Workflow**: Complaints follow a defined workflow with stages and status tracking
4. **Feedback**: Automatic survey generation for user feedback
5. **Attachments**: Support for file uploads with size and type validation
6. **Localization**: Full Arabic/English support with language-specific responses
7. **Error Handling**: Comprehensive error logging and user-friendly error messages
8. **Caching**: Dashboard and table data caching for performance
9. **Pagination**: Efficient data loading with pagination support
10. **Audit Trail**: Complete tracking of case changes and user interactions

This system provides a comprehensive complaint management solution with robust validation, workflow management, and user experience features.

```typescript
{
  langCode: number,        // 1033 for English, 1025 for Arabic
  pageNumber: number,      // Pagination page number
  cid: string,            // Contact ID (user identifier)
  pageSize: number,       // Number of records per page (default: 99)
  caseNumber: string,     // Specific case number to search (optional)
  originatingNumber: string, // Original complaint number (optional)
  phoneNumber: string,    // User's phone number
  nin: string            // National ID number
}
```

```typescript
{
  caseObjectResult: string,  // JSON string containing complaint data
  count: number,            // Total number of complaints
  success: boolean
}
```

```typescript
{
  caseNumber: string      // Case number (e.g., "CN-000349")
}
```

```typescript
{
  caseObjectResult: string  // JSON string with detailed case information
}
```

```typescript
{
  CaseId: string,                    // Internal case ID
  CaseNumber: string,               // Public case number
  Account: { Value: string },       // Service provider name
  Region: { Value: string },        // Region name
  City: { Value: string },          // City name
  Office: { Value: string },        // Office name
  OriginatingCaseNumber: string,    // Original complaint number
  CaseType: { Value: string },      // Type of complaint
  Description: string,              // Complaint description
  Attachment: Array,                // File attachments
  CompalintRegistered: string,      // Whether complaint registered with SP
  CouncilDescription: string,       // Service provider's response
  Comments: Array,                  // Case comments/updates
  ComplainterType: { Key: string, Value: string }, // Customer type
  ProcessingResult: { Value: string }, // Final decision
  ProcessingResultText: string,     // Detailed decision text
  Reopen: { IsReopen: string },     // Whether case can be reopened
  SurveyCode: string,               // Survey code for feedback
  SurveyResponseId: string,         // Survey response ID
  Status: { Key: string },          // Case status
  CaseStage: { Key: string },       // Current stage
  ResultReaded: boolean             // Whether result has been read
}
```

```typescript
{
  attachmentsObject: string | null,     // Base64 encoded attachments
  complainterType: string,              // Customer type ID
  beneficiary: string,                  // User's contact ID
  descriptionParam: string,             // Complaint description
  isThereAComplaintWithTheServiceProvider: boolean,
  isTheConsumerHasPriority: boolean,
  isThereComplaint: number,             // Always 1
  origatingCaseNumber: string,          // Original complaint number
  region: string,                       // Region GUID
  city: string,                         // City GUID
  office: string,                       // Office GUID
  caseType: string,                     // Case type GUID
  subCaseType: string,                  // Sub-case type GUID
  against: string                       // Service provider account ID
}
```

```typescript
{
  accountNumber?: string,               // Account number (if applicable)
  orderNumber?: string,                 // Order number (if applicable)
  attachmentsObject: string | null,
  complainterType: string,
  beneficiary: string,
  descriptionParam: string,
  isTheConsumerHasPriority: boolean,
  isThereComplaint: number,
  region: string,
  city: string,
  office: string,
  caseType: string,
  subCaseType: string,
  against: string,
  isThereAComplaintWithTheServiceProvider: boolean,
  origatingCaseNumber?: string
}
```

```typescript
{
  caseId: string,           // Newly created case ID
  surveyResponseId: string, // Survey response ID for feedback
  success: boolean,
  errorMessage?: string
}
```

```typescript
{
  caseNumber: string      // Case ID to mark as read
}
```

```typescript
{
  CaseNumber: string      // Case number to get stages for
}
```

```typescript
{
  result: Array<{
    // Stage information including timestamps, status, etc.
  }>
}
```

```typescript
{
  originatingCaseNumber: string,  // Complaint number to validate
  cid: string,                    // Contact ID
  against: string                 // Service provider ID
}
```

```typescript
{
  caseExists: boolean,    // Whether case already exists
  success: boolean,
  message?: string        // Error message if applicable
}
```

```typescript
{
  caseTypeToCheck: string  // Case type to check
}
```

```typescript
{
  showAccountNumber: boolean,  // Whether to show account number field
  showOrderNumber: boolean     // Whether to show order number field
}
```

---

**User**

what about File Attachments endpoints

---

**Cursor**

I'll analyze the file attachments endpoints in detail to understand their business logic, input parameters, and response data.


Based on my analysis of the file attachments endpoints, here's a comprehensive breakdown of the business logic, input parameters, and response data:

## **File Attachments API Endpoints - Detailed Analysis**

### **1. Upload Attachment (`/attachment/uploadattachment`)**

**Purpose**: Upload files to the system for various entities (complaints, requests, etc.)

**Input Parameters**:
```typescript
{
  fileNameWithExtention: string,    // File name with extension (spaces replaced with underscores)
  titleInArabic: string,           // File title in Arabic
  titleInEnglish: string,          // File title in English
  entitylogicalname: string,       // Entity type (e.g., "ntw_licensespermitrequest")
  beneficiary: string,             // User's contact ID
  attachmentId: string,            // Specific attachment field ID
  stepNumber: string,              // Step number in multi-step forms
  recordId: string,                // Record ID (request ID or case ID)
  base64Data: string,              // Base64 encoded file content (without data: prefix)
  token: string                    // Authentication token (hardcoded: "yI0vI0f4ba78wewqeWER$!!77")
}
```

**Response Data**:
```typescript
{
  isSuccess: boolean,              // Upload success status
  errorMessage?: string           // Error message if upload fails
}
```

**Business Logic**:
- **File Validation**: 
  - Valid extensions: `png`, `jpg`, `jpeg`, `pdf`, `doc`, `docx`, `zip`, `xls`, `xlsx`, `svg`
  - Maximum file size: 20MB
  - File name sanitization (spaces replaced with underscores)
- **Base64 Processing**: Removes data URL prefix before sending
- **Entity Association**: Links files to specific entities and steps
- **Multi-language Support**: Stores titles in both Arabic and English

---

### **2. Get Attachment (`/attachment/getattachment`)**

**Purpose**: Download/retrieve uploaded files

**Input Parameters**:
```typescript
{
  restAPI: string,                 // External API endpoint: "https://eservicesapi.sera.gov.sa/api/Attachments/GetAttachment"
  token: string,                   // Authentication token
  attachmentFilePath: string       // File path on server
}
```

**Response Data**:
```typescript
{
  base64Data: string,              // Base64 encoded file content
  fileName?: string,               // Original file name
  fileSize?: number               // File size in bytes
}
```

**Business Logic**:
- **Base64 to Blob Conversion**: Converts base64 data to downloadable blob
- **Chunked Processing**: Processes large files in 512-byte chunks
- **Automatic Download**: Creates temporary download link and triggers download
- **File Type Detection**: Preserves original file type for proper MIME handling

---

### **3. Get Attachments by Record ID (`/file/getattachmentsbyrecordid`)**

**Purpose**: Retrieve all attachments for a specific record and step

**Input Parameters**:
```typescript
{
  RecordId: string,                // Record ID (request ID or case ID)
  Step: number                     // Step number (0 for general, 1-7 for specific steps)
}
```

**Response Data**:
```typescript
{
  result: Array<{
    ntw_attachmentid: string,      // Attachment field ID
    ntws_titlear: string,          // Arabic title
    ntws_titleen: string,          // English title
    ntws_filename: string,         // Original file name
    ntws_filepath: string,         // Server file path
    ntws_filesize?: number,        // File size
    ntws_uploaddate?: string,      // Upload date
    ntws_filetype?: string         // File type/MIME type
  }>
}
```

**Business Logic**:
- **Step-based Organization**: Groups attachments by form steps
- **Field Mapping**: Maps attachments to specific form fields
- **Status Tracking**: Updates UI to show uploaded vs. pending attachments
- **Multi-language Display**: Shows titles in user's preferred language

---

### **4. Delete Attachment (`/attachment/deleteattachment`)**

**Purpose**: Remove uploaded files from the system

**Input Parameters**:
```typescript
{
  restApiUrl: string,              // External API endpoint: "https://eservicesapi.sera.gov.sa/api/Attachments/RemoveAttachment"
  token: string,                   // Authentication token
  filePath: string                 // File path to delete
}
```

**Response Data**:
```typescript
{
  success: boolean,                // Deletion success status
  message?: string                // Success/error message
}
```

**Business Logic**:
- **Server-side Deletion**: Removes file from storage
- **UI State Update**: Updates attachment status in interface
- **Permission Validation**: Ensures user has rights to delete file
- **Error Handling**: Graceful handling of deletion failures

---

### **5. File Validation & Processing**

**Supported File Types**:
```typescript
const validExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'zip', 'xls', 'xlsx', 'svg'];
const supportedMimeTypes = [
  'image/jpeg', 'image/png', 'application/pdf', 
  'application/msword', 'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
```

**File Size Limits**:
- **Individual Files**: 20MB maximum
- **Total Upload Size**: 20MB maximum per form
- **Chunked Processing**: 512-byte chunks for large files

---

### **6. Attachment Integration Patterns**

**Complaints Integration**:
```typescript
// XML format for complaint attachments
const xmlFormat = `<?xml version="1.0" encoding="utf-16"?>
<ArrayOfAttachmentData xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <AttachmentData>
    <Name>${fileName}</Name>
    <Type>${fileType}</Type>
    <Body>${base64Data}</Body>
  </AttachmentData>
</ArrayOfAttachmentData>`;
```

**Multi-step Form Integration**:
- Each step can have multiple attachment fields
- Attachments are linked to specific form steps
- Progress tracking includes attachment completion status

---

### **7. UI Components & Features**

**File Upload Interface**:
- **Drag & Drop**: Visual file upload area
- **Progress Indicators**: Loading spinners during upload
- **File Type Icons**: Visual indicators for different file types
- **Size Validation**: Real-time file size checking
- **Error Handling**: User-friendly error messages

**File Management**:
- **Download**: One-click file download
- **Preview**: In-browser file preview (where supported)
- **Delete**: Remove uploaded files
- **Replace**: Upload new file to replace existing one

**File Type Mapping**:
```typescript
const fileExtensionToLogo = {
  pdf: PDFLogo,
  jpg: ImageLogo,
  jpeg: ImageLogo,
  png: ImageLogo,
  doc: DocLogo,
  docx: DocsLogo,
  zip: zipLogo,
  xls: xlsLogo,
  xlsx: xlsLogo,
  svg: ImageLogo
};
```

---

### **8. Security & Authentication**

**Token-based Authentication**:
- Hardcoded token: `"yI0vI0f4ba78wewqeWER$!!77"`
- Used for all attachment operations
- Server-side validation of file access permissions

**File Security**:
- **Path Validation**: Prevents directory traversal attacks
- **Type Validation**: Whitelist of allowed file types
- **Size Limits**: Prevents DoS attacks through large files
- **Content Validation**: Base64 encoding validation

---

### **9. Error Handling & Recovery**

**Upload Errors**:
- File size exceeded
- Invalid file type
- Network connectivity issues
- Server storage full

**Download Errors**:
- File not found
- Access denied
- Corrupted file data
- Network timeout

**Recovery Mechanisms**:
- Automatic retry for network issues
- Graceful degradation for unsupported file types
- User-friendly error messages
- Fallback to alternative download methods

---

### **10. Performance Optimizations**

**Client-side Optimizations**:
- **Chunked Processing**: Large files processed in chunks
- **Base64 Optimization**: Efficient encoding/decoding
- **Memory Management**: Proper cleanup of blob URLs
- **Lazy Loading**: Attachments loaded on demand

**Server-side Optimizations**:
- **Caching**: Frequently accessed files cached
- **Compression**: File compression for storage efficiency
- **CDN Integration**: Content delivery network for faster downloads
- **Database Indexing**: Optimized queries for attachment metadata

This comprehensive file attachment system provides robust file management capabilities with proper validation, security, and user experience features across the entire application.

```typescript
{
  fileNameWithExtention: string,    // File name with extension (spaces replaced with underscores)
  titleInArabic: string,           // File title in Arabic
  titleInEnglish: string,          // File title in English
  entitylogicalname: string,       // Entity type (e.g., "ntw_licensespermitrequest")
  beneficiary: string,             // User's contact ID
  attachmentId: string,            // Specific attachment field ID
  stepNumber: string,              // Step number in multi-step forms
  recordId: string,                // Record ID (request ID or case ID)
  base64Data: string,              // Base64 encoded file content (without data: prefix)
  token: string                    // Authentication token (hardcoded: "yI0vI0f4ba78wewqeWER$!!77")
}
```

```typescript
{
  isSuccess: boolean,              // Upload success status
  errorMessage?: string           // Error message if upload fails
}
```

```typescript
{
  restAPI: string,                 // External API endpoint: "https://eservicesapi.sera.gov.sa/api/Attachments/GetAttachment"
  token: string,                   // Authentication token
  attachmentFilePath: string       // File path on server
}
```

```typescript
{
  base64Data: string,              // Base64 encoded file content
  fileName?: string,               // Original file name
  fileSize?: number               // File size in bytes
}
```

```typescript
{
  RecordId: string,                // Record ID (request ID or case ID)
  Step: number                     // Step number (0 for general, 1-7 for specific steps)
}
```

```typescript
{
  result: Array<{
    ntw_attachmentid: string,      // Attachment field ID
    ntws_titlear: string,          // Arabic title
    ntws_titleen: string,          // English title
    ntws_filename: string,         // Original file name
    ntws_filepath: string,         // Server file path
    ntws_filesize?: number,        // File size
    ntws_uploaddate?: string,      // Upload date
    ntws_filetype?: string         // File type/MIME type
  }>
}
```

```typescript
{
  restApiUrl: string,              // External API endpoint: "https://eservicesapi.sera.gov.sa/api/Attachments/RemoveAttachment"
  token: string,                   // Authentication token
  filePath: string                 // File path to delete
}
```

```typescript
{
  success: boolean,                // Deletion success status
  message?: string                // Success/error message
}
```

```typescript
const validExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'zip', 'xls', 'xlsx', 'svg'];
const supportedMimeTypes = [
  'image/jpeg', 'image/png', 'application/pdf', 
  'application/msword', 'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
```

```typescript
// XML format for complaint attachments
const xmlFormat = `<?xml version="1.0" encoding="utf-16"?>
<ArrayOfAttachmentData xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <AttachmentData>
    <Name>${fileName}</Name>
    <Type>${fileType}</Type>
    <Body>${base64Data}</Body>
  </AttachmentData>
</ArrayOfAttachmentData>`;
```

```typescript
const fileExtensionToLogo = {
  pdf: PDFLogo,
  jpg: ImageLogo,
  jpeg: ImageLogo,
  png: ImageLogo,
  doc: DocLogo,
  docx: DocsLogo,
  zip: zipLogo,
  xls: xlsLogo,
  xlsx: xlsLogo,
  svg: ImageLogo
};
```

---

**User**

what are the cases status codes and thier meaning 

---

**Cursor**

I'll analyze the codebase to find the case status codes and their meanings.


Based on my analysis of the codebase, here's a comprehensive breakdown of the case status codes and their meanings:

## **Case Status Codes and Their Meanings**

### **Primary Status Codes (from CodeMap.tsx)**

| **Code** | **Arabic Meaning** | **English Meaning** | **Business Logic** |
|----------|-------------------|-------------------|-------------------|
| **1** | قيد التحقق | Under Verification | Initial verification stage |
| **2** | غير نشط | Inactive | Case is inactive |
| **266990000** | بإنتظار الإفادة من مزود الخدمة | Waiting for statement from service provider | Awaiting provider response |
| **266990001** | بإنتظار الإفادة من المستفيد | Waiting for statement from beneficiary | Awaiting customer response |
| **266990002** | بإنتظار الاستشارة | Awaiting consultation | Waiting for consultation |
| **266990003** | بإنتظار الرد | Waiting for feedback | Awaiting response |
| **266990004** | بإنتظار الإفادة | Waiting for statement | Awaiting statement |
| **266990005** | مغلق كاستفسار | Closed as inquiry | Case closed as inquiry |
| **266990006** | في انتظار الاغلاق | Waiting to be closed | Pending closure |
| **266990007** | تم استلام الشكوى | Complaint received | Case received and acknowledged |
| **266990008** | معالجة الشكوى | Complaint handling | Case under processing |
| **266990009** | طلب استفسار | Inquiry request | Converted to inquiry |
| **266990010** | التحقق من الشكوى | Checking complaint | Under investigation |
| **266990011** | تمت إعادة فتح الشكوى | Complaint re-opened | Case reopened |
| **266990012** | استشارة معلقة | Pending consultancy | Consultation pending |
| **266990013** | تم حل الاستشارة | Consultancy resolved | Consultation completed |
| **266990014** | مغلقة | Closed | Case closed |
| **266990015** | مغلق كاستفسار | Closed as inquiry | Closed as inquiry |
| **266990016** | - | - | Not defined in current mapping |
| **266990017** | - | - | Not defined in current mapping |
| **266990018** | - | - | Not defined in current mapping |

### **Simplified Status Mapping (Updated Version)**

The app uses a simplified mapping for better user experience:

| **Code** | **Simplified Arabic** | **Simplified English** | **Category** |
|----------|---------------------|----------------------|-------------|
| **1** | قيد التحقق | Under Verification | Verification |
| **266990001** | بانتظار الافادة | Waiting for statement | Pending |
| **266990005** | مغلق كاستفسار | Closed as inquiry | Closed |
| **266990010** | قيد التحقق | Under Verification | Verification |
| **266990011** | مغلقة | Closed | Closed |
| **266990012** | شكوى معاد فتحها | Re-opened complaint | Reopened |
| **266990015** | مغلق كاستفسار | Closed as inquiry | Closed |
| **Others** | قيد المعالجة | Under Processing | Processing |

### **Status-Based Business Logic**

#### **Reopening Logic**
- **Code 266990010** with `CanReopen: true` → Allow reopening with reason
- **Code 266990010** with `CanReopen: false` → Show warning modal
- **Code 266990007** → Navigate to statement page

#### **Action Availability**
- **Comment Button**: Available for all statuses except 266990015, 266990011, 266990005
- **View Result Button**: Available for status 266990010
- **Process Flow Button**: Available for all cases

#### **Status Colors (Inquiry Status)**
- **"1"** → Green (#3ACE6F) - Active
- **"266990000"** → Orange (#FFC48B) - Pending
- **"266990002"** → Red (#FF5252) - Closed

### **Status Retrieval Process**

The app fetches status mappings dynamically from the API:

```typescript
// API Endpoint: /inquiry/types
{
  "languageCode": 1025, // Arabic: 1025, English: 1033
  "valueCode": 0,
  "attributeName": "nw_casestatusreason",
  "entityName": "nw_case"
}
```

This ensures that status meanings are always up-to-date and localized according to the user's language preference.

### **Key Business Rules**

1. **Verification Stage**: Cases start with status 1 (Under Verification)
2. **Processing Stage**: Most cases move through various processing statuses (266990007-266990010)
3. **Closure**: Cases can be closed as resolved (266990011) or as inquiry (266990005)
4. **Reopening**: Only certain closed cases can be reopened based on `CanReopen` flag
5. **Statements**: Cases in status 266990007 require customer statements

This status system provides a comprehensive workflow for complaint management from initial submission through resolution or closure.

```typescript
// API Endpoint: /inquiry/types
{
  "languageCode": 1025, // Arabic: 1025, English: 1033
  "valueCode": 0,
  "attributeName": "nw_casestatusreason",
  "entityName": "nw_case"
}
```

# Complete Survey System Logic

## 1. Survey Architecture Overview

The survey system uses the **SurveyJS**  and integrates with a backend API system. The system supports both:

- **Standalone surveys** 
- **Embedded surveys** 

---

## 2. Core API Endpoints

// Get Survey Questions
GET: https://eservicesapiflux.sera.gov.sa/survey/getsurveybycode?SurveyCode={code}

// Get Survey Status
GET: https://eservicesapiflux.sera.gov.sa/survey/GetStatusFullSurvey?InvitationNumber={number}

// Update Survey Response (for embedded surveys)
POST: https://eservicesapiflux.sera.gov.sa/survey/updatesurveyresponse

// Update Full Survey (for standalone surveys)
POST: https://eservicesapiflux.sera.gov.sa/survey/surveyupdatefullsurvey

// Get Action Types
GET: https://eservicesapiflux.sera.gov.sa/lookupscode/listactiontypes



---

## 3. Survey Flow Types

### A. Embedded Surveys (In-App)

These appear as **modals** within the main application.

#### Trigger Points:

- After successful complaint submission 
- After successful inquiry submission 
- During complaint processing 
- In inquiry results 

#### Flow:

1. **Survey Response ID Generation**: When a complaint/inquiry is created, the backend returns a `surveyResponseId`
2. **Action Types Fetching**: System fetches available action types (Confirmed, Rejected, Cancelled, etc.)
3. **Survey Questions Loading**: Fetches survey JSON metadata using `SurveyCode`
4. **User Interaction**: User fills out the survey
5. **Submission**: On completion, sends data with appropriate action type

---

### B. Standalone Surveys (External)

Accessed via direct **URL** with parameters.

#### URL Structure:

Apply to :
/survey?SurveyCode={code}&InvitationNumber={number}


Flow:
Status Validation: Checks if survey is active using InvitationNumber
Questions Loading: Fetches survey questions if active
Real-time Updates: Saves progress on each page change
Final Submission: Sends completed survey data
4. Action Types System
The system uses predefined action types to track survey states:
// Common Action Types
- "Confirmed": User completed survey positively
- "Rejected": User declined to take survey  
- "Cancelled": User started but didn't complete
- "New Confirm": User is progressing through survey

6. Integration Points
Complaint Flow:
User submits complaint → Backend creates case + survey response
Success modal shows → User chooses to evaluate or decline
If evaluate → Opens EvaluationForm modal with survey
Survey completion → Updates survey response with results
Inquiry Flow:
User submits inquiry → Backend creates inquiry + survey response
Success modal shows → User chooses to evaluate or decline
If evaluate → Opens InquiryEvaluationForm modal
Survey completion → Updates survey response with results
7. Survey States & Error Handling
States:
isActive: Whether survey can be taken (statecode === 0)
initialDataLoaded: Whether initial data has been fetched
error: Error state for failed API calls
Error Scenarios:
No invitation number provided
Survey not found or inactive
API connection failures
Invalid survey response ID
8. UI Components
Survey Components:
Survey from survey-react-ui: Main survey renderer
Model from survey-core: Survey data model
Custom styling via SurveyAppSass.scss
Modal Integration:
Bootstrap modals for embedded surveys
Custom success/error messages
Loading states and animations
9. Survey Codes
Different survey types use specific codes:
SURV-1001: Complaint evaluation survey
SURV-1002: Inquiry evaluation survey
Dynamic codes for other survey types
10. Real-time Features
Progress Saving:
Saves survey progress on each page change
Uses "New Confirm" action type for partial saves
Prevents data loss if user navigates away
