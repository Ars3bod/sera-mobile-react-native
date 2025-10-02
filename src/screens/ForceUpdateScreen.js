import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Platform,
    Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { SafeContainer } from '../components';
import { ArrowSync24Regular, Dismiss24Regular } from '@fluentui/react-native-icons';

const ForceUpdateScreen = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isRTL = i18n.language === 'ar';
    const versionInfo = route.params?.versionInfo;

    const handleUpdate = () => {
        const updateUrl = Platform.OS === 'ios'
            ? versionInfo.updateUrl.ios
            : versionInfo.updateUrl.android;

        Linking.openURL(updateUrl).catch(err => {
            console.error('Failed to open update URL:', err);
        });
    };

    const handleSkip = () => {
        if (versionInfo?.isOptional) {
            navigation.replace('Login');
        }
    };

    // Default message if versionInfo is missing
    if (!versionInfo) {
        return null;
    }

    const message = isRTL ? versionInfo.message.ar : versionInfo.message.en;

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        content: {
            alignItems: 'center',
            maxWidth: 400,
            width: '100%',
        },
        iconContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: `${theme.colors.primary}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 16,
        },
        message: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 12,
        },
        versionInfo: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: 40,
        },
        versionText: {
            fontWeight: '600',
            color: theme.colors.primary,
        },
        updateButton: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 40,
            borderRadius: 12,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 300,
            ...theme.shadows.medium,
        },
        updateButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '600',
            marginLeft: isRTL ? 0 : 12,
            marginRight: isRTL ? 12 : 0,
        },
        skipButton: {
            marginTop: 20,
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        skipButtonText: {
            color: theme.colors.textSecondary,
            fontSize: 16,
            textDecorationLine: 'underline',
        },
        badge: {
            position: 'absolute',
            top: -5,
            right: isRTL ? 'auto' : -5,
            left: isRTL ? -5 : 'auto',
            backgroundColor: theme.colors.error,
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        badgeText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
        },
        featuresList: {
            marginTop: 30,
            marginBottom: 20,
            width: '100%',
        },
        featureItem: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            marginBottom: 12,
            paddingHorizontal: 20,
        },
        featureBullet: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary,
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0,
        },
        featureText: {
            fontSize: 14,
            color: theme.colors.text,
            flex: 1,
            textAlign: isRTL ? 'right' : 'left',
        },
    });

    return (
        <SafeContainer>
            <View style={dynamicStyles.container}>
                <View style={dynamicStyles.content}>
                    {/* Icon with badge */}
                    <View style={dynamicStyles.iconContainer}>
                        <ArrowSync24Regular
                            style={{
                                width: 60,
                                height: 60,
                                color: theme.colors.primary,
                            }}
                        />
                        {!versionInfo.isOptional && (
                            <View style={dynamicStyles.badge}>
                                <Text style={dynamicStyles.badgeText}>
                                    {isRTL ? 'مطلوب' : 'Required'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Title */}
                    <Text style={dynamicStyles.title}>
                        {isRTL ? 'تحديث مطلوب' : 'Update Required'}
                    </Text>

                    {/* Message */}
                    <Text style={dynamicStyles.message}>
                        {message}
                    </Text>

                    {/* Version info */}
                    <Text style={dynamicStyles.versionInfo}>
                        {isRTL ? 'الإصدار الحالي: ' : 'Current version: '}
                        <Text style={dynamicStyles.versionText}>{versionInfo.currentVersion}</Text>
                        {'\n'}
                        {isRTL ? 'الإصدار المطلوب: ' : 'Required version: '}
                        <Text style={dynamicStyles.versionText}>{versionInfo.minVersion}</Text>
                    </Text>

                    {/* Features list (optional) */}
                    {versionInfo.features && versionInfo.features.length > 0 && (
                        <View style={dynamicStyles.featuresList}>
                            <Text style={[dynamicStyles.message, { marginBottom: 16, fontWeight: '600' }]}>
                                {isRTL ? 'ما الجديد:' : 'What\'s New:'}
                            </Text>
                            {versionInfo.features.map((feature, index) => (
                                <View key={index} style={dynamicStyles.featureItem}>
                                    <View style={dynamicStyles.featureBullet} />
                                    <Text style={dynamicStyles.featureText}>
                                        {isRTL ? feature.ar : feature.en}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Update button */}
                    <TouchableOpacity
                        style={dynamicStyles.updateButton}
                        onPress={handleUpdate}
                        activeOpacity={0.8}>
                        <ArrowSync24Regular
                            style={{
                                width: 24,
                                height: 24,
                                color: '#FFFFFF',
                            }}
                        />
                        <Text style={dynamicStyles.updateButtonText}>
                            {isRTL ? 'تحديث الآن' : 'Update Now'}
                        </Text>
                    </TouchableOpacity>

                    {/* Skip button (only if optional) */}
                    {versionInfo.isOptional && (
                        <TouchableOpacity
                            style={dynamicStyles.skipButton}
                            onPress={handleSkip}
                            activeOpacity={0.7}>
                            <Text style={dynamicStyles.skipButtonText}>
                                {isRTL ? 'تخطي الآن' : 'Skip for now'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeContainer>
    );
};

export default ForceUpdateScreen;

