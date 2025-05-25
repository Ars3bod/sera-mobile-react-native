import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {
  ArrowLeft24Regular,
  Search24Regular,
  QuestionCircle24Regular,
  ChevronDown24Regular,
  ChevronUp24Regular,
} from '@fluentui/react-native-icons';

const FAQScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleGoBack = () => {
    navigation.goBack();
  };

  const categories = [
    {key: 'general', labelKey: 'faq.categories.general'},
    {key: 'services', labelKey: 'faq.categories.services'},
    {key: 'billing', labelKey: 'faq.categories.billing'},
    {key: 'technical', labelKey: 'faq.categories.technical'},
  ];

  // Mock FAQ data - في التطبيق الحقيقي سيتم جلبها من API
  const faqData = t('faq.questions', {returnObjects: true}) || [];

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory =
      selectedCategory === 'general' || item.category === selectedCategory;
    const question = item.question;
    const answer = item.answer;
    const matchesSearch =
      searchQuery === '' ||
      question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = itemId => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
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

  const renderFAQItem = ({item}) => {
    const isExpanded = expandedItems.has(item.id);
    const ChevronIcon = isExpanded ? ChevronUp24Regular : ChevronDown24Regular;

    return (
      <View style={[styles.faqItem, {backgroundColor: theme.colors.card}]}>
        <TouchableOpacity
          style={styles.questionContainer}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}>
          <View style={styles.questionHeader}>
            <View
              style={[
                styles.questionIconContainer,
                {backgroundColor: theme.colors.primary + '20'},
              ]}>
              <QuestionCircle24Regular
                style={[styles.questionIcon, {color: theme.colors.primary}]}
              />
            </View>
            <Text
              style={[
                styles.questionText,
                {
                  textAlign: isRTL ? 'right' : 'left',
                  color: theme.colors.text,
                  flex: 1,
                },
              ]}>
              {item.question}
            </Text>
            <ChevronIcon
              style={[styles.chevronIcon, {color: theme.colors.icon}]}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text
              style={[
                styles.answerText,
                {
                  textAlign: isRTL ? 'right' : 'left',
                  color: theme.colors.textSecondary,
                },
              ]}>
              {item.answer}
            </Text>
          </View>
        )}
      </View>
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
    searchInput: {
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.inputBorder,
      color: theme.colors.inputText,
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
        <Text style={dynamicStyles.headerTitle}>{t('faq.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, dynamicStyles.searchInput]}>
          <Search24Regular
            style={[styles.searchIcon, {color: theme.colors.icon}]}
          />
          <TextInput
            style={[styles.searchInput, dynamicStyles.searchInput]}
            placeholder={t('faq.searchPlaceholder')}
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
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

      {/* FAQ List */}
      {filteredFAQs.length > 0 ? (
        <FlatList
          data={filteredFAQs}
          renderItem={renderFAQItem}
          keyExtractor={item => item.id.toString()}
          style={styles.faqList}
          contentContainerStyle={styles.faqListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <QuestionCircle24Regular
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
            {t('faq.noResults')}
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
  searchContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  categoriesContainer: {
    paddingVertical: 16,
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
  faqList: {
    flex: 1,
  },
  faqListContent: {
    padding: 20,
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  questionContainer: {
    padding: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questionIcon: {
    width: 20,
    height: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginRight: 12,
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 68, // Align with question text
  },
  answerText: {
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

export default FAQScreen;
