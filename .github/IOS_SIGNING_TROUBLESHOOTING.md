# 🍎 iOS Code Signing Troubleshooting - حل مشاكل التوقيع

## المشاكل الشائعة وحلولها

### مشكلة: No Team Found in Archive

**الخطأ الكامل:**

```
error: exportArchive: No Team Found in Archive
** EXPORT FAILED **
Error Domain=IDEDistributionAnalyzeArchiveStepErrorDomain Code=0 "No Team Found in Archive"
```

**السبب:**
الـ archive تم بناؤه بدون `DEVELOPMENT_TEAM` المطلوب لـ export IPA.

## ✅ الحل المُطبق

### استراتيجية متعددة المحاولات:

1. **Attempt 1**: Development method مع Team ID
2. **Attempt 2**: Ad-hoc method إذا فشل الأول
3. **Attempt 3**: استخراج .app file يدوياً

### الكود المُحدث:

```yaml
- name: 🏗️ Build iOS Debug Archive
  run: |
    cd ios
    DEFAULT_TEAM="XXXXXXXXXX"  # Team ID افتراضي
    xcodebuild -workspace seraApp.xcworkspace \
               -scheme seraApp \
               -configuration Debug \
               -destination generic/platform=iOS \
               -archivePath $PWD/build/seraApp-Debug.xcarchive \
               archive \
               DEVELOPMENT_TEAM="$DEFAULT_TEAM" \
               CODE_SIGNING_ALLOWED=YES \
               CODE_SIGNING_REQUIRED=NO \
               -allowProvisioningUpdates
```

## 🎯 شرح المشاكل والحلول

### مشكلة 1: Missing Team ID

```
DEVELOPMENT_TEAM="XXXXXXXXXX"  # حل: إضافة Team ID افتراضي
```

### مشكلة 2: Export Method Issues

```yaml
# حل: جرب methods متعددة
method: development  → ad-hoc  → manual extraction
```

### مشكلة 3: Provisioning Profile

```yaml
# حل: السماح بـ automatic provisioning
-allowProvisioningUpdates
-allowProvisioningDeviceRegistration
```

## 🔧 دليل إعداد iOS Development Team

### الحصول على Team ID الصحيح:

#### 1. من Apple Developer Account:

1. **اذهب إلى**: https://developer.apple.com/account
2. **Membership** → **Team ID**
3. **انسخ Team ID** (10 characters: ABC123XYZ9)

#### 2. من Xcode:

1. **افتح Xcode** → **Preferences** → **Accounts**
2. **اختر Apple ID** → **Team**
3. **انسخ Team ID** من القائمة

#### 3. إعداد GitHub Secret:

```bash
# أضف إلى GitHub Repository Settings → Secrets:
IOS_DEVELOPMENT_TEAM = ABC123XYZ9
```

### استخدام Team ID في Workflow:

```yaml
DEVELOPMENT_TEAM="${{ secrets.IOS_DEVELOPMENT_TEAM || 'XXXXXXXXXX' }}"
```

## 🚨 مشاكل إضافية وحلولها

### مشكلة: Provisioning Profile Not Found

```yaml
# حل: استخدام automatic signing
<key>signingStyle</key>
<string>automatic</string>
```

### مشكلة: Certificate Issues

```yaml
# حل: تجاهل certificate requirements للـ debug
CODE_SIGNING_REQUIRED=NO
```

### مشكلة: Build Settings Conflicts

```yaml
# حل: override build settings
-destination generic/platform=iOS \
-allowProvisioningUpdates \
-allowProvisioningDeviceRegistration
```

## 📋 Export Methods المختلفة

### 1. Development Method:

```xml
<key>method</key>
<string>development</string>
<key>signingStyle</key>
<string>automatic</string>
```

- **الأفضل لـ**: Debug builds للمطورين
- **يتطلب**: Team ID فقط
- **لا يتطلب**: Distribution certificate

### 2. Ad-hoc Method:

```xml
<key>method</key>
<string>ad-hoc</string>
<key>signingStyle</key>
<string>automatic</string>
```

