import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
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

const SettingsScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode, toggleTheme} = useTheme();
  const isRTL = i18n.language === 'ar';

  // State for toggle settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLanguage);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the cache? This will free up storage space.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            console.log('Cache cleared');
            // Add actual cache clearing logic here
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout.confirmTitle'),
      t('settings.logout.confirmMessage'),
      [
        {text: t('settings.logout.cancel'), style: 'cancel'},
        {
          text: t('settings.logout.confirm'),
          style: 'destructive',
          onPress: () => {
            // Add logout logic here
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
        },
      ],
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
        <View style={[styles.iconContainer, {backgroundColor: color + '15'}]}>
          <IconComponent style={[styles.settingIcon, {color}]} />
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
          trackColor={{false: theme.colors.border, true: color + '40'}}
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
        <View style={[styles.iconContainer, {backgroundColor: color + '15'}]}>
          <IconComponent style={[styles.settingIcon, {color}]} />
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
                transform: [{scaleX: isRTL ? -1 : 1}],
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
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />

      {/* Header */}
      <View
        style={[
          dynamicStyles.header,
          {flexDirection: isRTL ? 'row-reverse' : 'row'},
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}>
          <ArrowLeft24Regular
            style={[
              dynamicStyles.backIcon,
              {transform: [{scaleX: isRTL ? -1 : 1}]},
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

        {/* Biometric Toggle */}
        {renderToggleSetting(
          Fingerprint24Regular,
          'settings.biometric.title',
          'settings.biometric.description',
          biometricEnabled,
          setBiometricEnabled,
        )}

        {/* Font Size Setting */}
        {renderActionSetting(
          TextFont24Regular,
          'settings.fontSize.title',
          'settings.fontSize.description',
          () => console.log('Font size pressed'),
        )}

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
    </SafeAreaView>
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
    transform: [{scaleX: 1.1}, {scaleY: 1.1}],
  },
  chevronIcon: {
    width: 20,
    height: 20,
    color: '#6c757d',
  },
});

export default SettingsScreen;
