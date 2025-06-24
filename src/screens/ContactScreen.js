import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft24Regular,
  Location24Regular,
  Phone24Regular,
  Mail24Regular,
  Globe24Regular,
  Clock24Regular,
} from '@fluentui/react-native-icons';

const ContactScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const isRTL = i18n.language === 'ar';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${t('contact.phone.number')}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${t('contact.email.address')}`);
  };

  const handleWebsitePress = () => {
    Linking.openURL(`https://${t('contact.website.url')}`);
  };

  const contactItems = [
    {
      titleKey: 'contact.address.title',
      contentKey: 'contact.address.street',
      subContentKey: 'contact.address.city',
      icon: Location24Regular,
      color: '#00623B',
      onPress: null,
    },
    {
      titleKey: 'contact.phone.title',
      contentKey: 'contact.phone.number',
      icon: Phone24Regular,
      color: '#00623B',
      onPress: handlePhonePress,
    },
    {
      titleKey: 'contact.email.title',
      contentKey: 'contact.email.address',
      icon: Mail24Regular,
      color: '#00623B',
      onPress: handleEmailPress,
    },
    {
      titleKey: 'contact.website.title',
      contentKey: 'contact.website.url',
      icon: Globe24Regular,
      color: '#00623B',
      onPress: handleWebsitePress,
    },
    {
      titleKey: 'contact.workingHours.title',
      contentKey: 'contact.workingHours.schedule',
      icon: Clock24Regular,
      color: '#00623B',
      onPress: null,
    },
  ];

  const renderContactItem = item => {
    const IconComponent = item.icon;
    const isClickable = item.onPress !== null;

    const content = (
      <View
        style={[
          styles.contactItem,
          {
            backgroundColor: theme.colors.card,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
          isClickable && styles.clickableItem,
        ]}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.color + '20',
              marginRight: isRTL ? 0 : 16,
              marginLeft: isRTL ? 16 : 0,
            },
          ]}>
          <IconComponent style={[styles.contactIcon, { color: item.color }]} />
        </View>
        <View style={styles.contactContent}>
          <Text
            style={[
              styles.contactTitle,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: theme.colors.text,
              },
            ]}>
            {t(item.titleKey)}
          </Text>
          <Text
            style={[
              styles.contactText,
              {
                textAlign: isRTL ? 'right' : 'left',
                color: isClickable ? item.color : theme.colors.textSecondary,
              },
            ]}>
            {t(item.contentKey)}
          </Text>
          {item.subContentKey && (
            <Text
              style={[
                styles.contactSubText,
                {
                  textAlign: isRTL ? 'right' : 'left',
                  color: theme.colors.textSecondary,
                },
              ]}>
              {t(item.subContentKey)}
            </Text>
          )}
        </View>
      </View>
    );

    if (isClickable) {
      return (
        <TouchableOpacity
          key={item.titleKey}
          onPress={item.onPress}
          activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      );
    }

    return <View key={item.titleKey}>{content}</View>;
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
        <Text style={dynamicStyles.headerTitle}>{t('contact.title')}</Text>
        <View style={styles.placeholderView} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {contactItems.map(renderContactItem)}

        {/* Additional Information */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.colors.primary + '10' },
          ]}>
          <Text
            style={[
              styles.infoTitle,
              {
                color: theme.colors.primary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {t('contact.address.country')}
          </Text>
          {/* <Text
            style={[
              styles.infoText,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            المملكة العربية السعودية
          </Text> */}
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
  contactItem: {
    alignItems: 'center',
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
  clickableItem: {
    transform: [{ scale: 1 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactIcon: {
    width: 24,
    height: 24,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  contactSubText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ContactScreen;
