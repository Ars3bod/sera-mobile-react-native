# 🚀 iOS Release Build Quick Start - SERA Mobile

## Prerequisites Checklist

Before you start, ensure you have:

- [ ] **macOS** with Xcode 15.x or later installed
- [ ] **Apple Developer Account** ($99/year subscription)
- [ ] **Team ID** from your Apple Developer account
- [ ] **App Store Connect** app record created
- [ ] **Code signing certificates** properly configured

## 5-Minute Setup

### Step 1: Configure Your Team ID

1. Get your Team ID from [Apple Developer Account](https://developer.apple.com/account/#/membership/)
2. Update the export options:

```bash
# Edit the file ios/ExportOptions-Release.plist
# Replace YOUR_TEAM_ID with your actual Team ID (e.g., ABC123XYZ9)
```

### Step 2: Update Version Numbers

```bash
# Update to version 1.0.0, build 1
./scripts/update-ios-version.sh 1.0.0 1
```

### Step 3: Build Release IPA

```bash
# Build the release version
./scripts/build-ios-release.sh
```

This will:
- ✅ Clean previous builds
- ✅ Install dependencies (npm + CocoaPods)
- ✅ Archive the app for Release configuration
- ✅ Export IPA file for App Store distribution
- ✅ Open the build folder automatically

### Step 4: Upload to App Store Connect

```bash
# Upload using command line (replace with your credentials)
xcrun altool --upload-app \
             --type ios \
             --file "build/release/seraApp.ipa" \
             --username "your-apple-id@email.com" \
             --password "your-app-specific-password"
```

Or use **Xcode Organizer**:
1. Open Xcode
2. **Window** → **Organizer**
3. Select your archive
4. Click **Distribute App** → **App Store Connect**

## Common Issues & Quick Fixes

### ❌ "No Team Found in Archive"

**Solution:**
```bash
# Open Xcode project
open ios/seraApp.xcworkspace

# In Xcode:
# 1. Select seraApp project
# 2. Go to Signing & Capabilities
# 3. Set Team to your Apple Developer Team
# 4. Enable "Automatically manage signing"
```

### ❌ "Export Failed"

**The script automatically tries these fallbacks:**
1. **App Store** method (primary)
2. **Ad Hoc** method (fallback)
3. **Development** method (last resort)

### ❌ "Certificate Issues"

**Solution:**
```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reset keychain
security delete-keychain ios-build.keychain

# Re-run the build
./scripts/build-ios-release.sh
```

### ❌ CocoaPods Issues

**Solution:**
```bash
cd ios
rm -rf Pods/ Podfile.lock
pod deintegrate
pod setup
pod install
cd ..
```

## Build Outputs

After successful build, you'll find:

```
build/
├── seraApp-Release.xcarchive     # Archive for distribution
└── release/
    ├── seraApp.ipa              # App Store ready IPA
    ├── DistributionSummary.plist # Build summary
    └── ExportOptions.plist      # Export configuration
```

## App Store Submission Checklist

Before submitting to App Store:

- [ ] **Test IPA** on physical device
- [ ] **Arabic RTL** layout works correctly
- [ ] **Nafath authentication** functions properly
- [ ] **All screens** display correctly
- [ ] **Dark mode** compatibility verified
- [ ] **Government standards** compliance checked
- [ ] **Privacy policy** links are working
- [ ] **App metadata** prepared in App Store Connect

## Version Management

### Update Version for New Release

```bash
# For bug fixes (1.0.0 → 1.0.1)
./scripts/update-ios-version.sh 1.0.1 2

# For new features (1.0.1 → 1.1.0)
./scripts/update-ios-version.sh 1.1.0 3

# For major updates (1.1.0 → 2.0.0)
./scripts/update-ios-version.sh 2.0.0 4
```

### Build and Tag Release

```bash
# The update script will ask if you want to create a git tag
# Or manually:
git add ios/seraApp/Info.plist app.json package.json
git commit -m "chore: bump version to 1.0.1 (build 2)"
git tag v1.0.1
git push origin main --tags
```

## Testing Before Release

### Device Testing

Test on these devices minimum:
- **iPhone SE** (small screen)
- **iPhone 14** (standard size)  
- **iPhone 14 Pro Max** (large screen)

### iOS Version Testing

- **iOS 13.0** (minimum supported)
- **iOS 16.x** (common version)
- **iOS 17.x** (latest version)

### Functionality Testing

- [ ] **Login/Logout** flow
- [ ] **Arabic/English** language switching
- [ ] **RTL layout** in Arabic mode
- [ ] **Nafath authentication** integration
- [ ] **Complaints submission** process
- [ ] **Permits application** workflow
- [ ] **Offline mode** functionality
- [ ] **Push notifications** (if implemented)

## App Store Connect Setup

### 1. Create App Record

1. Login to [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps** → **+** → **New App**
3. Fill app information:
   - **Name**: SERA App
   - **Bundle ID**: sa.gov.sera.mobile
   - **SKU**: sera-mobile-app
   - **Primary Language**: English

### 2. App Information

- **Category**: Government
- **Content Rights**: Government Entity Content
- **Age Rating**: 4+ (No Restricted Content)

### 3. Pricing and Availability

- **Price**: Free
- **Availability**: Saudi Arabia (and other desired countries)

### 4. App Privacy

Fill privacy questionnaire according to:
- **Data Collection**: User authentication data
- **Third-party SDKs**: Nafath integration
- **Government Compliance**: Saudi data protection laws

## Next Steps After Upload

1. **Processing Time**: 1-2 hours for processing
2. **TestFlight**: Available for internal testing
3. **App Review**: Submit for App Store review (2-7 days)
4. **Release**: Manual or automatic release after approval

## Support and Troubleshooting

- **Build Issues**: See `docs/troubleshooting/IOS_SIGNING_TROUBLESHOOTING.md`
- **Detailed Guide**: See `docs/deployment/ios-release-build-guide.md`
- **CICD Setup**: See `docs/deployment/ci-cd-guide.md`

---

**Success!** 🎉 Your SERA Mobile app is now ready for the App Store! 