import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import StyleManager from '../styles/StyleManager';
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

export default function HomeScreen() {
  const {t} = useTranslation();
  const styles = StyleManager.getHomeScreenStyles();

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
    {label: t('home.tabs.main'), icon: Home24Regular},
    {label: t('home.tabs.services'), icon: Apps24Regular},
    {label: t('home.tabs.chat'), icon: Chat24Regular},
    {label: t('home.tabs.more'), icon: MoreHorizontal24Regular},
  ];
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerText}>{t('home.header')}</Text>
          <Text style={styles.subHeaderText}>{t('home.subHeader')}</Text>
          <View style={styles.mainCardsRow}>
            {mainCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <View key={card.title} style={styles.mainCard}>
                  <IconComponent style={styles.mainCardIcon} />
                  <Text style={styles.mainCardText}>{card.title}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.sectionTitle}>{t('home.sectionTitle')}</Text>
          <Text style={styles.sectionDescription}>{t('home.sectionDesc')}</Text>
          {infoCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <View key={card.title} style={styles.infoCard}>
                <IconComponent style={styles.infoCardIcon} />
                <View style={{flex: 1}}>
                  <Text style={styles.infoCardTitle}>{card.title}</Text>
                  <Text style={styles.secondaryText}>{card.desc}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <SafeAreaView style={styles.navBarSafeArea} edges={['bottom']}>
          <View style={styles.navBar}>
            {navTabs.map((tab, idx) => {
              const IconComponent = tab.icon;
              return (
                <TouchableOpacity key={tab.label} style={styles.navTab}>
                  <IconComponent style={styles.navIcon} />
                  <Text style={styles.navLabel}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
