import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
    ArrowLeft24Regular,
    Calendar24Regular,
    Person24Regular,
    Document24Regular,
    Info24Regular,
} from '@fluentui/react-native-icons';

import SafeContainer from '../components/SafeContainer';

const DataShareDetailsScreen = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const isRTL = i18n.language === 'ar';
    const { request } = route.params || {};

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Dynamic styles based on theme and direction
    const dynamicStyles = StyleSheet.create({
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
        backButton: {
            padding: 8,
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
        statusBadge: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
        },
        statusText: {
            fontSize: 14,
            fontWeight: '600',
        },
        content: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        section: {
            backgroundColor: theme.colors.surface,
            marginHorizontal: 20,
            marginTop: 20,
            borderRadius: 16,
            padding: 20,
            ...theme.shadows.small,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 16,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
        },
        detailRow: {
            marginBottom: 16,
        },
        detailLabel: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 4,
        },
        detailValue: {
            fontSize: 16,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            fontWeight: '500',
        },
        rejectionBox: {
            backgroundColor: '#F4433615',
            borderLeftWidth: isRTL ? 0 : 4,
            borderRightWidth: isRTL ? 4 : 0,
            borderColor: '#F44336',
            padding: 16,
            borderRadius: 8,
            marginTop: 20,
        },
        rejectionTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: '#F44336',
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 8,
        },
        rejectionText: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            lineHeight: 20,
        },
    });

    if (!request) {
        return (
            <SafeContainer backgroundColor={theme.colors.background}>
                <View style={dynamicStyles.header}>
                    <TouchableOpacity
                        style={dynamicStyles.backButton}
                        onPress={handleGoBack}
                        activeOpacity={0.7}>
                        <ArrowLeft24Regular
                            style={[
                                dynamicStyles.backIcon,
                                { transform: [{ scaleX: isRTL ? -1 : 1 }] },
                            ]}
                        />
                    </TouchableOpacity>
                    <Text style={dynamicStyles.headerTitle}>
                        {t('dataShare.details.title')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.textSecondary }}>
                        {t('dataShare.details.noData')}
                    </Text>
                </View>
            </SafeContainer>
        );
    }

    return (
        <SafeContainer backgroundColor={theme.colors.background}>
            {/* Header */}
            <View style={dynamicStyles.header}>
                <TouchableOpacity
                    style={dynamicStyles.backButton}
                    onPress={handleGoBack}
                    activeOpacity={0.7}>
                    <ArrowLeft24Regular
                        style={[
                            dynamicStyles.backIcon,
                            { transform: [{ scaleX: isRTL ? -1 : 1 }] },
                        ]}
                    />
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle} numberOfLines={1}>
                    {t('dataShare.details.title')}
                </Text>
                <View
                    style={[
                        dynamicStyles.statusBadge,
                        { backgroundColor: `${request.statusColor}15` },
                    ]}>
                    <Text
                        style={[dynamicStyles.statusText, { color: request.statusColor }]}>
                        {request.statusLabel}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={dynamicStyles.content}>
                {/* Basic Information */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>
                        <Info24Regular
                            style={{ color: theme.colors.primary, marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}
                        />
                        {t('dataShare.details.basicInfo')}
                    </Text>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.applicationNo')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.applicationNo}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.requestTitle')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.title}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.applicantName')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.applicantName}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.email')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.email}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.contactNo')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.contactNo}
                        </Text>
                    </View>
                </View>

                {/* Request Details */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>
                        <Document24Regular
                            style={{ color: theme.colors.primary, marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}
                        />
                        {t('dataShare.details.requestDetails')}
                    </Text>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.requiredDataDetails')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.requiredDataDetails}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.legalJustification')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.legalJustificationDescription}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.dataFormatType')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.dataFormatType}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.requestNature')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.requestNature}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.requestPriority')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.requestPriority}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.reasonForRequest')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.reasonForRequest}
                        </Text>
                    </View>
                </View>

                {/* Dates */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>
                        <Calendar24Regular
                            style={{ color: theme.colors.primary, marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}
                        />
                        {t('dataShare.details.dates')}
                    </Text>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.requestRaisedDate')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.requestRaisedDateFormatted}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.lastUpdatedDate')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.lastUpdatedDateFormatted}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.timeStart')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.timeStartFormatted}
                        </Text>
                    </View>

                    <View style={dynamicStyles.detailRow}>
                        <Text style={dynamicStyles.detailLabel}>
                            {t('dataShare.details.timeEnd')}
                        </Text>
                        <Text style={dynamicStyles.detailValue}>
                            {request.timeEndFormatted}
                        </Text>
                    </View>
                </View>

                {/* Rejection Reason (if rejected) */}
                {request.status === 2 && request.reasonForRejection && (
                    <View style={dynamicStyles.section}>
                        <View style={dynamicStyles.rejectionBox}>
                            <Text style={dynamicStyles.rejectionTitle}>
                                {t('dataShare.details.rejectionReason')}
                            </Text>
                            <Text style={dynamicStyles.rejectionText}>
                                {request.reasonForRejection}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeContainer>
    );
};

export default DataShareDetailsScreen;