- **الأفضل لـ**: Internal testing على أجهزة محددة
- **يتطلب**: Team ID + Device UUIDs
- **مناسب لـ**: Firebase App Distribution

### 3. Manual Extraction:

```bash
# استخراج .app من archive
cp -R archive/Products/Applications/App.app ./
# إنشاء IPA يدوياً
mkdir Payload && cp -R App.app Payload/
zip -r App.ipa Payload/
```

- **الأفضل لـ**: عندما تفشل العمليات الأخرى
- **لا يتطلب**: أي signing
- **مناسب لـ**: Simulator testing

## 🔍 استكشاف أخطاء iOS Builds

### خطوات التشخيص:

#### 1. تحقق من Archive Success:

```bash
# ابحث عن .xcarchive
find . -name "*.xcarchive"
```

#### 2. تحقق من Export Options:

```bash
# تحقق من صحة export plist
plutil -lint ExportOptions.plist
```

#### 3. تحقق من Available Files:

```bash
# ابحث عن جميع الملفات المُنتجة
find build/ -name "*.ipa" -o -name "*.app" -o -name "*.xcarchive"
```

### Debug Commands مفيدة:

#### عرض معلومات Archive:

```bash
xcodebuild -exportArchive \
           -archivePath seraApp.xcarchive \
           -exportPath ./export \
           -exportOptionsPlist ExportOptions.plist \
           -verbose
```

#### اختبار Signing Configuration:

```bash
# عرض signing identity
security find-identity -v -p codesigning

# عرض provisioning profiles
ls ~/Library/MobileDevice/Provisioning\ Profiles/
```

## 💡 أفضل الممارسات

### للـ Debug Builds:

- ✅ استخدم `development` method أولاً
- ✅ اجعل الـ signing optional
- ✅ اجعل export يدوي كـ fallback
- ✅ ارفع الـ archive دائماً حتى لو فشل export

### للـ Production Builds:

- ✅ استخدم `app-store` method
- ✅ اطلب certificates صحيحة
- ✅ استخدم distribution provisioning profiles
- ✅ فعل code signing requirements

### للـ Testing:

- ✅ استخدم `ad-hoc` method
- ✅ أضف Device UUIDs للـ provisioning profile
- ✅ استخدم Firebase App Distribution
- ✅ اختبر على أجهزة حقيقية

## 🎉 تأكيد نجاح البناء

### علامات النجاح:

```
✅ Archive created: seraApp-Debug.xcarchive
✅ IPA exported: seraApp.ipa
✅ Upload successful: artifacts uploaded
✅ Firebase deployed: available for download
```

### إذا فشل Export لكن نجح Archive:

```
⚠️ Archive available but no IPA
✅ Can install via Xcode
✅ Can test on simulator
✅ Debug symbols available
```

## 🔗 إعداد Team ID صحيح

### للمشاريع الحكومية (SERA):

#### 1. احصل على Apple Developer Enterprise Account

#### 2. سجل Team ID في GitHub Secrets:

```bash
IOS_DEVELOPMENT_TEAM=ABC123XYZ9  # Team ID الحقيقي
```

#### 3. حدث Workflow:

```yaml
DEVELOPMENT_TEAM="${{ secrets.IOS_DEVELOPMENT_TEAM || 'XXXXXXXXXX' }}"
```

### للاختبار فقط:

- Team ID الوهمي `XXXXXXXXXX` يعمل للـ archive
- لكن لن ينتج IPA قابل للتثبيت
- مناسب للـ development والاختبار الأولي

## 🛠️ الحلول البديلة

### إذا لم يكن لديك Apple Developer Account:

#### 1. Simulator Build Only:

```yaml
-destination 'platform=iOS Simulator,name=iPhone 15'
```

#### 2. Archive Without Export:

```yaml
# احفظ archive فقط بدون IPA
# مفيد للـ debugging وتحليل الكود
```

#### 3. Local Development:

```yaml
# استخدم Xcode محلياً للـ testing
# archive متاح للتحميل من GitHub
```

---

**📞 الدعم:** للمساعدة في إعداد Apple Developer Account أو Team ID، راجع [Apple Developer Documentation](https://developer.apple.com/support/)
