import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import StyleManager from '../styles/StyleManager';

export default function HomeScreen() {
  const {t} = useTranslation();
  const styles = StyleManager.getHomeScreenStyles();

  const mainCards = [
    {title: t('home.mainCards.consumer'), icon: '👥'},
    {title: t('home.mainCards.investor'), icon: '💼'},
    {title: t('home.mainCards.serviceProvider'), icon: '🛠️'},
  ];

  const infoCards = [
    {
      title: t('home.infoCards.rightsTitle'),
      desc: t('home.infoCards.rightsDesc'),
      icon: '✅',
    },
    {
      title: t('home.infoCards.compensationTitle'),
      desc: t('home.infoCards.compensationDesc'),
      icon: '💵',
    },
  ];

  const navTabs = [
    {label: t('home.tabs.main'), icon: '🏠'},
    {label: t('home.tabs.services'), icon: '📦'},
    {label: t('home.tabs.chat'), icon: '💬'},
    {label: t('home.tabs.more'), icon: '⋯'},
  ];
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerText}>{t('home.header')}</Text>
          <Text style={styles.subHeaderText}>{t('home.subHeader')}</Text>
          <View style={styles.mainCardsRow}>
            {mainCards.map((card, idx) => (
              <View key={card.title} style={styles.mainCard}>
                <Text style={styles.mainCardIcon}>{card.icon}</Text>
                <Text style={styles.mainCardText}>{card.title}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.sectionTitle}>{t('home.sectionTitle')}</Text>
          <Text style={styles.sectionDescription}>{t('home.sectionDesc')}</Text>
          {infoCards.map((card, idx) => (
            <View key={card.title} style={styles.infoCard}>
              <Text style={styles.infoCardIcon}>{card.icon}</Text>
              <View style={{flex: 1}}>
                <Text style={styles.infoCardTitle}>{card.title}</Text>
                <Text style={styles.secondaryText}>{card.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <SafeAreaView style={styles.navBarSafeArea} edges={['bottom']}>
          <View style={styles.navBar}>
            {navTabs.map((tab, idx) => (
              <TouchableOpacity key={tab.label} style={styles.navTab}>
                <Text style={styles.navIcon}>{tab.icon}</Text>
                <Text style={styles.navLabel}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
