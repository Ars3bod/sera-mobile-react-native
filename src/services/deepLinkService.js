import {Linking, Platform, Alert} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';

class DeepLinkService {
  constructor() {
    // Nafath app URL schemes and store links
    this.nafathConfig = {
      // URL schemes to try launching the Nafath app
      schemes: {
        ios: 'nafath://', // iOS URL scheme for Nafath app
        android: [
          'nafath://',
          'intent://sa.gov.nic.myid#Intent;scheme=android-app;end',
        ], // Multiple Android schemes to try
        universal: 'https://nafath.gov.sa', // Universal link (fallback)
      },
      // App package name for Android
      packageName: 'sa.gov.nic.myid',
      // App Store links
      stores: {
        ios: 'https://apps.apple.com/sa/app/nafath/id1598909871', // Nafath app in App Store
        android:
          'https://play.google.com/store/apps/details?id=sa.gov.nic.myid', // Nafath app in Google Play
      },
    };
  }

  /**
   * Check if Nafath app is installed on the device
   */
  async isNafathAppInstalled() {
    try {
      if (Platform.OS === 'android') {
        // For Android, try multiple methods

        // Method 1: Check using package name with SendIntentAndroid
        try {
          const isInstalled = await this.isAppInstalledAndroid(
            this.nafathConfig.packageName,
          );
          console.log('Android package check result:', isInstalled);
          if (isInstalled) return true;
        } catch (error) {
          console.warn('Package check failed:', error);
        }

        // Method 2: Try URL scheme
        for (const scheme of this.nafathConfig.schemes.android) {
          try {
            const canOpen = await Linking.canOpenURL(scheme);
            console.log(`Android scheme ${scheme} check:`, canOpen);
            if (canOpen) return true;
          } catch (error) {
            console.warn(`Error checking scheme ${scheme}:`, error);
          }
        }

        return false;
      } else {
        // iOS method
        const canOpen = await Linking.canOpenURL(this.nafathConfig.schemes.ios);
        console.log('iOS scheme check result:', canOpen);
        return canOpen;
      }
    } catch (error) {
      console.warn('Error checking if Nafath app is installed:', error);
      return false;
    }
  }

  /**
   * Launch Nafath app with optional parameters
   */
  async launchNafathApp(params = {}) {
    try {
      if (Platform.OS === 'android') {
        // Android: Try multiple methods

        // Method 1: Try using package name directly
        try {
          console.log('Attempting to launch using package name...');
          const result = await this.launchNafathAppAndroid();
          if (result.success) {
            console.log('Successfully launched using package name');
            return result;
          }
        } catch (error) {
          console.warn('Package launch failed:', error);
        }

        // Method 2: Try URL schemes
        for (const scheme of this.nafathConfig.schemes.android) {
          try {
            console.log(`Attempting to launch using scheme: ${scheme}`);
            let url = scheme;
            if (
              Object.keys(params).length > 0 &&
              scheme.startsWith('nafath://')
            ) {
              const queryString = Object.keys(params)
                .map(key => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');
              url += `?${queryString}`;
            }

            const canOpen = await Linking.canOpenURL(url);
            console.log(`Can open ${url}:`, canOpen);

            if (canOpen) {
              await Linking.openURL(url);
              console.log('Successfully launched using URL scheme');
              return {
                success: true,
                action: 'app_launched',
                method: 'url_scheme',
              };
            }
          } catch (error) {
            console.warn(`Error with scheme ${scheme}:`, error);
          }
        }

        throw new Error('All Android launch methods failed');
      } else {
        // iOS method
        const scheme = this.nafathConfig.schemes.ios;
        let url = scheme;
        if (Object.keys(params).length > 0) {
          const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
          url += `?${queryString}`;
        }

        console.log(`iOS attempting to open: ${url}`);
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return {success: true, action: 'app_launched'};
        } else {
          throw new Error('Cannot open Nafath app on iOS');
        }
      }
    } catch (error) {
      console.warn('Error launching Nafath app:', error);
      return {success: false, error: error.message};
    }
  }

  /**
   * Redirect to app store to download Nafath app
   */
  async redirectToAppStore() {
    try {
      const storeUrl =
        Platform.OS === 'ios'
          ? this.nafathConfig.stores.ios
          : this.nafathConfig.stores.android;

      const canOpen = await Linking.canOpenURL(storeUrl);
      if (canOpen) {
        await Linking.openURL(storeUrl);
        return {success: true, action: 'store_opened'};
      } else {
        throw new Error('Cannot open app store');
      }
    } catch (error) {
      console.warn('Error opening app store:', error);
      return {success: false, error: error.message};
    }
  }

  /**
   * Try to launch Nafath app on Android using package name
   * (Alternative method for Android)
   */
  async launchNafathAppAndroid() {
    if (Platform.OS !== 'android') {
      return {success: false, error: 'This method is Android only'};
    }

    try {
      // Try to launch using package name
      console.log(
        `Launching Android app with package: ${this.nafathConfig.packageName}`,
      );
      await SendIntentAndroid.openApp(this.nafathConfig.packageName, {});
      return {success: true, action: 'app_launched_android'};
    } catch (error) {
      console.warn('Error launching Nafath app on Android:', error);

      // Try alternative method with intent
      try {
        const intent = {
          action: 'android.intent.action.MAIN',
          category: 'android.intent.category.LAUNCHER',
          package: this.nafathConfig.packageName,
        };
        await SendIntentAndroid.openApp('', intent);
        return {success: true, action: 'app_launched_android_intent'};
      } catch (intentError) {
        console.warn('Intent method also failed:', intentError);
        return {success: false, error: error.message};
      }
    }
  }

