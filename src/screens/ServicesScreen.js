import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {
  DocumentText24Regular,
  People24Regular,
  Certificate24Regular,
  Share24Regular,
  FolderOpen24Regular,
  ArrowLeft24Regular,
  Clock24Regular,
  Dismiss24Regular,
} from '@fluentui/react-native-icons';

const ServicesScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleComingSoon = () => {
    setShowComingSoonModal(true);
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
  };

  const services = [
    {
      id: 1,
      titleKey: 'services.permitRequest.title',
      descriptionKey: 'services.permitRequest.description',
      icon: DocumentText24Regular,
      color: theme.colors.primary,
    },
    {
      id: 2,
      titleKey: 'services.complaints.title',
      descriptionKey: 'services.complaints.description',
      icon: People24Regular,
      color: theme.colors.primary,
    },
    {
      id: 3,
      titleKey: 'services.licenseIssuance.title',
      descriptionKey: 'services.licenseIssuance.description',
      icon: Certificate24Regular,
      color: theme.colors.primary,
    },
    {
      id: 4,
      titleKey: 'services.dataSharing.title',
      descriptionKey: 'services.dataSharing.description',
      icon: Share24Regular,
      color: theme.colors.primary,
    },
    {
      id: 5,
      titleKey: 'services.freedomOfInformation.title',
      descriptionKey: 'services.freedomOfInformation.description',
      icon: FolderOpen24Regular,
      color: theme.colors.primary,
    },
  ];

  const handleServicePress = service => {
    // Navigate to specific service screen or handle service action
    console.log('Service pressed:', t(service.titleKey));

    // Handle complaints service specifically
    if (service.id === 2) {
      // Complaints service
      navigation.navigate('Complaints');
      return;
    }

    // Handle permit request service specifically
    if (service.id === 1) {
      // Permit Request service
      navigation.navigate('Permits');
      return;
    }

    // Handle Data Sharing service (id: 4)
    if (service.id === 4) {
      handleComingSoon();
      return;
    }

    // Handle Freedom of Information service (id: 5)
    if (service.id === 5) {
      handleComingSoon();
      return;
    }

    // For other services, you can add navigation logic here
    // navigation.navigate('ServiceDetail', { service });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // const toggleLanguage = () => {
  //   const newLanguage = i18n.language === 'ar' ? 'en' : 'ar';
  //   i18n.changeLanguage(newLanguage);
  // };

  const renderServiceCard = service => {
    const IconComponent = service.icon;
    return (
      <TouchableOpacity
        key={service.id}
        style={[styles.serviceCard, {backgroundColor: theme.colors.card}]}
        onPress={() => handleServicePress(service)}
        activeOpacity={0.7}>
        <View
          style={[
            styles.cardContent,
            {alignItems: isRTL ? 'flex-end' : 'flex-start'},
          ]}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: service.color + '20'},
            ]}>
            <IconComponent
              style={[styles.serviceIcon, {color: service.color}]}
            />
          </View>
          <Text
            style={[
              styles.serviceTitle,
              {textAlign: isRTL ? 'right' : 'left', color: theme.colors.text},
            ]}>
            {t(service.titleKey)}
          </Text>
          <Text
            style={[
              styles.serviceDescription,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.textSecondary,
              },
            ]}
            numberOfLines={3}>
            {t(service.descriptionKey)}
          </Text>
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
        <Text style={dynamicStyles.headerTitle}>{t('services.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Services Grid */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.servicesGrid}>
          {services.map((service, index) => {
            if (index === services.length - 1 && services.length % 2 !== 0) {
              // Last item if odd number of services - align based on language direction
              return (
                <View
                  key={service.id}
                  style={[
                    styles.fullWidthCardContainer,
                    {alignItems: isRTL ? 'flex-end' : 'flex-start'},
                  ]}>
                  {renderServiceCard(service)}
                </View>
              );
            }
            return renderServiceCard(service);
          })}
        </View>
      </ScrollView>

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
            onPress={() => {}}>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
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
  fullWidthCardContainer: {
    width: '100%',
  },
  cardContent: {
    padding: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 24,
    height: 24,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'stretch',
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    alignSelf: 'stretch',
  },
});

export default ServicesScreen;
