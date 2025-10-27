import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import biometricService from '../services/biometricService';
import supabaseI18nService from '../services/supabaseService';
import { refreshI18nTranslations } from '../localization/i18n';
import ActionToast from '../components/ActionToast';
import Toast from '../components/Toast';
import SafeContainer from '../components/SafeContainer';
import {
  ArrowLeft24Regular,
  LocalLanguage24Regular,
  Alert24Regular,
  WeatherMoon24Regular,
  Fingerprint24Regular,
  TextFont24Regular,
  Delete24Regular,
  SignOut24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-native-icons';

const APP_CONFIG = {
  useNewHomeScreen: true, // تحكم في الشاشة المستخدمة
};

const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, user, tokens } = useUser();
  const isRTL = i18n.language === 'ar';

  // State for toggle settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');
  const [isLoading, setIsLoading] = useState(false);

  // Toast states
  const [actionToastVisible, setActionToastVisible] = useState(false);
  const [actionToastData, setActionToastData] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Initialize biometric settings on component mount
  useEffect(() => {
    initializeBiometricSettings();
  }, []);

  // Re-initialize when authentication state changes
  useEffect(() => {
    if (isAuthenticated !== undefined) { // Only run when isAuthenticated is not undefined
      initializeBiometricSettings();
    }
  }, [isAuthenticated]);

  const initializeBiometricSettings = async () => {
    try {
      // Check if biometric is available on device
      const { available, biometryType } = await biometricService.isBiometricAvailable();
      setBiometricAvailable(available);

      if (available) {
        // Get biometric type name for UI
        const typeName = await biometricService.getBiometricTypeName();
        setBiometricType(typeName);

        // Check if biometric is currently enabled
        const isEnabled = await biometricService.isBiometricEnabled();
        setBiometricEnabled(isEnabled);
      }
    } catch (error) {
      console.log('Error initializing biometric settings:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
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

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLanguage);
  };

  const handleBiometricToggle = async (enabled) => {
    // Check if user is logged in
    if (!isAuthenticated) {
      showToast(t('settings.biometric.loginRequired'), 'error');
      return;
    }

    // Check if biometric is available
    if (!biometricAvailable) {
      showToast(t('settings.biometric.notAvailable'), 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (enabled) {
        // Show confirmation dialog for enabling
        showActionToast(
          t('settings.biometric.enableTitle'),
          t('settings.biometric.enableMessage', { biometricType }),
          async () => {
            hideActionToast();
            try {
              // Prepare user credentials for secure storage
              const credentials = {
                nationalId: user?.nationalId || user?.id,
                userId: user?.id,
                tokens: tokens,
                userData: user,
                enabledAt: new Date().toISOString(),
              };

              // Enable biometric with user credentials
              await biometricService.setBiometricEnabled(true, credentials);
              setBiometricEnabled(true);

              showToast(t('settings.biometric.enabled'), 'success');
            } catch (error) {
              console.log('Error enabling biometric:', error);
              showToast(error.message || t('settings.biometric.authFailed'), 'error');
            }
          },
          () => {
            hideActionToast();
          },
          'info'
        );
      } else {
        // Show confirmation dialog for disabling
        showActionToast(
          t('settings.biometric.disableTitle'),
          t('settings.biometric.disableMessage'),
          async () => {
            hideActionToast();
            try {
              await biometricService.setBiometricEnabled(false);
              setBiometricEnabled(false);

              showToast(t('settings.biometric.disabled'), 'success');
            } catch (error) {
              console.log('Error disabling biometric:', error);
              showToast(error.message || t('common.error'), 'error');
            }
          },
          () => {
            hideActionToast();
          },
          'warning'
        );
      }
    } catch (error) {
      console.log('Error handling biometric toggle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = () => {
    showActionToast(
      t('settings.clearCache.confirmTitle'),
      t('settings.clearCache.confirmMessage'),
      async () => {
        hideActionToast();
        try {
          console.log('🗑️ Starting cache clear...');

          // 1. Clear Supabase i18n translation cache
          await supabaseI18nService.clearCache();
          console.log('✅ Supabase i18n cache cleared');

          // 2. Clear any other AsyncStorage cached data (optional - add more keys as needed)
          // You can add more cache keys here if you have other cached data
          const keysToPreserve = [
            '@sera_biometric_enabled', // Preserve biometric settings
            '@sera_user_credentials',   // Preserve user credentials for biometric login
            // Add other keys you want to preserve
          ];

          // Get all keys from AsyncStorage
          const allKeys = await AsyncStorage.getAllKeys();

          // Filter out keys to preserve
          const keysToRemove = allKeys.filter(key => !keysToPreserve.includes(key));

          // Remove cache keys (but not user settings/credentials)
          if (keysToRemove.length > 0) {
            await AsyncStorage.multiRemove(keysToRemove);
            console.log(`✅ Cleared ${keysToRemove.length} AsyncStorage cache entries`);
          }

          // 3. Force refresh i18n translations from Supabase
          console.log('🔄 Reloading translations from Supabase...');
          await refreshI18nTranslations();
          console.log('✅ Translations reloaded from Supabase');

          showToast(t('settings.clearCache.success'), 'success');
          console.log('🎉 Cache clear completed successfully');
        } catch (error) {
          console.error('❌ Error clearing cache:', error);
          showToast(
            t('common.error') + ': ' + (error.message || t('settings.clearCache.error')),
            'error'
          );
        }
      },
      () => {
        hideActionToast();
      },
      'warning'
    );
  };

  const handleLogout = () => {
    showActionToast(
      t('settings.logout.confirmTitle'),
      t('settings.logout.confirmMessage'),
      () => {
        hideActionToast();
        // Add logout logic here
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      },
      () => {
        hideActionToast();
      },
      'warning'
    );
  };

  const renderToggleSetting = (
    icon,
    titleKey,
    descriptionKey,
    value,
    onValueChange,
    color = theme.colors.primary,
  ) => {
    const IconComponent = icon;
    return (
      <View
        style={[
          styles.settingItem,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            backgroundColor: theme.colors.card,
          },
        ]}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <IconComponent style={[styles.settingIcon, { color }]} />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.settingTitle,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.text,
              },
            ]}>
            {t(titleKey)}
          </Text>
          <Text
            style={[
              styles.settingDescription,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.textSecondary,
              },
            ]}>
            {t(descriptionKey)}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.border, true: color + '40' }}
          thumbColor={value ? color : theme.colors.surface}
          ios_backgroundColor={theme.colors.border}
          style={styles.switch}
        />
      </View>
    );
  };

  const renderActionSetting = (
    icon,
    titleKey,
    descriptionKey,
    onPress,
    color = theme.colors.primary,
    showChevron = true,
  ) => {
    const IconComponent = icon;
    return (
      <TouchableOpacity
        style={[
          styles.settingItem,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            backgroundColor: theme.colors.card,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <IconComponent style={[styles.settingIcon, { color }]} />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.settingTitle,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.text,
              },
            ]}>
            {t(titleKey)}
          </Text>
          <Text
            style={[
              styles.settingDescription,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.textSecondary,
              },
            ]}>
            {t(descriptionKey)}
          </Text>
        </View>
        {showChevron && (
          <ChevronRight24Regular
            style={[
              styles.chevronIcon,
              {
                transform: [{ scaleX: isRTL ? -1 : 1 }],
                color: theme.colors.icon,
              },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backIcon: {
      width: 24,
      height: 24,
      color: theme.colors.primary,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      flex: 1,
    },
  });

  return (
    <>
      <SafeContainer
        style={dynamicStyles.container}
        backgroundColor={theme.colors.background}
        statusBarStyle={isDarkMode ? 'light-content' : 'dark-content'}
        statusBarBackgroundColor={theme.colors.surface}
      >

        {/* Header */}
        <View
          style={[
            dynamicStyles.header,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <ArrowLeft24Regular
              style={[
                dynamicStyles.backIcon,
                { transform: [{ scaleX: isRTL ? -1 : 1 }] },
              ]}
            />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>{t('settings.title')}</Text>
          <View style={styles.placeholderView} />
        </View>

        {/* Settings List */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Language Setting */}
          {renderActionSetting(
            LocalLanguage24Regular,
            'settings.language.title',
            'settings.language.description',
            handleLanguageChange,
          )}

          {/* Notifications Toggle */}
          {renderToggleSetting(
            Alert24Regular,
            'settings.notifications.title',
            'settings.notifications.description',
            notificationsEnabled,
            setNotificationsEnabled,
          )}

          {/* Dark Mode Toggle */}
          {renderToggleSetting(
            WeatherMoon24Regular,
            'settings.darkMode.title',
            'settings.darkMode.description',
            isDarkMode,
            toggleTheme,
          )}

          {/* Biometric Toggle - Only show if user is authenticated and biometric is available */}
          {isAuthenticated && biometricAvailable && renderToggleSetting(
            Fingerprint24Regular,
            'settings.biometric.title',
            'settings.biometric.description',
            biometricEnabled,
            handleBiometricToggle,
          )}

          {/* Font Size Setting */}
          {/* {renderActionSetting(
          TextFont24Regular,
          'settings.fontSize.title',
          'settings.fontSize.description',
          () => console.log('Font size pressed'),
        )} */}

          {/* Clear Cache */}
          {renderActionSetting(
            Delete24Regular,
            'settings.clearCache.title',
            'settings.clearCache.description',
            handleClearCache,
            theme.colors.warning,
            false,
          )}

          {/* Logout */}
          {renderActionSetting(
            SignOut24Regular,
            'settings.logout.title',
            'settings.logout.description',
            handleLogout,
            theme.colors.error,
            false,
          )}
        </ScrollView>
      </SafeContainer>

      {/* Custom Action Toast for confirmations */}
      <ActionToast
        visible={actionToastVisible}
        title={actionToastData.title}
        message={actionToastData.message}
        onConfirm={actionToastData.onConfirm}
        onCancel={actionToastData.onCancel}
        confirmText={t('common.ok')}
        cancelText={t('common.cancel')}
        type={actionToastData.type}
      />

      {/* Custom Toast for notifications */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    color: '#00623B',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00623B',
    textAlign: 'center',
    flex: 1,
  },
  placeholderView: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    marginLeft: 0,
  },
  settingIcon: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  chevronIcon: {
    width: 20,
    height: 20,
    color: '#6c757d',
  },
});

export default SettingsScreen;
