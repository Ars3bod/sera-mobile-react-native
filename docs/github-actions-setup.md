# GitHub Actions CI/CD Setup for SERA Mobile App

## 🚀 Quick Start

GitHub Actions workflows are automatically triggered when you push to your GitHub repository. Here's how to set it up:

### 1. **Push to GitHub Repository**

```bash
# Add GitHub as remote (if not already done)
git remote add origin https://github.com/your-username/sera-mobile-app.git

# Push your code
git add .
git commit -m "Add GitHub Actions CI/CD workflows"
git push origin main
```

### 2. **Available Workflows**

| Workflow File          | Purpose                 | Trigger                 | Duration   |
| ---------------------- | ----------------------- | ----------------------- | ---------- |
| `android-build.yml`    | Quick Android APK build | Push/PR to main/develop | ~10-15 min |
| `build-and-deploy.yml` | Full build + deploy     | Push to main            | ~25-35 min |

## 📱 Workflow Features

### **Simple Android Build** (`android-build.yml`)

- ✅ Builds Android APK
- ✅ Uploads APK as artifact
- ✅ Runs on every push/PR
- ✅ Fast feedback for development

### **Full Build & Deploy** (`build-and-deploy.yml`)

- ✅ Runs unit tests with coverage
- ✅ Builds Android APK + iOS IPA
- ✅ Optional APK signing
- ✅ Creates GitHub releases
- ✅ Deploys to Firebase App Distribution (optional)
- ✅ Artifacts retention (30 days)

## 🔧 Configuration

### **Required Secrets (Optional)**

Go to your GitHub repository → Settings → Secrets and variables → Actions

#### For Android Signing:

```
ANDROID_KEYSTORE          # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD # Keystore password
ANDROID_KEY_ALIAS         # Key alias
ANDROID_KEY_PASSWORD      # Key password
```

#### For Firebase App Distribution:

```
FIREBASE_APP_ID              # Firebase App ID
CREDENTIAL_FILE_CONTENT      # Firebase service account JSON
```

### **Setting up Android Signing**

1. **Create a keystore:**

```bash
keytool -genkey -v -keystore sera-release-key.keystore \
  -alias sera-key -keyalg RSA -keysize 2048 -validity 10000
```

2. **Encode keystore to base64:**

```bash
base64 -i sera-release-key.keystore | pbcopy  # macOS
base64 -i sera-release-key.keystore           # Linux
```

3. **Add to GitHub Secrets:**
   - `ANDROID_KEYSTORE`: Paste the base64 output
   - `ANDROID_KEYSTORE_PASSWORD`: Your keystore password
   - `ANDROID_KEY_ALIAS`: Your key alias (e.g., "sera-key")
   - `ANDROID_KEY_PASSWORD`: Your key password

## 📥 Downloading Built APKs

### **Method 1: GitHub Actions Artifacts**

1. Go to your repository → Actions
2. Click on a completed workflow run
3. Scroll down to "Artifacts" section
4. Download `sera-android-apk` or `sera-ios-ipa`

### **Method 2: GitHub Releases**

1. Go to your repository → Releases
2. Download APK/IPA from the latest release
3. Releases are created automatically for main branch builds

## 🔄 Workflow Triggers

### **Automatic Triggers:**

- **Push to main:** Runs full build + deploy
- **Push to develop:** Runs Android build only
- **Pull requests:** Runs Android build for testing

### **Manual Triggers:**

- Go to Actions → Select workflow → "Run workflow"
- Useful for testing or emergency builds

## 🛠️ Customization

### **Modify Node.js Version:**

```yaml
env:
  NODE_VERSION: '18' # Change to '16' or '20' if needed
```

### **Change Java Version:**

```yaml
env:
  JAVA_VERSION: '17' # Change to '11' if needed
```

### **Add Environment Variables:**

```yaml
- name: Build with custom config
  run: cd android && ./gradlew assembleRelease
  env:
    CUSTOM_API_URL: ${{ secrets.API_URL }}
```

### **Skip iOS Build:**

Remove or comment out the `build-ios` job in `build-and-deploy.yml`

## 🔍 Troubleshooting

### **Common Issues:**

#### 1. **Gradle Build Fails**

- Check Java version compatibility
- Verify ANDROID_HOME is set correctly
- Ensure gradlew has execute permissions

#### 2. **Node Dependencies Fail**

- Verify Node.js version
- Check if `--legacy-peer-deps` is needed
- Clear npm cache if needed

#### 3. **iOS Build Fails**

- Verify Xcode version compatibility
- Check CocoaPods setup
- Ensure iOS deployment target is correct

#### 4. **Artifacts Not Found**

- Check if build step completed successfully
- Verify artifact paths in upload steps
- Check artifact retention settings

### **Debug Tips:**

1. **Enable debug logging:**

```yaml
- name: Debug build
  run: cd android && ./gradlew assembleRelease --debug --stacktrace
```

2. **List files for debugging:**

```yaml
- name: List build outputs
  run: find android -name "*.apk" -type f
```

3. **Check environment:**

```yaml
- name: Show environment
  run: |
    echo "Node: $(node --version)"
    echo "NPM: $(npm --version)"
    echo "Java: $JAVA_HOME"
    echo "Android: $ANDROID_HOME"
```

## 🚀 Advanced Features

### **Matrix Builds** (Multiple configurations)

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    java-version: [11, 17]
```

### **Conditional Steps**

```yaml
- name: Deploy only on main
  if: github.ref == 'refs/heads/main'
  run: echo "Deploying to production"
```

### **Parallel Jobs**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
  build-android:
    runs-on: ubuntu-latest
    needs: test # Wait for tests to pass
  build-ios:
    runs-on: macos-latest
    needs: test # Run in parallel with Android
```

## 📊 Monitoring

### **Build Status Badge**

Add to your README.md:

```markdown
![Build Status](https://github.com/your-username/sera-mobile-app/workflows/Build%20Android%20APK/badge.svg)
```

### **Email Notifications**

GitHub automatically sends email notifications for:

- Failed builds
- First successful build after failures
- Workflow run summaries

## 🎯 Best Practices

1. **Use caching** for dependencies (npm, Gradle, CocoaPods)
2. **Fail fast** - run tests before builds
3. **Use secrets** for sensitive data
4. **Keep workflows focused** - separate concerns
5. **Version your releases** automatically
6. **Set artifact retention** to manage storage
7. **Use conditional deploys** (only on main branch)

---

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Native CI/CD Best Practices](https://reactnative.dev/docs/ci-cd)
- [Android Signing Documentation](https://developer.android.com/studio/publish/app-signing)
- [iOS Code Signing](https://developer.apple.com/documentation/xcode/app-distribution/app-store-distribution-workflow)

**Ready to automate your builds? Push your code and watch the magic happen! 🎉**
