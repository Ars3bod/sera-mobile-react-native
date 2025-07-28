import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Share, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import AppConfig from '../config/appConfig';

// Safe imports for FluentUI icons
let AttachmentIcon, DownloadIcon, PersonIcon, CalendarIcon;
try {
    const icons = require('@fluentui/react-native-icons');
    AttachmentIcon = icons.Attach24Regular;
    DownloadIcon = icons.ArrowDownload24Regular;
    PersonIcon = icons.Person24Regular;
    CalendarIcon = icons.Calendar24Regular;
} catch (error) {
    // Fallback to emoji icons
    AttachmentIcon = () => <Text>📎</Text>;
    DownloadIcon = () => <Text>⬇️</Text>;
    PersonIcon = () => <Text>👤</Text>;
    CalendarIcon = () => <Text>📅</Text>;
}

const CommentView = ({ comments = [], onRefresh }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isRTL = i18n.language === 'ar';

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                return t('common.yesterday');
            } else if (diffDays < 7) {
                return t('common.daysAgo', { count: diffDays });
            } else {
                return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            }
        } catch (error) {
            return t('common.invalidDate');
        }
    };

    // Handle attachment download
    const handleDownloadAttachment = async (attachment) => {
        try {
            if (!attachment.Body) {
                Alert.alert(
                    t('comments.error'),
                    t('comments.attachmentNotAvailable'),
                );
                return;
            }

            const fileName = attachment.Name || 'attachment';
            const base64Data = attachment.Body;

            if (Platform.OS === 'web') {
                // Web platform - create download link
                const mimeType = getMimeType(fileName.split('.').pop());
                const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], {
                    type: mimeType,
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                // Mobile platform - save to device
                await saveFileWithAndroidSAF(base64Data, fileName);
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Download attachment error:', error);
            }

            Alert.alert(
                t('comments.error'),
                t('comments.downloadError'),
            );
        }
    };

    // Get MIME type based on file extension
    const getMimeType = (extension) => {
        switch (extension?.toLowerCase()) {
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
    const saveFileWithAndroidSAF = async (base64Data, fileName) => {
        try {
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

            // Use built-in Share API for Android file sharing
            const shareResult = await Share.share({
                url: `file://${tempFilePath}`,
                title: t('comments.saveAttachment', { fileName }),
                message: t('comments.saveAttachmentMessage', { fileName }),
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Share result:', shareResult);
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Save file error:', error);
            }
            throw error;
        }
    };

    // Render attachment item
    const renderAttachment = (attachment, index) => (
        <TouchableOpacity
            key={index}
            onPress={() => handleDownloadAttachment(attachment)}
            style={[
                styles.attachmentItem,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                }
            ]}
        >
            <AttachmentIcon color={theme.colors.primary} />
            <Text style={[
                styles.attachmentName,
                { color: theme.colors.text }
            ]} numberOfLines={1}>
                {attachment.Name || 'Attachment'}
            </Text>
            <DownloadIcon color={theme.colors.textSecondary} />
        </TouchableOpacity>
    );

    // Render comment item
    const renderComment = (comment, index) => (
        <View
            key={comment.id || index}
            style={[
                styles.commentItem,
                {
                    backgroundColor: theme.colors.surface,
                    borderLeftColor: comment.isFromUser ? theme.colors.primary : theme.colors.success,
                }
            ]}
        >
            {/* Comment Header */}
            <View style={styles.commentHeader}>
                <View style={styles.authorInfo}>
                    <PersonIcon color={theme.colors.textSecondary} />
                    <Text style={[
                        styles.authorName,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {comment.author || (comment.isFromUser ? t('comments.you') : t('comments.seraTeam'))}
                    </Text>
                </View>
                <View style={styles.dateInfo}>
                    <CalendarIcon color={theme.colors.textSecondary} />
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
            </View>

            {/* Comment Text */}
            <Text style={[
                styles.commentText,
                {
                    color: theme.colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                }
            ]}>
                {comment.text || comment.description || comment.commentText}
            </Text>

            {/* Attachments */}
            {comment.attachments && comment.attachments.length > 0 && (
                <View style={styles.attachmentsContainer}>
                    <Text style={[
                        styles.attachmentsLabel,
                        {
                            color: theme.colors.textSecondary,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {t('comments.attachments')} ({comment.attachments.length})
                    </Text>
                    {comment.attachments.map((attachment, attachIndex) =>
                        renderAttachment(attachment, attachIndex)
                    )}
                </View>
            )}
        </View>
    );

    if (!comments || comments.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[
                    styles.emptyText,
                    {
                        color: theme.colors.textSecondary,
                        textAlign: isRTL ? 'right' : 'left',
                    }
                ]}>
                    {t('comments.noComments')}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={false}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                ) : undefined
            }
        >
            {comments.map((comment, index) => renderComment(comment, index))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    commentItem: {
        borderLeftWidth: 4,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentDate: {
        fontSize: 12,
        marginLeft: 4,
    },
    commentText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
    },
    attachmentsContainer: {
        marginTop: 12,
    },
    attachmentsLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 6,
        borderWidth: 1,
        marginBottom: 6,
    },
    attachmentName: {
        flex: 1,
        fontSize: 14,
        marginLeft: 8,
        marginRight: 8,
    },
});

export default CommentView; 