  /**
   * Check if app is installed on Android using package name
   */
  async isAppInstalledAndroid(packageName) {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      const installedApps = await SendIntentAndroid.getInstalledApps();
      return installedApps.some(app => app.packageName === packageName);
    } catch (error) {
      console.warn('Error checking installed apps on Android:', error);
      return false;
    }
  }

  /**
   * Main method to handle Nafath app opening logic
   * This is the method you should call from your component
   */
  async openNafathApp(options = {}) {
    const {showAlerts = true, params = {}, translations = {}} = options;

    try {
      // First, check if app is installed
      const isInstalled = await this.isNafathAppInstalled();

      if (isInstalled) {
        // App is installed, try to launch it
        const result = await this.launchNafathApp(params);

        if (result.success) {
          return {success: true, action: 'app_launched'};
        } else {
          // Fallback: try Android-specific method
          if (Platform.OS === 'android') {
            const androidResult = await this.launchNafathAppAndroid();
            if (androidResult.success) {
              return androidResult;
            }
          }
          throw new Error('Failed to launch Nafath app');
        }
      } else {
        // App is not installed, show dialog and redirect to store
        if (showAlerts) {
          Alert.alert(
            translations.title || 'تطبيق نفاذ غير مثبت',
            translations.message ||
              'تطبيق نفاذ غير مثبت على جهازك. هل تريد تحميله من المتجر؟',
            [
              {
                text: translations.cancel || 'إلغاء',
                style: 'cancel',
              },
              {
                text: translations.download || 'تحميل',
                onPress: async () => {
                  await this.redirectToAppStore();
                },
              },
            ],
          );
        } else {
          // No dialog, directly redirect to store
          await this.redirectToAppStore();
        }

        return {success: true, action: 'store_redirect'};
      }
    } catch (error) {
      console.error('Error in openNafathApp:', error);

      if (showAlerts) {
        Alert.alert(
          translations.errorTitle || 'خطأ',
          translations.errorMessage ||
            'حدث خطأ أثناء محاولة فتح تطبيق نفاذ. يرجى المحاولة مرة أخرى.',
        );
      }

      return {success: false, error: error.message};
    }
  }

  /**
   * Debug method to test all available methods for launching Nafath app
   * Call this method to see detailed logs about what works and what doesn't
   */
  async debugNafathApp() {
    console.log('🔍 === NAFATH APP DEBUG STARTING ===');
    console.log('Platform:', Platform.OS);
    console.log('Package Name:', this.nafathConfig.packageName);

    const results = {
      platform: Platform.OS,
      packageCheck: false,
      schemes: {},
      launchAttempts: {},
    };

    if (Platform.OS === 'android') {
      // Test 1: Check if app is installed using package name
      console.log('\n📱 Testing package installation check...');
      try {
        const isInstalled = await this.isAppInstalledAndroid(
          this.nafathConfig.packageName,
        );
        results.packageCheck = isInstalled;
        console.log('✅ Package check result:', isInstalled);
      } catch (error) {
        console.log('❌ Package check failed:', error.message);
        results.packageCheck = `Error: ${error.message}`;
      }

      // Test 2: Check each URL scheme
      console.log('\n🔗 Testing URL schemes...');
      for (const scheme of this.nafathConfig.schemes.android) {
        try {
          const canOpen = await Linking.canOpenURL(scheme);
          results.schemes[scheme] = canOpen;
          console.log(`${canOpen ? '✅' : '❌'} Scheme "${scheme}":`, canOpen);
        } catch (error) {
          results.schemes[scheme] = `Error: ${error.message}`;
          console.log(`❌ Scheme "${scheme}" error:`, error.message);
        }
      }

      // Test 3: Try launching with package name
      console.log('\n🚀 Testing launch with package name...');
      try {
        await SendIntentAndroid.openApp(this.nafathConfig.packageName, {});
        results.launchAttempts.packageName = 'Success';
        console.log('✅ Package launch successful');
      } catch (error) {
        results.launchAttempts.packageName = `Error: ${error.message}`;
        console.log('❌ Package launch failed:', error.message);
      }

      // Test 4: Try launching with intent
      console.log('\n🎯 Testing launch with intent...');
      try {
        const intent = {
          action: 'android.intent.action.MAIN',
          category: 'android.intent.category.LAUNCHER',
          package: this.nafathConfig.packageName,
        };
        await SendIntentAndroid.openApp('', intent);
        results.launchAttempts.intent = 'Success';
        console.log('✅ Intent launch successful');
      } catch (error) {
        results.launchAttempts.intent = `Error: ${error.message}`;
        console.log('❌ Intent launch failed:', error.message);
      }
    } else {
      // iOS testing
      console.log('\n🍎 Testing iOS URL scheme...');
      const scheme = this.nafathConfig.schemes.ios;
      try {
        const canOpen = await Linking.canOpenURL(scheme);
        results.schemes[scheme] = canOpen;
        console.log(
          `${canOpen ? '✅' : '❌'} iOS scheme "${scheme}":`,
          canOpen,
        );
      } catch (error) {
        results.schemes[scheme] = `Error: ${error.message}`;
        console.log(`❌ iOS scheme error:`, error.message);
      }
    }

    console.log('\n📊 === DEBUG RESULTS SUMMARY ===');
    console.log(JSON.stringify(results, null, 2));
    console.log('🔍 === NAFATH APP DEBUG COMPLETE ===\n');

    return results;
  }
}

// Export singleton instance
export default new DeepLinkService();
