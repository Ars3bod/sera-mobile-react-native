# Force Update Implementation Guide

## Overview

The app now includes a force update mechanism that prevents users from using the app if they're on an outdated version. This ensures all users have the latest security updates and features.

## Current Configuration

- **Current App Version**: `1.2.0` (from `app.json` and `package.json`)
- **Minimum Required Version**: `1.3.0` (configured in `versionService.js`)
- **Result**: Force update will be triggered for version 1.2.0

## How It Works

### 1. Version Check Flow

```
App Launch
    ↓
SplashScreen
    ↓
Version Check (versionService.checkVersion)
    ↓
Is version < 1.3.0?
    ├─ Yes → Navigate to ForceUpdateScreen (blocks app usage)
    └─ No → Continue to Login/Home (normal flow)
```

### 2. Version Comparison

The service uses a numeric comparison system:
- Version `1.2.0` = `1,002,000` (major × 1,000,000 + minor × 1,000 + patch)
- Version `1.3.0` = `1,003,000`
- Since `1,002,000 < 1,003,000`, update is required

## Files Created/Modified

### New Files:

1. **`src/services/versionService.js`**
   - Handles version checking logic
   - Compares current version with minimum required version
   - Supports API-based version check with fallback
   - Caches results for 1 hour

2. **`src/screens/ForceUpdateScreen.js`**
   - Beautiful full-screen UI for update prompt
   - Shows current vs required version
   - Direct links to App Store/Play Store
   - Optional "Skip" button (if update is optional)
   - Supports both required and optional updates

### Modified Files:

1. **`src/screens/SplashScreen.js`**
   - Added version check before navigation
   - Navigates to ForceUpdateScreen if update required
   - Falls back to normal flow if version check fails

2. **`src/navigation/AppNavigator.js`**
   - Registered `ForceUpdateScreen` in navigation stack
   - Disabled gestures to prevent users from going back

## Configuration

### Update Minimum Required Version

Edit `src/services/versionService.js`:

```javascript
// Line 11: Update fallback minimum version
this.fallbackMinVersion = '1.3.0'; // Change this to your desired version
```

### Update Store URLs

Edit `src/services/versionService.js`:

```javascript
// Lines 90-91: Update with your actual store URLs
updateUrl: {
    ios: 'https://apps.apple.com/app/sera/id1234567890', // Replace with actual URL
    android: 'https://play.google.com/store/apps/details?id=sa.gov.sera.mobile'
}
```

### API-Based Version Control (Recommended)

For dynamic version management, create an API endpoint:

**Endpoint**: `https://sera.gov.sa/api/app/version-check`

**Response Format**:
```json
{
    "success": true,
    "minVersion": "1.3.0",
    "message": {
        "en": "Please update to the latest version to continue using the app.",
        "ar": "يرجى التحديث إلى أحدث إصدار للاستمرار في استخدام التطبيق."
    },
    "updateUrl": {
        "ios": "https://apps.apple.com/app/sera/id1234567890",
        "android": "https://play.google.com/store/apps/details?id=sa.gov.sera.mobile"
    },
    "isOptional": false,
    "features": [
        {
            "en": "New biometric authentication",
            "ar": "مصادقة بيومترية جديدة"
        },
        {
            "en": "Improved performance",
            "ar": "أداء محسّن"
        }
    ]
}
```

**Benefits**:
- Update minimum version without app redeployment
- Show custom messages per update
- List new features
- Make updates optional or required
- Cache results for better performance

## Update Types

### 1. Required Update (Default)
- User **cannot** skip the update
- App is completely blocked until update
- Used for critical security updates or breaking changes

### 2. Optional Update
- User **can** skip and continue using the app
- Shows "Skip for now" button
- Used for minor feature updates

To make an update optional, set `isOptional: true` in the API response.

## Testing

### Test Force Update (Current State)

Since the app is at version `1.2.0` and minimum is `1.3.0`:

1. Launch the app
2. You should see the **ForceUpdateScreen** after the splash
3. App will be blocked until "Update Now" is tapped

### Test Normal Flow (After Update)

To test normal flow, update the version in `app.json`:

```json
{
    "version": "1.3.0"
}
```

Then rebuild the app:
```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### Test Optional Update

In `versionService.js`, modify the fallback response:

```javascript
isOptional: true // Add this line at line 96
```

Then test to see the "Skip for now" button.

## Version Update Checklist

When releasing a new version:

1. ✅ Update `version` in `package.json`
2. ✅ Update `version` in `app.json`
3. ✅ Update iOS build number in `app.json` → `ios.buildNumber`
4. ✅ Update Android version code in `android/app/build.gradle`
5. ✅ Update API minimum version (if using API-based control)
6. ✅ Test force update flow
7. ✅ Submit to App Store/Play Store

## UI Features

### ForceUpdateScreen Features:

- 🎨 Beautiful gradient icon with badge
- 📱 Responsive design for all screen sizes
- 🌍 Full RTL/LTR support
- 🌓 Theme-aware (light/dark mode)
- ✨ Smooth animations
- 📋 Version comparison display
- 🆕 Optional "What's New" section
- 🔗 Direct store links
- ⏭️ Optional skip button

## Troubleshooting

### Issue: Version check fails

**Solution**: The service will use the fallback minimum version (`1.3.0`) and continue.

### Issue: Store URL doesn't open

**Solution**: Update the URLs in `versionService.js` with your actual App Store and Play Store URLs.

### Issue: Version check takes too long

**Solution**: Results are cached for 1 hour. To clear cache for testing:

```javascript
import versionService from '../services/versionService';

// Clear cache
versionService.clearCache();
```

### Issue: Want to temporarily disable force update

**Solution**: In `versionService.js`, set:

```javascript
this.fallbackMinVersion = '1.0.0'; // Lower than current version
```

## Security Considerations

1. **Version Check API**: 
   - Use HTTPS only
   - Implement rate limiting
   - Cache responses to reduce API calls
   
2. **Store URLs**:
   - Always use official store URLs
   - Verify URLs are correct before deployment

3. **Update Frequency**:
   - Don't force update too frequently (user experience)
   - Cache results for reasonable duration (currently 1 hour)

## Future Enhancements

Possible improvements:

1. **App Size Display**: Show download size in update prompt
2. **Download Progress**: Track update download progress
3. **Changelog Display**: Show detailed changelog from API
4. **A/B Testing**: Roll out updates to percentage of users
5. **Background Updates**: Pre-download updates in background
6. **Update Reminders**: Remind users periodically if they skip optional updates

## References

- Version Service: `src/services/versionService.js`
- Force Update Screen: `src/screens/ForceUpdateScreen.js`
- Splash Integration: `src/screens/SplashScreen.js`
- Navigation Config: `src/navigation/AppNavigator.js`

---

**Last Updated**: October 2, 2025
**Current Version**: 1.2.0
**Minimum Version**: 1.3.0
**Status**: ✅ Active - Force update is currently enabled

