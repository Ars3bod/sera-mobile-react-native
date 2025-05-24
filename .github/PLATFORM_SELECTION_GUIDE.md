# 🎯 Platform Selection Guide - دليل اختيار المنصات

## نظرة عامة

ميزة **Platform Selection** تسمح لك باختيار المنصة المطلوب بناءها في Debug Release & Deploy workflow، مما يوفر مرونة أكبر وسرعة في التنفيذ.

## 🚀 الخيارات المتاحة

### 1. `both` (افتراضي)

**الوصف**: بناء كلا المنصتين Android و iOS

**متى تستخدمه**:

- ✅ عند الاختبار الشامل لكلا المنصتين
- ✅ للإصدارات التجريبية الكاملة
- ✅ عند التأكد من توافق التحديثات مع جميع المنصات
- ✅ للنشر للمختبرين على جميع الأجهزة

**الوقت المتوقع**: ~15-18 دقيقة

**المخرجات**:

- 🤖 Android Debug APK
- 🍎 iOS Debug Archive + IPA (إن أمكن)
- 🐛 Debug symbols لكلا المنصتين

### 2. `android-only`

**الوصف**: بناء Android فقط

**متى تستخدمه**:

- ✅ عند التطوير بـ Android Studio
- ✅ لاختبار ميزات خاصة بـ Android
- ✅ عند العمل على تحسينات أداء Android
- ✅ للاختبار السريع على أجهزة Android فقط
- ✅ عند توفير وقت المطورين وموارد CI/CD

**الوقت المتوقع**: ~8-10 دقائق

**المخرجات**:

- 🤖 Android Debug APK
- 🐛 Android Debug symbols

### 3. `ios-only`

**الوصف**: بناء iOS فقط

**متى تستخدمه**:

- ✅ عند التطوير بـ Xcode
- ✅ لاختبار ميزات خاصة بـ iOS
- ✅ عند العمل على تحسينات أداء iOS
- ✅ للاختبار على أجهزة iOS/simulators فقط
- ✅ عند توفير وقت المطورين وموارد CI/CD

**الوقت المتوقع**: ~12-14 دقيقة

**المخرجات**:

- 🍎 iOS Debug Archive
- 🍎 iOS Debug IPA (إن أمكن)
- 🐛 iOS dSYM files

## 📋 سيناريوهات الاستخدام

### 🔧 للمطور الفردي

```bash
# مطور Android يعمل على ميزة جديدة:
Platform: android-only
Release Type: internal-debug
Skip Tests: true
Deploy to Firebase: true

# مطور iOS يعمل على تحسين UI:
Platform: ios-only
Release Type: beta-debug
Skip Tests: false
Deploy to Firebase: true
```

### 👥 للفريق الصغير

```bash
# اختبار سريع لـ hotfix:
Platform: both
Release Type: testing-debug
Skip Tests: true
Deploy to Firebase: true

# اختبار ميزة خاصة بمنصة واحدة:
Platform: android-only # أو ios-only
Release Type: beta-debug
Skip Tests: false
Deploy to Firebase: true
```

### 🏢 للمؤسسة

```bash
# مراجعة شاملة قبل الإصدار:
Platform: both
Release Type: beta-debug
Skip Tests: false
Deploy to Firebase: true

# اختبار أداء منصة محددة:
Platform: [المنصة المطلوبة]
Release Type: internal-debug
Skip Tests: true
Deploy to Firebase: false
```

## ⚡ مقارنة الأداء

| Platform       | الوقت المتوقع | استهلاك موارد CI/CD | التكلفة | التعقيد |
| -------------- | ------------- | ------------------- | ------- | ------- |
| `both`         | 15-18 دقيقة   | مرتفع               | مرتفعة  | متوسط   |
| `android-only` | 8-10 دقائق    | منخفض               | منخفضة  | منخفض   |
| `ios-only`     | 12-14 دقيقة   | متوسط               | متوسطة  | متوسط   |

