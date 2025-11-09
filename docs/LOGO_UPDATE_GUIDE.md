# SERA Logo Update Guide

## Quick Reference

### What Changed?

| Location | Before | After | Source File |
|----------|--------|-------|-------------|
| Splash Screen | `sera-white-logo.png` (old) | `sera-white-full-lockup.png` (new full logo) | `White_Full Lockup.png` |
| Nafath Login | No logo | `sera-primary-logo.png` (green logo) | `Sera_Primary_Logo.png` |
| iOS App Icons | Old icons (37 files) | New icons (37 files) | `newLogoSERA.png` |
| Android App Icons | Old icons (10 files) | New icons (10 files) | `newLogoSERA.png` |
| App Store Icon | Old 1024×1024 | New 1024×1024 | `newLogoSERA.png` |
| Play Store Icon | Old 512×512 | New 512×512 | `newLogoSERA.png` |

## Visual Changes

### 1. Splash Screen (SplashScreen.js)

**Before:**
```
[Black Background + Video]
     [Old White SERA Logo]
```

**After:**
```
[Black Background + Video]
[New White Full Lockup Logo with Text]
"الهيئة السعودية لتنظيم الكهرباء"
"Saudi Electricity Regulatory Authority"
"SERA"
```

**Code Change:**
```javascript
// Before
source={require('../assets/images/sera-white-logo.png')}

// After
source={require('../assets/images/sera-white-full-lockup.png')}
```

---

### 2. Nafath Login Screen (NafathLoginScreen.js)

**Before:**
```
[Back Button] الدخول عبر النفاذ الوطني

نفاذ
نظام النفاذ الوطني الموحد

[National ID Input]
```

**After:**
```
[Back Button] الدخول عبر النفاذ الوطني

[SERA Primary Logo - Green]  ← NEW!

نفاذ
نظام النفاذ الوطني الموحد

[National ID Input]
```

**Code Changes:**
```javascript
// Added to JSX
<Image
  source={require('../assets/images/sera-primary-logo.png')}
  style={dynamicStyles.logoImage}
  resizeMode="contain"
/>

// Added to styles
logoImage: {
  width: width * 0.6,
  height: 100,
  marginBottom: 20,
}
```

---

### 3. App Icons (iOS & Android)

**All app icons updated to use the new SERA triangle logo mark**

#### iOS Icon Sizes (37 files)
```
AppIcon.appiconset/
├── 1024.png    (App Store)
├── 180.png     (iPhone @3x)
├── 120.png     (iPhone @2x)
├── 87.png      (Settings @3x)
├── 80.png      (Spotlight @2x)
├── 60.png      (iPhone @1x)
├── 58.png      (Settings @2x)
├── 40.png      (Spotlight @1x)
├── 29.png      (Settings @1x)
├── 20.png      (Notification @1x)
└── ... (27 more sizes)
```

#### Android Icon Sizes (10 files)
```
mipmap-mdpi/     (48×48)   ← Phone icon
mipmap-hdpi/     (72×72)   ← Tablet icon
mipmap-xhdpi/    (96×96)   ← HD icon
mipmap-xxhdpi/   (144×144) ← Full HD icon
mipmap-xxxhdpi/  (192×192) ← Retina icon
```

Each density has:
- `ic_launcher.png` (square)
- `ic_launcher_round.png` (round/adaptive)

---

### 4. Store Listing Icons

#### App Store (iOS)
- **File:** `assets/images/sera-appstore-icon.png`
- **Size:** 1024×1024 pixels
- **Format:** PNG
- **File Size:** 173 KB
- **Usage:** App Store Connect listing

#### Google Play (Android)
- **File:** `assets/images/sera-playstore-icon.png`
- **Size:** 512×512 pixels
- **Format:** PNG
- **File Size:** 54 KB
- **Usage:** Google Play Console listing

---

## Asset Organization

### New File Structure
```
assets/images/
├── sera-app-icon.png              ← Base icon (100 KB)
├── sera-white-full-lockup.png     ← Splash screen (395 KB)
├── sera-primary-logo.png          ← Nafath screen (652 KB)
├── sera-appstore-icon.png         ← App Store (173 KB)
└── sera-playstore-icon.png        ← Play Store (54 KB)
```

### Legacy Files (Kept for reference)
```
assets/images/
├── sera-logo.png                  ← Old logo (51 KB)
├── sera-logo-white.png            ← Old white logo (30 KB)
├── sera-logo-original.png         ← Old original (24 KB)
└── sera-icon.png                  ← Old icon (7.6 KB)
```

---

## How to Test

### 1. Test Splash Screen
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

**Expected Result:**
- App launches with black background + video
- New white full lockup logo appears (with Arabic + English text + "SERA")
- Logo fades in smoothly and scales with animation

---

### 2. Test Nafath Login
```bash
# Navigate to Nafath Login from Login Screen
# Tap "الدخول عبر نفاذ" button
```

**Expected Result:**
- Back button and header appear at top
- **New:** Green SERA primary logo displays below header
- Logo is centered, 60% of screen width
- "نفاذ" title appears below logo
- National ID input field below

---

### 3. Test App Icons

#### iOS
```bash
# Build and install on device/simulator
npx react-native run-ios

# Check icon on:
1. Home Screen (60×60 @3x = 180×180)
2. Settings App (29×29 @3x = 87×87)
3. Spotlight Search (40×40 @3x = 120×120)
4. App Switcher (60×60 @3x = 180×180)
```

