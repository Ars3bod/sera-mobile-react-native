# 🚀 SERA Mobile - CI/CD Workflows Summary

## 📋 **Overview**

مجموعة شاملة من GitHub Actions workflows للبناء والنشر التلقائي لتطبيق SERA Mobile على منصتي Android و iOS.

## 🛠️ **Available Workflows**

### 1. 🤖 **Android Debug** (`android-debug.yml`)

- **Trigger**: Push to `develop`, `feature/*`, PRs to `develop`/`main`
- **Purpose**: بناء وتجريب APK للتطوير
- **Output**: Debug APK for testing
- **Retention**: 7 days

### 2. 🤖 **Android Release** (`android-release.yml`)

- **Trigger**: Push to `main`, tags `v*`
- **Purpose**: بناء APK نهائي للإنتاج
- **Features**: Code signing support, artifact upload
- **Output**: Signed/Unsigned Release APK
- **Retention**: 90 days

### 3. 🍎 **iOS Debug** (`ios-debug.yml`) - ✨ **Updated**

- **Trigger**: Push to `develop`, `feature/*`, PRs to `develop`/`main`
- **Purpose**: بناء IPA للتطوير والاختبار
- **Features**:
  - ✅ Debug IPA generation
  - ✅ Simulator .app bundle
  - ✅ Development provisioning support
  - ✅ Artifact upload with build number
- **Output**:
  - Debug IPA (if signed)
  - Simulator app bundle
- **Retention**: 7 days

### 4. 🍎 **iOS Release** (`ios-release.yml`) - ✨ **Enhanced**

- **Trigger**: Push to `main`, tags `v*`
- **Purpose**: بناء IPA نهائي للتوزيع
- **Features**:
  - ✅ Release IPA generation
  - ✅ Enhanced code signing
  - ✅ dSYM files for crash reporting
  - ✅ Multiple export options
  - ✅ Detailed build info
  - ✅ Archive preservation
- **Output**:
  - Release IPA (signed/unsigned)
  - dSYM debug symbols
  - Xcode archive
- **Retention**: 90 days (IPA), 365 days (dSYM)

### 5. 🚀 **Release & Deploy** (`release-and-deploy.yml`) - ✨ **Enhanced**

- **Trigger**: Tags `v*`, Push to `main`, Manual dispatch
- **Purpose**: إنتاج وتوزيع شامل
- **New Features**:
  - ✅ **Optional Tests**: `skip_tests` parameter
  - ✅ **Conditional Builds**: Continue even if tests fail/skip
  - ✅ **Enhanced Artifacts**: Build number in names
  - ✅ **Better Error Handling**: Individual job success tracking
  - ✅ **Detailed Reporting**: Test status in releases

## 🎯 **Key Improvements**

### 📱 **iOS Enhancements**

1. **IPA Generation**:

   - Debug و Release builds تنتج IPA files
   - Support للـ development و app-store export methods
   - Enhanced export options configuration

2. **Code Signing**:

   - Improved keychain handling
   - Automatic provisioning profile installation
   - Fallback options for unsigned builds

3. **Artifacts**:
   - Unique names with build numbers
   - dSYM files للـ crash reporting
   - Xcode archives preservation
   - Extended retention periods

### 🧪 **Testing Flexibility**

- **Optional Tests**: يمكن تخطي الـ tests عبر `skip_tests` parameter
- **Conditional Builds**: البناء يستمر حتى لو فشلت الـ tests
- **Status Tracking**: تتبع حالة كل job بشكل منفصل

### 📦 **Artifact Management**

- **Unique Names**: كل build له اسم فريد مع رقم البناء
- **Retention Policies**:
  - Debug builds: 7 days
  - Release builds: 90 days
  - Debug symbols: 365 days
- **Error Handling**: `if-no-files-found` للتعامل مع الملفات المفقودة

## 🔧 **Manual Workflow Dispatch Options**

### 🚀 **Release & Deploy Workflow**

```yaml
# Manual trigger options:
release_type: [beta, production]
release_notes: 'Custom release notes'
skip_tests: [true, false] # ✨ New option
```

