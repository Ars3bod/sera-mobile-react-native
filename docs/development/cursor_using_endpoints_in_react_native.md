

Share the following with the React Native developer:

## 1. **WebView Component Implementation**

```javascript
// ChatbotWebView.js
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ChatbotWebView = ({ isArabic, activeChatbot, onMessage }) => {
  const webViewRef = useRef(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="${isArabic ? 'rtl' : 'ltr'}" lang="${isArabic ? 'ar' : 'en'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chatbot</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          height: 100vh; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #antillia-talk-widget { 
          height: 100%; 
          width: 100%;
        }
        masdr-digital-human { 
          height: 100%; 
          width: 100%;
        }
        .hidden { display: none !important; }
      </style>
    </head>
    <body>
      <div id="antillia-talk-widget" class="${activeChatbot === 'videocall' ? '' : 'hidden'}"></div>
      <masdr-digital-human 
        dir="${isArabic ? 'rtl' : 'ltr'}" 
        charactersonly="true"
        class="${activeChatbot === 'masdr' ? '' : 'hidden'}"
      ></masdr-digital-human>
      
      <script>
        // Global variables
        window.__SERA_BASE__ = 'https://sera-chatwidget.masdr.live/v1';
        window.activeChatbot = '${activeChatbot}';
        window.isArabic = ${isArabic};
        
        // Load video call script
        function loadVideoCall() {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = '/videocall/index.js?token=1bbz782e91pl5v1vapu82rw7c';
          script.onerror = () => {
            console.warn('Video call script failed to load');
          };
          document.head.appendChild(script);
        }
        
        // Load Masdr chatbot
        function loadMasdrChatbot() {
          // Load CSS
          const css = document.createElement('link');
          css.rel = 'stylesheet';
          css.href = 'https://sera-chatwidget.masdr.live/v1/styles.css';
          document.head.appendChild(css);
          
          // Load main script
          const script = document.createElement('script');
          script.src = 'https://sera-chatwidget.masdr.live/v1/main.js';
          script.onload = () => {
            console.log('Masdr chatbot loaded');
          };
          document.head.appendChild(script);
        }
        
        // Load Genesys chatbot
        function loadGenesysChatbot() {
          const scripts = [
            '/chatbot/${isArabic ? 'ar' : 'en'}/widgets${isArabic ? 'Ar' : ''}.min.css',
            '/chatbot/${isArabic ? 'ar' : 'en'}/cxbus.min.js',
            '/chatbot/${isArabic ? 'ar' : 'en'}/chat_sidebtn.js',
            '/chatbot/${isArabic ? 'ar' : 'en'}/widgets${isArabic ? 'Ar' : ''}.min.js'
          ];
          
          scripts.forEach((src, index) => {
            if (src.includes('.css')) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = src;
              document.head.appendChild(link);
            } else {
              const script = document.createElement('script');
              script.src = src;
              document.head.appendChild(script);
            }
          });
        }
        
        // Initialize based on active chatbot
        function initializeChatbot() {
          switch (window.activeChatbot) {
            case 'masdr':
              loadMasdrChatbot();
              break;
            case 'genesys':
              loadGenesysChatbot();
              break;
            case 'videocall':
              loadVideoCall();
              break;
            default:
              console.log('No chatbot selected');
          }
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
        
        // Event listeners for chatbot interactions
        document.addEventListener('DOMContentLoaded', () => {
          initializeChatbot();
          
          // Listen for chatbot events
          document.addEventListener('chatbot-message', (event) => {
            sendMessageToRN('chatbot_message', event.detail);
          });
          
          document.addEventListener('chatbot-error', (event) => {
            sendMessageToRN('chatbot_error', event.detail);
          });
          
          // Notify React Native that webview is ready
          sendMessageToRN('webview_ready', { activeChatbot: window.activeChatbot });
        });
        
        // Handle chatbot switching
        window.switchChatbot = function(newChatbot) {
          // Hide all chatbots
          document.getElementById('antillia-talk-widget').classList.add('hidden');
          document.querySelector('masdr-digital-human').classList.add('hidden');
          
          // Show selected chatbot
          switch (newChatbot) {
            case 'masdr':
              document.querySelector('masdr-digital-human').classList.remove('hidden');
              break;
            case 'videocall':
              document.getElementById('antillia-talk-widget').classList.remove('hidden');
              break;
            case 'genesys':
              // Genesys loads dynamically
              break;
          }
          
          window.activeChatbot = newChatbot;
          sendMessageToRN('chatbot_switched', { newChatbot });
        };
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from webview:', data);
      
      if (onMessage) {
        onMessage(data);
      }
    } catch (error) {
      console.error('Error parsing webview message:', error);
    }
  };

  const sendMessageToWebView = (message) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(message));
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onLoadEnd={() => {
          console.log('WebView loaded successfully');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ChatbotWebView;
```

