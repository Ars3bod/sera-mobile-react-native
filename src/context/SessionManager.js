import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const { isAuthenticated, isGuestMode, logout: userLogout } = useUser();
    const navigation = useNavigation();

    // Simple session state
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [lastActivityTime, setLastActivityTime] = useState(null);
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    // App state monitoring to prevent background crashes
    const [appState, setAppState] = useState(AppState.currentState);

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

        // Always perform silent logout - no alerts regardless of app state
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

    // Perform silent logout with navigation reset - no user alerts
    const performLogout = useCallback(async (reason) => {
        const config = getSessionConfig();

        // Call user context logout
        await userLogout();

        // Perform silent navigation back to login - no alerts to user
        console.log(`Session expired (${reason}) - performing silent logout`);

        if (config.resetNavigationOnExpiry) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } else {
            navigation.navigate('Login');
        }
    }, [getSessionConfig, userLogout, navigation]);

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

    // Monitor app state changes to prevent background crashes
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            console.log('App state changed from', appState, 'to', nextAppState);
            setAppState(nextAppState);
        });

        return () => subscription?.remove();
    }, [appState]);

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