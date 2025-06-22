import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
    ArrowLeft24Regular,
    DocumentText24Regular,
    Money24Regular,
    Clock24Regular,
    Alert24Regular,
    ChevronRight24Regular,
} from '@fluentui/react-native-icons';

const CompensationStandardsScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const isRTL = i18n.language === 'ar';

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

    const translations = {
        title: isRTL ? 'معايير التعويضات' : 'Compensation Standards',
        subtitle: isRTL
            ? 'حقوقك كمستهلك للكهرباء'
            : 'Your Rights as Electricity Consumer',
        period: isRTL ? 'المدة المطلوبة' : 'Required Period',
        compensation: isRTL ? 'التعويض' : 'Compensation',
        additionalCompensation: isRTL
            ? 'التعويض الإضافي'
            : 'Additional Compensation',
        description: isRTL
            ? 'تعرف على حقوقك في التعويض عند عدم التزام مقدم الخدمة بالمعايير المحددة من قبل الهيئة السعودية لتنظيم الكهرباء.'
            : 'Learn about your compensation rights when service providers fail to meet the standards set by the Saudi Electricity Regulatory Authority.',
        categories: {
            service: isRTL ? 'خدمات الكهرباء' : 'Electricity Services',
            notification: isRTL ? 'الإشعارات والتواصل' : 'Notifications & Communication',
        },
        quickStats: {
            totalStandards: isRTL ? 'المعايير المتاحة' : 'Available Standards',
            avgCompensation: isRTL ? 'متوسط التعويض' : 'Average Compensation',
            maxPeriod: isRTL ? 'أقصى مدة انتظار' : 'Maximum Wait Period',
        },
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Group standards by category
    const groupedStandards = {
        service: compensationStandards.filter(s => ['registration', 'service', 'restoration'].includes(s.category)),
        notification: compensationStandards.filter(s => s.category === 'notification'),
    };

    // Calculate quick stats
    const quickStats = {
        totalStandards: compensationStandards.length,
        avgCompensation: Math.round(
            compensationStandards.reduce((sum, s) => {
                const amount = parseInt(s.compensation.replace(/[^\d]/g, ''));
                return sum + amount;
            }, 0) / compensationStandards.length
        ),
        maxPeriod: isRTL ? '60 يوم' : '60 days',
    };

    // Quick Stats Component
    const QuickStatsCard = () => (
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {quickStats.totalStandards}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {translations.quickStats.totalStandards}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {isRTL ? `${quickStats.avgCompensation} ريال` : `SAR ${quickStats.avgCompensation}`}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {translations.quickStats.avgCompensation}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {quickStats.maxPeriod}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {translations.quickStats.maxPeriod}
                    </Text>
                </View>
            </View>
        </View>
    );

    // Section Header Component
    const SectionHeader = ({ title, count }) => (
        <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {title}
            </Text>
            <View style={[styles.countBadge, { backgroundColor: '#00623B20' }]}>
                <Text style={[styles.countText, { color: '#00623B' }]}>
                    {count}
                </Text>
            </View>
        </View>
    );

    const CompensationCard = ({ standard }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const IconComponent = standard.icon;

        return (
            <TouchableOpacity
                style={[styles.compensationCard, { backgroundColor: theme.colors.card }]}
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}>
                <View
                    style={[
                        styles.compensationHeader,
                        { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    ]}>
                    <View
                        style={[
                            styles.compensationIcon,
                            {
                                backgroundColor: standard.color + '20',
                                marginRight: isRTL ? 0 : 12,
                                marginLeft: isRTL ? 12 : 0,
                            },
                        ]}>
                        <IconComponent
                            style={[
                                styles.compensationIconComponent,
                                { color: standard.color },
                            ]}
                        />
                    </View>
                    <View style={[styles.compensationHeaderText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                        <Text
                            style={[
                                styles.compensationTitle,
                                {
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left',
                                    writingDirection: isRTL ? 'rtl' : 'ltr',
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
                                style={[styles.compensationAmount, { color: standard.color }]}>
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
                                {translations.compensation}
                            </Text>
                        </View>
                    </View>
                    <ChevronRight24Regular
                        style={[
                            styles.compensationChevron,
                            {
                                color: theme.colors.textSecondary,
                                transform: [
                                    ...(isRTL ? [{ rotate: '180deg' }] : []),
                                    ...(isExpanded ? [{ rotate: isRTL ? '90deg' : '-90deg' }] : []),
                                ],
                            },
                        ]}
                    />
                </View>

                {isExpanded && (
                    <View style={[styles.compensationDetails, { borderTopColor: theme.colors.border }]}>
                        <View
                            style={[
                                styles.compensationDetailRow,
                                { alignItems: isRTL ? 'flex-end' : 'flex-start' },
                            ]}>
                            <Text
                                style={[
                                    styles.compensationDetailLabel,
                                    {
                                        color: theme.colors.textSecondary,
                                        textAlign: isRTL ? 'right' : 'left',
                                    },
                                ]}>
                                {translations.period}:
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
                                { alignItems: isRTL ? 'flex-end' : 'flex-start' },
                            ]}>
                            <Text
                                style={[
                                    styles.compensationDetailLabel,
                                    {
                                        color: theme.colors.textSecondary,
                                        textAlign: isRTL ? 'right' : 'left',
                                    },
                                ]}>
                                {translations.additionalCompensation}:
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
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
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
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
        descriptionSection: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        descriptionTitle: {
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 8,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
        },
        descriptionText: {
            fontSize: 14,
            lineHeight: 20,
            opacity: 0.8,
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
        },
    });

    return (
        <SafeAreaView style={dynamicStyles.container} edges={['top']}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.surface}
            />

            {/* Header */}
            <View style={dynamicStyles.header}>
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
                <Text style={dynamicStyles.headerTitle}>{translations.title}</Text>
                <View style={styles.placeholderView} />
            </View>

            {/* Description Section */}
            <View style={dynamicStyles.descriptionSection}>
                <Text style={dynamicStyles.descriptionTitle}>
                    {translations.subtitle}
                </Text>
                <Text style={dynamicStyles.descriptionText}>
                    {translations.description}
                </Text>
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Quick Stats */}
                <QuickStatsCard />

                {/* Service Standards Section */}
                <SectionHeader
                    title={translations.categories.service}
                    count={groupedStandards.service.length}
                />
                <View style={styles.sectionContent}>
                    {groupedStandards.service.map(standard => (
                        <CompensationCard key={standard.id} standard={standard} />
                    ))}
                </View>

                {/* Notification Standards Section */}
                <SectionHeader
                    title={translations.categories.notification}
                    count={groupedStandards.notification.length}
                />
                <View style={styles.sectionContent}>
                    {groupedStandards.notification.map(standard => (
                        <CompensationCard key={standard.id} standard={standard} />
                    ))}
                </View>

                {/* Additional Info Section */}
                <View style={[styles.infoSection, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.infoTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL ? 'معلومات إضافية' : 'Additional Information'}
                    </Text>
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL
                            ? 'هذه المعايير محددة وفقاً للوائح الهيئة السعودية لتنظيم الكهرباء. للمزيد من التفاصيل، يرجى زيارة الموقع الرسمي للهيئة أو التواصل مع خدمة العملاء.'
                            : 'These standards are set according to the Saudi Electricity Regulatory Authority regulations. For more details, please visit the official SERA website or contact customer service.'
                        }
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backButton: {
        padding: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderView: {
        width: 40,
        height: 40,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    // Quick Stats Styles
    statsContainer: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    // Section Styles
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    countBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 24,
        alignItems: 'center',
    },
    countText: {
        fontSize: 12,
        fontWeight: '600',
    },
    sectionContent: {
        marginBottom: 24,
    },
    // Info Section Styles
    infoSection: {
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.9,
    },
    compensationCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
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
});

export default CompensationStandardsScreen; 