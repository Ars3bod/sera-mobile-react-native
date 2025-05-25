# 🔧 White Screen Fix Guide

## 🚨 Problem: White Screen on iOS Build

### Root Cause:

React Native 0.79.2 expects React 19.x but your project has dependency conflicts causing the app to fail to load.

## ✅ **STEP-BY-STEP FIX:**

### 1. **Clean Everything First**

```bash
# Stop Metro bundler if running
# In terminal with Metro: Press Ctrl+C

# Clean all caches
rm -rf node_modules
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock
rm -rf .expo
rm package-lock.json

# Clean Metro cache
npx react-native start --reset-cache --stop
```

### 2. **Force Install Correct Versions**

```bash
# Install with exact React 19 (required by RN 0.79.2)
npm install react@19.0.0 --exact
npm install react-test-renderer@19.0.0 --exact
npm install @types/react@19.0.0 --exact
npm install @types/react-test-renderer@19.0.0 --exact

# Install all dependencies
npm install --legacy-peer-deps
```

### 3. **Update iOS Pods**

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### 4. **Test the Fix**

```bash
# Start Metro with clean cache
npx react-native start --reset-cache

# In another terminal, build iOS
npx react-native run-ios --simulator="iPhone 15 Pro"
```

## 🔍 **Alternative Fix: Downgrade React Native**

If React 19 conflicts persist, downgrade to stable versions:

```bash
# Option A: Use React 18 with older RN
npm install react@18.2.0 react-native@0.72.7 --exact
npm install react-test-renderer@18.2.0 --exact
npm install @types/react@18.2.0 --exact

# Update dependencies
npm install --legacy-peer-deps
cd ios && pod install && cd ..
```

## 🛠️ **Quick Debug Commands**

### Check if app loads in simulator:

```bash
# Reset iOS Simulator
xcrun simctl shutdown all
xcrun simctl erase all

# Try running
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Check for JavaScript errors:

```bash
# Open Metro logs
npx react-native start --verbose

# Look for red error messages in Metro terminal
```

### Check if assets load:

```bash
# Verify assets exist
ls -la src/assets/images/sera-white-logo.png
ls -la src/assets/videos/splash.mp4
```

## 🎯 **Most Likely Solutions**

### **Solution 1: Asset Loading Issue**

If assets don't load, try:

```javascript
// In SplashScreen.js, replace relative paths:
// FROM:
source={require('../assets/videos/splash.mp4')}
source={require('../assets/images/sera-white-logo.png')}

// TO:
source={require('../../assets/videos/splash.mp4')}
source={require('../../assets/images/sera-white-logo.png')}
```

### **Solution 2: Navigation Issue**

If navigation fails, add error boundary:

```javascript
// Add to App.js
import React from 'react';
import {Text, View} from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Something went wrong. Check Metro logs.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Wrap your app:
export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <FontProvider>
          <ThemeProvider>
            <AppNavigator />
          </ThemeProvider>
        </FontProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
```

### **Solution 3: Simple Test Screen**

Replace AppNavigator temporarily with simple test:

```javascript
// In App.js, temporarily replace <AppNavigator /> with:
import {View, Text} from 'react-native';

// Replace AppNavigator with:
<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  <Text>Test Screen - App is working!</Text>
</View>;
```

## 🏃‍♂️ **Quick Test Checklist**

- [ ] Metro bundler starts without errors
- [ ] No red error screens in simulator
- [ ] Assets load correctly
- [ ] Navigation works
- [ ] Splash screen shows

## 📞 **Still Having Issues?**

1. **Check Metro Terminal** for JavaScript errors
2. **Check Xcode Console** for native iOS errors
3. **Try iPhone Simulator** instead of physical device
4. **Check iOS Deployment Target** in Xcode (should be 12.0+)

---

**Most common cause**: React version mismatch between package.json and node_modules
**Quick fix**: Clean install with correct React version for RN 0.79.2
