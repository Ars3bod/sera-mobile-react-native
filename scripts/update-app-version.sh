#!/bin/bash

# Combined iOS & Android Version Update Script for SERA Mobile App
# Usage: ./scripts/update-app-version.sh <version> [ios_build_number]
# Example: ./scripts/update-app-version.sh 1.2.0 5

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_header() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# Check if version argument is provided
if [ -z "$1" ]; then
    print_error "Version number is required!"
    echo "Usage: $0 <version> [ios_build_number]"
    echo "Example: $0 1.2.0 5"
    echo ""
    echo "This script updates both iOS and Android versions:"
    echo "  • iOS: MARKETING_VERSION and CURRENT_PROJECT_VERSION"
    echo "  • Android: versionName and versionCode (auto-incremented)"
    echo "  • package.json and app.json"
    exit 1
fi

VERSION="$1"
IOS_BUILD_NUMBER="${2:-$(date +%s)}" # Use timestamp if no build number provided

print_header "Updating SERA Mobile App to version $VERSION"

# File paths
ANDROID_BUILD_GRADLE="android/app/build.gradle"
IOS_PBXPROJ="ios/seraApp.xcodeproj/project.pbxproj"

# Check if required files exist
if [ ! -f "$ANDROID_BUILD_GRADLE" ]; then
    print_error "Android build.gradle file not found at $ANDROID_BUILD_GRADLE"
    exit 1
fi

if [ ! -f "$IOS_PBXPROJ" ]; then
    print_error "iOS project.pbxproj file not found at $IOS_PBXPROJ"
    exit 1
fi

echo ""
print_info "🔍 Checking current versions..."

# Get current Android versionCode
CURRENT_ANDROID_VERSION_CODE=$(grep -E "versionCode [0-9]+" "$ANDROID_BUILD_GRADLE" | grep -oE "[0-9]+" | head -1)
if [ -z "$CURRENT_ANDROID_VERSION_CODE" ]; then
    print_error "Could not find current Android versionCode"
    exit 1
fi

NEW_ANDROID_VERSION_CODE=$((CURRENT_ANDROID_VERSION_CODE + 1))

echo "   • Android versionCode: $CURRENT_ANDROID_VERSION_CODE → $NEW_ANDROID_VERSION_CODE"
echo "   • iOS build number: $IOS_BUILD_NUMBER"

echo ""
print_header "Updating all version files..."

# Update package.json
print_status "Updating package.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
else
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
fi

# Update app.json
print_status "Updating app.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" app.json
    sed -i '' "s/\"buildNumber\": \".*\"/\"buildNumber\": \"$IOS_BUILD_NUMBER\"/" app.json
else
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" app.json
    sed -i "s/\"buildNumber\": \".*\"/\"buildNumber\": \"$IOS_BUILD_NUMBER\"/" app.json
fi

# Update Android build.gradle
print_status "Updating Android build.gradle..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/versionCode [0-9]*/versionCode $NEW_ANDROID_VERSION_CODE/" "$ANDROID_BUILD_GRADLE"
    sed -i '' "s/versionName \".*\"/versionName \"$VERSION\"/" "$ANDROID_BUILD_GRADLE"
else
    sed -i "s/versionCode [0-9]*/versionCode $NEW_ANDROID_VERSION_CODE/" "$ANDROID_BUILD_GRADLE"
    sed -i "s/versionName \".*\"/versionName \"$VERSION\"/" "$ANDROID_BUILD_GRADLE"
fi

# Update iOS project.pbxproj
print_status "Updating iOS project.pbxproj..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/MARKETING_VERSION = .*/MARKETING_VERSION = $VERSION;/" "$IOS_PBXPROJ"
    sed -i '' "s/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = $IOS_BUILD_NUMBER;/" "$IOS_PBXPROJ"
else
    sed -i "s/MARKETING_VERSION = .*/MARKETING_VERSION = $VERSION;/" "$IOS_PBXPROJ"
    sed -i "s/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = $IOS_BUILD_NUMBER;/" "$IOS_PBXPROJ"
fi

echo ""
print_status "✨ Version update completed successfully!"

echo ""
print_info "📱 Updated versions:"
echo "   📦 package.json: $VERSION"
echo "   ⚙️  app.json: $VERSION"
echo "   🤖 Android versionName: $VERSION"
echo "   🤖 Android versionCode: $NEW_ANDROID_VERSION_CODE"
echo "   🍎 iOS MARKETING_VERSION: $VERSION"
echo "   🍎 iOS CURRENT_PROJECT_VERSION: $IOS_BUILD_NUMBER"

echo ""
print_header "Next Steps:"
echo ""
echo "🤖 Android:"
echo "   cd android && ./gradlew clean"
echo "   npx react-native run-android"
echo "   # For Play Store: ./gradlew bundleRelease"
echo ""
echo "🍎 iOS:"
echo "   cd ios && xcodebuild clean"
echo "   npx react-native run-ios"
echo "   # For App Store: open ios/seraApp.xcworkspace → Product → Archive"
echo ""
print_warning "🔄 Don't forget to commit these changes to git!"

# Show final verification
echo ""
print_info "🔍 Final verification:"
echo "   package.json: $(grep '"version"' package.json | head -1 | grep -oE '"[^"]*"' | tail -1)"
echo "   app.json: $(grep '"version"' app.json | head -1 | grep -oE '"[^"]*"' | tail -1)"
echo "   Android: $(grep 'versionName' "$ANDROID_BUILD_GRADLE" | grep -oE '"[^"]*"' | head -1) (code: $(grep 'versionCode' "$ANDROID_BUILD_GRADLE" | grep -oE '[0-9]+' | head -1))"
echo "   iOS: $(grep 'MARKETING_VERSION' "$IOS_PBXPROJ" | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')"