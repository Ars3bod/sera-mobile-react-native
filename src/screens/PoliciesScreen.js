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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import SafeContainer from '../components/SafeContainer';

// Simple icon components as fallback
const ArrowLeftIcon = ({ style, ...props }) => (
  <Text style={[{ fontSize: 20, color: '#007AFF' }, style]} {...props}>
    ←
  </Text>
);

const ChevronRightIcon = ({ style, ...props }) => (
  <Text style={[{ fontSize: 16, color: '#999' }, style]} {...props}>
    →
  </Text>
);

const ShieldIcon = ({ style, ...props }) => (
  <Text style={[{ fontSize: 20 }, style]} {...props}>
    🛡️
  </Text>
);

const DocumentIcon = ({ style, ...props }) => (
  <Text style={[{ fontSize: 20 }, style]} {...props}>
    📄
  </Text>
);

const LockIcon = ({ style, ...props }) => (
  <Text style={[{ fontSize: 20 }, style]} {...props}>
    🔒
  </Text>
);

const GlobeIcon = ({ style, ...props }) => (
  <Text style={[{ fontSize: 20 }, style]} {...props}>
    🌐
  </Text>
);

// Try to import FluentUI icons, fallback to simple icons
let ArrowLeft24Regular,
  Shield24Regular,
  Document24Regular,
  Lock24Regular,
  Globe24Regular,
  ChevronRight24Regular;

try {
  const FluentIcons = require('@fluentui/react-native-icons');
  ArrowLeft24Regular = FluentIcons.ArrowLeft24Regular || ArrowLeftIcon;
  Shield24Regular = FluentIcons.Shield24Regular || ShieldIcon;
  Document24Regular = FluentIcons.Document24Regular || DocumentIcon;
  Lock24Regular = FluentIcons.Lock24Regular || LockIcon;
  Globe24Regular = FluentIcons.Globe24Regular || GlobeIcon;
  ChevronRight24Regular = FluentIcons.ChevronRight24Regular || ChevronRightIcon;
} catch (error) {
  console.warn('FluentUI icons not available, using emoji fallback');
  ArrowLeft24Regular = ArrowLeftIcon;
  Shield24Regular = ShieldIcon;
  Document24Regular = DocumentIcon;
  Lock24Regular = LockIcon;
  Globe24Regular = GlobeIcon;
  ChevronRight24Regular = ChevronRightIcon;
}

const PoliciesScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const isRTL = i18n.language === 'ar';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const policies = [
    {
      titleKey: 'policies.usagePolicy.title',
      descriptionKey: 'policies.termsOfService.description',
      icon: Document24Regular,
      color: '#2196F3',
      onPress: () => {
        navigation.navigate('UsagePolicy');
      },
    },
    {
      titleKey: 'policies.privacyPolicy.title',
      descriptionKey: 'policies.privacyPolicy.description',
      icon: Shield24Regular,
      color: '#4CAF50',
      onPress: () => {
        navigation.navigate('PrivacyPolicy');
      },
    },
    {
      titleKey: 'policies.dataProtection.title',
      descriptionKey: 'policies.dataProtection.description',
      icon: Lock24Regular,
      color: '#FF9800',
      onPress: () => {
        navigation.navigate('DataProtection');
      },
    },
    {
      titleKey: 'policies.cookiePolicy.title',
      descriptionKey: 'policies.cookiePolicy.description',
      icon: Globe24Regular,
      color: '#9C27B0',
      onPress: () => {
        navigation.navigate('CookiePolicy');
      },
    },
  ];

  const renderPolicyItem = policy => {
    const IconComponent = policy.icon;
    return (
      <TouchableOpacity
        key={policy.titleKey}
        style={[styles.policyItem, { backgroundColor: theme.colors.card }]}
        onPress={policy.onPress}
        activeOpacity={0.7}>
        <View
          style={[
            styles.policyContent,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: policy.color + '20',
                marginRight: isRTL ? 0 : 16,
                marginLeft: isRTL ? 16 : 0,
              },
            ]}>
            <IconComponent style={[styles.policyIcon, { color: policy.color }]} />
          </View>
          <View
            style={[
              styles.textContainer,
              {
                marginRight: isRTL ? 12 : 12,
                marginLeft: isRTL ? 12 : 0,
              },
            ]}>
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
                transform: [{ scaleX: isRTL ? -1 : 1 }],
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
            { backgroundColor: theme.colors.primary + '10' },
          ]}>
          <Text
            style={[
              styles.introText,
              {
                color: theme.colors.primary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.introText')}
          </Text>
        </View>

        {/* Policies List */}
        <View style={styles.policiesContainer}>
          {policies.map(renderPolicyItem)}
        </View>

        {/* Footer Note */}
        <View style={[styles.footerCard, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.footerTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.footerTitle')}
          </Text>
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.footerText')}
          </Text>
        </View>
      </ScrollView>
    </SafeContainer>
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  policyIcon: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
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
