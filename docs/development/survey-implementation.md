# Survey System Implementation

## Overview

The SERA Mobile app now includes a comprehensive survey system that allows users to provide feedback on complaints and other services. The implementation supports both embedded surveys (within the app) and standalone surveys (external URLs) based on the survey system architecture.

## Features Implemented

### 1. Survey Service (`src/services/surveyService.js`)

**API Endpoints:**
- `GET /survey/getsurveybycode?SurveyCode={code}` - Get survey questions
- `GET /survey/GetStatusFullSurvey?InvitationNumber={number}` - Get survey status  
- `POST /survey/updatesurveyresponse` - Update survey response (embedded surveys)
- `POST /survey/surveyupdatefullsurvey` - Update full survey (standalone surveys)
- `GET /lookupscode/listactiontypes` - Get action types

**Key Methods:**
- `getSurvey(surveyCode)` - Main method with mock fallback
- `getSurveyStatus(invitationNumber)` - Check if survey is active
- `updateSurveyResponse(surveyResponseData)` - For embedded surveys
- `updateFullSurvey(fullSurveyData)` - For standalone surveys
- `getAvailableActionTypes()` - Get survey action types

**Mock Data Support:**
- Configurable via `AppConfig.development.mockServices.survey`
- Includes sample surveys for both complaint and inquiry evaluation
- Supports Arabic and English question formats

### 2. Survey Modal Component (`src/components/SurveyModal.js`)

**Features:**
- Modal-based survey interface for embedded surveys
- Multi-page survey support with progress indicator
- Question types: radio groups, ratings (star-based), comments
- Real-time validation and progress tracking
- RTL support for Arabic content
- Auto-save functionality (not yet implemented in modal)

**Props:**
- `visible` - Modal visibility state
- `surveyCode` - Survey code (e.g., 'SURV-1001')
- `surveyResponseId` - Survey response ID from complaint creation
- `onSurveyComplete` - Callback when survey is completed
- `title` - Custom survey title
- `description` - Custom survey description

### 3. Survey Screen (`src/screens/SurveyScreen.js`)

**Features:**
- Full-screen survey interface for standalone surveys  
- URL structure: `/survey?SurveyCode={code}&InvitationNumber={number}`
- Progress auto-save on page changes
- Survey status validation before loading
- Navigation restrictions and cancellation handling
- Session activity tracking integration

**Navigation:**
- Route name: `Survey`
- Parameters: `{ surveyCode, invitationNumber }`
- Integrated into AppNavigator.js

### 4. Integration Points

**ComplaintDetailsScreen Integration:**
- Survey button appears when `complaint.SurveyCode` exists
- Opens SurveyModal when `complaint.SurveyResponseId` is available
- Fallback alert for surveys without response ID
- Refreshes complaint data after survey completion

**i18n Support:**
- Complete English and Arabic translations
- Survey-specific error messages and UI text
- Progress indicators and button labels
- Dynamic question text based on language

## Survey Flow Types

### A. Embedded Surveys (Modal)

**Trigger Points:**
- After successful complaint submission
- From complaint details screen
- During complaint processing
- In inquiry results

**Flow:**
1. User submits complaint → Backend returns `surveyResponseId`
2. Success modal shows → User chooses to evaluate
3. SurveyModal opens with survey questions
4. User completes survey → Sends response with 'Confirmed' action
5. Modal closes and shows completion message

### B. Standalone Surveys (Screen)

**URL Structure:**
```
/survey?SurveyCode={code}&InvitationNumber={number}
```

**Flow:**
1. User opens survey URL with parameters
2. System validates survey status using `InvitationNumber`
3. If active, loads survey questions
4. Auto-saves progress with 'New Confirm' action on page changes
5. Final submission with 'Confirmed' action
6. Navigation back to previous screen

## Question Types Supported

### 1. Radio Group Questions
```javascript
{
  name: 'satisfaction',
  title: { en: 'How satisfied are you?', ar: 'ما مدى رضاك؟' },
  type: 'radiogroup',
  choices: [
    { value: 'very_satisfied', text: { en: 'Very Satisfied', ar: 'راضٍ جداً' } }
  ],
  isRequired: true
}
```

