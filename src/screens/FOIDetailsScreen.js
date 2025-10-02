import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    Switch,

} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
    ArrowLeft24Regular,
    DocumentText24Regular,
    Dismiss24Regular,
    Warning24Regular,
} from '@fluentui/react-native-icons';

import SafeContainer from '../components/SafeContainer';
import ActionToast from '../components/ActionToast';
import Toast from '../components/Toast';
import { LoadingIndicator } from '../components';
import axios from 'axios';

const FOIDetailsScreen = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isRTL = i18n.language === 'ar';
    const { request } = route.params || {};

    // Grievance modal state
    const [showGrievanceModal, setShowGrievanceModal] = useState(false);
    const [grievanceTitle, setGrievanceTitle] = useState('');
    const [grievanceDetails, setGrievanceDetails] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toast states
    const [actionToastVisible, setActionToastVisible] = useState(false);
    const [actionToastData, setActionToastData] = useState({});
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');

    const handleGoBack = () => {
        navigation.goBack();
    };

    const showActionToast = (title, message, onConfirm, confirmText = t('common.ok'), showCancel = false) => {
        setActionToastData({
            title,
            message,
            onConfirm,
            confirmText,
            showCancel,
        });
        setActionToastVisible(true);
    };

    const hideActionToast = () => {
        setActionToastVisible(false);
    };

    const showToast = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    };

    const hideToast = () => {
        setToastVisible(false);
    };

    const handleOpenGrievanceModal = () => {
        setGrievanceTitle('');
        setGrievanceDetails('');
        setAcceptTerms(false);
        setShowGrievanceModal(true);
    };

    const handleCloseGrievanceModal = () => {
        setShowGrievanceModal(false);
    };

    const validateGrievanceForm = () => {
        if (!grievanceTitle.trim()) {
            showToast(t('foi.details.grievance.validation.titleRequired'), 'error');
            return false;
        }

        if (!grievanceDetails.trim()) {
            showToast(t('foi.details.grievance.validation.detailsRequired'), 'error');
            return false;
        }

        if (!acceptTerms) {
            showToast(t('foi.details.grievance.validation.termsRequired'), 'error');
            return false;
        }

        return true;
    };

    const handleSubmitGrievance = async () => {
        if (!validateGrievanceForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                'https://sera.gov.sa/api/sitecore/Grievance/SaveFOIGrievance',
                {
                    RequestNo: request.requestNo.toString(),
                    GrievanceTitle: grievanceTitle.trim(),
                    GrievanceDetails: grievanceDetails.trim(),
                    acceptTerms: acceptTerms,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ff0ef6ae-eef6-47fb-88a6-147292210f82',
                    },
                    timeout: 30000,
                }
            );

            if (response.data.Success) {
                handleCloseGrievanceModal();
                showActionToast(
                    t('foi.details.grievance.success.title'),
                    t('foi.details.grievance.success.message', {
                        grievanceNo: response.data.GrievanceData?.GrievanceNo
                    }),
                    () => {
                        hideActionToast();
                        navigation.goBack();
                    },
                    t('common.ok'),
                    false
                );
            } else {
                showToast(
                    response.data.ErrorMessage || t('foi.details.grievance.submitError'),
                    'error'
                );
            }
        } catch (error) {
            console.error('Error submitting grievance:', error);
            showToast(
                error.response?.data?.ErrorMessage || t('foi.details.grievance.submitError'),
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!request) {
        return (
            <SafeContainer>
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
                        {t('foi.details.title')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
                    <DocumentText24Regular
                        style={{ color: theme.colors.textSecondary, width: 48, height: 48 }}
                    />
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                        {t('foi.details.noData')}
                    </Text>
                </View>
            </SafeContainer>
        );
    }

    // Render detail row
    const renderDetailRow = (label, value, highlight = false) => {
        if (!value || value === 'N/A') return null;

        return (
            <View style={[styles.detailRow, { borderBottomColor: theme.colors.border }]}>
                <Text
                    style={[
                        styles.detailLabel,
                        {
                            color: theme.colors.textSecondary,
                            textAlign: isRTL ? 'right' : 'left',
                        },
                    ]}>
                    {label}
                </Text>
                <Text
                    style={[
                        styles.detailValue,
                        {
                            color: highlight ? theme.colors.primary : theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                            fontWeight: highlight ? '600' : '400',
                        },
                    ]}>
                    {value}
                </Text>
            </View>
        );
    };

    // Render Yes/No value
    const renderYesNo = (value) => {
        return value ? t('foi.create.form.yes') : t('foi.create.form.no');
    };

    // Dynamic styles
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
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.primary,
            textAlign: 'center',
            flex: 1,
        },
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            backgroundColor: `${request.statusColor}20`,
        },
        statusText: {
            fontSize: 14,
            fontWeight: '600',
            color: request.statusColor,
        },
        content: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        section: {
            backgroundColor: theme.colors.surface,
            marginHorizontal: 20,
            marginVertical: 12,
            borderRadius: 16,
            padding: 16,
            ...theme.shadows.small,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 16,
        },
    });

    return (
        <SafeContainer>
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
                <Text style={dynamicStyles.headerTitle}>
                    {t('foi.details.title')}
                </Text>
                <View style={dynamicStyles.statusBadge}>
                    <Text style={dynamicStyles.statusText}>
                        {request.statusLabel}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={dynamicStyles.content}>
                {/* Basic Information */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>
                        {t('foi.details.basicInfo')}
                    </Text>
                    {renderDetailRow(
                        t('foi.details.requestNo'),
                        request.requestNo?.toString(),
                        true
                    )}
                    {renderDetailRow(
                        t('foi.details.requestTitle'),
                        request.title
                    )}
                    {renderDetailRow(
                        t('foi.details.requesterName'),
                        request.requesterName
                    )}
                    {renderDetailRow(
                        t('foi.details.requesterEmail'),
                        request.requesterEmail
                    )}
                    {renderDetailRow(
                        t('foi.details.requesterPhone'),
                        request.requesterPhone
                    )}
                </View>

                {/* Request Details */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>
                        {t('foi.details.requestDetails')}
                    </Text>
                    {renderDetailRow(
                        t('foi.details.reasonForRequest'),
                        request.reasonForRequest
                    )}
                    {request.otherReasonOfRequest && renderDetailRow(
                        t('foi.details.otherReason'),
                        request.otherReasonOfRequest
                    )}
                    {renderDetailRow(
                        t('foi.details.requiredDataDetails'),
                        request.requiredDataDetails
                    )}
                    {renderDetailRow(
                        t('foi.details.isDataAnalysisPublished'),
                        renderYesNo(request.isDataAnalysisPublished)
                    )}
                    {renderDetailRow(
                        t('foi.details.isDataProvidedThirdParty'),
                        renderYesNo(request.isDataProvidedThirdParty)
                    )}
                    {renderDetailRow(
                        t('foi.details.isContainsPersonalData'),
                        renderYesNo(request.isContainsPersonalData)
                    )}
                </View>

                {/* Important Dates */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>
                        {t('foi.details.dates')}
                    </Text>
                    {renderDetailRow(
                        t('foi.details.requestRaisedDate'),
                        request.requestRaisedDateFormatted
                    )}
                    {renderDetailRow(
                        t('foi.details.lastUpdatedDate'),
                        request.lastUpdatedDateFormatted
                    )}
                </View>

                {/* Rejection Reason (if rejected) */}
                {request.status === 2 && request.reasonForRejection && (
                    <View style={dynamicStyles.section}>
                        <Text style={dynamicStyles.sectionTitle}>
                            {t('foi.details.rejectionReason')}
                        </Text>
                        <Text
                            style={[
                                styles.rejectionText,
                                {
                                    color: '#F44336',
                                    textAlign: isRTL ? 'right' : 'left',
                                },
                            ]}>
                            {request.reasonForRejection}
                        </Text>
                    </View>
                )}

                {/* Grievance Button (if rejected) */}
                {request.status === 2 && (
                    <TouchableOpacity
                        style={[styles.grievanceButton, { backgroundColor: '#F44336' }]}
                        onPress={handleOpenGrievanceModal}
                        activeOpacity={0.8}>
                        <Warning24Regular style={{ color: '#FFFFFF', width: 20, height: 20 }} />
                        <Text style={styles.grievanceButtonText}>
                            {t('foi.details.grievance.submitButton')}
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* Grievance Modal */}
            <Modal
                visible={showGrievanceModal}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseGrievanceModal}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
                        {/* Modal Header */}
                        <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                {t('foi.details.grievance.title')}
                            </Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={handleCloseGrievanceModal}
                                activeOpacity={0.7}>
                                <Dismiss24Regular style={{ color: theme.colors.textSecondary, width: 24, height: 24 }} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                            {/* Request Number (read-only) */}
                            <View style={styles.formGroup}>
                                <Text style={[styles.formLabel, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                    {t('foi.details.grievance.requestNumber')}
                                </Text>
                                <View
                                    style={[
                                        styles.formInput,
                                        styles.formInputDisabled,
                                        {
                                            backgroundColor: theme.colors.border + '40',
                                            borderColor: theme.colors.border,
                                        },
                                    ]}>
                                    <Text style={[styles.formInputText, { color: theme.colors.text }]}>
                                        {request.requestNo}
                                    </Text>
                                </View>
                            </View>

                            {/* Grievance Title */}
                            <View style={styles.formGroup}>
                                <Text style={[styles.formLabel, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                    {t('foi.details.grievance.grievanceTitle')}
                                    <Text style={styles.required}> *</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.formInput,
                                        {
                                            backgroundColor: theme.colors.surface,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.text,
                                            textAlign: isRTL ? 'right' : 'left',
                                        },
                                    ]}
                                    value={grievanceTitle}
                                    onChangeText={setGrievanceTitle}
                                    placeholder={t('foi.details.grievance.enterTitle')}
                                    placeholderTextColor={theme.colors.textSecondary}
                                />
                            </View>

                            {/* Grievance Details */}
                            <View style={styles.formGroup}>
                                <Text style={[styles.formLabel, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                    {t('foi.details.grievance.grievanceDetails')}
                                    <Text style={styles.required}> *</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.formTextArea,
                                        {
                                            backgroundColor: theme.colors.surface,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.text,
                                            textAlign: isRTL ? 'right' : 'left',
                                        },
                                    ]}
                                    value={grievanceDetails}
                                    onChangeText={setGrievanceDetails}
                                    placeholder={t('foi.details.grievance.enterDetails')}
                                    placeholderTextColor={theme.colors.textSecondary}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Terms Checkbox */}
                            <View style={[styles.termsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Switch
                                    value={acceptTerms}
                                    onValueChange={setAcceptTerms}
                                    trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
                                    thumbColor={acceptTerms ? theme.colors.primary : theme.colors.surface}
                                />
                                <Text
                                    style={[
                                        styles.termsText,
                                        {
                                            color: theme.colors.text,
                                            textAlign: isRTL ? 'right' : 'left',
                                            marginLeft: isRTL ? 0 : 12,
                                            marginRight: isRTL ? 12 : 0,
                                        },
                                    ]}>
                                    {t('foi.details.grievance.declaration')}
                                </Text>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    {
                                        backgroundColor: isSubmitting ? theme.colors.border : theme.colors.primary,
                                    },
                                ]}
                                onPress={handleSubmitGrievance}
                                disabled={isSubmitting}
                                activeOpacity={0.8}>
                                {isSubmitting ? (
                                    <LoadingIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        {t('foi.details.grievance.submit')}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Action Toast */}
            <ActionToast
                visible={actionToastVisible}
                title={actionToastData.title}
                message={actionToastData.message}
                onConfirm={actionToastData.onConfirm}
                onCancel={hideActionToast}
                confirmText={actionToastData.confirmText}
                showCancel={actionToastData.showCancel}
            />

            {/* Toast */}
            <Toast
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onHide={hideToast}
            />
        </SafeContainer>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
    },
    detailRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    detailLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        lineHeight: 22,
    },
    rejectionText: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
    },
    grievanceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    grievanceButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingTop: 20,
        paddingBottom: 40,
    },
    modalHeader: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    required: {
        color: '#F44336',
    },
    formInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    formInputDisabled: {
        opacity: 0.6,
    },
    formInputText: {
        fontSize: 16,
    },
    formTextArea: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        minHeight: 100,
    },
    termsContainer: {
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    termsText: {
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FOIDetailsScreen;

