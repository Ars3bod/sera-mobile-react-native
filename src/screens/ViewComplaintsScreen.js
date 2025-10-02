import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
  FlatList,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import {
  DocumentText24Regular,
  CheckmarkCircle24Regular,
  Dismiss24Regular,
  Filter24Regular,
  Clock24Regular,
  ArrowLeft24Regular,
  ChevronRight24Regular,
  ChevronLeft24Regular,
} from '@fluentui/react-native-icons';
import NavigationBar from '../components/NavigationBar';
import { LoadingIndicator } from '../components';
import complaintsService, {
  MOCK_COMPLAINTS_DATA,
} from '../services/complaintsService';
import AppConfig from '../config/appConfig';

const ViewComplaintsScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { user, isAuthenticated } = useUser();
  const isRTL = i18n.language === 'ar';
  const { filter = 'all', fromNavBar = true } = route.params || {};

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(filter);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // Determine if user came from NavigationBar or ComplaintsScreen
  const isFromNavigationBar = fromNavBar;

  const handleComingSoon = () => {
    setShowComingSoonModal(true);
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Get contact ID from user context
  const getContactId = () => {
    // Check for contact ID stored directly in user profile
    if (user?.contactId) {
      return user.contactId;
    }

    // Check multiple possible locations for contact ID
    if (user?.contactInfo?.id) {
      return user.contactInfo.id;
    }

    // Check if contact validation result is stored elsewhere
    if (user?.contactValidation?.data?.id) {
      return user.contactValidation.data.id;
    }

    return null;
  };

  // Get user phone number with fallbacks
  const getUserPhoneNumber = () => {
    // Check for phone number from contact validation (mapped from MobilePhone)
    if (user?.phone) {
      return user.phone;
    }

    // Check multiple possible sources for phone number
    if (user?.phoneNumber) {
      return user.phoneNumber;
    }

    if (user?.contactInfo?.mobilePhone) {
      return user.contactInfo.mobilePhone;
    }

    if (user?.contactInfo?.phoneNumber) {
      return user.contactInfo.phoneNumber;
    }

    // Check for mobile field variations
    if (user?.mobile) {
      return user.mobile;
    }

    if (user?.mobilePhone) {
      return user.mobilePhone;
    }

    // For development/testing, return a placeholder
    if (AppConfig.development.enableDebugLogs) {
      return '+966501234567'; // Placeholder for development
    }

    return null; // Return null instead of empty string to make it clear it's missing
  };

  // Get user national ID
  const getUserNationalId = () => {
    // Check primary field
    if (user?.nationalId) {
      return user.nationalId;
    }

    // Check alternative field names
    if (user?.nin) {
      return user.nin;
    }

    if (user?.id) {
      return user.id.toString();
    }

    // Check contact info
    if (user?.contactInfo?.nationalId) {
      return user.contactInfo.nationalId;
    }

    if (user?.contactInfo?.nin) {
      return user.contactInfo.nin;
    }

    // Check for NIN field variations
    if (user?.NIN) {
      return user.NIN;
    }

    if (user?.nationalID) {
      return user.nationalID;
    }

    return null; // Return null instead of empty string to make it clear it's missing
  };

  // Helper function to format date safely
  const formatDate = dateString => {
    if (AppConfig.development.enableDebugLogs) {
      console.log('formatDate input:', dateString, typeof dateString);
    }

    if (!dateString || dateString === null || dateString === undefined) {
      if (AppConfig.development.enableDebugLogs) {
        console.log('formatDate: empty or null date');
      }
      return '';
    }

    try {
      // Handle ISO date strings and clean format
      let cleanDateString = dateString;

      // If it's already a Date object
      if (dateString instanceof Date) {
        if (isNaN(dateString.getTime())) {
          if (AppConfig.development.enableDebugLogs) {
            console.log('formatDate: invalid Date object');
          }
          return t('complaints.view.invalidDate');
        }
        const result = dateString.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
        if (AppConfig.development.enableDebugLogs) {
          console.log('formatDate result (from Date):', result);
        }
        return result;
      }

      // Handle string dates
      if (typeof dateString === 'string') {
        // Remove escape characters if present
        cleanDateString = dateString.replace(/\\/g, '');

        // Special handling for API format: "5/25/2025 10:25:12 AM"
        if (
          cleanDateString.match(
            /^\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}\s+(AM|PM)$/i,
          )
        ) {
          if (AppConfig.development.enableDebugLogs) {
            console.log('formatDate: parsing MM/DD/YYYY HH:MM:SS AM/PM format');
          }

          // Convert to a format that JavaScript can parse reliably
          // From "5/25/2025 10:25:12 AM" to "2025-05-25T10:25:12"
          const parts = cleanDateString.split(' ');
          const datePart = parts[0]; // "5/25/2025"
          const timePart = parts[1]; // "10:25:12"
          const ampm = parts[2]; // "AM" or "PM"

          const [month, day, year] = datePart.split('/');
          const [hours, minutes, seconds] = timePart.split(':');

          // Convert to 24-hour format
          let hour24 = parseInt(hours);
          if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
            hour24 += 12;
          } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
            hour24 = 0;
          }

          // Create ISO format string: YYYY-MM-DDTHH:MM:SS
          const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(
            2,
            '0',
          )}T${hour24.toString().padStart(2, '0')}:${minutes}:${seconds}`;

          if (AppConfig.development.enableDebugLogs) {
            console.log('formatDate: converted to ISO:', isoString);
          }

          cleanDateString = isoString;
        }
      }

      const date = new Date(cleanDateString);

      if (isNaN(date.getTime())) {
        if (AppConfig.development.enableDebugLogs) {
          console.log(
            'formatDate: invalid date after parsing:',
            cleanDateString,
          );
        }
        return t('complaints.view.invalidDate');
      }

      const result = date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
      if (AppConfig.development.enableDebugLogs) {
        console.log('formatDate result:', result);
      }
      return result;
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('formatDate error:', error);
      }
      return t('complaints.view.invalidDate');
    }
  };

  // Check if should use mock data based on config
  const shouldUseMockData = () => {
    // First check global mock data setting
    if (AppConfig.api.useMockData) {
      return true;
    }

    // Then check service-specific mock setting
    if (AppConfig.development.mockServices.complaints) {
      return true;
    }

    // Check if user is not authenticated
    if (!user || !isAuthenticated) {
      return true;
    }

    // Check if essential user data is missing
    const contactId = getContactId();
    const phoneNumber = getUserPhoneNumber();
    const nationalId = getUserNationalId();

    if (!contactId || !phoneNumber || !nationalId) {
      return true;
    }

    return false;
  };

  const loadComplaints = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Get user data for API call
      const contactId = getContactId();
      const phoneNumber = getUserPhoneNumber();
      const nationalId = getUserNationalId();

      // Check if we have required data or should use mock data
      if (!contactId || !phoneNumber || !nationalId || shouldUseMockData()) {
        // Use mock data
        const mockComplaints = MOCK_COMPLAINTS_DATA.all.filter(complaint => {
          if (currentFilter === 'all') return true;
          return complaint.status === currentFilter;
        });
        setComplaints(mockComplaints);
        return;
      }

      // Directly call complaintsService.getComplaintsList()
      const response = await complaintsService.getComplaintsList({
        cid: contactId,
        phoneNumber: phoneNumber,
        nin: nationalId,
        langCode: i18n.language,
        pageNumber: 1,
        pageSize: 99,
      });

      if (response.success && response.complaints) {
        // Apply client-side filtering
        const filteredComplaints = complaintsService.filterComplaintsByStatus(
          response.complaints,
          currentFilter
        );

        setComplaints(filteredComplaints);
      } else {
        throw new Error(response.errorMessage || 'Failed to load complaints');
      }

    } catch (err) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error loading complaints:', err);
      }

      setError(err.message);

      // Show error toast/alert to user instead of silently using mock data
      Alert.alert(
        t('common.error'),
        err.message || t('complaints.view.loadError'),
        [
          {
            text: t('common.retry'),
            onPress: () => {
              setError(null);
              loadComplaints();
            }
          },
          {
            text: t('common.cancel'),
            style: 'cancel'
          }
        ]
      );

      // Only use mock data if specifically configured for development
      if (AppConfig.development.mockServices.complaints) {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using mock data as configured for development');
        }

        const mockComplaints = MOCK_COMPLAINTS_DATA.all.filter(complaint => {
          if (currentFilter === 'all') return true;
          return complaint.status === currentFilter;
        });
        setComplaints(mockComplaints);
      } else {
        // Don't load any data, let the error state show
        setComplaints([]);
      }
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadComplaints(false);
  }, [currentFilter]);

  // Load complaints when screen focuses or filter changes
  useFocusEffect(
    useCallback(() => {
      loadComplaints();
    }, [currentFilter]),
  );

  const filterOptions = [
    {
      key: 'all',
      labelKey: 'complaints.filters.all',
      icon: DocumentText24Regular,
    },
    {
      key: 'open',
      labelKey: 'complaints.filters.open',
      icon: Clock24Regular,
    },
    {
      key: 'closed',
      labelKey: 'complaints.filters.closed',
      icon: CheckmarkCircle24Regular,
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'open':
        return '#FF9800'; // Orange for open
      case 'closed':
        return '#4CAF50'; // Green for closed
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusDisplayText = status => {
    switch (status) {
      case 'open':
        return t('complaints.view.status.open');
      case 'closed':
        return t('complaints.view.status.closed');
      default:
        return t('complaints.view.status.unknown');
    }
  };

  // Handle complaint item press
  const handleComplaintPress = (complaint) => {
    if (complaint.caseNumber) {
      navigation.navigate('ComplaintDetails', {
        caseNumber: complaint.caseNumber
      });
    } else {
      Alert.alert(
        t('complaints.view.error'),
        t('complaints.view.invalidComplaint')
      );
    }
  };

  // Render complaint item
  const renderComplaintItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={[
          styles.complaintItem,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          }
        ]}
        onPress={() => handleComplaintPress(item)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.complaintHeader,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }
        ]}>
          <View style={styles.complaintNumberContainer}>
            <Text style={[
              styles.complaintNumber,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              }
            ]}>
              {item.caseNumber}
            </Text>
            <View style={[
              styles.statusDot,
              {
                backgroundColor: statusColor,
                marginLeft: isRTL ? 0 : 8,
                marginRight: isRTL ? 8 : 0,
              }
            ]} />
          </View>

          <Text style={[
            styles.complaintDate,
            {
              color: theme.colors.textSecondary,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}>
            {formatDate(item.creationDate)}
          </Text>
        </View>

        <Text style={[
          styles.complaintType,
          {
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
          }
        ]}>
          {item.caseType}
        </Text>

        <Text style={[
          styles.complaintDescription,
          {
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
          }
        ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.complaintFooter}>
          <Text style={[
            styles.complaintProvider,
            {
              color: theme.colors.textSecondary,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}>
            {item.serviceProvider}
          </Text>

          <View style={[
            styles.statusBadge,
            { backgroundColor: statusColor + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: statusColor }
            ]}>
              {getStatusDisplayText(item.status)}
            </Text>
          </View>
        </View>

        {/* Tap indicator */}
        <View style={[
          styles.tapIndicator,
          {
            right: isRTL ? undefined : 16,
            left: isRTL ? 16 : undefined,
          }
        ]}>
          {isRTL ? (
            <ChevronLeft24Regular
              style={[
                styles.chevronIcon,
                {
                  color: theme.colors.textSecondary,
                }
              ]}
            />
          ) : (
            <ChevronRight24Regular
              style={[
                styles.chevronIcon,
                {
                  color: theme.colors.textSecondary,
                }
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = filterOption => {
    const IconComponent = filterOption.icon;
    const isActive = currentFilter === filterOption.key;

    return (
      <TouchableOpacity
        key={filterOption.key}
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive
              ? theme.colors.primary + '20'
              : theme.colors.surface,
            borderColor: isActive ? theme.colors.primary : theme.colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            marginLeft: isRTL ? 8 : 0,
            marginRight: isRTL ? 0 : 8,
          },
        ]}
        onPress={() => setCurrentFilter(filterOption.key)}
        activeOpacity={0.7}>
        <IconComponent
          style={[
            styles.filterIcon,
            {
              color: isActive ? theme.colors.primary : theme.colors.icon,
              marginLeft: isRTL ? 6 : 0,
              marginRight: isRTL ? 0 : 6,
            },
          ]}
        />
        <Text
          style={[
            styles.filterText,
            {
              color: isActive ? theme.colors.primary : theme.colors.text,
            },
          ]}>
          {t(filterOption.labelKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    backIcon: {
      width: 24,
      height: 24,
      color: theme.colors.primary,
      transform: [{ scaleX: isRTL ? -1 : 1 }],
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: isFromNavigationBar ? 'center' : (isRTL ? 'right' : 'left'),
      flex: 1,
    },
    placeholderView: {
      width: 40,
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
  });

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />

      {/* Header */}
      <View style={dynamicStyles.header}>
        {!isFromNavigationBar && (
          <TouchableOpacity
            style={dynamicStyles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <ArrowLeft24Regular style={dynamicStyles.backIcon} />
          </TouchableOpacity>
        )}
        <Text style={dynamicStyles.headerTitle}>
          {t('complaints.view.title')}
        </Text>
        {!isFromNavigationBar && <View style={dynamicStyles.placeholderView} />}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.filtersContent,
            {
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }
          ]}>
          {filterOptions.map(renderFilterButton)}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingIndicator
            size="large"
            color={theme.colors.primary}
          />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            {t('complaints.view.loading')}
          </Text>
        </View>
      ) : error && complaints.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => loadComplaints()}>
            <Text style={styles.retryButtonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <DocumentText24Regular
            style={[styles.emptyIcon, { color: theme.colors.textSecondary }]}
          />
          <Text
            style={[
              styles.emptyTitle,
              { color: theme.colors.text, textAlign: 'center' },
            ]}>
            {t('complaints.view.noComplaints')}
          </Text>
          <Text
            style={[
              styles.emptyDescription,
              { color: theme.colors.textSecondary, textAlign: 'center' },
            ]}>
            {t('complaints.view.noComplaintsMessage')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item.id || item.caseNumber}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.complaintsContainer}
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {/* Navigation Bar - Only show if user came from NavigationBar */}
      {isFromNavigationBar && (
        <NavigationBar
          navigation={navigation}
          activeTab="complaints"
          onComingSoon={handleComingSoon}
          showComplaints={true}
        />
      )}

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
  filtersContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterIcon: {
    width: 16,
    height: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  complaintsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  complaintItem: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complaintNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complaintNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  complaintDate: {
    fontSize: 14,
  },
  complaintType: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  complaintDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complaintProvider: {
    fontSize: 14,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tapIndicator: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  chevronIcon: {
    fontSize: 20,
  },
});

export default ViewComplaintsScreen;
