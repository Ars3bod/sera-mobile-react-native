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
} from '@fluentui/react-native-icons';
import NavigationBar from '../components/NavigationBar';
import complaintsService, {
  MOCK_COMPLAINTS_DATA,
} from '../services/complaintsService';
import { LoadingSpinner } from '../animations';
import AppConfig from '../config/appConfig';

const ViewComplaintsScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { user } = useUser();
  const isRTL = i18n.language === 'ar';
  const { filter = 'all' } = route.params || {};

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(filter);



  // Get contact ID from user context
  const getContactId = () => {
    if (user?.contactInfo?.id) {
      return user.contactInfo.id;
    }
    return null;
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

    // If no contact ID available, use mock data
    const contactId = getContactId();
    if (!contactId) {
      return true;
    }

    return false;
  };

  const fetchComplaints = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      if (shouldUseMockData()) {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using mock data for complaints (configured mode)');
        }

        // Use mock data for development/presentation
        const mockComplaints = MOCK_COMPLAINTS_DATA.all.filter(complaint => {
          if (currentFilter === 'all') return true;
          return complaint.status === currentFilter;
        });
        setComplaints(mockComplaints);
      } else {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using real API for complaints');
        }

        // Use real API
        const contactId = getContactId();
        const statusCode =
          complaintsService.getStatusCodeForFilter(currentFilter);
        const response = await complaintsService.getComplaintsList({
          cid: contactId,
          statusCode: statusCode,
          pageNumber: '1',
          pageSize: AppConfig.pagination.defaultPageSize.toString(),
        });

        if (response.success) {
          setComplaints(response.complaints || []);
        } else {
          throw new Error('Failed to fetch complaints');
        }
      }
    } catch (err) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error fetching complaints:', err);
      }
      setError(err.message);

      // Fallback to mock data on error
      if (AppConfig.development.enableDebugLogs) {
        console.log('Falling back to mock data due to error');
      }
      const mockComplaints = MOCK_COMPLAINTS_DATA.all.filter(complaint => {
        if (currentFilter === 'all') return true;
        return complaint.status === currentFilter;
      });
      setComplaints(mockComplaints);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComplaints(false);
  }, [currentFilter]);

  // Load complaints when screen focuses or filter changes
  useFocusEffect(
    useCallback(() => {
      fetchComplaints();
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
      icon: DocumentText24Regular,
    },
    {
      key: 'closed',
      labelKey: 'complaints.filters.closed',
      icon: CheckmarkCircle24Regular,
    },
    {
      key: 'rejected',
      labelKey: 'complaints.filters.rejected',
      icon: Dismiss24Regular,
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'open':
        return '#FF9800';
      case 'closed':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderComplaintCard = complaint => (
    <TouchableOpacity
      key={complaint.id}
      style={[styles.complaintCard, { backgroundColor: theme.colors.card }]}
      activeOpacity={0.7}>
      <View style={styles.complaintHeader}>
        <View style={styles.complaintTitleContainer}>
          <Text
            style={[
              styles.complaintTitle,
              { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' },
            ]}>
            {complaint.title}
          </Text>
          <Text
            style={[
              styles.complaintNumber,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            #{complaint.caseNumber}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(complaint.status) + '20' },
            ]}>
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(complaint.status) },
              ]}>
              {t(`complaints.view.status.${complaint.status}`)}
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.complaintDescription,
          {
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}>
        {complaint.description}
      </Text>

      <View style={styles.complaintFooter}>
        <Text
          style={[styles.complaintDate, { color: theme.colors.textSecondary }]}>
          {(() => {
            const dateValue = complaint.dateSubmitted || complaint.creationDate;
            if (AppConfig.development.enableDebugLogs) {
              console.log('Complaint date values:', {
                id: complaint.id,
                dateSubmitted: complaint.dateSubmitted,
                creationDate: complaint.creationDate,
                finalValue: dateValue,
              });
            }
            return formatDate(dateValue);
          })()}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          },
        ]}
        onPress={() => setCurrentFilter(filterOption.key)}
        activeOpacity={0.7}>
        <IconComponent
          style={[
            styles.filterIcon,
            { color: isActive ? theme.colors.primary : theme.colors.icon },
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
  });

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />

      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>
          {t('complaints.view.title')}
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}>
          {filterOptions.map(renderFilterButton)}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {loading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner
              type="rotating"
              size={40}
              color={theme.colors.primary}
              duration={1000}
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
              onPress={() => fetchComplaints()}>
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
          <View style={styles.complaintsContainer}>
            {complaints.map(renderComplaintCard)}
          </View>
        )}
      </ScrollView>

      {/* Navigation Bar */}
      <NavigationBar
        navigation={navigation}
        activeTab="complaints"
        onComingSoon={() => {
          // Handle coming soon for chat functionality
          console.log('Chat coming soon');
        }}
        showComplaints={true}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
    gap: 16,
  },
  complaintCard: {
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
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  complaintTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  complaintNumber: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  complaintDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complaintDate: {
    fontSize: 12,
  },
});

export default ViewComplaintsScreen;
