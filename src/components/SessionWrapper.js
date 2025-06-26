import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSession } from '../context/SessionManager';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AppConfig from '../config/appConfig';

/**
 * SessionWrapper Component
 * 
 * Simplified wrapper that provides basic session management:
 * - Basic touch event detection for activity tracking
 * - Screen focus detection
 * - Exclusion of specific screens from session timeout
 */
const SessionWrapper = ({ children, screenName }) => {
    const { updateActivity, isScreenExcluded } = useSession();
    const route = useRoute();

    // Get the current screen name from route if not provided
    const currentScreenName = screenName || route.name;

    // Check if current screen should be excluded from session management
    const isExcluded = isScreenExcluded(currentScreenName);

    // Handle basic touch events
    const handleTouchEvent = () => {
        if (!isExcluded) {
            updateActivity();
        }
    };

    // Handle navigation focus (when user navigates to this screen)
    useFocusEffect(
        React.useCallback(() => {
            if (!isExcluded) {
                updateActivity();
            }
        }, [updateActivity, isExcluded])
    );

    // Update activity on mount
    useEffect(() => {
        if (!isExcluded) {
            updateActivity();
        }
    }, [updateActivity, isExcluded]);

    // If session management is disabled, return children without wrapper
    if (!AppConfig.session.enableSessionManagement || isExcluded) {
        return children;
    }

    return (
        <View
            style={{ flex: 1 }}
            onTouchStart={handleTouchEvent}
        >
            {children}
        </View>
    );
};

export default SessionWrapper; 