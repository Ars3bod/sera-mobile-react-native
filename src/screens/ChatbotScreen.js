import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { SafeContainer, LoadingIndicator } from '../components';
import { ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-native-icons';

const ChatbotScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { user } = useUser();
    const isRTL = i18n.language === 'ar';
    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // HTML content with Masdr Digital Human chatbot
    const htmlContent = `
        <!DOCTYPE html>
        <html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${i18n.language}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <title>SERA Chatbot</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                html, body { 
                    margin: 0; 
                    padding: 0; 
                    height: 100%;
                    width: 100%;
                    overflow: auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                #chatbot-container { 
                    display: block;
                    height: 100%;
                    width: 100%;
                    position: relative;
                }
                masdr-digital-human { 
                    display: block !important;
                    height: 100% !important; 
                    width: 100% !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    background: white;
                }
                #fallback-message {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 20px;
                    color: white;
                    text-align: center;
                }
                .fallback-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                }
                .fallback-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .fallback-text {
                    font-size: 16px;
                    line-height: 1.5;
                    opacity: 0.9;
                }
            </style>
        </head>
        <body>
            <div id="chatbot-container">
                <masdr-digital-human 
                    dir="${isRTL ? 'rtl' : 'ltr'}" 
                    charactersonly="true"
                ></masdr-digital-human>
                
                <div id="fallback-message">
                    <div class="fallback-icon">🤖</div>
                    <div class="fallback-title">${isRTL ? 'جاري تحميل المساعد الذكي...' : 'Loading AI Assistant...'}</div>
                    <div class="fallback-text">${isRTL ? 'يرجى الانتظار بينما نقوم بتحميل المساعد الذكي' : 'Please wait while we load the AI assistant'}</div>
                </div>
            </div>
            
            <script>
                // Global configuration
                window.__SERA_BASE__ = 'https://sera-chatwidget.masdr.live/v1';
                window.isArabic = ${isRTL};
                window.userInfo = {
                    name: '${user?.arFullName || user?.enFullName || ''}',
                    id: '${user?.nationalId || user?.id || ''}',
                    language: '${i18n.language}'
                };
                
                // Load Masdr chatbot widget
                function loadMasdrChatbot() {
                    console.log('Loading Masdr chatbot scripts...');
                    
                    // Load CSS
                    const css = document.createElement('link');
                    css.rel = 'stylesheet';
                    css.href = 'https://sera-chatwidget.masdr.live/v1/styles.css';
                    css.onerror = () => {
                        console.error('Failed to load Masdr CSS');
                        sendMessageToRN('chatbot_error', { message: 'Failed to load chatbot styles' });
                    };
                    document.head.appendChild(css);
                    
                    // Load main script
                    const script = document.createElement('script');
                    script.src = 'https://sera-chatwidget.masdr.live/v1/main.js';
                    script.onload = () => {
                        console.log('Masdr chatbot script loaded successfully');
                        
                        // Check if widget initialized
                        setTimeout(() => {
                            const element = document.querySelector('masdr-digital-human');
                            const fallback = document.getElementById('fallback-message');
                            
                            console.log('Checking Masdr element...');
                            console.log('Element:', element);
                            console.log('Has content:', element && (element.children.length > 0 || element.shadowRoot));
                            
                            if (element && (element.children.length > 0 || element.shadowRoot)) {
                                // Widget loaded successfully, hide fallback
                                if (fallback) fallback.style.display = 'none';
                                sendMessageToRN('chatbot_loaded', { success: true, widgetInitialized: true });
                            } else {
                                // Widget not initialized, show error in fallback
                                if (fallback) {
                                    fallback.innerHTML = '<div class="fallback-icon">🤖</div>' +
                                        '<div class="fallback-title">${isRTL ? 'المساعد الذكي' : 'AI Chatbot'}</div>' +
                                        '<div class="fallback-text" style="max-width: 300px;">${isRTL ? 'خدمة المساعد الذكي قيد التطوير. يرجى استخدام المحادثة المباشرة للتواصل مع فريق الدعم.' : 'The AI Chatbot service is under development. Please use Live Chat to connect with our support team.'}</div>' +
                                        '<div style="margin-top: 20px; font-size: 14px; opacity: 0.7;">${isRTL ? 'للمطورين: يرجى التأكد من تكوين خدمة Masdr بشكل صحيح' : 'For developers: Please ensure Masdr service is properly configured'}</div>';
                                }
                                sendMessageToRN('chatbot_error', { 
                                    message: 'Chatbot widget not initialized',
                                    elementFound: !!element,
                                    hasContent: element ? (element.children.length > 0 || !!element.shadowRoot) : false
                                });
                            }
                        }, 2000);
                    };
                    script.onerror = () => {
                        console.error('Failed to load Masdr chatbot script');
                        const fallback = document.getElementById('fallback-message');
                        if (fallback) {
                            fallback.innerHTML = '<div class="fallback-icon">❌</div>' +
                                '<div class="fallback-title">${isRTL ? 'فشل تحميل المساعد الذكي' : 'Failed to load AI Assistant'}</div>' +
                                '<div class="fallback-text">${isRTL ? 'يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى' : 'Please check your internet connection and try again'}</div>';
                        }
                        sendMessageToRN('chatbot_error', { message: 'Failed to load chatbot script' });
                    };
                    document.head.appendChild(script);
                }
                
                // Communication with React Native
                function sendMessageToRN(type, data) {
                    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: type,
                            data: data,
                            timestamp: Date.now()
                        }));
                    }
                }
                
                // Notify React Native when ready
                document.addEventListener('DOMContentLoaded', () => {
                    loadMasdrChatbot();
                    sendMessageToRN('webview_ready', { 
                        chatbot: 'masdr',
                        language: '${i18n.language}',
                        userInfo: window.userInfo
                    });
                });
                
                // Listen for errors
                window.addEventListener('error', (event) => {
                    sendMessageToRN('chatbot_error', {
                        message: event.message,
                        filename: event.filename,
                        lineno: event.lineno
                    });
                });
            </script>
        </body>
        </html>
    `;

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('Message from chatbot webview:', data);

            switch (data.type) {
                case 'webview_ready':
                    console.log('Chatbot webview is ready');
                    setLoading(false);
                    break;
                case 'chatbot_loaded':
                    console.log('Chatbot loaded successfully', data.data);
                    console.log('Iframe loaded:', data.data?.iframeLoaded);
                    console.log('URL:', data.data?.url);
                    setLoading(false);
                    break;
                case 'iframe_message':
                    console.log('Message from iframe:', data.data);
                    break;
                case 'chatbot_error':
                    console.error('Chatbot error:', data.data);
                    setError(true);
                    setLoading(false);
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing webview message:', error);
        }
    };

    const handleWebViewError = () => {
        setError(true);
        setLoading(false);
    };

    const handleRetry = () => {
        setError(false);
        setLoading(true);
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
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
        webViewContainer: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        loadingContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
        placeholderContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: theme.colors.background,
        },
        placeholderTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 12,
        },
        placeholderText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
        },
    });

    const BackIcon = isRTL ? ChevronRight24Regular : ChevronLeft24Regular;

    return (
        <SafeContainer>
            <View style={dynamicStyles.container}>
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

                {/* WebView */}
                {!error ? (
                    <View style={dynamicStyles.webViewContainer}>
                        <WebView
                            ref={webViewRef}
                            source={{ html: htmlContent, baseUrl: 'https://sera.gov.sa' }}
                            style={{ flex: 1, backgroundColor: theme.colors.background }}
                            onLoadStart={() => setLoading(true)}
                            onLoadEnd={() => setLoading(false)}
                            onError={handleWebViewError}
                            onHttpError={handleWebViewError}
                            onMessage={handleWebViewMessage}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            scalesPageToFit={true}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            allowFileAccess={true}
                            allowFileAccessFromFileURLs={true}
                            allowUniversalAccessFromFileURLs={true}
                            mixedContentMode="always"
                            originWhitelist={['*']}
                            setSupportMultipleWindows={false}
                        />
                        {loading && (
                            <View style={dynamicStyles.loadingContainer}>
                                <LoadingIndicator
                                    size="large"
                                    color={theme.colors.primary}
                                />
                                <Text style={dynamicStyles.loadingText}>
                                    {t('common.loading')}
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={dynamicStyles.errorContainer}>
                        <Text style={dynamicStyles.errorText}>
                            {t('chat.webview.error')}
                        </Text>
                        <TouchableOpacity
                            style={dynamicStyles.retryButton}
                            onPress={handleRetry}
                            activeOpacity={0.7}>
                            <Text style={dynamicStyles.retryButtonText}>
                                {t('common.retry')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeContainer>
    );
};

export default ChatbotScreen;

