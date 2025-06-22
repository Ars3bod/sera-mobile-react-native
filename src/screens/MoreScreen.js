import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft24Regular,
  Settings24Regular,
  Info24Regular,
  Phone24Regular,
  News24Regular,
  Shield24Regular,
  QuestionCircle24Regular,
  Link24Regular,
  ChevronRight24Regular,
  Person24Regular,
  Money24Regular,
  Flash24Regular,
} from '@fluentui/react-native-icons';

const MoreScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const isRTL = i18n.language === 'ar';

  const menuSections = [
    {
      id: 'aboutSera',
      titleKey: 'more.sections.aboutSera',
      items: [
        {
          id: 2,
          titleKey: 'more.aboutUs.title',
          descriptionKey: 'more.aboutUs.description',
          icon: Info24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('About');
          },
        },
        {
          id: 3,
          titleKey: 'more.contactUs.title',
          descriptionKey: 'more.contactUs.description',
          icon: Phone24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('Contact');
          },
        },
        {
          id: 4,
          titleKey: 'more.news.title',
          descriptionKey: 'more.news.description',
          icon: News24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('News');
          },
        },
        {
          id: 6,
          titleKey: 'more.faq.title',
          descriptionKey: 'more.faq.description',
          icon: QuestionCircle24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('FAQ');
          },
        },
        {
          id: 7,
          titleKey: 'more.importantLinks.title',
          descriptionKey: 'more.importantLinks.description',
          icon: Link24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('ImportantLinks');
          },
        },
        {
          id: 8,
          titleKey: 'more.compensationStandards.title',
          descriptionKey: 'more.compensationStandards.description',
          icon: Money24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('CompensationStandards');
          },
        },
        {
          id: 9,
          titleKey: 'more.consumptionTariff.title',
          descriptionKey: 'more.consumptionTariff.description',
          icon: Flash24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('ConsumptionTariff');
          },
        },
      ],
    },
    {
      id: 'legalAgreements',
      titleKey: 'more.sections.legalAgreements',
      items: [
        {
          id: 5,
          titleKey: 'more.policies.title',
          descriptionKey: 'more.policies.description',
          icon: Shield24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('Policies');
          },
        },
      ],
    },
    {
      id: 'appSettings',
      titleKey: 'more.sections.appSettings',
      items: [
        // {
        //   id: 0,
        //   titleKey: 'more.profile.title',
        //   descriptionKey: 'more.profile.description',
        //   icon: Person24Regular,
        //   color: theme.colors.primary,
        //   onPress: () => {
        //     navigation.navigate('Profile');
        //   },
        // },
        {
          id: 1,
          titleKey: 'more.settings.title',
          descriptionKey: 'more.settings.description',
          icon: Settings24Regular,
          color: theme.colors.primary,
          onPress: () => {
            navigation.navigate('Settings');
          },
        },
      ],
    },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderMenuItem = item => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.menuItem,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            backgroundColor: theme.colors.card,
          },
        ]}
        onPress={item.onPress}
        activeOpacity={0.7}>
        <View
          style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
          <IconComponent style={[styles.menuIcon, { color: item.color }]} />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.menuTitle,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.text,
              },
            ]}>
            {t(item.titleKey)}
          </Text>
          <Text
            style={[
              styles.menuDescription,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.textSecondary,
              },
            ]}>
            {t(item.descriptionKey)}
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
      </TouchableOpacity>
    );
  };

  const renderSection = section => {
    return (
      <View key={section.id} style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              textAlign: isRTL ? 'right' : 'left',
              color: theme.colors.textSecondary,
            },
          ]}>
          {t(section.titleKey)}
        </Text>
        <View style={styles.sectionItems}>
          {section.items.map(item => renderMenuItem(item))}
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
        <Text style={dynamicStyles.headerTitle}>{t('more.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Menu Sections */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {menuSections.map((section, index) => (
          <React.Fragment key={section.id}>
            {renderSection(section)}
            {index < menuSections.length - 1 && (
              <View
                style={[styles.divider, { backgroundColor: theme.colors.border }]}
              />
            )}
          </React.Fragment>
        ))}
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
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionItems: {
    gap: 12,
  },
  divider: {
    height: 1,
    marginVertical: 20,
    marginHorizontal: 16,
  },
  menuItem: {
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    marginLeft: 0,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
});

export default MoreScreen;
