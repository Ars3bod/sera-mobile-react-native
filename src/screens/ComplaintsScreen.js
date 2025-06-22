import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft24Regular,
  Add24Regular,
  DocumentText24Regular,
  CheckmarkCircle24Regular,
  Dismiss24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-native-icons';

import LoginRequiredModal from '../components/LoginRequiredModal';

import complaintsService, {
  MOCK_COMPLAINTS_DATA,
} from '../services/complaintsService';
import AppConfig from '../config/appConfig';
import { LoadingSpinner } from '../animations';

const ComplaintsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { user, isAuthenticated, isGuestMode } = useUser();
  const isRTL = i18n.language === 'ar';

  const [complaintsCounts, setComplaintsCounts] = useState({
    open: 0,
    closed: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const navigateToCreateComplaint = () => {
    navigation.navigate('CreateComplaint');
  };

  // Login modal handlers
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginPress = () => {
    setShowLoginModal(false);
    navigation.navigate('NafathLogin', { fromModal: true });
  };

  const showLoginPrompt = () => {
    setShowLoginModal(true);
  };

  const navigateToViewComplaints = (filter = 'all') => {
    // Check if user is in guest mode
    if (isGuestMode && !isAuthenticated) {
      showLoginPrompt();
      return;
    }
    // Navigate to ViewComplaints if authenticated
    navigation.navigate('ViewComplaints', { filter });
  };

  // Get contact ID from user context
  const getContactId = () => {
    if (user?.contactInfo?.id) {
      return user.contactInfo.id;
    }
    return null;
  };

  // Check if should use mock data based on config
  const shouldUseMockData = () => {
    if (AppConfig.api.useMockData) {
      return true;
    }

    if (AppConfig.development.mockServices.complaints) {
      return true;
    }

    const contactId = getContactId();
    if (!contactId) {
      return true;
    }

    return false;
  };

  // Fetch complaints counts from API or use mock data
  const fetchComplaintsCounts = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      if (shouldUseMockData()) {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using mock data for complaints counts');
        }

        // Calculate counts from mock data
        const openCount = MOCK_COMPLAINTS_DATA.all.filter(
          c => c.status === 'open',
        ).length;
        const closedCount = MOCK_COMPLAINTS_DATA.all.filter(
          c => c.status === 'closed',
        ).length;
        const rejectedCount = MOCK_COMPLAINTS_DATA.all.filter(
          c => c.status === 'rejected',
        ).length;

        setComplaintsCounts({
          open: openCount,
          closed: closedCount,
          rejected: rejectedCount,
          total: MOCK_COMPLAINTS_DATA.all.length,
        });
      } else {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Fetching real complaints counts from API');
        }

        const contactId = getContactId();

        // Fetch all complaints to calculate counts
        const response = await complaintsService.getComplaintsList({
          cid: contactId,
          statusCode: '3', // All complaints
          pageNumber: '1',
          pageSize: AppConfig.pagination.maxPageSize.toString(), // Get max to count all
        });

        if (response.success) {
          const complaints = response.complaints || [];
          const openCount = complaints.filter(c => c.status === 'open').length;
          const closedCount = complaints.filter(
            c => c.status === 'closed',
          ).length;
          const rejectedCount = complaints.filter(
            c => c.status === 'rejected',
          ).length;

          setComplaintsCounts({
            open: openCount,
            closed: closedCount,
            rejected: rejectedCount,
            total: complaints.length,
          });
        } else {
          throw new Error('Failed to fetch complaints');
        }
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Error fetching complaints counts:', error);
      }

      // Fallback to mock data counts on error
      const openCount = MOCK_COMPLAINTS_DATA.all.filter(
        c => c.status === 'open',
      ).length;
      const closedCount = MOCK_COMPLAINTS_DATA.all.filter(
        c => c.status === 'closed',
      ).length;
      const rejectedCount = MOCK_COMPLAINTS_DATA.all.filter(
        c => c.status === 'rejected',
      ).length;

      setComplaintsCounts({
        open: openCount,
        closed: closedCount,
        rejected: rejectedCount,
        total: MOCK_COMPLAINTS_DATA.all.length,
      });
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh complaints counts
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaintsCounts(false);
  };

  // Load complaints counts when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      fetchComplaintsCounts();
    }, []),
  );

  const mainActions = [
    {
      titleKey: 'complaints.newComplaint.title',
      descriptionKey: 'complaints.newComplaint.description',
      icon: Add24Regular,
      color: theme.colors.primary,
      backgroundColor: theme.colors.primary + '15',
      onPress: navigateToCreateComplaint,
    },
    {
      titleKey: 'complaints.viewComplaints.title',
      descriptionKey: 'complaints.viewComplaints.description',
      icon: DocumentText24Regular,
      color: '#2196F3',
      backgroundColor: '#2196F3' + '15',
      onPress: () => navigateToViewComplaints('all'),
    },
  ];

  const quickFilters = [
    {
      titleKey: 'complaints.filters.open',
      icon: DocumentText24Regular,
      color: '#FF9800',
      count: complaintsCounts.open,
      onPress: () => navigateToViewComplaints('open'),
    },
    {
      titleKey: 'complaints.filters.closed',
      icon: CheckmarkCircle24Regular,
      color: '#4CAF50',
      count: complaintsCounts.closed,
      onPress: () => navigateToViewComplaints('closed'),
    },
    {
      titleKey: 'complaints.filters.rejected',
      icon: Dismiss24Regular,
      color: '#F44336',
      count: complaintsCounts.rejected,
      onPress: () => navigateToViewComplaints('rejected'),
    },
  ];

  const renderMainAction = action => {
    const IconComponent = action.icon;
    return (
      <TouchableOpacity
        key={action.titleKey}
        style={[
          styles.actionCard,
          { backgroundColor: theme.colors.card },
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
        onPress={action.onPress}
        activeOpacity={0.7}>
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: action.backgroundColor },
          ]}>
          <IconComponent style={[styles.actionIcon, { color: action.color }]} />
        </View>
        <View style={styles.actionContent}>
          <Text
            style={[
              styles.actionTitle,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.text,
              },
            ]}>
            {t(action.titleKey)}
          </Text>
          <Text
            style={[
              styles.actionDescription,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.textSecondary,
              },
            ]}>
            {t(action.descriptionKey)}
          </Text>
        </View>
        <ChevronRight24Regular
          style={[
            styles.chevronIcon,
            {
              transform: [{ scaleX: isRTL ? -1 : 1 }],
              color: theme.colors.icon,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const renderQuickFilter = filter => {
    const IconComponent = filter.icon;
    return (
      <TouchableOpacity
        key={filter.titleKey}
        style={[styles.filterCard, { backgroundColor: theme.colors.card }]}
        onPress={filter.onPress}
        activeOpacity={0.7}>
        <View
          style={[
            styles.filterIconContainer,
            { backgroundColor: filter.color + '20' },
          ]}>
          <IconComponent style={[styles.filterIcon, { color: filter.color }]} />
        </View>
        <Text style={[styles.filterCount, { color: theme.colors.text }]}>
          {filter.count}
        </Text>
        <Text
          style={[
            styles.filterTitle,
            {
              textAlign: 'center',
              color: theme.colors.textSecondary,
            },
          ]}>
          {t(filter.titleKey)}
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
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}>
          <ArrowLeft24Regular
            style={[
              dynamicStyles.backIcon,
              { transform: [{ scaleX: isRTL ? -1 : 1 }] },
            ]}
          />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>{t('complaints.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }>
        {/* Welcome Card */}
        <View
          style={[
            styles.welcomeCard,
            { backgroundColor: theme.colors.primary + '10' },
          ]}>
          <Text
            style={[
              styles.welcomeTitle,
              {
                color: theme.colors.primary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.welcomeTitle')}
          </Text>
          <Text
            style={[
              styles.welcomeText,
              {
                color: theme.colors.primary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.welcomeDescription')}
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsSection}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('more.mainActions')}
          </Text>
          {mainActions.map(renderMainAction)}
        </View>

        {/* Quick Filters */}
        <View style={styles.filtersSection}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('complaints.view.yourComplaints')}
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner
                type="rotating"
                size={30}
                color={theme.colors.primary}
                duration={1000}
              />
              <Text
                style={[
                  styles.loadingText,
                  { color: theme.colors.textSecondary },
                ]}>
                {t('complaints.view.loading')}
              </Text>
            </View>
          ) : (
            <View style={styles.filtersContainer}>
              {quickFilters.map(renderQuickFilter)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={closeLoginModal}
        onLogin={handleLoginPress}
      />
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    width: 28,
    height: 28,
  },
  actionContent: {
    flex: 1,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  filtersSection: {
    marginBottom: 24,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  filterCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  filterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
  filterCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ComplaintsScreen;
