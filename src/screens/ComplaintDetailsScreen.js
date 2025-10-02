import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    
    Alert,
    RefreshControl,
    Platform,
    PermissionsAndroid,
    Linking,
    Share,
    FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import SafeContainer from '../components/SafeContainer';
import SurveyModal from '../components/SurveyModal';
import {
    ArrowLeft24Regular,
    Document24Regular,
    Calendar24Regular,
    Person24Regular,
    Building24Regular,
    Location24Regular,
    Phone24Regular,
    Star24Regular,
} from '@fluentui/react-native-icons';
import complaintsService from '../services/complaintsService';
import AppConfig from '../config/appConfig';
import RNFS from 'react-native-fs';
import ActionToast from '../components/ActionToast';
import { LoadingIndicator } from '../components';

// Using built-in React Native Share API for cross-platform compatibility

const ComplaintDetailsScreen = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const isRTL = i18n.language === 'ar';

    // Get complaint case number from route params
    const { caseNumber } = route.params;

    // State
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showActionToast, setShowActionToast] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [showSurveyModal, setShowSurveyModal] = useState(false);

    // Load complaint details
    const loadComplaintDetails = async (showRefreshing = false) => {
        try {
            if (showRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            if (AppConfig.development.enableDebugLogs) {
                console.log('Loading complaint details for case:', caseNumber);
            }

            const response = await complaintsService.getComplaintDetails(caseNumber);

            if (response.success && response.complaint) {
                setComplaint(response.complaint);

                if (AppConfig.development.enableDebugLogs) {
                    console.log('Complaint details loaded:', response.complaint);
                }
            } else {
                throw new Error(response.message || 'Failed to load complaint details');
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Error loading complaint details:', error);
            }

            Alert.alert(
                t('complaints.details.error'),
                error.message || t('complaints.details.loadError'),
                [
                    { text: t('common.ok'), onPress: () => navigation.goBack() }
                ]
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load data on screen focus
    useFocusEffect(
        React.useCallback(() => {
            loadComplaintDetails();
        }, [caseNumber])
    );

    // Handle back navigation
    const handleGoBack = () => {
        navigation.goBack();
    };

    // Handle attachment press - show ActionToast for confirmation
    const handleAttachmentPress = (attachment) => {
        if (AppConfig.development.enableDebugLogs) {
            console.log('Attachment pressed:', attachment.Name);
        }
        setSelectedAttachment(attachment);
        setShowActionToast(true);
    };

    // Request storage permission for Android
    const requestStoragePermission = async () => {
        if (Platform.OS !== 'android') return true;

        try {
            if (Platform.Version >= 30) {
                // Android 11+ - no permission needed for app's external files directory
                return true;
            } else {
                // Android 10 and below
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: t('permissions.storage.title'),
                        message: t('permissions.storage.message'),
                        buttonNeutral: t('permissions.storage.neutral'),
                        buttonNegative: t('common.cancel'),
                        buttonPositive: t('common.ok'),
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        } catch (err) {
            console.warn('Permission request error:', err);
            return false;
        }
    };

    // Download attachment and immediately show share modal
    const downloadAttachment = async (attachment) => {
        try {
            if (AppConfig.development.enableDebugLogs) {
                console.log('=== DOWNLOAD ATTACHMENT STARTED ===');
                console.log('Attachment object:', JSON.stringify(attachment, null, 2));
                console.log('Attachment keys:', Object.keys(attachment || {}));
            }

            // Check if attachment has base64 data
            if (!attachment.Body && !attachment.Data && !attachment.Base64Data) {
                if (AppConfig.development.enableDebugLogs) {
                    console.log('No base64 data found in attachment');
                    console.log('Body:', !!attachment.Body);
                    console.log('Data:', !!attachment.Data);
                    console.log('Base64Data:', !!attachment.Base64Data);
                }

                Alert.alert(
                    t('complaints.details.attachment.downloadTitle'),
                    t('complaints.details.attachment.downloadError'),
                    [{ text: t('common.ok') }]
                );
                return;
            }

            // Directly proceed to download and share
            await performDownloadAndShare(attachment);

        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Download preparation error:', error);
                console.error('Error stack:', error.stack);
            }
            Alert.alert(
                t('complaints.details.attachment.downloadTitle'),
                t('complaints.details.attachment.downloadError'),
                [{ text: t('common.ok') }]
            );
        }
    };

    // Perform the actual download with Android Storage Access Framework
    const performDownloadAndShare = async (attachment) => {
        try {
            if (AppConfig.development.enableDebugLogs) {
                console.log('=== PERFORM DOWNLOAD STARTED ===');
                console.log('Platform OS:', Platform.OS);
                console.log('Attachment name:', attachment.Name);
            }

            // Get base64 data
            const base64Data = attachment.Body || attachment.Data || attachment.Base64Data;

            // Clean base64 data (remove data URL prefix if present)
            const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');

            // Generate file name with extension
            const fileName = attachment.Name || `attachment_${Date.now()}.pdf`;
            const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'pdf';

            if (AppConfig.development.enableDebugLogs) {
                console.log('File name:', fileName);
                console.log('File extension:', fileExtension);
                console.log('Base64 data length:', cleanBase64.length);
            }

            if (Platform.OS === 'android') {
                // Use Android Storage Access Framework for file saving
                await saveFileWithAndroidSAF(cleanBase64, fileName, fileExtension);
            } else {
                // iOS - use traditional method
                await saveFileForIOS(cleanBase64, fileName, fileExtension);
            }

        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Download error:', error);
            }

            let errorMessage = t('complaints.details.attachment.downloadError');
            if (error.message.includes('permission')) {
                errorMessage = t('permissions.storage.denied');
            } else if (error.message.includes('space')) {
                errorMessage = t('errors.insufficientStorage');
            } else if (error.message.includes('cancelled')) {
                // User cancelled the save dialog - don't show error
                return;
            }

            Alert.alert(
                t('complaints.details.attachment.downloadTitle'),
                errorMessage,
                [{ text: t('common.ok') }]
            );
        }
    };

    // Get MIME type based on file extension
    const getMimeType = (extension) => {
        switch (extension.toLowerCase()) {
            case 'pdf':
                return 'application/pdf';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'doc':
                return 'application/msword';
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'xls':
                return 'application/vnd.ms-excel';
            case 'xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case 'txt':
                return 'text/plain';
            default:
                return 'application/octet-stream';
        }
    };

    // Save file using Android Storage Access Framework with Share API
    const saveFileWithAndroidSAF = async (base64Data, fileName, fileExtension) => {
        try {
            if (AppConfig.development.enableDebugLogs) {
                console.log('=== ANDROID SAF SAVE STARTED ===');
                console.log('File name:', fileName);
            }

            // First, save to temporary location
            const tempDir = `${RNFS.CachesDirectoryPath}/temp`;

            // Ensure temp directory exists
            try {
                await RNFS.mkdir(tempDir);
            } catch (mkdirError) {
                // Directory might already exist, ignore error
            }

            const tempFilePath = `${tempDir}/${fileName}`;

            // Write file to temp location
            await RNFS.writeFile(tempFilePath, base64Data, 'base64');

            if (AppConfig.development.enableDebugLogs) {
                console.log('File written to temp location:', tempFilePath);
            }

            // Use built-in Share API for Android file sharing
            const shareResult = await Share.share({
                url: `file://${tempFilePath}`,
                title: t('complaints.details.attachment.saveTitle', { fileName }),
                message: t('complaints.details.attachment.saveMessage', { fileName }),
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Android share result:', shareResult);
            }

            // Handle results from built-in Share API
            if (shareResult.action === Share.sharedAction) {
                // File was shared/saved successfully
                Alert.alert(
                    t('complaints.details.attachment.saveSuccess'),
                    t('complaints.details.attachment.saveSuccessMessage', { fileName }),
                    [{ text: t('common.ok') }]
                );
            } else {
                // User dismissed the share dialog or it failed
                if (AppConfig.development.enableDebugLogs) {
                    console.log('User dismissed share dialog or share failed');
                }
            }

            // Clean up temp file after a delay
            setTimeout(async () => {
                try {
                    await RNFS.unlink(tempFilePath);
                    if (AppConfig.development.enableDebugLogs) {
                        console.log('Temp file cleaned up:', tempFilePath);
                    }
                } catch (cleanupError) {
                    if (AppConfig.development.enableDebugLogs) {
                        console.log('Failed to clean up temp file:', cleanupError);
                    }
                }
            }, 5000); // 5 second delay to ensure share is complete

        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Android SAF save error:', error);
            }

            // Check if user cancelled the share dialog
            if (error.message && error.message.includes('cancelled')) {
                if (AppConfig.development.enableDebugLogs) {
                    console.log('User cancelled share dialog');
                }
                return; // Don't show error for user cancellation
            }

            // Fallback to app directory if share fails
            if (AppConfig.development.enableDebugLogs) {
                console.log('Share failed, falling back to app directory');
            }

            await saveFileToAppDirectory(base64Data, fileName, fileExtension);
        }
    };

    // Fallback: Save file to app directory and share
    const saveFileToAppDirectory = async (base64Data, fileName, fileExtension) => {
        try {
            // Request storage permission for fallback method
            const hasPermission = await requestStoragePermission();

            if (!hasPermission) {
                Alert.alert(
                    t('complaints.details.attachment.downloadTitle'),
                    t('permissions.storage.denied'),
                    [{ text: t('common.ok') }]
                );
                return;
            }

            // Use app's external files directory
            const downloadsDir = `${RNFS.ExternalDirectoryPath}/Downloads`;

            // Ensure downloads directory exists
            try {
                await RNFS.mkdir(downloadsDir);
            } catch (mkdirError) {
                // Directory might already exist, ignore error
            }

            const downloadPath = `${downloadsDir}/${fileName}`;

            // Write file to device
            await RNFS.writeFile(downloadPath, base64Data, 'base64');

            // Verify file was created
            const fileExists = await RNFS.exists(downloadPath);
            if (!fileExists) {
                throw new Error('File was not created successfully');
            }

            if (AppConfig.development.enableDebugLogs) {
                console.log('File saved to app directory:', downloadPath);
            }

            // Show share dialog as fallback
            await openDownloadedFile(downloadPath, fileExtension);

        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('App directory save error:', error);
            }
            throw error;
        }
    };

    // Save file for iOS using traditional method
    const saveFileForIOS = async (base64Data, fileName, fileExtension) => {
        try {
            // iOS - use documents directory
            const downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

            if (AppConfig.development.enableDebugLogs) {
                console.log('iOS download path:', downloadPath);
            }

            // Write file to device
            await RNFS.writeFile(downloadPath, base64Data, 'base64');

            // Verify file was created
            const fileExists = await RNFS.exists(downloadPath);
            if (!fileExists) {
                throw new Error('File was not created successfully');
            }

            // Get file info
            const fileInfo = await RNFS.stat(downloadPath);

            if (AppConfig.development.enableDebugLogs) {
                console.log('iOS file downloaded successfully:', {
                    path: downloadPath,
                    size: fileInfo.size,
                    isFile: fileInfo.isFile()
                });
            }

            // Show iOS share modal using built-in Share API
            await openDownloadedFile(downloadPath, fileExtension);

        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('iOS save error:', error);
            }
            throw error;
        }
    };

    // Open downloaded file
    const openDownloadedFile = async (filePath, fileExtension) => {
        try {
            if (AppConfig.development.enableDebugLogs) {
                console.log('Attempting to open file:', filePath);
                console.log('Platform:', Platform.OS);
            }

            if (Platform.OS === 'android') {
                // For Android, try to open with file manager or appropriate app
                const fileUrl = `file://${filePath}`;

                if (AppConfig.development.enableDebugLogs) {
                    console.log('Trying to open Android file URL:', fileUrl);
                }

                const canOpen = await Linking.canOpenURL(fileUrl);
                if (canOpen) {
                    await Linking.openURL(fileUrl);
                    if (AppConfig.development.enableDebugLogs) {
                        console.log('Successfully opened file with Linking');
                    }
                } else {
                    if (AppConfig.development.enableDebugLogs) {
                        console.log('Cannot open file with Linking, showing location');
                    }
                    // Fallback: show file location
                    Alert.alert(
                        t('complaints.details.attachment.fileLocation'),
                        t('complaints.details.attachment.fileLocationMessage', {
                            path: filePath.replace(RNFS.ExternalDirectoryPath, 'Internal Storage/Android/data/com.sera.seraapp/files')
                        }),
                        [{ text: t('common.ok') }]
                    );
                }
            } else {
                // For iOS, use built-in Share API
                if (AppConfig.development.enableDebugLogs) {
                    console.log('Attempting to share file on iOS:', filePath);
                }

                const shareResult = await Share.share({
                    url: `file://${filePath}`,
                    title: t('complaints.details.attachment.shareTitle'),
                });

                if (AppConfig.development.enableDebugLogs) {
                    console.log('iOS Share result:', shareResult);
                }

                if (shareResult.action === Share.dismissedAction) {
                    if (AppConfig.development.enableDebugLogs) {
                        console.log('User dismissed share sheet');
                    }
                }
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Error opening file:', error);
                console.error('File path:', filePath);
                console.error('Error details:', error.message);
            }

            // Try alternative method for iOS
            if (Platform.OS === 'ios') {
                try {
                    if (AppConfig.development.enableDebugLogs) {
                        console.log('Trying alternative iOS method with Linking');
                    }

                    const fileUrl = `file://${filePath}`;
                    const canOpen = await Linking.canOpenURL(fileUrl);

                    if (canOpen) {
                        await Linking.openURL(fileUrl);
                        if (AppConfig.development.enableDebugLogs) {
                            console.log('iOS file opened with Linking successfully');
                        }
                        return;
                    }
                } catch (linkingError) {
                    if (AppConfig.development.enableDebugLogs) {
                        console.error('iOS Linking also failed:', linkingError);
                    }
                }
            }

            Alert.alert(
                t('complaints.details.attachment.openError'),
                t('complaints.details.attachment.openErrorMessage'),
                [{ text: t('common.ok') }]
            );
        }
    };

    // Handle survey
    const handleSurvey = () => {
        if (complaint?.SurveyCode && complaint?.SurveyResponseId) {
            // Open survey modal for embedded survey (comment in English)
            setShowSurveyModal(true);
        } else if (complaint?.SurveyCode) {
            // Fallback: Show alert if no survey response ID (comment in English)
            Alert.alert(
                t('complaints.details.survey.title'),
                t('complaints.details.survey.message'),
                [
                    { text: t('common.cancel'), style: 'cancel' },
                    {
                        text: t('complaints.details.survey.takeSurvey'),
                        onPress: () => {
                            Alert.alert(
                                t('complaints.details.survey.thankYou'),
                                t('complaints.details.survey.completed')
                            );
                        }
                    }
                ]
            );
        }
    };

    // Handle survey completion
    const handleSurveyComplete = (responses, action = 'completed') => {
        if (AppConfig.development.enableDebugLogs) {
            console.log('Survey completed:', { responses, action });
        }

        // Optionally refresh complaint details to get updated status (comment in English)
        loadComplaintDetails(true);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return t('common.notAvailable');

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    // Get status color
    const getStatusColor = (statusKey) => {
        switch (statusKey) {
            case '1':
            case 'open':
                return theme.colors.warning;
            case '266990010':
            case '266990011':
            case 'closed':
                return theme.colors.success;
            default:
                return theme.colors.info;
        }
    };

    // Get localized status text based on status code
    const getLocalizedStatus = (statusKey) => {
        if (!statusKey) return t('complaints.status.unknown');

        const statusCode = statusKey.toString();

        switch (statusCode) {
            case '1':
                return t('complaints.status.open');
            case '266990010':
                return t('complaints.status.closedAsInquiry');
            case '266990011':
                return t('complaints.status.closed');
            case '266990005':
                return t('complaints.status.closedAsInquiry');
            default:
                return t('complaints.status.open');
        }
    };

    // Check if complaint is closed based on status code
    const isComplaintClosed = (statusKey) => {
        if (!statusKey) return false;

        const statusCode = statusKey.toString();

        // Status codes that indicate closed complaints
        const closedStatusCodes = ['266990010', '266990011', '266990005'];

        return closedStatusCodes.includes(statusCode);
    };

    // Handle ActionToast confirm - proceed with download and share
    const handleToastConfirm = () => {
        setShowActionToast(false);
        if (selectedAttachment) {
            downloadAttachment(selectedAttachment);
            setSelectedAttachment(null);
        }
    };

    // Handle ActionToast cancel
    const handleToastCancel = () => {
        setShowActionToast(false);
        setSelectedAttachment(null);
    };

    // Get localized stage text based on stage key
    const getLocalizedStage = (stageKey, stageValue) => {
        if (!stageKey && !stageValue) return null;

        if (!stageKey) return stageValue; // Fallback to API value if no key

        const stageCode = stageKey.toString();

        switch (stageCode) {
            case '266990001':
                return t('complaints.stage.complaintCheck');
            case '266990002':
                return t('complaints.stage.investigation');
            case '266990003':
                return t('complaints.stage.providerResponse');
            case '266990004':
                return t('complaints.stage.finalDecision');
            case '266990005':
                return t('complaints.stage.closed');
            default:
                // Fallback to API value if stage code is not mapped
                return stageValue || t('complaints.stage.unknown');
        }
    };

    // Render info row
    const renderInfoRow = (icon, label, value, onPress = null) => (
        <TouchableOpacity
            style={[
                styles.infoRow,
                {
                    backgroundColor: theme.colors.surface,
                    borderBottomColor: theme.colors.border,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                }
            ]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={[
                styles.infoIcon,
                {
                    marginLeft: isRTL ? 12 : 0,
                    marginRight: isRTL ? 0 : 12,
                }
            ]}>
                {icon}
            </View>
            <View style={styles.infoContent}>
                <Text style={[
                    styles.infoLabel,
                    {
                        color: theme.colors.textSecondary,
                        textAlign: isRTL ? 'right' : 'left',
                    }
                ]}>
                    {label}
                </Text>
                <Text style={[
                    styles.infoValue,
                    {
                        color: theme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                    }
                ]}>
                    {value || t('common.notAvailable')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // Render section
    const renderSection = (title, children) => (
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[
                styles.sectionTitle,
                {
                    color: theme.colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                }
            ]}>
                {title}
            </Text>
            {children}
        </View>
    );

    // Render attachments
    const renderAttachments = () => {
        if (!complaint?.Attachment || complaint.Attachment.length === 0) {
            return (
                <Text style={[
                    styles.noAttachments,
                    {
                        color: theme.colors.textSecondary,
                        textAlign: isRTL ? 'right' : 'left',
                    }
                ]}>
                    {t('complaints.details.noAttachments')}
                </Text>
            );
        }

        return complaint.Attachment.map((attachment, index) => (
            <TouchableOpacity
                key={index}
                style={[
                    styles.attachmentItem,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                    }
                ]}
                onPress={() => handleAttachmentPress(attachment)}
                activeOpacity={0.7}
            >
                <Document24Regular style={[styles.attachmentIcon, { color: theme.colors.primary }]} />
                <View style={styles.attachmentInfo}>
                    <Text style={[
                        styles.attachmentName,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {attachment.Name}
                    </Text>
                    <Text style={[
                        styles.attachmentType,
                        {
                            color: theme.colors.textSecondary,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {attachment.Type}
                    </Text>
                </View>
            </TouchableOpacity>
        ));
    };

    // Render comments/timeline
    const renderComments = () => {
        if (!complaint?.Comments || complaint.Comments.length === 0) {
            return (
                <Text style={[
                    styles.noComments,
                    {
                        color: theme.colors.textSecondary,
                        textAlign: isRTL ? 'right' : 'left',
                    }
                ]}>
                    {t('complaints.details.noComments')}
                </Text>
            );
        }

        return complaint.Comments.map((comment, index) => (
            <View
                key={index}
                style={[
                    styles.commentItem,
                    {
                        backgroundColor: theme.colors.surface,
                        borderLeftColor: theme.colors.primary,
                    }
                ]}
            >
                <Text style={[
                    styles.commentText,
                    {
                        color: theme.colors.text,
                        textAlign: isRTL ? 'right' : 'left',
                    }
                ]}>
                    {comment.text || comment.description}
                </Text>
                <Text style={[
                    styles.commentDate,
                    {
                        color: theme.colors.textSecondary,
                        textAlign: isRTL ? 'right' : 'left',
                    }
                ]}>
                    {formatDate(comment.date || comment.createdOn)}
                </Text>
            </View>
        ));
    };

    if (loading) {
        return (
            <SafeContainer
                style={[styles.container, { backgroundColor: theme.colors.background }]}
                backgroundColor={theme.colors.background}
                statusBarStyle={isDarkMode ? 'light-content' : 'dark-content'}
                statusBarBackgroundColor={theme.colors.background}
            >
                <View style={styles.loadingContainer}>
                    <LoadingIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                        {t('complaints.details.loading')}
                    </Text>
                </View>
            </SafeContainer>
        );
    }

    if (!complaint) {
        return (
            <SafeContainer
                style={[styles.container, { backgroundColor: theme.colors.background }]}
                backgroundColor={theme.colors.background}
                statusBarStyle={isDarkMode ? 'light-content' : 'dark-content'}
                statusBarBackgroundColor={theme.colors.background}
            >
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.colors.text }]}>
                        {t('complaints.details.notFound')}
                    </Text>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleGoBack}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backButtonText}>
                            {t('common.goBack')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeContainer>
        );
    }

    return (
        <SafeContainer
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            backgroundColor={theme.colors.background}
            statusBarStyle={isDarkMode ? 'light-content' : 'dark-content'}
            statusBarBackgroundColor={theme.colors.background}
        >

            {/* Header */}
            <View style={[
                styles.header,
                {
                    backgroundColor: theme.colors.card,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                }
            ]}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleGoBack}
                    activeOpacity={0.7}
                >
                    <ArrowLeft24Regular
                        style={[
                            styles.headerIcon,
                            {
                                color: theme.colors.text,
                                transform: [{ scaleX: isRTL ? -1 : 1 }],
                            }
                        ]}
                    />
                </TouchableOpacity>

                <View style={[
                    styles.headerContent,
                    {
                        marginLeft: isRTL ? 0 : 12,
                        marginRight: isRTL ? 12 : 0,
                    }
                ]}>
                    <Text style={[
                        styles.headerTitle,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {t('complaints.details.title')}
                    </Text>
                    <Text style={[
                        styles.headerSubtitle,
                        {
                            color: theme.colors.textSecondary,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {t('complaints.details.caseNumber', { number: complaint.CaseNumber })}
                    </Text>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadComplaintDetails(true)}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                {/* Status Section */}
                {renderSection(
                    t('complaints.details.sections.status'),
                    <View>
                        <View style={[
                            styles.statusContainer,
                            {
                                backgroundColor: getStatusColor(complaint.Status?.Key) + '20',
                                flexDirection: isRTL ? 'row-reverse' : 'row',
                            }
                        ]}>
                            <View style={[
                                styles.statusDot,
                                {
                                    backgroundColor: getStatusColor(complaint.Status?.Key),
                                    marginLeft: isRTL ? 8 : 0,
                                    marginRight: isRTL ? 0 : 8,
                                }
                            ]} />
                            <Text style={[
                                styles.statusText,
                                {
                                    color: getStatusColor(complaint.Status?.Key),
                                    textAlign: isRTL ? 'right' : 'left',
                                }
                            ]}>
                                {getLocalizedStatus(complaint.Status?.Key)}
                            </Text>
                        </View>

                        {complaint.CaseStage?.Value && (
                            <Text style={[
                                styles.stageText,
                                {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left',
                                }
                            ]}>
                                {t('complaints.details.stage')}: {getLocalizedStage(complaint.CaseStage?.Key, complaint.CaseStage?.Value)}
                            </Text>
                        )}
                    </View>
                )}

                {/* Basic Information */}
                {renderSection(
                    t('complaints.details.sections.basicInfo'),
                    <View>
                        {renderInfoRow(
                            <Person24Regular style={{ color: theme.colors.icon }} />,
                            t('complaints.details.complaintType'),
                            complaint.CaseType?.Value
                        )}
                        {renderInfoRow(
                            <Building24Regular style={{ color: theme.colors.icon }} />,
                            t('complaints.details.serviceProvider'),
                            complaint.Account?.Value
                        )}
                        {renderInfoRow(
                            <Person24Regular style={{ color: theme.colors.icon }} />,
                            t('complaints.details.customerType'),
                            complaint.ComplainterType?.Value
                        )}
                        {/* {renderInfoRow(
                            <Location24Regular style={{ color: theme.colors.icon }} />,
                            t('complaints.details.region'),
                            complaint.Region?.Value
                        )} */}
                        {renderInfoRow(
                            <Location24Regular style={{ color: theme.colors.icon }} />,
                            t('complaints.details.city'),
                            complaint.City?.Value
                        )}
                        {complaint.Office?.Value && renderInfoRow(
                            <Building24Regular style={{ color: theme.colors.icon }} />,
                            t('complaints.details.office'),
                            complaint.Office.Value
                        )}
                        {complaint.ClosedDate && renderInfoRow(
                            <Calendar24Regular style={{ color: theme.colors.icon }} />,
                            t('complaints.details.closedDate'),
                            formatDate(complaint.ClosedDate)
                        )}
                    </View>
                )}

                {/* Description */}
                {renderSection(
                    t('complaints.details.sections.description'),
                    <Text style={[
                        styles.descriptionText,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {complaint.Description || t('common.notAvailable')}
                    </Text>
                )}

                {/* Service Provider Response */}
                {complaint.CouncilDescription && renderSection(
                    t('complaints.details.sections.providerResponse'),
                    <Text style={[
                        styles.descriptionText,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {complaint.CouncilDescription}
                    </Text>
                )}

                {/* Processing Result */}
                {complaint.ProcessingResult?.Value && renderSection(
                    t('complaints.details.sections.result'),
                    <View>
                        <Text style={[
                            styles.resultTitle,
                            {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left',
                            }
                        ]}>
                            {complaint.ProcessingResult.Value}
                        </Text>
                        {complaint.ProcessingResultText && (
                            <Text style={[
                                styles.resultText,
                                {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left',
                                }
                            ]}>
                                {complaint.ProcessingResultText}
                            </Text>
                        )}
                    </View>
                )}

                {/* Attachments */}
                {renderSection(
                    t('complaints.details.sections.attachments'),
                    renderAttachments()
                )}

                {/* Comments/Timeline */}
                {renderSection(
                    t('complaints.details.sections.timeline'),
                    renderComments()
                )}

                {/* Add Comment Button - Only show if complaint is not closed */}
                {!isComplaintClosed(complaint?.Status?.Key) && (
                    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                        <TouchableOpacity
                            style={[styles.commentButton, { backgroundColor: theme.colors.secondary }]}
                            onPress={() => navigation.navigate('ComplaintComment', {
                                caseNumber: complaint?.CaseNumber,
                                complaintTitle: complaint?.CaseType?.Value,
                                complaintStatus: complaint?.Status?.Key,
                                isComplaintClosed: isComplaintClosed(complaint?.Status?.Key)
                            })}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.commentButtonText, { color: theme.colors.onSecondary }]}>
                                {t('comments.addComment')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Survey Section */}
                {complaint.SurveyCode && (
                    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                        <TouchableOpacity
                            style={[styles.surveyButton, { backgroundColor: theme.colors.primary }]}
                            onPress={handleSurvey}
                            activeOpacity={0.7}
                        >
                            <Star24Regular style={styles.surveyIcon} />
                            <Text style={styles.surveyButtonText}>
                                {t('complaints.details.survey.button')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Reopen Section */}
                {complaint.Reopen?.IsReopen === 'True' && (
                    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                        <TouchableOpacity
                            style={[styles.reopenButton, { borderColor: theme.colors.warning }]}
                            onPress={() => {
                                Alert.alert(
                                    t('complaints.details.reopen.title'),
                                    t('complaints.details.reopen.message')
                                );
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.reopenButtonText, { color: theme.colors.warning }]}>
                                {t('complaints.details.reopen.button')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}


            </ScrollView>

            {/* Action Toast for download confirmation */}
            <ActionToast
                visible={showActionToast}
                type="info"
                title={t('complaints.details.attachment.downloadTitle')}
                message={t('complaints.details.attachment.message', {
                    fileName: selectedAttachment?.Name || 'file'
                })}
                confirmText={t('complaints.details.attachment.download')}
                cancelText={t('common.cancel')}
                onConfirm={handleToastConfirm}
                onCancel={handleToastCancel}
            />

            {/* Survey Modal */}
            <SurveyModal
                visible={showSurveyModal}
                onClose={() => setShowSurveyModal(false)}
                surveyCode={complaint?.SurveyCode}
                surveyResponseId={complaint?.SurveyResponseId}
                onSurveyComplete={handleSurveyComplete}
                title={t('complaints.details.survey.title')}
                description={t('complaints.details.survey.message')}
            />
        </SafeContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loadingText: {
        fontSize: 16,
        marginTop: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerIcon: {
        fontSize: 24,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    statusContainer: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
    },
    stageText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    infoRow: {
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    infoIcon: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    resultText: {
        fontSize: 14,
        lineHeight: 20,
    },
    noAttachments: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    attachmentIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    attachmentInfo: {
        flex: 1,
    },
    attachmentName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    attachmentType: {
        fontSize: 14,
    },
    noComments: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    commentItem: {
        padding: 12,
        borderLeftWidth: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    commentText: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 8,
    },
    commentDate: {
        fontSize: 12,
    },
    surveyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    surveyIcon: {
        fontSize: 20,
        color: '#FFFFFF',
        marginRight: 8,
    },
    surveyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    reopenButton: {
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
    },
    reopenButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    commentButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ComplaintDetailsScreen; 