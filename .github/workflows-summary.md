# 🚀 SERA Mobile App - GitHub Actions Workflows

## 📁 Workflow Structure

```
.github/workflows/
├── 📱 android-debug.yml       # Quick Android debug builds
├── 🚀 android-release.yml     # Production Android APK
├── 🍎 ios-debug.yml          # iOS simulator builds
├── 🍎 ios-release.yml        # Production iOS IPA
└── 🚀 release-and-deploy.yml # Full release + Firebase
```

## 🎯 Workflow Matrix

| Workflow                | Triggers                 | Duration   | Output              | Best For              |
| ----------------------- | ------------------------ | ---------- | ------------------- | --------------------- |
| **📱 Android Debug**    | develop, feature/\*, PRs | ~8-12 min  | Debug APK           | Development, Testing  |
| **🚀 Android Release**  | main, tags               | ~10-15 min | Signed APK          | Production, Store     |
| **🍎 iOS Debug**        | develop, feature/\*, PRs | ~15-20 min | Simulator App       | iOS Development       |
| **🍎 iOS Release**      | main, tags               | ~20-25 min | Signed IPA          | App Store, TestFlight |
| **🚀 Release & Deploy** | tags, manual             | ~30-40 min | Both + Distribution | Official Releases     |

## 🔄 Automatic Triggers

### **Development Flow**:

```
feature/login-screen → Push → 📱 Android Debug + 🍎 iOS Debug
develop branch      → Push → 📱 Android Debug + 🍎 iOS Debug
Pull Request        → Open → 📱 Android Debug + 🍎 iOS Debug
```

### **Release Flow**:

```
main branch → Push → 🚀 Android Release + 🍎 iOS Release
v1.0.0 tag  → Push → 🚀 Release & Deploy (All workflows)
```

## 🎮 Manual Controls

All workflows can be triggered manually from GitHub Actions UI:

1. **Go to Actions tab**
2. **Select desired workflow**
3. **Click "Run workflow"**
4. **Choose branch and options**

### **Release & Deploy Options**:

- **Release Type**: `beta` or `production`
- **Release Notes**: Custom description
- **Tester Groups**: Automatic Firebase distribution

## 📥 Artifact Downloads

### **Development Builds** (7-day retention):

- `sera-android-debug-{build-number}`
- iOS debug builds (simulator only)

### **Release Builds** (30-day retention):

- `sera-android-release-{build-number}`
- `sera-ios-release-{build-number}`

### **Full Releases** (90-day retention):

- `sera-android-release`
- `sera-ios-release`
- GitHub Releases (permanent)
- Firebase App Distribution

## 🔧 Required Setup

### **Basic** (No secrets needed):

- ✅ All debug builds work out of the box
- ✅ Unsigned release builds
- ✅ GitHub artifact downloads

### **Production** (Secrets required):

- 🔑 Android keystore for signed APKs
- 🔑 iOS certificates for signed IPAs
- 🔥 Firebase for automatic distribution

## 🚀 Quick Commands

### **Test a Feature**:

```bash
git checkout -b feature/new-ui
git push origin feature/new-ui
# → Builds debug APK + iOS app
```

### **Release Version**:

```bash
git checkout main
git tag v1.2.0
git push origin v1.2.0
# → Full release with Firebase distribution
```

### **Emergency Hotfix**:

```bash
# Manual trigger from GitHub Actions UI
# → Choose "Release & Deploy" workflow
# → Select main branch, production type
```

## 📊 Build Status

Monitor your builds:

- **GitHub Actions tab**: Real-time build status
- **Email notifications**: Automatic on failures
- **Status badges**: Add to README
- **Firebase Console**: Distribution tracking

---

## 🎉 Benefits of New Structure

- ✅ **Faster feedback**: Debug builds in ~8 minutes
- ✅ **Parallel development**: Feature branches build automatically
- ✅ **Production ready**: Signed releases with one click
- ✅ **Zero configuration**: Works out of the box
- ✅ **Scalable**: Easy to add new platforms or features

**Push your code and let the automation handle the rest! 🚀**
