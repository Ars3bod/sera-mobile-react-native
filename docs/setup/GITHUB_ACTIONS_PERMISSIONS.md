# 🔐 GitHub Actions Permissions - دليل الصلاحيات

## المشاكل الشائعة وحلولها

### مشكلة: Resource not accessible by integration

**الخطأ الكامل:**

```
Error: Resource not accessible by integration
https://docs.github.com/rest/releases/releases#create-a-release
```

**السبب:**
نقص في صلاحيات `GITHUB_TOKEN` المطلوبة لإنشاء GitHub releases أو الوصول لموارد Repository.

## ✅ الحل المُطبق

### إضافة Permissions Section:

```yaml
# في بداية كل workflow file
permissions:
  contents: write # لإنشاء releases وإرفاق files
  actions: read # لقراءة workflow runs
  packages: read # لقراءة packages إذا لزم الأمر
  pull-requests: read # لقراءة PR info إذا لزم الأمر
```

## 🎯 شرح الصلاحيات

### `contents: write`

- **المطلوبة لـ:** إنشاء GitHub releases, رفع artifacts, تعديل repository files
- **بدونها:** خطأ 403/404 عند محاولة إنشاء release أو رفع files

### `actions: read`

- **المطلوبة لـ:** قراءة معلومات workflow runs, artifacts من runs أخرى
- **بدونها:** مشاكل في الوصول لـ workflow metadata

### `packages: read`

- **المطلوبة لـ:** الوصول للـ packages إذا كان التطبيق يستخدمها
- **اختيارية:** يمكن حذفها إذا لم تكن مطلوبة

### `pull-requests: read`

- **المطلوبة لـ:** قراءة معلومات Pull Requests إذا كان workflow يتفاعل معها
- **اختيارية:** للـ workflows التي تعمل مع PRs

## 🔧 إعدادات Repository إضافية

### تفعيل GitHub Actions في Repository:

1. **اذهب إلى Repository Settings**
2. **Actions** → **General**
3. **تأكد من تفعيل:**
   - ✅ **Allow all actions and reusable workflows**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

### إعدادات Workflow permissions:

#### في **Settings** → **Actions** → **General**:

```
Workflow permissions:
🔘 Read and write permissions (موصى به)
🔘 Read repository contents and packages permissions

☑️ Allow GitHub Actions to create and approve pull requests
```

## 🚨 مشاكل إضافية وحلولها

### مشكلة: API rate limit exceeded

```yaml
# إضافة تأخير بين العمليات
- name: Wait for rate limit
  run: sleep 10
```

### مشكلة: Insufficient permissions لـ Firebase

```yaml
# تأكد من صحة Service Account
env:
  FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
```

### مشكلة: File size too large للـ release assets

```yaml
# ضغط الملفات قبل الرفع
- name: Compress artifacts
  run: |
    tar -czf android-debug.tar.gz artifacts/android-debug/
    tar -czf ios-debug.tar.gz artifacts/ios-debug/
```

## 📋 Permissions لكل نوع workflow

### لـ Debug Release & Deploy:

```yaml
permissions:
  contents: write # إنشاء debug releases
  actions: read # قراءة workflow info
```

### لـ Production Release & Deploy:

```yaml
permissions:
  contents: write # إنشاء production releases
  actions: read # قراءة workflow metadata
  packages: read # إذا كان يستخدم packages
  pull-requests: read # للـ PRs automation
```

### لـ Build-only workflows:

```yaml
permissions:
  contents: read # قراءة source code فقط
  actions: read # قراءة workflow info
```

## 🔍 استكشاف أخطاء الصلاحيات

### خطوات التشخيص:

1. **تحقق من workflow logs**:

   ```
   Actions → [Workflow name] → [Failed run] → [Job] → [Step]
   ```

2. **ابحث عن أخطاء مثل**:

   - `Resource not accessible by integration`
   - `403 Forbidden`
   - `404 Not Found`
   - `API rate limit exceeded`

3. **تحقق من Repository settings**:
   - Actions permissions
   - Workflow permissions
   - Branch protection rules

### أدوات التشخيص:

#### إضافة debug step:

```yaml
- name: 🔍 Debug GitHub Token Permissions
  run: |
    echo "Token permissions:"
    echo "Repository: ${{ github.repository }}"
    echo "Actor: ${{ github.actor }}"
    echo "Event: ${{ github.event_name }}"
```

#### اختبار صلاحيات API:

```yaml
- name: 🧪 Test API Access
  run: |
    # اختبار الوصول للـ releases API
    curl -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
         -H "Accept: application/vnd.github.v3+json" \
         https://api.github.com/repos/${{ github.repository }}/releases
```

## 💡 أفضل الممارسات

### الحد الأدنى من الصلاحيات:

- ✅ أعط الصلاحيات المطلوبة فقط
- ✅ استخدم `read` بدلاً من `write` إذا أمكن
- ✅ احذف الصلاحيات غير المستخدمة

### توثيق الصلاحيات:

```yaml
permissions:
  contents: write # Required for creating releases
  actions: read # Required for accessing workflow metadata
  # packages: read      # Uncomment if using packages
```

### اختبار الصلاحيات:

- ✅ اختبر الـ workflow بعد تغيير الصلاحيات
- ✅ تحقق من عمل جميع الخطوات
- ✅ راقب الـ logs للأخطاء

## 🎉 تأكيد الحل

بعد إضافة الصلاحيات الصحيحة، ستحصل على:

```
✅ Successfully created release: debug-build-123-android-only
✅ Uploaded artifacts: sera-android-debug-123.apk
✅ Release available at: https://github.com/user/repo/releases/tag/debug-build-123-android-only
```

## 🔗 روابط مفيدة

- [GitHub Actions Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
- [Repository Settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)
- [GitHub API Rate Limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

---

**📞 الدعم الفني:** إذا استمر الخطأ بعد تطبيق هذه الحلول، تحقق من:

1. Repository visibility (public/private)
2. Organization policies إذا كان Repository في organization
3. GitHub Enterprise settings إذا كنت تستخدم GitHub Enterprise
