# 🚀 Local AAB Build Guide for SERA Mobile

## Prerequisites

1. **Upload Keystore File**: You need your `upload.keystore` file
2. **Keystore Details**: Password, alias, and key password
3. **Android SDK**: Properly configured
4. **Gradle**: Working Android build environment

## Step 1: Prepare Upload Keystore

### Option A: If you have your upload keystore file
```bash
# Copy your upload keystore to the android/app directory
cp /path/to/your/upload.keystore android/app/upload.keystore
```

### Option B: If you don't have the upload keystore
You'll need to create a new one or retrieve it from Google Play Console.

## Step 2: Set Environment Variables

```bash
# Set your keystore details
export KEYSTORE_PASSWORD="your_keystore_password"
export KEY_ALIAS="your_key_alias"
export KEY_PASSWORD="your_key_password"
```

## Step 3: Build Signed AAB

```bash
# Navigate to android directory
cd android

# Clean previous builds
./gradlew clean

# Build signed AAB
./gradlew bundleRelease
```

## Step 4: Verify AAB File

```bash
# Check if AAB was created
ls -la app/build/outputs/bundle/release/

# Should see: app-release.aab
```

## Alternative: Using Gradle Properties

Create `android/key.properties`:
```properties
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=your_key_alias
storeFile=upload.keystore
```

Then build:
```bash
cd android
./gradlew bundleRelease
```

## Troubleshooting

### Error: Keystore not found
- Ensure `upload.keystore` is in `android/app/` directory
- Check file permissions

### Error: Wrong password
- Verify keystore password and key password
- Check alias name

### Error: Build failed
- Run `./gradlew clean` first
- Check Android SDK configuration
- Ensure all dependencies are installed

## Output Location

The signed AAB will be created at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Upload to Google Play

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Release** → **Production** (or **Internal Testing**)
4. Click **Create new release**
5. Upload the `app-release.aab` file
6. Fill in release notes
7. Review and publish

## Security Notes

- **Never commit** keystore files to version control
- **Backup** your keystore file securely
- **Use environment variables** for passwords in CI/CD
- **Keep keystore passwords** in a secure password manager
