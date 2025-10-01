import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import LoginRequiredModal from '../components/LoginRequiredModal';

// Define fallback icon components first
const FallbackArrowLeft = ({ style }) => <Text style={[{ fontSize: 20 }, style]}>←</Text>;
const FallbackDocument = ({ style }) => <Text style={[{ fontSize: 20 }, style]}>📄</Text>;
const FallbackLink = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>🔗</Text>;
const FallbackDownload = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>⬇️</Text>;
const FallbackPhone = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>📞</Text>;
const FallbackClock = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>⏰</Text>;
const FallbackMoney = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>💰</Text>;
const FallbackPeople = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>👥</Text>;
const FallbackGlobe = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>🌐</Text>;
const FallbackSupport = ({ style }) => <Text style={[{ fontSize: 16 }, style]}>🎧</Text>;

// Safe imports with fallbacks for FluentUI icons
let ArrowLeft24Regular = FallbackArrowLeft;
let DocumentText24Regular = FallbackDocument;
let Link24Regular = FallbackLink;
let ArrowDownload24Regular = FallbackDownload;
let Phone24Regular = FallbackPhone;
let Clock24Regular = FallbackClock;
let Money24Regular = FallbackMoney;
let People24Regular = FallbackPeople;
let Globe24Regular = FallbackGlobe;
let HeadphonesSound24Regular = FallbackSupport;

try {
    const icons = require('@fluentui/react-native-icons');
    if (icons.ArrowLeft24Regular) ArrowLeft24Regular = icons.ArrowLeft24Regular;
    if (icons.DocumentText24Regular) DocumentText24Regular = icons.DocumentText24Regular;
    if (icons.Link24Regular) Link24Regular = icons.Link24Regular;
    if (icons.ArrowDownload24Regular) ArrowDownload24Regular = icons.ArrowDownload24Regular;
    if (icons.Phone24Regular) Phone24Regular = icons.Phone24Regular;
    if (icons.Clock24Regular) Clock24Regular = icons.Clock24Regular;
    if (icons.Money24Regular) Money24Regular = icons.Money24Regular;
    if (icons.People24Regular) People24Regular = icons.People24Regular;
    if (icons.Globe24Regular) Globe24Regular = icons.Globe24Regular;
    if (icons.Headphones24Regular) HeadphonesSound24Regular = icons.Headphones24Regular;
} catch (error) {
    console.log('FluentUI icons not available, using fallback icons');
}

