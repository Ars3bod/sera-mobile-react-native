import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {useUser} from '../context/UserContext';
import {useFocusEffect} from '@react-navigation/native';
import {
  ArrowLeft24Regular,
  DocumentText24Regular,
  CheckmarkCircle24Regular,
  Dismiss24Regular,
  Filter24Regular,
  Settings24Regular,
  EyeOff24Regular,
} from '@fluentui/react-native-icons';
import {LoadingSpinner} from '../animations';
import AppConfig from '../config/appConfig';

// Mock data for permits
const MOCK_PERMITS_DATA = {
  all: [
    {
      id: 'PR001',
      requestNumber: 'PR-2024-001',
      requestName: 'Power Generation Station Permit',
      requestStage: 'Technical Review',
      requestDate: '2024-01-15T09:00:00',
      requestStatus: 'processing',
      permitType: 'powerGeneration',
    },
    {
      id: 'PR002',
      requestNumber: 'PR-2024-002',
      requestName: 'District Cooling Station Permit',
      requestStage: 'Final Approval',
      requestDate: '2024-01-10T10:30:00',
      requestStatus: 'completed',
      permitType: 'districtCooling',
    },
    {
      id: 'PR003',
      requestNumber: 'PR-2024-003',
      requestName: 'Power Generation Station Permit',
      requestStage: 'Documentation Review',
      requestDate: '2024-01-20T14:15:00',
      requestStatus: 'processing',
      permitType: 'powerGeneration',
    },
    {
      id: 'PR004',
      requestNumber: 'PR-2024-004',
      requestName: 'District Cooling Station Permit',
      requestStage: 'Initial Assessment',
      requestDate: '2024-01-25T11:45:00',
      requestStatus: 'unacceptable',
      permitType: 'districtCooling',
    },
    {
      id: 'PR005',
      requestNumber: 'PR-2024-005',
      requestName: 'Power Generation Station Permit',
      requestStage: 'Draft',
      requestDate: '2024-01-28T16:20:00',
      requestStatus: 'unsent',
      permitType: 'powerGeneration',
    },
    {
      id: 'PR006',
      requestNumber: 'PR-2024-006',
      requestName: 'District Cooling Station Permit',
      requestStage: 'Revision Required',
      requestDate: '2024-01-12T13:10:00',
      requestStatus: 'returned',
      permitType: 'districtCooling',
    },
  ],
};

