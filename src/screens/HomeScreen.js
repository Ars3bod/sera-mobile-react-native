import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {
  People24Regular,
  Briefcase24Regular,
  Settings24Regular,
  CheckmarkCircle24Regular,
  Money24Regular,
  Home24Regular,
  Apps24Regular,
  Chat24Regular,
  MoreHorizontal24Regular,
} from '@fluentui/react-native-icons';

export default function HomeScreen({navigation}) {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  const mainCards = [
    {title: t('home.mainCards.consumer'), icon: People24Regular},
    {title: t('home.mainCards.investor'), icon: Briefcase24Regular},
    {title: t('home.mainCards.serviceProvider'), icon: Settings24Regular},
  ];

  const infoCards = [
    {
      title: t('home.infoCards.rightsTitle'),
      desc: t('home.infoCards.rightsDesc'),
      icon: CheckmarkCircle24Regular,
    },
    {
      title: t('home.infoCards.compensationTitle'),
      desc: t('home.infoCards.compensationDesc'),
      icon: Money24Regular,
    },
  ];

  const navTabs = [
    {
      label: t('home.tabs.main'),
      icon: Home24Regular,
      action: () => {},
      isActive: true,
    },
    {
      label: t('home.tabs.services'),
      icon: Apps24Regular,
      action: () => navigation.navigate('Services'),
      isActive: false,
    },
    {
      label: t('home.tabs.chat'),
      icon: Chat24Regular,
      action: () => {},
      isActive: false,
    },
    {
      label: t('home.tabs.more'),
      icon: MoreHorizontal24Regular,
      action: () => navigation.navigate('More'),
      isActive: false,
    },
  ];

  const dynamicStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 20,
    },
    headerText: {
      color: theme.colors.primary,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 8,
      marginTop: 12,
    },
    subHeaderText: {
      color: theme.colors.text,
      fontSize: 15,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 18,
      lineHeight: 22,
    },
    mainCardsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    mainCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      paddingVertical: 18,
      marginHorizontal: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    mainCardIcon: {
      color: theme.colors.primary,
      marginBottom: 8,
      width: 32,
      height: 32,
    },
    mainCardText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    sectionTitle: {
      color: theme.colors.primary,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 8,
      marginTop: 18,
    },
    sectionDescription: {
      color: theme.colors.text,
      fontSize: 15,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 16,
      lineHeight: 22,
    },
    infoCard: {
      flexDirection: isRTL ? 'row' : 'row-reverse',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    infoCardIcon: {
      color: theme.colors.primary,
      marginLeft: isRTL ? 0 : 12,
      marginRight: isRTL ? 12 : 0,
      width: 24,
      height: 24,
    },
    infoCardTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 4,
    },
    secondaryText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      textAlign: isRTL ? 'right' : 'left',
    },
    navBarSafeArea: {
      backgroundColor: theme.colors.surface,
    },
    navBar: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingVertical: 8,
    },
    navTab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 4,
    },
    navIcon: {
      marginBottom: 2,
      width: 20,
      height: 20,
    },
    navIconActive: {
      color: theme.colors.primary,
    },
    navIconInactive: {
      color: theme.colors.icon,
    },
    navLabel: {
      fontSize: 13,
      textAlign: 'center',
    },
    navLabelActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    navLabelInactive: {
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeArea} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={dynamicStyles.container}>
        <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>
          <Text style={dynamicStyles.headerText}>{t('home.header')}</Text>
          <Text style={dynamicStyles.subHeaderText}>{t('home.subHeader')}</Text>
          <View style={dynamicStyles.mainCardsRow}>
            {mainCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <View key={card.title} style={dynamicStyles.mainCard}>
                  <IconComponent style={dynamicStyles.mainCardIcon} />
                  <Text
                    style={[dynamicStyles.mainCardText, {textAlign: 'center'}]}
                    numberOfLines={2}>
                    {card.title}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={dynamicStyles.sectionTitle}>
            {t('home.sectionTitle')}
          </Text>
          <Text style={dynamicStyles.sectionDescription}>
            {t('home.sectionDesc')}
          </Text>
          {infoCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <View key={card.title} style={dynamicStyles.infoCard}>
                <IconComponent style={dynamicStyles.infoCardIcon} />
                <View style={{flex: 1}}>
                  <Text style={dynamicStyles.infoCardTitle}>{card.title}</Text>
                  <Text style={dynamicStyles.secondaryText}>{card.desc}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <SafeAreaView style={dynamicStyles.navBarSafeArea} edges={['bottom']}>
          <View style={dynamicStyles.navBar}>
            {navTabs.map((tab, idx) => {
              const IconComponent = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.label}
                  style={dynamicStyles.navTab}
                  onPress={tab.action}
                  activeOpacity={0.7}>
                  <IconComponent
                    style={[
                      dynamicStyles.navIcon,
                      tab.isActive
                        ? dynamicStyles.navIconActive
                        : dynamicStyles.navIconInactive,
                    ]}
                  />
                  <Text
                    style={[
                      dynamicStyles.navLabel,
                      tab.isActive
                        ? dynamicStyles.navLabelActive
                        : dynamicStyles.navLabelInactive,
                    ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
