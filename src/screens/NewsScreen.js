import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {
  ArrowLeft24Regular,
  News24Regular,
  Calendar24Regular,
  ChevronRight24Regular,
  Filter24Regular,
} from '@fluentui/react-native-icons';

const NewsScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Mock data - في التطبيق الحقيقي سيتم جلبها من API
  const newsData = [
    {
      id: 1,
      titleAr: 'إطلاق مبادرة جديدة لتطوير قطاع الكهرباء',
      titleEn: 'New Initiative to Develop Electricity Sector',
      summaryAr:
        'أعلنت الهيئة عن إطلاق مبادرة جديدة لتطوير قطاع الكهرباء وتحسين الخدمات المقدمة للمستهلكين.',
      summaryEn:
        'SERA announced the launch of a new initiative to develop the electricity sector and improve services for consumers.',
      date: '2024-01-15',
      category: 'announcements',
    },
    {
      id: 2,
      titleAr: 'تحديث لائحة تنظيم الكهرباء',
      titleEn: 'Update to Electricity Regulation',
      summaryAr:
        'تم تحديث لائحة تنظيم الكهرباء لتواكب التطورات الحديثة في القطاع.',
      summaryEn:
        'The electricity regulation has been updated to keep pace with recent developments in the sector.',
      date: '2024-01-10',
      category: 'regulations',
    },
    {
      id: 3,
      titleAr: 'تقرير الأداء الربعي',
      titleEn: 'Quarterly Performance Report',
      summaryAr:
        'نشر تقرير الأداء الربعي للهيئة والذي يوضح إنجازات الفترة السابقة.',
      summaryEn:
        'Published quarterly performance report showing achievements of the previous period.',
      date: '2024-01-05',
      category: 'updates',
    },
  ];

  const categories = [
    {key: 'all', labelKey: 'news.categories.all'},
    {key: 'announcements', labelKey: 'news.categories.announcements'},
    {key: 'regulations', labelKey: 'news.categories.regulations'},
    {key: 'updates', labelKey: 'news.categories.updates'},
  ];

  const filteredNews =
    selectedCategory === 'all'
      ? newsData
      : newsData.filter(item => item.category === selectedCategory);

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderCategoryButton = category => (
    <TouchableOpacity
      key={category.key}
      style={[
        styles.categoryButton,
        {
          backgroundColor:
            selectedCategory === category.key
              ? theme.colors.primary
              : theme.colors.card,
          borderColor: theme.colors.primary,
        },
      ]}
      onPress={() => setSelectedCategory(category.key)}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.categoryButtonText,
          {
            color:
              selectedCategory === category.key
                ? theme.colors.textInverse
                : theme.colors.primary,
          },
        ]}>
        {t(category.labelKey)}
      </Text>
    </TouchableOpacity>
  );

  const renderNewsItem = ({item}) => (
    <TouchableOpacity
      style={[styles.newsItem, {backgroundColor: theme.colors.card}]}
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to news detail screen
        console.log('News item pressed:', item.id);
      }}>
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <View
            style={[
              styles.newsIconContainer,
              {backgroundColor: theme.colors.primary + '20'},
            ]}>
            <News24Regular
              style={[styles.newsIcon, {color: theme.colors.primary}]}
            />
          </View>
          <View style={styles.newsInfo}>
            <Text
              style={[
                styles.newsTitle,
                {
                  textAlign: isRTL ? 'right' : 'left',
                  color: theme.colors.text,
                },
              ]}
              numberOfLines={2}>
              {i18n.language === 'ar' ? item.titleAr : item.titleEn}
            </Text>
            <View style={styles.dateContainer}>
              <Calendar24Regular
                style={[styles.dateIcon, {color: theme.colors.textSecondary}]}
              />
              <Text
                style={[styles.newsDate, {color: theme.colors.textSecondary}]}>
                {formatDate(item.date)}
              </Text>
            </View>
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
        <Text
          style={[
            styles.newsSummary,
            {
              textAlign: isRTL ? 'right' : 'left',
              color: theme.colors.textSecondary,
            },
          ]}
          numberOfLines={3}>
          {i18n.language === 'ar' ? item.summaryAr : item.summaryEn}
        </Text>
      </View>
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
        <Text style={dynamicStyles.headerTitle}>{t('news.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}>
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      {/* News List */}
      {filteredNews.length > 0 ? (
        <FlatList
          data={filteredNews}
          renderItem={renderNewsItem}
          keyExtractor={item => item.id.toString()}
          style={styles.newsList}
          contentContainerStyle={styles.newsListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Filter24Regular
            style={[styles.emptyIcon, {color: theme.colors.textSecondary}]}
          />
          <Text
            style={[
              styles.emptyText,
              {
                color: theme.colors.textSecondary,
                textAlign: 'center',
              },
            ]}>
            {t('news.noNews')}
          </Text>
        </View>
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
  categoriesContainer: {
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  newsList: {
    flex: 1,
  },
  newsListContent: {
    padding: 20,
  },
  newsItem: {
    borderRadius: 12,
    padding: 16,
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
  newsContent: {
    flex: 1,
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  newsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  newsIcon: {
    width: 20,
    height: 20,
  },
  newsInfo: {
    flex: 1,
    marginRight: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  newsDate: {
    fontSize: 12,
  },
  chevronIcon: {
    width: 16,
    height: 16,
  },
  newsSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default NewsScreen;
