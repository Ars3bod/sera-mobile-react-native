import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  ToastAndroid,
  Platform,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useSession } from '../context/SessionManager';
import SafeContainer from '../components/SafeContainer';
import {
  DocumentText24Regular,
  People24Regular,
  Certificate24Regular,
  Share24Regular,
  FolderOpen24Regular,
  Clock24Regular,
  Dismiss24Regular,
} from '@fluentui/react-native-icons';
import NavigationBar from '../components/NavigationBar';
import SessionWrapper from '../components/SessionWrapper';
import SessionStatus from '../components/SessionStatus';
import LoginRequiredModal from '../components/LoginRequiredModal';

/**
 * ServicesScreen Component
 * 
 * Features:
 * - Navigation Restrictions: Prevents users from navigating back to pre-login screens
 *   (Splash, Login, NafathLogin, NafathVerification) using hardware back button or gestures
 * - Hardware Back Button Handling: Custom logic for Android back button behavior
 * - Authentication-aware Navigation: Different behavior for authenticated vs guest users
 * - i18n Support: Multilingual navigation restriction messages
 */
const ServicesScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { isAuthenticated, isGuestMode } = useUser();
  const { updateActivity } = useSession();
  const isRTL = i18n.language === 'ar';
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Define pre-login screens that users shouldn't navigate back to
  const preLoginScreens = ['Splash', 'Login', 'NafathLogin', 'NafathVerification'];

  // Navigation restriction effect
  useEffect(() => {
    // Handle hardware back button on Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Handle navigation events to prevent going back to pre-login screens
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Get the route we're trying to navigate to
      const targetRoute = e.data?.action?.payload?.name || e.data?.action?.target;

      // If trying to navigate to a pre-login screen, prevent it
      if (targetRoute && preLoginScreens.includes(targetRoute)) {
        // Prevent default behavior
        e.preventDefault();

        // Show a message or handle appropriately
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            t('navigation.restrictedMessage'),
            ToastAndroid.SHORT
          );
        }

        // Optionally navigate to a safe screen instead
        // navigation.navigate('Home'); // Uncomment if you want to redirect

        return;
      }
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation, isRTL, t]);

  // Handle hardware back button press
  const handleBackPress = () => {
    // Get current navigation state
    const state = navigation.getState();
    const currentRouteIndex = state.index;
    const routes = state.routes;

    // Check if there's a previous route and if it's a pre-login screen
    if (currentRouteIndex > 0) {
      const previousRoute = routes[currentRouteIndex - 1];

      if (preLoginScreens.includes(previousRoute.name)) {
        // Prevent going back to pre-login screens
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            t('navigation.restrictedMessage'),
            ToastAndroid.SHORT
          );
        }
        return true; // Prevent default back behavior
      }
    }

    // If we're at the first screen or it's safe to go back, check authentication
    if (currentRouteIndex === 0 || routes.length === 1) {
      // If user is authenticated or in guest mode, prevent app exit
      if (isAuthenticated || isGuestMode) {
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            t('navigation.exitAppMessage'),
            ToastAndroid.SHORT
          );
        }

        // You could implement double-tap to exit here if needed
        return true; // Prevent default back behavior for now
      }
    }

    return false; // Allow default back behavior
  };

  const handleComingSoon = () => {
    setShowComingSoonModal(true);
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleServiceLongPress = (service) => {
    setSelectedService(service);
    setShowDescriptionModal(true);
  };

  const closeDescriptionModal = () => {
    setShowDescriptionModal(false);
    setSelectedService(null);
  };

  const handleLoginPress = () => {
    setShowLoginModal(false);
    navigation.navigate('NafathLogin', { fromModal: true });
  };

  const showLoginPrompt = () => {
    setShowLoginModal(true);
  };

  const handleComingSoonChat = () => {
    setShowComingSoonModal(true);
  };

  const services = [
    {
      id: 2,
      titleKey: 'services.complaints.title',
      descriptionKey: 'services.complaints.description',
      detailedDescriptionKey: 'services.complaints.detailedDescription',
      icon: People24Regular,
      color: theme.colors.primary,
      isAvailable: true,
    },
    {
      id: 1,
      titleKey: 'services.permitRequest.title',
      descriptionKey: 'services.permitRequest.description',
      detailedDescriptionKey: 'services.permitRequest.detailedDescription',
      icon: DocumentText24Regular,
      color: theme.colors.primary,
      isAvailable: false,
    },
    {
      id: 3,
      titleKey: 'services.licenseIssuance.title',
      descriptionKey: 'services.licenseIssuance.description',
      detailedDescriptionKey: 'services.licenseIssuance.detailedDescription',
      icon: Certificate24Regular,
      color: theme.colors.primary,
      isAvailable: false, // Coming soon
    },
    {
      id: 4,
      titleKey: 'services.dataSharing.title',
      descriptionKey: 'services.dataSharing.description',
      detailedDescriptionKey: 'services.dataSharing.detailedDescription',
      icon: Share24Regular,
      color: theme.colors.primary,
      isAvailable: false, // Coming soon
    },
    {
      id: 5,
      titleKey: 'services.freedomOfInformation.title',
      descriptionKey: 'services.freedomOfInformation.description',
      detailedDescriptionKey: 'services.freedomOfInformation.detailedDescription',
      icon: FolderOpen24Regular,
      color: theme.colors.primary,
      isAvailable: false, // Coming soon
    },
  ];

  const handleServicePress = service => {
    // Track user activity for session management
    updateActivity('user_interaction');

    // Check if service is not available
    if (!service.isAvailable) {
      handleComingSoon();
      return;
    }

    // Check if user is in guest mode for available services
    if (isGuestMode && !isAuthenticated) {
      showLoginPrompt();
      return;
    }

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

    // For other available services, you can add navigation logic here
    // navigation.navigate('ServiceDetail', { service });
  };



  // const toggleLanguage = () => {
  //   const newLanguage = i18n.language === 'ar' ? 'en' : 'ar';
  //   i18n.changeLanguage(newLanguage);
  // };

  const renderServiceCard = service => {
    const IconComponent = service.icon;
    const isDisabled = !service.isAvailable;

    return (
      <TouchableOpacity
        key={service.id}
        style={[
          styles.serviceCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            opacity: isDisabled ? 0.5 : 1,
          },
        ]}
        onPress={() => handleServicePress(service)}
        onLongPress={() => handleServiceLongPress(service)}
        activeOpacity={isDisabled ? 0.5 : 0.7}
        disabled={false}>
        <View style={[styles.cardContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* Icon Section */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDisabled ? theme.colors.textSecondary + '15' : service.color + '15',
                marginRight: isRTL ? 0 : 16,
                marginLeft: isRTL ? 16 : 0,
              },
            ]}>
            <IconComponent
              style={[
                styles.serviceIcon,
                { color: isDisabled ? theme.colors.textSecondary : service.color }
              ]}
            />
          </View>

          {/* Content Section */}
          <View style={[styles.textContent, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <View style={[styles.titleContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text
                style={[
                  styles.serviceTitle,
                  {
                    textAlign: isRTL ? 'right' : 'left',
                    color: isDisabled ? theme.colors.textSecondary : theme.colors.text,
                    flex: 1,
                  },
                ]}>
                {t(service.titleKey)}
              </Text>
              {isDisabled && (
                <View style={[styles.comingSoonBadge, { backgroundColor: theme.colors.textSecondary + '20' }]}>
                  <Text style={[styles.comingSoonText, { color: theme.colors.textSecondary }]}>
                    {t('services.comingSoon')}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.serviceDescription,
                {
                  textAlign: isRTL ? 'right' : 'left',
                  color: isDisabled ? theme.colors.textSecondary : theme.colors.textSecondary,
                },
              ]}
              numberOfLines={2}>
              {t(service.descriptionKey)}
            </Text>
            {service.id === 2 && service.isAvailable && ( // Only show for complaints service when available
              <TouchableOpacity
                style={[styles.serviceDescriptionLink, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
                onPress={() => {
                  navigation.navigate('ServiceDescription', {
                    serviceData: {
                      id: 'complaints',
                      title: {
                        en: 'Complaint',
                        ar: 'الشكاوى'
                      },
                      description: {
                        en: 'The service enables you to submit or escalate a complaint with SERA if you are unhappy with the outcome of the service provider\'s handling of your complaint, or if there is a delay in resolving it. It also allows you to follow up on the status of your complaint. The service is available 24/7 through various service delivery channels.',
                        ar: 'تتيح لك الخدمة تقديم أو تصعيد شكوى لدى هيئة تنظيم الكهرباء إذا لم تكن راضياً عن نتيجة تعامل مقدم الخدمة مع شكواك، أو في حالة وجود تأخير في حلها. كما تتيح لك متابعة حالة شكواك. الخدمة متاحة على مدار الساعة طوال أيام الأسبوع من خلال قنوات تقديم الخدمات المختلفة.'
                      },
                      steps: {
                        en: [
                          'Choose "Complaint".',
                          'Choose "Raise a complaint"',
                          'Fill out the Complaint Form',
                          'Submit the complaint'
                        ],
                        ar: [
                          'اختر "الشكاوى".',
                          'اختر "تقديم شكوى"',
                          'املأ نموذج الشكوى',
                          'أرسل الشكوى'
                        ]
                      },
                      requirements: {
                        en: [
                          'Logging in through the Unified National Access (NAFATH)'
                        ],
                        ar: [
                          'تسجيل الدخول من خلال النفاذ الوطني الموحد (نفاذ)'
                        ]
                      },
                      targetedAudience: {
                        en: 'Consumer',
                        ar: 'المستهلك'
                      },
                      completionPeriod: {
                        en: '20 workdays',
                        ar: '20 يوم عمل'
                      },
                      fees: {
                        en: 'Free',
                        ar: 'مجاني'
                      },
                      supportedLanguages: {
                        en: 'Arabic-English',
                        ar: 'العربية - الإنجليزية'
                      },
                      contactNumber: '19944',
                      deliveryChannels: {
                        en: 'E-portal - Call Center',
                        ar: 'البوابة الإلكترونية - مركز الاتصال'
                      },
                      submitUrl: 'https://eservices.sera.gov.sa/Complaint-menu',
                      guideUrl: 'https://sera.gov.sa/-/media/wera/pdfs/e-service/electricity-services-complaint-en.pdf'
                    }
                  });
                }}
                activeOpacity={0.7}>
                <Text style={[styles.serviceDescriptionLinkText, {
                  color: theme.colors.primary,
                  textAlign: isRTL ? 'right' : 'left'
                }]}>
                  {isRTL ? 'وصف الخدمة ←' : 'Service Description →'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Arrow Indicator */}
          <View style={[styles.arrowContainer, { transform: [{ scaleX: isRTL ? -1 : 1 }] }]}>
            <Text style={[styles.arrowText, { color: theme.colors.textSecondary }]}>›</Text>
          </View>
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
      width: '100%',
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    modalButtonsContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flex: 1,
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    // Description Modal styles
    descriptionModalContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 24,
      width: '90%',
      maxWidth: 400,
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    descriptionModalHeader: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    descriptionModalIcon: {
      width: 32,
      height: 32,
      color: theme.colors.primary,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    descriptionModalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
      textAlign: isRTL ? 'right' : 'left',
    },
    descriptionModalContent: {
      marginBottom: 24,
    },
    descriptionModalText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      textAlign: isRTL ? 'right' : 'left',
    },
    descriptionModalButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
      flex: 1,
    },
    descriptionModalButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SessionWrapper screenName="Services">
      <SafeContainer
        style={dynamicStyles.container}
        edges={['top']}
        backgroundColor={theme.colors.background}
        statusBarStyle={isDarkMode ? 'light-content' : 'dark-content'}
        statusBarBackgroundColor={theme.colors.surface}
      >

        {/* Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.headerTitle}>{t('services.title')}</Text>
        </View>

        {/* Services Description Section */}
        <View style={[
          styles.descriptionSection,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          }
        ]}>
          <Text style={[
            styles.descriptionTitle,
            {
              color: theme.colors.text,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}>
            {t('services.description.title')}
          </Text>
          <Text style={[
            styles.descriptionText,
            {
              color: theme.colors.textSecondary,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}>
            {t('services.description.subtitle')}
          </Text>
        </View>

        {/* Services List */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.servicesList}>
            {services.map(service => renderServiceCard(service))}
          </View>
        </ScrollView>

        {/* Navigation Bar */}
        <NavigationBar
          navigation={navigation}
          activeTab="services"
          onComingSoon={handleComingSoonChat}
          showComplaints={true}
        />

        {/* Session Status Debug Component - Only shown when development tools are enabled */}
        <SessionStatus isVisible={true} />

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

        {/* Login Required Modal */}
        <LoginRequiredModal
          visible={showLoginModal}
          onClose={closeLoginModal}
          onLogin={handleLoginPress}
          message={isRTL
            ? 'يجب تسجيل الدخول لاستخدام هذه الخدمة. هل تريد تسجيل الدخول الآن؟'
            : 'You need to login to use this service. Would you like to login now?'}
        />

        {/* Service Description Modal */}
        <Modal
          visible={showDescriptionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeDescriptionModal}>
          <TouchableOpacity
            style={dynamicStyles.modalOverlay}
            activeOpacity={1}
            onPress={closeDescriptionModal}>
            <TouchableOpacity
              style={dynamicStyles.descriptionModalContainer}
              activeOpacity={1}
              onPress={() => { }}>
              <View style={dynamicStyles.descriptionModalHeader}>
                {selectedService && (
                  <>
                    <selectedService.icon style={dynamicStyles.descriptionModalIcon} />
                    <Text style={dynamicStyles.descriptionModalTitle}>
                      {t(selectedService.titleKey)}
                    </Text>
                  </>
                )}
              </View>
              <ScrollView style={dynamicStyles.descriptionModalContent} showsVerticalScrollIndicator={false}>
                <Text style={dynamicStyles.descriptionModalText}>
                  {selectedService?.detailedDescriptionKey ? t(selectedService.detailedDescriptionKey) : ''}
                </Text>
              </ScrollView>
              <View style={dynamicStyles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[dynamicStyles.descriptionModalButton, dynamicStyles.cancelButton]}
                  onPress={closeDescriptionModal}
                  activeOpacity={0.8}>
                  <Text style={[dynamicStyles.descriptionModalButtonText, dynamicStyles.cancelButtonText]}>
                    {isRTL ? 'إغلاق' : 'Close'}
                  </Text>
                </TouchableOpacity>
                {selectedService?.id === 2 && ( // Only show for complaints service
                  <TouchableOpacity
                    style={dynamicStyles.descriptionModalButton}
                    onPress={() => {
                      closeDescriptionModal();
                      navigation.navigate('ServiceDescription', {
                        serviceData: {
                          id: 'complaints',
                          title: {
                            en: 'Complaint',
                            ar: 'الشكاوى'
                          },
                          description: {
                            en: 'The service enables you to submit or escalate a complaint with SERA if you are unhappy with the outcome of the service provider\'s handling of your complaint, or if there is a delay in resolving it. It also allows you to follow up on the status of your complaint. The service is available 24/7 through various service delivery channels.',
                            ar: 'تتيح لك الخدمة تقديم أو تصعيد شكوى لدى هيئة تنظيم الكهرباء إذا لم تكن راضياً عن نتيجة تعامل مقدم الخدمة مع شكواك، أو في حالة وجود تأخير في حلها. كما تتيح لك متابعة حالة شكواك. الخدمة متاحة على مدار الساعة طوال أيام الأسبوع من خلال قنوات تقديم الخدمات المختلفة.'
                          },
                          steps: {
                            en: [
                              'Choose "Complaint".',
                              'Choose "Raise a complaint"',
                              'Fill out the Complaint Form',
                              'Submit the complaint'
                            ],
                            ar: [
                              'اختر "الشكاوى".',
                              'اختر "تقديم شكوى"',
                              'املأ نموذج الشكوى',
                              'أرسل الشكوى'
                            ]
                          },
                          requirements: {
                            en: [
                              'Logging in through the Unified National Access (NAFATH)'
                            ],
                            ar: [
                              'تسجيل الدخول من خلال النفاذ الوطني الموحد (نفاذ)'
                            ]
                          },
                          targetedAudience: {
                            en: 'Consumer',
                            ar: 'المستهلك'
                          },
                          completionPeriod: {
                            en: '20 workdays',
                            ar: '20 يوم عمل'
                          },
                          fees: {
                            en: 'Free',
                            ar: 'مجاني'
                          },
                          supportedLanguages: {
                            en: 'Arabic-English',
                            ar: 'العربية - الإنجليزية'
                          },
                          contactNumber: '19944',
                          deliveryChannels: {
                            en: 'E-portal - Call Center',
                            ar: 'البوابة الإلكترونية - مركز الاتصال'
                          },
                          submitUrl: 'https://eservices.sera.gov.sa/Complaint-menu',
                          guideUrl: 'https://sera.gov.sa/-/media/wera/pdfs/e-service/electricity-services-complaint-en.pdf'
                        }
                      });
                    }}
                    activeOpacity={0.8}>
                    <Text style={dynamicStyles.descriptionModalButtonText}>
                      {isRTL ? 'وصف الخدمة' : 'Service Description'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </SafeContainer>
    </SessionWrapper>
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
  content: {
    flex: 1,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Extra space for navigation bar
  },
  servicesList: {
    gap: 16,
  },
  serviceCard: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 0, // Using gap instead
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
    minHeight: 80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 28,
    height: 28,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 6,
    width: '100%',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  serviceDescriptionLink: {
    marginTop: 8,
    paddingVertical: 4,
  },
  serviceDescriptionLinkText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default ServicesScreen;
