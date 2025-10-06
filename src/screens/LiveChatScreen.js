import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { SafeContainer, LoadingIndicator, ActionToast } from '../components';
import { ChevronLeft24Regular, ChevronRight24Regular, Send24Regular } from '@fluentui/react-native-icons';
import genesysChatService from '../services/genesysChatService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LiveChatScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { user } = useUser();
    const isRTL = i18n.language === 'ar';
    const insets = useSafeAreaInsets();

    // State management
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [agentTyping, setAgentTyping] = useState(false);
    const [chatStatus, setChatStatus] = useState('connecting'); // connecting, connected, ended, error
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const scrollViewRef = useRef(null);
    const messageInputRef = useRef(null);

    // Initialize chat on component mount
    useEffect(() => {
        initializeChat();

        return () => {
            // Cleanup on unmount
            genesysChatService.endChat();
        };
    }, []);

    const initializeChat = async () => {
        try {
            setLoading(true);
            setError(false);
            setChatStatus('connecting');

            // Prepare user info
            const userInfo = {
                firstName: user?.arFullName?.split(' ')[0] || user?.enFullName?.split(' ')[0] || 'مستخدم',
                lastName: user?.arFullName?.split(' ').slice(1).join(' ') || user?.enFullName?.split(' ').slice(1).join(' ') || '',
                email: user?.email || '',
                language: i18n.language
            };

            const result = await genesysChatService.initializeChat(userInfo);

            if (result.success) {
                setMessages(result.messages || []);
                setIsConnected(true);
                setChatStatus('connected');

                // Start polling for messages
                genesysChatService.startPolling(
                    handleNewMessage,
                    handleChatStatusChange
                );

                // Scroll to bottom
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            } else {
                throw new Error(result.error || 'Failed to initialize chat');
            }
        } catch (error) {
            console.error('Chat initialization error:', error);
            setError(true);
            setChatStatus('error');
            setErrorMessage(t('chat.error.connectionFailed'));
            setShowErrorDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const handleNewMessage = (message) => {
        console.log('New message received:', message);

        setMessages(prevMessages => {
            const newMessages = [...prevMessages];

            // Check if message already exists (prevent duplicates)
            const existingIndex = newMessages.findIndex(msg =>
                msg.index === message.index &&
                msg.utcTime === message.utcTime &&
                msg.type === message.type
            );

            if (existingIndex === -1) {
                newMessages.push(message);
                console.log('Added new message to UI:', {
                    index: message.index,
                    type: message.type,
                    from: message.from?.type,
                    text: message.text?.substring(0, 30) + '...'
                });
            } else {
                console.log('Message already exists, skipping:', message.index);
            }

            return newMessages;
        });

        // Handle typing indicators
        if (message.type === 'TypingStarted') {
            if (message.from.type === 'Agent') {
                setAgentTyping(true);
                console.log('Agent started typing');
            }
        } else if (message.type === 'Message') {
            setAgentTyping(false);
            console.log('Agent message received:', message.text?.substring(0, 30) + '...');
        }

        // Scroll to bottom
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const handleChatStatusChange = (status, errorMessage) => {
        console.log('Chat status changed:', status);

        switch (status) {
            case 'chatEnded':
                setChatStatus('ended');
                setIsConnected(false);
                genesysChatService.stopPolling();
                break;
            case 'error':
                setChatStatus('error');
                setError(true);
                if (errorMessage) {
                    setErrorMessage(errorMessage);
                    setShowErrorDialog(true);
                }
                break;
        }
    };

    const sendMessage = async () => {
        if (!messageText.trim() || !isConnected) {
            return;
        }

        const messageToSend = messageText.trim();
        setMessageText('');

        try {
            // Send message to server first
            await genesysChatService.sendMessage(messageToSend);

            // Don't add message to UI here - let the polling handle it
            // This prevents duplicate messages

        } catch (error) {
            console.error('Error sending message:', error);
            setErrorMessage(t('chat.error.sendFailed'));
            setShowErrorDialog(true);
        }
    };

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    const handleBackPress = () => {
        if (isConnected) {
            setShowExitDialog(true);
        } else {
            navigation.goBack();
        }
    };

    const handleExitChat = () => {
        genesysChatService.endChat();
        navigation.goBack();
    };

    const retryConnection = () => {
        setError(false);
        initializeChat();
    };

    const renderMessage = (message, index) => {
        const isUser = message.from.type === 'Client';
        const isAgent = message.from.type === 'Agent';
        const isSystem = message.type === 'ParticipantJoined';

        if (isSystem) {
            return (
                <View key={index} style={dynamicStyles.systemMessageContainer}>
                    <Text style={dynamicStyles.systemMessage}>
                        {isUser ? t('chat.messages.userJoined') : t('chat.messages.agentJoined')}
                    </Text>
                </View>
            );
        }

        if (message.type === 'Message') {
            return (
                <View key={index} style={[
                    dynamicStyles.messageContainer,
                    isUser ? dynamicStyles.userMessageContainer : dynamicStyles.agentMessageContainer
                ]}>
                    <View style={[
                        dynamicStyles.messageBubble,
                        isUser ? dynamicStyles.userMessageBubble : dynamicStyles.agentMessageBubble
                    ]}>
                        <Text style={[
                            dynamicStyles.messageText,
                            isUser ? dynamicStyles.userMessageText : dynamicStyles.agentMessageText
                        ]}>
                            {message.text}
                        </Text>
                    </View>
                    <Text style={[
                        dynamicStyles.messageTime,
                        isUser ? dynamicStyles.userMessageTime : dynamicStyles.agentMessageTime
                    ]}>
                        {new Date(message.utcTime).toLocaleTimeString(i18n.language, {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            );
        }

        return null;
    };

    const renderTypingIndicator = () => {
        if (!agentTyping) return null;

        return (
            <View style={dynamicStyles.typingContainer}>
                <View style={dynamicStyles.typingBubble}>
                    <Text style={dynamicStyles.typingText}>
                        {t('chat.typing')}
                    </Text>
                </View>
            </View>
        );
    };

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            ...theme.shadows.small,
        },
        backButton: {
            padding: 8,
            borderRadius: 8,
        },
        backIcon: {
            width: 24,
            height: 24,
            color: theme.colors.primary,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.primary,
            textAlign: 'center',
            flex: 1,
        },
        statusIndicator: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: chatStatus === 'connected' ? '#4CAF50' :
                chatStatus === 'connecting' ? '#FF9800' : '#F44336',
        },
        placeholderView: {
            width: 40,
        },
        messagesContainer: {
            flex: 1,
            paddingHorizontal: 16,
        },
        messageContainer: {
            marginVertical: 4,
        },
        userMessageContainer: {
            alignItems: 'flex-end',
        },
        agentMessageContainer: {
            alignItems: 'flex-start',
        },
        messageBubble: {
            maxWidth: '80%',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
        },
        userMessageBubble: {
            backgroundColor: theme.colors.primary,
            borderBottomRightRadius: 4,
        },
        agentMessageBubble: {
            backgroundColor: theme.colors.surface,
            borderBottomLeftRadius: 4,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        messageText: {
            fontSize: 16,
            lineHeight: 20,
        },
        userMessageText: {
            color: '#FFFFFF',
        },
        agentMessageText: {
            color: theme.colors.text,
        },
        messageTime: {
            fontSize: 12,
            marginTop: 4,
            marginHorizontal: 16,
        },
        userMessageTime: {
            color: theme.colors.textSecondary,
            textAlign: 'right',
        },
        agentMessageTime: {
            color: theme.colors.textSecondary,
            textAlign: 'left',
        },
        systemMessageContainer: {
            alignItems: 'center',
            marginVertical: 8,
        },
        systemMessage: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        typingContainer: {
            alignItems: 'flex-start',
            marginVertical: 4,
        },
        typingBubble: {
            backgroundColor: theme.colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
            borderBottomLeftRadius: 4,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        typingText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            fontStyle: 'italic',
        },
        inputContainer: {
            flexDirection: isRTL ? 'row' : 'row', // Always use 'row' to keep send button on right
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 12), // Use safe area bottom or minimum 12
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            ...theme.shadows.small, // Add subtle shadow
        },
        messageInput: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
            marginRight: 8, // Only right margin since send button is always on right
            textAlign: isRTL ? 'right' : 'left',
        },
        sendButton: {
            backgroundColor: theme.colors.primary,
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
        },
        sendIcon: {
            width: 20,
            height: 20,
            color: '#FFFFFF',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        loadingText: {
            marginTop: 12,
            fontSize: 16,
            color: theme.colors.textSecondary,
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: theme.colors.background,
        },
        errorText: {
            fontSize: 16,
            color: theme.colors.error,
            textAlign: 'center',
            marginBottom: 20,
        },
        retryButton: {
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
        },
        retryButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
    });

    const BackIcon = isRTL ? ChevronRight24Regular : ChevronLeft24Regular;

    if (loading) {
        return (
            <SafeContainer>
                <View style={dynamicStyles.container}>
                    <View style={dynamicStyles.header}>
                        <TouchableOpacity
                            style={dynamicStyles.backButton}
                            onPress={handleBackPress}
                            activeOpacity={0.7}>
                            <BackIcon style={dynamicStyles.backIcon} />
                        </TouchableOpacity>
                        <Text style={dynamicStyles.headerTitle}>
                            {t('chat.options.liveChat.title')}
                        </Text>
                        <View style={dynamicStyles.placeholderView} />
                    </View>
                    <View style={dynamicStyles.loadingContainer}>
                        <LoadingIndicator
                            size="large"
                            color={theme.colors.primary}
                        />
                        <Text style={dynamicStyles.loadingText}>
                            {t('chat.connecting')}
                        </Text>
                    </View>
                </View>
            </SafeContainer>
        );
    }

    if (error) {
        return (
            <SafeContainer>
                <View style={dynamicStyles.container}>
                    <View style={dynamicStyles.header}>
                        <TouchableOpacity
                            style={dynamicStyles.backButton}
                            onPress={handleBackPress}
                            activeOpacity={0.7}>
                            <BackIcon style={dynamicStyles.backIcon} />
                        </TouchableOpacity>
                        <Text style={dynamicStyles.headerTitle}>
                            {t('chat.options.liveChat.title')}
                        </Text>
                        <View style={dynamicStyles.placeholderView} />
                    </View>
                    <View style={dynamicStyles.errorContainer}>
                        <Text style={dynamicStyles.errorText}>
                            {t('chat.error.connectionFailed')}
                        </Text>
                        <TouchableOpacity
                            style={dynamicStyles.retryButton}
                            onPress={retryConnection}
                            activeOpacity={0.7}>
                            <Text style={dynamicStyles.retryButtonText}>
                                {t('common.retry')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeContainer>
        );
    }

    return (
        <SafeContainer>
            <KeyboardAvoidingView
                style={dynamicStyles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>

                {/* Header */}
                <View style={dynamicStyles.header}>
                    <TouchableOpacity
                        style={dynamicStyles.backButton}
                        onPress={handleBackPress}
                        activeOpacity={0.7}>
                        <BackIcon style={dynamicStyles.backIcon} />
                    </TouchableOpacity>
                    <Text style={dynamicStyles.headerTitle}>
                        {t('chat.options.liveChat.title')}
                    </Text>
                    <View style={dynamicStyles.statusIndicator} />
                </View>

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={dynamicStyles.messagesContainer}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    showsVerticalScrollIndicator={false}>
                    {messages.map((message, index) => renderMessage(message, index))}
                    {renderTypingIndicator()}
                </ScrollView>

                {/* Input */}
                <View style={dynamicStyles.inputContainer}>
                    <TextInput
                        ref={messageInputRef}
                        style={dynamicStyles.messageInput}
                        value={messageText}
                        onChangeText={setMessageText}
                        placeholder={t('chat.input.placeholder')}
                        placeholderTextColor={theme.colors.textSecondary}
                        multiline
                        maxLength={1000}
                        editable={isConnected && chatStatus === 'connected'}
                    />
                    <TouchableOpacity
                        style={[
                            dynamicStyles.sendButton,
                            { opacity: messageText.trim() && isConnected ? 1 : 0.5 }
                        ]}
                        onPress={sendMessage}
                        disabled={!messageText.trim() || !isConnected}
                        activeOpacity={0.7}>
                        <Send24Regular style={dynamicStyles.sendIcon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Exit Chat Dialog */}
            <ActionToast
                visible={showExitDialog}
                title={t('chat.exit.title')}
                message={t('chat.exit.message')}
                confirmText={t('common.exit')}
                cancelText={t('common.cancel')}
                onConfirm={handleExitChat}
                onCancel={() => setShowExitDialog(false)}
                confirmButtonStyle="destructive"
            />

            {/* Error Dialog */}
            <ActionToast
                visible={showErrorDialog}
                title={t('chat.error.title')}
                message={errorMessage}
                confirmText={t('common.ok')}
                onConfirm={() => setShowErrorDialog(false)}
                showCancel={false}
            />
        </SafeContainer>
    );
};

export default LiveChatScreen;