#### Android
```bash
# Build and install on device/emulator
npx react-native run-android

# Check icon on:
1. Home Screen (launcher)
2. App Drawer (launcher)
3. Settings > Apps (launcher)
4. Recent Apps (launcher)
```

**Expected Result:**
- New SERA triangle logo mark displays clearly
- No pixelation or blurriness
- Icon follows platform guidelines (rounded corners on iOS, adaptive on Android)

---

### 4. Test Store Icons

#### App Store
1. Open [App Store Connect](https://appstoreconnect.apple.com)
2. Go to your app > App Store tab
3. Upload `assets/images/sera-appstore-icon.png` (1024×1024)
4. Preview in different device sizes

#### Google Play
1. Open [Google Play Console](https://play.google.com/console)
2. Go to your app > Store presence > Main store listing
3. Upload `assets/images/sera-playstore-icon.png` (512×512)
4. Preview in different device sizes

---

## Regenerating Icons

If you need to update the app icon in the future:

### Step 1: Prepare New Icon
```bash
# Replace the source icon
cp /path/to/new-icon.png assets/images/sera-app-icon.png
```

**Requirements:**
- Square dimensions (recommended 1024×1024 or larger)
- PNG format with transparency
- Clear visibility at small sizes (20×20)
- Follows SERA branding guidelines

### Step 2: Run Generation Script
```bash
# Make script executable (first time only)
chmod +x scripts/generate-icons.sh

# Generate all icon sizes
./scripts/generate-icons.sh
```

**Output:**
```
🎨 Generating App Icons from assets/images/sera-app-icon.png

📱 Generating iOS Icons...
   Generating 1024x1024 → 1024.png
   Generating 180x180 → 180.png
   ... (35 more icons)

🤖 Generating Android Icons...
   Generating 192x192 → mipmap-xxxhdpi/ic_launcher.png
   ... (9 more icons)

🏪 Generating Store Icons...
   Generating 1024x1024 → sera-appstore-icon.png
   Generating 512x512 → sera-playstore-icon.png

✅ Icon generation completed successfully!
```

### Step 3: Clear Build Cache
```bash
# iOS
rm -rf ios/build

# Android
cd android && ./gradlew clean && cd ..
```

### Step 4: Rebuild
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Troubleshooting

### Issue: Icons not updating on iOS
**Solution:**
```bash
# Clean Xcode build cache
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/seraApp-*

# Clean and rebuild
cd ios && pod install && cd ..
npx react-native run-ios
```

### Issue: Icons not updating on Android
**Solution:**
```bash
# Clean Gradle cache
cd android && ./gradlew clean && cd ..

# Clear app data on device
adb shell pm clear sa.gov.sera.mobile

# Rebuild
npx react-native run-android
```

### Issue: Splash screen showing old logo
**Solution:**
```bash
# Verify asset file exists
ls -lh assets/images/sera-white-full-lockup.png

# Clear Metro bundler cache
npx react-native start --reset-cache

# In another terminal, rebuild
npx react-native run-ios  # or run-android
```

### Issue: Nafath screen missing logo
**Solution:**
```bash
# Verify asset file exists
ls -lh assets/images/sera-primary-logo.png

# Check code in NafathLoginScreen.js
grep "sera-primary-logo" src/screens/NafathLoginScreen.js

# Clear cache and rebuild
npx react-native start --reset-cache
npx react-native run-ios  # or run-android
```

---

## Platform-Specific Notes

### iOS
- **Icon Format:** PNG in `.xcassets` asset catalog
- **Transparency:** Supported but not recommended (iOS adds its own background)
- **Rounded Corners:** Applied automatically by iOS
- **Size Validation:** Xcode validates sizes automatically
- **Build Location:** `ios/seraApp/Images.xcassets/AppIcon.appiconset/`

### Android
- **Icon Format:** PNG in `mipmap` resource directories
- **Transparency:** Supported and recommended for adaptive icons
- **Rounded Corners:** Varies by launcher (handled by adaptive icons)
- **Density Buckets:** Must provide all 5 densities (mdpi to xxxhdpi)
- **Build Location:** `android/app/src/main/res/mipmap-*/`

---

## Checklist for Release

Before submitting to stores:

- [ ] Test splash screen logo on both iOS and Android
- [ ] Test Nafath login logo on both iOS and Android
- [ ] Verify app icons on iOS device home screen
- [ ] Verify app icons in iOS Settings and Spotlight
- [ ] Verify app icons on Android device home screen
- [ ] Verify app icons in Android app drawer
- [ ] Test both light and dark mode (if applicable)
- [ ] Test on different device sizes (phone, tablet)
- [ ] Verify icons match SERA brand guidelines
- [ ] Upload new icons to App Store Connect
- [ ] Upload new icons to Google Play Console
- [ ] Update marketing materials with new icons
- [ ] Take new app store screenshots showing new logos

---

## References

- **Brand Assets:** `assets/images/`
- **iOS Icons:** `ios/seraApp/Images.xcassets/AppIcon.appiconset/`
- **Android Icons:** `android/app/src/main/res/mipmap-*/`
- **Generation Script:** `scripts/generate-icons.sh`
- **Code Changes:** `src/screens/SplashScreen.js`, `src/screens/NafathLoginScreen.js`

---

**Last Updated:** November 9, 2024  
**Version:** 1.3.34  
**Status:** ✅ Production Ready

