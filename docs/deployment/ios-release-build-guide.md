# 🍎 iOS Release Build Guide - SERA Mobile

## Overview

This guide covers creating release builds for the SERA Mobile iOS app, including development, staging, and production builds for App Store distribution.

## Prerequisites

### 1. Apple Developer Account
- Active Apple Developer Program membership ($99/year)
- Team ID from Apple Developer Account
- App Store Connect access for app management

### 2. Development Environment
- macOS with Xcode 15.x or later
- iOS Simulator
- Valid code signing certificates
- Provisioning profiles

### 3. Required Certificates

#### Development Certificates:
- **iOS App Development** - For testing on devices
- **Apple Development** - For Xcode 11+ development

#### Distribution Certificates:
- **iOS Distribution** - For App Store submission
- **Apple Distribution** - For Xcode 11+ distribution

## Project Configuration

### 1. Update App Information

First, ensure your app configuration is properly set:

```json
// app.json
{
  "name": "seraApp",
  "displayName": "SERA App",
  "version": "1.0.0",
  "ios": {
    "bundleIdentifier": "sa.gov.sera.mobile",
    "buildNumber": "1",
    "deploymentTarget": "13.0"
  }
}
```

### 2. iOS Info.plist Configuration

Update version information in `ios/seraApp/Info.plist`:

```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

### 3. Team ID Configuration

Update the Xcode project with your Team ID:
1. Open `ios/seraApp.xcworkspace` in Xcode
2. Select the `seraApp` project
3. Go to **Signing & Capabilities**
4. Set **Team** to your Apple Developer Team
5. Enable **Automatically manage signing**

## Build Methods

### Method 1: Xcode GUI (Recommended for Manual Builds)

#### Step 1: Prepare for Archive
```bash
# Clean and prepare the project
cd ios
rm -rf build/
pod install
```

#### Step 2: Archive in Xcode
1. Open `ios/seraApp.xcworkspace`
2. Select **Any iOS Device** as destination
3. **Product** → **Archive**
4. Wait for archive to complete (5-10 minutes)

#### Step 3: Export IPA
1. In **Archives** window, select your archive
2. Click **Distribute App**
3. Choose distribution method:
   - **App Store Connect** - For App Store submission
   - **Ad Hoc** - For internal testing
   - **Development** - For development team testing

#### Step 4: Configure Export Options
- **Destination**: App Store Connect
- **Distribution Certificate**: iOS Distribution
- **Provisioning Profile**: Automatic
- **App Thinning**: None (for government apps)

### Method 2: Command Line (Recommended for CI/CD)

#### Step 1: Create Export Options

Create `ios/ExportOptions-Release.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>destination</key>
    <string>export</string>
    <key>thinning</key>
    <string>&lt;none&gt;</string>
</dict>
</plist>
```

#### Step 2: Build and Archive Script

Create `scripts/build-ios-release.sh`:

```bash
#!/bin/bash

# SERA Mobile iOS Release Build Script

set -e

echo "🚀 Starting iOS Release Build for SERA Mobile"

# Configuration
SCHEME="seraApp"
WORKSPACE="ios/seraApp.xcworkspace"
ARCHIVE_PATH="build/seraApp-Release.xcarchive"
EXPORT_PATH="build/release"
EXPORT_OPTIONS="ios/ExportOptions-Release.plist"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
mkdir -p build

# Install dependencies
echo "📦 Installing CocoaPods dependencies..."
cd ios
pod install
cd ..

# Build and Archive
echo "🏗️ Building and archiving..."
xcodebuild -workspace "$WORKSPACE" \
           -scheme "$SCHEME" \
           -configuration Release \
           -destination generic/platform=iOS \
           -archivePath "$ARCHIVE_PATH" \
           -allowProvisioningUpdates \
           archive

# Export IPA
echo "📱 Exporting IPA..."
xcodebuild -exportArchive \
           -archivePath "$ARCHIVE_PATH" \
           -exportPath "$EXPORT_PATH" \
           -exportOptionsPlist "$EXPORT_OPTIONS" \
           -allowProvisioningUpdates

