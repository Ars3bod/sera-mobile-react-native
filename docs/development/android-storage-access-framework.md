# Android Storage Access Framework (SAF) Implementation

## Overview

The SERA Mobile App now includes Android Storage Access Framework (SAF) support for downloading and saving attachments. This provides users with a native Android experience to choose where to save files, improving usability and following Android best practices.

## Implementation Details

### Packages Used

- **react-native-share**: Provides SAF support for saving files to user-selected locations
- **react-native-fs**: File system operations for temporary file creation
- **react-native-document-picker**: Fallback document picker functionality

### Key Features

1. **Native File Picker**: On Android 10+, users see the native file picker to choose save location
2. **Cross-Platform**: Consistent behavior on both iOS and Android
3. **Fallback Support**: Graceful fallback to app directory if SAF fails
4. **Multiple File Types**: Support for PDF, images, documents, and other common file types
5. **User Cancellation Handling**: Proper handling when users cancel the save dialog

### Implementation Flow

#### Android (Primary Path)
1. Create temporary file in app cache directory
2. Use `react-native-share` with `saveToFiles: true` to trigger SAF
3. User selects save location through native Android file picker
4. File is saved to user-selected location
5. Temporary file is cleaned up after delay

#### Android (Fallback Path)
1. If SAF fails or is unavailable, save to app's external files directory
2. Request storage permissions if needed (Android 10 and below)
3. Show traditional share dialog as secondary option

#### iOS
1. Save file to app documents directory
2. Use `react-native-share` to present iOS share sheet
3. User can save to Files app or share with other apps

### Code Structure

```javascript
// Main download function
const downloadAttachment = async (attachment) => {
    // Validates attachment data
    // Calls platform-specific save function
}

// Android SAF implementation
const saveFileWithAndroidSAF = async (base64Data, fileName, fileExtension) => {
    // 1. Create temporary file
    // 2. Use RNShare with saveToFiles option
    // 3. Handle user cancellation
    // 4. Cleanup temporary files
}

// iOS implementation
const saveFileForIOS = async (base64Data, fileName, fileExtension) => {
    // 1. Save to documents directory
    // 2. Use RNShare for iOS share sheet
}

// Fallback for Android
const saveFileToAppDirectory = async (base64Data, fileName, fileExtension) => {
    // 1. Request permissions if needed
    // 2. Save to app external files directory
    // 3. Show traditional share dialog
}
```

### MIME Type Support

The implementation includes proper MIME type detection for:
- PDF files (`application/pdf`)
- Images (JPEG, PNG)
- Microsoft Office documents (Word, Excel)
- Text files
- Generic binary files

### Error Handling

1. **User Cancellation**: Silently handled, no error shown
2. **Permission Denied**: Proper error message with permission guidance
3. **Storage Full**: Specific error message for insufficient space
4. **SAF Unavailable**: Automatic fallback to app directory

### Translation Keys

New translation keys added for SAF functionality:

**English:**
```javascript
attachment: {
    saveSuccess: "File Saved",
    saveSuccessMessage: "{{fileName}} has been saved successfully to your selected location.",
    saveTitle: "Save {{fileName}}",
    saveMessage: "Choose where to save {{fileName}}",
}
```

**Arabic:**
```javascript
attachment: {
    saveSuccess: "تم حفظ الملف",
    saveSuccessMessage: "تم حفظ {{fileName}} بنجاح في الموقع المحدد.",
    saveTitle: "حفظ {{fileName}}",
    saveMessage: "اختر مكان حفظ {{fileName}}",
}
```

### Benefits

1. **Better UX**: Users can choose exactly where to save files
2. **Android Standards**: Follows Android design guidelines
3. **Government App Compliance**: Meets accessibility and usability standards
4. **Cross-Platform**: Consistent experience across platforms
5. **Fallback Safety**: Always works even if SAF fails

### Testing Scenarios

1. **Happy Path**: User selects location and saves file successfully
2. **User Cancellation**: User cancels save dialog - no error shown
3. **SAF Unavailable**: Automatic fallback to app directory
4. **Permission Denied**: Proper error handling and guidance
5. **Network Issues**: Handles attachment download failures
6. **Multiple File Types**: Test various file extensions

### Future Enhancements

1. **Bulk Download**: Save multiple attachments at once
2. **Progress Indicators**: Show download progress for large files
3. **File Preview**: In-app preview before downloading
4. **Cloud Integration**: Direct save to cloud storage services

## Usage

The SAF implementation is automatically triggered when users tap on attachments in the Complaint Details screen. No additional configuration is required - the system automatically detects the platform and provides the appropriate file saving experience. 