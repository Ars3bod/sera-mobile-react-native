import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import {
    Home24Regular,
    Apps24Regular,
    DocumentText24Regular,
    Chat24Regular,
    MoreHorizontal24Regular,
} from '@fluentui/react-native-icons';
import LoginRequiredModal from './LoginRequiredModal';

const NavigationBar = ({
    navigation,
    activeTab = 'home',
    onComingSoon = null,
    showComplaints = true
}) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { isAuthenticated, isGuestMode } = useUser();
    const isRTL = i18n.language === 'ar';
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Default coming soon handler
    const handleComingSoon = onComingSoon || (() => {
        // You can implement a default modal or toast here
        console.log('Coming soon feature');
    });

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

    // Handle complaints navigation with authentication check
    const handleComplaintsNavigation = () => {
        // Check if user is in guest mode
        if (isGuestMode && !isAuthenticated) {
            showLoginPrompt();
            return;
        }
        // Navigate to ViewComplaints if authenticated
        navigation.navigate('ViewComplaints', { filter: 'all' });
    };

    // Navigation tabs configuration
    const getNavTabs = () => {
        const baseTabs = [
            // {
            //     id: 'home',
            //     label: t('home.tabs.main'),
            //     icon: Home24Regular,
            //     action: () => navigation.navigate('Home'),
            //     isActive: activeTab === 'home',
            // },
            {
                id: 'services',
                label: t('home.tabs.services'),
                icon: Apps24Regular,
                action: () => navigation.navigate('Services'),
                isActive: activeTab === 'services',
            },
        ];

        // Add complaints tab if enabled
        if (showComplaints) {
            baseTabs.push({
                id: 'complaints',
                label: t('complaints.title'),
                icon: DocumentText24Regular,
                action: handleComplaintsNavigation,
                isActive: activeTab === 'complaints',
            });
        }

        // Add remaining tabs
        baseTabs.push(
            {
                id: 'chat',
                label: t('home.tabs.chat'),
                icon: Chat24Regular,
                action: handleComingSoon,
                isActive: activeTab === 'chat',
            },
            {
                id: 'more',
                label: t('home.tabs.more'),
                icon: MoreHorizontal24Regular,
                action: () => navigation.navigate('More'),
                isActive: activeTab === 'more',
            }
        );

        return baseTabs;
    };

    const navTabs = getNavTabs();

    const dynamicStyles = StyleSheet.create({
        navBarSafeArea: {
            backgroundColor: theme.colors.surface,
        },
        navBar: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            paddingVertical: 8,
        },
        navTab: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 4,
        },
        navIcon: {
            marginBottom: 2,
            width: 20,
            height: 20,
        },
        navIconActive: {
            color: theme.colors.primary,
        },
        navIconInactive: {
            color: theme.colors.icon,
        },
        navLabel: {
            fontSize: 13,
            textAlign: 'center',
        },
        navLabelActive: {
            color: theme.colors.primary,
            fontWeight: '600',
        },
        navLabelInactive: {
            color: theme.colors.textSecondary,
        },
    });

    return (
        <>
            <SafeAreaView style={dynamicStyles.navBarSafeArea} edges={['bottom']}>
                <View style={dynamicStyles.navBar}>
                    {navTabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <TouchableOpacity
                                key={tab.id}
                                style={dynamicStyles.navTab}
                                onPress={tab.action}
                                activeOpacity={0.7}>
                                <IconComponent
                                    style={[
                                        dynamicStyles.navIcon,
                                        tab.isActive
                                            ? dynamicStyles.navIconActive
                                            : dynamicStyles.navIconInactive,
                                    ]}
                                />
                                <Text
                                    style={[
                                        dynamicStyles.navLabel,
                                        tab.isActive
                                            ? dynamicStyles.navLabelActive
                                            : dynamicStyles.navLabelInactive,
                                    ]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </SafeAreaView>

            {/* Login Required Modal */}
            <LoginRequiredModal
                visible={showLoginModal}
                onClose={closeLoginModal}
                onLogin={handleLoginPress}
            />
        </>
    );
};

export default NavigationBar; 