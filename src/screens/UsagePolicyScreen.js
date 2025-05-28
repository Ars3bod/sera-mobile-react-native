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
import {ArrowLeft24Regular} from '@fluentui/react-native-icons';

const UsagePolicyScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Function to convert numbers to Arabic-Indic digits
  const toArabicDigits = num => {
    if (!isRTL) return num.toString();
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/[0-9]/g, digit => arabicDigits[digit]);
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
        <Text style={dynamicStyles.headerTitle}>
          {t('policies.usagePolicy.title')}
        </Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Introduction */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.introduction')}
          </Text>
        </View>

        {/* Prohibited Activities */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.prohibitedActivities.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.prohibitedActivities.intro')}
          </Text>

          {/* Prohibited list */}
          {t('policies.usagePolicy.prohibitedActivities.list', {
            returnObjects: true,
          }).map((item, index) => (
            <View
              key={index}
              style={[
                styles.listItem,
                {flexDirection: isRTL ? 'row-reverse' : 'row'},
              ]}>
              <Text
                style={[
                  styles.listNumber,
                  {
                    color: theme.colors.primary,
                    marginRight: isRTL ? 0 : 8,
                    marginLeft: isRTL ? 8 : 0,
                  },
                ]}>
                {toArabicDigits(index + 1)}.
              </Text>
              <Text
                style={[
                  styles.listText,
                  {
                    color: theme.colors.textSecondary,
                    textAlign: isRTL ? 'right' : 'left',
                    flex: 1,
                  },
                ]}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Termination */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.termination.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.termination.content')}
          </Text>
        </View>

        {/* Links */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.links.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.links.content')}
          </Text>
        </View>

        {/* Intellectual Property */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.intellectualProperty.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.intellectualProperty.content')}
          </Text>
        </View>

        {/* Personal Information Protection */}
        <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.personalInfoProtection.title')}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.personalInfoProtection.content')}
          </Text>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {backgroundColor: theme.colors.primary + '10'},
          ]}>
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.primary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('policies.usagePolicy.lastUpdated')}
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
  listItem: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  listNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 20,
  },
  listText: {
    fontSize: 14,
    lineHeight: 20,
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

export default UsagePolicyScreen;
