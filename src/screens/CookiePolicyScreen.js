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
import { ArrowLeft24Regular } from '@fluentui/react-native-icons';

const CookiePolicyScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const isRTL = i18n.language === 'ar';

  const handleGoBack = () => {
    navigation.goBack();
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
      fontSize: 20,
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
        <Text style={dynamicStyles.headerTitle}>
          {t('policies.cookiePolicy.title')}
        </Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Introduction */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.introduction')}
          </Text>
        </View>

        {/* What are Cookies */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.whatAreCookies.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.whatAreCookies.content')}
          </Text>
        </View>

        {/* How we use Cookies */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.howWeUseCookies.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.howWeUseCookies.content')}
          </Text>
        </View>

        {/* Types of Cookies */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.typesOfCookies.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.typesOfCookies.content')}
          </Text>
        </View>

        {/* Managing Cookies */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.managingCookies.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.managingCookies.content')}
          </Text>
        </View>

        {/* Third Party Cookies */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.thirdPartyCookies.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.thirdPartyCookies.content')}
          </Text>
        </View>

        {/* Contact */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.contact.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.contact.content')}
          </Text>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { backgroundColor: theme.colors.primary + '10' },
          ]}>
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.primary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.cookiePolicy.lastUpdated')}
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
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default CookiePolicyScreen;
