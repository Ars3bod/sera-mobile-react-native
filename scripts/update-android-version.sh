#!/bin/bash

# Android Version Update Script for SERA Mobile App
# Usage: ./scripts/update-android-version.sh <version>
# Example: ./scripts/update-android-version.sh 1.2.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if version argument is provided
if [ -z "$1" ]; then
    print_error "Version number is required!"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.2.0"
    exit 1
fi

VERSION="$1"
BUILD_GRADLE_FILE="android/app/build.gradle"

# Check if build.gradle exists
if [ ! -f "$BUILD_GRADLE_FILE" ]; then
    print_error "Android build.gradle file not found at $BUILD_GRADLE_FILE"
    exit 1
fi

echo "🤖 Updating Android version to $VERSION"

# Get current versionCode and increment it
CURRENT_VERSION_CODE=$(grep -E "versionCode [0-9]+" "$BUILD_GRADLE_FILE" | grep -oE "[0-9]+" | head -1)
if [ -z "$CURRENT_VERSION_CODE" ]; then
    print_error "Could not find current versionCode in $BUILD_GRADLE_FILE"
    exit 1
fi

NEW_VERSION_CODE=$((CURRENT_VERSION_CODE + 1))
print_info "Current versionCode: $CURRENT_VERSION_CODE → New versionCode: $NEW_VERSION_CODE"

# Update package.json
print_status "Updating package.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
else
    # Linux
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
fi

# Update app.json
print_status "Updating app.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" app.json
else
    # Linux
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" app.json
fi

# Update Android build.gradle
print_status "Updating Android build.gradle..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/versionCode [0-9]*/versionCode $NEW_VERSION_CODE/" "$BUILD_GRADLE_FILE"
    sed -i '' "s/versionName \".*\"/versionName \"$VERSION\"/" "$BUILD_GRADLE_FILE"
else
    # Linux
    sed -i "s/versionCode [0-9]*/versionCode $NEW_VERSION_CODE/" "$BUILD_GRADLE_FILE"
    sed -i "s/versionName \".*\"/versionName \"$VERSION\"/" "$BUILD_GRADLE_FILE"
fi

print_status "Android version update completed!"
echo ""
print_info "📱 Updated versions:"
echo "   • versionName: $VERSION"
echo "   • versionCode: $NEW_VERSION_CODE (incremented from $CURRENT_VERSION_CODE)"
echo ""
echo "📋 Next steps:"
echo "1. Clean and rebuild your Android project:"
echo "   cd android && ./gradlew clean"
echo "   cd .. && npx react-native run-android"
echo ""
echo "2. Or build release APK:"
echo "   cd android && ./gradlew assembleRelease"
echo ""
echo "3. For Google Play Store submission:"
echo "   cd android && ./gradlew bundleRelease"
echo "   # APK: android/app/build/outputs/apk/release/"
echo "   # AAB: android/app/build/outputs/bundle/release/"
echo ""
print_warning "Don't forget to commit these changes to git!"

# Show current versions for verification
echo ""
print_info "🔍 Current version status:"
echo "   package.json: $(grep '"version"' package.json | head -1 | grep -oE '"[^"]*"' | tail -1)"
echo "   app.json: $(grep '"version"' app.json | head -1 | grep -oE '"[^"]*"' | tail -1)"
echo "   Android versionName: $(grep 'versionName' "$BUILD_GRADLE_FILE" | grep -oE '"[^"]*"' | head -1)"
echo "   Android versionCode: $(grep 'versionCode' "$BUILD_GRADLE_FILE" | grep -oE '[0-9]+' | head -1)"