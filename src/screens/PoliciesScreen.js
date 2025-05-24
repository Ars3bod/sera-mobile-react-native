import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {
  ArrowLeft24Regular,
  Shield24Regular,
  Document24Regular,
  Lock24Regular,
  Globe24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-native-icons';

const PoliciesScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const policies = [
    {
      titleKey: 'policies.privacyPolicy.title',
      descriptionKey: 'policies.privacyPolicy.description',
      icon: Shield24Regular,
      color: '#4CAF50',
      onPress: () => {
        // Navigate to privacy policy detail
        console.log('Privacy Policy pressed');
      },
    },
    {
      titleKey: 'policies.termsOfService.title',
      descriptionKey: 'policies.termsOfService.description',
      icon: Document24Regular,
      color: '#2196F3',
      onPress: () => {
        // Navigate to terms of service detail
        console.log('Terms of Service pressed');
      },
    },
    {
      titleKey: 'policies.dataProtection.title',
      descriptionKey: 'policies.dataProtection.description',
      icon: Lock24Regular,
      color: '#FF9800',
      onPress: () => {
        // Navigate to data protection detail
        console.log('Data Protection pressed');
      },
    },
    {
      titleKey: 'policies.cookiePolicy.title',
      descriptionKey: 'policies.cookiePolicy.description',
      icon: Globe24Regular,
      color: '#9C27B0',
      onPress: () => {
        // Navigate to cookie policy detail
        console.log('Cookie Policy pressed');
      },
    },
  ];

  const renderPolicyItem = policy => {
    const IconComponent = policy.icon;
    return (
      <TouchableOpacity
        key={policy.titleKey}
        style={[styles.policyItem, {backgroundColor: theme.colors.card}]}
        onPress={policy.onPress}
        activeOpacity={0.7}>
        <View style={styles.policyContent}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: policy.color + '20'},
            ]}>
            <IconComponent style={[styles.policyIcon, {color: policy.color}]} />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.policyTitle,
                {
                  textAlign: isRTL ? 'right' : 'left',
                  color: theme.colors.text,
                },
              ]}>
              {t(policy.titleKey)}
            </Text>
            <Text
              style={[
                styles.policyDescription,
                {
                  textAlign: isRTL ? 'right' : 'left',
                  color: theme.colors.textSecondary,
                },
              ]}
              numberOfLines={2}>
              {t(policy.descriptionKey)}
            </Text>
          </View>
          <ChevronRight24Regular
            style={[
              styles.chevronIcon,
              {
                transform: [{scaleX: isRTL ? -1 : 1}],
                color: theme.colors.icon,
              },
            ]}
          />
        </View>
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
        <Text style={dynamicStyles.headerTitle}>{t('policies.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Introduction */}
        <View
          style={[
            styles.introCard,
            {backgroundColor: theme.colors.primary + '10'},
          ]}>
          <Text
            style={[
              styles.introText,
              {
                color: theme.colors.primary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {isRTL
              ? 'نلتزم بحماية خصوصيتك وأمان بياناتك. تعرف على سياساتنا وشروط استخدام خدماتنا.'
              : 'We are committed to protecting your privacy and data security. Learn about our policies and terms of service.'}
          </Text>
        </View>

        {/* Policies List */}
        <View style={styles.policiesContainer}>
          {policies.map(renderPolicyItem)}
        </View>

        {/* Footer Note */}
        <View style={[styles.footerCard, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.footerTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {isRTL ? 'ملاحظة مهمة' : 'Important Note'}
          </Text>
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {isRTL
              ? 'آخر تحديث لهذه السياسات كان في يناير 2024. نوصي بمراجعة هذه السياسات بانتظام للبقاء على اطلاع بأي تغييرات.'
              : 'These policies were last updated in January 2024. We recommend reviewing these policies regularly to stay informed of any changes.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  placeholderView: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  introCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  policiesContainer: {
    marginBottom: 24,
  },
  policyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  policyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  policyIcon: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  policyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  footerCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PoliciesScreen;
