import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Modal,
    FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import {
    DocumentText24Regular,
    Filter24Regular,
    ArrowLeft24Regular,
    ChevronRight24Regular,
} from '@fluentui/react-native-icons';

import SafeContainer from '../components/SafeContainer';
import Toast from '../components/Toast';
import foiService from '../services/foiService';
import AppConfig from '../config/appConfig';
import { LoadingSpinner } from '../animations';

const ViewFOIScreen = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDarkMode } = useTheme();
    const { user, isAuthenticated } = useUser();
    const isRTL = i18n.language === 'ar';
    const { filter = 'all', fromNavBar = true } = route.params || {};

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [currentFilter, setCurrentFilter] = useState(filter);
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Toast states
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');

    const isFromNavigationBar = fromNavBar;

    const handleGoBack = () => {
        navigation.goBack();
    };

    const showToast = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    };

    const hideToast = () => {
        setToastVisible(false);
    };

    // Get user legal/national ID
    const getUserLegalId = () => {
        if (user?.nationalId) return user.nationalId;
        if (user?.nin) return user.nin;
        if (user?.id) return user.id.toString();
        if (user?.contactInfo?.nationalId) return user.contactInfo.nationalId;
        if (user?.contactInfo?.nin) return user.contactInfo.nin;
        if (user?.NIN) return user.NIN;
        if (user?.nationalID) return user.nationalID;
        return null;
    };

    // Load FOI requests
    const loadRequests = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            setError(null);

            const legalId = getUserLegalId();

            if (!legalId) {
                throw new Error('User legal ID not found');
            }

            const response = await foiService.getFOIRequests({
                requesterId: legalId,
                lang: i18n.language,
            });

            if (response.success && response.requests) {
                // Apply client-side filtering
                const filteredRequests = filterRequestsByStatus(
                    response.requests,
                    currentFilter
                );
                setRequests(filteredRequests);
            } else {
                throw new Error('Failed to load FOI requests');
            }
        } catch (err) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Error loading FOI requests:', err);
            }

            setError(err.message);
            showToast(err.message || t('foi.view.loadError'), 'error');
        } finally {
            if (showLoading) setLoading(false);
            setRefreshing(false);
        }
    };

    // Filter requests by status
    const filterRequestsByStatus = (allRequests, statusFilter) => {
        if (statusFilter === 'all') {
            return allRequests;
        }

        const statusMap = {
            pending: 0,
            approved: 1,
            rejected: 2,
        };

        const statusValue = statusMap[statusFilter];
        return allRequests.filter(request => request.status === statusValue);
    };

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setCurrentFilter(newFilter);
        setShowFilterModal(false);
        const filteredRequests = filterRequestsByStatus(requests, newFilter);
        setRequests(filteredRequests);
        // Reload to get fresh data with new filter
        loadRequests();
    };

    // Pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadRequests(false);
    }, [currentFilter]);

    // Load on focus
    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated) {
                loadRequests();
            }
        }, [isAuthenticated, currentFilter, i18n.language])
    );

    // Navigate to request details
    const handleRequestPress = (request) => {
        navigation.navigate('FOIDetails', { request });
    };

    // Render request card
    const renderRequestCard = (request) => (
        <TouchableOpacity
            key={request.id}
            style={[styles.requestCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => handleRequestPress(request)}
            activeOpacity={0.7}>
            <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.cardHeaderLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <DocumentText24Regular style={{ color: theme.colors.primary, width: 24, height: 24 }} />
                    <Text
                        style={[
                            styles.requestNumber,
                            {
                                color: theme.colors.text,
                                marginLeft: isRTL ? 0 : 8,
                                marginRight: isRTL ? 8 : 0,
                            },
                        ]}>
                        {t('foi.view.requestNumber')}: {request.requestNo}
                    </Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: `${request.statusColor}20`,
                        },
                    ]}>
                    <Text style={[styles.statusText, { color: request.statusColor }]}>
                        {request.statusLabel}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <Text
                    style={[
                        styles.requestTitle,
                        {
                            color: theme.colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        },
                    ]}
                    numberOfLines={2}>
                    {request.title}
                </Text>

                <View style={[styles.requestMeta, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                        {t('foi.view.requestDate')}: {request.requestRaisedDateFormatted}
                    </Text>
                </View>
            </View>

            <View style={[styles.cardFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.viewDetailsText, { color: theme.colors.primary }]}>
                    {t('foi.view.viewDetails')}
                </Text>
                <ChevronRight24Regular
                    style={[
                        styles.chevronIcon,
                        {
                            color: theme.colors.primary,
                            transform: [{ scaleX: isRTL ? -1 : 1 }],
                        },
                    ]}
                />
            </View>
        </TouchableOpacity>
    );

    // Filter options
    const filterOptions = [
        { value: 'all', labelKey: 'foi.filters.all' },
        { value: 'pending', labelKey: 'foi.filters.pending' },
        { value: 'approved', labelKey: 'foi.filters.approved' },
        { value: 'rejected', labelKey: 'foi.filters.rejected' },
    ];

    // Render filter modal
    const renderFilterModal = () => (
        <Modal
            visible={showFilterModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowFilterModal(false)}>
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowFilterModal(false)}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                    <Text
                        style={[
                            styles.modalTitle,
                            {
                                color: theme.colors.text,
                                textAlign: isRTL ? 'right' : 'left',
                            },
                        ]}>
                        {t('foi.view.filterBy')}
                    </Text>
                    <FlatList
                        data={filterOptions}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    {
                                        backgroundColor:
                                            currentFilter === item.value
                                                ? `${theme.colors.primary}10`
                                                : 'transparent',
                                    },
                                ]}
                                onPress={() => handleFilterChange(item.value)}
                                activeOpacity={0.7}>
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        {
                                            color:
                                                currentFilter === item.value
                                                    ? theme.colors.primary
                                                    : theme.colors.text,
                                            textAlign: isRTL ? 'right' : 'left',
                                            fontWeight:
                                                currentFilter === item.value ? '600' : '400',
                                        },
                                    ]}>
                                    {t(item.labelKey)}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity
                        style={[styles.modalCloseButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => setShowFilterModal(false)}
                        activeOpacity={0.8}>
                        <Text style={styles.modalCloseText}>{t('common.close')}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

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
        filterButton: {
            padding: 8,
        },
        content: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
            paddingHorizontal: 40,
        },
        emptyText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: 16,
        },
    });

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
                <Text style={dynamicStyles.headerTitle}>{t('foi.view.title')}</Text>
                <TouchableOpacity
                    style={dynamicStyles.filterButton}
                    onPress={() => setShowFilterModal(true)}
                    activeOpacity={0.7}>
                    <Filter24Regular style={{ color: theme.colors.primary, width: 24, height: 24 }} />
                </TouchableOpacity>
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
                    <View style={{ paddingVertical: 60 }}>
                        <LoadingSpinner size={40} color={theme.colors.primary} />
                    </View>
                ) : requests.length === 0 ? (
                    <View style={dynamicStyles.emptyContainer}>
                        <DocumentText24Regular
                            style={{
                                color: theme.colors.textSecondary,
                                width: 48,
                                height: 48,
                            }}
                        />
                        <Text style={dynamicStyles.emptyText}>
                            {t('foi.view.noRequests')}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.requestsList}>
                        {requests.map((request) => renderRequestCard(request))}
                    </View>
                )}
            </ScrollView>

            {/* Filter Modal */}
            {renderFilterModal()}

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
    requestsList: {
        padding: 20,
    },
    requestCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardHeaderLeft: {
        alignItems: 'center',
        flex: 1,
    },
    requestNumber: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        marginBottom: 12,
    },
    requestTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 22,
    },
    requestMeta: {
        marginTop: 4,
    },
    metaText: {
        fontSize: 13,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewDetailsText: {
        fontSize: 14,
        fontWeight: '600',
    },
    chevronIcon: {
        width: 20,
        height: 20,
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
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    modalItem: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 4,
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

export default ViewFOIScreen;

