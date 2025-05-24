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
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {
  DocumentText24Regular,
  People24Regular,
  Certificate24Regular,
  Share24Regular,
  FolderOpen24Regular,
  ArrowLeft24Regular,
} from '@fluentui/react-native-icons';

const ServicesScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

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
    // You can add navigation logic here
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
        <View style={styles.cardContent}>
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
          <ArrowLeft24Regular style={[dynamicStyles.backIcon]} />
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
    alignItems: 'flex-start',
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
