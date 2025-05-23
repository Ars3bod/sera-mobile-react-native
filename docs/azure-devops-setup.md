# إعداد Azure DevOps CI/CD للتطبيق SERA

## 📋 المتطلبات الأساسية

### 1. إنشاء مشروع Azure DevOps

1. ادخل إلى [Azure DevOps](https://dev.azure.com)
2. أنشئ Organization جديد أو استخدم موجود
3. أنشئ مشروع جديد باسم "SERA-Mobile-App"

### 2. ربط Repository

```bash
# إضافة Azure DevOps كـ Remote Repository
git remote add azure https://dev.azure.com/your-org/SERA-Mobile-App/_git/SERA-Mobile-App

# Push الكود إلى Azure DevOps
git push azure main
```

## 🚀 إعداد Pipeline

### الخطوة 1: إنشاء Pipeline

1. اذهب إلى `Pipelines` في Azure DevOps
2. اضغط `New Pipeline`
3. اختر `Azure Repos Git`
4. اختر repository الخاص بك
5. اختر `Existing Azure Pipelines YAML file`
6. اختر `/azure-pipelines-simple.yml` للبناء السريع

### الخطوة 2: متغيرات Pipeline

أضف المتغيرات التالية في Pipeline Settings:

```yaml
# متغيرات مطلوبة
NODE_VERSION: '18.x'
JAVA_VERSION: '11'
BUILD_TYPE: 'Release'

# متغيرات اختيارية للتوقيع
ANDROID_KEYSTORE_PASSWORD: 'your-keystore-password'
ANDROID_KEY_ALIAS: 'your-key-alias'
ANDROID_KEY_PASSWORD: 'your-key-password'
```

### الخطوة 3: Service Connections (للنشر)

إذا كنت تريد النشر التلقائي:

1. **App Center Connection:**

   - اذهب إلى `Project Settings` > `Service Connections`
   - أنشئ `Visual Studio App Center` connection
   - أدخل App Center API Token

2. **Google Play Connection:**
   - أنشئ `Google Play` service connection
   - ارفع ملف JSON للحساب الخدمي

## 📱 ملفات Pipeline المتاحة

### 1. Pipeline مبسط (للاختبار السريع)

الملف: `azure-pipelines-simple.yml`

- بناء Android APK فقط
- مدة البناء: ~10-15 دقيقة
- مناسب للتطوير والاختبار

### 2. Pipeline كامل (للإنتاج)

الملف: `azure-pipelines.yml`

- بناء Android APK + iOS IPA
- اختبارات وحدة
- مرحلة النشر
- مدة البناء: ~30-45 دقيقة

## 🔧 إعدادات إضافية

### إعداد Android Signing (اختياري)

```bash
# إنشاء Keystore جديد
keytool -genkey -v -keystore sera-release-key.keystore -alias sera-key -keyalg RSA -keysize 2048 -validity 10000

# رفع Keystore إلى Azure DevOps Secure Files
# Project Settings > Pipelines > Library > Secure Files
```

### إعداد iOS Signing (اختياري)

```bash
# رفع Provisioning Profile و Certificate إلى Secure Files
# أو استخدام Apple Developer Connection
```

## 🏃‍♂️ تشغيل أول Build

### الطريقة 1: تشغيل يدوي

1. اذهب إلى `Pipelines`
2. اختر Pipeline الخاص بك
3. اضغط `Run pipeline`
4. اختر branch (مثل `main`)
5. اضغط `Run`

### الطريقة 2: تشغيل تلقائي

```bash
# أي commit إلى main أو develop سيشغل Pipeline تلقائياً
git add .
git commit -m "Update app features"
git push azure main
```

## 📥 تحميل APK المبني

بعد اكتمال البناء:

1. اذهب إلى Pipeline run
2. اختر `Artifacts`
3. حمل `android-apk`
4. ستجد الملفات:
   - `sera-app-release.apk`
   - `sera-app-{build-number}.apk`

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها:

#### 1. خطأ "ANDROID_HOME not set"

```yaml
# أضف هذه الخطوة قبل Gradle build
- script: |
    export ANDROID_HOME=$ANDROID_SDK_ROOT
    export ANDROID_SDK_ROOT=$ANDROID_HOME
    echo "ANDROID_HOME: $ANDROID_HOME"
  displayName: 'Set Android Environment'
```

#### 2. خطأ "Node modules not found"

```yaml
# تأكد من cache واستخدام npm ci
- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    path: 'node_modules'

- script: npm ci --legacy-peer-deps
```

#### 3. خطأ "Gradle daemon failed"

```yaml
# أضف هذه المعاملات لـ Gradle
- script: |
    cd android
    ./gradlew assembleRelease --no-daemon --stacktrace --info
```

#### 4. مشاكل FluentUI Icons

```yaml
# تأكد من تثبيت المكتبات مع legacy-peer-deps
- script: npm ci --legacy-peer-deps
```

## 📊 مراقبة البناء

### Logs مفيدة:

- **Node.js Info:** تحقق من إصدار Node و npm
- **Gradle Info:** معلومات عن Android build
- **APK Size:** حجم الملف النهائي
- **Build Time:** مدة البناء

### Metrics:

- Build Success Rate
- Average Build Time
- APK Size Trends
- Test Coverage

## 🔄 أتمتة النشر

### إلى App Center:

```yaml
- task: AppCenterDistribute@3
  inputs:
    serverEndpoint: 'App Center'
    appSlug: 'SERA/sera-mobile-android'
    appFile: '$(Build.ArtifactStagingDirectory)/sera-app-release.apk'
    releaseNotesInput: 'Automated build from Azure DevOps'
    destinationType: 'groups'
    distributionGroupId: 'testers'
```

### إلى Google Play Console:

```yaml
- task: GooglePlayRelease@4
  inputs:
    serviceConnection: 'Google Play'
    applicationId: 'sa.gov.sera.mobile'
    action: 'Upload'
    bundleFile: '$(Build.ArtifactStagingDirectory)/sera-app-release.apk'
    track: 'internal'
```

## 📝 نصائح للأداء

1. **استخدام Cache:** Node modules, Gradle dependencies
2. **Parallel Jobs:** بناء Android و iOS بشكل متوازي
3. **Incremental Builds:** تجنب clean build إلا عند الحاجة
4. **Resource Optimization:** استخدام أصغر VM image مناسب

## 🔐 الأمان

1. **Secure Variables:** استخدم Azure Key Vault للمفاتيح الحساسة
2. **Branch Protection:** حماية main branch
3. **Access Control:** تحديد صلاحيات المستخدمين
4. **Audit Logs:** مراجعة دورية للأنشطة

---

## 🎯 الخلاصة

الآن لديك إعداد كامل لـ CI/CD على Azure DevOps يتيح لك:

- ✅ بناء APK تلقائياً عند كل commit
- ✅ اختبار التطبيق قبل النشر
- ✅ تحميل التطبيق من Azure DevOps
- ✅ نشر تلقائي للمتاجر (اختياري)
- ✅ مراقبة وتتبع البناءات

🚀 **ابدأ الآن:** ارفع الكود إلى Azure DevOps وشغل أول pipeline!
