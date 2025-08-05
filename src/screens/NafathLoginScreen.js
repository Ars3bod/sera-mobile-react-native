import React, { useState } from 'react';
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

  // Input validation handler to ensure only English digits (0-9) are entered
  const handleNationalIdChange = (text) => {
    // Check if user tried to input non-English digits
    const hasNonEnglishDigits = /[^0-9]/.test(text);

    if (hasNonEnglishDigits) {
      // Show error message for non-English digits
      setInputError(
        isArabic
          ? 'يرجى استخدام الأرقام الإنجليزية فقط (0-9)'
          : 'Please use English digits only (0-9)'
      );

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
        isArabic ? 'خطأ' : 'Error',
        isArabic
          ? 'يرجى إدخال رقم الهوية الوطنية'
          : 'Please enter your National ID',
      );
      return;
    }

    if (nationalId.length !== 10) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic
          ? 'رقم الهوية يجب أن يكون 10 أرقام'
          : 'National ID must be 10 digits',
      );
      return;
    }

    // Additional validation: ensure all characters are English digits
    if (!/^\d{10}$/.test(nationalId)) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic
          ? 'رقم الهوية يجب أن يحتوي على أرقام إنجليزية فقط'
          : 'National ID must contain only English digits',
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
        isArabic ? 'خطأ في الاتصال' : 'Connection Error',
        isArabic
          ? 'فشل في الاتصال بخدمة نفاذ'
          : 'Failed to connect to Nafath service',
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
          {isArabic ? 'تسجيل الدخول' : 'Login'}
        </Text>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={dynamicStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={dynamicStyles.logoSection}>
          <Text style={dynamicStyles.nafathTitle}>
            {isArabic ? 'نفاذ' : 'Nafath'}
          </Text>
          <Text style={dynamicStyles.nafathSubtitle}>
            {isArabic
              ? 'البوابة الرقمية الموحدة للخدمات الحكومية'
              : 'Unified Digital Gateway for Government Services'}
          </Text>
        </View>

        {/* Main Login Card */}
        <View style={dynamicStyles.mainCard}>
          <Text style={dynamicStyles.sectionTitle}>
            {isArabic ? 'تسجيل الدخول بنفاذ' : 'Login with Nafath'}
          </Text>
          <Text style={dynamicStyles.sectionDescription}>
            {isArabic
              ? 'أدخل رقم الهوية الوطنية للمتابعة بأمان'
              : 'Enter your National ID to continue securely'}
          </Text>

          <Text style={dynamicStyles.inputLabel}>
            {isArabic ? 'رقم الهوية الوطنية' : 'National ID Number'}
          </Text>

          <View style={[
            dynamicStyles.inputContainer,
            inputError && { borderColor: '#FF3B30' }
          ]}>
            <Person24Regular style={dynamicStyles.inputIcon} />
            <TextInput
              style={dynamicStyles.textInput}
              placeholder={
                isArabic ? 'أدخل رقم الهوية (10 أرقام)' : 'Enter ID (10 digits)'
              }
              placeholderTextColor={theme.colors.textSecondary}
              value={nationalId}
              onChangeText={handleNationalIdChange}
              keyboardType="numeric"
              maxLength={10}
              autoFocus={true}
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
                {isArabic ? 'جاري الاتصال بنفاذ...' : 'Connecting to Nafath...'}
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
                {isArabic ? 'متابعة' : 'Continue'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Info Section */}
          <View style={dynamicStyles.infoSection}>
            <Info24Regular style={dynamicStyles.infoIcon} />
            <Text style={dynamicStyles.infoText}>
              {isArabic
                ? 'ستحتاج إلى تطبيق نفاذ على هاتفك المحمول لإتمام عملية التحقق'
                : 'You will need the Nafath app on your mobile device to complete verification'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
