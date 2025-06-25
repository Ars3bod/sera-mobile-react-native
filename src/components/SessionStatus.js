import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSession } from '../context/SessionManager';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import AppConfig from '../config/appConfig';
import { shouldShowSessionStatus, shouldEnableTestingControls } from '../utils/developmentUtils';

/**
 * SessionStatus Component
 * 
 * A debugging component that displays current session information
 * and provides testing functionality for session management.
 * Only visible in development mode when debug logging is enabled.
 */
const SessionStatus = ({ isVisible = false }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { isAuthenticated, isGuestMode } = useUser();
    const {
        sessionStartTime,
        lastActivityTime,
        isSessionExpired,
        updateActivity,
        handleSessionExpiry,
        getSessionConfig
    } = useSession();

    // Only show when development tools are enabled and component is set to visible
    const shouldShow = shouldShowSessionStatus() &&
        isVisible &&
        (isAuthenticated && !isGuestMode);

    if (!shouldShow) {
        return null;
    }

    const config = getSessionConfig();

    // Calculate time remaining
    const now = Date.now();
    const timeElapsed = lastActivityTime ? now - lastActivityTime : 0;
    const timeRemaining = config.idleTimeoutMinutes * 60 * 1000 - timeElapsed;
    const minutesRemaining = Math.floor(timeRemaining / (60 * 1000));
    const secondsRemaining = Math.floor((timeRemaining % (60 * 1000)) / 1000);

    const formatTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleTimeString();
    };

    const handleTestExpiry = () => {
        Alert.alert(
            'Test Session Expiry',
            'This will force a session expiry for testing purposes.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Force Expiry',
                    style: 'destructive',
                    onPress: () => handleSessionExpiry('debug_test')
                }
            ]
        );
    };

    const handleTestActivity = () => {
        updateActivity('debug_test');
        Alert.alert('Activity Recorded', 'Session activity has been updated for testing.');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
                Session Debug Info
            </Text>

            <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Status:</Text>
                <Text style={[styles.value, { color: isSessionExpired ? '#e74c3c' : '#27ae60' }]}>
                    {isSessionExpired ? 'Expired' : 'Active'}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Started:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>
                    {formatTime(sessionStartTime)}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Last Activity:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>
                    {formatTime(lastActivityTime)}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Time Remaining:</Text>
                <Text style={[styles.value, { color: timeRemaining > 300000 ? theme.colors.text : '#e67e22' }]}>
                    {timeRemaining > 0 ? `${minutesRemaining}:${secondsRemaining.toString().padStart(2, '0')}` : 'Expired'}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Timeout:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>
                    {config.idleTimeoutMinutes} min
                </Text>
            </View>

            {/* Testing Controls - Only show when enabled */}
            {shouldEnableTestingControls() && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        onPress={handleTestActivity}
                    >
                        <Text style={styles.buttonText}>Test Activity</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#e74c3c' }]}
                        onPress={handleTestExpiry}
                    >
                        <Text style={styles.buttonText}>Test Expiry</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        right: 10,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1000,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
    },
    value: {
        fontSize: 12,
        fontWeight: '600',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 8,
    },
    button: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '600',
    },
});

export default SessionStatus; 