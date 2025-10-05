import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import {
    ArrowLeft24Regular,
    Add24Regular,
    DocumentText24Regular,
    CheckmarkCircle24Regular,
    Dismiss24Regular,
    ChevronRight24Regular,
    Clock24Regular,
} from '@fluentui/react-native-icons';

import SafeContainer from '../components/SafeContainer';
import SessionWrapper from '../components/SessionWrapper';
import LoginRequiredModal from '../components/LoginRequiredModal';

import dataShareService from '../services/dataShareService';
import AppConfig from '../config/appConfig';
import { LoadingSpinner } from '../animations';

const DataShareScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const { user, isAuthenticated, isGuestMode } = useUser();
    const isRTL = i18n.language === 'ar';

    const [requestsCounts, setRequestsCounts] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const navigateToCreateRequest = () => {
        navigation.navigate('CreateDataShare');
    };

    // Login modal handlers
    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    const handleLoginPress = () => {
        setShowLoginModal(false);
        navigation.navigate('NafathLogin', { fromModal: true });
    };

    const showLoginPrompt = () => {
        setShowLoginModal(true);
    };

    const navigateToViewRequests = (filter = 'all') => {
        // Check if user is in guest mode
        if (isGuestMode && !isAuthenticated) {
            showLoginPrompt();
            return;
        }
        // Navigate to ViewDataShare if authenticated
        navigation.navigate('ViewDataShare', { filter, fromNavBar: false });
    };

    // Get user legal/national ID
    const getUserLegalId = () => {
        // Check primary field
        if (user?.nationalId) {
            return user.nationalId;
        }

        // Check alternative field names
        if (user?.nin) {
            return user.nin;
        }

        if (user?.id) {
            return user.id.toString();
        }

        // Check contact info
        if (user?.contactInfo?.nationalId) {
            return user.contactInfo.nationalId;
        }

        if (user?.contactInfo?.nin) {
            return user.contactInfo.nin;
        }

        // Check for NIN field variations
        if (user?.NIN) {
            return user.NIN;
        }

        if (user?.nationalID) {
            return user.nationalID;
        }

        return null;
    };

    // Fetch data share requests counts from API
    const fetchRequestsCounts = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);

            const legalId = getUserLegalId();

            if (!legalId) {
                console.warn('User legal ID not found');
                setRequestsCounts({
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    total: 0,
                });
                return;
            }

            if (AppConfig.development.enableDebugLogs) {
                console.log('Fetching data share requests counts from API');
            }

            const response = await dataShareService.getDataShareRequests({
                requesterId: legalId,
                lang: i18n.language,
            });

            if (response.success) {
                const requests = response.requests || [];
                const counts = dataShareService.getRequestsCounts(requests);

                setRequestsCounts({
                    pending: counts.pending,
                    approved: counts.approved,
                    rejected: counts.rejected,
                    total: counts.total,
                });
            } else {
                console.error('Failed to fetch data share requests');
                setRequestsCounts({
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    total: 0,
                });
            }
        } catch (error) {
            console.error('Error fetching data share requests counts:', error);
            setRequestsCounts({
                pending: 0,
                approved: 0,
                rejected: 0,
                total: 0,
            });
        } finally {
            if (showLoading) setLoading(false);
            setRefreshing(false);
        }
    };

    // Handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchRequestsCounts(false);
    };

    // Fetch counts on screen focus
    useFocusEffect(
        React.useCallback(() => {
            if (isAuthenticated && !isGuestMode) {
                fetchRequestsCounts();
            }
        }, [isAuthenticated, isGuestMode, i18n.language])
    );

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
        placeholderView: {
            width: 40,
        },
        content: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        section: {
            padding: 20,
        },
        summaryCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            ...theme.shadows.medium,
        },
        summaryTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 16,
        },
        statsContainer: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
        },
        statItem: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 12,
        },
        statDivider: {
            width: 1,
            backgroundColor: theme.colors.border,
            marginHorizontal: 8,
        },
        statNumber: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        actionsContainer: {
            gap: 16,
        },
        actionCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 20,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            ...theme.shadows.small,
        },
        actionIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: isRTL ? 0 : 16,
            marginLeft: isRTL ? 16 : 0,
        },
        actionContent: {
            flex: 1,
        },
        actionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 4,
        },
        actionDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
            lineHeight: 20,
        },
        actionArrow: {
            marginLeft: isRTL ? 0 : 8,
            marginRight: isRTL ? 8 : 0,
            transform: [{ scaleX: isRTL ? -1 : 1 }],
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
                        {t('dataShare.title')}
                    </Text>
                    <View style={dynamicStyles.placeholderView} />
                </View>

                {/* Content */}
                <ScrollView
                    style={dynamicStyles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.colors.primary}
                            colors={[theme.colors.primary]}
                        />
                    }>
                    {loading ? (
                        <View style={{ paddingVertical: 40 }}>
                            <LoadingSpinner size={40} color={theme.colors.primary} />
                        </View>
                    ) : (
                        <View style={dynamicStyles.section}>
                            {/* Summary Card */}
                            {isAuthenticated && !isGuestMode && (
                                <View style={dynamicStyles.summaryCard}>
                                    <Text style={dynamicStyles.summaryTitle}>
                                        {t('dataShare.summary.title')}
                                    </Text>
                                    <View style={dynamicStyles.statsContainer}>
                                        {/* Pending */}
                                        <View style={dynamicStyles.statItem}>
                                            <Text
                                                style={[
                                                    dynamicStyles.statNumber,
                                                    { color: theme.colors.primary },
                                                ]}>
                                                {requestsCounts.pending}
                                            </Text>
                                            <Text style={dynamicStyles.statLabel}>
                                                {t('dataShare.summary.pending')}
                                            </Text>
                                        </View>

                                        <View style={dynamicStyles.statDivider} />

                                        {/* Approved */}
                                        <View style={dynamicStyles.statItem}>
                                            <Text
                                                style={[
                                                    dynamicStyles.statNumber,
                                                    { color: theme.colors.primary },
                                                ]}>
                                                {requestsCounts.approved}
                                            </Text>
                                            <Text style={dynamicStyles.statLabel}>
                                                {t('dataShare.summary.approved')}
                                            </Text>
                                        </View>

                                        <View style={dynamicStyles.statDivider} />

                                        {/* Rejected */}
                                        <View style={dynamicStyles.statItem}>
                                            <Text
                                                style={[
                                                    dynamicStyles.statNumber,
                                                    { color: theme.colors.primary },
                                                ]}>
                                                {requestsCounts.rejected}
                                            </Text>
                                            <Text style={dynamicStyles.statLabel}>
                                                {t('dataShare.summary.rejected')}
                                            </Text>
                                        </View>

                                        <View style={dynamicStyles.statDivider} />

                                        {/* Total */}
                                        <View style={dynamicStyles.statItem}>
                                            <Text
                                                style={[
                                                    dynamicStyles.statNumber,
                                                    { color: theme.colors.primary },
                                                ]}>
                                                {requestsCounts.total}
                                            </Text>
                                            <Text style={dynamicStyles.statLabel}>
                                                {t('dataShare.summary.total')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Actions */}
                            <View style={dynamicStyles.actionsContainer}>
                                {/* New Request */}
                                <TouchableOpacity
                                    style={dynamicStyles.actionCard}
                                    onPress={navigateToCreateRequest}
                                    activeOpacity={0.7}>
                                    <View
                                        style={[
                                            dynamicStyles.actionIconContainer,
                                            { backgroundColor: `${theme.colors.primary}15` },
                                        ]}>
                                        <Add24Regular
                                            style={{ color: theme.colors.primary }}
                                        />
                                    </View>
                                    <View style={dynamicStyles.actionContent}>
                                        <Text style={dynamicStyles.actionTitle}>
                                            {t('dataShare.actions.newRequest.title')}
                                        </Text>
                                        <Text style={dynamicStyles.actionDescription}>
                                            {t('dataShare.actions.newRequest.description')}
                                        </Text>
                                    </View>
                                    <ChevronRight24Regular
                                        style={[
                                            dynamicStyles.actionArrow,
                                            { color: theme.colors.textSecondary },
                                        ]}
                                    />
                                </TouchableOpacity>

                                {/* View My Requests */}
                                <TouchableOpacity
                                    style={dynamicStyles.actionCard}
                                    onPress={() => navigateToViewRequests('all')}
                                    activeOpacity={0.7}>
                                    <View
                                        style={[
                                            dynamicStyles.actionIconContainer,
                                            { backgroundColor: `${theme.colors.primary}15` },
                                        ]}>
                                        <DocumentText24Regular
                                            style={{ color: theme.colors.primary }}
                                        />
                                    </View>
                                    <View style={dynamicStyles.actionContent}>
                                        <Text style={dynamicStyles.actionTitle}>
                                            {t('dataShare.actions.viewRequests.title')}
                                        </Text>
                                        <Text style={dynamicStyles.actionDescription}>
                                            {t('dataShare.actions.viewRequests.description')}
                                        </Text>
                                    </View>
                                    <ChevronRight24Regular
                                        style={[
                                            dynamicStyles.actionArrow,
                                            { color: theme.colors.textSecondary },
                                        ]}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Login Required Modal */}
                <LoginRequiredModal
                    visible={showLoginModal}
                    onClose={closeLoginModal}
                    onLogin={handleLoginPress}
                />
            </SafeContainer>
        </SessionWrapper>
    );
};

export default DataShareScreen;

