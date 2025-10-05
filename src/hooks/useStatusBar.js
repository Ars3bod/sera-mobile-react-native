import { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * useStatusBar Hook
 * 
 * Provides consistent status bar management across screens.
 * Automatically handles theming and cross-platform differences.
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.style - Status bar style ('light-content' | 'dark-content' | 'auto')
 * @param {string} options.backgroundColor - Background color (Android only)
 * @param {boolean} options.translucent - Whether status bar should be translucent (Android only)
 * @param {boolean} options.hidden - Whether to hide the status bar
 * @param {string} options.animated - Whether changes should be animated
 * 
 * @returns {Object} Status bar configuration object
 */
const useStatusBar = (options = {}) => {
    const { theme, isDarkMode } = useTheme();

    const {
        style = 'auto', // 'auto' uses theme-based detection
        backgroundColor = theme.colors.background, // Use background instead of surface for status bar
        translucent = false,
        hidden = false,
        animated = true,
    } = options;

    // Determine status bar style based on theme if 'auto' is specified
    const getStatusBarStyle = () => {
        if (style === 'auto') {
            return isDarkMode ? 'light-content' : 'dark-content';
        }
        return style;
    };

    // Status bar configuration
    const statusBarConfig = {
        barStyle: getStatusBarStyle(),
        backgroundColor: Platform.OS === 'android' ? backgroundColor : undefined,
        translucent: Platform.OS === 'android' ? translucent : undefined,
        hidden,
        animated,
    };

    // Apply status bar configuration
    useEffect(() => {
        if (hidden) {
            StatusBar.setHidden(true, animated ? 'slide' : 'none');
        } else {
            StatusBar.setHidden(false, animated ? 'slide' : 'none');
            StatusBar.setBarStyle(statusBarConfig.barStyle, animated);

            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(backgroundColor, animated);
                StatusBar.setTranslucent(translucent);
            }
        }

        // Cleanup function to reset status bar when component unmounts
        return () => {
            if (hidden) {
                StatusBar.setHidden(false, false);
            }
        };
    }, [
        statusBarConfig.barStyle,
        backgroundColor,
        translucent,
        hidden,
        animated
    ]);

    return statusBarConfig;
};

export default useStatusBar; 