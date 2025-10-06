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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

const ChatbotScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { user } = useUser();
    const isRTL = i18n.language === 'ar';
    const insets = useSafeAreaInsets();

    // State management
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const scrollViewRef = useRef(null);
    const messageInputRef = useRef(null);

    // Chatbot API configuration
    const CHATBOT_API_URL = 'https://sera-api.masdr.live/api/v1/chat';

    // Initialize with welcome message
    useEffect(() => {
        const welcomeMessage = {
            id: Date.now(),
            text: isRTL ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟' : 'Hello! How can I assist you today?',
            type: 'Message',
            from: {
                nickname: isRTL ? 'المساعد الذكي' : 'AI Assistant',
                participantId: 1,
                type: 'Agent'
            },
            utcTime: Date.now()
        };
        setMessages([welcomeMessage]);
    }, [isRTL]);

    const sendMessage = async () => {
        if (!messageText.trim()) {
            return;
        }

        const messageToSend = messageText.trim();
        setMessageText('');

        try {
            // Add user message to UI immediately
            const userMessage = {
                id: Date.now(),
                text: messageToSend,
                type: 'Message',
                from: {
                    nickname: `${user?.arFullName || user?.enFullName || 'مستخدم'}`,
                    participantId: 1,
                    type: 'Client'
                },
                utcTime: Date.now()
            };

            setMessages(prevMessages => [...prevMessages, userMessage]);
            scrollToBottom();

            // Show typing indicator
            setIsTyping(true);

            // Send to chatbot API
            console.log('🤖 SENDING TO CHATBOT API:');
            console.log('URL:', CHATBOT_API_URL);
            console.log('Payload:', { question: messageToSend });

            const response = await axios.post(CHATBOT_API_URL, {
                question: messageToSend
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            console.log('✅ CHATBOT API RESPONSE:');
            console.log('Status:', response.status);
            console.log('Data:', JSON.stringify(response.data, null, 2));

            // Hide typing indicator
            setIsTyping(false);

            // Add bot response to UI
            if (response.data && response.data.answer) {
                const botMessage = {
                    id: response.data.msg_id || Date.now(),
                    text: response.data.answer.text || 'Sorry, I could not process your request.',
                    type: 'Message',
                    from: {
                        nickname: isRTL ? 'المساعد الذكي' : 'AI Assistant',
                        participantId: 1,
                        type: 'Agent'
                    },
                    utcTime: Date.now(),
                    sessionId: response.data.answer.session_id,
                    responseCategory: response.data.answer.response_category
                };

                setMessages(prevMessages => [...prevMessages, botMessage]);
                scrollToBottom();
            } else {
                throw new Error('Invalid response from chatbot API');
            }

        } catch (error) {
            console.error('❌ CHATBOT API ERROR:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            setIsTyping(false);
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
        navigation.goBack();
    };

    const renderMessage = (message, index) => {
        const isUser = message.from.type === 'Client';
        const isAgent = message.from.type === 'Agent';

        return (
            <View key={message.id || index} style={[
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
    };

    const renderTypingIndicator = () => {
        if (!isTyping) return null;

        return (
            <View style={dynamicStyles.typingContainer}>
                <View style={dynamicStyles.typingBubble}>
                    <Text style={dynamicStyles.typingText}>
                        {isRTL ? 'المساعد الذكي يكتب...' : 'AI Assistant is typing...'}
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
    });

    const BackIcon = isRTL ? ChevronRight24Regular : ChevronLeft24Regular;

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
                        {t('chat.options.chatbot.title')}
                    </Text>
                    <View style={dynamicStyles.placeholderView} />
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
                        editable={!isTyping}
                    />
                    <TouchableOpacity
                        style={[
                            dynamicStyles.sendButton,
                            { opacity: messageText.trim() && !isTyping ? 1 : 0.5 }
                        ]}
                        onPress={sendMessage}
                        disabled={!messageText.trim() || isTyping}
                        activeOpacity={0.7}>
                        <Send24Regular style={dynamicStyles.sendIcon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

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

export default ChatbotScreen;

