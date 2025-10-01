# Nafath Authentication API Documentation

## Overview

This document provides comprehensive details about the Nafath authentication endpoints used in the SERA Mobile application. Nafath is the Saudi government's digital identity platform that provides secure user authentication and identity verification.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [API Endpoints](#api-endpoints)
3. [Request/Response Examples](#requestresponse-examples)
6. [Status Codes](#status-codes)

---

## Authentication Flow

The Nafath authentication process follows this sequence:

1. **Login Initiation**: User enters national ID, app calls `LoginNafath`
2. **Status Polling**: App polls `CheckStatus` every 30ms for up to 2 minutes
3. **Completion**: On success, app receives `wToken` and user data
4. **Contact Validation**: App automatically validates user contact information
5. **Session Management**: App stores authentication data for subsequent API calls

---

## API Endpoints

### Base Configuration

- **Production Domain**: `https://eservicesapi.sera.gov.sa`
- **Base Path**: `/api/Nafath`

### 1. Login Nafath

**Purpose**: Initiate the Nafath authentication process

#### Endpoint Details
- **URL**: `POST /api/Nafath/LoginNafath`
- **Content-Type**: `application/json`
- **Timeout**: 30 seconds

#### Request Format
```json
{
  "id": "string"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | User's national ID (10 digits) |

#### Response Format
```json
{
  "transId": "string",
  "random": "string", 
  "status": "string"
}
```

#### Response Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `transId` | string | Transaction ID for status polling |
| `random` | string | Random string for authentication |
| `status` | string | Initial status (usually "PENDING") |

#### Example Request
```bash
curl -X POST "https://eservicesapi.sera.gov.sa/api/Nafath/LoginNafath" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1234567890"
  }'
```

#### Example Response
```json
{
  "transId": "TXN-2024-001-ABC123",
  "random": "RND-789-XYZ456",
  "status": "PENDING"
}
```

---

### 2. Check Status

**Purpose**: Poll the authentication status to check if user has completed verification

#### Endpoint Details
- **URL**: `POST /api/Nafath/CheckStatus`
- **Content-Type**: `application/json`
- **Timeout**: 30 seconds
- **Polling Interval**: 30ms (recommended)
- **Maximum Polling Time**: 1 minutes (60,000ms)

#### Request Format
```json
{
  "transId": "string",
  "random": "string",
  "id": "string"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transId` | string | Yes | Transaction ID from LoginNafath response |
| `random` | string | Yes | Random string from LoginNafath response |
| `id` | string | Yes | User's national ID |

#### Response Format
```json
{
  "status": "string",
  "wToken": "string",
  "userData": {
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
}
```

#### Response Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Authentication status (COMPLETED, EXPIRED, REJECTED, PENDING) |
| `wToken` | string | Authentication token (only present when status is COMPLETED) |
| `userData` | object | User information (only present when status is COMPLETED) |

#### User Data Fields
| Field | Type | Description |
|-------|------|-------------|
| `Id` | string | User's unique identifier |
| `BirthDate` | string | Birth date in Gregorian calendar |
| `BirthDateH` | string | Birth date in Hijri calendar |
| `ContactType` | string | Type of contact |
| `Email` | string | User's email address |
| `FName` | string | First name in English |
| `FNameT` | string | First name in Arabic |
| `LName` | string | Last name in English |
| `LNameT` | string | Last name in Arabic |
| `MName` | string | Middle name in English |
| `MNameT` | string | Middle name in Arabic |
| `MobilePhone` | string | Mobile phone number |
| `NIN` | string | National Identity Number |
| `Nationality` | string | User's nationality |
| `IdType` | string | Type of identification |
| `Image` | string | Base64 encoded user photo |

#### Example Request
```bash
curl -X POST "https://eservicesapi.sera.gov.sa/api/Nafath/CheckStatus" \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "TXN-2024-001-ABC123",
    "random": "RND-789-XYZ456",
    "id": "1234567890"
  }'
```

#### Example Response - Pending
```json
{
  "status": "PENDING"
}
```

#### Example Response - Completed
```json
{
  "status": "COMPLETED",
  "wToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userData": {
    "Id": "USER-12345",
    "BirthDate": "1990-01-15",
    "BirthDateH": "1410-06-18",
    "ContactType": "Individual",
    "Email": "user@example.com",
    "FName": "Ahmed",
    "FNameT": "أحمد",
    "LName": "Al-Saudi",
    "LNameT": "السعودي",
    "MName": "Mohammed",
    "MNameT": "محمد",
    "MobilePhone": "+966501234567",
    "NIN": "1234567890",
    "Nationality": "Saudi",
    "IdType": "National ID",
    "Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  }
}
```

#### Example Response - Expired
```json
{
  "status": "EXPIRED"
}
```

#### Example Response - Rejected
```json
{
  "status": "REJECTED"
}
```

---

### 3. User Info

**Purpose**: Retrieve authenticated user information using the wToken

#### Endpoint Details
- **URL**: `POST /api/Nafath/UserInfo`
- **Content-Type**: `application/json`
- **Timeout**: 30 seconds

#### Request Format
```json
{
  "token": "string"
}
```

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | Authentication token (wToken) from CheckStatus |

#### Response Format
```json
{
  "success": "boolean",
  "userInfo": {
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
  },
  "message": "string"
}
```

#### Example Request
```bash
curl -X POST "https://eservicesapi.sera.gov.sa/api/Nafath/UserInfo" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Example Response
```json
{
  "success": true,
  "userInfo": {
    "Id": "USER-12345",
    "BirthDate": "1990-01-15",
    "BirthDateH": "1410-06-18",
    "ContactType": "Individual",
    "Email": "user@example.com",
    "FName": "Ahmed",
    "FNameT": "أحمد",
    "LName": "Al-Saudi",
    "LNameT": "السعودي",
    "MName": "Mohammed",
    "MNameT": "محمد",
    "MobilePhone": "+966501234567",
    "NIN": "1234567890",
    "Nationality": "Saudi",
    "IdType": "National ID",
    "Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  },
  "message": "User information retrieved successfully"
}
```

---

## Request/Response Examples

### Complete Authentication Flow Example

#### Step 1: Login Initiation
```javascript
// Request
const loginResponse = await fetch('https://eservicesapi.sera.gov.sa/api/Nafath/LoginNafath', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: '1234567890'
  })
});

const loginData = await loginResponse.json();
// Response: { transId: "TXN-2024-001-ABC123", random: "RND-789-XYZ456", status: "PENDING" }
```

#### Step 2: Status Polling
```javascript
// Polling loop (simplified)
const startTime = Date.now();
const maxPollingTime = 120000; // 2 minutes

while (Date.now() - startTime < maxPollingTime) {
  const statusResponse = await fetch('https://eservicesapi.sera.gov.sa/api/Nafath/CheckStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transId: loginData.transId,
      random: loginData.random,
      id: '1234567890'
    })
  });

  const statusData = await statusResponse.json();
  
  if (statusData.status === 'COMPLETED') {
    // Authentication successful
    console.log('Authentication completed:', statusData);
    break;
  } else if (statusData.status === 'EXPIRED' || statusData.status === 'REJECTED') {
    // Authentication failed
    throw new Error('Authentication failed: ' + statusData.status);
  }
  
  // Wait 30ms before next poll
  await new Promise(resolve => setTimeout(resolve, 30));
}
```

#### Step 3: Get User Info (Optional)
```javascript
// Get additional user information
const userInfoResponse = await fetch('https://eservicesapi.sera.gov.sa/api/Nafath/UserInfo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: statusData.wToken
  })
});

const userInfo = await userInfoResponse.json();
// Response: { success: true, userInfo: {...}, message: "..." }
```

---


### API Error Responses

#### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Invalid national ID format",
  "details": {
    "field": "id",
    "code": "INVALID_FORMAT"
  }
}
```

#### Authentication Error
```json
{
  "success": false,
  "error": "Authentication failed",
  "message": "Invalid transaction ID",
  "code": "INVALID_TRANSACTION"
}
```

#### Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Service temporarily unavailable",
  "code": "SERVICE_UNAVAILABLE"
}
```



## Status Codes

### Authentication Status Values

| Status | Description | Action Required |
|--------|-------------|-----------------|
| `PENDING` | User has not yet completed verification | Continue polling |
| `COMPLETED` | User has successfully completed verification | Process success, store token |
| `EXPIRED` | Verification session has expired | Restart authentication process |
| `REJECTED` | User has rejected the verification | Show rejection message, restart process |

### Status Flow Diagram

```
PENDING → COMPLETED (Success)
    ↓
EXPIRED (Timeout)
    ↓
REJECTED (User Action)
```

---
