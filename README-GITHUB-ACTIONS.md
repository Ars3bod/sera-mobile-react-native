# 🚀 SERA Mobile App - GitHub Actions CI/CD

## ⚡ Quick Setup (2 minutes)

```bash
# 1. Run setup script
./scripts/setup-github-actions.sh

# 2. Commit and push to GitHub
git add .
git commit -m "Add GitHub Actions CI/CD workflows"
git push origin main
```

## 📋 Available Workflows

| Workflow                | Purpose                     | Triggers                          | Duration   | Output          |
| ----------------------- | --------------------------- | --------------------------------- | ---------- | --------------- |
| **📱 Android Debug**    | Quick testing APK           | Push to develop, feature branches | ~8-12 min  | Debug APK       |
| **🚀 Android Release**  | Production-ready APK        | Push to main, tags                | ~10-15 min | Signed APK      |
| **🍎 iOS Debug**        | iOS simulator build         | Push to develop, feature branches | ~15-20 min | Debug App       |
| **🍎 iOS Release**      | App Store ready IPA         | Push to main, tags                | ~20-25 min | Signed IPA      |
| **🚀 Release & Deploy** | Full release + distribution | Tags, manual trigger              | ~30-40 min | Both + Firebase |

## 🎯 Workflow Details

### 1. **📱 Android Debug** (`android-debug.yml`)

- **Perfect for**: Development testing, PR reviews
- **Triggers**: Push to `develop`, `feature/*` branches, PRs
- **Output**: Fast debug APK for immediate testing
- **Retention**: 7 days

### 2. **🚀 Android Release** (`android-release.yml`)

- **Perfect for**: Production builds, store submission
- **Triggers**: Push to `main`, version tags
- **Features**: APK signing (if keystore configured)
- **Output**: Production-ready signed APK
- **Retention**: 30 days

### 3. **🍎 iOS Debug** (`ios-debug.yml`)

- **Perfect for**: iOS simulator testing
- **Triggers**: Push to `develop`, `feature/*` branches, PRs
- **Output**: Debug build for iOS simulator
- **Note**: Simulator-only, no device installation

### 4. **🍎 iOS Release** (`ios-release.yml`)

- **Perfect for**: App Store builds, TestFlight
- **Triggers**: Push to `main`, version tags
- **Features**: Code signing (if certificates configured)
- **Output**: IPA file ready for distribution
- **Retention**: 30 days

### 5. **🚀 Release & Deploy** (`release-and-deploy.yml`)

- **Perfect for**: Official releases, distribution to testers
- **Triggers**: Version tags (`v*`), manual dispatch
- **Features**:
  - ✅ Runs full test suite
  - 🤖 Builds Android + iOS
  - 🔥 Deploys to Firebase App Distribution
  - 📦 Creates GitHub release
  - 📊 Test coverage reporting
- **Retention**: 90 days

## 📥 Download Your Builds

### **Quick Downloads (Artifacts)**

1. Go to **Actions** tab → Select workflow run
2. Scroll to **Artifacts** section
3. Download APK/IPA files

### **Release Downloads**

1. Go to **Releases** tab
2. Download from latest release (auto-created from tags)

### **Firebase Distribution**

- Beta testers get automatic notifications
- Production testers for production releases

## 🔧 Required Secrets

Add these in **Repository Settings → Secrets**:

### **Android Signing** (Optional but recommended):

```
ANDROID_KEYSTORE          # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD # Keystore password
ANDROID_KEY_ALIAS         # Key alias
ANDROID_KEY_PASSWORD      # Key password
```

### **iOS Signing** (Optional for iOS builds):

```
IOS_CERTIFICATE_BASE64         # Base64 encoded .p12 certificate
IOS_CERTIFICATE_PASSWORD       # Certificate password
IOS_PROVISIONING_PROFILE_BASE64 # Base64 encoded provisioning profile
```

### **Firebase App Distribution** (For automatic distribution):

```
FIREBASE_APP_ID               # Android App ID from Firebase
FIREBASE_IOS_APP_ID          # iOS App ID from Firebase (optional)
FIREBASE_SERVICE_ACCOUNT     # Firebase service account JSON
```

### **Code Coverage** (Optional):

```
CODECOV_TOKEN                # Codecov.io token for coverage reports
```

## 🎮 Manual Triggers

### **Run Any Workflow Manually:**

1. Go to **Actions** → Select workflow
2. Click **Run workflow**
3. Choose branch and options

### **Release & Deploy Options:**

- **Release Type**: Beta or Production
- **Release Notes**: Custom notes for the release
- **Target**: Different tester groups in Firebase

## 📊 Workflow Triggers Summary

| Event                 | Android Debug | Android Release | iOS Debug | iOS Release | Release & Deploy |
| --------------------- | ------------- | --------------- | --------- | ----------- | ---------------- |
| **Push to develop**   | ✅            | ❌              | ✅        | ❌          | ❌               |
| **Push to main**      | ❌            | ✅              | ❌        | ✅          | ✅               |
| **Pull Request**      | ✅            | ❌              | ✅        | ❌          | ❌               |
| **Version Tag (v\*)** | ❌            | ✅              | ❌        | ✅          | ✅               |
| **Manual Trigger**    | ✅            | ✅              | ✅        | ✅          | ✅               |

## 🔥 Firebase Setup Guide

1. **Create Firebase Project**:

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project or use existing

2. **Add Android App**:

   - Add Android app with package name: `sa.gov.sera.mobile`
   - Note the App ID

3. **Add iOS App** (optional):

   - Add iOS app with bundle ID: `sa.gov.sera.mobile`
   - Note the App ID

4. **Enable App Distribution**:

   - Go to App Distribution in Firebase
   - Create tester groups: `beta-testers`, `production-testers`

5. **Create Service Account**:
   - Go to Project Settings → Service Accounts
   - Generate new private key (JSON)
   - Add to GitHub Secrets as `FIREBASE_SERVICE_ACCOUNT`

## 🚀 Quick Start Examples

### **Test a Feature**:

```bash
git checkout -b feature/new-screen
# Make changes
git push origin feature/new-screen
# → Triggers Android & iOS Debug builds
```

### **Release to Production**:

```bash
git tag v1.0.0
git push origin v1.0.0
# → Triggers Release & Deploy workflow
# → Creates GitHub release
# → Deploys to Firebase for testers
```

### **Emergency Release**:

1. Go to Actions → **🚀 Release & Deploy**
2. Click **Run workflow**
3. Select `main` branch
4. Choose `production` type
5. Add release notes

---

**Ready to automate your builds? Push your code and let GitHub handle the rest! 🎉**
