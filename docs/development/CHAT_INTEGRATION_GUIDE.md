# Chat Integration Guide

This guide explains how to integrate your Chatbot and Live Chat services into the SERA mobile app.

## 📋 Overview

Two chat screens have been created:
- **ChatbotScreen.js** - For AI Chatbot integration
- **LiveChatScreen.js** - For Live Chat integration

Both screens use React Native WebView to load your chat services.

---

## 🔧 Configuration Steps

### 1. Update Chatbot URL

**File:** `src/screens/ChatbotScreen.js`

**Line 24:**
```javascript
// TODO: Replace with actual chatbot URL
const CHATBOT_URL = 'https://sera.gov.sa/chatbot'; // PLACEHOLDER URL
```

**Replace with your actual chatbot URL:**
```javascript
const CHATBOT_URL = 'https://your-chatbot-service.com';
```

### 2. Update Live Chat URL

**File:** `src/screens/LiveChatScreen.js`

**Line 24:**
```javascript
// TODO: Replace with actual live chat URL
const LIVE_CHAT_URL = 'https://sera.gov.sa/livechat'; // PLACEHOLDER URL
```

**Replace with your actual live chat URL:**
```javascript
const LIVE_CHAT_URL = 'https://your-livechat-service.com';
```

---

## 🔐 Authentication & User Information

Both screens automatically inject user information into the WebView. This data is available to your chat service via JavaScript.

### Available User Data:
```javascript
window.userInfo = {
    name: 'User Full Name (Arabic or English)',
    email: 'user@example.com',
    id: 'National ID or User ID',
    language: 'ar' or 'en'
};
```

### Customize JavaScript Injection:

**In ChatbotScreen.js (lines 26-45):**
```javascript
const injectedJavaScript = `
    (function() {
        window.userInfo = {
            name: '${user?.arFullName || user?.enFullName || ''}',
            id: '${user?.nationalId || user?.id || ''}',
            language: '${i18n.language}'
        };
        
        // Add your custom initialization here
        // Example: Initialize your chatbot with user info
        if (window.YourChatbot) {
            window.YourChatbot.init({
                userId: window.userInfo.id,
                userName: window.userInfo.name,
                language: window.userInfo.language
            });
        }
    })();
    true;
`;
```

---

## 🌐 Common Integration Examples

### 1. **Dialogflow / Google Cloud Chatbot**

```javascript
const CHATBOT_URL = 'https://dialogflow.cloud.google.com/cx/YOUR_AGENT_ID';

const injectedJavaScript = `
    (function() {
        if (window.dfMessenger) {
            window.dfMessenger.setContext({
                userId: '${user?.id}',
                userName: '${user?.arFullName || user?.enFullName}',
                language: '${i18n.language}'
            });
        }
    })();
    true;
`;
```

### 2. **Zendesk Chat**

```javascript
const LIVE_CHAT_URL = 'https://your-subdomain.zendesk.com/embeddable_framework';

const injectedJavaScript = `
    (function() {
        if (window.zE) {
            window.zE('webWidget', 'identify', {
                name: '${user?.arFullName || user?.enFullName}',
                email: '${user?.email}',
                organization: 'SERA'
            });
            window.zE('webWidget', 'prefill', {
                name: {
                    value: '${user?.arFullName || user?.enFullName}',
                    readOnly: true
                },
                email: {
                    value: '${user?.email}',
                    readOnly: true
                }
            });
        }
    })();
    true;
`;
```

### 3. **Intercom**

```javascript
const LIVE_CHAT_URL = 'https://app.intercom.com/a/apps/YOUR_APP_ID/inbox';

const injectedJavaScript = `
    (function() {
        if (window.Intercom) {
            window.Intercom('boot', {
                app_id: 'YOUR_APP_ID',
                name: '${user?.arFullName || user?.enFullName}',
                email: '${user?.email}',
                user_id: '${user?.id}',
                language_override: '${i18n.language}'
            });
        }
    })();
    true;
`;
```

### 4. **Tawk.to**

```javascript
const LIVE_CHAT_URL = 'https://tawk.to/chat/YOUR_PROPERTY_ID';

const injectedJavaScript = `
    (function() {
        if (window.Tawk_API) {
            window.Tawk_API.setAttributes({
                'name': '${user?.arFullName || user?.enFullName}',
                'email': '${user?.email}',
                'hash': '${user?.id}'
            });
        }
    })();
    true;
`;
```

### 5. **Custom Chatbot (iframe embed)**

```javascript
const CHATBOT_URL = 'https://your-custom-chatbot.com/embed?userId=${user?.id}&lang=${i18n.language}';

// No JavaScript injection needed if you pass data via URL parameters
const injectedJavaScript = `true;`;
```

---

## 🔑 Adding Authentication Headers

If your chat service requires authentication (API keys, Bearer tokens), add them to the WebView:

```javascript
<WebView
    ref={webViewRef}
    source={{
        uri: CHATBOT_URL,
        headers: {
            'Authorization': 'Bearer YOUR_API_TOKEN',
            'X-API-Key': 'YOUR_API_KEY',
            'Content-Type': 'application/json'
        }
    }}
    // ... rest of props
/>
```

