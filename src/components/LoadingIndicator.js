import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * Custom Loading Indicator Component
 * Fixes Android animation issues by explicitly setting animating prop
 */
const LoadingIndicator = ({
    size = 'large',
    color,
    style,
    animating = true
}) => {
    const { theme } = useTheme();
    const indicatorColor = color || theme.colors.primary;

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator
                size={size}
                color={indicatorColor}
                animating={animating}
                // Android-specific: Ensure animation is enabled
                {...(Platform.OS === 'android' && {
                    hidesWhenStopped: false,
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingIndicator;

