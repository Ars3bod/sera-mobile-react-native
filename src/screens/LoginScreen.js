import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {LocalLanguage24Regular} from '@fluentui/react-native-icons';

const logo = require('../assets/images/sera_logo.png');

export default function LoginScreen({navigation}) {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isArabic = i18n.language === 'ar';

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? 'en' : 'ar');
  };

  const handleNafathLogin = () => {
    navigation.navigate('NafathLogin');
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    langIcon: {
      width: 24,
      height: 24,
      color: theme.colors.primary,
      marginRight: 6,
    },
    langText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    loginTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    loginSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 20,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 14,
      width: '100%',
      paddingVertical: 14,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    loginButtonText: {
      color: theme.colors.textInverse,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.innerContainer}>
        {/* Language Switcher */}
        <TouchableOpacity style={styles.langSwitcher} onPress={toggleLanguage}>
          <LocalLanguage24Regular style={dynamicStyles.langIcon} />
          <Text style={dynamicStyles.langText}>
            {isArabic ? 'English' : 'العربية'}
          </Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={dynamicStyles.loginTitle}>{t('login')}</Text>
          <Text style={dynamicStyles.loginSubtitle}>{t('login_subtitle')}</Text>
          <TouchableOpacity
            style={dynamicStyles.loginButton}
            onPress={handleNafathLogin}>
            <Text style={dynamicStyles.loginButtonText}>
              {t('login_button')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  langSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 16,
    marginRight: 16,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 220,
    height: 80,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
});
