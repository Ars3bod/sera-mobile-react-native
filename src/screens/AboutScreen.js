import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {
  ArrowLeft24Regular,
  Target24Regular,
  Eye24Regular,
  Star24Regular,
  Calendar24Regular,
} from '@fluentui/react-native-icons';

const AboutScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const isRTL = i18n.language === 'ar';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const aboutSections = [
    {
      titleKey: 'about.mission.title',
      descriptionKey: 'about.mission.description',
      icon: Target24Regular,
      color: theme.colors.primary,
    },
    {
      titleKey: 'about.vision.title',
      descriptionKey: 'about.vision.description',
      icon: Eye24Regular,
      color: '#2196F3',
    },
    {
      titleKey: 'about.establishment.title',
      descriptionKey: 'about.establishment.description',
      icon: Calendar24Regular,
      color: '#FF9800',
    },
  ];

  const values = [
    {key: 'transparency', color: '#4CAF50'},
    {key: 'fairness', color: '#9C27B0'},
    {key: 'excellence', color: '#FF5722'},
    {key: 'innovation', color: '#00BCD4'},
  ];

  const renderSection = section => {
    const IconComponent = section.icon;
    return (
      <View
        key={section.titleKey}
        style={[styles.section, {backgroundColor: theme.colors.card}]}>
        <View
          style={[
            styles.sectionHeader,
            {flexDirection: isRTL ? 'row-reverse' : 'row'},
          ]}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: section.color + '20',
                marginRight: isRTL ? 0 : 16,
                marginLeft: isRTL ? 16 : 0,
              },
            ]}>
            <IconComponent
              style={[styles.sectionIcon, {color: section.color}]}
            />
          </View>
          <Text
            style={[
              styles.sectionTitle,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.text,
              },
            ]}>
            {t(section.titleKey)}
          </Text>
        </View>
        <Text
          style={[
            styles.sectionDescription,
            {
              textAlign: isRTL ? 'right' : 'left',
              color: theme.colors.textSecondary,
            },
          ]}>
          {t(section.descriptionKey)}
        </Text>
      </View>
    );
  };

  const renderValues = () => (
    <View style={[styles.section, {backgroundColor: theme.colors.card}]}>
      <View
        style={[
          styles.sectionHeader,
          {flexDirection: isRTL ? 'row-reverse' : 'row'},
        ]}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: theme.colors.primary + '20',
              marginRight: isRTL ? 0 : 16,
              marginLeft: isRTL ? 16 : 0,
            },
          ]}>
          <Star24Regular
            style={[styles.sectionIcon, {color: theme.colors.primary}]}
          />
        </View>
        <Text
          style={[
            styles.sectionTitle,
            {
              textAlign: isRTL ? 'right' : 'left',
              color: theme.colors.text,
            },
          ]}>
          {t('about.values.title')}
        </Text>
      </View>
      <View style={styles.valuesGrid}>
        {values.map(value => (
          <View
            key={value.key}
            style={[
              styles.valueItem,
              {backgroundColor: value.color + '15', borderColor: value.color},
            ]}>
            <Text
              style={[
                styles.valueText,
                {color: value.color, textAlign: 'center'},
              ]}>
              {t(`about.values.${value.key}`)}
            </Text>
          </View>
        ))}
      </View>
    </View>
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
        <Text style={dynamicStyles.headerTitle}>{t('about.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {aboutSections.map(renderSection)}
        {renderValues()}

        {/* Establishment Year Highlight */}
        <View
          style={[
            styles.establishmentHighlight,
            {backgroundColor: theme.colors.primary + '10'},
          ]}>
          <Text
            style={[
              styles.establishmentYear,
              {color: theme.colors.primary, textAlign: 'center'},
            ]}>
            {t('about.establishment.year')}
          </Text>
        </View>
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
  section: {
    borderRadius: 12,
    padding: 20,
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
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 24,
    height: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueItem: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 12,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
  },
  establishmentHighlight: {
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  establishmentYear: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AboutScreen;