const ViewPermitsScreen = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const {user} = useUser();
  const isRTL = i18n.language === 'ar';
  const {filter = 'all'} = route.params || {};

  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(filter);

  const handleGoBack = () => {
    navigation.goBack();
  };

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
      return '';
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return t('permits.view.invalidDate');
      }
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('formatDate error:', error);
      }
      return t('permits.view.invalidDate');
    }
  };

  // Check if should use mock data
  const shouldUseMockData = () => {
    if (AppConfig.api.useMockData) {
      return true;
    }

    if (AppConfig.development.mockServices.permits) {
      return true;
    }

    const contactId = getContactId();
    if (!contactId) {
      return true;
    }

    return false;
  };

  const fetchPermits = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      if (shouldUseMockData()) {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using mock data for permits');
        }

        // Use mock data
        const mockPermits = MOCK_PERMITS_DATA.all.filter(permit => {
          if (currentFilter === 'all') return true;
          return permit.requestStatus === currentFilter;
        });
        setPermits(mockPermits);
      } else {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using real API for permits - not implemented yet');
        }

        // TODO: Implement real API call
        // For now, fallback to mock data
        const mockPermits = MOCK_PERMITS_DATA.all.filter(permit => {
          if (currentFilter === 'all') return true;
          return permit.requestStatus === currentFilter;
        });
        setPermits(mockPermits);
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error fetching permits:', error);
      }
      setError(error.message || 'Failed to load permits');

      // Fallback to mock data on error
      const mockPermits = MOCK_PERMITS_DATA.all.filter(permit => {
        if (currentFilter === 'all') return true;
        return permit.requestStatus === currentFilter;
      });
      setPermits(mockPermits);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPermits(false);
  }, [currentFilter]);

  // Load permits when screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchPermits();
    }, [currentFilter]),
  );

  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'processing':
        return '#FF9800';
      case 'unacceptable':
        return '#F44336';
      case 'unsent':
        return '#9E9E9E';
      case 'returned':
        return '#FF5722';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return CheckmarkCircle24Regular;
      case 'processing':
        return Settings24Regular;
      case 'unacceptable':
      case 'returned':
        return Dismiss24Regular;
      case 'unsent':
        return EyeOff24Regular;
      default:
        return DocumentText24Regular;
    }
  };

  const handlePermitPress = permit => {
    // Navigate to permit details screen (to be implemented)
    console.log('Permit pressed:', permit);
    // navigation.navigate('PermitDetails', {permit});
  };

  const renderPermitCard = permit => {
    const StatusIcon = getStatusIcon(permit.requestStatus);
    const statusColor = getStatusColor(permit.requestStatus);

    return (
      <TouchableOpacity
        key={permit.id}
        style={[
          styles.permitCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => handlePermitPress(permit)}
        activeOpacity={0.7}>
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <DocumentText24Regular
              style={[styles.cardIcon, {color: theme.colors.primary}]}
            />
            <Text
              style={[
                styles.requestNumber,
                {
                  color: theme.colors.primary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {permit.requestNumber}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, {backgroundColor: statusColor + '20'}]}>
            <StatusIcon style={[styles.statusIcon, {color: statusColor}]} />
            <Text style={[styles.statusText, {color: statusColor}]}>
              {t(`permits.status.${permit.requestStatus}`)}
            </Text>
          </View>
        </View>

        {/* Request Details */}
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.requestName,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {permit.requestName}
          </Text>

          <Text
            style={[
              styles.requestStage,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {permit.requestStage}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text
            style={[
              styles.requestDate,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {formatDate(permit.requestDate)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filterKey, label) => {
    const isActive = currentFilter === filterKey;
    return (
      <TouchableOpacity
        key={filterKey}
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive
              ? theme.colors.primary
              : theme.colors.surface,
            borderColor: isActive ? theme.colors.primary : theme.colors.border,
          },
        ]}
        onPress={() => setCurrentFilter(filterKey)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.filterButtonText,
            {
              color: isActive ? theme.colors.textInverse : theme.colors.text,
            },
          ]}>
          {label}
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

  if (loading) {
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
          <Text style={dynamicStyles.headerTitle}>
            {t('permits.view.title')}
          </Text>
          <View style={styles.placeholderView} />
        </View>

        <View style={styles.loadingContainer}>
          <LoadingSpinner
            type="rotating"
            size={40}
            color={theme.colors.primary}
            duration={1000}
          />
          <Text style={[styles.loadingText, {color: theme.colors.text}]}>
            {t('permits.view.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={dynamicStyles.headerTitle}>{t('permits.view.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}>
          {renderFilterButton('all', t('permits.status.all'))}
          {renderFilterButton('completed', t('permits.status.completed'))}
          {renderFilterButton('processing', t('permits.status.processing'))}
          {renderFilterButton('unacceptable', t('permits.status.unacceptable'))}
          {renderFilterButton('unsent', t('permits.status.unsent'))}
          {renderFilterButton('returned', t('permits.status.returned'))}
        </ScrollView>
      </View>

      {/* Content */}
      {permits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <DocumentText24Regular
            style={[styles.emptyIcon, {color: theme.colors.textSecondary}]}
          />
          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.colors.text,
                textAlign: 'center',
              },
            ]}>
            {t('permits.view.noPermits')}
          </Text>
          <Text
            style={[
              styles.emptyMessage,
              {
                color: theme.colors.textSecondary,
                textAlign: 'center',
              },
            ]}>
            {t('permits.view.noPermitsMessage')}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}>
          {/* Title */}
          <Text
            style={[
              styles.listTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('permits.view.yourPermits')} ({permits.length})
          </Text>

          {/* Permits List */}
          <View style={styles.permitsList}>
            {permits.map(renderPermitCard)}
          </View>
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  filtersContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  permitsList: {
    gap: 16,
  },
  permitCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  requestNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  requestStage: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  requestDate: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ViewPermitsScreen;
