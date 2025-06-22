import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
    Person24Regular,
    Dismiss24Regular,
} from '@fluentui/react-native-icons';

const LoginRequiredModal = ({
    visible,
    onClose,
    onLogin,
    title,
    message
}) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isRTL = i18n.language === 'ar';

    const dynamicStyles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        modalContent: {
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            backgroundColor: theme.colors.surface,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
            direction: isRTL ? 'rtl' : 'ltr',
        },
        closeButton: {
            padding: 4,
            marginBottom: 16,
            alignSelf: isRTL ? 'flex-start' : 'flex-end',
        },
        closeIcon: {
            width: 20,
            height: 20,
            color: theme.colors.textSecondary,
        },
        modalIconContainer: {
            alignItems: 'center',
            marginBottom: 16,
        },
        modalIcon: {
            width: 48,
            height: 48,
            color: theme.colors.primary,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 12,
            color: theme.colors.text,
            textAlign: 'center',
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
        modalMessage: {
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 24,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
        modalButtons: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 12,
            justifyContent: 'space-between',
        },
        modalButton: {
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
        },
        cancelButton: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        loginButton: {
            backgroundColor: theme.colors.primary,
        },
        cancelButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.textSecondary,
            textAlign: 'center',
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
        loginButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
            textAlign: 'center',
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}>
            <TouchableOpacity
                style={dynamicStyles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}>
                <TouchableOpacity
                    style={dynamicStyles.modalContent}
                    activeOpacity={1}
                    onPress={() => { }}>
                    {/* Close Button */}
                    <TouchableOpacity
                        style={dynamicStyles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.7}>
                        <Dismiss24Regular style={dynamicStyles.closeIcon} />
                    </TouchableOpacity>

                    {/* Login Icon */}
                    <View style={dynamicStyles.modalIconContainer}>
                        <Person24Regular style={dynamicStyles.modalIcon} />
                    </View>

                    {/* Title */}
                    <Text style={dynamicStyles.modalTitle}>
                        {title || t('auth.loginRequired')}
                    </Text>

                    {/* Message */}
                    <Text style={dynamicStyles.modalMessage}>
                        {message || t('auth.loginRequiredMessage')}
                    </Text>

                    {/* Buttons */}
                    <View style={dynamicStyles.modalButtons}>
                        {isRTL ? (
                            // RTL: Login button first (right side), Cancel second (left side)
                            <>
                                <TouchableOpacity
                                    style={[dynamicStyles.modalButton, dynamicStyles.loginButton]}
                                    onPress={onLogin}
                                    activeOpacity={0.8}>
                                    <Text style={dynamicStyles.loginButtonText}>
                                        {t('auth.login')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
                                    onPress={onClose}
                                    activeOpacity={0.8}>
                                    <Text style={dynamicStyles.cancelButtonText}>
                                        {t('auth.cancel')}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            // LTR: Cancel first (left side), Login second (right side)
                            <>
                                <TouchableOpacity
                                    style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
                                    onPress={onClose}
                                    activeOpacity={0.8}>
                                    <Text style={dynamicStyles.cancelButtonText}>
                                        {t('auth.cancel')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[dynamicStyles.modalButton, dynamicStyles.loginButton]}
                                    onPress={onLogin}
                                    activeOpacity={0.8}>
                                    <Text style={dynamicStyles.loginButtonText}>
                                        {t('auth.login')}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default LoginRequiredModal; 