import React, {useState} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import {
  ArrowLeft24Regular,
  DocumentAdd24Regular,
  Eye24Regular,
  Building24Regular,
  Settings24Regular,
} from '@fluentui/react-native-icons';

// Mock data for permits overview
const MOCK_PERMITS_STATS = {
  all: 12,
  completed: 3,
  processing: 5,
  unacceptable: 1,
  unsent: 2,
  returned: 1,
};

const PermitsScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  const [stats, setStats] = useState(MOCK_PERMITS_STATS);
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNewPermitPress = permitType => {
    // Navigate to create permit screen (to be implemented)
    console.log('Create permit:', permitType);
    // navigation.navigate('CreatePermit', {permitType});
  };

  const handleViewPermitsPress = () => {
    // Navigate to view permits screen
    navigation.navigate('ViewPermits');
  };

  const handleOverviewPress = filterKey => {
    // Navigate to ViewPermits screen with the selected filter
    navigation.navigate('ViewPermits', {filter: filterKey});
  };

  // Load permits stats when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      loadPermitsStats();
    }, []),
  );

  const loadPermitsStats = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(MOCK_PERMITS_STATS);
    } catch (error) {
      console.error('Error loading permits stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const permitTypes = [
    {
      id: 'powerGeneration',
      titleKey: 'permits.permitTypes.powerGeneration.title',
      descriptionKey: 'permits.permitTypes.powerGeneration.description',
      icon: Building24Regular,
      color: theme.colors.primary,
    },
    {
      id: 'districtCooling',
      titleKey: 'permits.permitTypes.districtCooling.title',
      descriptionKey: 'permits.permitTypes.districtCooling.description',
      icon: Settings24Regular,
      color: theme.colors.primary,
    },
  ];

  const overviewItems = [
    {
      key: 'all',
      titleKey: 'permits.overview.all',
      count: stats.all,
      color: theme.colors.primary,
    },
    {
      key: 'completed',
      titleKey: 'permits.overview.completed',
      count: stats.completed,
      color: '#4CAF50',
    },
    {
      key: 'processing',
      titleKey: 'permits.overview.processing',
      count: stats.processing,
      color: '#FF9800',
    },
    {
      key: 'unacceptable',
      titleKey: 'permits.overview.unacceptable',
      count: stats.unacceptable,
      color: '#F44336',
    },
    {
      key: 'unsent',
      titleKey: 'permits.overview.unsent',
      count: stats.unsent,
      color: '#9E9E9E',
    },
    {
      key: 'returned',
      titleKey: 'permits.overview.returned',
      count: stats.returned,
      color: '#FF5722',
    },
  ];

  const renderPermitTypeCard = permitType => {
    const IconComponent = permitType.icon;
    return (
      <TouchableOpacity
        key={permitType.id}
        style={[
          styles.actionCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => handleNewPermitPress(permitType.id)}
        activeOpacity={0.7}>
        <View
          style={[
            styles.actionIconContainer,
            {backgroundColor: permitType.color + '20'},
          ]}>
          <IconComponent
            style={[styles.actionIcon, {color: permitType.color}]}
          />
        </View>
        <View style={styles.actionContent}>
          <Text
            style={[
              styles.actionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t(permitType.titleKey)}
          </Text>
          <Text
            style={[
              styles.actionDescription,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            numberOfLines={2}>
            {t(permitType.descriptionKey)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOverviewItem = item => (
    <TouchableOpacity
      key={item.key}
      style={[
        styles.overviewItem,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => handleOverviewPress(item.key)}
      activeOpacity={0.7}>
      <View
        style={[
          styles.overviewIconContainer,
          {backgroundColor: item.color + '20'},
        ]}>
        <Text style={[styles.overviewCount, {color: item.color}]}>
          {item.count}
        </Text>
      </View>
      <Text
        style={[
          styles.overviewTitle,
          {
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}
        numberOfLines={2}>
        {t(item.titleKey)}
      </Text>
    </TouchableOpacity>
  );

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
        <Text style={dynamicStyles.headerTitle}>{t('permits.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text
            style={[
              styles.welcomeTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('permits.welcomeTitle')}
          </Text>
          <Text
            style={[
              styles.welcomeDescription,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('permits.welcomeDescription')}
          </Text>
        </View>

        {/* Permit Types Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('permits.newPermit.title')}
          </Text>
          <View style={styles.actionsContainer}>
            {permitTypes.map(renderPermitTypeCard)}
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('permits.overview.title')}
          </Text>
          <View style={styles.overviewGrid}>
            {overviewItems.map(renderOverviewItem)}
          </View>
        </View>

        {/* View All Permits */}
        <TouchableOpacity
          style={[
            styles.viewAllButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={handleViewPermitsPress}
          activeOpacity={0.7}>
          <View
            style={[
              styles.viewAllIconContainer,
              {backgroundColor: theme.colors.primary + '20'},
            ]}>
            <Eye24Regular
              style={[styles.viewAllIcon, {color: theme.colors.primary}]}
            />
          </View>
          <View style={styles.viewAllContent}>
            <Text
              style={[
                styles.viewAllTitle,
                {
                  color: theme.colors.text,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {t('permits.viewPermits.title')}
            </Text>
            <Text
              style={[
                styles.viewAllDescription,
                {
                  color: theme.colors.textSecondary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}>
              {t('permits.viewPermits.description')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  actionContent: {
    flex: 1,
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  overviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  viewAllIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  viewAllIcon: {
    width: 24,
    height: 24,
  },
  viewAllContent: {
    flex: 1,
  },
  viewAllTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  viewAllDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PermitsScreen;