const ServiceDescriptionScreen = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const isRTL = i18n.language === 'ar';
    const { user, isAuthenticated, isGuestMode } = useUser();
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Get service data from route params or use default complaint service
    const serviceData = route?.params?.serviceData || {
        id: 'complaints',
        title: {
            en: 'Complaint',
            ar: 'الشكاوى'
        },
        description: {
            en: 'The service enables you to submit or escalate a complaint with SERA if you are unhappy with the outcome of the service provider\'s handling of your complaint, or if there is a delay in resolving it. It also allows you to follow up on the status of your complaint. The service is available 24/7 through various service delivery channels.',
            ar: 'تتيح لك الخدمة تقديم أو تصعيد شكوى لدى هيئة تنظيم الكهرباء إذا لم تكن راضياً عن نتيجة تعامل مقدم الخدمة مع شكواك، أو في حالة وجود تأخير في حلها. كما تتيح لك متابعة حالة شكواك. الخدمة متاحة على مدار الساعة طوال أيام الأسبوع من خلال قنوات تقديم الخدمات المختلفة.'
        },
        steps: {
            en: [
                'Choose "Complaint".',
                'Choose "Raise a complaint"',
                'Fill out the Complaint Form',
                'Submit the complaint'
            ],
            ar: [
                'اختر "الشكاوى".',
                'اختر "تقديم شكوى"',
                'املأ نموذج الشكوى',
                'أرسل الشكوى'
            ]
        },
        requirements: {
            en: [
                'Logging in through the Unified National Access (NAFATH)'
            ],
            ar: [
                'تسجيل الدخول من خلال النفاذ الوطني الموحد (نفاذ)'
            ]
        },
        targetedAudience: {
            en: 'Consumer',
            ar: 'المستهلك'
        },
        completionPeriod: {
            en: '20 workdays',
            ar: '20 يوم عمل'
        },
        fees: {
            en: 'Free',
            ar: 'مجاني'
        },
        supportedLanguages: {
            en: 'Arabic-English',
            ar: 'العربية - الإنجليزية'
        },
        contactNumber: '19944',
        deliveryChannels: {
            en: 'E-portal - Call Center',
            ar: 'البوابة الإلكترونية - مركز الاتصال'
        },
        //submitUrl: 'https://eservices.sera.gov.sa/Complaint-menu',
        guideUrl: 'https://sera.gov.sa/-/media/wera/pdfs/e-service/electricity-services-complaint-en.pdf'
    };

    // Safety check for theme colors
    const safeTheme = {
        colors: {
            background: theme?.colors?.background || '#ffffff',
            surface: theme?.colors?.surface || '#f5f5f5',
            card: theme?.colors?.card || '#ffffff',
            text: theme?.colors?.text || '#000000',
            textSecondary: theme?.colors?.textSecondary || '#666666',
            primary: theme?.colors?.primary || '#1976d2',
            border: theme?.colors?.border || '#e0e0e0',
            icon: theme?.colors?.icon || '#666666',
            ...theme?.colors
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleLinkPress = async (url) => {
        try {
            // For common URL schemes, skip canOpenURL check as they're universally supported
            // Android 11+ requires intent filters declared in AndroidManifest.xml for canOpenURL
            const isCommonScheme = url.startsWith('http://') ||
                url.startsWith('https://') ||
                url.startsWith('tel:') ||
                url.startsWith('mailto:');

            if (isCommonScheme) {
                // Directly open common URLs without checking
                await Linking.openURL(url);
            } else {
                // For other schemes, check first
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                } else {
                    console.log('Cannot open URL:', url);
                }
            }
        } catch (error) {
            console.error('Error opening URL:', error);
        }
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

    const handleSubmitRequest = () => {
        // Check if user is in guest mode
        if (isGuestMode && !isAuthenticated) {
            showLoginPrompt();
            return;
        }
        // Navigate to ComplaintsScreen if authenticated
        navigation.navigate('Complaints');
    };

    const InfoRow = ({ icon: IconComponent, label, value, onPress }) => (
        <TouchableOpacity
            style={[styles.infoRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            disabled={!onPress}>
            <View style={[styles.infoIcon, {
                backgroundColor: safeTheme.colors.primary + '15',
                marginRight: isRTL ? 0 : 12,
                marginLeft: isRTL ? 12 : 0
            }]}>
                {React.createElement(IconComponent || FallbackDocument, {
                    style: [styles.iconStyle, { color: safeTheme.colors.primary }]
                })}
            </View>
            <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, {
                    color: safeTheme.colors.textSecondary,
                    textAlign: isRTL ? 'right' : 'left',
                    writingDirection: isRTL ? 'rtl' : 'ltr'
                }]}>
                    {label}
                </Text>
                <Text style={[styles.infoValue, {
                    color: onPress ? safeTheme.colors.primary : safeTheme.colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                    textDecorationLine: onPress ? 'underline' : 'none',
                    writingDirection: isRTL ? 'rtl' : 'ltr'
                }]}>
                    {value}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: safeTheme.colors.background,
        },
        header: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: safeTheme.colors.border,
            backgroundColor: safeTheme.colors.surface,
        },
        backButton: {
            padding: 8,
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0,
        },
        backIcon: {
            width: 24,
            height: 24,
            color: safeTheme.colors.primary,
            transform: [{ scaleX: isRTL ? -1 : 1 }],
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: safeTheme.colors.text,
            flex: 1,
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
    });

    return (
        <SafeAreaView style={dynamicStyles.container} edges={['top']}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={safeTheme.colors.surface}
            />

            {/* Header */}
            <View style={dynamicStyles.header}>
                <TouchableOpacity
                    style={dynamicStyles.backButton}
                    onPress={handleGoBack}
                    activeOpacity={0.7}>
                    {React.createElement(ArrowLeft24Regular || FallbackArrowLeft, {
                        style: dynamicStyles.backIcon
                    })}
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle}>
                    {isRTL ? serviceData.title.ar : serviceData.title.en}
                </Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Service Description Section */}
                <View style={[styles.section, { backgroundColor: safeTheme.colors.card }]}>
                    <Text style={[styles.sectionTitle, {
                        color: safeTheme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: isRTL ? 'rtl' : 'ltr'
                    }]}>
                        {isRTL ? 'وصف الخدمة' : 'Service Description'}
                    </Text>
                    <Text style={[styles.sectionContent, {
                        color: safeTheme.colors.textSecondary,
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: isRTL ? 'rtl' : 'ltr'
                    }]}>
                        {isRTL ? serviceData.description.ar : serviceData.description.en}
                    </Text>
                </View>

                {/* Implementation Steps Section */}
                <View style={[styles.section, { backgroundColor: safeTheme.colors.card }]}>
                    <Text style={[styles.sectionTitle, {
                        color: safeTheme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: isRTL ? 'rtl' : 'ltr'
                    }]}>
                        {isRTL ? 'خطوات تنفيذ الخدمة' : 'Service Implementation Steps'}
                    </Text>
                    {(isRTL ? serviceData.steps.ar : serviceData.steps.en).map((step, index) => (
                        <View key={index} style={[styles.stepItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[styles.stepNumber, { backgroundColor: safeTheme.colors.primary }]}>
                                <Text style={[styles.stepNumberText, { color: '#ffffff' }]}>
                                    {index + 1}
                                </Text>
                            </View>
                            <Text style={[styles.stepText, {
                                color: safeTheme.colors.textSecondary,
                                textAlign: isRTL ? 'right' : 'left',
                                marginLeft: isRTL ? 0 : 12,
                                marginRight: isRTL ? 12 : 0,
                                writingDirection: isRTL ? 'rtl' : 'ltr'
                            }]}>
                                {step}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Requirements Section */}
                <View style={[styles.section, { backgroundColor: safeTheme.colors.card }]}>
                    <Text style={[styles.sectionTitle, {
                        color: safeTheme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: isRTL ? 'rtl' : 'ltr'
                    }]}>
                        {isRTL ? 'متطلبات الخدمة' : 'Service Requirements'}
                    </Text>
                    {(isRTL ? serviceData.requirements.ar : serviceData.requirements.en).map((requirement, index) => (
                        <View key={index} style={[styles.requirementItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Text style={[styles.bulletPoint, { color: safeTheme.colors.primary }]}>•</Text>
                            <Text style={[styles.requirementText, {
                                color: safeTheme.colors.textSecondary,
                                textAlign: isRTL ? 'right' : 'left',
                                marginLeft: isRTL ? 0 : 8,
                                marginRight: isRTL ? 8 : 0,
                                writingDirection: isRTL ? 'rtl' : 'ltr'
                            }]}>
                                {requirement}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Service Information Section */}
                <View style={[styles.section, { backgroundColor: safeTheme.colors.card }]}>
                    <Text style={[styles.sectionTitle, {
                        color: safeTheme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: isRTL ? 'rtl' : 'ltr'
                    }]}>
                        {isRTL ? 'معلومات الخدمة' : 'Service Information'}
                    </Text>

                    <InfoRow
                        icon={People24Regular}
                        label={isRTL ? 'الجمهور المستهدف' : 'Targeted Audience'}
                        value={isRTL ? serviceData.targetedAudience.ar : serviceData.targetedAudience.en}
                    />

                    <InfoRow
                        icon={Clock24Regular}
                        label={isRTL ? 'مدة إنجاز الخدمة' : 'Service Completion Period'}
                        value={isRTL ? serviceData.completionPeriod.ar : serviceData.completionPeriod.en}
                    />

                    <InfoRow
                        icon={Money24Regular}
                        label={isRTL ? 'رسوم الخدمة' : 'Service Fees'}
                        value={isRTL ? serviceData.fees.ar : serviceData.fees.en}
                    />

                    <InfoRow
                        icon={Globe24Regular}
                        label={isRTL ? 'اللغات المدعومة' : 'Supported Languages'}
                        value={isRTL ? serviceData.supportedLanguages.ar : serviceData.supportedLanguages.en}
                    />

                    <InfoRow
                        icon={Phone24Regular}
                        label={isRTL ? 'أرقام التواصل والدعم' : 'Contact and Support Numbers'}
                        value={serviceData.contactNumber}
                        onPress={() => handleLinkPress(`tel:${serviceData.contactNumber}`)}
                    />

                    <InfoRow
                        icon={HeadphonesSound24Regular}
                        label={isRTL ? 'قنوات تقديم الخدمة' : 'Service Delivery Channels'}
                        value={isRTL ? serviceData.deliveryChannels.ar : serviceData.deliveryChannels.en}
                    />
                </View>

                {/* Action Buttons Section */}
                <View style={[styles.section, { backgroundColor: safeTheme.colors.card }]}>
                    <TouchableOpacity
                        style={[styles.actionButton, {
                            backgroundColor: safeTheme.colors.primary,
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                        }]}
                        onPress={handleSubmitRequest}
                        activeOpacity={0.8}>
                        {React.createElement(Link24Regular || FallbackLink, {
                            style: [styles.actionButtonIcon, {
                                color: '#ffffff',
                                marginRight: isRTL ? 0 : 8,
                                marginLeft: isRTL ? 8 : 0
                            }]
                        })}
                        <Text style={[styles.actionButtonText, {
                            color: '#ffffff',
                            writingDirection: isRTL ? 'rtl' : 'ltr'
                        }]}>
                            {isRTL ? 'تقديم طلب' : 'Submit Request'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, {
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: safeTheme.colors.primary,
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                        }]}
                        onPress={() => handleLinkPress(serviceData.guideUrl)}
                        activeOpacity={0.8}>
                        {React.createElement(ArrowDownload24Regular || FallbackDownload, {
                            style: [styles.actionButtonIcon, {
                                color: safeTheme.colors.primary,
                                marginRight: isRTL ? 0 : 8,
                                marginLeft: isRTL ? 8 : 0
                            }]
                        })}
                        <Text style={[styles.actionButtonText, {
                            color: safeTheme.colors.primary,
                            writingDirection: isRTL ? 'rtl' : 'ltr'
                        }]}>
                            {isRTL ? 'تحميل الدليل' : 'Download The Guide'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Login Required Modal */}
            <LoginRequiredModal
                visible={showLoginModal}
                onClose={closeLoginModal}
                onLogin={handleLoginPress}
                title={isRTL ? 'تسجيل الدخول مطلوب' : 'Login Required'}
                message={isRTL ? 'يجب تسجيل الدخول للوصول إلى خدمة الشكاوى' : 'You need to login to access the complaints service'}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionContent: {
        fontSize: 14,
        lineHeight: 22,
    },
    stepItem: {
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepText: {
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
        marginTop: 2,
    },
    requirementItem: {
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bulletPoint: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
    },
    requirementText: {
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    infoRow: {
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        lineHeight: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 12,
    },
    actionButtonIcon: {
        width: 20,
        height: 20,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ServiceDescriptionScreen; 