## 2. **Usage Example**

```javascript
// App.js or your main component
import React, { useState } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import ChatbotWebView from './ChatbotWebView';

const App = () => {
  const [activeChatbot, setActiveChatbot] = useState('none');
  const [isArabic, setIsArabic] = useState(false);

  const handleWebViewMessage = (data) => {
    switch (data.type) {
      case 'webview_ready':
        console.log('WebView is ready');
        break;
      case 'chatbot_message':
        console.log('Chatbot message:', data.data);
        break;
      case 'chatbot_error':
        Alert.alert('Chatbot Error', data.data.message);
        break;
      case 'chatbot_switched':
        console.log('Chatbot switched to:', data.data.newChatbot);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const switchChatbot = (type) => {
    setActiveChatbot(type);
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button title="Masdr" onPress={() => switchChatbot('masdr')} />
        <Button title="Genesys" onPress={() => switchChatbot('genesys')} />
        <Button title="Video Call" onPress={() => switchChatbot('videocall')} />
        <Button title="None" onPress={() => switchChatbot('none')} />
        <Button 
          title={isArabic ? 'English' : 'Arabic'} 
          onPress={() => setIsArabic(!isArabic)} 
        />
      </View>
      
      {activeChatbot !== 'none' && (
        <ChatbotWebView
          isArabic={isArabic}
          activeChatbot={activeChatbot}
          onMessage={handleWebViewMessage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
});

export default App;
```

## 3. **Dependencies to Install**

```bash
npm install react-native-webview
# For iOS
cd ios && pod install
```

## 4. **Required Files/Assets**

Share these files from your web project:

```
public/
├── chatbot/
│   ├── ar/
│   │   ├── chat_sidebtn.js
│   │   ├── cxbus.min.js
│   │   ├── widgetsAr.min.css
│   │   └── widgetsAr.min.js
│   └── en/
│       ├── chat_sidebtn.js
│       ├── cxbus.min.js
│       ├── widgets.min.css
│       └── widgets.min.js
└── videocall/
    └── index.js
```

## 5. **Configuration Notes**

- API endpoints: share the Nafath endpoints and any other APIs the chatbots use
- Environment variables: provide the required config values
- Permissions: camera and microphone may be needed
- Network: ensure the app can reach external chatbot services

## 6. **Testing Checklist**

- [ ] WebView loads without errors
- [ ] Chatbot switching works
- [ ] RTL/LTR layout works
- [ ] Network requests succeed
- [ ] Camera/microphone permissions work
- [ ] Messages between WebView and React Native work

## 7. **Troubleshooting Tips**

- Check network connectivity
- Verify file paths for chatbot assets
- Test on both iOS and Android
- Monitor console logs for errors
- Ensure HTTPS for external resources

This should be enough to implement the WebView-based chatbot in React Native.

