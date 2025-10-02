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
import { SafeContainer , LoadingIndicator } from '../components';
import { ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-native-icons';

const LiveChatScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { user } = useUser();
    const isRTL = i18n.language === 'ar';
    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const isArabic = i18n.language === 'ar';
    const langFolder = isArabic ? 'Ar' : 'En';

    // HTML content with Genesys chat widget
    const htmlContent = `
        <!DOCTYPE html>
        <html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${i18n.language}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <title>SERA Live Chat</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body { 
                    margin: 0; 
                    padding: 0; 
                    height: 100vh; 
                    width: 100vw;
                    overflow: auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background-color: ${theme.colors.background};
                }
                #genesys-chat-container { 
                    display: block;
                    height: 100vh; 
                    width: 100vw;
                }
            </style>
        </head>
        <body>
            <div id="genesys-chat-container"></div>
            
            <script>
                // Global configuration
                window.isArabic = ${isArabic};
                window.userInfo = {
                    name: '${user?.arFullName || user?.enFullName || ''}',
                    email: '${user?.email || ''}',
                    id: '${user?.nationalId || user?.id || ''}',
                    language: '${i18n.language}'
                };
                
                // Load Genesys chat widget scripts
                function loadGenesysChat() {
                    const langFolder = window.isArabic ? 'Ar' : 'En';
                    const baseUrl = 'https://sera.gov.sa/chatbot/' + langFolder;
                    
                    // Load CSS
                    const css = document.createElement('link');
                    css.rel = 'stylesheet';
                    css.href = baseUrl + '/widgets' + (window.isArabic ? 'Ar' : '') + '.min.css';
                    document.head.appendChild(css);
                    
                    // Load scripts in order
                    const scripts = [
                        baseUrl + '/cxbus.min.js',
                        baseUrl + '/chat_sidebtn' + (window.isArabic ? 'Ar' : '') + '.js',
                        baseUrl + '/widgets' + (window.isArabic ? 'Ar' : '') + '.min.js'
                    ];
                    
                    let loadedScripts = 0;
                    
                    function loadScript(index) {
                        if (index >= scripts.length) {
                            console.log('All Genesys scripts loaded successfully');
                            sendMessageToRN('genesys_loaded', { success: true });
                            return;
                        }
                        
                        const script = document.createElement('script');
                        script.src = scripts[index];
                        script.onload = () => {
                            console.log('Loaded script:', scripts[index]);
                            loadedScripts++;
                            loadScript(index + 1);
                        };
                        script.onerror = () => {
                            console.error('Failed to load script:', scripts[index]);
                            sendMessageToRN('genesys_error', { 
                                message: 'Failed to load script: ' + scripts[index]
                            });
                        };
                        document.head.appendChild(script);
                    }
                    
                    // Start loading scripts
                    loadScript(0);
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
                    loadGenesysChat();
                    sendMessageToRN('webview_ready', { 
                        widget: 'genesys',
                        language: '${i18n.language}',
                        userInfo: window.userInfo
                    });
                });
                
                // Listen for errors
                window.addEventListener('error', (event) => {
                    sendMessageToRN('genesys_error', {
                        message: event.message,
                        filename: event.filename,
                        lineno: event.lineno
                    });
                });
                
                // Listen for Genesys chat events
                window.addEventListener('CXBus', (event) => {
                    console.log('Genesys CXBus event:', event.detail);
                    sendMessageToRN('genesys_event', event.detail);
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
            console.log('Message from live chat webview:', data);

            switch (data.type) {
                case 'webview_ready':
                    console.log('Live chat webview is ready');
                    break;
                case 'genesys_loaded':
                    console.log('Genesys chat loaded successfully');
                    setLoading(false);
                    break;
                case 'genesys_error':
                    console.error('Genesys chat error:', data.data);
                    setError(true);
                    setLoading(false);
                    break;
                case 'genesys_event':
                    console.log('Genesys chat event:', data.data);
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
                        {t('chat.options.liveChat.title')}
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

export default LiveChatScreen;