### 2. Rating Questions (Star-based)
```javascript
{
  name: 'response_time',
  title: { en: 'Rate the response time', ar: 'قيم وقت الاستجابة' },
  type: 'rating',
  rateMin: 1,
  rateMax: 5,
  minRateDescription: { en: 'Very Slow', ar: 'بطيء جداً' },
  maxRateDescription: { en: 'Very Fast', ar: 'سريع جداً' },
  isRequired: true
}
```

### 3. Comment Questions
```javascript
{
  name: 'additional_comments',
  title: { en: 'Additional comments?', ar: 'تعليقات إضافية؟' },
  type: 'comment',
  isRequired: false
}
```

## Action Types

The system uses predefined action types to track survey states:

- **Confirmed**: User completed survey positively
- **Rejected**: User declined to take survey
- **Cancelled**: User started but didn't complete
- **New Confirm**: User is progressing through survey (auto-save)

## Configuration

### Enable Mock Data
```javascript
// src/config/appConfig.js
development: {
  mockServices: {
    survey: false, // Use mock survey data
  },
}
```

### API Environment
```javascript
// src/config/appConfig.js
api: {
  defaultEnvironment: 'flux', // or 'prod'
}
```

## Survey Codes

Different survey types use specific codes:
- `SURV-1001`: Complaint evaluation survey
- `SURV-1002`: Inquiry evaluation survey
- Dynamic codes for other survey types

## Error Handling

**Survey Service Errors:**
- Network connectivity issues
- Invalid survey codes or invitation numbers
- Inactive surveys
- API response validation failures

**UI Error States:**
- Loading states with spinners
- Error messages with retry options
- Graceful fallbacks for missing data
- User-friendly error dialogs

## Real-time Features

**Progress Saving (Standalone Surveys):**
- Saves survey progress on each page change
- Uses "New Confirm" action type for partial saves
- Prevents data loss if user navigates away

**Session Integration:**
- Updates session activity on survey interactions
- Prevents idle timeout during survey completion
- Maintains user authentication state

## Security Considerations

**Data Protection:**
- Survey responses are submitted via HTTPS
- No sensitive data stored locally
- Proper session management during survey completion

**Validation:**
- Server-side validation of survey responses
- Client-side validation for required fields
- Protection against malformed survey data

## Testing

**Mock Data Testing:**
- Set `AppConfig.development.mockServices.survey = true`
- Test with pre-defined survey questions
- Verify Arabic/English language switching
- Test various question types and validations

**Integration Testing:**
- Test embedded surveys from complaint details
- Test standalone survey URLs with parameters
- Verify progress saving and completion flows
- Test error scenarios and network failures

## Future Enhancements

**Potential Improvements:**
- Offline survey support
- Survey analytics and reporting
- Custom question types (checkboxes, dropdowns)
- File attachment support in surveys
- Survey scheduling and reminders
- Advanced branching logic

## Troubleshooting

### API Endpoint Errors (400 Status Codes)

If you encounter 400 status code errors when testing surveys:

1. **Enable Mock Data**: Set `survey: true` in `src/config/appConfig.js`:
   ```javascript
   mockServices: {
     survey: true, // Enable mock data for survey system
   }
   ```

2. **Restart Development Server**: 
   ```bash
   npx react-native start --reset-cache
   ```

3. **Check API Endpoints**: Verify the survey API endpoints are correctly implemented on the backend:
   - `GET /survey/getsurveybycode?SurveyCode={code}`
   - `GET /lookupscode/listactiontypes`
   - `POST /survey/updatesurveyresponse`

4. **Fallback Mechanism**: The survey service automatically falls back to mock data when APIs are unavailable, ensuring continued development and testing.

### Common Issues

- **Action Types Error**: The system will automatically use mock action types if the lookup API fails
- **Network Timeouts**: Configurable timeout settings in `apiConfig.js`
- **Invalid Survey Codes**: Mock data includes test surveys SURV-1001 and SURV-1002 