```javascript
// ChatbotWebView.js
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ChatbotWebView = ({ isArabic, activeChatbot, onMessage }) => {
  const webViewRef = useRef(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="${isArabic ? 'rtl' : 'ltr'}" lang="${isArabic ? 'ar' : 'en'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chatbot</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          height: 100vh; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #antillia-talk-widget { 
          height: 100%; 
          width: 100%;
        }
        masdr-digital-human { 
          height: 100%; 
          width: 100%;
        }
        .hidden { display: none !important; }
      </style>
    </head>
    <body>
      <div id="antillia-talk-widget" class="${activeChatbot === 'videocall' ? '' : 'hidden'}"></div>
      <masdr-digital-human 
        dir="${isArabic ? 'rtl' : 'ltr'}" 
        charactersonly="true"
        class="${activeChatbot === 'masdr' ? '' : 'hidden'}"
      ></masdr-digital-human>
      
      <script>
        // Global variables
        window.__SERA_BASE__ = 'https://sera-chatwidget.masdr.live/v1';
        window.activeChatbot = '${activeChatbot}';
        window.isArabic = ${isArabic};
        
        // Load video call script
        function loadVideoCall() {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = '/videocall/index.js?token=1bbz782e91pl5v1vapu82rw7c';
          script.onerror = () => {
            console.warn('Video call script failed to load');
          };
          document.head.appendChild(script);
        }
        
        // Load Masdr chatbot
        function loadMasdrChatbot() {
          // Load CSS
          const css = document.createElement('link');
          css.rel = 'stylesheet';
          css.href = 'https://sera-chatwidget.masdr.live/v1/styles.css';
          document.head.appendChild(css);
          
          // Load main script
          const script = document.createElement('script');
          script.src = 'https://sera-chatwidget.masdr.live/v1/main.js';
          script.onload = () => {
            console.log('Masdr chatbot loaded');
          };
          document.head.appendChild(script);
        }
        
        // Load Genesys chatbot
        function loadGenesysChatbot() {
          const scripts = [
            '/chatbot/${isArabic ? 'ar' : 'en'}/widgets${isArabic ? 'Ar' : ''}.min.css',
            '/chatbot/${isArabic ? 'ar' : 'en'}/cxbus.min.js',
            '/chatbot/${isArabic ? 'ar' : 'en'}/chat_sidebtn.js',
            '/chatbot/${isArabic ? 'ar' : 'en'}/widgets${isArabic ? 'Ar' : ''}.min.js'
          ];
          
          scripts.forEach((src, index) => {
            if (src.includes('.css')) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = src;
              document.head.appendChild(link);
            } else {
              const script = document.createElement('script');
              script.src = src;
              document.head.appendChild(script);
            }
          });
        }
        
        // Initialize based on active chatbot
        function initializeChatbot() {
          switch (window.activeChatbot) {
            case 'masdr':
              loadMasdrChatbot();
              break;
            case 'genesys':
              loadGenesysChatbot();
              break;
            case 'videocall':
              loadVideoCall();
              break;
            default:
              console.log('No chatbot selected');
          }
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
        
        // Event listeners for chatbot interactions
        document.addEventListener('DOMContentLoaded', () => {
          initializeChatbot();
          
          // Listen for chatbot events
          document.addEventListener('chatbot-message', (event) => {
            sendMessageToRN('chatbot_message', event.detail);
          });
          
          document.addEventListener('chatbot-error', (event) => {
            sendMessageToRN('chatbot_error', event.detail);
          });
          
          // Notify React Native that webview is ready
          sendMessageToRN('webview_ready', { activeChatbot: window.activeChatbot });
        });
        
        // Handle chatbot switching
        window.switchChatbot = function(newChatbot) {
          // Hide all chatbots
          document.getElementById('antillia-talk-widget').classList.add('hidden');
          document.querySelector('masdr-digital-human').classList.add('hidden');
          
          // Show selected chatbot
          switch (newChatbot) {
            case 'masdr':
              document.querySelector('masdr-digital-human').classList.remove('hidden');
              break;
            case 'videocall':
              document.getElementById('antillia-talk-widget').classList.remove('hidden');
              break;
            case 'genesys':
              // Genesys loads dynamically
              break;
          }
          
          window.activeChatbot = newChatbot;
          sendMessageToRN('chatbot_switched', { newChatbot });
        };
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from webview:', data);
      
      if (onMessage) {
        onMessage(data);
      }
    } catch (error) {
      console.error('Error parsing webview message:', error);
    }
  };

  const sendMessageToWebView = (message) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(message));
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onLoadEnd={() => {
          console.log('WebView loaded successfully');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ChatbotWebView;
```

```javascript
// App.js or your main component
import React, { useState } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import ChatbotWebView from './ChatbotWebView';

const App = () => {
  const [activeChatbot, setActiveChatbot] = useState('none');
  const [isArabic, setIsArabic] = useState(false);

  const handleWebViewMessage = (data) => {
    switch (data.type) {
      case 'webview_ready':
        console.log('WebView is ready');
        break;
      case 'chatbot_message':
        console.log('Chatbot message:', data.data);
        break;
      case 'chatbot_error':
        Alert.alert('Chatbot Error', data.data.message);
        break;
      case 'chatbot_switched':
        console.log('Chatbot switched to:', data.data.newChatbot);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const switchChatbot = (type) => {
    setActiveChatbot(type);
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button title="Masdr" onPress={() => switchChatbot('masdr')} />
        <Button title="Genesys" onPress={() => switchChatbot('genesys')} />
        <Button title="Video Call" onPress={() => switchChatbot('videocall')} />
        <Button title="None" onPress={() => switchChatbot('none')} />
        <Button 
          title={isArabic ? 'English' : 'Arabic'} 
          onPress={() => setIsArabic(!isArabic)} 
        />
      </View>
      
      {activeChatbot !== 'none' && (
        <ChatbotWebView
          isArabic={isArabic}
          activeChatbot={activeChatbot}
          onMessage={handleWebViewMessage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
});

export default App;
```

```shellscript
npm install react-native-webview
# For iOS
cd ios && pod install
```

```plaintext
public/
├── chatbot/
│   ├── ar/
│   │   ├── chat_sidebtn.js
│   │   ├── cxbus.min.js
│   │   ├── widgetsAr.min.css
│   │   └── widgetsAr.min.js
│   └── en/
│       ├── chat_sidebtn.js
│       ├── cxbus.min.js
│       ├── widgets.min.css
│       └── widgets.min.js
└── videocall/
    └── index.js
```

