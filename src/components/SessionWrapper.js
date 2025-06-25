import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useSession } from '../context/SessionManager';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AppConfig from '../config/appConfig';
import { sessionDebugLog } from '../utils/developmentUtils';

/**
 * SessionWrapper Component
 * 
 * Wraps screen components to provide automatic session management including:
 * - Touch event detection for activity tracking
 * - Scroll event detection
 * - Screen focus detection
 * - Navigation activity tracking
 * - Exclusion of specific screens from session timeout
 */
const SessionWrapper = ({ children, screenName }) => {
    const { updateActivity, isScreenExcluded } = useSession();
    const route = useRoute();
    const lastActivityRef = useRef(Date.now());

    // Get the current screen name from route if not provided
    const currentScreenName = screenName || route.name;

    // Check if current screen should be excluded from session management
    const isExcluded = isScreenExcluded(currentScreenName);

    // Throttle activity updates to prevent excessive calls
    const throttledUpdateActivity = (activityType) => {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;

        // Only update if it's been more than 5 seconds since last activity
        if (timeSinceLastActivity > 5000) {
            lastActivityRef.current = now;
            updateActivity(activityType);

            sessionDebugLog(`Session activity detected: ${activityType} on ${currentScreenName}`);
        }
    };

    // Handle touch events
    const handleTouchEvent = () => {
        if (!isExcluded) {
            throttledUpdateActivity('touch');
        }
    };

    // Handle scroll events
    const handleScrollEvent = () => {
        if (!isExcluded) {
            throttledUpdateActivity('scroll');
        }
    };

    // Handle navigation focus (when user navigates to this screen)
    useFocusEffect(
        React.useCallback(() => {
            if (!isExcluded) {
                updateActivity('navigation');

                sessionDebugLog(`Screen focused: ${currentScreenName}`);
            }

            return () => {
                // Screen is being unfocused
                sessionDebugLog(`Screen unfocused: ${currentScreenName}`);
            };
        }, [updateActivity, isExcluded, currentScreenName])
    );

    // Update activity on mount
    useEffect(() => {
        if (!isExcluded) {
            updateActivity('screen_mount');
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
            onMoveShouldSetResponder={() => {
                handleTouchEvent();
                return false; // Don't capture the gesture
            }}
        >
            {children}
        </View>
    );
};

export default SessionWrapper; 