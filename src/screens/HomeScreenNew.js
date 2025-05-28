import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {useUser} from '../context/UserContext';
import {
  People24Regular,
  Briefcase24Regular,
  Settings24Regular,
  CheckmarkCircle24Regular,
  Money24Regular,
  Home24Regular,
  Apps24Regular,
  Chat24Regular,
  MoreHorizontal24Regular,
  Clock24Regular,
  Dismiss24Regular,
  DocumentText24Regular,
  PersonCall24Regular,
  ChartMultiple24Regular,
  Alert24Regular,
  Star24Regular,
  Clipboard24Regular,
  Timer24Regular,
  Person24Regular,
  News24Regular,
  Megaphone24Regular,
  ChevronRight24Regular,
  Calendar24Regular,
  Share24Regular,
} from '@fluentui/react-native-icons';

export default function HomeScreenNew({navigation}) {
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const {user, isAuthenticated} = useUser();
  const isRTL = i18n.language === 'ar';
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // Function to get initials from English names
  const getEnglishInitials = (enFirst, enFather) => {
    const firstInitial = enFirst ? enFirst.charAt(0).toUpperCase() : '';
    const secondInitial = enFather ? enFather.charAt(0).toUpperCase() : '';
    return firstInitial + secondInitial;
  };

  // Mock user data - in real app, get from context/API
  const userData = {
    name: isRTL ? user?.arFullName || 'مستخدم' : user?.enFullName || 'User',
    lastVisit: isRTL ? 'منذ 3 أيام' : '3 days ago',
    accountStatus: 'verified',
    activeComplaints: 2,
    completedTasks: 5,
    pendingRequests: 1,
    unreadNotifications: 3,
    avatar: user
      ? getEnglishInitials(user.enFirst, user.enFather)
      : isRTL
      ? 'مس'
      : 'US', // First two letters of English names for avatar
  };

  // Hardcoded translations for now
  const translations = {
    lastVisit: isRTL ? 'آخر زيارة' : 'Last visit',
    accountVerified: isRTL ? 'الحساب موثق' : 'Account Verified',
    stats: {
      activeComplaints: isRTL ? 'نشطة' : 'Active',
      completed: isRTL ? 'منجزة' : 'Completed',
      pending: isRTL ? 'قيد المراجعة' : 'Pending',
    },
    quickActionsTitle: isRTL ? 'الإجراءات السريعة' : 'Quick Actions',
    quickActions: {
      newComplaint: isRTL ? 'شكوى جديدة' : 'New Complaint',
      newPermit: isRTL ? 'تصريح جديد' : 'New Permit',
      contactUs: isRTL ? 'تواصل معنا' : 'Contact Us',
      shareData: isRTL ? 'مشاركة البيانات' : 'Share Data',
    },
    recentActivityTitle: isRTL ? 'النشاط الأخير' : 'Recent Activity',
    activities: {
      complaintReply: isRTL
        ? 'تم الرد على شكواك'
        : 'Your complaint received a reply',
      permitReceived: isRTL
        ? 'تم استلام طلب التصريح'
        : 'Permit request received',
      newUpdate: isRTL ? 'تحديث جديد متاح' : 'New update available',
      twoHoursAgo: isRTL ? 'منذ ساعتين' : '2 hours ago',
      yesterday: isRTL ? 'أمس' : 'Yesterday',
      threeDaysAgo: isRTL ? 'منذ 3 أيام' : '3 days ago',
    },
    comingSoon: {
      title: isRTL ? 'قريباً' : 'Coming Soon',
      message: isRTL
        ? 'هذه الميزة قادمة قريباً. ترقبوا التحديثات!'
        : 'This feature is coming soon. Stay tuned for updates!',
      okButton: isRTL ? 'حسناً' : 'OK',
    },
    tabs: {
      main: isRTL ? 'الرئيسية' : 'Main',
      services: isRTL ? 'الخدمات' : 'Services',
      chat: isRTL ? 'المحادثة' : 'Chat',
      more: isRTL ? 'المزيد' : 'More',
    },
    seraUpdates: {
      title: isRTL ? 'آخر التحديثات من الهيئة' : 'Latest SERA Updates',
      seeAll: isRTL ? 'عرض الكل' : 'See All',
      new: isRTL ? 'جديد' : 'New',
    },
    profile: {
      viewProfile: isRTL ? 'عرض الملف الشخصي' : 'View Profile',
    },
    compensation: {
      title: isRTL ? 'معايير التعويضات ' : 'Compensation Standards',
      subtitle: isRTL
        ? 'حقوقك كمستهلك للكهرباء'
        : 'Your Rights as Electricity Consumer',
      viewAll: isRTL ? 'عرض جميع المعايير' : 'View All Standards',
      period: isRTL ? 'المدة المطلوبة' : 'Required Period',
      compensation: isRTL ? 'التعويض' : 'Compensation',
      additionalCompensation: isRTL
        ? 'التعويض الإضافي'
        : 'Additional Compensation',
    },
  };

  // Mock SERA activities and announcements
  const seraUpdates = [
    {
      id: 1,
      type: 'announcement',
      icon: Megaphone24Regular,
      title: isRTL
        ? 'إعلان هام: تحديث أنظمة الكهرباء'
        : 'Important: Electricity Systems Update',
      description: isRTL
        ? 'تم تحديث أنظمة شبكة الكهرباء الوطنية لتحسين الخدمة'
        : 'National electricity grid systems updated for improved service',
      time: isRTL ? 'منذ ساعة' : '1 hour ago',
      isNew: true,
    },
    {
      id: 2,
      type: 'news',
      icon: News24Regular,
      title: isRTL
        ? 'أخبار: انطلاق مشروع الطاقة المتجددة'
        : 'News: Renewable Energy Project Launch',
      description: isRTL
        ? 'بدء تنفيذ مشاريع جديدة للطاقة الشمسية في المملكة'
        : 'New solar energy projects implementation begins in the Kingdom',
      time: isRTL ? 'منذ 3 ساعات' : '3 hours ago',
      isNew: false,
    },
    {
      id: 3,
      type: 'regulation',
      icon: DocumentText24Regular,
      title: isRTL
        ? 'تنظيم: قواعد جديدة لتراخيص الكهرباء'
        : 'Regulation: New Electricity License Rules',
      description: isRTL
        ? 'صدور قواعد محدثة لإصدار تراخيص مزاولة أنشطة الكهرباء'
        : 'Updated rules for electricity activity licenses issued',
      time: isRTL ? 'أمس' : 'Yesterday',
      isNew: false,
    },
  ];

  // Consumer Compensation Standards Data from SERA
  const compensationStandards = [
    {
      id: 1,
      icon: DocumentText24Regular,
      title: isRTL
        ? 'تسجيل أو إلغاء خدمة الكهرباء'
        : 'Register/Cancel Electricity Service',
      period: isRTL ? 'خلال 3 أيام عمل' : 'Within 3 working days',
      compensation: isRTL ? '100 ريال' : 'SAR 100',
      additionalCompensation: isRTL
        ? '20 ريال لكل يوم عمل إضافي'
        : 'SAR 20 per additional working day',
      color: '#00623B',
      category: 'registration',
    },
    {
      id: 2,
      icon: Money24Regular,
      title: isRTL
        ? 'توصيل أو تعديل الخدمة بعد الدفع'
        : 'Service Delivery/Modification After Payment',
      period: isRTL
        ? '20 يوم (جهد منخفض) - 60 يوم (جهد متوسط)'
        : '20 days (low voltage) - 60 days (medium voltage)',
      compensation: isRTL ? '400 ريال' : 'SAR 400',
      additionalCompensation: isRTL
        ? '20 ريال لكل يوم عمل إضافي'
        : 'SAR 20 per additional working day',
      color: '#00623B',
      category: 'service',
    },
    {
      id: 3,
      icon: Clock24Regular,
      title: isRTL
        ? 'استعادة الخدمة بعد الدفع'
        : 'Service Restoration After Payment',
      period: isRTL
        ? 'خلال ساعتين من إشعار الدفع'
        : 'Within 2 hours of payment notification',
      compensation: isRTL ? '100 ريال' : 'SAR 100',
      additionalCompensation: isRTL
        ? '100 ريال لكل ساعة إضافية'
        : 'SAR 100 per additional hour',
      color: '#00623B',
      category: 'restoration',
    },
    {
      id: 4,
      icon: Alert24Regular,
      title: isRTL
        ? 'الإشعار المسبق للانقطاع المخطط'
        : 'Prior Notice for Planned Outage',
      period: isRTL ? 'قبل يومين على الأقل' : 'At least 2 days before',
      compensation: isRTL ? '100 ريال' : 'SAR 100',
      additionalCompensation: isRTL
        ? 'لا يوجد تعويض إضافي'
        : 'No additional compensation',
      color: '#00623B',
      category: 'notification',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? 'صباح الخير' : 'Good Morning';
    if (hour < 17) return isRTL ? 'مساء الخير' : 'Good Afternoon';
    return isRTL ? 'مساء الخير' : 'Good Evening';
  };

  const handleComingSoon = () => {
    setShowComingSoonModal(true);
  };

  const closeModal = () => {
    setShowComingSoonModal(false);
  };

  const quickActions = [
    {
      id: 1,
      icon: DocumentText24Regular,
      title: translations.quickActions.newComplaint,
      color: '#00623B',
      onPress: () => navigation.navigate('CreateComplaint'),
    },
    {
      id: 2,
      icon: CheckmarkCircle24Regular,
      title: translations.quickActions.newPermit,
      color: '#00623B',
      onPress: () => navigation.navigate('Permits'),
    },
    {
      id: 3,
      icon: PersonCall24Regular,
      title: translations.quickActions.contactUs,
      color: '#00623B',
      onPress: () => navigation.navigate('Contact'),
    },
    {
      id: 4,
      icon: Share24Regular,
      title: translations.quickActions.shareData,
      color: '#00623B',
      onPress: handleComingSoon,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      icon: CheckmarkCircle24Regular,
      title: translations.activities.complaintReply,
      time: translations.activities.twoHoursAgo,
      status: 'completed',
      color: '#00623B',
    },
    {
      id: 2,
      icon: Clock24Regular,
      title: translations.activities.permitReceived,
      time: translations.activities.yesterday,
      status: 'processing',
      color: '#00623B',
    },
    {
      id: 3,
      icon: Alert24Regular,
      title: translations.activities.newUpdate,
      time: translations.activities.threeDaysAgo,
      status: 'info',
      color: '#00623B',
    },
  ];

  const navTabs = [
    {
      label: translations.tabs.main,
      icon: Home24Regular,
      action: () => {},
      isActive: true,
    },
    {
      label: translations.tabs.services,
      icon: Apps24Regular,
      action: () => navigation.navigate('Services'),
      isActive: false,
    },
    {
      label: translations.tabs.chat,
      icon: Chat24Regular,
      action: handleComingSoon,
      isActive: false,
    },
    {
      label: translations.tabs.more,
      icon: MoreHorizontal24Regular,
      action: () => navigation.navigate('More'),
      isActive: false,
    },
  ];

  const StatCard = ({IconComponent, value, label, color}) => (
    <View style={[styles.statCard, {backgroundColor: theme.colors.card}]}>
      <View style={[styles.statIconContainer, {backgroundColor: color + '20'}]}>
        <IconComponent style={[styles.statIconComponent, {color}]} />
      </View>
      <Text style={[styles.statValue, {color: theme.colors.text}]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, {color: theme.colors.textSecondary}]}>
        {label}
      </Text>
    </View>
  );

  const QuickActionCard = ({action}) => {
    const IconComponent = action.icon;
    return (
      <TouchableOpacity
        style={[styles.quickActionCard, {backgroundColor: theme.colors.card}]}
        onPress={action.onPress}
        activeOpacity={0.7}>
        <View
          style={[
            styles.quickActionIcon,
            {backgroundColor: action.color + '20'},
          ]}>
          <IconComponent
            style={[styles.quickActionIconComponent, {color: action.color}]}
          />
        </View>
        <Text
          style={[
            styles.quickActionText,
            {
              color: theme.colors.text,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
          numberOfLines={2}>
          {action.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const ProfileAvatar = () => (
    <TouchableOpacity
      style={styles.avatarContainer}
      onPress={() => navigation.navigate('Profile')}
      activeOpacity={0.7}>
      <View style={[styles.avatar, {backgroundColor: '#00623B'}]}>
        <Text style={styles.avatarText}>{userData.avatar}</Text>
      </View>
    </TouchableOpacity>
  );

  const ActivityItem = ({activity}) => {
    const IconComponent = activity.icon;
    return (
      <View
        style={[
          styles.activityItem,
          {flexDirection: isRTL ? 'row-reverse' : 'row'},
        ]}>
        <View
          style={[
            styles.activityIcon,
            {backgroundColor: activity.color + '20'},
          ]}>
          <IconComponent
            style={[styles.activityIconComponent, {color: activity.color}]}
          />
        </View>
        <View style={styles.activityContent}>
          <Text
            style={[
              styles.activityTitle,
              {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {activity.title}
          </Text>
          <Text
            style={[
              styles.activityTime,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {activity.time}
          </Text>
        </View>
      </View>
    );
  };

  const SeraUpdateItem = ({update}) => {
    const IconComponent = update.icon;
    return (
      <TouchableOpacity
        style={[
          styles.updateItem,
          {flexDirection: isRTL ? 'row-reverse' : 'row'},
        ]}
        activeOpacity={0.7}>
        <View style={[styles.updateIcon, {backgroundColor: '#00623B20'}]}>
          <IconComponent
            style={[styles.updateIconComponent, {color: '#00623B'}]}
          />
        </View>
        <View style={styles.updateContent}>
          <View
            style={[
              styles.updateHeader,
              {flexDirection: isRTL ? 'row-reverse' : 'row'},
            ]}>
            <Text
              style={[
                styles.updateTitle,
                {
                  color: theme.colors.text,
                  textAlign: isRTL ? 'right' : 'left',
                  flex: 1,
                },
              ]}
              numberOfLines={2}>
              {update.title}
            </Text>
            {update.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>
                  {translations.seraUpdates.new}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.updateDescription,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            numberOfLines={2}>
            {update.description}
          </Text>
          <Text
            style={[
              styles.updateTime,
              {
                color: theme.colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}>
            {update.time}
          </Text>
        </View>
        <ChevronRight24Regular
          style={[
            styles.chevronIcon,
            {
              color: theme.colors.textSecondary,
              transform: isRTL ? [{rotate: '180deg'}] : [],
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const CompensationCard = ({standard}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const IconComponent = standard.icon;

    return (
      <TouchableOpacity
        style={[styles.compensationCard, {backgroundColor: theme.colors.card}]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}>
        <View
          style={[
            styles.compensationHeader,
            {flexDirection: isRTL ? 'row-reverse' : 'row'},
          ]}>
          <View
            style={[
              styles.compensationIcon,
              {backgroundColor: standard.color + '20'},
            ]}>
            <IconComponent
              style={[
                styles.compensationIconComponent,
                {color: standard.color},
              ]}
            />
          </View>
          <View style={styles.compensationHeaderText}>
            <Text
              style={[
                styles.compensationTitle,
                {
                  color: theme.colors.text,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
              numberOfLines={isExpanded ? 0 : 2}>
              {standard.title}
            </Text>
            <View
              style={[
                styles.compensationAmountRow,
                {
                  alignSelf: isRTL ? 'flex-end' : 'flex-start',
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                },
              ]}>
              <Text
                style={[styles.compensationAmount, {color: standard.color}]}>
                {standard.compensation}
              </Text>
              <Text
                style={[
                  styles.compensationLabel,
                  {
                    color: theme.colors.textSecondary,
                    marginLeft: isRTL ? 0 : 6,
                    marginRight: isRTL ? 6 : 0,
                  },
                ]}>
                {translations.compensation.compensation}
              </Text>
            </View>
          </View>
          <ChevronRight24Regular
            style={[
              styles.compensationChevron,
              {
                color: theme.colors.textSecondary,
                transform: [
                  ...(isRTL ? [{rotate: '180deg'}] : []),
                  ...(isExpanded ? [{rotate: isRTL ? '90deg' : '-90deg'}] : []),
                ],
              },
            ]}
          />
        </View>

        {isExpanded && (
          <View style={styles.compensationDetails}>
            <View
              style={[
                styles.compensationDetailRow,
                {alignItems: isRTL ? 'flex-end' : 'flex-start'},
              ]}>
              <Text
                style={[
                  styles.compensationDetailLabel,
                  {
                    color: theme.colors.textSecondary,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}>
                {translations.compensation.period}:
              </Text>
              <Text
                style={[
                  styles.compensationDetailValue,
                  {
                    color: theme.colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                    marginLeft: isRTL ? 0 : 8,
                    marginRight: isRTL ? 8 : 0,
                  },
                ]}>
                {standard.period}
              </Text>
            </View>
            <View
              style={[
                styles.compensationDetailRow,
                {alignItems: isRTL ? 'flex-end' : 'flex-start'},
              ]}>
              <Text
                style={[
                  styles.compensationDetailLabel,
                  {
                    color: theme.colors.textSecondary,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}>
                {translations.compensation.additionalCompensation}:
              </Text>
              <Text
                style={[
                  styles.compensationDetailValue,
                  {
                    color: theme.colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                    marginLeft: isRTL ? 0 : 8,
                    marginRight: isRTL ? 8 : 0,
                  },
                ]}>
                {standard.additionalCompensation}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const dynamicStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 0,
      paddingBottom: 20,
    },
    welcomeCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    greetingText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 4,
    },
    lastVisitText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 16,
    },
    statusBadge: {
      backgroundColor: '#2ECC71',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: isRTL ? 'flex-end' : 'flex-start',
      marginBottom: 16,
    },
    statusText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    statsRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 16,
      marginTop: 8,
    },
    sectionHeader: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 0,
    },
    updatesCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    activityCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    navBarSafeArea: {
      backgroundColor: theme.colors.surface,
    },
    navBar: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingVertical: 8,
    },
    navTab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 4,
    },
    navIcon: {
      marginBottom: 2,
      width: 20,
      height: 20,
    },
    navIconActive: {
      color: theme.colors.primary,
    },
    navIconInactive: {
      color: theme.colors.icon,
    },
    navLabel: {
      fontSize: 13,
      textAlign: 'center',
    },
    navLabelActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    navLabelInactive: {
      color: theme.colors.textSecondary,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxWidth: 320,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalIcon: {
      width: 32,
      height: 32,
      color: theme.colors.primary,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
      textAlign: isRTL ? 'right' : 'left',
    },
    closeButton: {
      padding: 4,
    },
    closeIcon: {
      width: 20,
      height: 20,
      color: theme.colors.textSecondary,
    },
    modalMessage: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 24,
    },
    modalButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeArea} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={dynamicStyles.container}>
        <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>
          {/* Top Avatar */}
          <View
            style={[
              styles.topAvatarContainer,
              {alignItems: isRTL ? 'flex-end' : 'flex-start'},
            ]}>
            <ProfileAvatar />
          </View>

          {/* Welcome Card */}
          <View style={dynamicStyles.welcomeCard}>
            <Text style={dynamicStyles.greetingText}>
              {getGreeting()}, {userData.name}
            </Text>
            <Text style={dynamicStyles.lastVisitText}>
              {translations.lastVisit}: {userData.lastVisit}
            </Text>
            <View style={dynamicStyles.statusBadge}>
              <Text style={dynamicStyles.statusText}>
                {translations.accountVerified}
              </Text>
            </View>
            <View style={dynamicStyles.statsRow}>
              <StatCard
                IconComponent={Clipboard24Regular}
                value={userData.activeComplaints}
                label={translations.stats.activeComplaints}
                color="#00623B"
              />
              <StatCard
                IconComponent={CheckmarkCircle24Regular}
                value={userData.completedTasks}
                label={translations.stats.completed}
                color="#00623B"
              />
              <StatCard
                IconComponent={Clock24Regular}
                value={userData.pendingRequests}
                label={translations.stats.pending}
                color="#00623B"
              />
            </View>
          </View>

          {/* SERA Updates Section */}
          <View style={dynamicStyles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>
              {translations.seraUpdates.title}
            </Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={handleComingSoon}
              activeOpacity={0.7}>
              <Text style={[styles.seeAllText, {color: '#00623B'}]}>
                {translations.seraUpdates.seeAll}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={dynamicStyles.updatesCard}>
            {seraUpdates.map(update => (
              <SeraUpdateItem key={update.id} update={update} />
            ))}
          </View>

          {/* Consumer Compensation Standards Section */}
          <View style={dynamicStyles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={dynamicStyles.sectionTitle}>
                {translations.compensation.title}
              </Text>
              {/* <Text
                style={[
                  styles.sectionSubtitle,
                  {
                    color: theme.colors.textSecondary,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}>
                {translations.compensation.subtitle}
              </Text> */}
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={handleComingSoon}
              activeOpacity={0.7}>
              <Text style={[styles.seeAllText, {color: '#00623B'}]}>
                {translations.compensation.viewAll}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={dynamicStyles.updatesCard}>
            {compensationStandards.map(standard => (
              <CompensationCard key={standard.id} standard={standard} />
            ))}
          </View>

          {/* Quick Actions */}
          <Text style={dynamicStyles.sectionTitle}>
            {translations.quickActionsTitle}
          </Text>
          <View style={dynamicStyles.quickActionsGrid}>
            {quickActions.map(action => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </View>

          {/* Recent Activity */}
          <View style={dynamicStyles.activityCard}>
            <Text style={dynamicStyles.sectionTitle}>
              {translations.recentActivityTitle}
            </Text>
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </View>
        </ScrollView>

        <SafeAreaView style={dynamicStyles.navBarSafeArea} edges={['bottom']}>
          <View style={dynamicStyles.navBar}>
            {navTabs.map((tab, idx) => {
              const IconComponent = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.label}
                  style={dynamicStyles.navTab}
                  onPress={tab.action}
                  activeOpacity={0.7}>
                  <IconComponent
                    style={[
                      dynamicStyles.navIcon,
                      tab.isActive
                        ? dynamicStyles.navIconActive
                        : dynamicStyles.navIconInactive,
                    ]}
                  />
                  <Text
                    style={[
                      dynamicStyles.navLabel,
                      tab.isActive
                        ? dynamicStyles.navLabelActive
                        : dynamicStyles.navLabelInactive,
                    ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </View>

      {/* Coming Soon Modal */}
      <Modal
        visible={showComingSoonModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={dynamicStyles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}>
          <TouchableOpacity
            style={dynamicStyles.modalContainer}
            activeOpacity={1}
            onPress={() => {}}>
            <View style={dynamicStyles.modalHeader}>
              <Clock24Regular style={dynamicStyles.modalIcon} />
              <Text style={dynamicStyles.modalTitle}>
                {translations.comingSoon.title}
              </Text>
              <TouchableOpacity
                style={dynamicStyles.closeButton}
                onPress={closeModal}
                activeOpacity={0.7}>
                <Dismiss24Regular style={dynamicStyles.closeIcon} />
              </TouchableOpacity>
            </View>
            <Text style={dynamicStyles.modalMessage}>
              {translations.comingSoon.message}
            </Text>
            <TouchableOpacity
              style={dynamicStyles.modalButton}
              onPress={closeModal}
              activeOpacity={0.8}>
              <Text style={dynamicStyles.modalButtonText}>
                {translations.comingSoon.okButton}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconComponent: {
    width: 20,
    height: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIconComponent: {
    width: 24,
    height: 24,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activityItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 12,
  },
  activityIconComponent: {
    width: 20,
    height: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  // Profile Avatar Styles
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Top Avatar Container
  topAvatarContainer: {
    paddingHorizontal: 5,
    paddingTop: 20,
    paddingBottom: 10,
  },
  // Welcome Header Styles
  welcomeHeader: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  // SERA Updates Styles
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  updateItem: {
    paddingVertical: 12,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  updateIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 12,
  },
  updateIconComponent: {
    width: 20,
    height: 20,
  },
  updateContent: {
    flex: 1,
    marginRight: 8,
    marginLeft: 8,
  },
  updateHeader: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  updateDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 11,
  },
  newBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    marginRight: 8,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  chevronIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  compensationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compensationHeader: {
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  compensationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 12,
    alignSelf: 'flex-start',
  },
  compensationIconComponent: {
    width: 22,
    height: 22,
  },
  compensationHeaderText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  compensationTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  compensationAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  compensationAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  compensationLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  compensationChevron: {
    width: 18,
    height: 18,
    marginLeft: 8,
    marginRight: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  compensationDetails: {
    paddingTop: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  compensationDetailRow: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  compensationDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  compensationDetailValue: {
    fontSize: 14,
    lineHeight: 18,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
});
