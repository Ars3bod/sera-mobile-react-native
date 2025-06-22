import React from 'react';
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
  const { setGuestMode } = useUser();
  const isArabic = i18n.language === 'ar';

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
  });

  return (
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
              {isArabic ? 'English' : 'العربية'}
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
              {isArabic ? 'مرحباً بك' : 'Welcome'}
            </Text>
            <Text style={dynamicStyles.welcomeSubtitle}>
              {isArabic
                ? 'هيئة تنظيم الكهرباء والإنتاج المزدوج'
                : 'Electricity & Cogeneration Regulatory Authority'}
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
            {isArabic
              ? 'استخدم نفاذ الوطني الموحد للدخول بأمان إلى حسابك'
              : 'Use Nafath National Single Sign-On to securely access your account'}
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
              {isArabic ? 'متابعة كضيف' : 'Continue as Guest'}
            </Text>
          </TouchableOpacity>

          {/* Security Badge */}
          <View style={dynamicStyles.securityBadge}>
            <Shield24Regular style={dynamicStyles.securityIcon} />
            <Text style={dynamicStyles.securityText}>
              {isArabic
                ? 'محمي بتقنية التشفير المتقدمة'
                : 'Secured with advanced encryption'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={dynamicStyles.footer}>
          <Text style={dynamicStyles.footerText}>
            {isArabic
              ? '© 2025 هيئة تنظيم الكهرباء والإنتاج المزدوج\nالمملكة العربية السعودية'
              : '© 2025 Electricity & Cogeneration Regulatory Authority\nKingdom of Saudi Arabia'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
