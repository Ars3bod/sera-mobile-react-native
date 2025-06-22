import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { pollNafathStatus, loginNafath } from '../services/nafathService';
import { LoadingSpinner } from '../animations';
import DeepLinkService from '../services/deepLinkService';
import {
  ArrowLeft24Regular,
  Shield24Regular,
  Clock24Regular,
  Phone24Regular,
  Refresh24Regular,
  Info24Regular,
  CheckmarkCircle24Regular,
} from '@fluentui/react-native-icons';

const { width, height } = Dimensions.get('window');

export default function NafathVerificationScreen({ route, navigation }) {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const userContext = useUser();
  const isArabic = i18n.language === 'ar';

  const {
    transId: initialTransId,
    random: initialRandom,
    nationalId,
  } = route.params;

  const [transId, setTransId] = useState(initialTransId);
  const [random, setRandom] = useState(initialRandom);
  const [remaining, setRemaining] = useState(120); // 2 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef();
  const pollingRef = useRef(true);

  const handleGoBack = () => {
    pollingRef.current = false;
    navigation.goBack();
  };

  // Timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Polling logic with UserContext integration
  const startPolling = useCallback(() => {
    pollingRef.current = true;
    setLoading(true);
    setError(null);

    async function poll() {
      try {
        await pollNafathStatus(
          transId,
          random,
          nationalId,
          () => pollingRef.current,
          authData => {
            console.log('Authentication successful with data:', authData);

            // Check if contact validation was successful
            if (authData.contactValidation?.success) {
              console.log('Contact validation completed successfully');
            }

            setLoading(false);
            navigation.replace('Home');
          },
          userContext, // Pass user context for data storage and validation
        );
      } catch (e) {
        console.error('Polling error:', e);
        setError(isArabic ? 'فشل في التحقق' : 'Verification failed');
        setLoading(false);
        setCanResend(true);
      }
    }

    poll();
  }, [transId, random, nationalId, navigation, isArabic, userContext]);

  useEffect(() => {
    startPolling();
    return () => {
      pollingRef.current = false;
    };
  }, [startPolling]);

  // Timer expiration
  useEffect(() => {
    if (remaining <= 0) {
      setError(isArabic ? 'انتهت المهلة الزمنية' : 'Time expired');
      setLoading(false);
      setCanResend(true);
      clearInterval(timerRef.current);
    }
  }, [remaining, isArabic]);

  // Resend Request logic
  const handleResend = async () => {
    if (!canResend || !nationalId) return;
    setLoading(true);
    setError(null);
    setCanResend(false);
    setRemaining(120);
    pollingRef.current = false;

    try {
      const res = await loginNafath(nationalId);
      setTransId(res.transId);
      setRandom(res.random);
      pollingRef.current = true;
      startPolling();

      // Restart timer
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRemaining(prev => prev - 1);
      }, 1000);
    } catch (e) {
      console.error('Resend error:', e);
      setError(isArabic ? 'فشل في إعادة الإرسال' : 'Resend failed');
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const openNafathApp = async () => {
    try {
      const params = {
        transId: transId,
        random: random,
        nationalId: nationalId,
      };

      await DeepLinkService.openNafathApp({
        showAlerts: false,
        params: params,
      });
    } catch (error) {
      console.error('Error opening Nafath app:', error);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (loading) {
      return isArabic ? 'في انتظار التحقق...' : 'Waiting for verification...';
    }
    if (error) {
      return error;
    }
    return isArabic ? 'جاري المعالجة...' : 'Processing...';
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
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    nafathSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
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
    stepIndicator: {
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 24,
      padding: 16,
      backgroundColor: theme.colors.primary + '10',
      borderRadius: 12,
    },
    stepIcon: {
      width: 24,
      height: 24,
      color: theme.colors.primary,
      marginRight: isArabic ? 0 : 12,
      marginLeft: isArabic ? 12 : 0,
    },
    stepText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      textAlign: isArabic ? 'right' : 'left',
    },
    verificationTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: isArabic ? 'right' : 'left',
    },
    verificationDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 24,
      textAlign: isArabic ? 'right' : 'left',
      lineHeight: 20,
    },
    randomCodeSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    randomCodeLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textAlign: 'center',
    },
    randomCodeBox: {
      backgroundColor: theme.colors.primary + '15',
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 32,
      borderWidth: 2,
      borderColor: theme.colors.primary + '30',
      marginBottom: 12,
    },
    randomCodeText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      letterSpacing: 4,
    },
    timerSection: {
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      padding: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
    },
    timerIcon: {
      width: 20,
      height: 20,
      color: theme.colors.textSecondary,
      marginRight: isArabic ? 0 : 8,
      marginLeft: isArabic ? 8 : 0,
    },
    timerText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '600',
    },
    statusSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    statusText: {
      fontSize: 14,
      color: loading
        ? theme.colors.primary
        : error
          ? theme.colors.error
          : theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    resendButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    resendButtonDisabled: {
      opacity: 0.5,
    },
    resendIcon: {
      width: 16,
      height: 16,
      color: theme.colors.primary,
      marginRight: isArabic ? 0 : 6,
      marginLeft: isArabic ? 6 : 0,
    },
    resendText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    openAppButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      marginTop: 24,
      marginBottom: 20,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
      flexDirection: isArabic ? 'row-reverse' : 'row',
      justifyContent: 'center',
    },
    openAppIcon: {
      width: 20,
      height: 20,
      color: theme.colors.textInverse,
      marginRight: isArabic ? 0 : 8,
      marginLeft: isArabic ? 8 : 0,
    },
    openAppText: {
      color: theme.colors.textInverse,
      fontSize: 18,
      fontWeight: 'bold',
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
          {isArabic ? 'التحقق من الهوية' : 'Identity Verification'}
        </Text>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={dynamicStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        {/* <View style={dynamicStyles.logoSection}>
          <Text style={dynamicStyles.nafathTitle}>
            {isArabic ? 'نفاذ' : 'Nafath'}
          </Text>
          <Text style={dynamicStyles.nafathSubtitle}>
            {isArabic ? 'التحقق من الهوية' : 'Identity Verification'}
          </Text>
        </View> */}

        {/* Main Verification Card */}
        <View style={dynamicStyles.mainCard}>
          {/* Step Indicator */}
          <View style={dynamicStyles.stepIndicator}>
            <Shield24Regular style={dynamicStyles.stepIcon} />
            <Text style={dynamicStyles.stepText}>
              {isArabic
                ? 'الخطوة 2: التحقق من الهوية'
                : 'Step 2: Identity Verification'}
            </Text>
          </View>

          <Text style={dynamicStyles.verificationTitle}>
            {isArabic
              ? 'اكمل التحقق في تطبيق نفاذ'
              : 'Complete verification in Nafath app'}
          </Text>

          <Text style={dynamicStyles.verificationDescription}>
            {isArabic
              ? 'افتح تطبيق نفاذ على هاتفك وأدخل الرقم التالي للمتابعة'
              : 'Open Nafath app on your phone and enter the following number to continue'}
          </Text>

          {/* Random Code Section */}
          <View style={dynamicStyles.randomCodeSection}>
            <Text style={dynamicStyles.randomCodeLabel}>
              {isArabic ? 'رقم التحقق' : 'Verification Number'}
            </Text>
            <View style={dynamicStyles.randomCodeBox}>
              <Text style={dynamicStyles.randomCodeText}>{random}</Text>
            </View>
          </View>

          {/* Timer Section */}
          <View style={dynamicStyles.timerSection}>
            <Clock24Regular style={dynamicStyles.timerIcon} />
            <Text style={dynamicStyles.timerText}>
              {isArabic ? 'الوقت المتبقي: ' : 'Time remaining: '}
              {formatTime(remaining)}
            </Text>
          </View>

          {/* Status Section */}
          <View style={dynamicStyles.statusSection}>
            <Text style={dynamicStyles.statusText}>{getStatusMessage()}</Text>

            {loading && (
              <View style={dynamicStyles.loadingContainer}>
                <LoadingSpinner
                  type="rotating"
                  size={32}
                  color={theme.colors.primary}
                  duration={1000}
                />
              </View>
            )}

            {canResend && (
              <TouchableOpacity
                style={[
                  dynamicStyles.resendButton,
                  !canResend && dynamicStyles.resendButtonDisabled,
                ]}
                onPress={handleResend}
                disabled={!canResend}
                activeOpacity={0.7}>
                <Refresh24Regular style={dynamicStyles.resendIcon} />
                <Text style={dynamicStyles.resendText}>
                  {isArabic ? 'إعادة الإرسال' : 'Resend Request'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Info Section */}
          <View style={dynamicStyles.infoSection}>
            <Info24Regular style={dynamicStyles.infoIcon} />
            <Text style={dynamicStyles.infoText}>
              {isArabic
                ? 'تأكد من أن تطبيق نفاذ مثبت ومُفعل على هاتفك المحمول'
                : 'Make sure Nafath app is installed and activated on your mobile device'}
            </Text>
          </View>
        </View>

        {/* Open App Button */}
        <TouchableOpacity
          style={dynamicStyles.openAppButton}
          onPress={openNafathApp}
          activeOpacity={0.8}>
          <Phone24Regular style={dynamicStyles.openAppIcon} />
          <Text style={dynamicStyles.openAppText}>
            {isArabic ? 'فتح تطبيق نفاذ' : 'Open Nafath App'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
