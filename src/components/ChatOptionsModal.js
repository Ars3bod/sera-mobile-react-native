import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Easing,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
    Bot24Regular,
    PersonChat24Regular,
    Dismiss24Regular,
    ChevronRight24Regular,
} from '@fluentui/react-native-icons';

const ChatOptionsModal = ({ visible, onClose, onSelectChatbot, onSelectLiveChat }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isRTL = i18n.language === 'ar';
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const backdropAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            // Animate in
            Animated.parallel([
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
                Animated.spring(slideAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
            ]).start();
        } else {
            // Animate out
            Animated.parallel([
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.ease),
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.ease),
                }),
            ]).start();
        }
    }, [visible]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [600, 0],
    });

    const backdropOpacity = backdropAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });

    const dynamicStyles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        modalContainer: {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 8,
            paddingBottom: 40,
            ...theme.shadows.large,
        },
        handle: {
            width: 40,
            height: 4,
            backgroundColor: theme.colors.border,
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20,
        },
        header: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            flex: 1,
        },
        closeButton: {
            padding: 4,
        },
        content: {
            paddingHorizontal: 20,
            paddingTop: 20,
        },
        optionCard: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...theme.shadows.small,
        },
        iconContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: isRTL ? 0 : 16,
            marginLeft: isRTL ? 16 : 0,
        },
        optionContent: {
            flex: 1,
        },
        optionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 4,
        },
        optionDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
            lineHeight: 20,
        },
        chevronIcon: {
            width: 24,
            height: 24,
            color: theme.colors.textSecondary,
            transform: [{ scaleX: isRTL ? -1 : 1 }],
        },
    });

    if (!visible) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}>
            <Animated.View
                style={[
                    dynamicStyles.modalOverlay,
                    {
                        backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
                    },
                ]}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View
                    style={[
                        dynamicStyles.modalContainer,
                        {
                            transform: [{ translateY }],
                        },
                    ]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => { }}>
                        {/* Handle Bar */}
                        <View style={dynamicStyles.handle} />

                        {/* Header */}
                        <View style={dynamicStyles.header}>
                            <Text style={dynamicStyles.headerTitle}>
                                {t('chat.options.title')}
                            </Text>
                            <TouchableOpacity
                                style={dynamicStyles.closeButton}
                                onPress={onClose}
                                activeOpacity={0.7}>
                                <Dismiss24Regular
                                    style={{
                                        width: 24,
                                        height: 24,
                                        color: theme.colors.textSecondary,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View style={dynamicStyles.content}>
                            {/* Chatbot Option */}
                            {/* <TouchableOpacity
                                style={dynamicStyles.optionCard}
                                onPress={onSelectChatbot}
                                activeOpacity={0.7}>
                                <View
                                    style={[
                                        dynamicStyles.iconContainer,
                                        { backgroundColor: `${theme.colors.primary}15` },
                                    ]}>
                                    <Bot24Regular
                                        style={{
                                            width: 32,
                                            height: 32,
                                            color: theme.colors.primary,
                                        }}
                                    />
                                </View>
                                <View style={dynamicStyles.optionContent}>
                                    <Text style={dynamicStyles.optionTitle}>
                                        {t('chat.options.chatbot.title')}
                                    </Text>
                                    <Text style={dynamicStyles.optionDescription}>
                                        {t('chat.options.chatbot.description')}
                                    </Text>
                                </View>
                                <ChevronRight24Regular style={dynamicStyles.chevronIcon} />
                            </TouchableOpacity> */}

                            {/* Live Chat Option */}
                            <TouchableOpacity
                                style={dynamicStyles.optionCard}
                                onPress={onSelectLiveChat}
                                activeOpacity={0.7}>
                                <View
                                    style={[
                                        dynamicStyles.iconContainer,
                                        { backgroundColor: `${theme.colors.primary}15` },
                                    ]}>
                                    <PersonChat24Regular
                                        style={{
                                            width: 32,
                                            height: 32,
                                            color: theme.colors.primary,
                                        }}
                                    />
                                </View>
                                <View style={dynamicStyles.optionContent}>
                                    <Text style={dynamicStyles.optionTitle}>
                                        {t('chat.options.liveChat.title')}
                                    </Text>
                                    <Text style={dynamicStyles.optionDescription}>
                                        {t('chat.options.liveChat.description')}
                                    </Text>
                                </View>
                                <ChevronRight24Regular style={dynamicStyles.chevronIcon} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default ChatOptionsModal;

