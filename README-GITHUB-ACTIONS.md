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

## 📋 What You Get

| Workflow                 | Purpose             | Time       | Triggers                |
| ------------------------ | ------------------- | ---------- | ----------------------- |
| **android-build.yml**    | Quick Android APK   | ~10-15 min | Push/PR to main/develop |
| **build-and-deploy.yml** | Full build + deploy | ~25-35 min | Push to main            |

## 🎯 Key Features

- ✅ **Automatic APK builds** on every push
- ✅ **Smart caching** (npm, Gradle, CocoaPods)
- ✅ **Parallel builds** (Android & iOS)
- ✅ **GitHub releases** with downloadable APKs
- ✅ **Optional APK signing** for production
- ✅ **Firebase App Distribution** ready
- ✅ **Test coverage** reporting

## 📥 Download Your APK

### Method 1: Workflow Artifacts

1. Go to **Actions** tab in your GitHub repo
2. Click on latest workflow run
3. Download from **Artifacts** section

### Method 2: GitHub Releases

1. Go to **Releases** tab
2. Download APK from latest release
3. Auto-generated for main branch builds

## 🔧 Optional: APK Signing

Add these secrets in **Repository Settings → Secrets**:

```
ANDROID_KEYSTORE          # Base64 keystore file
ANDROID_KEYSTORE_PASSWORD # Keystore password
ANDROID_KEY_ALIAS         # Key alias
ANDROID_KEY_PASSWORD      # Key password
```

## 📊 Build Status

Add this badge to your README:

```markdown
![Build](https://github.com/your-username/sera-mobile-app/workflows/Build%20Android%20APK/badge.svg)
```

## 🔍 Troubleshooting

- **Build failed?** Check Actions logs for details
- **APK not found?** Verify build completed successfully
- **iOS issues?** macOS runner might need different Xcode version

## 📖 Full Documentation

See [`docs/github-actions-setup.md`](docs/github-actions-setup.md) for complete setup guide.

---

**Ready? Push your code and GitHub will build your APK automatically! 🎉**
