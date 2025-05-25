# 🚀 SERA Mobile App - Azure DevOps CI/CD Setup

## Quick Start Guide

### ⚡ Express Setup (5 minutes)

```bash
# 1. Run preparation script
./scripts/prepare-for-cicd.sh

# 2. Commit changes
git add .
git commit -m "Setup Azure DevOps CI/CD pipeline"

# 3. Push to Azure DevOps (replace with your org/project)
git remote add azure https://dev.azure.com/YOUR-ORG/SERA-Mobile-App/_git/SERA-Mobile-App
git push azure main
```

### 📋 What's Included

| File                          | Purpose                           |
| ----------------------------- | --------------------------------- |
| `azure-pipelines-simple.yml`  | Quick Android APK build (15 min)  |
| `azure-pipelines.yml`         | Full Android + iOS build (45 min) |
| `ios/ExportOptions.plist`     | iOS build configuration           |
| `docs/azure-devops-setup.md`  | Detailed setup guide              |
| `scripts/prepare-for-cicd.sh` | Project preparation script        |

### 🎯 Build Results

After successful build, you'll get:

- ✅ `sera-app-release.apk` - Production-ready Android app
- ✅ `sera-app-{build-number}.apk` - Versioned build
- ✅ Build logs and metrics
- ✅ Automated testing results

### 🔗 Useful Links

- [Azure DevOps Portal](https://dev.azure.com)
- [Detailed Setup Guide](docs/azure-devops-setup.md)
- [React Native CI/CD Best Practices](https://reactnative.dev/docs/ci-cd)

### 🆘 Need Help?

1. Check `docs/azure-devops-setup.md` for troubleshooting
2. Review Azure DevOps pipeline logs
3. Verify all prerequisites are met

---

**Ready to build? Start with `azure-pipelines-simple.yml` for quick testing!** 🚀
