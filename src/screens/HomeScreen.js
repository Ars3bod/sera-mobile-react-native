import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import {
  People24Regular,
  Briefcase24Regular,
  Settings24Regular,
  CheckmarkCircle24Regular,
  Money24Regular,
  Clock24Regular,
  Dismiss24Regular,
} from '@fluentui/react-native-icons';
import NavigationBar from '../components/NavigationBar';

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { isGuestMode } = useUser();
  const isRTL = i18n.language === 'ar';

  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleChatPress = () => {
    setShowComingSoonModal(true);
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
  };

  const mainCards = [
    { title: t('home.mainCards.consumer'), icon: People24Regular },
    { title: t('home.mainCards.investor'), icon: Briefcase24Regular },
    { title: t('home.mainCards.serviceProvider'), icon: Settings24Regular },
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
      shadowOffset: { width: 0, height: 2 },
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
      shadowOffset: { width: 0, height: 2 },
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

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxWidth: 320,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalIcon: {
      width: 32,
      height: 32,
      color: theme.colors.primary,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
      textAlign: isRTL ? 'right' : 'left',
    },
    closeButton: {
      padding: 4,
    },
    closeIcon: {
      width: 20,
      height: 20,
      color: theme.colors.textSecondary,
    },
    modalMessage: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 24,
    },
    modalButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
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
                    style={[dynamicStyles.mainCardText, { textAlign: 'center' }]}
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
                <View style={{ flex: 1 }}>
                  <Text style={dynamicStyles.infoCardTitle}>{card.title}</Text>
                  <Text style={dynamicStyles.secondaryText}>{card.desc}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        {/* Navigation Bar */}
        <NavigationBar
          navigation={navigation}
          activeTab="home"
          onComingSoon={handleChatPress}
          showComplaints={true}
        />
      </View>

      {/* Coming Soon Modal */}
      <Modal
        visible={showComingSoonModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={dynamicStyles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}>
          <TouchableOpacity
            style={dynamicStyles.modalContainer}
            activeOpacity={1}
            onPress={() => { }}>
            <View style={dynamicStyles.modalHeader}>
              <Clock24Regular style={dynamicStyles.modalIcon} />
              <Text style={dynamicStyles.modalTitle}>
                {t('home.comingSoon.title')}
              </Text>
              <TouchableOpacity
                style={dynamicStyles.closeButton}
                onPress={closeModal}
                activeOpacity={0.7}>
                <Dismiss24Regular style={dynamicStyles.closeIcon} />
              </TouchableOpacity>
            </View>
            <Text style={dynamicStyles.modalMessage}>
              {t('home.comingSoon.message')}
            </Text>
            <TouchableOpacity
              style={dynamicStyles.modalButton}
              onPress={closeModal}
              activeOpacity={0.8}>
              <Text style={dynamicStyles.modalButtonText}>
                {t('home.comingSoon.okButton')}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
