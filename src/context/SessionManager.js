import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useUser } from './UserContext';
import { useNavigation } from '@react-navigation/native';
import AppConfig from '../config/appConfig';

const SessionContext = createContext();

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

// Storage keys for session data
const SESSION_STORAGE_KEYS = {
    SESSION_START: '@sera_session_start',
    LAST_ACTIVITY: '@sera_last_activity',
};

export const SessionProvider = ({ children }) => {
    const { t, i18n } = useTranslation();
    const { isAuthenticated, isGuestMode, logout: userLogout } = useUser();
    const navigation = useNavigation();

    // Simple session state
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [lastActivityTime, setLastActivityTime] = useState(null);
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    // Single timer ref
    const sessionTimerRef = useRef(null);

    // Get session configuration
    const getSessionConfig = useCallback(() => {
        return AppConfig.session;
    }, []);

    // Convert minutes to milliseconds
    const minutesToMs = (minutes) => minutes * 60 * 1000;

    // Initialize session
    const initializeSession = useCallback(async () => {
        if (!isAuthenticated || isGuestMode) return;

        const now = Date.now();
        setSessionStartTime(now);
        setLastActivityTime(now);
        setIsSessionExpired(false);

        // Store session data
        try {
            await AsyncStorage.multiSet([
                [SESSION_STORAGE_KEYS.SESSION_START, now.toString()],
                [SESSION_STORAGE_KEYS.LAST_ACTIVITY, now.toString()],
            ]);
        } catch (error) {
            console.log('Error storing session data:', error);
        }

        // Start session timer
        startSessionTimer();
    }, [isAuthenticated, isGuestMode]);

    // Start session timer
    const startSessionTimer = useCallback(() => {
        const config = getSessionConfig();

        if (!config.enableSessionManagement || !config.enableIdleTimeout) return;

        // Clear existing timer
        if (sessionTimerRef.current) {
            clearTimeout(sessionTimerRef.current);
        }

        const idleTimeout = minutesToMs(config.idleTimeoutMinutes);

        // Set session timer
        sessionTimerRef.current = setTimeout(() => {
            handleSessionExpiry('idle');
        }, idleTimeout);
    }, [getSessionConfig]);

    // Update last activity time
    const updateActivity = useCallback(async () => {
        if (!isAuthenticated || isGuestMode || isSessionExpired) return;

        const now = Date.now();
        setLastActivityTime(now);

        // Store updated activity time
        try {
            await AsyncStorage.setItem(SESSION_STORAGE_KEYS.LAST_ACTIVITY, now.toString());
        } catch (error) {
            console.log('Error updating activity time:', error);
        }

        // Restart session timer
        startSessionTimer();
    }, [isAuthenticated, isGuestMode, isSessionExpired, startSessionTimer]);

    // Handle session expiry
    const handleSessionExpiry = useCallback(async (reason = 'idle') => {
        if (isSessionExpired) return;

        setIsSessionExpired(true);

        // Clear timer
        if (sessionTimerRef.current) {
            clearTimeout(sessionTimerRef.current);
            sessionTimerRef.current = null;
        }

        // Clear session data
        await clearSessionData();

        // Perform logout
        await performLogout(reason);
    }, [isSessionExpired]);

    // Clear session data
    const clearSessionData = useCallback(async () => {
        const config = getSessionConfig();

        if (config.clearDataOnLogout) {
            try {
                await AsyncStorage.multiRemove([
                    SESSION_STORAGE_KEYS.SESSION_START,
                    SESSION_STORAGE_KEYS.LAST_ACTIVITY,
                ]);
            } catch (error) {
                console.log('Error clearing session data:', error);
            }
        }
    }, [getSessionConfig]);

    // Perform logout with navigation reset
    const performLogout = useCallback(async (reason) => {
        const config = getSessionConfig();
        const isRTL = i18n.language === 'ar';

        // Call user context logout
        await userLogout();

        // Show logout message
        const logoutMessage = reason === 'idle'
            ? t('session.expiry.idleMessage')
            : t('session.expiry.maxDurationMessage');

        Alert.alert(
            t('session.expiry.title'),
            logoutMessage,
            [
                {
                    text: t('session.expiry.loginAgain'),
                    onPress: () => {
                        if (config.resetNavigationOnExpiry) {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } else {
                            navigation.navigate('Login');
                        }
                    },
                },
            ],
            {
                cancelable: false,
                userInterfaceStyle: isRTL ? 'rtl' : 'ltr',
            }
        );
    }, [getSessionConfig, i18n.language, t, userLogout, navigation]);

    // Check if current screen should be excluded from timeout
    const isScreenExcluded = useCallback((screenName) => {
        const config = getSessionConfig();
        return config.excludedScreens.includes(screenName);
    }, [getSessionConfig]);

    // Initialize session when user authenticates
    useEffect(() => {
        if (isAuthenticated && !isGuestMode) {
            initializeSession();
        } else {
            // Clear timer when not authenticated
            if (sessionTimerRef.current) {
                clearTimeout(sessionTimerRef.current);
                sessionTimerRef.current = null;
            }
        }
    }, [isAuthenticated, isGuestMode, initializeSession]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sessionTimerRef.current) {
                clearTimeout(sessionTimerRef.current);
            }
        };
    }, []);

    // Session context value
    const value = {
        // State
        sessionStartTime,
        lastActivityTime,
        isSessionExpired,

        // Actions
        updateActivity,
        handleSessionExpiry,
        isScreenExcluded,

        // Utils
        getSessionConfig,
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}; 