echo "✅ Build completed successfully!"
echo "📍 IPA location: $EXPORT_PATH/seraApp.ipa"
```

#### Step 3: Run the Build

```bash
chmod +x scripts/build-ios-release.sh
./scripts/build-ios-release.sh
```

### Method 3: Expo EAS Build (Alternative)

If you want to use Expo's build service:

#### Step 1: Install EAS CLI
```bash
npm install -g @expo/eas-cli
eas login
```

#### Step 2: Configure EAS Build

Create `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "ios": {
        "simulator": true,
        "buildType": "development-client"
      }
    },
    "preview": {
      "ios": {
        "simulator": false,
        "buildType": "development-client"
      }
    },
    "production": {
      "ios": {
        "autoIncrement": "buildNumber",
        "buildType": "release"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

#### Step 3: Build with EAS
```bash
# Development build
eas build --platform ios --profile development

# Production build for App Store
eas build --platform ios --profile production
```

## Version Management

### 1. Update Version Numbers

Create `scripts/update-ios-version.sh`:

```bash
#!/bin/bash

# Update iOS version numbers
VERSION=$1
BUILD_NUMBER=$2

if [ -z "$VERSION" ] || [ -z "$BUILD_NUMBER" ]; then
    echo "Usage: ./update-ios-version.sh <version> <build_number>"
    echo "Example: ./update-ios-version.sh 1.0.1 2"
    exit 1
fi

echo "Updating iOS version to $VERSION (build $BUILD_NUMBER)"

# Update Info.plist
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION" ios/seraApp/Info.plist
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" ios/seraApp/Info.plist

# Update app.json if using Expo
if [ -f "app.json" ]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" app.json
fi

echo "✅ Version updated successfully"
```

### 2. Usage
```bash
chmod +x scripts/update-ios-version.sh
./scripts/update-ios-version.sh 1.0.1 2
```

## Distribution Methods

### 1. App Store Distribution

#### Requirements:
- iOS Distribution certificate
- App Store provisioning profile
- App Store Connect app record

#### Steps:
1. Build with `app-store` method
2. Upload to App Store Connect using:
   - Xcode Organizer
   - Application Loader
   - `xcrun altool` command

#### Upload Command:
```bash
xcrun altool --upload-app \
             --type ios \
             --file "build/release/seraApp.ipa" \
             --username "your-apple-id@email.com" \
             --password "app-specific-password"
```

### 2. TestFlight (Beta Testing)

Same as App Store distribution, but:
1. Upload to App Store Connect
2. In App Store Connect, go to **TestFlight**
3. Add internal/external testers
4. Submit for beta review

### 3. Ad Hoc Distribution

For internal testing without App Store:

Update `ExportOptions-AdHoc.plist`:
```xml
<key>method</key>
<string>ad-hoc</string>
```

Distribute via:
- Email
- Enterprise mobile device management
- Firebase App Distribution

### 4. Enterprise Distribution

For Saudi government internal distribution:

Requirements:
- Apple Developer Enterprise Program
- Enterprise distribution certificate
- In-house provisioning profile

## Build Optimization

### 1. App Size Optimization

```bash
# Enable app thinning for smaller downloads
<key>thinning</key>
<string>variant</string>

# Remove unused architectures
EXCLUDED_ARCHS = arm64-simulator
```

### 2. Performance Optimization

```xml
<!-- Disable debug features in release -->
<key>DEBUG</key>
<false/>

<!-- Enable app optimization -->
<key>GCC_OPTIMIZATION_LEVEL</key>
<string>s</string>
```

### 3. Security Configuration

```xml
<!-- Disable debugging in release -->
<key>UIFileSharingEnabled</key>
<false/>

<!-- Prevent screenshots in app switcher -->
<key>UIApplicationExitsOnSuspend</key>
<false/>
```

## Quality Assurance

### 1. Pre-submission Checklist

- [ ] App crashes are fixed
- [ ] All screens tested on different device sizes
- [ ] Arabic RTL layout works correctly
- [ ] Dark mode compatibility verified
- [ ] App Store guidelines compliance
- [ ] Privacy policy links working
- [ ] Government accessibility standards met
- [ ] Nafath authentication working
- [ ] Offline mode functionality tested

### 2. Device Testing Matrix

#### iPhone Models:
- iPhone SE (2nd/3rd gen) - Small screen
- iPhone 12/13/14 - Standard size
- iPhone 12/13/14 Pro Max - Large screen

#### iOS Versions:
- iOS 13.0 (minimum supported)
- iOS 15.x (common)
- iOS 17.x (latest)

### 3. App Store Review Preparation

#### Metadata:
- App name: "SERA App"
- Subtitle: "Saudi Electricity Regulatory Authority"
- Keywords: "sera, saudi, electricity, government, regulatory"
- Description in Arabic and English
- Screenshots for all device sizes
- App preview videos (optional)

#### Review Information:
- Demo account credentials
- Special configuration instructions
- Government app explanation
- Contact information

## Troubleshooting

### Common Issues:

#### 1. Code Signing Errors
```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reset keychain
security delete-keychain ios-build.keychain
```

#### 2. Provisioning Profile Issues
```bash
# Download latest profiles
xcodebuild -downloadAllProvisioningProfiles
```

#### 3. Build Failures
```bash
# Clean and rebuild
xcodebuild clean -workspace ios/seraApp.xcworkspace -scheme seraApp
```

#### 4. Archive Upload Failures
- Check internet connection
- Verify Apple ID credentials
- Use app-specific password
- Check file size limits (4GB max)

### Debug Commands:

```bash
# Check certificate validity
security find-identity -v -p codesigning

# Verify provisioning profiles
security cms -D -i profile.mobileprovision

# Test archive without export
xcodebuild -exportArchive -archivePath archive.xcarchive -exportPath . -exportFormat IPA
```

## Automation Integration

### GitHub Actions Workflow

Create `.github/workflows/ios-release.yml`:

```yaml
name: iOS Release Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Setup Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: '15.2'
        
    - name: Install certificates
      env:
        IOS_CERTIFICATE: ${{ secrets.IOS_CERTIFICATE }}
        IOS_CERTIFICATE_PASSWORD: ${{ secrets.IOS_CERTIFICATE_PASSWORD }}
      run: |
        echo $IOS_CERTIFICATE | base64 --decode > certificate.p12
        security create-keychain -p actions ios-build.keychain
        security import certificate.p12 -t cert -f pkcs12 -P $IOS_CERTIFICATE_PASSWORD -k ios-build.keychain
        
    - name: Build iOS
      run: ./scripts/build-ios-release.sh
      
    - name: Upload to App Store
      env:
        APPLE_ID: ${{ secrets.APPLE_ID }}
        APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
      run: |
        xcrun altool --upload-app \
                     --type ios \
                     --file "build/release/seraApp.ipa" \
                     --username "$APPLE_ID" \
                     --password "$APPLE_PASSWORD"
```

## Release Notes Template

### Version 1.0.0 (Build 1)
**Release Date:** [Date]

#### New Features:
- Initial release of SERA Mobile app
- Nafath authentication integration
- Complaints submission system
- Permits application workflow
- Arabic/English bilingual support
- Government services access

#### Government Compliance:
- Saudi digital government standards
- GDPR privacy compliance
- Accessibility features
- RTL language support

#### Technical Notes:
- React Native 0.79.x
- iOS 13.0+ compatibility
- Offline mode support
- Dark mode compatibility

---

**Next Steps:**
1. Configure your Apple Developer account
2. Update Team ID in export options
3. Test the build process with development method
4. Prepare App Store Connect metadata
5. Submit for App Store review

For troubleshooting, refer to `docs/troubleshooting/IOS_SIGNING_TROUBLESHOOTING.md`. 