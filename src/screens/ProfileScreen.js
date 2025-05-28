import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {useUser} from '../context/UserContext';
import {
  ArrowLeft24Regular,
  Person24Regular,
  Calendar24Regular,
  Phone24Regular,
  Document24Regular,
  Globe24Regular,
  Checkmark24Regular,
} from '@fluentui/react-native-icons';

const {width} = Dimensions.get('window');

export default function ProfileScreen({navigation}) {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const {user, isAuthenticated} = useUser();
  const isArabic = i18n.language === 'ar';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDate = dateString => {
    if (!dateString) return isArabic ? 'غير متوفر' : 'Not Available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return isArabic ? 'غير متوفر' : 'Not Available';
    }
  };

  const formatHijriDate = hijriString => {
    if (!hijriString) return isArabic ? 'غير متوفر' : 'Not Available';
    const hijriStr = hijriString.toString();
    if (hijriStr.length >= 8) {
      const year = hijriStr.substring(0, 4);
      const month = hijriStr.substring(4, 6);
      const day = hijriStr.substring(6, 8);
      return `${year}/${month}/${day}`;
    }
    return hijriString;
  };

  const ProfileInfoCard = ({
    icon,
    title,
    value,
    iconColor = theme.colors.primary,
  }) => (
    <View style={dynamicStyles.infoCard}>
      <View style={dynamicStyles.infoIconContainer}>
        {icon &&
          React.cloneElement(icon, {
            style: [dynamicStyles.infoIcon, {color: iconColor}],
          })}
      </View>
      <View style={dynamicStyles.infoContent}>
        <Text style={dynamicStyles.infoTitle}>{title}</Text>
        <Text style={dynamicStyles.infoValue}>
          {value || (isArabic ? 'غير متوفر' : 'Not Available')}
        </Text>
      </View>
    </View>
  );

  const content = {
    title: isArabic ? 'الملف الشخصي' : 'Profile',
    personalInfo: isArabic ? 'المعلومات الشخصية' : 'Personal Information',
    fullName: isArabic ? 'الاسم الكامل' : 'Full Name',
    nationalId: isArabic ? 'رقم الهوية' : 'National ID',
    dateOfBirth: isArabic ? 'تاريخ الميلاد' : 'Date of Birth',
    dateOfBirthHijri: isArabic ? 'تاريخ الميلاد الهجري' : 'Hijri Date of Birth',
    nationality: isArabic ? 'الجنسية' : 'Nationality',
    gender: isArabic ? 'الجنس' : 'Gender',
    documentInfo: isArabic ? 'معلومات الهوية' : 'ID Information',
    idIssueDate: isArabic ? 'تاريخ إصدار الهوية' : 'ID Issue Date',
    idExpiryDate: isArabic ? 'تاريخ انتهاء الهوية' : 'ID Expiry Date',
    notLoggedIn: isArabic
      ? 'يرجى تسجيل الدخول لعرض الملف الشخصي'
      : 'Please log in to view profile',
    male: isArabic ? 'ذكر' : 'Male',
    female: isArabic ? 'أنثى' : 'Female',
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: isArabic ? 0 : 12,
      marginLeft: isArabic ? 12 : 0,
    },
    backIcon: {
      width: 24,
      height: 24,
      color: theme.colors.primary,
      transform: [{scaleX: isArabic ? -1 : 1}],
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
      textAlign: isArabic ? 'right' : 'left',
    },
    scrollContent: {
      padding: 20,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: 30,
      padding: 24,
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    avatarIcon: {
      width: 40,
      height: 40,
      color: theme.colors.primary,
    },
    profileName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    profileId: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
      marginTop: 8,
      textAlign: isArabic ? 'right' : 'left',
    },
    infoCard: {
      flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    infoIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: isArabic ? 0 : 16,
      marginLeft: isArabic ? 16 : 0,
    },
    infoIcon: {
      width: 24,
      height: 24,
    },
    infoContent: {
      flex: 1,
    },
    infoTitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      textAlign: isArabic ? 'right' : 'left',
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '600',
      textAlign: isArabic ? 'right' : 'left',
    },
    notLoggedInContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    notLoggedInText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={dynamicStyles.container} edges={['top']}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />

        {/* Header */}
        <View style={dynamicStyles.header}>
          <TouchableOpacity
            style={dynamicStyles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <ArrowLeft24Regular style={dynamicStyles.backIcon} />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>{content.title}</Text>
        </View>

        <View style={dynamicStyles.notLoggedInContainer}>
          <Text style={dynamicStyles.notLoggedInText}>
            {content.notLoggedIn}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={dynamicStyles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}>
          <ArrowLeft24Regular style={dynamicStyles.backIcon} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>{content.title}</Text>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={dynamicStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={dynamicStyles.profileHeader}>
          <View style={dynamicStyles.avatarContainer}>
            <Person24Regular style={dynamicStyles.avatarIcon} />
          </View>
          <Text style={dynamicStyles.profileName}>
            {isArabic ? user.arFullName : user.enFullName}
          </Text>
          <Text style={dynamicStyles.profileId}>{user.nationalId}</Text>
        </View>

        {/* Personal Information */}
        <Text style={dynamicStyles.sectionTitle}>{content.personalInfo}</Text>

        <ProfileInfoCard
          icon={<Person24Regular />}
          title={content.fullName}
          value={isArabic ? user.arFullName : user.enFullName}
        />

        <ProfileInfoCard
          icon={<Document24Regular />}
          title={content.nationalId}
          value={user.nationalId}
        />

        <ProfileInfoCard
          icon={<Calendar24Regular />}
          title={content.dateOfBirth}
          value={formatDate(user.dobG)}
        />

        <ProfileInfoCard
          icon={<Calendar24Regular />}
          title={content.dateOfBirthHijri}
          value={formatHijriDate(user.dobH)}
        />

        <ProfileInfoCard
          icon={<Globe24Regular />}
          title={content.nationality}
          value={isArabic ? user.arNationality : user.enNationality}
        />

        <ProfileInfoCard
          icon={<Person24Regular />}
          title={content.gender}
          value={user.gender === 'M' ? content.male : content.female}
        />

        {/* Document Information */}
        <Text style={dynamicStyles.sectionTitle}>{content.documentInfo}</Text>

        <ProfileInfoCard
          icon={<Checkmark24Regular />}
          title={content.idIssueDate}
          value={formatDate(user.idIssueDateG)}
          iconColor="#4CAF50"
        />

        <ProfileInfoCard
          icon={<Calendar24Regular />}
          title={content.idExpiryDate}
          value={formatDate(user.idExpiryDateG)}
          iconColor="#FF9800"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
