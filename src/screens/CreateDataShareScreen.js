import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Switch,
    Modal,
    FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import {
    ArrowLeft24Regular,
    Info24Regular,
    ChevronDown24Regular,
    Attach24Regular,
    Checkmark24Regular,
    Delete24Regular,
    Document24Regular,
} from '@fluentui/react-native-icons';
import { pick, isCancel, types } from '@react-native-documents/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import RNFS from 'react-native-fs';

import SafeContainer from '../components/SafeContainer';
import { LoadingSpinner } from '../animations';
import ActionToast from '../components/ActionToast';
import Toast from '../components/Toast';

const CreateDataShareScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const { user } = useUser();
    const isRTL = i18n.language === 'ar';

    // Form state
    const [formData, setFormData] = useState({
        // Basic Data (Auto-filled from user)
        applicantName: '',
        nationalIdentity: '',

        // Entity Type
        entityType: '', // 'government' | 'individual' | 'private'

        // Conditional fields based on entity type
        entityName: '',
        affiliationProofFile: null,
        crNumber: '',
        mobileNumber: '',
        email: '',

        // Request Details
        requestTitle: '',
        requestPurpose: '', // 'personal' | 'research' | 'business' | 'other'
        requestPurposeDescription: '',
        requestType: '', // 'normal' | 'urgent'
        requestNature: '', // 'once' | 'recurring'
        dataFormatType: '', // 'csv' | 'excel' | 'json' | 'pdf'
        participationMechanism: '', // 'dataset' | 'integration'
        timeStart: '',
        timeEnd: '',

        // Yes/No Questions
        isDataProvidedThirdParty: false,
        isDataAnalysisPublished: false,
        dataSharingAgreementExists: false,
        isEntityDataRepresentation: false,
        isContainsPersonalData: false,
        legalBasisForDataRequest: false,

        // Additional fields
        dataSharingAgreementFile: null,
        legalJustificationDescription: '',
        requiredDataDetails: '',
        isSatisfiedWithProcess: false,
        acknowledgeDeclaration: false,
    });

    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(null); // 'timeStart' or 'timeEnd'
    const [tempDate, setTempDate] = useState(new Date());
    const [noticeExpanded, setNoticeExpanded] = useState(false);

    // Modal states for dropdowns
    const [showEntityTypeModal, setShowEntityTypeModal] = useState(false);
    const [showRequestPurposeModal, setShowRequestPurposeModal] = useState(false);
    const [showRequestTypeModal, setShowRequestTypeModal] = useState(false);
    const [showRequestNatureModal, setShowRequestNatureModal] = useState(false);
    const [showDataFormatModal, setShowDataFormatModal] = useState(false);
    const [showParticipationModal, setShowParticipationModal] = useState(false);

    // Toast states
    const [actionToastVisible, setActionToastVisible] = useState(false);
    const [actionToastData, setActionToastData] = useState({});
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    // Toast helper functions
    const showActionToast = (title, message, onConfirm, type = 'success') => {
        setActionToastData({
            title,
            message,
            onConfirm,
            type,
        });
        setActionToastVisible(true);
    };

    const hideActionToast = () => {
        setActionToastVisible(false);
        setActionToastData({});
    };

    const showToast = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    };

    const hideToast = () => {
        setToastVisible(false);
        setToastMessage('');
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Update form data when user data becomes available
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                applicantName: isRTL ? (user.arFullName || user.arFull || '') : (user.enFullName || user.enFull || ''),
                nationalIdentity: user.nationalId || user.id?.toString() || '',
            }));
        }
    }, [user, isRTL]);

    // Update form field
    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Convert file to base64 using react-native-fs
    const convertFileToBase64 = async (fileUri) => {
        try {
            console.log('Converting file from URI:', fileUri);

            // For iOS, the URI might need decoding
            let cleanUri = decodeURIComponent(fileUri);

            // Remove 'file://' prefix if present
            if (cleanUri.startsWith('file://')) {
                cleanUri = cleanUri.replace('file://', '');
            }

            console.log('Reading file from path:', cleanUri);

            // Check if file exists first
            const exists = await RNFS.exists(cleanUri);
            if (!exists) {
                console.error('File does not exist at path:', cleanUri);
                throw new Error('File not found at the specified path');
            }

            // Read file as base64
            const base64String = await RNFS.readFile(cleanUri, 'base64');
            console.log('Successfully converted file to base64, length:', base64String.length);
            return base64String;
        } catch (error) {
            console.error('Error converting file to base64:', error);
            throw error;
        }
    };

    // Handle file picker with size validation
    const handleFilePicker = async (fieldName) => {
        try {
            const result = await pick({
                type: [types.allFiles],
                copyTo: 'cachesDirectory', // Copy file to app's cache directory
            });

            if (result && result.length > 0) {
                const file = result[0];

                console.log('File picked:', {
                    name: file.name,
                    uri: file.uri,
                    fileCopyUri: file.fileCopyUri,
                    size: file.size,
                });

                // Validate file size (max 5MB)
                const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
                if (file.size && file.size > maxSizeInBytes) {
                    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    showToast(
                        t('dataShare.create.form.validation.fileTooLarge', { size: fileSizeMB }),
                        'error'
                    );
                    return;
                }

                // Use fileCopyUri if available (more reliable), otherwise use uri
                const fileUri = file.fileCopyUri || file.uri;

                updateField(fieldName, {
                    name: file.name,
                    uri: fileUri,
                    size: file.size,
                    type: file.type,
                });
            }
        } catch (error) {
            if (isCancel(error)) {
                // User cancelled the picker
                console.log('User cancelled document picker');
            } else {
                console.error('Error picking document:', error);
                showToast(
                    t('dataShare.create.form.filePickerError'),
                    'error'
                );
            }
        }
    };

    // Handle file removal
    const handleRemoveFile = (fieldName, fileName) => {
        showActionToast(
            t('dataShare.create.form.removeFile'),
            t('dataShare.create.form.removeFileConfirm', { fileName }),
            () => {
                updateField(fieldName, null);
                hideActionToast();
            },
            'warning'
        );
    };

    // Validate form
    const validateForm = () => {
        // Basic validation
        if (!formData.entityType) {
            showToast(t('dataShare.create.form.validation.entityTypeRequired'), 'error');
            return false;
        }

        if (!formData.requestTitle.trim()) {
            showToast(t('dataShare.create.form.validation.requestTitleRequired'), 'error');
            return false;
        }

        if (!formData.requestPurpose) {
            showToast(t('dataShare.create.form.validation.requestPurposeRequired'), 'error');
            return false;
        }

        if (!formData.requestType) {
            showToast(t('dataShare.create.form.validation.requestTypeRequired'), 'error');
            return false;
        }

        if (!formData.requestNature) {
            showToast(t('dataShare.create.form.validation.requestNatureRequired'), 'error');
            return false;
        }

        if (!formData.dataFormatType) {
            showToast(t('dataShare.create.form.validation.dataFormatTypeRequired'), 'error');
            return false;
        }

        if (!formData.acknowledgeDeclaration) {
            showToast(t('dataShare.create.form.validation.declarationRequired'), 'error');
            return false;
        }

        // Entity-specific validation
        if (formData.entityType === 'individual') {
            if (!formData.mobileNumber || !formData.email) {
                showToast(t('dataShare.create.form.validation.contactInfoRequired'), 'error');
                return false;
            }
        }

        if (formData.entityType === 'private') {
            if (!formData.entityName || !formData.crNumber || !formData.mobileNumber || !formData.email || !formData.affiliationProofFile) {
                showToast(t('dataShare.create.form.validation.privateEntityInfoRequired'), 'error');
                return false;
            }
        }

        if (formData.entityType === 'government') {
            if (!formData.entityName || !formData.mobileNumber || !formData.email || !formData.affiliationProofFile) {
                showToast(t('dataShare.create.form.validation.governmentEntityInfoRequired'), 'error');
                return false;
            }
        }

        return true;
    };

    // Map form values to API IDs
    const getDataFormatTypeID = (format) => {
        const mapping = { csv: 0, excel: 2, json: 1, pdf: 3 };
        return mapping[format] || 0;
    };

    const getParticipationMechanismID = (mechanism) => {
        const mapping = { dataset: 1, integration: 2 };
        return mapping[mechanism] || 1;
    };

    const getReasonForRequestID = (reason) => {
        const mapping = { personal: 0, research: 1, business: 2, other: 3 };
        return mapping[reason] || 0;
    };

    const getRequestNatureID = (nature) => {
        const mapping = { once: 0, recurring: 1 };
        return mapping[nature] || 0;
    };

    const getRequestPriorityID = (type) => {
        const mapping = { normal: 1, urgent: 0 };
        return mapping[type] || 1;
    };

    const getVisitorTypeID = (entityType) => {
        const mapping = { government: 1, individual: 2, private: 3 };
        return mapping[entityType] || 2;
    };

    const getEntityDataRepresentationID = (value) => {
        return value ? 1 : 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Prepare form data for multipart/form-data submission
            const formDataToSubmit = new FormData();

            // Basic Information
            formDataToSubmit.append('ApplicantFullName', formData.applicantName || '');
            formDataToSubmit.append('NationalIdentity', formData.nationalIdentity || '');
            formDataToSubmit.append('EntityName', formData.entityName || '');
            formDataToSubmit.append('CRNo', formData.crNumber || '');
            formDataToSubmit.append('ContactNo', formData.mobileNumber ? `00966${formData.mobileNumber}` : '');
            formDataToSubmit.append('Email', formData.email || '');

            // Request Details
            formDataToSubmit.append('RequestTitle', formData.requestTitle || '');
            formDataToSubmit.append('OtherReasonOfRequest', formData.requestPurposeDescription || '');

            // Format dates to ISO string
            const timeStart = formData.timeStart ? new Date(formData.timeStart).toISOString() : '';
            const timeEnd = formData.timeEnd ? new Date(formData.timeEnd).toISOString() : '';
            formDataToSubmit.append('TimeStart', timeStart);
            formDataToSubmit.append('TimeEnd', timeEnd);

            // Boolean fields as strings
            formDataToSubmit.append('IsDataAnalysisPublished', String(formData.isDataAnalysisPublished));
            formDataToSubmit.append('IsDataProvidedThirdParty', String(formData.isDataProvidedThirdParty));
            formDataToSubmit.append('DataSharingAgreementExists', String(formData.dataSharingAgreementExists));
            formDataToSubmit.append('IsContainsPersonalData', String(formData.isContainsPersonalData));
            formDataToSubmit.append('LegalBasisForDataRequest', String(formData.legalBasisForDataRequest));

            // Additional fields
            formDataToSubmit.append('LegalJustificationDescription', formData.legalJustificationDescription || '');
            formDataToSubmit.append('RequiredDataDetails', formData.requiredDataDetails || '');

            // IDs and mapped values
            formDataToSubmit.append('EntityDataRepresentationID', String(getEntityDataRepresentationID(formData.isEntityDataRepresentation)));
            formDataToSubmit.append('EntityDataRepresentation', formData.isEntityDataRepresentation ? (isRTL ? 'نعم' : 'Yes') : (isRTL ? 'لا' : 'No'));

            formDataToSubmit.append('DataFormatTypeID', String(getDataFormatTypeID(formData.dataFormatType)));
            formDataToSubmit.append('DataFormatTypeLabel', formData.dataFormatType ? t(`dataShare.create.form.options.dataFormatType.${formData.dataFormatType}`) : '');

            formDataToSubmit.append('ParticipationMechanismID', String(getParticipationMechanismID(formData.participationMechanism)));
            formDataToSubmit.append('ParticipationMechanism', formData.participationMechanism ? t(`dataShare.create.form.options.participationMechanism.${formData.participationMechanism}`) : '');

            formDataToSubmit.append('ReasonForRequestID', String(getReasonForRequestID(formData.requestPurpose)));
            formDataToSubmit.append('ReasonForRequest', formData.requestPurpose ? t(`dataShare.create.form.options.requestPurpose.${formData.requestPurpose}`) : '');

            formDataToSubmit.append('RequestNatureID', String(getRequestNatureID(formData.requestNature)));
            formDataToSubmit.append('RequestNature', formData.requestNature ? t(`dataShare.create.form.options.requestNature.${formData.requestNature}`) : '');

            formDataToSubmit.append('RequestPriorityID', String(getRequestPriorityID(formData.requestType)));
            formDataToSubmit.append('RequestPriority', formData.requestType ? t(`dataShare.create.form.options.requestType.${formData.requestType}`) : '');

            formDataToSubmit.append('VisitorTypeID', String(getVisitorTypeID(formData.entityType)));
            formDataToSubmit.append('VisitorType', formData.entityType ? t(`dataShare.create.form.options.entityType.${formData.entityType}`) : '');

            // File attachments - Convert to base64
            if (formData.affiliationProofFile) {
                try {
                    const base64File = await convertFileToBase64(formData.affiliationProofFile.uri);
                    formDataToSubmit.append('AffiliationProofFile', base64File);
                } catch (error) {
                    console.error('Error converting AffiliationProofFile to base64:', error);
                    showToast(
                        t('dataShare.create.form.validation.fileConversionError'),
                        'error'
                    );
                    return;
                }
            } else {
                formDataToSubmit.append('AffiliationProofFile', '');
            }

            if (formData.dataSharingAgreementFile) {
                try {
                    const base64File = await convertFileToBase64(formData.dataSharingAgreementFile.uri);
                    formDataToSubmit.append('DataSharingAgreementFile', base64File);
                } catch (error) {
                    console.error('Error converting DataSharingAgreementFile to base64:', error);
                    showToast(
                        t('dataShare.create.form.validation.fileConversionError'),
                        'error'
                    );
                    return;
                }
            } else {
                formDataToSubmit.append('DataSharingAgreementFile', '');
            }

            // Submit to API
            const response = await axios.post(
                'https://sera.gov.sa/api/sitecore/DataShare/SubmitDataShareRequest',
                formDataToSubmit,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ff0ef6ae-eef6-47fb-88a6-147292210f82',
                    },
                    timeout: 30000, // 30 seconds timeout
                }
            );

            if (response.data && response.status === 200) {
                showActionToast(
                    t('dataShare.create.form.success.title'),
                    t('dataShare.create.form.success.message'),
                    () => {
                        hideActionToast();
                        navigation.goBack();
                    },
                    'success'
                );
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error submitting data share request:', error);
            showToast(
                error.response?.data?.message || t('dataShare.create.form.submitError'),
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    // Render dropdown selector (like CreateComplaintScreen)
    const renderDropdown = (label, value, onPress, required = false) => {
        return (
            <View style={dynamicStyles.fieldContainer}>
                <Text style={dynamicStyles.fieldLabel}>
                    {label}
                    {required && <Text style={dynamicStyles.required}> *</Text>}
                </Text>
                <TouchableOpacity
                    style={dynamicStyles.dropdownButton}
                    onPress={onPress}
                    activeOpacity={0.7}>
                    <Text
                        style={[
                            dynamicStyles.dropdownButtonText,
                            !value && dynamicStyles.placeholderText,
                        ]}>
                        {value || t('dataShare.create.form.selectOption')}
                    </Text>
                    <ChevronDown24Regular style={dynamicStyles.dropdownIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    // Render selection modal (like CreateComplaintScreen)
    const renderSelectionModal = (visible, setVisible, title, options, fieldName) => (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setVisible(false)}>
            <View style={dynamicStyles.modalOverlay}>
                <View style={dynamicStyles.modalContent}>
                    <Text style={dynamicStyles.modalTitle}>{title}</Text>
                    <FlatList
                        data={options}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={dynamicStyles.modalItem}
                                onPress={() => {
                                    updateField(fieldName, item);
                                    setVisible(false);
                                }}
                                activeOpacity={0.7}>
                                <Text style={dynamicStyles.modalItemText}>
                                    {t(`dataShare.create.form.options.${fieldName}.${item}`)}
                                </Text>
                                {formData[fieldName] === item && (
                                    <Checkmark24Regular style={{ color: theme.colors.primary }} />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity
                        style={dynamicStyles.modalCloseButton}
                        onPress={() => setVisible(false)}
                        activeOpacity={0.7}>
                        <Text style={dynamicStyles.modalCloseText}>
                            {t('common.close')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // Render text input
    const renderTextInput = (label, value, fieldName, required = false, multiline = false, keyboardType = 'default', editable = true) => {
        return (
            <View style={dynamicStyles.fieldContainer}>
                <Text style={dynamicStyles.fieldLabel}>
                    {label}
                    {required && <Text style={dynamicStyles.required}> *</Text>}
                </Text>
                <TextInput
                    style={[
                        dynamicStyles.textInput,
                        multiline && dynamicStyles.textArea,
                        !editable && dynamicStyles.textInputDisabled,
                        { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                    value={value}
                    onChangeText={(text) => updateField(fieldName, text)}
                    placeholder={t('dataShare.create.form.enterText')}
                    placeholderTextColor={theme.colors.textSecondary}
                    multiline={multiline}
                    numberOfLines={multiline ? 4 : 1}
                    keyboardType={keyboardType}
                    editable={editable && !loading}
                />
            </View>
        );
    };

    // Render phone input with +966 prefix (LTR layout)
    const renderPhoneInput = (label, value, fieldName, required = false) => {
        return (
            <View style={dynamicStyles.fieldContainer}>
                <Text style={dynamicStyles.fieldLabel}>
                    {label}
                    {required && <Text style={dynamicStyles.required}> *</Text>}
                </Text>
                <View style={dynamicStyles.phoneInputContainer}>
                    <View style={dynamicStyles.phonePrefix}>
                        <Text style={dynamicStyles.phonePrefixText}>+966</Text>
                    </View>
                    <TextInput
                        style={[dynamicStyles.phoneInput, { textAlign: 'left' }]}
                        value={value}
                        onChangeText={(text) => updateField(fieldName, text)}
                        placeholder="5xxxxxxxx"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="phone-pad"
                        maxLength={9}
                        editable={!loading}
                    />
                </View>
            </View>
        );
    };

    // Format date to display string (keep Gregorian for both languages)
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            // Use en-US formatting with appropriate locale for display
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    // Handle date change with validation
    const handleDateChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowDatePicker(null);
            return;
        }

        if (selectedDate && showDatePicker) {
            const dateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD

            // Validate dates
            if (showDatePicker === 'timeStart') {
                // If end date exists, ensure start date is before end date
                if (formData.timeEnd) {
                    const endDate = new Date(formData.timeEnd);
                    if (selectedDate > endDate) {
                        showToast(
                            t('dataShare.create.form.validation.startDateBeforeEnd'),
                            'error'
                        );
                        setShowDatePicker(null);
                        return;
                    }
                }
            } else if (showDatePicker === 'timeEnd') {
                // If start date exists, ensure end date is after start date
                if (formData.timeStart) {
                    const startDate = new Date(formData.timeStart);
                    if (selectedDate < startDate) {
                        showToast(
                            t('dataShare.create.form.validation.endDateAfterStart'),
                            'error'
                        );
                        setShowDatePicker(null);
                        return;
                    }
                }
            }

            updateField(showDatePicker, dateString);
            setShowDatePicker(null);
        }
    };

    // Render date input
    const renderDateInput = (label, value, fieldName, required = false) => {
        return (
            <View style={dynamicStyles.fieldContainer}>
                <Text style={dynamicStyles.fieldLabel}>
                    {label}
                    {required && <Text style={dynamicStyles.required}> *</Text>}
                </Text>
                <TouchableOpacity
                    style={dynamicStyles.dateInputButton}
                    onPress={() => {
                        if (!loading) {
                            setTempDate(value ? new Date(value) : new Date());
                            setShowDatePicker(fieldName);
                        }
                    }}
                    activeOpacity={0.7}
                    disabled={loading}>
                    <Text
                        style={[
                            dynamicStyles.dateInputText,
                            !value && dynamicStyles.placeholderText,
                        ]}>
                        {value ? formatDateForDisplay(value) : t('dataShare.create.form.selectDate')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Render yes/no switch
    const renderYesNoSwitch = (label, value, fieldName) => {
        return (
            <View style={dynamicStyles.switchContainer}>
                <Text style={[dynamicStyles.switchLabel, { flex: 1 }]}>{label}</Text>
                <View style={dynamicStyles.switchWrapper}>
                    <Text style={dynamicStyles.switchText}>
                        {value ? t('dataShare.create.form.yes') : t('dataShare.create.form.no')}
                    </Text>
                    <Switch
                        value={value}
                        onValueChange={(newValue) => updateField(fieldName, newValue)}
                        trackColor={{
                            false: theme.colors.textSecondary + '30',
                            true: theme.colors.primary + '50',
                        }}
                        thumbColor={value ? theme.colors.primary : '#f4f3f4'}
                        disabled={loading}
                    />
                </View>
            </View>
        );
    };

    // Format file size for display
    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(2)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(2)} MB`;
    };

    // Render file picker
    const renderFilePicker = (label, file, fieldName, required = false) => {
        return (
            <View style={dynamicStyles.fieldContainer}>
                <Text style={dynamicStyles.fieldLabel}>
                    {label}
                    {required && <Text style={dynamicStyles.required}> *</Text>}
                </Text>

                {!file ? (
                    // Show attach button when no file
                    <TouchableOpacity
                        style={dynamicStyles.filePickerButton}
                        onPress={() => handleFilePicker(fieldName)}
                        activeOpacity={0.7}
                        disabled={loading}>
                        <Attach24Regular style={{ color: theme.colors.primary }} />
                        <Text style={dynamicStyles.filePickerButtonText}>
                            {t('dataShare.create.form.attachFile')}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    // Show file info with delete button when file is attached
                    <View style={dynamicStyles.attachedFileContainer}>
                        <View style={dynamicStyles.fileInfo}>
                            <Document24Regular style={{ color: theme.colors.primary }} />
                            <View style={dynamicStyles.fileDetails}>
                                <Text style={dynamicStyles.fileName} numberOfLines={1}>
                                    {file.name}
                                </Text>
                                {file.size && (
                                    <Text style={dynamicStyles.fileSize}>
                                        {formatFileSize(file.size)}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={dynamicStyles.deleteButton}
                            onPress={() => handleRemoveFile(fieldName, file.name)}
                            activeOpacity={0.7}
                            disabled={loading}>
                            <Delete24Regular style={{ color: '#F44336' }} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
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
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.primary,
            textAlign: 'center',
            flex: 1,
        },
        placeholderView: {
            width: 40,
        },
        content: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            padding: 20,
        },
        noticeCardMinimized: {
            backgroundColor: `${theme.colors.primary}10`,
            borderLeftWidth: isRTL ? 0 : 4,
            borderRightWidth: isRTL ? 4 : 0,
            borderColor: theme.colors.primary,
            borderRadius: 12,
            padding: 16,
            marginTop: 24,
            marginBottom: 40,
        },
        noticeHeader: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 8,
        },
        noticeTitleMinimized: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.primary,
            textAlign: isRTL ? 'right' : 'left',
            flex: 1,
        },
        noticeChevron: {
            color: theme.colors.primary,
        },
        noticeContent: {
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: `${theme.colors.primary}30`,
        },
        noticeText: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            lineHeight: 22,
            marginBottom: 8,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 16,
            marginTop: 8,
        },
        fieldContainer: {
            marginBottom: 20,
        },
        fieldLabel: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 8,
        },
        required: {
            color: '#F44336',
        },
        textInput: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: theme.colors.text,
        },
        textInputDisabled: {
            backgroundColor: theme.colors.textSecondary + '15',
            color: theme.colors.textSecondary,
        },
        textArea: {
            minHeight: 100,
            textAlignVertical: 'top',
            paddingTop: 12,
        },
        phoneInputContainer: {
            flexDirection: 'row', // Always LTR for phone numbers
            alignItems: 'center',
            gap: 8,
        },
        phonePrefix: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        phonePrefixText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        phoneInput: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: theme.colors.text,
        },
        dropdownButton: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        dropdownButtonText: {
            fontSize: 16,
            color: theme.colors.text,
            flex: 1,
            textAlign: isRTL ? 'right' : 'left',
        },
        placeholderText: {
            color: theme.colors.textSecondary,
        },
        dropdownIcon: {
            color: theme.colors.textSecondary,
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
            maxHeight: '70%',
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 20,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 16,
        },
        modalItem: {
            paddingVertical: 16,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        modalItemText: {
            fontSize: 16,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            flex: 1,
        },
        modalCloseButton: {
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
            marginTop: 16,
        },
        modalCloseText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#FFFFFF',
        },
        switchContainer: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
        },
        switchLabel: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            lineHeight: 20,
        },
        switchWrapper: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 8,
        },
        switchText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        filePickerButton: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 12,
        },
        filePickerButtonText: {
            fontSize: 16,
            color: theme.colors.primary,
            textAlign: isRTL ? 'right' : 'left',
        },
        attachedFileContainer: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        fileInfo: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 12,
            flex: 1,
        },
        fileDetails: {
            flex: 1,
        },
        fileName: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 4,
        },
        fileSize: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
        },
        deleteButton: {
            padding: 4,
        },
        declarationContainer: {
            backgroundColor: `${theme.colors.primary}05`,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
        },
        declarationText: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            lineHeight: 20,
            marginBottom: 12,
        },
        checkboxContainer: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 12,
        },
        checkbox: {
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkboxChecked: {
            backgroundColor: theme.colors.primary,
        },
        checkboxLabel: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            flex: 1,
        },
        submitButton: {
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginBottom: 40,
        },
        submitButtonDisabled: {
            backgroundColor: theme.colors.textSecondary,
        },
        submitButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
        },
        dateInputButton: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
        },
        dateInputText: {
            fontSize: 16,
            color: theme.colors.text,
            flex: 1,
            textAlign: isRTL ? 'right' : 'left',
        },
    });

    return (
        <SafeContainer backgroundColor={theme.colors.background}>
            {/* Header */}
            <View style={dynamicStyles.header}>
                <TouchableOpacity
                    style={dynamicStyles.backButton}
                    onPress={handleGoBack}
                    activeOpacity={0.7}
                    disabled={loading}>
                    <ArrowLeft24Regular
                        style={[
                            dynamicStyles.backIcon,
                            { transform: [{ scaleX: isRTL ? -1 : 1 }] },
                        ]}
                    />
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle}>
                    {t('dataShare.create.title')}
                </Text>
                <View style={dynamicStyles.placeholderView} />
            </View>

            {/* Content */}
            <ScrollView style={dynamicStyles.content} contentContainerStyle={dynamicStyles.scrollContent}>
                {/* Basic Information Section */}
                <Text style={dynamicStyles.sectionTitle}>
                    {t('dataShare.create.form.sections.basicInfo')}
                </Text>

                {/* Applicant Name (Read-only) */}
                {renderTextInput(
                    t('dataShare.create.form.fields.applicantName'),
                    formData.applicantName,
                    'applicantName',
                    true,
                    false,
                    'default',
                    false
                )}

                {/* National Identity (Read-only) */}
                {renderTextInput(
                    t('dataShare.create.form.fields.nationalIdentity'),
                    formData.nationalIdentity,
                    'nationalIdentity',
                    true,
                    false,
                    'default',
                    false
                )}

                {/* Entity Type */}
                {renderDropdown(
                    t('dataShare.create.form.fields.entityType'),
                    formData.entityType ? t(`dataShare.create.form.options.entityType.${formData.entityType}`) : null,
                    () => setShowEntityTypeModal(true),
                    true
                )}

                {/* Conditional Fields Based on Entity Type */}
                {formData.entityType === 'individual' && (
                    <>
                        {renderPhoneInput(
                            t('dataShare.create.form.fields.mobileNumber'),
                            formData.mobileNumber,
                            'mobileNumber',
                            true
                        )}
                        {renderTextInput(
                            t('dataShare.create.form.fields.email'),
                            formData.email,
                            'email',
                            true,
                            false,
                            'email-address'
                        )}
                    </>
                )}

                {formData.entityType === 'private' && (
                    <>
                        {renderTextInput(
                            t('dataShare.create.form.fields.entityName'),
                            formData.entityName,
                            'entityName',
                            true
                        )}
                        {renderFilePicker(
                            t('dataShare.create.form.fields.affiliationProofPrivate'),
                            formData.affiliationProofFile,
                            'affiliationProofFile',
                            true
                        )}
                        {renderTextInput(
                            t('dataShare.create.form.fields.crNumber'),
                            formData.crNumber,
                            'crNumber',
                            true
                        )}
                        {renderPhoneInput(
                            t('dataShare.create.form.fields.mobileNumber'),
                            formData.mobileNumber,
                            'mobileNumber',
                            true
                        )}
                        {renderTextInput(
                            t('dataShare.create.form.fields.email'),
                            formData.email,
                            'email',
                            true,
                            false,
                            'email-address'
                        )}
                    </>
                )}

                {formData.entityType === 'government' && (
                    <>
                        {renderTextInput(
                            t('dataShare.create.form.fields.entityName'),
                            formData.entityName,
                            'entityName',
                            true
                        )}
                        {renderFilePicker(
                            t('dataShare.create.form.fields.affiliationProofGovernment'),
                            formData.affiliationProofFile,
                            'affiliationProofFile',
                            true
                        )}
                        {renderPhoneInput(
                            t('dataShare.create.form.fields.mobileNumber'),
                            formData.mobileNumber,
                            'mobileNumber',
                            true
                        )}
                        {renderTextInput(
                            t('dataShare.create.form.fields.email'),
                            formData.email,
                            'email',
                            true,
                            false,
                            'email-address'
                        )}
                    </>
                )}

                {/* Request Details Section */}
                <Text style={dynamicStyles.sectionTitle}>
                    {t('dataShare.create.form.sections.requestDetails')}
                </Text>

                {/* Request Title */}
                {renderTextInput(
                    t('dataShare.create.form.fields.requestTitle'),
                    formData.requestTitle,
                    'requestTitle',
                    true
                )}

                {/* Request Purpose */}
                {renderDropdown(
                    t('dataShare.create.form.fields.requestPurpose'),
                    formData.requestPurpose ? t(`dataShare.create.form.options.requestPurpose.${formData.requestPurpose}`) : null,
                    () => setShowRequestPurposeModal(true),
                    true
                )}

                {/* Request Purpose Description (if other selected) */}
                {formData.requestPurpose === 'other' && renderTextInput(
                    t('dataShare.create.form.fields.requestPurposeDescription'),
                    formData.requestPurposeDescription,
                    'requestPurposeDescription',
                    true,
                    true
                )}

                {/* Request Type */}
                {renderDropdown(
                    t('dataShare.create.form.fields.requestType'),
                    formData.requestType ? t(`dataShare.create.form.options.requestType.${formData.requestType}`) : null,
                    () => setShowRequestTypeModal(true),
                    true
                )}

                {/* Request Nature */}
                {renderDropdown(
                    t('dataShare.create.form.fields.requestNature'),
                    formData.requestNature ? t(`dataShare.create.form.options.requestNature.${formData.requestNature}`) : null,
                    () => setShowRequestNatureModal(true),
                    true
                )}

                {/* Data Format Type */}
                {renderDropdown(
                    t('dataShare.create.form.fields.dataFormatType'),
                    formData.dataFormatType ? t(`dataShare.create.form.options.dataFormatType.${formData.dataFormatType}`) : null,
                    () => setShowDataFormatModal(true),
                    true
                )}

                {/* Participation Mechanism */}
                {renderDropdown(
                    t('dataShare.create.form.fields.participationMechanism'),
                    formData.participationMechanism ? t(`dataShare.create.form.options.participationMechanism.${formData.participationMechanism}`) : null,
                    () => setShowParticipationModal(true),
                    false
                )}

                {/* Time Period */}
                {renderDateInput(
                    t('dataShare.create.form.fields.timeStart'),
                    formData.timeStart,
                    'timeStart'
                )}
                {renderDateInput(
                    t('dataShare.create.form.fields.timeEnd'),
                    formData.timeEnd,
                    'timeEnd'
                )}

                {/* Yes/No Questions */}
                {renderYesNoSwitch(
                    t('dataShare.create.form.fields.isDataProvidedThirdParty'),
                    formData.isDataProvidedThirdParty,
                    'isDataProvidedThirdParty'
                )}
                {renderYesNoSwitch(
                    t('dataShare.create.form.fields.isDataAnalysisPublished'),
                    formData.isDataAnalysisPublished,
                    'isDataAnalysisPublished'
                )}
                {renderYesNoSwitch(
                    t('dataShare.create.form.fields.dataSharingAgreementExists'),
                    formData.dataSharingAgreementExists,
                    'dataSharingAgreementExists'
                )}
                {renderYesNoSwitch(
                    t('dataShare.create.form.fields.isEntityDataRepresentation'),
                    formData.isEntityDataRepresentation,
                    'isEntityDataRepresentation'
                )}
                {renderYesNoSwitch(
                    t('dataShare.create.form.fields.isContainsPersonalData'),
                    formData.isContainsPersonalData,
                    'isContainsPersonalData'
                )}
                {renderYesNoSwitch(
                    t('dataShare.create.form.fields.legalBasisForDataRequest'),
                    formData.legalBasisForDataRequest,
                    'legalBasisForDataRequest'
                )}

                {/* Data Sharing Agreement File */}
                {renderFilePicker(
                    t('dataShare.create.form.fields.dataSharingAgreementFile'),
                    formData.dataSharingAgreementFile,
                    'dataSharingAgreementFile'
                )}

                {/* Legal Justification Description */}
                {renderTextInput(
                    t('dataShare.create.form.fields.legalJustificationDescription'),
                    formData.legalJustificationDescription,
                    'legalJustificationDescription',
                    false,
                    true
                )}

                {/* Required Data Details */}
                {renderTextInput(
                    t('dataShare.create.form.fields.requiredDataDetails'),
                    formData.requiredDataDetails,
                    'requiredDataDetails',
                    true,
                    true
                )}

                {/* Satisfaction Question */}
                {renderYesNoSwitch(
                    t('dataShare.create.form.fields.isSatisfiedWithProcess'),
                    formData.isSatisfiedWithProcess,
                    'isSatisfiedWithProcess'
                )}

                {/* Declaration */}
                <View style={dynamicStyles.declarationContainer}>
                    <Text style={dynamicStyles.declarationText}>
                        {t('dataShare.create.form.declaration')}
                    </Text>
                    <TouchableOpacity
                        style={dynamicStyles.checkboxContainer}
                        onPress={() => updateField('acknowledgeDeclaration', !formData.acknowledgeDeclaration)}
                        activeOpacity={0.7}
                        disabled={loading}>
                        <View
                            style={[
                                dynamicStyles.checkbox,
                                formData.acknowledgeDeclaration && dynamicStyles.checkboxChecked,
                            ]}>
                            {formData.acknowledgeDeclaration && (
                                <Checkmark24Regular style={{ color: '#FFFFFF' }} />
                            )}
                        </View>
                        <Text style={dynamicStyles.checkboxLabel}>
                            {t('dataShare.create.form.acknowledge')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        dynamicStyles.submitButton,
                        loading && dynamicStyles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={loading}>
                    {loading ? (
                        <LoadingSpinner size={24} color="#FFFFFF" />
                    ) : (
                        <Text style={dynamicStyles.submitButtonText}>
                            {t('dataShare.create.form.submit')}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Important Notice - Expandable at Bottom */}
                <TouchableOpacity
                    style={dynamicStyles.noticeCardMinimized}
                    onPress={() => setNoticeExpanded(!noticeExpanded)}
                    activeOpacity={0.7}>
                    <View style={dynamicStyles.noticeHeader}>
                        <Info24Regular style={{ color: theme.colors.primary }} />
                        <Text style={dynamicStyles.noticeTitleMinimized}>
                            {t('dataShare.create.form.notice.title')}
                        </Text>
                        <ChevronDown24Regular
                            style={[
                                dynamicStyles.noticeChevron,
                                { transform: [{ rotate: noticeExpanded ? '180deg' : '0deg' }] },
                            ]}
                        />
                    </View>
                    {noticeExpanded && (
                        <View style={dynamicStyles.noticeContent}>
                            <Text style={dynamicStyles.noticeText}>
                                • {t('dataShare.create.form.notice.point1')}
                            </Text>
                            <Text style={dynamicStyles.noticeText}>
                                • {t('dataShare.create.form.notice.point2')}
                            </Text>
                            <Text style={dynamicStyles.noticeText}>
                                • {t('dataShare.create.form.notice.point3')}
                            </Text>
                            <Text style={dynamicStyles.noticeText}>
                                • {t('dataShare.create.form.notice.point4')}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* Selection Modals */}
            {renderSelectionModal(
                showEntityTypeModal,
                setShowEntityTypeModal,
                t('dataShare.create.form.fields.entityType'),
                ['government', 'individual', 'private'],
                'entityType'
            )}

            {renderSelectionModal(
                showRequestPurposeModal,
                setShowRequestPurposeModal,
                t('dataShare.create.form.fields.requestPurpose'),
                ['personal', 'research', 'business', 'other'],
                'requestPurpose'
            )}

            {renderSelectionModal(
                showRequestTypeModal,
                setShowRequestTypeModal,
                t('dataShare.create.form.fields.requestType'),
                ['normal', 'urgent'],
                'requestType'
            )}

            {renderSelectionModal(
                showRequestNatureModal,
                setShowRequestNatureModal,
                t('dataShare.create.form.fields.requestNature'),
                ['once', 'recurring'],
                'requestNature'
            )}

            {renderSelectionModal(
                showDataFormatModal,
                setShowDataFormatModal,
                t('dataShare.create.form.fields.dataFormatType'),
                ['csv', 'excel', 'json', 'pdf'],
                'dataFormatType'
            )}

            {renderSelectionModal(
                showParticipationModal,
                setShowParticipationModal,
                t('dataShare.create.form.fields.participationMechanism'),
                ['dataset', 'integration'],
                'participationMechanism'
            )}

            {/* Date Picker Modal */}
            {showDatePicker && (
                <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor={theme.colors.text}
                />
            )}

            {/* Action Toast for Confirmations */}
            <ActionToast
                visible={actionToastVisible}
                title={actionToastData.title}
                message={actionToastData.message}
                onConfirm={actionToastData.onConfirm}
                onCancel={hideActionToast}
                type={actionToastData.type}
            />

            {/* Toast for Simple Messages */}
            <Toast
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onDismiss={hideToast}
            />
        </SafeContainer>
    );
};

export default CreateDataShareScreen;
