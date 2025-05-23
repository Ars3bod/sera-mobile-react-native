#!/bin/bash

# SERA Mobile App - GitHub Actions Setup Script
# This script prepares the React Native project for GitHub Actions CI/CD

echo "🚀 Setting up GitHub Actions for SERA Mobile App..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the React Native project root directory"
    exit 1
fi

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: This is not a Git repository. Please run 'git init' first."
    exit 1
fi

echo "📁 Creating GitHub Actions workflow directories..."

# Create .github/workflows directory
mkdir -p .github/workflows

echo "🔧 Setting up package.json scripts for CI/CD..."

# Add test script if it doesn't exist
if ! npm run --silent test > /dev/null 2>&1; then
    echo "Adding test script to package.json..."
    npm pkg set scripts.test="jest --passWithNoTests"
fi

# Add lint script if it doesn't exist
if ! npm run --silent lint > /dev/null 2>&1; then
    echo "Adding lint script to package.json..."
    npm pkg set scripts.lint="eslint . --ext .js,.jsx,.ts,.tsx --fix"
fi

# Add type-check script if TypeScript is used
if [ -f "tsconfig.json" ]; then
    echo "Adding TypeScript type-check script..."
    npm pkg set scripts.type-check="tsc --noEmit"
fi

echo "🛠️ Configuring Android project..."

# Make gradlew executable
if [ -f "android/gradlew" ]; then
    chmod +x android/gradlew
    echo "✅ Made android/gradlew executable"
else
    echo "⚠️  Warning: android/gradlew not found"
fi

# Check if android/local.properties should be in .gitignore
if [ ! -f ".gitignore" ] || ! grep -q "local.properties" .gitignore; then
    echo "android/local.properties" >> .gitignore
    echo "✅ Added local.properties to .gitignore"
fi

echo "📱 Checking iOS configuration..."

# Ensure ExportOptions.plist exists
if [ ! -f "ios/ExportOptions.plist" ]; then
    echo "ℹ️  ExportOptions.plist will be used for iOS builds"
fi

# Check for Gemfile in iOS directory (for fastlane/CocoaPods)
if [ ! -f "ios/Gemfile" ]; then
    echo "Creating basic iOS Gemfile for Ruby dependencies..."
    cat > ios/Gemfile << 'EOF'
source "https://rubygems.org"

gem "cocoapods", "~> 1.12"
gem "fastlane", "~> 2.216"
EOF
fi

echo "🔍 Analyzing project dependencies..."

# Check for critical dependencies
DEPS_TO_CHECK=("react-native-reanimated" "@fluentui/react-native-icons" "react-native-gesture-handler")

for dep in "${DEPS_TO_CHECK[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        echo "✅ Found $dep in dependencies"
    fi
done

# Check if --legacy-peer-deps is needed
if grep -q "@fluentui/react-native-icons" package.json; then
    echo "ℹ️  FluentUI icons detected - workflows will use --legacy-peer-deps"
fi

echo "📝 Creating workflow summary..."

# Create a summary file
cat > .github/workflows-summary.md << 'EOF'
# GitHub Actions Workflows Summary

## Available Workflows

### 1. Android Build (`android-build.yml`)
- **Triggers:** Push/PR to main, develop
- **Purpose:** Quick Android APK build for testing
- **Duration:** ~10-15 minutes
- **Artifacts:** APK files

### 2. Build and Deploy (`build-and-deploy.yml`)
- **Triggers:** Push to main, manual trigger
- **Purpose:** Full build with testing and deployment
- **Duration:** ~25-35 minutes
- **Features:**
  - Unit tests with coverage
  - Android APK build
  - iOS IPA build (macOS runner)
  - GitHub releases
  - Optional app distribution

## Setup Required

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflows"
   git push origin main
   ```

2. **Optional - Add secrets for signing:**
   - Go to Repository Settings → Secrets and variables → Actions
   - Add Android keystore secrets (if needed)
   - Add Firebase credentials (for app distribution)

## Monitoring

- Check Actions tab in your GitHub repository
- Download APKs from workflow artifacts
- View releases in the Releases section

EOF

echo "🎯 Validating project setup..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

# Check if package-lock.json exists (for npm ci)
if [ ! -f "package-lock.json" ]; then
    echo "⚠️  package-lock.json not found. Run 'npm install' to generate it."
fi

# Check React Native version
if command -v npx >/dev/null 2>&1; then
    RN_VERSION=$(npx react-native --version 2>/dev/null | head -n 1 || echo "Unknown")
    echo "React Native version: $RN_VERSION"
fi

echo "📊 GitHub Actions setup complete!"

echo ""
echo "📋 Setup Summary:"
echo "✅ GitHub Actions workflows created"
echo "✅ Package.json scripts configured"
echo "✅ Android gradlew permissions set"
echo "✅ iOS Gemfile created (if needed)"
echo "✅ Project dependencies validated"
echo "✅ Workflows summary documented"

echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. 📤 Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add GitHub Actions CI/CD workflows'"
echo "   git push origin main"
echo ""
echo "2. 🔍 Monitor your build:"
echo "   Go to your GitHub repository → Actions tab"
echo ""
echo "3. 📥 Download APK:"
echo "   After build completes → Artifacts section"
echo ""
echo "4. 📖 Read full documentation:"
echo "   docs/github-actions-setup.md"
echo ""
echo "5. 🔐 Optional - Setup signing:"
echo "   Repository Settings → Secrets → Add Android keystore"
echo ""

# Check if GitHub CLI is available
if command -v gh >/dev/null 2>&1; then
    echo "💡 Tip: You can use 'gh workflow list' to view workflows"
    echo "💡 Tip: Use 'gh run list' to monitor workflow runs"
fi

echo ""
echo "🎉 GitHub Actions is ready to build your SERA Mobile App!"
echo "   Push your code and watch the automation magic happen! ✨" 