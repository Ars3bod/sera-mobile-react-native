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
- **Purpose**: بناء وتجريب IPA للتطوير
- **Features**: Simulator builds, debug configurations
- **Output**: Debug IPA with enhanced artifacts
- **Retention**: 7 days

### 4. 🍎 **iOS Release** (`ios-release.yml`) - ✨ **Updated**

- **Trigger**: Push to `main`, tags `v*`
- **Purpose**: بناء IPA نهائي للإنتاج
- **Features**: Code signing, provisioning profiles, release optimizations
- **Output**: Signed Release IPA with dSYM files
- **Retention**: 90 days

### 5. 🚀 **Release & Deploy** (`release-and-deploy.yml`) - ✨ **Enhanced**

- **Trigger**: Push to `main`, tags `v*`, manual dispatch
- **Purpose**: بناء ونشر شامل للإنتاج
- **Features**:
  - ✅ Optional test execution (can be skipped)
  - 🤖 Android release APK with keystore signing
  - 🍎 iOS release IPA with code signing
  - 🔥 Firebase App Distribution deployment
  - 📦 Automatic GitHub releases
  - 📊 Comprehensive build reporting
- **Inputs**:
  - `release_type`: beta/production
  - `release_notes`: Custom release description
  - `skip_tests`: Skip test execution for faster builds
- **Output**: Production-ready builds
- **Retention**: 90 days

### 6. 🐛 **Release & Deploy (Debug Mode)** (`release-and-deploy-debug.yml`) - ✨ **NEW**

- **Trigger**: Push to `develop`, `feature/*`, manual dispatch
- **Purpose**: بناء ونشر سريع للاختبار والتطوير
- **Features**:
  - ⚡ Fast debug builds without complex signing
  - 🤖 Android debug APK (uses debug keystore)
  - 🍎 iOS debug archive (no signing requirements)
  - 🔥 Firebase App Distribution for beta testing
  - 📦 Debug GitHub releases with clear labeling
  - 🧪 Optional test execution (default: skipped)
  - ⚠️ Clear debug/testing indicators
- **Inputs**:
  - `release_type`: beta-debug/internal-debug/testing-debug
  - `release_notes`: Custom debug notes
  - `skip_tests`: Skip tests (default: true)
  - `deploy_to_firebase`: Enable/disable Firebase deployment
- **Output**: Debug builds for testing
- **Retention**: 30 days
- **Benefits**:
  - 🚀 Faster execution (no complex signing)
  - 🔄 Frequent testing capability
  - 🐛 Debug symbols included
  - 👥 Easy distribution to testers

## 🔧 **Workflow Features Comparison**

| Feature             | Debug Workflows | Release Workflows | Release & Deploy | Debug Release & Deploy     |
| ------------------- | --------------- | ----------------- | ---------------- | -------------------------- |
| **Speed**           | ⚡ Fast         | 🐌 Slower         | 🐌 Comprehensive | ⚡ Very Fast               |
| **Code Signing**    | 🚫 None/Simple  | ✅ Full           | ✅ Production    | 🚫 Debug Only              |
| **Firebase Deploy** | ❌ No           | ❌ No             | ✅ Yes           | ✅ Yes (Optional)          |
| **Test Execution**  | ✅ Yes          | ✅ Yes            | 🔄 Optional      | 🔄 Optional (Skip Default) |
| **Artifacts**       | 📦 Basic        | 📦 Enhanced       | 📦 Production    | 📦 Debug + Symbols         |
| **Use Case**        | 🛠️ Development  | 🏭 Production     | 🚀 Release       | 🧪 Testing                 |

## 🎯 **Recommended Usage**

### **للتطوير اليومي:**

- استخدم **Android/iOS Debug** workflows للتطوير المستمر
- استخدم **Release & Deploy (Debug Mode)** للاختبار مع الفريق

### **للإنتاج:**

