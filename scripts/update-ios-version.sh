#!/bin/bash

# SERA Mobile iOS Version Update Script
# Updates version numbers in iOS Info.plist and app.json

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get input parameters
VERSION=$1
BUILD_NUMBER=$2

# Show usage if parameters are missing
if [ -z "$VERSION" ] || [ -z "$BUILD_NUMBER" ]; then
    echo "🍎 SERA Mobile iOS Version Update Script"
    echo ""
    echo "Usage: $0 <version> <build_number>"
    echo ""
    echo "Examples:"
    echo "  $0 1.0.0 1        # Initial release"
    echo "  $0 1.0.1 2        # Bug fix update"
    echo "  $0 1.1.0 5        # Feature update"
    echo "  $0 2.0.0 10       # Major version"
    echo ""
    echo "Version format should be: MAJOR.MINOR.PATCH (e.g., 1.0.0)"
    echo "Build number should be incremental integer (e.g., 1, 2, 3...)"
    exit 1
fi

# Validate version format (basic check)
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Invalid version format: $VERSION"
    print_error "Expected format: MAJOR.MINOR.PATCH (e.g., 1.0.0)"
    exit 1
fi

# Validate build number (should be integer)
if [[ ! $BUILD_NUMBER =~ ^[0-9]+$ ]]; then
    print_error "Invalid build number: $BUILD_NUMBER"
    print_error "Build number should be a positive integer (e.g., 1, 2, 3...)"
    exit 1
fi

print_status "Updating SERA Mobile iOS version to $VERSION (build $BUILD_NUMBER)"

# Check if Info.plist exists
INFO_PLIST="ios/seraApp/Info.plist"
if [ ! -f "$INFO_PLIST" ]; then
    print_error "Info.plist not found: $INFO_PLIST"
    print_error "Make sure you're running this script from the project root"
    exit 1
fi

# Backup Info.plist
BACKUP_FILE="${INFO_PLIST}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$INFO_PLIST" "$BACKUP_FILE"
print_status "Created backup: $BACKUP_FILE"

# Update Info.plist using PlistBuddy
print_status "Updating Info.plist..."

# Update CFBundleShortVersionString (version)
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION" "$INFO_PLIST"
if [ $? -eq 0 ]; then
    print_success "Updated CFBundleShortVersionString to $VERSION"
else
    print_error "Failed to update CFBundleShortVersionString"
    exit 1
fi

# Update CFBundleVersion (build number)
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "$INFO_PLIST"
if [ $? -eq 0 ]; then
    print_success "Updated CFBundleVersion to $BUILD_NUMBER"
else
    print_error "Failed to update CFBundleVersion"
    exit 1
fi

# Update app.json if it exists (Expo configuration)
APP_JSON="app.json"
if [ -f "$APP_JSON" ]; then
    print_status "Updating app.json..."
    
    # Create backup
    APP_JSON_BACKUP="${APP_JSON}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$APP_JSON" "$APP_JSON_BACKUP"
    print_status "Created backup: $APP_JSON_BACKUP"
    
    # Update version in app.json
    if command -v jq &> /dev/null; then
        # Use jq if available (more reliable)
        jq --arg version "$VERSION" '.version = $version' "$APP_JSON" > "${APP_JSON}.tmp" && mv "${APP_JSON}.tmp" "$APP_JSON"
        print_success "Updated app.json version to $VERSION (using jq)"
    else
        # Use sed as fallback
        sed -i.tmp "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" "$APP_JSON"
        rm -f "${APP_JSON}.tmp"
        print_success "Updated app.json version to $VERSION (using sed)"
    fi
else
    print_warning "app.json not found, skipping Expo configuration update"
fi

# Update package.json version if it exists
PACKAGE_JSON="package.json"
if [ -f "$PACKAGE_JSON" ]; then
    print_status "Updating package.json..."
    
    # Create backup
    PACKAGE_JSON_BACKUP="${PACKAGE_JSON}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$PACKAGE_JSON" "$PACKAGE_JSON_BACKUP"
    print_status "Created backup: $PACKAGE_JSON_BACKUP"
    
    if command -v jq &> /dev/null; then
        # Use jq if available
        jq --arg version "$VERSION" '.version = $version' "$PACKAGE_JSON" > "${PACKAGE_JSON}.tmp" && mv "${PACKAGE_JSON}.tmp" "$PACKAGE_JSON"
        print_success "Updated package.json version to $VERSION (using jq)"
    else
        # Use sed as fallback
        sed -i.tmp "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" "$PACKAGE_JSON"
        rm -f "${PACKAGE_JSON}.tmp"
        print_success "Updated package.json version to $VERSION (using sed)"
    fi
else
    print_warning "package.json not found, skipping npm package version update"
fi

# Verify the changes
print_status "Verifying changes..."

# Check Info.plist
CURRENT_VERSION=$(/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" "$INFO_PLIST")
CURRENT_BUILD=$(/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" "$INFO_PLIST")

if [ "$CURRENT_VERSION" = "$VERSION" ] && [ "$CURRENT_BUILD" = "$BUILD_NUMBER" ]; then
    print_success "Info.plist updated successfully"
    echo "   - Version: $CURRENT_VERSION"
    echo "   - Build: $CURRENT_BUILD"
else
    print_error "Info.plist verification failed"
    echo "   - Expected Version: $VERSION, Got: $CURRENT_VERSION"
    echo "   - Expected Build: $BUILD_NUMBER, Got: $CURRENT_BUILD"
    exit 1
fi

# Show what was updated
print_success "✅ Version update completed successfully!"
echo ""
print_status "📋 Summary of changes:"
echo "   - iOS Version: $VERSION"
echo "   - iOS Build Number: $BUILD_NUMBER"
echo "   - Updated files:"
echo "     * $INFO_PLIST"
if [ -f "$APP_JSON" ]; then
    echo "     * $APP_JSON"
fi
if [ -f "$PACKAGE_JSON" ]; then
    echo "     * $PACKAGE_JSON"
fi
echo ""

print_status "📂 Backup files created:"
echo "   - $BACKUP_FILE"
if [ -f "$APP_JSON" ]; then
    echo "   - $APP_JSON_BACKUP"
fi
if [ -f "$PACKAGE_JSON" ]; then
    echo "   - $PACKAGE_JSON_BACKUP"
fi
echo ""

print_status "🔄 Next steps:"
echo "   1. Test the app with new version numbers"
echo "   2. Commit the version changes to git"
echo "   3. Create a new git tag: git tag v$VERSION"
echo "   4. Build release version: ./scripts/build-ios-release.sh"
echo "   5. Upload to App Store Connect"
echo ""

# Optional: Create git tag
read -p "🏷️  Create git tag v$VERSION? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v git &> /dev/null && [ -d ".git" ]; then
        git add "$INFO_PLIST"
        [ -f "$APP_JSON" ] && git add "$APP_JSON"
        [ -f "$PACKAGE_JSON" ] && git add "$PACKAGE_JSON"
        git commit -m "chore: bump version to $VERSION (build $BUILD_NUMBER)"
        git tag "v$VERSION"
        print_success "Created git tag v$VERSION"
    else
        print_warning "Git not available or not in a git repository"
    fi
fi

print_success "🎉 Version update complete!" 