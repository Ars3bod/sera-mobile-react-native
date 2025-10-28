import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { loginNafath } from '../services/nafathService';
import { LoadingSpinner } from '../animations';
import {
  ArrowLeft24Regular,
  Person24Regular,
  Info24Regular,
} from '@fluentui/react-native-icons';

const { width, height } = Dimensions.get('window');
// You can add Nafath logo here if available
// const nafathLogo = require('../assets/images/nafath_logo.png');

export default function NafathLoginScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const isArabic = i18n.language === 'ar';
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');

  // Refs for keyboard handling
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  const { fromModal } = route.params || {};

  const handleGoBack = () => {
    if (fromModal) {
      // If came from modal, navigate to LoginScreen
      navigation.navigate('Login');
    } else {
      // Default behavior - go back to previous screen
      navigation.goBack();
    }
  };

  // Handle input focus - scroll to make input visible above keyboard
  const handleInputFocus = () => {
    setTimeout(() => {
      inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: pageY - 100, // Scroll to position with 100px padding from top
          animated: true,
        });
      });
    }, 100); // Small delay to let keyboard animation start
  };

  // Input validation handler to ensure only English digits (0-9) are entered
  const handleNationalIdChange = (text) => {
    // Check if user tried to input non-English digits
    const hasNonEnglishDigits = /[^0-9]/.test(text);

    if (hasNonEnglishDigits) {
      // Show error message for non-English digits
      setInputError(t('nafathLogin.errors.englishDigitsOnly'));

      // Clear error after 3 seconds
      setTimeout(() => setInputError(''), 3000);
    } else {
      // Clear error if input is valid
      setInputError('');
    }

    // Filter out any non-English numeric characters
    // Only allow digits 0-9 (ASCII 48-57)
    const filteredText = text.replace(/[^0-9]/g, '');
    setNationalId(filteredText);
  };

  const handleContinue = async () => {
    // Clear any existing input errors when user tries to continue
    setInputError('');

    if (!nationalId) {
      Alert.alert(
        t('common.error'),
        t('nafathLogin.errors.nationalIdRequired'),
      );
      return;
    }

    if (nationalId.length !== 10) {
      Alert.alert(
        t('common.error'),
        t('nafathLogin.errors.nationalIdLength'),
      );
      return;
    }

    // Additional validation: ensure all characters are English digits
    if (!/^\d{10}$/.test(nationalId)) {
      Alert.alert(
        t('common.error'),
        t('nafathLogin.errors.nationalIdEnglishOnly'),
      );
      return;
    }

    setLoading(true);
    try {
      const res = await loginNafath(nationalId);
      navigation.replace('NafathVerification', {
        transId: res.transId,
        random: res.random,
        nationalId,
      });
    } catch (e) {
      Alert.alert(
        t('nafathLogin.errors.connectionTitle'),
        t('nafathLogin.errors.connectionMessage'),
      );
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: isArabic ? 0 : 12,
      marginLeft: isArabic ? 12 : 0,
    },
    backIcon: {
      width: 24,
      height: 24,
      color: theme.colors.primary,
      transform: [{ scaleX: isArabic ? -1 : 1 }],
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
      textAlign: isArabic ? 'right' : 'left',
    },
    scrollContent: {
      padding: 20,
      minHeight: height - 200,
    },
    logoSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    nafathTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    nafathSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    mainCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: isArabic ? 'right' : 'left',
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 24,
      textAlign: isArabic ? 'right' : 'left',
      lineHeight: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: isArabic ? 'right' : 'left',
    },
    inputContainer: {
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginBottom: 20,
    },
    inputIcon: {
      width: 20,
      height: 20,
      color: theme.colors.primary,
      marginRight: isArabic ? 0 : 12,
      marginLeft: isArabic ? 12 : 0,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      paddingVertical: 16,
      textAlign: isArabic ? 'right' : 'left',
    },
    errorContainer: {
      marginTop: -16,
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    errorText: {
      fontSize: 12,
      color: '#FF3B30', // iOS red color
      textAlign: isArabic ? 'right' : 'left',
      fontWeight: '500',
    },
    continueButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
    },
    disabledButton: {
      backgroundColor: theme.colors.border,
      shadowOpacity: 0,
      elevation: 0,
    },
    buttonText: {
      color: theme.colors.textInverse,
      fontSize: 18,
      fontWeight: 'bold',
    },
    disabledButtonText: {
      color: theme.colors.textSecondary,
    },
    loadingContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    infoSection: {
      backgroundColor: theme.colors.primary + '10',
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
    },
    infoIcon: {
      width: 20,
      height: 20,
      color: theme.colors.primary,
      marginRight: isArabic ? 0 : 12,
      marginLeft: isArabic ? 12 : 0,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      fontSize: 12,
      color: theme.colors.primary,
      textAlign: isArabic ? 'right' : 'left',
      lineHeight: 18,
    },
  });

  const isButtonDisabled = loading || !nationalId || nationalId.length !== 10;

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={dynamicStyles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}>
          <ArrowLeft24Regular style={dynamicStyles.backIcon} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>
          {t('nafathLogin.header')}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.flex}
          contentContainerStyle={dynamicStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Logo Section */}
          <View style={dynamicStyles.logoSection}>
            <Text style={dynamicStyles.nafathTitle}>
              {t('nafathLogin.title')}
            </Text>
            <Text style={dynamicStyles.nafathSubtitle}>
              {t('nafathLogin.subtitle')}
            </Text>
          </View>

          {/* Main Login Card */}
          <View style={dynamicStyles.mainCard}>
            <Text style={dynamicStyles.sectionTitle}>
              {t('nafathLogin.sectionTitle')}
            </Text>
            <Text style={dynamicStyles.sectionDescription}>
              {t('nafathLogin.sectionDescription')}
            </Text>

            <Text style={dynamicStyles.inputLabel}>
              {t('nafathLogin.inputLabel')}
            </Text>

            <View
              ref={inputRef}
              style={[
                dynamicStyles.inputContainer,
                inputError && { borderColor: '#FF3B30' }
              ]}>
              <Person24Regular style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.textInput}
                placeholder={t('nafathLogin.inputPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={nationalId}
                onChangeText={handleNationalIdChange}
                onFocus={handleInputFocus}
                keyboardType="numeric"
                maxLength={10}
                autoFocus={true}
                returnKeyType="done"
              />
            </View>

            {/* Inline Error Message */}
            {inputError ? (
              <View style={dynamicStyles.errorContainer}>
                <Text style={dynamicStyles.errorText}>{inputError}</Text>
              </View>
            ) : null}

            {loading ? (
              <View style={dynamicStyles.loadingContainer}>
                <LoadingSpinner
                  type="rotating"
                  size={40}
                  color={theme.colors.primary}
                  duration={1000}
                />
                <Text
                  style={[
                    dynamicStyles.sectionDescription,
                    { textAlign: 'center', marginTop: 12 },
                  ]}>
                  {t('nafathLogin.connecting')}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  dynamicStyles.continueButton,
                  isButtonDisabled && dynamicStyles.disabledButton,
                ]}
                onPress={handleContinue}
                disabled={isButtonDisabled}
                activeOpacity={0.8}>
                <Text
                  style={[
                    dynamicStyles.buttonText,
                    isButtonDisabled && dynamicStyles.disabledButtonText,
                  ]}>
                  {t('nafathLogin.continueButton')}
                </Text>
              </TouchableOpacity>
            )}

            {/* Info Section */}
            <View style={dynamicStyles.infoSection}>
              <Info24Regular style={dynamicStyles.infoIcon} />
              <Text style={dynamicStyles.infoText}>
                {t('nafathLogin.infoMessage')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
