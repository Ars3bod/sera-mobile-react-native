import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

const ActionToast = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    type = 'info',
}) => {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Fade in
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Fade out
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return '#4CAF50';
            case 'error':
                return '#F44336';
            case 'warning':
                return '#FF9800';
            case 'info':
                return theme.colors.primary;
            default:
                return theme.colors.primary;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return '📄';
            default:
                return '📄';
        }
    };

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <Animated.View
                style={[
                    styles.backdrop,
                    { opacity: opacityAnim }
                ]}
            />
            <SafeAreaView style={styles.container}>
                <Animated.View
                    style={[
                        styles.toast,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    {/* Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        {/* <Text style={[styles.icon, { color: getIconColor() }]}>
                            {getIcon()}
                        </Text> */}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {title && (
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        color: theme.colors.text,
                                        textAlign: isRTL ? 'right' : 'left'
                                    }
                                ]}
                            >
                                {title}
                            </Text>
                        )}
                        <Text
                            style={[
                                styles.message,
                                {
                                    color: theme.colors.textSecondary,
                                    textAlign: isRTL ? 'right' : 'left'
                                }
                            ]}
                        >
                            {message}
                        </Text>
                    </View>

                    {/* Actions */}
                    <View style={[
                        styles.actions,
                        { flexDirection: isRTL ? 'row-reverse' : 'row' }
                    ]}>
                        {/* In RTL, render confirm button first so it appears on the right */}
                        {isRTL ? (
                            <>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.confirmButton,
                                        {
                                            backgroundColor: theme.colors.primary,
                                            marginLeft: 12,
                                        }
                                    ]}
                                    onPress={handleConfirm}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        {confirmText || t('common.ok')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.cancelButton,
                                        {
                                            borderColor: theme.colors.border,
                                        }
                                    ]}
                                    onPress={handleCancel}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                                        {cancelText || t('common.cancel')}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.cancelButton,
                                        {
                                            borderColor: theme.colors.border,
                                            marginRight: 12,
                                        }
                                    ]}
                                    onPress={handleCancel}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                                        {cancelText || t('common.cancel')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.confirmButton,
                                        { backgroundColor: theme.colors.primary }
                                    ]}
                                    onPress={handleConfirm}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        {confirmText || t('common.ok')}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    toast: {
        width: screenWidth - 32,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        marginBottom: 8,
    },
    icon: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 24,
    },
    message: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 20,
    },
    actions: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    confirmButton: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default ActionToast; 