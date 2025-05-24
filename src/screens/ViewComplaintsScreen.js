import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {
  ArrowLeft24Regular,
  Filter24Regular,
  DocumentText24Regular,
  CheckmarkCircle24Regular,
  Clock24Regular,
  Dismiss24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-native-icons';

const ViewComplaintsScreen = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  const initialFilter = route.params?.filter || 'all';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [complaints, setComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const filters = [
    {
      key: 'all',
      labelAr: t('complaints.filters.all'),
      labelEn: t('complaints.filters.all'),
      icon: DocumentText24Regular,
      color: theme.colors.primary,
    },
    {
      key: 'open',
      labelAr: t('complaints.filters.open'),
      labelEn: t('complaints.filters.open'),
      icon: Clock24Regular,
      color: '#FF9800',
    },
    {
      key: 'closed',
      labelAr: t('complaints.filters.closed'),
      labelEn: t('complaints.filters.closed'),
      icon: CheckmarkCircle24Regular,
      color: '#4CAF50',
    },
    {
      key: 'rejected',
      labelAr: t('complaints.filters.rejected'),
      labelEn: t('complaints.filters.rejected'),
      icon: Dismiss24Regular,
      color: '#F44336',
    },
  ];

  // Mock data -
  const mockComplaints = [
    {
      id: '12345',
      titleAr: t('complaints.complaintTypes.powerOutage'),
      titleEn: t('complaints.complaintTypes.powerOutage'),
      status: 'open',
      statusAr: t('complaints.view.status.open'),
      statusEn: t('complaints.view.status.open'),
      date: '2024-01-15',
      serviceProvider: t('complaints.serviceProviders.sec'),
      priority: 'high',
    },
    {
      id: '12344',
      titleAr: t('complaints.complaintTypes.highBill'),
      titleEn: t('complaints.complaintTypes.highBill'),
      status: 'closed',
      statusAr: t('complaints.view.status.closed'),
      statusEn: t('complaints.view.status.closed'),
      date: '2024-01-12',
      serviceProvider: t('complaints.serviceProviders.sec'),
      priority: 'medium',
    },
    {
      id: '12343',
      titleAr: t('complaints.complaintTypes.connectionDelay'),
      titleEn: t('complaints.complaintTypes.connectionDelay'),
      status: 'open',
      statusAr: t('complaints.view.status.open'),
      statusEn: t('complaints.view.status.open'),
      date: '2024-01-10',
      serviceProvider: t('complaints.serviceProviders.marafiq'),
      priority: 'low',
    },
    {
      id: '12342',
      titleAr: t('complaints.complaintTypes.serviceQuality'),
      titleEn: t('complaints.complaintTypes.serviceQuality'),
      status: 'rejected',
      statusAr: t('complaints.view.status.rejected'),
      statusEn: t('complaints.view.status.rejected'),
      date: '2024-01-08',
      serviceProvider: t('complaints.serviceProviders.marafiq'),
      priority: 'medium',
    },
  ];

  const loadComplaints = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setComplaints(mockComplaints);
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadComplaints();
    setRefreshing(false);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const getFilteredComplaints = () => {
    if (activeFilter === 'all') return complaints;
    return complaints.filter(complaint => complaint.status === activeFilter);
  };

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

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    if (isRTL) {
      return date.toLocaleDateString('ar-SA');
    }
    return date.toLocaleDateString('en-US');
  };

  const navigateToComplaintDetails = complaint => {
    // في المستقبل يمكن إضافة شاشة تفاصيل الشكوى
    console.log('Navigate to complaint details:', complaint.id);
  };

  const renderFilterTab = filter => {
    const IconComponent = filter.icon;
    const isActive = activeFilter === filter.key;

    return (
      <TouchableOpacity
        key={filter.key}
        style={[
          styles.filterTab,
          {
            backgroundColor: isActive ? filter.color + '20' : 'transparent',
            borderColor: isActive ? filter.color : theme.colors.border,
          },
        ]}
        onPress={() => setActiveFilter(filter.key)}
        activeOpacity={0.7}>
        <IconComponent
          style={[
            styles.filterIcon,
            {color: isActive ? filter.color : theme.colors.icon},
          ]}
        />
        <Text
          style={[
            styles.filterText,
            {
              color: isActive ? filter.color : theme.colors.textSecondary,
              fontWeight: isActive ? 'bold' : 'normal',
            },
          ]}>
          {isRTL ? filter.labelAr : filter.labelEn}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderComplaintItem = ({item}) => (
    <TouchableOpacity
      style={[styles.complaintCard, {backgroundColor: theme.colors.card}]}
      onPress={() => navigateToComplaintDetails(item)}
      activeOpacity={0.7}>
      <View style={styles.complaintHeader}>
        <View style={styles.complaintIdContainer}>
          <Text
            style={[
              styles.complaintId,
              {
                color: theme.colors.primary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            #{item.id}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(item.status) + '20'},
            ]}>
            <Text
              style={[styles.statusText, {color: getStatusColor(item.status)}]}>
              {isRTL ? item.statusAr : item.statusEn}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.complaintDate,
            {
              color: theme.colors.textSecondary,
              textAlign: isRTL ? 'left' : 'right',
            },
          ]}>
          {formatDate(item.date)}
        </Text>
      </View>

      <Text
        style={[
          styles.complaintTitle,
          {
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}
        numberOfLines={2}>
        {isRTL ? item.titleAr : item.titleEn}
      </Text>

      <View style={styles.complaintFooter}>
        <Text
          style={[
            styles.serviceProvider,
            {
              color: theme.colors.textSecondary,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
          numberOfLines={1}>
          {item.serviceProvider}
        </Text>
        <View style={styles.complaintActions}>
          <View
            style={[
              styles.priorityBadge,
              {backgroundColor: getPriorityColor(item.priority) + '20'},
            ]}>
            <Text
              style={[
                styles.priorityText,
                {color: getPriorityColor(item.priority)},
              ]}>
              {t(`complaints.view.priority.${item.priority}`)}
            </Text>
          </View>
          <ChevronRight24Regular
            style={[
              styles.chevronIcon,
              {
                transform: [{scaleX: isRTL ? -1 : 1}],
                color: theme.colors.icon,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
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
        {t('complaints.view.noComplaints')}
      </Text>
      <Text
        style={[
          styles.emptySubtitle,
          {
            color: theme.colors.textSecondary,
            textAlign: 'center',
          },
        ]}>
        {t('complaints.view.noComplaintsMessage')}
      </Text>
    </View>
  );

  const filteredComplaints = getFilteredComplaints();

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
          <ArrowLeft24Regular
            style={[
              dynamicStyles.backIcon,
              {transform: [{scaleX: isRTL ? -1 : 1}]},
            ]}
          />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>
          {t('complaints.view.title')}
        </Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}>
          {filters.map(renderFilterTab)}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text
              style={[styles.loadingText, {color: theme.colors.textSecondary}]}>
              {t('complaints.view.loading')}
            </Text>
          </View>
        ) : filteredComplaints.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredComplaints}
            renderItem={renderComplaintItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
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
      </View>
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
  filtersContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  filtersScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  listContent: {
    padding: 20,
  },
  complaintCard: {
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
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complaintIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  complaintId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
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
  complaintDate: {
    fontSize: 12,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 22,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceProvider: {
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  complaintActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  chevronIcon: {
    width: 16,
    height: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ViewComplaintsScreen;
