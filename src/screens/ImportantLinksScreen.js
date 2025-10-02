import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import SafeContainer from '../components/SafeContainer';
import {
  ArrowLeft24Regular,
  Building24Regular,
  ServiceBell24Regular,
  DocumentText24Regular,
  ChevronRight24Regular,
  Globe24Regular,
} from '@fluentui/react-native-icons';

const ImportantLinksScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const isRTL = i18n.language === 'ar';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLinkPress = url => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
    });
  };

  const linkCategories = [
    {
      titleKey: 'importantLinks.government.title',
      icon: Building24Regular,
      color: '#4CAF50',
      links: [
        {
          labelKey: 'importantLinks.government.saudiGov',
          url: 'https://dga.gov.sa',
        },
        {
          labelKey: 'importantLinks.government.vision2030',
          url: 'https://www.vision2030.gov.sa',
        },
        {
          labelKey: 'importantLinks.government.nationalPortal',
          url: 'https://www.my.gov.sa',
        },
      ],
    },
    {
      titleKey: 'importantLinks.services.title',
      icon: ServiceBell24Regular,
      color: '#2196F3',
      links: [
        {
          labelKey: 'importantLinks.services.sec',
          url: 'https://www.se.com.sa',
        },
        {
          labelKey: 'importantLinks.services.waterElectricity',
          url: 'https://www.mewa.gov.sa',
        },
        {
          labelKey: 'importantLinks.services.energyEfficiency',
          url: 'https://www.seec.gov.sa',
        },
      ],
    },
    {
      titleKey: 'importantLinks.resources.title',
      icon: DocumentText24Regular,
      color: '#FF9800',
      links: [
        {
          labelKey: 'importantLinks.resources.regulations',
          url: 'https://sera.gov.sa/ar/systems-and-regulations/systems-and-regulations',
        },
        {
          labelKey: 'importantLinks.resources.reports',
          url: 'https://sera.gov.sa/ar/media-center/agency-publications',
        },
        {
          labelKey: 'importantLinks.resources.statistics',
          url: 'https://sera.gov.sa/ar/knowledge-center/data-and-statistics',
        },
      ],
    },
  ];

  const renderLinkItem = (link, categoryColor) => (
    <TouchableOpacity
      key={link.labelKey}
      style={[styles.linkItem, { backgroundColor: theme.colors.card }]}
      onPress={() => handleLinkPress(link.url)}
      activeOpacity={0.7}>
      <View
        style={[
          styles.linkContent,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}>
        <View
          style={[
            styles.linkIconContainer,
            {
              backgroundColor: categoryColor + '20',
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
            },
          ]}>
          <Globe24Regular style={[styles.linkIcon, { color: categoryColor }]} />
        </View>
        <View
          style={[
            styles.linkTextContainer,
            {
              marginRight: isRTL ? 12 : 12,
              marginLeft: isRTL ? 12 : 0,
            },
          ]}>
          <Text
            style={[
              styles.linkTitle,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.text,
              },
            ]}>
            {t(link.labelKey)}
          </Text>
          <Text
            style={[
              styles.linkUrl,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.textSecondary,
              },
            ]}>
            {link.url}
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

  const renderCategory = category => {
    const IconComponent = category.icon;
    return (
      <View key={category.titleKey} style={styles.categorySection}>
        <View
          style={[
            styles.categoryHeader,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}>
          <View
            style={[
              styles.categoryIconContainer,
              {
                backgroundColor: category.color + '20',
                marginRight: isRTL ? 0 : 16,
                marginLeft: isRTL ? 16 : 0,
              },
            ]}>
            <IconComponent
              style={[styles.categoryIcon, { color: category.color }]}
            />
          </View>
          <Text
            style={[
              styles.categoryTitle,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.text,
              },
            ]}>
            {t(category.titleKey)}
          </Text>
        </View>
        <View style={styles.linksContainer}>
          {category.links.map(link => renderLinkItem(link, category.color))}
        </View>
      </View>
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
        <Text style={dynamicStyles.headerTitle}>
          {t('importantLinks.title')}
        </Text>
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
            {isRTL
              ? 'وصول سريع إلى المواقع والمصادر الحكومية المهمة ذات الصلة بقطاع الكهرباء.'
              : 'Quick access to important government websites and resources related to the electricity sector.'}
          </Text>
        </View>

        {/* Categories */}
        {linkCategories.map(renderCategory)}

        {/* Disclaimer */}
        <View
          style={[styles.disclaimerCard, { backgroundColor: theme.colors.card }]}>
          <Text
            style={[
              styles.disclaimerTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {isRTL ? 'تنبيه' : 'Disclaimer'}
          </Text>
          <Text
            style={[
              styles.disclaimerText,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {isRTL
              ? 'هذه الروابط تؤدي إلى مواقع خارجية. الهيئة السعودية لتنظيم الكهرباء غير مسؤولة عن محتوى هذه المواقع.'
              : 'These links lead to external websites. SERA is not responsible for the content of these websites.'}
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
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 24,
    height: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  linksContainer: {
    gap: 8,
  },
  linkItem: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  linkContent: {
    alignItems: 'center',
  },
  linkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkIcon: {
    width: 20,
    height: 20,
  },
  linkTextContainer: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  linkUrl: {
    fontSize: 12,
    opacity: 0.8,
  },
  chevronIcon: {
    width: 16,
    height: 16,
  },
  disclaimerCard: {
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ImportantLinksScreen;