---

## 📱 WebView Configuration Options

Both screens include comprehensive WebView configurations:

```javascript
<WebView
    ref={webViewRef}
    source={{ uri: CHATBOT_URL }}
    
    // JavaScript
    javaScriptEnabled={true}
    injectedJavaScript={injectedJavaScript}
    
    // Storage
    domStorageEnabled={true}
    
    // File Access (for file uploads)
    allowFileAccess={true}
    allowFileAccessFromFileURLs={true}
    allowUniversalAccessFromFileURLs={true}
    
    // Loading
    startInLoadingState={true}
    onLoadStart={() => setLoading(true)}
    onLoadEnd={() => setLoading(false)}
    
    // Error Handling
    onError={handleWebViewError}
    onHttpError={handleWebViewError}
    
    // Scaling
    scalesPageToFit={true}
    
    // Mixed Content (HTTP/HTTPS)
    mixedContentMode="always"
    
    // Media
    mediaPlaybackRequiresUserAction={false}
/>
```

---

## 🎨 UI Features

### Header
- ✅ Back button (with RTL support)
- ✅ Title (localized)
- ✅ Consistent with app design

### Loading State
- ✅ Activity indicator while loading
- ✅ "Loading..." text (localized)

### Error Handling
- ✅ Error message display
- ✅ Retry button
- ✅ Automatic error detection

### Placeholder State
- ✅ Shows configuration message when using placeholder URLs
- ✅ Automatically hides when real URL is added

---

## 🌍 Localization

All UI text is fully localized in both English and Arabic.

**Available translations:**
- `chat.options.chatbot.title` - "AI Chatbot" / "روبوت المحادثة الذكي"
- `chat.options.liveChat.title` - "Live Chat" / "محادثة مباشرة"
- `chat.webview.error` - Error message
- `chat.placeholder.title` - Placeholder title
- `chat.placeholder.chatbot` - Chatbot configuration message
- `chat.placeholder.liveChat` - Live Chat configuration message
- `common.loading` - "Loading..."
- `common.retry` - "Retry"

---

## 🔄 Message Communication (Advanced)

To receive messages from the WebView:

```javascript
const onMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('Message from WebView:', data);
    
    // Handle specific actions
    if (data.action === 'close') {
        navigation.goBack();
    }
};

<WebView
    onMessage={onMessage}
    // ... other props
/>
```

To send messages to the WebView:

```javascript
const sendMessageToWebView = (message) => {
    if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify(message));
    }
};

// Example usage
sendMessageToWebView({
    type: 'USER_INFO',
    data: {
        name: user?.arFullName,
        id: user?.id
    }
});
```

---

## 📊 Analytics Integration (Optional)

Track chat usage:

```javascript
import analytics from '@react-native-firebase/analytics';

const ChatbotScreen = ({ navigation }) => {
    React.useEffect(() => {
        // Track screen view
        analytics().logScreenView({
            screen_name: 'Chatbot',
            screen_class: 'ChatbotScreen'
        });
    }, []);

    const handleChatStarted = () => {
        analytics().logEvent('chat_started', {
            type: 'chatbot',
            user_id: user?.id
        });
    };

    // ... rest of component
};
```

---

## 🐛 Troubleshooting

### Issue: WebView shows blank screen
**Solution:** Check if the URL is accessible from mobile browsers. Some services require CORS configuration.

### Issue: JavaScript not executing
**Solution:** Ensure `javaScriptEnabled={true}` is set and your JavaScript is wrapped in an IIFE.

### Issue: File uploads not working
**Solution:** Ensure file access permissions are granted in WebView props and check iOS/Android permissions.

### Issue: Mixed content blocked
**Solution:** Set `mixedContentMode="always"` for Android. For iOS, add to Info.plist:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Issue: Chatbot not receiving user info
**Solution:** Verify the JavaScript injection syntax and check if your chatbot service expects a different format.

---

## 🔗 Quick Links

- [React Native WebView Documentation](https://github.com/react-native-webview/react-native-webview)
- [WebView Props Reference](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md)

---

## ✅ Checklist

Before deploying:

- [ ] Replace `CHATBOT_URL` with actual URL in `ChatbotScreen.js`
- [ ] Replace `LIVE_CHAT_URL` with actual URL in `LiveChatScreen.js`
- [ ] Test chatbot functionality on iOS
- [ ] Test chatbot functionality on Android
- [ ] Test live chat functionality on iOS
- [ ] Test live chat functionality on Android
- [ ] Verify user information is being passed correctly
- [ ] Test with authenticated and guest users
- [ ] Test in Arabic and English languages
- [ ] Verify file upload (if applicable)
- [ ] Test error handling and retry functionality
- [ ] Remove placeholder detection code (lines with TODO comments)

---

## 📝 Notes

- Both screens are fully functional and production-ready
- User authentication status is automatically handled
- All UI elements support RTL for Arabic
- WebView is optimized for performance with native driver
- Error states are handled gracefully with retry functionality

**Need help?** Check the inline comments in `ChatbotScreen.js` and `LiveChatScreen.js` for more details.