## 📁 **Artifact Structure**

### 🤖 **Android Artifacts**

```
sera-android-debug-{build_number}
├── app-debug.apk

sera-android-release-{build_number}
├── app-release.apk (signed/unsigned)
```

### 🍎 **iOS Artifacts**

```
sera-ios-debug-{build_number}
├── seraApp.ipa (if signed)
├── seraApp.app/

sera-ios-release-{build_number}
├── seraApp.ipa
├── seraApp.app/
├── seraApp-Release.xcarchive/

sera-ios-dsym-{build_number}
├── dSYMs/
    ├── seraApp.app.dSYM/
    └── [other debug symbols]
```

## 🔐 **Required Secrets**

### 🤖 **Android Signing**

- `ANDROID_KEYSTORE` (base64)
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

### 🍎 **iOS Signing**

- `IOS_CERTIFICATE_BASE64`
- `IOS_CERTIFICATE_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64`

### 🔥 **Firebase Distribution**

- `FIREBASE_APP_ID` (Android)
- `FIREBASE_IOS_APP_ID` (iOS)
- `FIREBASE_SERVICE_ACCOUNT`

### 📊 **Analytics**

- `CODECOV_TOKEN` (optional)

## 🎯 **Usage Examples**

### 🚀 **Quick Release (Skip Tests)**

```bash
# Manual dispatch مع تخطي الـ tests
gh workflow run "release-and-deploy.yml" \
  -f release_type=beta \
  -f skip_tests=true \
  -f release_notes="Hotfix release"
```

### 📱 **Development Build**

```bash
# Push to develop branch
git push origin develop

# يبدأ تلقائياً:
# - android-debug.yml
# - ios-debug.yml
```

### 🏷️ **Production Release**

```bash
# Create and push tag
git tag v1.2.3
git push origin v1.2.3

# يبدأ تلقائياً:
# - release-and-deploy.yml (all platforms)
# - Creates GitHub release
# - Deploys to Firebase
```

## 📊 **Build Status Matrix**

| Workflow         | Debug | Release | Tests | Firebase | GitHub Release |
| ---------------- | ----- | ------- | ----- | -------- | -------------- |
| Android Debug    | ✅    | ❌      | ❌    | ❌       | ❌             |
| Android Release  | ❌    | ✅      | ❌    | ❌       | ❌             |
| iOS Debug        | ✅    | ❌      | ❌    | ❌       | ❌             |
| iOS Release      | ❌    | ✅      | ❌    | ❌       | ❌             |
| Release & Deploy | ❌    | ✅      | ✅/⏭️ | ✅       | ✅             |

## 🛡️ **Error Handling & Recovery**

### 🧪 **Test Failures**

- Tests can be skipped using `skip_tests: true`
- Builds continue even if tests fail
- Test status reported in release notes

### 📱 **Build Failures**

- Individual platform failures don't stop other platforms
- Partial releases supported (e.g., Android success, iOS fail)
- Detailed error reporting in job summaries

### 🔐 **Code Signing Issues**

- Unsigned builds created as fallback
- Clear indication of signing status
- Supports both development and distribution certificates

## 📈 **Performance Optimizations**

- **Caching**: Node modules, Gradle, CocoaPods, Ruby gems
- **Parallel Jobs**: Android and iOS build simultaneously
- **Artifact Compression**: Automatic compression by GitHub Actions
- **Conditional Steps**: Skip unnecessary steps based on available secrets

## 🔄 **Update History**

### ✨ **Latest Updates (Current)**

- ✅ iOS Debug IPA generation
- ✅ iOS Release enhancements (dSYM, archives)
- ✅ Optional tests in Release & Deploy
- ✅ Enhanced artifact naming with build numbers
- ✅ Better error handling and status reporting
- ✅ Extended retention policies

### 📋 **Next Planned Improvements**

- 🔄 Automatic version bumping
- 📱 TestFlight upload automation
- 🔍 Enhanced testing with device farms
- 📊 Performance monitoring integration
