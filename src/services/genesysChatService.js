/**
 * Genesys Chat Service
 * Handles native Genesys chat API integration
 */

import axios from 'axios';
import { Platform } from 'react-native';

class GenesysChatService {
    constructor() {
        this.baseURL = 'https://chatbot.sera.gov.sa:8443/genesys/2/chat/request-chat';
        this.chatId = null;
        this.alias = null;
        this.secureKey = null;
        this.userId = null;
        this.nextPosition = 0;
        this.pollingInterval = null;
        this.isPolling = false;
        this.onMessageCallback = null;
        this.onStatusCallback = null;
    }

    /**
     * Initialize chat session
     */
    async initializeChat(userInfo, subject = 'شكوى') {
        try {
            const payload = {
                alias: '', // Will be set by server
                secureKey: '', // Will be set by server
                userId: '', // Will be set by server
                nickname: `${userInfo.firstName} ${userInfo.lastName}`,
                firstName: userInfo.firstName || 'user first name',
                lastName: userInfo.lastName || 'user last name',
                emailAddress: userInfo.email || 'user@test.com',
                subject: subject,
                text: '',
                'userData[GCTI_LanguageCode]': userInfo.language || 'ar',
                'userData[_genesys_source]': 'mobile',
                'userData[_genesys_referrer]': '',
                'userData[_genesys_url]': 'https://sera.gov.sa/mobile',
                'userData[_genesys_pageTitle]': 'SERA Mobile App',
                'userData[_genesys_browser]': 'Chrome', //'SERA Mobile',
                'userData[_genesys_OS]': 'Windows', //Platform.OS === 'ios' ? 'iOS' : 'Android',
                'userData[_genesys_widgets]': '9.0.017.00'
            };

            console.log('🚀 INITIALIZE CHAT REQUEST:');
            console.log('URL:', this.baseURL);
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post(this.baseURL, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 10000
            });

            console.log('✅ INITIALIZE CHAT RESPONSE:');
            console.log('Status:', response.status);
            console.log('Headers:', response.headers);
            console.log('Data:', JSON.stringify(response.data, null, 2));

            if (response.data && response.data.statusCode === 0) {
                this.chatId = response.data.chatId;
                this.alias = response.data.alias;
                this.secureKey = response.data.secureKey;
                this.userId = response.data.userId;
                this.nextPosition = response.data.nextPosition;

                console.log('Chat initialized successfully:', {
                    chatId: this.chatId,
                    alias: this.alias,
                    userId: this.userId,
                    nextPosition: this.nextPosition
                });

                return {
                    success: true,
                    chatId: this.chatId,
                    messages: response.data.messages || []
                };
            } else {
                throw new Error('Failed to initialize chat');
            }
        } catch (error) {
            console.error('❌ INITIALIZE CHAT ERROR:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Start polling for new messages
     */
    startPolling(onMessage, onStatus) {
        if (this.isPolling) {
            return;
        }

        this.onMessageCallback = onMessage;
        this.onStatusCallback = onStatus;
        this.isPolling = true;

        // Poll every 2 seconds
        this.pollingInterval = setInterval(() => {
            this.refreshChat();
        }, 2000);

        console.log('Started polling for messages');
    }

    /**
     * Stop polling
     */
    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        this.isPolling = false;
        console.log('Stopped polling for messages');
    }

    /**
     * Refresh chat to get new messages
     */
    async refreshChat() {
        if (!this.chatId || !this.alias || !this.secureKey || !this.userId) {
            console.log('Missing chat session data, skipping refresh');
            return;
        }

        try {
            const payload = {
                alias: this.alias,
                secureKey: this.secureKey,
                userId: this.userId,
                transcriptPosition: Math.max(0, this.nextPosition - 1), // Ensure transcriptPosition is never negative
                message: ''
            };

            console.log('Refreshing chat with payload:', {
                chatId: this.chatId,
                transcriptPosition: payload.transcriptPosition,
                nextPosition: this.nextPosition
            });

            console.log('🔄 REFRESH CHAT REQUEST:');
            console.log('URL:', `${this.baseURL}/${this.chatId}/refresh`);
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${this.baseURL}/${this.chatId}/refresh`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    timeout: 5000
                }
            );

            console.log('✅ REFRESH CHAT RESPONSE:');
            console.log('Status:', response.status);
            console.log('Headers:', response.headers);
            console.log('Data:', JSON.stringify(response.data, null, 2));

            console.log('Refresh response:', {
                statusCode: response.data?.statusCode,
                messagesCount: response.data?.messages?.length || 0,
                nextPosition: response.data?.nextPosition,
                chatEnded: response.data?.chatEnded
            });

            if (response.data && response.data.statusCode === 0) {
                // Update nextPosition
                this.nextPosition = response.data.nextPosition;

                // Process new messages
                if (response.data.messages && response.data.messages.length > 0) {
                    console.log('Processing new messages:', response.data.messages);
                    response.data.messages.forEach(message => {
                        console.log('New message:', {
                            index: message.index,
                            type: message.type,
                            from: message.from?.type,
                            text: message.text?.substring(0, 50) + '...'
                        });
                        if (this.onMessageCallback) {
                            this.onMessageCallback(message);
                        }
                    });
                } else {
                    console.log('No new messages in this refresh');
                }

                // Check if chat ended
                if (response.data.chatEnded && this.onStatusCallback) {
                    console.log('Chat has ended');
                    this.onStatusCallback('chatEnded');
                }
            } else {
                console.warn('Refresh failed with status code:', response.data?.statusCode);
            }
        } catch (error) {
            console.error('❌ REFRESH CHAT ERROR:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            if (this.onStatusCallback) {
                this.onStatusCallback('error', error.message);
            }
        }
    }

    /**
     * Send a message
     */
    async sendMessage(messageText, messageType = 'text') {
        if (!this.chatId || !this.alias || !this.secureKey || !this.userId) {
            throw new Error('Chat not initialized');
        }

        try {
            const payload = {
                alias: this.alias,
                secureKey: this.secureKey,
                userId: this.userId,
                message: messageText,
                messageType: messageType
            };

            console.log('Sending message:', {
                chatId: this.chatId,
                message: messageText.substring(0, 50) + '...',
                messageType: messageType
            });

            console.log('📤 SEND MESSAGE REQUEST:');
            console.log('URL:', `${this.baseURL}/${this.chatId}/send`);
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${this.baseURL}/${this.chatId}/send`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    timeout: 10000
                }
            );

            console.log('✅ SEND MESSAGE RESPONSE:');
            console.log('Status:', response.status);
            console.log('Headers:', response.headers);
            console.log('Data:', JSON.stringify(response.data, null, 2));

            console.log('Send message response:', {
                statusCode: response.data?.statusCode,
                nextPosition: response.data?.nextPosition,
                messagesCount: response.data?.messages?.length || 0
            });

            if (response.data && response.data.statusCode === 0) {
                this.nextPosition = response.data.nextPosition;
                return {
                    success: true,
                    nextPosition: this.nextPosition
                };
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('❌ SEND MESSAGE ERROR:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            throw error;
        }
    }

    /**
     * Start typing indicator
     */
    async startTyping(messageText = '') {
        if (!this.chatId || !this.alias || !this.secureKey || !this.userId) {
            return;
        }

        try {
            const payload = {
                alias: this.alias,
                secureKey: this.secureKey,
                userId: this.userId,
                transcriptPosition: Math.max(0, this.nextPosition - 1), // Ensure transcriptPosition is never negative
                message: messageText
            };

            console.log('⌨️ START TYPING REQUEST:');
            console.log('URL:', `${this.baseURL}/${this.chatId}/startTyping`);
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${this.baseURL}/${this.chatId}/startTyping`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    timeout: 5000
                }
            );

            console.log('✅ START TYPING RESPONSE:');
            console.log('Status:', response.status);
            console.log('Headers:', response.headers);
            console.log('Data:', JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error('Error starting typing:', error);
        }
    }

    /**
     * End chat session
     */
    async endChat() {
        this.stopPolling();

        // Reset all session data
        this.chatId = null;
        this.alias = null;
        this.secureKey = null;
        this.userId = null;
        this.nextPosition = 0;
        this.onMessageCallback = null;
        this.onStatusCallback = null;

        console.log('Chat session ended');
    }

    /**
     * Debug method to check current session state
     */
    debugSessionState() {
        console.log('🔍 DEBUG SESSION STATE:');
        console.log('Chat ID:', this.chatId);
        console.log('Alias:', this.alias);
        console.log('Secure Key:', this.secureKey);
        console.log('User ID:', this.userId);
        console.log('Next Position:', this.nextPosition);
        console.log('Stuck Counter:', this.stuckCounter);
        console.log('Is Polling:', this.isPolling);
        console.log('Session Active:', !!this.chatId);
    }

    /**
     * Get current chat status
     */
    getChatStatus() {
        return {
            chatId: this.chatId,
            isActive: !!this.chatId,
            isPolling: this.isPolling,
            nextPosition: this.nextPosition
        };
    }
}

export default new GenesysChatService();
