import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
    Modal,
    FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import {
    DocumentText24Regular,
    CheckmarkCircle24Regular,
    Dismiss24Regular,
    Filter24Regular,
    Clock24Regular,
    ArrowLeft24Regular,
    ChevronRight24Regular,
} from '@fluentui/react-native-icons';

import SafeContainer from '../components/SafeContainer';
import dataShareService from '../services/dataShareService';
import AppConfig from '../config/appConfig';
import { LoadingSpinner } from '../animations';

const ViewDataShareScreen = ({ navigation, route }) => {
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

    const isFromNavigationBar = fromNavBar;

    const handleGoBack = () => {
        navigation.goBack();
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

    // Load data share requests
    const loadRequests = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            setError(null);

            const legalId = getUserLegalId();

            if (!legalId) {
                throw new Error('User legal ID not found');
            }

            const response = await dataShareService.getDataShareRequests({
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
                throw new Error('Failed to load data share requests');
            }
        } catch (err) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Error loading data share requests:', err);
            }

            setError(err.message);
            Alert.alert(
                t('common.error'),
                err.message || t('dataShare.view.loadError'),
                [
                    {
                        text: t('common.retry'),
                        onPress: () => {
                            setError(null);
                            loadRequests();
                        },
                    },
                    {
                        text: t('common.cancel'),
                        style: 'cancel',
                    },
                ]
            );
            setRequests([]);
        } finally {
            if (showLoading) setLoading(false);
            setRefreshing(false);
        }
    };

    // Filter requests by status
    const filterRequestsByStatus = (allRequests, filterType) => {
        if (filterType === 'all') {
            return allRequests;
        }

        if (filterType === 'pending') {
            return allRequests.filter((req) => req.status === 0);
        }

        if (filterType === 'approved') {
            return allRequests.filter((req) => req.status === 1);
        }

        if (filterType === 'rejected') {
            return allRequests.filter((req) => req.status === 2);
        }

        return allRequests;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadRequests(false);
    }, [currentFilter]);

    // Load requests when screen focuses or filter changes
    useFocusEffect(
        useCallback(() => {
            loadRequests();
        }, [currentFilter])
    );

    const filterOptions = [
        {
            key: 'all',
            labelKey: 'dataShare.filters.all',
            icon: DocumentText24Regular,
        },
        {
            key: 'pending',
            labelKey: 'dataShare.filters.pending',
            icon: Clock24Regular,
        },
        {
            key: 'approved',
            labelKey: 'dataShare.filters.approved',
            icon: CheckmarkCircle24Regular,
        },
        {
            key: 'rejected',
            labelKey: 'dataShare.filters.rejected',
            icon: Dismiss24Regular,
        },
    ];

    const handleFilterSelect = (filterKey) => {
        setCurrentFilter(filterKey);
        setShowFilterModal(false);
    };

    const handleRequestPress = (request) => {
        navigation.navigate('DataShareDetails', { requestId: request.id, request });
    };

    const renderRequestCard = ({ item }) => (
        <TouchableOpacity
            style={dynamicStyles.requestCard}
            onPress={() => handleRequestPress(item)}
            activeOpacity={0.7}>
            <View style={dynamicStyles.requestHeader}>
                <View style={dynamicStyles.requestHeaderLeft}>
                    <Text style={dynamicStyles.requestTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={dynamicStyles.requestNumber}>
                        {t('dataShare.view.requestNumber')}: {item.applicationNo}
                    </Text>
                </View>
                <View
                    style={[
                        dynamicStyles.statusBadge,
                        { backgroundColor: `${item.statusColor}15` },
                    ]}>
                    <Text style={[dynamicStyles.statusText, { color: item.statusColor }]}>
                        {item.statusLabel}
                    </Text>
                </View>
            </View>

            <View style={dynamicStyles.requestDetails}>
                <View style={dynamicStyles.detailRow}>
                    <Text style={dynamicStyles.detailLabel}>
                        {t('dataShare.view.requestDate')}:
                    </Text>
                    <Text style={dynamicStyles.detailValue}>
                        {item.requestRaisedDateFormatted}
                    </Text>
                </View>
                <View style={dynamicStyles.detailRow}>
                    <Text style={dynamicStyles.detailLabel}>
                        {t('dataShare.view.requestNature')}:
                    </Text>
                    <Text style={dynamicStyles.detailValue}>
                        {item.requestNature}
                    </Text>
                </View>
                <View style={dynamicStyles.detailRow}>
                    <Text style={dynamicStyles.detailLabel}>
                        {t('dataShare.view.dataFormat')}:
                    </Text>
                    <Text style={dynamicStyles.detailValue}>
                        {item.dataFormatType}
                    </Text>
                </View>
            </View>

            <View style={dynamicStyles.requestFooter}>
                <Text style={dynamicStyles.viewDetailsText}>
                    {t('dataShare.view.viewDetails')}
                </Text>
                <ChevronRight24Regular
                    style={[
                        dynamicStyles.arrowIcon,
                        { color: theme.colors.primary },
                    ]}
                />
            </View>
        </TouchableOpacity>
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
        filterButton: {
            padding: 8,
            borderRadius: 8,
            backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 4,
        },
        filterButtonText: {
            fontSize: 14,
            color: theme.colors.text,
            fontWeight: '500',
        },
        content: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        listContainer: {
            padding: 20,
        },
        requestCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            ...theme.shadows.small,
        },
        requestHeader: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
        },
        requestHeaderLeft: {
            flex: 1,
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0,
        },
        requestTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 4,
        },
        requestNumber: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
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
        requestDetails: {
            gap: 8,
            marginBottom: 12,
        },
        detailRow: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
        },
        detailLabel: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
        },
        detailValue: {
            fontSize: 14,
            color: theme.colors.text,
            textAlign: isRTL ? 'left' : 'right',
            fontWeight: '500',
        },
        requestFooter: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: isRTL ? 'flex-start' : 'flex-end',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        viewDetailsText: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '500',
            marginRight: isRTL ? 0 : 4,
            marginLeft: isRTL ? 4 : 0,
        },
        arrowIcon: {
            transform: [{ scaleX: isRTL ? -1 : 1 }],
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: 16,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            paddingBottom: 40,
            paddingHorizontal: 20,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 20,
        },
        filterOption: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginBottom: 8,
        },
        filterOptionActive: {
            backgroundColor: `${theme.colors.primary}15`,
        },
        filterIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0,
        },
        filterOptionText: {
            fontSize: 16,
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            flex: 1,
        },
        filterOptionActiveText: {
            color: theme.colors.primary,
            fontWeight: '600',
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
                    {t('dataShare.view.title')}
                </Text>
                <TouchableOpacity
                    style={dynamicStyles.filterButton}
                    onPress={() => setShowFilterModal(true)}
                    activeOpacity={0.7}>
                    <Filter24Regular style={{ color: theme.colors.primary }} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {loading ? (
                <View style={dynamicStyles.loadingContainer}>
                    <LoadingSpinner size={40} color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={requests}
                    renderItem={renderRequestCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={
                        requests.length === 0
                            ? dynamicStyles.emptyContainer
                            : dynamicStyles.listContainer
                    }
                    ListEmptyComponent={
                        <View style={dynamicStyles.emptyContainer}>
                            <DocumentText24Regular
                                style={{ color: theme.colors.textSecondary, fontSize: 48 }}
                            />
                            <Text style={dynamicStyles.emptyText}>
                                {t('dataShare.view.noRequests')}
                            </Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.colors.primary}
                            colors={[theme.colors.primary]}
                        />
                    }
                />
            )}

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFilterModal(false)}>
                <TouchableOpacity
                    style={dynamicStyles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowFilterModal(false)}>
                    <TouchableOpacity activeOpacity={1} onPress={() => { }}>
                        <View style={dynamicStyles.modalContent}>
                            <Text style={dynamicStyles.modalTitle}>
                                {t('dataShare.view.filterBy')}
                            </Text>
                            {filterOptions.map((option) => {
                                const Icon = option.icon;
                                const isActive = currentFilter === option.key;
                                return (
                                    <TouchableOpacity
                                        key={option.key}
                                        style={[
                                            dynamicStyles.filterOption,
                                            isActive && dynamicStyles.filterOptionActive,
                                        ]}
                                        onPress={() => handleFilterSelect(option.key)}
                                        activeOpacity={0.7}>
                                        <View
                                            style={[
                                                dynamicStyles.filterIconContainer,
                                                {
                                                    backgroundColor: isActive
                                                        ? `${theme.colors.primary}20`
                                                        : `${theme.colors.textSecondary}10`,
                                                },
                                            ]}>
                                            <Icon
                                                style={{
                                                    color: isActive
                                                        ? theme.colors.primary
                                                        : theme.colors.textSecondary,
                                                }}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                dynamicStyles.filterOptionText,
                                                isActive && dynamicStyles.filterOptionActiveText,
                                            ]}>
                                            {t(option.labelKey)}
                                        </Text>
                                        {isActive && (
                                            <CheckmarkCircle24Regular
                                                style={{ color: theme.colors.primary }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </SafeContainer>
    );
};

export default ViewDataShareScreen;

