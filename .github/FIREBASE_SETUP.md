# 🔥 Firebase App Distribution Setup Guide

## 📋 **Overview**

هذا الدليل يشرح خطوة بخطوة كيفية تكوين Firebase App Distribution مع GitHub Actions للتطبيق SERA Mobile.

## 🎯 **ما ستحتاجه**

- ✅ حساب Google/Gmail
- ✅ حساب GitHub مع صلاحيات admin على المستودع
- ✅ Firebase Console access
- ✅ Google Cloud Console access

## 🔧 **خطوات الإعداد**

### **المرحلة 1: إنشاء Firebase Project**

#### **1.1 إنشاء المشروع:**

```bash
# اذهب إلى Firebase Console
https://console.firebase.google.com/

# خطوات الإنشاء:
1. انقر "Add project"
2. اسم المشروع: "sera-mobile-app"
3. Project ID: "sera-mobile-app" (أو ما يُنشأ تلقائياً)
4. فعل Google Analytics (مُنصح)
5. اختر أو أنشئ Google Analytics account
6. انقر "Create project"
```

#### **1.2 إضافة Android App:**

```bash
# في Firebase Console:
1. انقر "Add app" → Android icon
2. Android package name: "com.sera.mobile.app"
   # يجب أن يتطابق مع android/app/build.gradle
3. App nickname: "SERA Android"
4. Debug signing certificate SHA-1: (اختياري)
5. انقر "Register app"
6. تنزيل google-services.json
7. انقر "Continue to console"
```

#### **1.3 إضافة iOS App:**

```bash
# في Firebase Console:
1. انقر "Add app" → iOS icon
2. iOS bundle ID: "com.sera.mobile.app"
   # يجب أن يتطابق مع Xcode project
3. App nickname: "SERA iOS"
4. App Store ID: (اختياري - يمكن إضافته لاحقاً)
5. انقر "Register app"
6. تنزيل GoogleService-Info.plist
7. انقر "Continue to console"
```

### **المرحلة 2: تفعيل App Distribution**

#### **2.1 تفعيل الخدمة:**

```bash
# في Firebase Console:
1. اذهب إلى "Run" → "App Distribution"
2. انقر "Get started"
3. سيتم تفعيل الخدمة تلقائياً
```

#### **2.2 إنشاء مجموعات المختبرين:**

**Beta Testers Group:**

```bash
# في App Distribution → "Testers & Groups":
1. انقر "Add group"
2. Group name: "beta-testers"
3. Description: "Beta testers for SERA mobile app"
4. أضف emails للمختبرين:
   - abdullahalmaimoun@example.com
   - dev1@sera.com
   - qa.beta@sera.com
```

**Production Testers Group:**

```bash
# إنشاء مجموعة ثانية:
1. انقر "Add group"
2. Group name: "production-testers"
3. Description: "Production testers for SERA mobile app"
4. أضف emails للمختبرين:
   - manager@sera.com
   - qa.prod@sera.com
   - stakeholder@sera.com
```

### **المرحلة 3: إنشاء Service Account**

#### **3.1 إنشاء Service Account:**

```bash
# اذهب إلى Google Cloud Console:
https://console.cloud.google.com/

# تأكد من اختيار نفس المشروع (sera-mobile-app)
1. اذهب إلى "IAM & Admin" → "Service Accounts"
2. انقر "Create Service Account"
```

#### **3.2 تكوين Service Account:**

```bash
# معلومات الحساب:
Service account name: sera-ci-cd-automation
Service account ID: sera-ci-cd-automation
Description: Service account for SERA CI/CD GitHub Actions automation

# انقر "Create and Continue"
```

#### **3.3 منح الصلاحيات:**

```bash
# أضف الأدوار التالية:
- Firebase App Distribution Admin
- Firebase Rules Admin
- Cloud Storage for Firebase Admin
- Firebase Management Admin (اختياري للمزيد من التحكم)

# انقر "Continue" ثم "Done"
```

#### **3.4 إنشاء JSON Key:**

```bash
# في صفحة Service Accounts:
1. انقر على الحساب المُنشأ (sera-ci-cd-automation)
2. اذهب إلى tab "Keys"
3. انقر "Add Key" → "Create new key"
4. اختر "JSON"
5. انقر "Create"
6. سيتم تنزيل ملف JSON
7. احتفظ بالملف بأمان - ستحتاجه لـ GitHub Secrets
```

### **المرحلة 4: الحصول على Firebase App IDs**

#### **4.1 الحصول على Android App ID:**

```bash
# في Firebase Console:
1. اذهب إلى "Project settings" (الترس العلوي)
2. tab "General"
3. تحت "Your apps" → Android app section
4. انسخ "App ID" (يبدأ بـ 1:1234567890:android:...)

# مثال:
App ID: 1:123456789012:android:abcdef1234567890abcdef
```

#### **4.2 الحصول على iOS App ID:**

```bash
# نفس المكان:
1. تحت "Your apps" → iOS app section
2. انسخ "App ID" (يبدأ بـ 1:1234567890:ios:...)

# مثال:
App ID: 1:123456789012:ios:fedcba0987654321fedcba
```

