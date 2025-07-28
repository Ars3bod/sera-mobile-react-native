# Comment System Implementation Documentation

## Overview

The Comment System allows users to add comments to their complaints with file attachments. This system provides a comprehensive solution for ongoing communication between users and SERA staff regarding complaint cases.

## Architecture

### Components

1. **CommentService** (`src/services/commentService.js`)
   - Handles all API interactions for comments
   - Manages file uploads and attachments
   - Provides mock data support for development

2. **CommentForm** (`src/components/CommentForm.js`)
   - Form component for adding new comments
   - Supports file attachments (up to 3 files)
   - Handles validation and submission

3. **CommentView** (`src/components/CommentView.js`)
   - Displays list of comments with attachments
   - Handles comment refresh and error states
   - Provides download functionality for attachments

4. **ComplaintCommentScreen** (`src/screens/ComplaintCommentScreen.js`)
   - Full-screen interface for comment management
   - Combines CommentView and CommentForm
   - Handles navigation and state management

## API Endpoints

### Comment Operations

```javascript
// Get comments for a complaint
GET /case/getcomments?CaseNumber={caseNumber}&PageNumber=1&PageSize=10

// Add comment to complaint
POST /case/addcomment
{
  "CaseNumber": "string",
  "CommentText": "string",
  "Beneficiary": "string", // User's contact ID
  "Attachments": [
    {
      "FileName": "string",
      "FileContent": "base64string",
      "FileExtension": "string"
    }
  ]
}
```

### Response Format

```javascript
// Get Comments Response
{
  "result": [
    {
      "CommentId": "guid",
      "CommentText": "string",
      "CreatedDate": "2024-01-01T00:00:00Z",
      "CreatedBy": "string",
      "IsSeraTeam": true/false,
      "Attachments": [
        {
          "AttachmentId": "guid",
          "FileName": "string",
          "FileExtension": "string",
          "FileSize": "number",
          "FileContent": "base64string"
        }
      ]
    }
  ],
  "success": true,
  "message": "string"
}

// Add Comment Response
{
  "result": {
    "CommentId": "guid",
    "Success": true
  },
  "success": true,
  "message": "Comment added successfully"
}
```

## Features

### Comment Management
- **Add Comments**: Users can add text comments to complaints
- **File Attachments**: Support for up to 3 file attachments per comment
- **Comment History**: View all comments in chronological order
- **Real-time Updates**: Comments refresh automatically
- **Error Handling**: Comprehensive error handling with user feedback

### File Support
- **Supported Formats**: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG
- **File Size Limit**: 20MB per file
- **Multiple Files**: Up to 3 attachments per comment
- **Download**: Download and save attachments locally

### User Experience
- **RTL Support**: Full Arabic language and RTL layout support
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Screen reader support and proper contrast
- **Offline Handling**: Graceful handling of network issues

## Configuration

### Mock Data Toggle
```javascript
// src/config/appConfig.js
mockServices: {
  comments: true, // Enable mock data for development
}
```

### API Configuration
```javascript
// src/config/apiConfig.js
case: {
  addComment: '/addcomment',
  getComments: '/getcomments',
}
```

## Integration Points

### ComplaintDetailsScreen Integration
- Added "Add Comment" button in complaint details
- Navigates to ComplaintCommentScreen with case number
- Seamless integration with existing complaint workflow

### Navigation Setup
```javascript
// src/navigation/AppNavigator.js
<Stack.Screen
  name="ComplaintComment"
  component={ComplaintCommentScreen}
  options={{
    animation: 'slide_from_right',
    animationDuration: 300,
  }}
/>
```

## Internationalization

### English Translations
```javascript
comments: {
  title: 'Comments',
  addComment: 'Add Comment',
  commentText: 'Comment Text',
  commentPlaceholder: 'Enter your comment here...',
  attachments: 'Attachments',
  attachFile: 'Attach File',
  submit: 'Submit Comment',
  // ... more translations
}
```

### Arabic Translations
```javascript
comments: {
  title: 'التعليقات',
  addComment: 'إضافة تعليق',
  commentText: 'نص التعليق',
  commentPlaceholder: 'أدخل تعليقك هنا...',
  attachments: 'المرفقات',
  attachFile: 'إرفاق ملف',
  submit: 'إرسال التعليق',
  // ... more translations
}
```

## Mock Data Structure

### Sample Comments
```javascript
const mockComments = [
  {
    CommentId: '1',
    CommentText: 'Thank you for your complaint. We are reviewing your case.',
    CreatedDate: '2024-01-15T10:30:00Z',
    CreatedBy: 'SERA Support Team',
    IsSeraTeam: true,
    Attachments: []
  },
  {
    CommentId: '2',
    CommentText: 'I have additional information to provide.',
    CreatedDate: '2024-01-16T14:20:00Z',
    CreatedBy: 'User',
    IsSeraTeam: false,
    Attachments: [
      {
        AttachmentId: 'att1',
        FileName: 'additional_info.pdf',
        FileExtension: 'pdf',
        FileSize: 1024000,
        FileContent: 'base64content...'
      }
    ]
  }
];
```

## Error Handling

### Network Errors
- Automatic retry mechanism
- User-friendly error messages
- Offline state handling

### File Upload Errors
- File size validation
- Format validation
- Upload progress indication

### Validation Errors
- Required field validation
- Real-time form validation
- Clear error messaging

## Security Considerations

### Data Protection
- Secure file upload handling
- Base64 encoding for file content
- Proper error message sanitization

### Authentication
- User authentication required
- Contact ID validation
- Session management integration

## Testing

### Mock Data Testing
1. Enable mock data in `appConfig.js`
2. Test comment viewing and adding
3. Test file attachment functionality
4. Test error scenarios

### API Testing
1. Disable mock data
2. Test with real API endpoints
3. Verify error handling
4. Test file upload limits

## Performance Optimizations

### File Handling
- Lazy loading of attachments
- Efficient base64 encoding
- Memory management for large files

### UI Performance
- Optimized re-renders
- Efficient list rendering
- Smooth animations

## Deployment Checklist

- [ ] Mock data disabled in production
- [ ] API endpoints configured correctly
- [ ] File upload limits tested
- [ ] Error handling verified
- [ ] Internationalization complete
- [ ] Performance testing completed
- [ ] Security review passed

## Future Enhancements

### Planned Features
1. **Comment Notifications**: Push notifications for new comments
2. **Comment Editing**: Allow users to edit their comments
3. **Comment Reactions**: Like/dislike functionality
4. **Advanced Search**: Search within comments
5. **Comment Templates**: Pre-defined comment templates
6. **Bulk Operations**: Delete multiple comments

### Technical Improvements
1. **Caching**: Implement comment caching
2. **Pagination**: Implement proper pagination
3. **Real-time Updates**: WebSocket integration
4. **Offline Support**: Offline comment composition
5. **Analytics**: Comment interaction tracking

## Troubleshooting

### Common Issues

1. **Comments not loading**
   - Check network connection
   - Verify API endpoints
   - Check authentication status

2. **File upload failing**
   - Check file size limits
   - Verify file format support
   - Check network stability

3. **UI not responding**
   - Check for JavaScript errors
   - Verify component state
   - Check memory usage

### Debug Steps
1. Enable debug logging in `appConfig.js`
2. Check console for error messages
3. Verify API responses
4. Test with mock data first

## Support

For technical support or questions about the comment system implementation, please contact the development team or refer to the main project documentation. 