- استخدم **Release & Deploy** للإصدارات النهائية
- استخدم **Android/iOS Release** للبناء المنفصل

### **للاختبار السريع:**

- استخدم **Release & Deploy (Debug Mode)** مع Firebase Distribution
- فعل `skip_tests` للسرعة القصوى

## 🔐 **Required Secrets**

### **للـ Release Workflows:**

```bash
# Android Signing
ANDROID_KEYSTORE=<base64_keystore>
ANDROID_KEYSTORE_PASSWORD=<password>
ANDROID_KEY_ALIAS=<alias>
ANDROID_KEY_PASSWORD=<password>

# iOS Signing (Optional)
IOS_CERTIFICATE_BASE64=<certificate>
IOS_CERTIFICATE_PASSWORD=<password>
IOS_PROVISIONING_PROFILE_BASE64=<profile>

# Firebase Distribution
FIREBASE_SERVICE_ACCOUNT=<service_account_json>
FIREBASE_APP_ID=<android_app_id>
FIREBASE_IOS_APP_ID=<ios_app_id>

# Optional
CODECOV_TOKEN=<token>
```

### **للـ Debug Workflows:**

```bash
# Firebase Distribution (Optional)
FIREBASE_SERVICE_ACCOUNT=<service_account_json>
FIREBASE_APP_ID=<android_app_id>
FIREBASE_IOS_APP_ID=<ios_app_id>

# Optional
CODECOV_TOKEN=<token>
```

## 📊 **Workflow Status**

| Workflow               | Status      | Last Updated | Notes                       |
| ---------------------- | ----------- | ------------ | --------------------------- |
| Android Debug          | ✅ Ready    | 2024         | Basic debug builds          |
| Android Release        | ✅ Ready    | 2024         | Production ready            |
| iOS Debug              | ✅ Enhanced | 2024         | Updated with IPA generation |
| iOS Release            | ✅ Enhanced | 2024         | Full signing support        |
| Release & Deploy       | ✅ Enhanced | 2024         | Skip tests option added     |
| Debug Release & Deploy | ✨ New      | 2024         | Fast debug distribution     |

## 🚨 **Important Notes**

### **Debug Mode Workflow:**

- ⚠️ **مخصص للاختبار فقط** - لا يستخدم للإنتاج
- 🔓 يستخدم debug keystore (مفاتيح مكشوفة)
- 🚀 أسرع في التنفيذ من release workflows
- 📱 مناسب للتوزيع على Firebase للمختبرين
- 🐛 يحتوي على debug symbols لتتبع الأخطاء

### **Security:**

- 🔐 Release keystores محمية في GitHub Secrets
- 🚫 Debug keystores ليست سرية
- 📱 Firebase service account مشترك بين جميع workflows

### **Performance:**

- ⚡ Debug workflows: ~5-10 دقائق
- 🐌 Release workflows: ~15-25 دقيقة
- 🚀 Debug Release & Deploy: ~8-15 دقيقة

## 🎉 **Getting Started**

### **للبدء السريع:**

1. أعد Firebase App Distribution (اختياري)
2. شغل **Debug Release & Deploy** للاختبار
3. أعد Android Keystore للإنتاج
4. شغل **Release & Deploy** للنشر النهائي

### **للتطوير المستمر:**

1. استخدم **Android/iOS Debug** مع كل commit
2. استخدم **Debug Release & Deploy** للاختبار الأسبوعي
3. استخدم **Release & Deploy** للإصدارات الشهرية

---

## 📞 **Support & Documentation**

للمزيد من التفاصيل:

- 📚 **Android Keystore**: `.github/ANDROID_KEYSTORE_SETUP.md`
- 🔥 **Firebase Setup**: `.github/FIREBASE_SETUP.md`
- 🛠️ **Troubleshooting**: Check individual workflow logs
- 📋 **Quick Start**: `KEYSTORE_SETUP_SUMMARY.md`
