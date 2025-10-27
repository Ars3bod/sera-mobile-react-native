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
import {
    ArrowLeft24Regular,
    DocumentText24Regular,
    Money24Regular,
    Clock24Regular,
    Alert24Regular,
    ChevronRight24Regular,
    ArrowDownload24Regular,
    Power24Regular,
} from '@fluentui/react-native-icons';

const CompensationStandardsScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const isRTL = i18n.language === 'ar';

    // Consumer Compensation Standards Data from SERA - Complete 9 Standards
    // Get compensation standards from i18n
    const compensationStandardsData = t('compensationStandards.standards', { returnObjects: true });
    const compensationStandards = Array.isArray(compensationStandardsData)
        ? compensationStandardsData.map(item => {
            // Map category to appropriate icon
            let icon;
            switch (item.category) {
                case 'service':
                    icon = Power24Regular;
                    break;
                case 'restoration':
                    icon = Clock24Regular;
                    break;
                case 'notification':
                case 'complaint':
                    icon = Alert24Regular;
                    break;
                case 'emergency':
                    icon = Power24Regular;
                    break;
                case 'violation':
                    icon = Alert24Regular;
                    break;
                default:
                    icon = DocumentText24Regular;
            }
            return {
                ...item,
                icon,
                color: '#00623B',
            };
        })
        : [];


    // Get translations from i18n
    const translations = {
        title: t('compensationStandards.screen.title'),
        subtitle: t('compensationStandards.screen.subtitle'),
        description: t('compensationStandards.screen.description'),
        conditions: t('compensationStandards.screen.conditions'),
        period: t('compensationStandards.screen.period'),
        compensation: t('compensationStandards.screen.compensation'),
        additionalCompensation: t('compensationStandards.screen.additionalCompensation'),
        notes: t('compensationStandards.screen.notes'),
        mainDescription: t('compensationStandards.screen.mainDescription'),
        downloadGuide: t('compensationStandards.screen.downloadGuide'),
        categories: {
            service: t('compensationStandards.screen.categories.service'),
            restoration: t('compensationStandards.screen.categories.restoration'),
            notification: t('compensationStandards.screen.categories.notification'),
            emergency: t('compensationStandards.screen.categories.emergency'),
            violation: t('compensationStandards.screen.categories.violation'),
            complaint: t('compensationStandards.screen.categories.complaint'),
        },
        quickStats: {
            totalStandards: t('compensationStandards.screen.quickStats.totalStandards'),
            avgCompensation: t('compensationStandards.screen.quickStats.avgCompensation'),
            maxCompensation: t('compensationStandards.screen.quickStats.maxCompensation'),
        },
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Handle PDF download
    const handleDownloadGuide = async () => {
        const guideUrl = 'https://sera.gov.sa/-/media/standard-file.pdf';
        try {
            // Directly open PDF URL without checking (as per Android fix)
            await Linking.openURL(guideUrl);
        } catch (error) {
            console.error('Error opening PDF guide:', error);
        }
    };

    // Group standards by category
    const groupedStandards = {
        service: compensationStandards.filter(s => s.category === 'service'),
        restoration: compensationStandards.filter(s => s.category === 'restoration'),
        notification: compensationStandards.filter(s => s.category === 'notification'),
        emergency: compensationStandards.filter(s => s.category === 'emergency'),
        violation: compensationStandards.filter(s => s.category === 'violation'),
        complaint: compensationStandards.filter(s => s.category === 'complaint'),
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
        maxCompensation: isRTL ? '1,000 ريال' : 'SAR 1,000',
    };

    // Quick Stats Component
    const QuickStatsCard = () => (
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {quickStats.totalStandards}
                    </Text>
                    <Text style={[styles.statLabel, {
                        color: theme.colors.textSecondary,
                        textAlign: 'center'
                    }]} numberOfLines={2}>
                        {translations.quickStats.totalStandards}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {isRTL ? `${quickStats.avgCompensation} ريال` : `SAR ${quickStats.avgCompensation}`}
                    </Text>
                    <Text style={[styles.statLabel, {
                        color: theme.colors.textSecondary,
                        textAlign: 'center'
                    }]} numberOfLines={2}>
                        {translations.quickStats.avgCompensation}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#00623B' }]}>
                        {quickStats.maxCompensation}
                    </Text>
                    <Text style={[styles.statLabel, {
                        color: theme.colors.textSecondary,
                        textAlign: 'center'
                    }]} numberOfLines={2}>
                        {translations.quickStats.maxCompensation}
                    </Text>
                </View>
            </View>
        </View>
    );

    // Section Header Component
    const SectionHeader = ({ title, count }) => (
        <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.sectionTitle, {
                color: theme.colors.text,
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr'
            }]}>
                {title}
            </Text>
            <View style={[styles.countBadge, {
                backgroundColor: '#00623B20',
                marginLeft: isRTL ? 0 : 8,
                marginRight: isRTL ? 8 : 0
            }]}>
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
                        {standard.description && (
                            <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                                <Text style={[styles.compensationDetailLabel, {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {translations.description}:
                                </Text>
                                <Text style={[styles.compensationDetailValue, {
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {standard.description}
                                </Text>
                            </View>
                        )}
                        {standard.conditions && (
                            <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                                <Text style={[styles.compensationDetailLabel, {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {translations.conditions}:
                                </Text>
                                <Text style={[styles.compensationDetailValue, {
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {standard.conditions}
                                </Text>
                            </View>
                        )}
                        <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                            <Text style={[styles.compensationDetailLabel, {
                                color: theme.colors.textSecondary,
                                textAlign: isRTL ? 'right' : 'left',
                            }]}>
                                {translations.period}:
                            </Text>
                            <Text style={[styles.compensationDetailValue, {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left',
                            }]}>
                                {standard.period}
                            </Text>
                        </View>
                        <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                            <Text style={[styles.compensationDetailLabel, {
                                color: theme.colors.textSecondary,
                                textAlign: isRTL ? 'right' : 'left',
                            }]}>
                                {translations.additionalCompensation}:
                            </Text>
                            <Text style={[styles.compensationDetailValue, {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left',
                            }]}>
                                {standard.additionalCompensation}
                            </Text>
                        </View>
                        {standard.notes && (
                            <View style={[styles.compensationDetailRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                                <Text style={[styles.compensationDetailLabel, {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {translations.notes}:
                                </Text>
                                <Text style={[styles.compensationDetailValue, {
                                    color: theme.colors.text,
                                    textAlign: isRTL ? 'right' : 'left',
                                }]}>
                                    {standard.notes}
                                </Text>
                            </View>
                        )}
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
                    {translations.mainDescription}
                </Text>
            </View>

            {/* Main Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Quick Stats */}
                {/* <QuickStatsCard /> */}

                {/* Download Guide Button */}
                <TouchableOpacity
                    style={[styles.downloadButton, {
                        backgroundColor: theme.colors.primary,
                        flexDirection: isRTL ? 'row-reverse' : 'row'
                    }]}
                    onPress={handleDownloadGuide}
                    activeOpacity={0.8}>
                    <ArrowDownload24Regular
                        style={[styles.downloadIcon, {
                            color: '#ffffff',
                            marginRight: isRTL ? 0 : 8,
                            marginLeft: isRTL ? 8 : 0
                        }]}
                    />
                    <Text style={[styles.downloadButtonText, { color: '#ffffff' }]}>
                        {translations.downloadGuide}
                    </Text>
                </TouchableOpacity>

                {/* Service Standards Section */}
                {groupedStandards.service.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.service}
                            count={groupedStandards.service.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.service.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Restoration Standards Section */}
                {groupedStandards.restoration.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.restoration}
                            count={groupedStandards.restoration.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.restoration.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Notification Standards Section */}
                {groupedStandards.notification.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.notification}
                            count={groupedStandards.notification.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.notification.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Emergency Standards Section */}
                {groupedStandards.emergency.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.emergency}
                            count={groupedStandards.emergency.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.emergency.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Violation Standards Section */}
                {groupedStandards.violation.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.violation}
                            count={groupedStandards.violation.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.violation.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Complaint Standards Section */}
                {groupedStandards.complaint.length > 0 && (
                    <>
                        <SectionHeader
                            title={translations.categories.complaint}
                            count={groupedStandards.complaint.length}
                        />
                        <View style={styles.sectionContent}>
                            {groupedStandards.complaint.map(standard => (
                                <CompensationCard key={standard.id} standard={standard} />
                            ))}
                        </View>
                    </>
                )}

                {/* Additional Info Section */}
                <View style={[styles.infoSection, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.infoTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL ? 'كيف يصرف التعويض؟ ومتى؟' : 'Additional Information'}
                    </Text>
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isRTL
                            ? 'يصل التعويض للمستهلك دون حاجة لتقديم شكوى أو مطالبة، يضاف كرصيد في الفاتورة خلال 10 أيام عمل من انتهاء الحالة، ويمكن طلب تحويل الرصيد إلى الحساب البنكي'
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
        gap: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 14,
        minHeight: 28,
    },
    // Section Styles
    sectionHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
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
        minWidth: 0,
    },
    compensationTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 20,
        width: '100%',
    },
    compensationAmountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        maxWidth: '100%',
    },
    compensationAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    compensationLabel: {
        fontSize: 13,
        fontWeight: '500',
        flexShrink: 1,
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
        width: '100%',
    },
    compensationDetailLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    compensationDetailValue: {
        fontSize: 14,
        lineHeight: 20,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    downloadIcon: {
        width: 20,
        height: 20,
    },
    downloadButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CompensationStandardsScreen; 