### **المرحلة 5: إعداد GitHub Secrets**

#### **5.1 فتح GitHub Repository Settings:**

```bash
# اذهب إلى مستودع GitHub:
https://github.com/YOUR_USERNAME/sera-mobile-react

# Navigate to:
Repository → Settings → Secrets and variables → Actions
```

#### **5.2 إضافة Firebase Secrets:**

**أ. إضافة Service Account JSON:**

```bash
# انقر "New repository secret"
Name: FIREBASE_SERVICE_ACCOUNT
Value: [أنسخ محتوى ملف JSON بالكامل]

# الملف يجب أن يكون مثل:
{
  "type": "service_account",
  "project_id": "sera-mobile-app",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "sera-ci-cd-automation@sera-mobile-app.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

**ب. إضافة Android App ID:**

```bash
Name: FIREBASE_APP_ID
Value: 1:123456789012:android:abcdef1234567890abcdef
```

**ج. إضافة iOS App ID:**

```bash
Name: FIREBASE_IOS_APP_ID
Value: 1:123456789012:ios:fedcba0987654321fedcba
```

### **المرحلة 6: اختبار التكوين**

#### **6.1 اختبار يدوي:**

```bash
# تشغيل workflow يدوياً:
1. اذهب إلى GitHub Actions
2. اختر "Release & Deploy" workflow
3. انقر "Run workflow"
4. املأ الخيارات:
   - Branch: main
   - Release type: beta
   - Release notes: "Testing Firebase integration"
   - Skip tests: true (للاختبار السريع)
5. انقر "Run workflow"
```

#### **6.2 مراقبة النتائج:**

```bash
# تحقق من:
1. GitHub Actions logs للتأكد من عدم وجود أخطاء
2. Firebase Console → App Distribution
3. تأكد من ظهور releases جديدة
4. تحقق من وصول إشعارات للمختبرين
```

## 🔍 **معلومات مهمة**

### **App Package Names:**

```bash
# تأكد من تطابق الأسماء:
Android: com.sera.mobile.app (في android/app/build.gradle)
iOS: com.sera.mobile.app (في Xcode bundle identifier)
Firebase: نفس الأسماء في Firebase Console
```

### **Tester Groups:**

```bash
# يمكنك استخدام:
- beta-testers: للإصدارات التجريبية
- production-testers: للإصدارات النهائية
- internal: للفريق الداخلي (اختياري)
```

### **File Paths في الـ Workflow:**

```bash
# Android APK path:
android/app/build/outputs/apk/release/app-release.apk

# iOS IPA path:
ios/build/release/*.ipa
```

## 🚨 **مشاكل شائعة وحلولها**

### **1. مشكلة Service Account Permissions:**

```bash
# الحل:
1. تأكد من الأدوار الصحيحة في Google Cloud Console
2. تأكد من تفعيل Firebase Management API
3. أعد إنشاء المفتاح JSON إذا لزم الأمر
```

### **2. مشكلة App ID غير صحيح:**

```bash
# الحل:
1. تحقق من تطابق Package Name
2. تأكد من App ID الصحيح من Firebase Console
3. تحقق من عدم وجود مسافات إضافية في GitHub Secrets
```

### **3. مشكلة Tester Groups غير موجودة:**

```bash
# الحل:
1. تأكد من إنشاء المجموعات في Firebase Console
2. تحقق من الأسماء الصحيحة في الـ workflow
3. أضف المختبرين إلى المجموعات
```

## ✅ **Checklist للتحقق النهائي**

- [ ] ✅ Firebase project created
- [ ] ✅ Android app added to Firebase
- [ ] ✅ iOS app added to Firebase
- [ ] ✅ App Distribution enabled
- [ ] ✅ Tester groups created (beta-testers, production-testers)
- [ ] ✅ Service account created with proper roles
- [ ] ✅ JSON key downloaded
- [ ] ✅ GitHub secrets added:
  - [ ] FIREBASE_SERVICE_ACCOUNT
  - [ ] FIREBASE_APP_ID
  - [ ] FIREBASE_IOS_APP_ID
- [ ] ✅ Workflow tested successfully
- [ ] ✅ App distributed to testers

## 🎉 **الخطوات التالية**

بعد إتمام الإعداد:

1. **اختبر الـ workflow** مع release تجريبي
2. **أضف المزيد من المختبرين** للمجموعات
3. **فعل إشعارات Slack/Email** للفريق
4. **اربط مع Crashlytics** لتتبع الأخطاء
5. **أعد تكوين بيانات Analytics** إذا لزم الأمر

---

## 📞 **المساعدة والدعم**

إذا واجهت أي مشاكل:

1. تحقق من GitHub Actions logs
2. راجع Firebase Console logs
3. تأكد من جميع الأذونات والصلاحيات
4. اطلب المساعدة من فريق التطوير

**Firebase Console**: https://console.firebase.google.com/
**Google Cloud Console**: https://console.cloud.google.com/
**GitHub Actions**: https://github.com/YOUR_REPO/actions
