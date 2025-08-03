#!/bin/bash

# iOS Version Update Script for SERA Mobile App
# Usage: ./scripts/update-ios-version.sh <version> [build_number]
# Example: ./scripts/update-ios-version.sh 1.2.0 5

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
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
    echo "Usage: $0 <version> [build_number]"
    echo "Example: $0 1.2.0 5"
    exit 1
fi

VERSION="$1"
BUILD_NUMBER="${2:-$(date +%s)}" # Use timestamp if no build number provided

echo "🚀 Updating iOS version to $VERSION (build $BUILD_NUMBER)"

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
    sed -i '' "s/\"buildNumber\": \".*\"/\"buildNumber\": \"$BUILD_NUMBER\"/" app.json
else
    # Linux
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" app.json
    sed -i "s/\"buildNumber\": \".*\"/\"buildNumber\": \"$BUILD_NUMBER\"/" app.json
fi

# Update iOS project.pbxproj
print_status "Updating iOS Xcode project..."
PBXPROJ_FILE="ios/seraApp.xcodeproj/project.pbxproj"

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/MARKETING_VERSION = .*/MARKETING_VERSION = $VERSION;/" "$PBXPROJ_FILE"
    sed -i '' "s/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/" "$PBXPROJ_FILE"
else
    # Linux
    sed -i "s/MARKETING_VERSION = .*/MARKETING_VERSION = $VERSION;/" "$PBXPROJ_FILE"
    sed -i "s/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/" "$PBXPROJ_FILE"
fi

print_status "Version update completed!"
echo ""
echo "📱 Next steps:"
echo "1. Clean and rebuild your iOS project:"
echo "   cd ios && xcodebuild clean"
echo "   cd .. && npx react-native run-ios"
echo ""
echo "2. Or open Xcode and build manually:"
echo "   open ios/seraApp.xcworkspace"
echo ""
echo "3. For App Store submission, archive in Xcode:"
echo "   Product → Archive"
echo ""
print_warning "Don't forget to commit these changes to git!"