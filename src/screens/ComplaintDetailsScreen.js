import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
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

    // Handle attachment download
    const handleAttachmentPress = (attachment) => {
        Alert.alert(
            t('complaints.details.attachment.title'),
            t('complaints.details.attachment.message', { fileName: attachment.Name }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('complaints.details.attachment.download'),
                    onPress: () => downloadAttachment(attachment)
                }
            ]
        );
    };

    // Download attachment (mock implementation)
    const downloadAttachment = (attachment) => {
        // In a real implementation, this would handle file download
        Alert.alert(
            t('complaints.details.attachment.downloadTitle'),
            t('complaints.details.attachment.downloadMessage', { fileName: attachment.Name })
        );
    };

    // Handle survey
    const handleSurvey = () => {
        if (complaint?.SurveyCode) {
            Alert.alert(
                t('complaints.details.survey.title'),
                t('complaints.details.survey.message'),
                [
                    { text: t('common.cancel'), style: 'cancel' },
                    {
                        text: t('complaints.details.survey.takeSurvey'),
                        onPress: () => {
                            // In a real implementation, this would open the survey
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
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={theme.colors.background}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                        {t('complaints.details.loading')}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!complaint) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={theme.colors.background}
                />
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
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

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
        </SafeAreaView>
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
});

export default ComplaintDetailsScreen; 