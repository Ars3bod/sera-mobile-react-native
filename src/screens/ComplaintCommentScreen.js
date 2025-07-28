import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import commentService from '../services/commentService';
import CommentView from '../components/CommentView';
import CommentForm from '../components/CommentForm';
import AppConfig from '../config/appConfig';

// Safe imports for FluentUI icons
let AddIcon, BackIcon, RefreshIcon;
try {
    const icons = require('@fluentui/react-native-icons');
    AddIcon = icons.Add24Regular;
    BackIcon = icons.ArrowLeft24Regular;
    RefreshIcon = icons.ArrowSync24Regular;
} catch (error) {
    // Fallback to emoji icons
    AddIcon = () => <Text>➕</Text>;
    BackIcon = () => <Text>←</Text>;
    RefreshIcon = () => <Text>🔄</Text>;
}

const ComplaintCommentScreen = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { user } = useUser();
    const isRTL = i18n.language === 'ar';

    // Get parameters from route
    const { caseNumber, complaintTitle } = route.params;

    // State
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddCommentModal, setShowAddCommentModal] = useState(false);

    // Load comments
    const loadComments = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            // For development, use mock data if enabled
            if (AppConfig.development.enableMockData) {
                const mockComments = commentService.generateMockComments(caseNumber);
                setComments(mockComments);
            } else {
                const response = await commentService.getComments(caseNumber);
                if (response.success) {
                    setComments(response.comments || []);
                } else {
                    throw new Error(response.message || 'Failed to load comments');
                }
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Load comments error:', error);
            }

            Alert.alert(
                t('comments.error'),
                error.message || t('comments.loadError'),
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Handle comment added
    const handleCommentAdded = async (response) => {
        if (AppConfig.development.enableDebugLogs) {
            console.log('Comment added:', response);
        }

        // Refresh comments list
        await loadComments(true);

        // Close modal
        setShowAddCommentModal(false);
    };

    // Handle refresh
    const handleRefresh = () => {
        loadComments(true);
    };

    // Load comments on mount
    useEffect(() => {
        loadComments();
    }, [caseNumber]);

    // Set navigation options
    useEffect(() => {
        navigation.setOptions({
            headerTitle: t('comments.title'),
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleRefresh}
                    style={styles.headerButton}
                >
                    <RefreshIcon color={theme.colors.primary} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, t, theme]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.dark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <BackIcon color={theme.colors.primary} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={[
                        styles.headerTitle,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {t('comments.title')}
                    </Text>
                    <Text style={[
                        styles.headerSubtitle,
                        {
                            color: theme.colors.textSecondary,
                            textAlign: isRTL ? 'right' : 'left',
                        }
                    ]}>
                        {complaintTitle || `${t('complaints.details.caseNumber')}: ${caseNumber}`}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => setShowAddCommentModal(true)}
                    style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                >
                    <AddIcon color={theme.colors.onPrimary} />
                </TouchableOpacity>
            </View>

            {/* Comments List */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={[
                            styles.loadingText,
                            {
                                color: theme.colors.textSecondary,
                                textAlign: isRTL ? 'right' : 'left',
                            }
                        ]}>
                            {t('comments.loading')}
                        </Text>
                    </View>
                ) : (
                    <CommentView
                        comments={comments}
                        onRefresh={handleRefresh}
                    />
                )}
            </View>

            {/* Add Comment Modal */}
            <Modal
                visible={showAddCommentModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowAddCommentModal(false)}
            >
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <CommentForm
                        caseNumber={caseNumber}
                        beneficiary={user?.contactId}
                        onCommentAdded={handleCommentAdded}
                        onClose={() => setShowAddCommentModal(false)}
                    />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerContent: {
        flex: 1,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
    },
});

export default ComplaintCommentScreen; 