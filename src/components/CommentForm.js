import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import commentService from '../services/commentService';
import { pick, types } from '@react-native-documents/picker';
import AppConfig from '../config/appConfig';

// Safe imports for FluentUI icons
let AttachIcon, SendIcon, CloseIcon;
try {
    const icons = require('@fluentui/react-native-icons');
    AttachIcon = icons.Attach24Regular;
    SendIcon = icons.Send24Regular;
    CloseIcon = icons.Dismiss24Regular;
} catch (error) {
    // Fallback to emoji icons
    AttachIcon = () => <Text>📎</Text>;
    SendIcon = () => <Text>📤</Text>;
    CloseIcon = () => <Text>✕</Text>;
}

const CommentForm = ({ caseNumber, beneficiary, onCommentAdded, onClose }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isRTL = i18n.language === 'ar';

    // State
    const [commentText, setCommentText] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Handle file attachment
    const handleAttachFile = async () => {
        try {
            // Check if we're on web first
            if (Platform.OS === 'web' && typeof document !== 'undefined') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.png,.jpg,.jpeg,.pdf,.doc,.docx,.zip,.xls,.xlsx,.svg';
                input.multiple = false;

                input.onchange = async (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        await handleFileSelection({
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            uri: URL.createObjectURL(file),
                            file: file,
                        });
                    }
                };

                input.click();
                return;
            }

            // For mobile platforms, use @react-native-documents/picker
            try {
                const result = await pick({
                    type: [
                        types.images,
                        types.pdf,
                        types.doc,
                        types.docx,
                        types.xls,
                        types.xlsx,
                        types.zip,
                        types.plainText,
                    ],
                    allowMultiSelection: false,
                });

                if (AppConfig.development.enableDebugLogs) {
                    console.log('Document picker result:', result);
                }

                // Handle the result - new API returns array directly
                if (result && result.length > 0) {
                    const file = result[0];
                    await handleFileSelection({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        uri: file.uri,
                    });
                }
            } catch (docPickerError) {
                if (AppConfig.development.enableDebugLogs) {
                    console.error('Document picker error:', docPickerError);
                }
                // User cancelled the picker
                if (docPickerError.code !== 'DOCUMENT_PICKER_CANCELED') {
                    Alert.alert(
                        t('comments.error'),
                        t('comments.filePickerError'),
                    );
                }
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('File attachment error:', error);
            }
            Alert.alert(
                t('comments.error'),
                t('comments.fileAttachmentError'),
            );
        }
    };

    // Handle file selection
    const handleFileSelection = async (file) => {
        try {
            // Validate file
            const validation = commentService.validateFile(file);
            if (!validation.isValid) {
                Alert.alert(t('comments.error'), validation.error);
                return;
            }

            // Check total attachments count
            if (attachments.length >= 3) {
                Alert.alert(
                    t('comments.error'),
                    t('comments.maxAttachmentsReached'),
                );
                return;
            }

            // Format file size for display
            const formatFileSize = (bytes) => {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            };

            // Add file to attachments list
            const newAttachment = {
                id: Date.now(),
                name: file.name,
                size: formatFileSize(file.size || 0),
                type: file.type,
                uri: file.uri,
                file: file,
            };

            setAttachments(prev => [...prev, newAttachment]);
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('File selection error:', error);
            }

            Alert.alert(
                t('comments.error'),
                t('comments.fileSelectionError'),
            );
        }
    };

    // Remove attachment
    const removeAttachment = (id) => {
        Alert.alert(
            t('comments.removeAttachment'),
            t('comments.removeAttachmentConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.ok'),
                    style: 'destructive',
                    onPress: () => {
                        setAttachments(prev => prev.filter(file => file.id !== id));
                    },
                },
            ],
        );
    };

    // Submit comment
    const handleSubmit = async () => {
        if (!commentText.trim()) {
            Alert.alert(
                t('comments.error'),
                t('comments.commentRequired'),
            );
            return;
        }

        setLoading(true);

        try {
            // Process attachments
            const processedAttachments = [];

            for (const attachment of attachments) {
                try {
                    let base64Data;

                    if (Platform.OS === 'web' && attachment.file) {
                        // Web platform - use FileReader
                        base64Data = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                resolve(event.target.result);
                            };
                            reader.onerror = (error) => {
                                reject(error);
                            };
                            reader.readAsDataURL(attachment.file);
                        });
                    } else {
                        // Mobile platform - fetch file and convert to base64
                        const response = await fetch(attachment.uri);
                        const blob = await response.blob();
                        base64Data = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                resolve(event.target.result);
                            };
                            reader.onerror = (error) => {
                                reject(error);
                            };
                            reader.readAsDataURL(blob);
                        });
                    }

                    // Extract base64 data without data URL prefix
                    const base64String = base64Data.split(',')[1];

                    processedAttachments.push({
                        name: attachment.name,
                        type: attachment.type,
                        base64Data: base64String,
                    });
                } catch (attachmentError) {
                    console.error('Attachment processing error:', attachmentError);
                    throw new Error(`Failed to process attachment: ${attachment.name}`);
                }
            }

            // Add comment
            const response = await commentService.addComment(
                {
                    caseNumber,
                    commentText: commentText.trim(),
                    beneficiary,
                },
                processedAttachments,
            );

            if (response.success) {
                // Reset form
                setCommentText('');
                setAttachments([]);

                // Notify parent component
                if (onCommentAdded) {
                    onCommentAdded(response);
                }

                Alert.alert(
                    t('comments.success'),
                    t('comments.commentAdded'),
                    [
                        {
                            text: t('common.ok'),
                            onPress: () => {
                                if (onClose) {
                                    onClose();
                                }
                            },
                        },
                    ],
                );
            } else {
                throw new Error(response.message || 'Failed to add comment');
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Submit comment error:', error);
            }

            Alert.alert(
                t('comments.error'),
                error.message || t('comments.submitError'),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[
                        styles.title,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {t('comments.addComment')}
                    </Text>
                    {onClose && (
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <CloseIcon color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Comment Input */}
                <View style={styles.inputContainer}>
                    <Text style={[
                        styles.inputLabel,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {t('comments.commentText')} *
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                backgroundColor: theme.colors.surface,
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left',
                            },
                        ]}
                        placeholder={t('comments.commentPlaceholder')}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline={true}
                        numberOfLines={6}
                        textAlignVertical="top"
                        maxLength={1000}
                    />
                    <Text style={[
                        styles.characterCount,
                        {
                            color: theme.colors.textSecondary,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {commentText.length}/1000
                    </Text>
                </View>

                {/* Attachments */}
                <View style={styles.attachmentsContainer}>
                    <Text style={[
                        styles.attachmentsLabel,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {t('comments.attachments')} ({attachments.length}/3)
                    </Text>

                    {/* Attachment List */}
                    {attachments.map((attachment) => (
                        <View
                            key={attachment.id}
                            style={[
                                styles.attachmentItem,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                            ]}
                        >
                            <View style={styles.attachmentInfo}>
                                <Text style={[
                                    styles.attachmentName,
                                    { color: theme.colors.text }
                                ]} numberOfLines={1}>
                                    {attachment.name}
                                </Text>
                                <Text style={[
                                    styles.attachmentSize,
                                    { color: theme.colors.textSecondary }
                                ]}>
                                    {attachment.size}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => removeAttachment(attachment.id)}
                                style={styles.removeButton}
                            >
                                <CloseIcon color={theme.colors.error} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add Attachment Button */}
                    {attachments.length < 3 && (
                        <TouchableOpacity
                            onPress={handleAttachFile}
                            style={[
                                styles.attachButton,
                                { borderColor: theme.colors.primary }
                            ]}
                        >
                            <AttachIcon color={theme.colors.primary} />
                            <Text style={[
                                styles.attachButtonText,
                                { color: theme.colors.primary }
                            ]}>
                                {t('comments.attachFile')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading || !commentText.trim()}
                    style={[
                        styles.submitButton,
                        {
                            backgroundColor: (!commentText.trim() || loading)
                                ? theme.colors.disabled
                                : theme.colors.primary,
                        }
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.colors.onPrimary} />
                    ) : (
                        <>
                            <SendIcon color={theme.colors.onPrimary} />
                            <Text style={[
                                styles.submitButtonText,
                                { color: theme.colors.onPrimary }
                            ]}>
                                {t('comments.submit')}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
    },
    characterCount: {
        fontSize: 12,
        marginTop: 4,
    },
    attachmentsContainer: {
        marginBottom: 20,
    },
    attachmentsLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    attachmentInfo: {
        flex: 1,
    },
    attachmentName: {
        fontSize: 14,
        fontWeight: '500',
    },
    attachmentSize: {
        fontSize: 12,
        marginTop: 2,
    },
    removeButton: {
        padding: 4,
    },
    attachButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    attachButtonText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default CommentForm; 