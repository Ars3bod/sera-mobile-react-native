import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Alert, AppState, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useUser } from './UserContext';
import { useNavigation } from '@react-navigation/native';
import AppConfig from '../config/appConfig';
import { sessionDebugLog, isDebugLoggingEnabled, getSessionDebugConfig } from '../utils/developmentUtils';

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
    SESSION_CONFIG: '@sera_session_config',
};

export const SessionProvider = ({ children }) => {
    const { t, i18n } = useTranslation();
    const { isAuthenticated, isGuestMode, logout: userLogout } = useUser();
    const navigation = useNavigation();

    // Session state
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [lastActivityTime, setLastActivityTime] = useState(null);
    const [isSessionWarningVisible, setIsSessionWarningVisible] = useState(false);
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);

    // Timers and refs
    const idleTimerRef = useRef(null);
    const warningTimerRef = useRef(null);
    const sessionTimerRef = useRef(null);
    const activityTimerRef = useRef(null);
    const appStateRef = useRef(AppState.currentState);

    // Get session configuration with debug overrides
    const getSessionConfig = useCallback(() => {
        const config = AppConfig.session;
        const debugConfig = getSessionDebugConfig();

        if (isDebugLoggingEnabled() && debugConfig.enableShortTimeouts) {
            return {
                ...config,
                idleTimeoutMinutes: debugConfig.shortIdleTimeoutMinutes,
                warningBeforeExpiryMinutes: debugConfig.shortWarningMinutes,
            };
        }

        return config;
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
        await AsyncStorage.multiSet([
            [SESSION_STORAGE_KEYS.SESSION_START, now.toString()],
            [SESSION_STORAGE_KEYS.LAST_ACTIVITY, now.toString()],
        ]);

        sessionDebugLog('Session initialized at:', new Date(now));
    }, [isAuthenticated, isGuestMode]);

    // Update last activity time
    const updateActivity = useCallback(async (activityType = 'touch') => {
        if (!isAuthenticated || isGuestMode || isSessionExpired) return;

        const config = getSessionConfig();
        if (!config.activitiesResetTimer.includes(activityType)) return;

        const now = Date.now();
        setLastActivityTime(now);

        // Store updated activity time
        await AsyncStorage.setItem(SESSION_STORAGE_KEYS.LAST_ACTIVITY, now.toString());

        // Reset idle timer
        resetIdleTimer();

        sessionDebugLog(`Activity updated: ${activityType} at ${new Date(now)}`);
    }, [isAuthenticated, isGuestMode, isSessionExpired, getSessionConfig]);

    // Reset idle timer
    const resetIdleTimer = useCallback(() => {
        const config = getSessionConfig();

        // Clear existing timers
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current);
        }

        // Hide warning if showing
        if (isSessionWarningVisible) {
            setIsSessionWarningVisible(false);
        }

        if (!config.enableIdleTimeout || !isAuthenticated || isGuestMode) return;

        const idleTimeout = minutesToMs(config.idleTimeoutMinutes);
        const warningTimeout = minutesToMs(config.idleTimeoutMinutes - config.warningBeforeExpiryMinutes);

        // Set warning timer
        if (config.enableSessionWarnings && warningTimeout > 0) {
            warningTimerRef.current = setTimeout(() => {
                showSessionWarning();
            }, warningTimeout);
        }

        // Set idle timer
        idleTimerRef.current = setTimeout(() => {
            handleSessionExpiry('idle');
        }, idleTimeout);

    }, [getSessionConfig, isAuthenticated, isGuestMode, isSessionWarningVisible]);

    // Show session warning
    // const showSessionWarning = useCallback(() => {
    //     if (isSessionExpired || isSessionWarningVisible) return;

    //     setIsSessionWarningVisible(true);
    //     const config = getSessionConfig();
    //     const isRTL = i18n.language === 'ar';

    //     Alert.alert(
    //         t('session.warning.title'),
    //         t('session.warning.message', { minutes: config.warningBeforeExpiryMinutes }),
    //         [
    //             {
    //                 text: t('session.warning.logout'),
    //                 style: 'destructive',
    //                 onPress: () => {
    //                     setIsSessionWarningVisible(false);
    //                     handleSessionExpiry('user_choice');
    //                 },
    //             },
    //             {
    //                 text: t('session.warning.stayLoggedIn'),
    //                 style: 'default',
    //                 onPress: () => {
    //                     setIsSessionWarningVisible(false);
    //                     updateActivity('user_interaction');
    //                 },
    //             },
    //         ],
    //         {
    //             cancelable: false,
    //             // RTL support for alert buttons
    //             userInterfaceStyle: isRTL ? 'rtl' : 'ltr',
    //         }
    //     );
    // }, [isSessionExpired, isSessionWarningVisible, getSessionConfig, i18n.language, t, updateActivity]);

    // Handle session expiry
    const handleSessionExpiry = useCallback(async (reason = 'idle') => {
        if (isSessionExpired) return;

        setIsSessionExpired(true);
        setIsSessionWarningVisible(false);

        // Clear all timers
        [idleTimerRef, warningTimerRef, sessionTimerRef, activityTimerRef].forEach(timer => {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        });

        // Log session expiry
        sessionDebugLog(`Session expired due to: ${reason}`);

        // Clear session data
        await clearSessionData();

        // Perform logout
        await performLogout(reason);

    }, [isSessionExpired]);

    // Clear session data
    const clearSessionData = useCallback(async () => {
        const config = getSessionConfig();

        if (config.clearDataOnLogout) {
            // Clear session-specific storage
            await AsyncStorage.multiRemove([
                SESSION_STORAGE_KEYS.SESSION_START,
                SESSION_STORAGE_KEYS.LAST_ACTIVITY,
                SESSION_STORAGE_KEYS.SESSION_CONFIG,
            ]);

            sessionDebugLog('Session data cleared');
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
                            // Reset navigation stack and go to login
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

    // Extend session
    const extendSession = useCallback(async () => {
        if (!isAuthenticated || isGuestMode) return;

        await updateActivity('session_extension');
        setIsSessionWarningVisible(false);

        sessionDebugLog('Session extended by user');
    }, [isAuthenticated, isGuestMode, updateActivity]);

    // Check if current screen should be excluded from timeout
    const isScreenExcluded = useCallback((screenName) => {
        const config = getSessionConfig();
        return config.excludedScreens.includes(screenName);
    }, [getSessionConfig]);

    // Handle app state changes
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
                // App came to foreground
                if (isAuthenticated && !isGuestMode) {
                    updateActivity('app_foreground');
                }
            } else if (nextAppState.match(/inactive|background/)) {
                // App went to background - record activity time
                if (isAuthenticated && !isGuestMode) {
                    updateActivity('app_background');
                }
            }

            appStateRef.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [isAuthenticated, isGuestMode, updateActivity]);

    // Initialize session when user authenticates
    useEffect(() => {
        if (isAuthenticated && !isGuestMode) {
            initializeSession();
            resetIdleTimer();
        } else {
            // Clear timers when not authenticated
            [idleTimerRef, warningTimerRef, sessionTimerRef, activityTimerRef].forEach(timer => {
                if (timer.current) {
                    clearTimeout(timer.current);
                    timer.current = null;
                }
            });
        }
    }, [isAuthenticated, isGuestMode, initializeSession, resetIdleTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            [idleTimerRef, warningTimerRef, sessionTimerRef, activityTimerRef].forEach(timer => {
                if (timer.current) {
                    clearTimeout(timer.current);
                }
            });
        };
    }, []);

    // Session context value
    const value = {
        // State
        sessionStartTime,
        lastActivityTime,
        isSessionWarningVisible,
        isSessionExpired,
        remainingTime,

        // Actions
        updateActivity,
        extendSession,
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