## 🔄 كيفية الاستخدام

### عبر GitHub Actions UI:

1. انتقل إلى **Actions** في GitHub repository
2. اختر **🚀 Release & Deploy (Debug Mode)**
3. اضغط **Run workflow**
4. اختر الخيارات:
   - **Platforms**: `both` | `android-only` | `ios-only`
   - **Release Type**: نوع الإصدار
   - **Release Notes**: وصف الإصدار
   - **Skip Tests**: تخطي الاختبارات
   - **Deploy to Firebase**: النشر على Firebase

### عبر GitHub CLI:

```bash
# بناء Android فقط:
gh workflow run "🚀 Release & Deploy (Debug Mode)" \
  -f platforms=android-only \
  -f release_type=beta-debug \
  -f skip_tests=true \
  -f deploy_to_firebase=true

# بناء iOS فقط:
gh workflow run "🚀 Release & Deploy (Debug Mode)" \
  -f platforms=ios-only \
  -f release_type=internal-debug \
  -f release_notes="اختبار iOS على الأجهزة الجديدة"

# بناء كلا المنصتين:
gh workflow run "🚀 Release & Deploy (Debug Mode)" \
  -f platforms=both \
  -f release_type=testing-debug \
  -f skip_tests=false
```

## 📊 التأثير على Firebase Distribution

### عند اختيار `android-only`:

- 🔥 يتم نشر APK على Firebase Android App
- 📱 المختبرين على Android فقط يحصلون على التحديث
- ⏭️ iOS builds يتم تخطيها

### عند اختيار `ios-only`:

- 🔥 يتم نشر IPA على Firebase iOS App (إن توفر)
- 📱 المختبرين على iOS فقط يحصلون على التحديث
- ⏭️ Android builds يتم تخطيها

### عند اختيار `both`:

- 🔥 يتم نشر كلا النسختين
- 📱 جميع المختبرين يحصلون على التحديثات
- ✅ تجربة شاملة

## 🎯 التوصيات

### للتطوير اليومي:

- استخدم المنصة التي تعمل عليها حالياً
- فعل `skip_tests=true` للسرعة
- فعل Firebase deployment للاختبار المباشر

### للاختبار الأسبوعي:

- استخدم `both` للتأكد من التوافق
- فعل `skip_tests=false` للاطمئنان
- استخدم `beta-debug` release type

### لحل المشاكل:

- ابدأ بالمنصة التي تظهر المشكلة
- استخدم `testing-debug` مع logs مفصلة
- فعل Firebase لتوزيع النسخة على الفريق

## ⚠️ ملاحظات مهمة

### توفير الموارد:

- **GitHub Actions Minutes**: استخدام منصة واحدة يوفر ~50% من الوقت
- **Storage**: artifacts أقل = استهلاك تخزين أقل
- **التكلفة**: للحسابات المدفوعة، توفير ملحوظ في التكلفة

### الاعتبارات التقنية:

- 🔄 **Auto-triggered builds** (push events) دائماً تبني كلا المنصتين
- 📱 **Firebase deployment** يحدث فقط للمنصات المُبناة
- 🏷️ **Release tags** تشمل اسم المنصة المختارة
- 📦 **Artifacts** منظمة حسب المنصة

### أفضل الممارسات:

- ✅ اختبر على المنصة التي تطور عليها أولاً
- ✅ استخدم `both` قبل merge للـ main branch
- ✅ استخدم منصة واحدة للتطوير السريع
- ✅ استخدم `both` للإصدارات التجريبية الرسمية

---

**💡 نصيحة**: ابدأ دائماً بالمنصة التي تطور عليها لتوفير الوقت، ثم انتقل لـ `both` عند الحاجة للاختبار الشامل.

**📞 الدعم**: للمساعدة في اختيار المنصة المناسبة، راجع [Workflows Comparison](./WORKFLOWS_COMPARISON.md)
