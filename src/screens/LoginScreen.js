import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTranslation} from 'react-i18next';

const logo = require('../assets/images/sera_logo.png');

export default function LoginScreen({navigation}) {
  const {t, i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? 'en' : 'ar');
  };

  const handleNafathLogin = () => {
    navigation.navigate('NafathLogin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Language Switcher */}
        <TouchableOpacity style={styles.langSwitcher} onPress={toggleLanguage}>
          <Image
            source={require('../assets/images/sera_logo.png')}
            style={styles.langIcon}
          />
          <Text style={styles.langText}>
            {isArabic ? 'English' : 'العربية'}
          </Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.loginTitle}>{t('login')}</Text>
          <Text style={styles.loginSubtitle}>{t('login_subtitle')}</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleNafathLogin}>
            <Text style={styles.loginButtonText}>{t('login_button')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  langIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  langText: {
    fontSize: 16,
    color: '#006341',
    fontWeight: 'bold',
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
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#006341',
    marginBottom: 4,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#006341',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
