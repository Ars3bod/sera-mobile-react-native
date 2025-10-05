import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Modal,
    FlatList,
    Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import {
    ArrowLeft24Regular,
    ChevronDown24Regular,
    ChevronUp24Regular,
    Checkmark24Regular,
} from '@fluentui/react-native-icons';

import SafeContainer from '../components/SafeContainer';
import SessionWrapper from '../components/SessionWrapper';
import ActionToast from '../components/ActionToast';
import Toast from '../components/Toast';
import foiService from '../services/foiService';

const CreateFOIScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { user } = useUser();
    const isRTL = i18n.language === 'ar';

    // Form state
    const [formData, setFormData] = useState({
        requesterName: '',
        requesterId: '',
        requesterPhone: '',
        requesterEmail: '',
        requestTitle: '',
        reasonForRequestId: '',
        otherReasonOfRequest: '',
        isDataAnalysisPublished: false,
        isDataProvidedThirdParty: false,
        isContainsPersonalData: false,
        requiredDataDetails: '',
        evaluationId: 1, // 1 = Yes, 0 = No
        declaration: false,
    });

    // Modal states
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [noticeExpanded, setNoticeExpanded] = useState(false);

    // Toast states
    const [actionToastVisible, setActionToastVisible] = useState(false);
    const [actionToastData, setActionToastData] = useState({});
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');

    // Reason options
    const reasonOptions = [
        { id: 0, labelKey: 'foi.create.form.options.reasonForRequest.personal' },
        { id: 1, labelKey: 'foi.create.form.options.reasonForRequest.research' },
        { id: 2, labelKey: 'foi.create.form.options.reasonForRequest.business' },
        { id: 3, labelKey: 'foi.create.form.options.reasonForRequest.other' },
    ];

    // Pre-fill user data
    useEffect(() => {
        if (user) {
            const fullName = isRTL ? user.arFullName || user.arFull : user.enFullName || user.enFull;
            const nationalId = user.nationalId || user.id || '';

            setFormData(prev => ({
                ...prev,
                requesterName: fullName || '',
                requesterId: nationalId.toString() || '',
            }));
        }
    }, [user, isRTL]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Toast handlers
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

    // Form validation
    const validateForm = () => {
        if (!formData.requesterName.trim()) {
            showToast(t('foi.create.form.validation.nameRequired'), 'error');
            return false;
        }

        if (!formData.requesterId.trim()) {
            showToast(t('foi.create.form.validation.idRequired'), 'error');
            return false;
        }

        if (!formData.requesterPhone.trim()) {
            showToast(t('foi.create.form.validation.phoneRequired'), 'error');
            return false;
        }

        if (!formData.requesterEmail.trim()) {
            showToast(t('foi.create.form.validation.emailRequired'), 'error');
            return false;
        }

        if (!formData.requestTitle.trim()) {
            showToast(t('foi.create.form.validation.requestTitleRequired'), 'error');
            return false;
        }

        if (formData.reasonForRequestId === '') {
            showToast(t('foi.create.form.validation.reasonRequired'), 'error');
            return false;
        }

        if (formData.reasonForRequestId === 3 && !formData.otherReasonOfRequest.trim()) {
            showToast(t('foi.create.form.validation.otherReasonRequired'), 'error');
            return false;
        }

        if (!formData.requiredDataDetails.trim()) {
            showToast(t('foi.create.form.validation.dataDetailsRequired'), 'error');
            return false;
        }

        if (!formData.declaration) {
            showToast(t('foi.create.form.validation.declarationRequired'), 'error');
            return false;
        }

        return true;
    };

    // Submit form
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const requestData = {
                RequesterId: formData.requesterId,
                RequesterFullName: formData.requesterName,
                RequesterPhone: formData.requesterPhone,
                RequesterMail: formData.requesterEmail,
                RequestTitle: formData.requestTitle,
                ReasonForRequestId: formData.reasonForRequestId.toString(),
                OtherReasonOfRequest: formData.otherReasonOfRequest || '',
                IsDataAnalysisPublished: formData.isDataAnalysisPublished.toString(),
                IsDataProvidedThirdParty: formData.isDataProvidedThirdParty.toString(),
                IsContainsPersonalData: formData.isContainsPersonalData.toString(),
                RequiredDataDetails: formData.requiredDataDetails,
                EvaluationId: formData.evaluationId,
                Lang: i18n.language === 'ar' ? 0 : 1,
            };

            const response = await foiService.submitFOIRequest(requestData);

            if (response.success) {
                showActionToast(
                    t('foi.create.form.success.title'),
                    t('foi.create.form.success.message', { requestNo: response.requestNo }),
                    () => {
                        hideActionToast();
                        navigation.goBack();
                    },
                    t('common.ok'),
                    false
                );
            } else {
                showToast(response.errorMessage || t('foi.create.form.submitError'), 'error');
            }
        } catch (error) {
            console.error('Error submitting FOI request:', error);
            showToast(t('foi.create.form.submitError'), 'error');
        }
    };

    // Render dropdown
    const renderDropdown = (label, value, onPress, required = false) => (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
                style={[
                    styles.dropdown,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                ]}
                onPress={onPress}
                activeOpacity={0.7}>
                <Text
                    style={[
                        styles.dropdownText,
                        {
                            color: value ? theme.colors.text : theme.colors.textSecondary,
                            textAlign: isRTL ? 'right' : 'left',
                            flex: 1,
                        },
                    ]}>
                    {value || t('foi.create.form.selectOption')}
                </Text>
                <ChevronDown24Regular style={{ color: theme.colors.textSecondary }} />
            </TouchableOpacity>
        </View>
    );

    // Render text input
    const renderTextInput = (label, value, onChangeText, placeholder, required = false, multiline = false, editable = true) => (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
                style={[
                    multiline ? styles.textArea : styles.textInput,
                    {
                        backgroundColor: editable ? theme.colors.surface : theme.colors.border + '40',
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                    },
                    !editable && styles.textInputDisabled,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                textAlignVertical={multiline ? 'top' : 'center'}
                editable={editable}
            />
        </View>
    );

    // Render phone input
    const renderPhoneInput = () => (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('foi.create.form.fields.requesterPhone')}
                <Text style={styles.required}> *</Text>
            </Text>
            <View
                style={[
                    styles.phoneInputContainer,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                    },
                ]}>
                <Text style={[styles.phonePrefix, { color: theme.colors.text }]}>+966</Text>
                <TextInput
                    style={[
                        styles.phoneInput,
                        {
                            color: theme.colors.text,
                            textAlign: 'left',
                        },
                    ]}
                    value={formData.requesterPhone}
                    onChangeText={(text) => updateFormData('requesterPhone', text)}
                    placeholder="5XXXXXXXX"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="phone-pad"
                    maxLength={9}
                />
            </View>
        </View>
    );

    // Render Yes/No toggle
    const renderToggle = (label, value, onValueChange, required = false) => (
        <View style={[styles.toggleGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.label, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left', flex: 1 }]}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
                thumbColor={value ? theme.colors.primary : theme.colors.surface}
            />
        </View>
    );

    // Render declaration checkbox
    const renderDeclaration = () => (
        <View style={styles.declarationContainer}>
            <TouchableOpacity
                style={[
                    styles.declarationBox,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                ]}
                onPress={() => updateFormData('declaration', !formData.declaration)}
                activeOpacity={0.7}>
                <View
                    style={[
                        styles.checkbox,
                        {
                            borderColor: formData.declaration ? theme.colors.primary : theme.colors.border,
                            backgroundColor: formData.declaration ? theme.colors.primary : 'transparent',
                        },
                    ]}>
                    {formData.declaration && (
                        <Checkmark24Regular style={{ color: '#FFFFFF', width: 20, height: 20 }} />
                    )}
                </View>
                <Text
                    style={[
                        styles.declarationText,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                            marginLeft: isRTL ? 0 : 12,
                            marginRight: isRTL ? 12 : 0,
                        },
                    ]}>
                    {t('foi.create.form.declaration')}
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Render reason modal
    const renderReasonModal = () => (
        <Modal
            visible={showReasonModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowReasonModal(false)}>
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowReasonModal(false)}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.modalTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                        {t('foi.create.form.fields.reasonForRequest')}
                    </Text>
                    <FlatList
                        data={reasonOptions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    updateFormData('reasonForRequestId', item.id);
                                    setShowReasonModal(false);
                                }}
                                activeOpacity={0.7}>
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        {
                                            color: theme.colors.text,
                                            textAlign: isRTL ? 'right' : 'left',
                                        },
                                    ]}>
                                    {t(item.labelKey)}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity
                        style={[styles.modalCloseButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => setShowReasonModal(false)}
                        activeOpacity={0.8}>
                        <Text style={styles.modalCloseText}>{t('common.close')}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    // Get selected reason label
    const getReasonLabel = () => {
        const reason = reasonOptions.find(r => r.id === formData.reasonForRequestId);
        return reason ? t(reason.labelKey) : '';
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
        placeholderView: {
            width: 40,
        },
        submitButton: {
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            margin: 20,
            marginTop: 8,
        },
        submitButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
    });

    return (
        <SessionWrapper>
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
                    <Text style={dynamicStyles.headerTitle}>
                        {t('foi.create.title')}
                    </Text>
                    <View style={dynamicStyles.placeholderView} />
                </View>

                {/* Form */}
                <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
                    <View style={styles.formContainer}>
                        {/* Section: Basic Information */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                            {t('foi.create.form.sections.basicInfo')}
                        </Text>

                        {renderTextInput(
                            t('foi.create.form.fields.requesterName'),
                            formData.requesterName,
                            (text) => updateFormData('requesterName', text),
                            t('foi.create.form.enterText'),
                            true,
                            false,
                            false
                        )}

                        {renderTextInput(
                            t('foi.create.form.fields.requesterId'),
                            formData.requesterId,
                            (text) => updateFormData('requesterId', text),
                            t('foi.create.form.enterText'),
                            true,
                            false,
                            false
                        )}

                        {renderPhoneInput()}

                        {renderTextInput(
                            t('foi.create.form.fields.requesterEmail'),
                            formData.requesterEmail,
                            (text) => updateFormData('requesterEmail', text),
                            'example@email.com',
                            true
                        )}

                        {/* Section: Request Details */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left', marginTop: 24 }]}>
                            {t('foi.create.form.sections.requestDetails')}
                        </Text>

                        {renderTextInput(
                            t('foi.create.form.fields.requestTitle'),
                            formData.requestTitle,
                            (text) => updateFormData('requestTitle', text),
                            t('foi.create.form.enterText'),
                            true
                        )}

                        {renderDropdown(
                            t('foi.create.form.fields.reasonForRequest'),
                            getReasonLabel(),
                            () => setShowReasonModal(true),
                            true
                        )}

                        {/* Conditional: Other Reason */}
                        {formData.reasonForRequestId === 3 && renderTextInput(
                            t('foi.create.form.fields.otherReasonOfRequest'),
                            formData.otherReasonOfRequest,
                            (text) => updateFormData('otherReasonOfRequest', text),
                            t('foi.create.form.enterText'),
                            true
                        )}

                        {/* Yes/No Questions */}
                        {renderToggle(
                            t('foi.create.form.fields.isDataAnalysisPublished'),
                            formData.isDataAnalysisPublished,
                            (value) => updateFormData('isDataAnalysisPublished', value)
                        )}

                        {renderToggle(
                            t('foi.create.form.fields.isDataProvidedThirdParty'),
                            formData.isDataProvidedThirdParty,
                            (value) => updateFormData('isDataProvidedThirdParty', value)
                        )}

                        {renderToggle(
                            t('foi.create.form.fields.isContainsPersonalData'),
                            formData.isContainsPersonalData,
                            (value) => updateFormData('isContainsPersonalData', value)
                        )}

                        {renderTextInput(
                            t('foi.create.form.fields.requiredDataDetails'),
                            formData.requiredDataDetails,
                            (text) => updateFormData('requiredDataDetails', text),
                            t('foi.create.form.enterText'),
                            true,
                            true
                        )}

                        {renderToggle(
                            t('foi.create.form.fields.isSatisfiedWithProcess'),
                            formData.evaluationId === 1,
                            (value) => updateFormData('evaluationId', value ? 1 : 0)
                        )}

                        {/* Declaration */}
                        {renderDeclaration()}

                        {/* Notice Card - Minimized at bottom */}
                        <TouchableOpacity
                            style={[
                                styles.noticeCardMinimized,
                                {
                                    backgroundColor: theme.colors.surface,
                                    borderColor: theme.colors.border,
                                },
                            ]}
                            onPress={() => setNoticeExpanded(!noticeExpanded)}
                            activeOpacity={0.7}>
                            <View style={[styles.noticeHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Text
                                    style={[
                                        styles.noticeTitleMinimized,
                                        {
                                            color: theme.colors.primary,
                                            textAlign: isRTL ? 'right' : 'left',
                                        },
                                    ]}>
                                    {t('foi.create.form.notice.title')}
                                </Text>
                                {noticeExpanded ? (
                                    <ChevronUp24Regular style={[styles.noticeChevron, { color: theme.colors.primary }]} />
                                ) : (
                                    <ChevronDown24Regular style={[styles.noticeChevron, { color: theme.colors.primary }]} />
                                )}
                            </View>
                            {noticeExpanded && (
                                <View style={styles.noticeContent}>
                                    <Text style={[styles.noticePoint, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                        • {t('foi.create.form.notice.point1')}
                                    </Text>
                                    <Text style={[styles.noticePoint, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                        • {t('foi.create.form.notice.point2')}
                                    </Text>
                                    <Text style={[styles.noticePoint, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                        • {t('foi.create.form.notice.point3')}
                                    </Text>
                                    <Text style={[styles.noticePoint, { color: theme.colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                                        • {t('foi.create.form.notice.point4')}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={dynamicStyles.submitButton}
                        onPress={handleSubmit}
                        activeOpacity={0.8}>
                        <Text style={dynamicStyles.submitButtonText}>
                            {t('foi.create.form.submit')}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Reason Modal */}
                {renderReasonModal()}

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
        </SessionWrapper>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    required: {
        color: '#F44336',
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    textInputDisabled: {
        opacity: 0.6,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        minHeight: 100,
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
    },
    phonePrefix: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontWeight: '600',
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    toggleGroup: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    declarationContainer: {
        marginVertical: 20,
    },
    declarationBox: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    declarationText: {
        fontSize: 14,
        lineHeight: 22,
        flex: 1,
    },
    noticeCardMinimized: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        marginBottom: 8,
    },
    noticeHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    noticeTitleMinimized: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    noticeChevron: {
        width: 24,
        height: 24,
    },
    noticeContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    noticePoint: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 20,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    modalItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalItemText: {
        fontSize: 16,
    },
    modalCloseButton: {
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CreateFOIScreen;

