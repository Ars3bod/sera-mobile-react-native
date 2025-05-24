# 🔐 Android Keystore Setup Guide

## 📋 **Overview**

هذا الدليل يشرح كيفية إنشاء Android Keystore للتوقيع الآمن لـ APK files ونشرها على Google Play Store.

## 🎯 **ما ستحتاجه**

- ✅ Java Development Kit (JDK) مثبت
- ✅ معلومات شخصية/شركة للشهادة
- ✅ إصدارات مختلفة من التطبيق (debug/release)
- ✅ GitHub repository access

## 🔧 **خطوات إنشاء Keystore**

### **المرحلة 1: إنشاء Keystore File**

#### **1.1 استخدام keytool (الطريقة المُوصى بها):**

```bash
# انتقل إلى مجلد مناسب
cd ~/Desktop

# إنشاء keystore جديد
keytool -genkey -v -keystore sera-release-key.keystore \
  -alias sera-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

#### **1.2 معلومات مطلوبة أثناء الإنشاء:**

```bash
# سيطلب منك المعلومات التالية:
Enter keystore password: [أدخل كلمة مرور قوية - احفظها!]
Re-enter new password: [أعد كتابة كلمة المرور]

What is your first and last name?
  [Unknown]: Abdullah Al Maimoun

What is the name of your organizational unit?
  [Unknown]: SERA Development Team

What is the name of your organization?
  [Unknown]: SERA Company

What is the name of your City or Locality?
  [Unknown]: Riyadh

What is the name of your State or Province?
  [Unknown]: Riyadh Province

What is the two-letter country code for this unit?
  [Unknown]: SA

Is CN=Abdullah Al Maimoun, OU=SERA Development Team, O=SERA Company, L=Riyadh, ST=Riyadh Province, C=SA correct?
  [no]: yes

# كلمة مرور للـ key (يمكن أن تكون نفس كلمة مرور keystore)
Enter key password for <sera-key-alias>
        (RETURN if same as keystore password): [اضغط Enter أو أدخل كلمة مرور منفصلة]
```

#### **1.3 التحقق من إنشاء Keystore:**

```bash
# التحقق من الملف المُنشأ
ls -la sera-release-key.keystore

# التحقق من محتويات keystore
keytool -list -v -keystore sera-release-key.keystore
```

### **المرحلة 2: تحويل Keystore إلى Base64**

#### **2.1 تحويل الملف لـ GitHub Secrets:**

```bash
# macOS/Linux:
base64 -i sera-release-key.keystore | pbcopy

# أو حفظه في ملف:
base64 -i sera-release-key.keystore > sera-keystore-base64.txt

# Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("sera-release-key.keystore")) | Set-Clipboard

# Linux (إذا pbcopy غير متوفر):
base64 sera-release-key.keystore | xclip -selection clipboard
```

#### **2.2 حفظ المعلومات بأمان:**

```bash
# احفظ هذه المعلومات في مكان آمن:
Keystore Password: [كلمة مرور keystore]
Key Alias: sera-key-alias
Key Password: [كلمة مرور key]
Keystore Base64: [النص المُحول من الخطوة السابقة]
```

### **المرحلة 3: إضافة Secrets إلى GitHub**

#### **3.1 فتح GitHub Repository Settings:**

```bash
# اذهب إلى مستودع GitHub:
https://github.com/YOUR_USERNAME/sera-mobile-react

# Navigate to:
Repository → Settings → Secrets and variables → Actions
```

#### **3.2 إضافة Android Keystore Secrets:**

**أ. إضافة Keystore Base64:**

```bash
Secret name: ANDROID_KEYSTORE
Value: [النص المُحول base64 من الخطوة 2.1]
```

**ب. إضافة Keystore Password:**

```bash
Secret name: ANDROID_KEYSTORE_PASSWORD
Value: [كلمة مرور keystore]
```

**ج. إضافة Key Alias:**

```bash
Secret name: ANDROID_KEY_ALIAS
Value: sera-key-alias
```

**د. إضافة Key Password:**

```bash
Secret name: ANDROID_KEY_PASSWORD
Value: [كلمة مرور key - نفس keystore إذا لم تختر منفصلة]
```

### **المرحلة 4: تكوين Gradle للتوقيع**

#### **4.1 إنشاء signing config في build.gradle:**

```bash
# تحديث android/app/build.gradle
# أضف هذا القسم قبل android {}:

def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias'] ?: System.getenv('KEY_ALIAS')
            keyPassword keystoreProperties['keyPassword'] ?: System.getenv('KEY_PASSWORD')
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword'] ?: System.getenv('KEYSTORE_PASSWORD')
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### **4.2 إنشاء key.properties للتطوير المحلي:**

```bash
# إنشاء android/key.properties (لا تضعه في Git!)
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=sera-key-alias
storeFile=../sera-release-key.keystore
```

#### **4.3 إضافة key.properties إلى .gitignore:**

```bash
# تأكد من وجود هذا في android/.gitignore:
key.properties
*.keystore
*.jks
```

### **المرحلة 5: اختبار التوقيع**

#### **5.1 اختبار محلي:**

```bash
# انتقل إلى مجلد android
cd seraApp/android

# تشغيل بناء signed APK
./gradlew assembleRelease

# التحقق من وجود APK موقع
ls -la app/build/outputs/apk/release/
```

#### **5.2 التحقق من التوقيع:**

