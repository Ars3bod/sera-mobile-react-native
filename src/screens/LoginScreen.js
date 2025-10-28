import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import biometricService from '../services/biometricService';
import ActionToast from '../components/ActionToast';
import Toast from '../components/Toast';
import {
  Globe24Regular,
  Shield24Regular,
  Sparkle24Regular,
} from '@fluentui/react-native-icons';

const logo = require('../assets/images/sera_logo.png');
const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { setGuestMode, saveUserData, saveTokens } = useUser();
  const isArabic = i18n.language === 'ar';

  // Biometric state
  const [isCheckingBiometric, setIsCheckingBiometric] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Toast state
  const [actionToastVisible, setActionToastVisible] = useState(false);
  const [actionToastData, setActionToastData] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    // Check and trigger biometric authentication on mount
    checkBiometricAuth();
  }, []);

  const checkBiometricAuth = async () => {
    try {
      // Check if biometric is enabled
      const isBiometricEnabled = await biometricService.isBiometricEnabled();

      if (isBiometricEnabled) {
        // Check if biometric hardware is available
        const { available } = await biometricService.isBiometricAvailable();

        if (available) {
          // Get current failed attempts
          const attempts = await biometricService.getFailedAttempts();
          setFailedAttempts(attempts);

          // Wait a short delay then trigger biometric prompt
          setTimeout(() => {
            handleBiometricAuth();
          }, 500);
          return; // Keep loading state active while biometric is in progress
        }
      }

      // No biometric needed, allow user interaction
      setIsCheckingBiometric(false);
    } catch (error) {
      console.log('Error checking biometric auth:', error);
      // On error, allow user to proceed with normal login
      setIsCheckingBiometric(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await biometricService.authenticateWithBiometric(
        t('settings.biometric.authPrompt')
      );

      if (result.success && result.credentials) {
        // Authentication successful - restore user session
        await restoreUserSession(result.credentials);

        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        // Handle authentication failure
        handleAuthFailure(result);
        // Allow user to interact with login screen after biometric fails/cancels
        setIsCheckingBiometric(false);
      }
    } catch (error) {
      console.log('Biometric authentication error:', error);
      handleAuthFailure({ success: false, error: error.message });
      // Allow user to interact with login screen after error
      setIsCheckingBiometric(false);
    }
  };

  const restoreUserSession = async (credentials) => {
    try {
      // Restore user data and tokens
      if (credentials.userData) {
        await saveUserData(credentials.userData);
      }

      if (credentials.tokens) {
        await saveTokens(credentials.tokens);
      }
    } catch (error) {
      console.log('Error restoring user session:', error);
      throw error;
    }
  };

  const handleAuthFailure = async (result) => {
    const newFailedAttempts = await biometricService.getFailedAttempts();
    setFailedAttempts(newFailedAttempts);

    if (result.requiresLogin || newFailedAttempts >= 3) {
      // Too many failed attempts - disable biometric and show message
      await biometricService.disableBiometricAfterFailure();
      showToast(t('settings.biometric.tooManyAttempts'), 'error');
    } else if (result.cancelled) {
      // User cancelled - do nothing, let them use normal login
      console.log('Biometric authentication cancelled by user');
    } else {
      // Authentication failed - show error with retry option
      showActionToast(
        t('settings.biometric.authFailed'),
        result.error || t('settings.biometric.authFailed'),
        () => {
          hideActionToast();
          handleBiometricAuth();
        },
        () => {
          hideActionToast();
        },
        'error'
      );
    }
  };

  // Helper functions for custom toasts
  const showActionToast = (title, message, onConfirm, onCancel, type = 'info') => {
    setActionToastData({
      title,
      message,
      onConfirm,
      onCancel,
      type,
    });
    setActionToastVisible(true);
  };

  const hideActionToast = () => {
    setActionToastVisible(false);
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? 'en' : 'ar');
  };

  const handleNafathLogin = () => {
    navigation.navigate('NafathLogin');
  };

  const handleGuestLogin = () => {
    setGuestMode(true);
    navigation.navigate('Services');
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: height * 0.6,
      backgroundColor: `${theme.colors.primary}08`,
    },
    langIcon: {
      width: 20,
      height: 20,
      color: theme.colors.primary,
      marginRight: isArabic ? 0 : 8,
      marginLeft: isArabic ? 8 : 0,
    },
    langText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    welcomeTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
      textAlign: isArabic ? 'right' : 'left',
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 12,
      textAlign: isArabic ? 'right' : 'left',
      lineHeight: 24,
    },
    loginTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: isArabic ? 'right' : 'left',
    },
    loginSubtitle: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      marginBottom: 32,
      textAlign: isArabic ? 'right' : 'left',
      lineHeight: 22,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      width: '100%',
      paddingVertical: 18,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 20,
    },
    loginButtonText: {
      color: theme.colors.textInverse,
      fontSize: 18,
      fontWeight: 'bold',
    },
    securityBadge: {
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      alignSelf: 'center',
    },
    securityIcon: {
      width: 16,
      height: 16,
      color: theme.colors.primary,
      marginRight: isArabic ? 0 : 6,
      marginLeft: isArabic ? 6 : 0,
    },
    securityText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    guestButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: 16,
      width: '100%',
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    guestButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    footer: {
      alignItems: 'center',
      paddingBottom: 20,
    },
    footerText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
    decorativeElement: {
      position: 'absolute',
      top: 60,
      right: isArabic ? undefined : 30,
      left: isArabic ? 30 : undefined,
      opacity: 0.1,
    },
    sparkleIcon: {
      width: 24,
      height: 24,
      color: theme.colors.primary,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
      zIndex: 9999,
    },
  });

  return (
    <>
      <SafeAreaView style={dynamicStyles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />

        {/* Background Gradient */}
        <View style={dynamicStyles.gradientOverlay} />

        {/* Decorative Element */}
        <View style={dynamicStyles.decorativeElement}>
          <Sparkle24Regular style={dynamicStyles.sparkleIcon} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[
                styles.langSwitcher,
                { alignSelf: isArabic ? 'flex-end' : 'flex-start' },
              ]}
              onPress={toggleLanguage}>
              <Globe24Regular style={dynamicStyles.langIcon} />
              <Text style={dynamicStyles.langText}>
                {isArabic ? t('loginScreen.languageToggle.switchToEnglish') : t('loginScreen.languageToggle.switchToArabic')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />

            {/* Welcome Message */}
            <View
              style={[
                styles.welcomeContainer,
                { alignItems: isArabic ? 'flex-end' : 'flex-start' },
              ]}>
              <Text style={dynamicStyles.welcomeTitle}>
                {t('loginScreen.welcome')}
              </Text>
              <Text style={dynamicStyles.welcomeSubtitle}>
                {t('loginScreen.organizationName')}
              </Text>
            </View>
          </View>

          {/* Login Section */}
          <View
            style={[
              styles.loginSection,
              { alignItems: isArabic ? 'flex-end' : 'flex-start' },
            ]}>
            <Text style={dynamicStyles.loginTitle}>{t('login')}</Text>
            <Text style={dynamicStyles.loginSubtitle}>
              {t('loginScreen.nafathDescription')}
            </Text>

            <TouchableOpacity
              style={dynamicStyles.loginButton}
              onPress={handleNafathLogin}
              activeOpacity={0.8}>
              <Text style={dynamicStyles.loginButtonText}>
                {t('login_button')}
              </Text>
            </TouchableOpacity>

            {/* Guest Login Button */}
            <TouchableOpacity
              style={dynamicStyles.guestButton}
              onPress={handleGuestLogin}
              activeOpacity={0.8}>
              <Text style={dynamicStyles.guestButtonText}>
                {t('loginScreen.guestButton')}
              </Text>
            </TouchableOpacity>

            {/* Security Badge */}
            <View style={dynamicStyles.securityBadge}>
              <Shield24Regular style={dynamicStyles.securityIcon} />
              <Text style={dynamicStyles.securityText}>
                {t('loginScreen.securityBadge')}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={dynamicStyles.footer}>
            <Text style={dynamicStyles.footerText}>
              {t('loginScreen.copyright')}
            </Text>
          </View>
        </ScrollView>

        {/* Loading Overlay - Blocks interaction until biometric check is complete */}
        {isCheckingBiometric && (
          <View style={dynamicStyles.loadingOverlay} />
        )}
      </SafeAreaView>

      {/* Custom Action Toast */}
      <ActionToast
        visible={actionToastVisible}
        title={actionToastData.title}
        message={actionToastData.message}
        onConfirm={actionToastData.onConfirm}
        onCancel={actionToastData.onCancel}
        confirmText={t('common.retry')}
        cancelText={t('common.cancel')}
        type={actionToastData.type}
      />

      {/* Custom Toast */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    minHeight: height - 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  langSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 70,
    marginBottom: 20,
  },
  welcomeContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  loginSection: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
});
