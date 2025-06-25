import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useStatusBar from '../hooks/useStatusBar';

/**
 * SafeContainer Component
 * 
 * A cross-platform container that properly handles status bar spacing and safe areas.
 * On iOS, it uses SafeAreaView which automatically handles safe areas.
 * On Android, it adds manual padding for the status bar height and safe areas.
 * 
 * Props:
 * - style: Custom styles to apply to the container
 * - edges: Safe area edges to apply - defaults to ['top']
 * - children: Child components
 * - backgroundColor: Background color for the container
 * - statusBarStyle: Status bar style ('light-content' | 'dark-content' | 'auto')
 * - statusBarBackgroundColor: Status bar background color (Android only)
 * - disableStatusBarManagement: Disable automatic status bar management
 */
const SafeContainer = ({
    children,
    style = {},
    edges = ['top'],
    backgroundColor,
    statusBarStyle = 'auto',
    statusBarBackgroundColor,
    disableStatusBarManagement = false,
    ...props
}) => {

    // Use safe area insets for more accurate measurements
    const insets = useSafeAreaInsets();

    // Use status bar hook for automatic management
    const statusBarConfig = useStatusBar({
        style: statusBarStyle,
        backgroundColor: statusBarBackgroundColor,
        translucent: false,
    });

    // Get status bar height for Android
    const getStatusBarHeight = () => {
        if (Platform.OS === 'android') {
            // Use insets.top if available, otherwise fall back to StatusBar.currentHeight
            return insets.top || StatusBar.currentHeight || 24;
        }
        return 0; // iOS handles this automatically via SafeAreaView
    };

    // Calculate safe area padding for Android
    const getSafeAreaPadding = () => {
        if (Platform.OS === 'android') {
            return {
                paddingTop: edges.includes('top') ? getStatusBarHeight() : 0,
                paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
                paddingLeft: edges.includes('left') ? insets.left : 0,
                paddingRight: edges.includes('right') ? insets.right : 0,
            };
        }
        return {};
    };

    // Container styles
    const containerStyle = [
        {
            flex: 1,
            backgroundColor: backgroundColor,
        },
        Platform.OS === 'android' && getSafeAreaPadding(),
        style,
    ];

    if (Platform.OS === 'ios') {
        // On iOS, use SafeAreaView which automatically handles safe areas
        return (
            <SafeAreaView style={containerStyle} edges={edges} {...props}>
                {!disableStatusBarManagement && (
                    <StatusBar
                        barStyle={statusBarConfig.barStyle}
                        backgroundColor={statusBarConfig.backgroundColor}
                    />
                )}
                {children}
            </SafeAreaView>
        );
    } else {
        // On Android, use regular View with manual safe area padding
        return (
            <View style={containerStyle} {...props}>
                {!disableStatusBarManagement && (
                    <StatusBar
                        barStyle={statusBarConfig.barStyle}
                        backgroundColor={statusBarConfig.backgroundColor}
                        translucent={false} // Prevent status bar from overlaying content
                    />
                )}
                {children}
            </View>
        );
    }
};

export default SafeContainer; 