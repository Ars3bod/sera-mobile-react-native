import {Linking, Platform, Alert} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';

class DeepLinkService {
  constructor() {
    // Nafath app URL schemes and store links
    this.nafathConfig = {
      // URL schemes to try launching the Nafath app
      schemes: {
        ios: 'nafath://', // iOS URL scheme for Nafath app
        android: 'nafath://', // Android URL scheme for Nafath app
        universal: 'https://nafath.gov.sa', // Universal link (fallback)
      },
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
      const scheme =
        Platform.OS === 'ios'
          ? this.nafathConfig.schemes.ios
          : this.nafathConfig.schemes.android;

      const canOpen = await Linking.canOpenURL(scheme);
      return canOpen;
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
      const scheme =
        Platform.OS === 'ios'
          ? this.nafathConfig.schemes.ios
          : this.nafathConfig.schemes.android;

      // Build URL with parameters if provided
      let url = scheme;
      if (Object.keys(params).length > 0) {
        const queryString = Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');
        url += `?${queryString}`;
      }

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return {success: true, action: 'app_launched'};
      } else {
        throw new Error('Cannot open Nafath app');
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
      await SendIntentAndroid.openApp('sa.gov.nic.myid', {});
      return {success: true, action: 'app_launched_android'};
    } catch (error) {
      console.warn('Error launching Nafath app on Android:', error);
      return {success: false, error: error.message};
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
}

// Export singleton instance
export default new DeepLinkService();
