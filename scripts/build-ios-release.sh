#!/bin/bash

# SERA Mobile iOS Release Build Script
# This script builds a release version of the SERA Mobile app for App Store distribution

set -e

echo "🚀 Starting iOS Release Build for SERA Mobile"

# Configuration
SCHEME="seraApp"
WORKSPACE="ios/seraApp.xcworkspace"
ARCHIVE_PATH="build/seraApp-Release.xcarchive"
EXPORT_PATH="build/release"
EXPORT_OPTIONS="ios/ExportOptions-Release.plist"

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

# Check prerequisites
print_status "Checking prerequisites..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script must be run on macOS"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    print_error "Xcode is not installed or xcodebuild is not in PATH"
    exit 1
fi

# Check if workspace exists
if [ ! -f "$WORKSPACE" ]; then
    print_error "Workspace not found: $WORKSPACE"
    print_error "Make sure you're running this script from the project root"
    exit 1
fi

# Check if export options exist
if [ ! -f "$EXPORT_OPTIONS" ]; then
    print_warning "Export options not found: $EXPORT_OPTIONS"
    print_status "Creating default export options..."
    
    # Create export options directory if it doesn't exist
    mkdir -p "$(dirname "$EXPORT_OPTIONS")"
    
    # Create default export options
    cat > "$EXPORT_OPTIONS" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>destination</key>
    <string>export</string>
    <key>thinning</key>
    <string>&lt;none&gt;</string>
</dict>
</plist>
EOF
    
    print_warning "Please update YOUR_TEAM_ID in $EXPORT_OPTIONS with your Apple Developer Team ID"
    print_status "You can find your Team ID at: https://developer.apple.com/account/#/membership/"
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf build/
mkdir -p build

# Check for Node.js dependencies
if [ -f "package.json" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
fi

# Install CocoaPods dependencies
if [ -f "ios/Podfile" ]; then
    print_status "Installing CocoaPods dependencies..."
    cd ios
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        print_error "CocoaPods is not installed"
        print_status "Install with: sudo gem install cocoapods"
        exit 1
    fi
    
    pod install
    cd ..
    print_success "CocoaPods dependencies installed"
else
    print_warning "No Podfile found, skipping CocoaPods installation"
fi

# Build and Archive
print_status "Building and archiving (this may take 5-10 minutes)..."

xcodebuild -workspace "$WORKSPACE" \
           -scheme "$SCHEME" \
           -configuration Release \
           -destination generic/platform=iOS \
           -archivePath "$ARCHIVE_PATH" \
           -allowProvisioningUpdates \
           archive

if [ $? -eq 0 ]; then
    print_success "Archive created successfully"
else
    print_error "Archive failed"
    exit 1
fi

# Check if archive was created
if [ ! -d "$ARCHIVE_PATH" ]; then
    print_error "Archive not found at expected location: $ARCHIVE_PATH"
    exit 1
fi

# Export IPA
print_status "Exporting IPA..."

xcodebuild -exportArchive \
           -archivePath "$ARCHIVE_PATH" \
           -exportPath "$EXPORT_PATH" \
           -exportOptionsPlist "$EXPORT_OPTIONS" \
           -allowProvisioningUpdates

if [ $? -eq 0 ]; then
    print_success "IPA exported successfully"
else
    print_error "IPA export failed"
    
    # Try alternative export methods
    print_status "Trying alternative export methods..."
    
    # Try ad-hoc method
    print_status "Attempting ad-hoc export..."
    
    # Create ad-hoc export options
    AD_HOC_OPTIONS="ios/ExportOptions-AdHoc.plist"
    cat > "$AD_HOC_OPTIONS" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>thinning</key>
    <string>&lt;none&gt;</string>
</dict>
</plist>
EOF
    
    xcodebuild -exportArchive \
               -archivePath "$ARCHIVE_PATH" \
               -exportPath "${EXPORT_PATH}-adhoc" \
               -exportOptionsPlist "$AD_HOC_OPTIONS" \
               -allowProvisioningUpdates
    
    if [ $? -eq 0 ]; then
        print_success "Ad-hoc IPA exported successfully"
        EXPORT_PATH="${EXPORT_PATH}-adhoc"
    else
        print_error "All export methods failed"
        exit 1
    fi
fi

# Verify IPA file exists
IPA_FILE="$EXPORT_PATH/seraApp.ipa"
if [ -f "$IPA_FILE" ]; then
    print_success "Build completed successfully!"
    print_success "📍 IPA location: $IPA_FILE"
    
    # Get file size
    FILE_SIZE=$(ls -lh "$IPA_FILE" | awk '{print $5}')
    print_status "📊 IPA size: $FILE_SIZE"
    
    # Get file info
    print_status "📋 Build information:"
    echo "   - Archive: $ARCHIVE_PATH"
    echo "   - Export: $EXPORT_PATH"
    echo "   - Method: $(plutil -extract method raw "$EXPORT_OPTIONS" 2>/dev/null || echo "Unknown")"
    echo "   - Timestamp: $(date)"
    
    # Optional: Open containing folder
    if command -v open &> /dev/null; then
        print_status "Opening build folder..."
        open "$EXPORT_PATH"
    fi
    
else
    print_error "IPA file not found at expected location: $IPA_FILE"
    print_status "Checking for other files in export directory:"
    ls -la "$EXPORT_PATH" || echo "Export directory not found"
    exit 1
fi

print_success "🎉 iOS Release Build Complete!"
print_status "Next steps:"
echo "   1. Test the IPA file on a device"
echo "   2. Upload to App Store Connect"
echo "   3. Submit for App Store review"
echo ""
print_status "To upload to App Store Connect, use:"
echo "   xcrun altool --upload-app --type ios --file \"$IPA_FILE\" --username YOUR_APPLE_ID --password APP_SPECIFIC_PASSWORD" 