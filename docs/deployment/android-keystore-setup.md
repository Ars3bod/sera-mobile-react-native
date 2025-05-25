# 🔐 Android Keystore Setup Guide

## 📋 Quick Summary

✅ **Completed Steps:**

- [x] Created keystore: `sera-release-key.keystore`
- [x] Configured build.gradle with signing config
- [x] Created key.properties for local development
- [x] Added .gitignore rules for protection
- [x] Converted keystore to base64

🔧 **Required Actions:**

1. Update key.properties with real passwords
2. Copy Base64 content for GitHub Secrets
3. Add GitHub Secrets (4 total)
4. Test signing locally
5. Test GitHub Actions workflow

---

## 📋 Overview

This guide explains how to create an Android Keystore for secure APK file signing and publishing to Google Play Store.

## 🎯 What You'll Need

- ✅ Java Development Kit (JDK) installed
- ✅ Personal/company information for certificate
- ✅ Different app versions (debug/release)
- ✅ GitHub repository access

## 🔧 Keystore Creation Steps

### Phase 1: Create Keystore File

#### 1.1 Using keytool (Recommended Method):

```bash
# Navigate to appropriate folder
cd ~/Desktop

# Create new keystore
keytool -genkey -v -keystore sera-release-key.keystore \
  -alias sera-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

#### 1.2 Required Information During Creation:

```bash
# You'll be asked for the following information:
Enter keystore password: [Enter strong password - save it!]
Re-enter new password: [Re-type password]

What is your first and last name?
  [Unknown]: Abdullah Al Maimoun

What is the name of your organizational unit?
  [Unknown]: SERA Development Team

What is the name of your organization?
  [Unknown]: SERA Company

What is the name of your City or Locality?
  [Unknown]: Riyadh

What is the name of your State or Province?
  [Unknown]: Riyadh Province

What is the two-letter country code for this unit?
  [Unknown]: SA

Is CN=Abdullah Al Maimoun, OU=SERA Development Team, O=SERA Company, L=Riyadh, ST=Riyadh Province, C=SA correct?
  [no]: yes

# Key password (can be same as keystore password)
Enter key password for <sera-key-alias>
        (RETURN if same as keystore password): [Press Enter or enter separate password]
```

#### 1.3 Verify Keystore Creation:

```bash
# Check created file
ls -la sera-release-key.keystore

# Verify keystore contents
keytool -list -v -keystore sera-release-key.keystore
```

### Phase 2: Convert Keystore to Base64

#### 2.1 Convert File for GitHub Secrets:

```bash
# macOS/Linux:
base64 -i sera-release-key.keystore | pbcopy

# or save to file:
base64 -i sera-release-key.keystore > sera-keystore-base64.txt

# Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("sera-release-key.keystore")) | Set-Clipboard

# Linux (if pbcopy not available):
base64 sera-release-key.keystore | xclip -selection clipboard
```

#### 2.2 Save Information Securely:

```bash
# Save this information in a secure place:
Keystore Password: [keystore password]
Key Alias: sera-key-alias
Key Password: [key password]
Keystore Base64: [converted text from previous step]
```

### Phase 3: Add Secrets to GitHub

#### 3.1 Open GitHub Repository Settings:

```bash
# Go to GitHub repository:
https://github.com/YOUR_USERNAME/sera-mobile-react

# Navigate to:
Repository → Settings → Secrets and variables → Actions
```

#### 3.2 Add Android Keystore Secrets:

| Secret Name                 | Secret Value                               |
| --------------------------- | ------------------------------------------ |
| `ANDROID_KEYSTORE`          | [content of sera-keystore-base64.txt file] |
| `ANDROID_KEYSTORE_PASSWORD` | [keystore password]                        |
| `ANDROID_KEY_ALIAS`         | `sera-key-alias`                           |
| `ANDROID_KEY_PASSWORD`      | [key password]                             |

### Phase 4: Configure Gradle for Signing

#### 4.1 Create signing config in build.gradle:

```bash
# Update android/app/build.gradle
# Add this section before android {}:

def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias'] ?: System.getenv('KEY_ALIAS')
            keyPassword keystoreProperties['keyPassword'] ?: System.getenv('KEY_PASSWORD')
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword'] ?: System.getenv('KEYSTORE_PASSWORD')
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### 4.2 Create key.properties for local development:

```bash
# Create android/key.properties (don't put in Git!)
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=sera-key-alias
storeFile=../sera-release-key.keystore
```

#### 4.3 Add key.properties to .gitignore:

```bash
# Make sure this exists in android/.gitignore:
key.properties
*.keystore
*.jks
```

### Phase 5: Test Signing

#### 5.1 Local Testing:

```bash
# Navigate to android folder
cd seraApp/android

# Run signed APK build
./gradlew assembleRelease

# Check for signed APK
ls -la app/build/outputs/apk/release/
```

#### 5.2 Verify Signature:

```bash
# Verify APK signature
jarsigner -verify -verbose -certs app/build/outputs/apk/release/app-release.apk

# Detailed signature information
keytool -printcert -jarfile app/build/outputs/apk/release/app-release.apk
```

### Phase 6: Test GitHub Actions

#### 6.1 Run workflow:

```bash
# Go to GitHub Actions
# Choose workflow containing Android build
# Check logs to ensure signing success:

# You should see:
> Task :app:validateSigningRelease
> Task :app:assembleRelease
BUILD SUCCESSFUL
```

#### 6.2 Download and Check APK:

```bash
# Download APK from GitHub Actions artifacts
# Verify signature locally:
jarsigner -verify downloaded-app-release.apk
```

## 🚨 Common Problems and Solutions

### 1. "keytool not found" Error:

```bash
# Solution - Make sure JDK is installed:
# macOS:
brew install openjdk

# Windows:
# Download JDK from Oracle or OpenJDK
# Add to PATH: C:\Program Files\Java\jdk-XX\bin

# Linux:
sudo apt install openjdk-11-jdk
```

### 2. "Wrong keystore password" Error:

```bash
# Solution:
1. Make sure of correct password
2. Check GitHub Secrets
3. Recreate keystore if password forgotten
```

### 3. "Key alias not found" Error:

```bash
# Solution:
1. Check alias name in GitHub Secrets
2. Use keytool -list to show aliases
3. Make sure names match exactly
```

### 4. CI/CD signing failure:

```bash
# Solution:
1. Check base64 conversion is correct
2. Make sure all secrets exist
3. Check build.gradle configuration
4. Review GitHub Actions logs
```

## ✅ Final Verification Checklist

- [ ] ✅ Java JDK installed
- [ ] ✅ Keystore created with keytool
- [ ] ✅ Keystore information documented safely
- [ ] ✅ Base64 conversion completed
- [ ] ✅ GitHub Secrets added (4 total)
- [ ] ✅ build.gradle configured
- [ ] ✅ key.properties created (and gitignored)
- [ ] ✅ Local signing tested
- [ ] ✅ CI/CD signing tested
- [ ] ✅ Backup keystore saved securely

## 🎯 Best Practices

### Keystore Security:

1. 🔐 Use strong passwords (12+ characters)
2. 💾 Save multiple backups
3. 📝 Document keystore information securely
4. 🔄 Rotate passwords periodically
5. 👥 Restrict access to authorized team only

### Keystore Management:

1. 🏢 Use separate keystore for each environment
2. 📊 Document all keystores and expiration dates
3. 🔄 Plan keystore renewal before expiration
4. 🧪 Test signing process regularly
5. 📋 Create SOP for keystore management

## 📁 Generated Files:

- `sera-release-key.keystore` - Main keystore
- `sera-keystore-base64.txt` - Base64 version for GitHub
- `android/key.properties` - Local settings
- `android/.gitignore` - Sensitive file protection

## 🚨 Very Important:

- **Don't share** keystore passwords with anyone
- **Keep a backup** of the keystore in a safe place
- **Don't put** keystore or key.properties in Git
- **Same keystore** must be used for all app releases

## 🎯 Next Steps

After creating Keystore:

1. **Test signing** locally and with CI/CD
2. **Prepare Android App Bundle** for Play Store
3. **Configure signing config** for different flavors
4. **Enable Play App Signing** in Google Play Console
5. **Document keystore management process** for team