```bash
# التحقق من توقيع APK
jarsigner -verify -verbose -certs app/build/outputs/apk/release/app-release.apk

# معلومات مفصلة عن التوقيع
keytool -printcert -jarfile app/build/outputs/apk/release/app-release.apk
```

### **المرحلة 6: اختبار GitHub Actions**

#### **6.1 تشغيل workflow:**

```bash
# اذهب إلى GitHub Actions
# اختر workflow يحتوي على Android build
# تحقق من logs للتأكد من نجاح التوقيع:

# يجب أن ترى:
> Task :app:validateSigningRelease
> Task :app:assembleRelease
BUILD SUCCESSFUL
```

#### **6.2 تحميل وفحص APK:**

```bash
# حمل APK من GitHub Actions artifacts
# تحقق من التوقيع محلياً:
jarsigner -verify downloaded-app-release.apk
```

## 🔍 **معلومات مهمة**

### **أنواع Keystores:**

```bash
# Debug Keystore (للتطوير):
- يُنشأ تلقائياً بواسطة Android Studio
- غير مناسب للنشر
- كلمة مرور معروفة: "android"

# Release Keystore (للإنتاج):
- يُنشأ يدوياً (هذا الدليل)
- مطلوب للنشر على Google Play
- كلمات مرور قوية وسرية
```

### **أهمية Keystore:**

```bash
# لماذا نحتاج Keystore:
- ✅ توقيع APK للنشر الآمن
- ✅ التحقق من هوية المطور
- ✅ منع التلاعب بالتطبيق
- ✅ متطلب إجباري لـ Google Play Store
- ✅ تحديثات التطبيق المستقبلية
```

### **حفظ Keystore بأمان:**

```bash
# احتياطات الأمان:
- 💾 احفظ نسخة احتياطية في مكان آمن
- 🔐 لا تشارك كلمات المرور
- 📝 احفظ معلومات keystore منفصلة
- 🚫 لا تضع keystore في Git
- ☁️  احفظ نسخة في cloud storage مشفر
```

## 🚨 **مشاكل شائعة وحلولها**

### **1. خطأ "keytool not found":**

```bash
# الحل - تأكد من تثبيت JDK:
# macOS:
brew install openjdk

# Windows:
# حمل JDK من Oracle أو OpenJDK
# أضف إلى PATH: C:\Program Files\Java\jdk-XX\bin

# Linux:
sudo apt install openjdk-11-jdk
```

### **2. خطأ "Wrong keystore password":**

```bash
# الحل:
1. تأكد من كلمة المرور الصحيحة
2. تحقق من GitHub Secrets
3. أعد إنشاء keystore إذا نسيت كلمة المرور
```

### **3. خطأ "Key alias not found":**

```bash
# الحل:
1. تحقق من alias name في GitHub Secrets
2. استخدم keytool -list لعرض aliases
3. تأكد من تطابق الأسماء بدقة
```

### **4. فشل في CI/CD signing:**

```bash
# الحل:
1. تحقق من base64 conversion صحيح
2. تأكد من جميع secrets موجودة
3. تحقق من build.gradle configuration
4. راجع GitHub Actions logs
```

## ✅ **Checklist للتحقق النهائي**

- [ ] ✅ Java JDK installed
- [ ] ✅ Keystore created with keytool
- [ ] ✅ Keystore information documented safely
- [ ] ✅ Base64 conversion completed
- [ ] ✅ GitHub Secrets added:
  - [ ] ANDROID_KEYSTORE
  - [ ] ANDROID_KEYSTORE_PASSWORD
  - [ ] ANDROID_KEY_ALIAS
  - [ ] ANDROID_KEY_PASSWORD
- [ ] ✅ build.gradle configured
- [ ] ✅ key.properties created (and gitignored)
- [ ] ✅ Local signing tested
- [ ] ✅ CI/CD signing tested
- [ ] ✅ Backup keystore saved securely

## 🎯 **أفضل الممارسات**

### **أمان Keystore:**

```bash
# التوصيات:
1. 🔐 استخدم كلمات مرور قوية (12+ characters)
2. 💾 احفظ نسخ احتياطية متعددة
3. 📝 وثق معلومات keystore بأمان
4. 🔄 دور كلمات المرور دورياً
5. 👥 قيد الوصول للفريق المخول فقط
```

### **إدارة Keystores:**

```bash
# للمشاريع الكبيرة:
1. 🏢 استخدم keystore منفصل لكل environment
2. 📊 وثق جميع keystores وتواريخ انتهائها
3. 🔄 خطط لتجديد keystores قبل انتهائها
4. 🧪 اختبر عملية signing بانتظام
5. 📋 أنشئ SOP لإدارة keystores
```

## 🎉 **الخطوات التالية**

بعد إنشاء Keystore:

1. **اختبر signing** محلياً ومع CI/CD
2. **أعد Android App Bundle** للـ Play Store
3. **أعد signing config** لـ different flavors
4. **فعل Play App Signing** في Google Play Console
5. **وثق عملية keystore management** للفريق

---

## 📞 **المساعدة والدعم**

إذا واجهت مشاكل:

1. تحقق من JDK installation
2. راجع error messages في terminal
3. تحقق من GitHub Actions logs
4. تأكد من file permissions
5. راجع Android documentation

**Android Developer Docs**: https://developer.android.com/studio/publish/app-signing
**keytool Documentation**: https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html
