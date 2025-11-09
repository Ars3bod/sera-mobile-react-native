# 🔄 Supabase Translation Cache Guide

## 📖 **Understanding the Cache**

The SERA mobile app uses a **smart caching system** to optimize performance and reduce unnecessary API calls to Supabase.

### **How It Works:**

1. **First Launch (No Cache):**
   ```
   📡 Loading ar translations from Supabase...
   📭 No cache found for ar
   ✅ Loaded translations from Supabase
   💾 Cached translations for ar
   ```

2. **Subsequent Launches (With Cache):**
   ```
   💾 Using cached translations for ar (cached 2 min ago)
   💾 Using cached translations for en (cached 2 min ago)
   ```

3. **After Cache Expires:**
   ```
   ⏰ Cache expired for ar (cached 25 min ago, max: 5 min)
   📡 Loading ar translations from Supabase...
   ✅ Loaded translations from Supabase
   ```

---

## ⏱️ **Cache Duration**

### **Development Mode (`__DEV__ = true`):**
- **Cache Duration:** 5 minutes
- **Purpose:** See changes quickly during development
- **Auto-refresh:** After 5 minutes, fetches from Supabase

### **Production Mode (`__DEV__ = false`):**
- **Cache Duration:** 24 hours
- **Purpose:** Reduce API calls, improve performance
- **Auto-refresh:** After 24 hours, fetches from Supabase

---

## 🔄 **How to See Fresh Translations**

### **Method 1: Wait for Cache to Expire (Automatic)**
- In dev mode: Wait 5 minutes
- In production: Wait 24 hours
- Then reload the app

### **Method 2: Clear Cache Manually (Quick)**

#### **Option A: Via Settings Screen**
1. Open the app
2. Go to **More → Settings**
3. Tap **"Clear Cache"**
4. Reload the app (shake device → Reload, or press R)

#### **Option B: Via Code**
```javascript
import supabaseI18nService from '../services/supabaseService';

// Clear cache only
await supabaseI18nService.clearCache();
console.log('✅ Cache cleared');

// Force refresh (clear + reload from Supabase)
const freshTranslations = await supabaseI18nService.forceRefresh();
console.log('✅ Fresh translations loaded:', freshTranslations);
```

#### **Option C: Via React Native DevTools**
```javascript
// In React Native debugger console:
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear all Supabase translation cache
await AsyncStorage.removeItem('@sera_supabase_i18n_cache_ar');
await AsyncStorage.removeItem('@sera_supabase_i18n_cache_en');
console.log('✅ Cache cleared');
```

### **Method 3: Restart Metro Bundler**
```bash
# Stop Metro (Ctrl+C)
# Clear cache and restart:
npx react-native start --reset-cache
```

---

## 🛠️ **For Developers**

### **Change Cache Duration**

Edit `src/services/supabaseService.js`:

```javascript
// Current (recommended):
this.cacheDuration = __DEV__ 
    ? 5 * 60 * 1000  // 5 minutes for development
    : 24 * 60 * 60 * 1000; // 24 hours for production

// For immediate testing (no cache):
this.cacheDuration = 0; // ⚠️ Will fetch from Supabase every time!

// For longer development sessions:
this.cacheDuration = __DEV__ 
    ? 30 * 60 * 1000  // 30 minutes for development
    : 24 * 60 * 60 * 1000; // 24 hours for production
```

### **Disable Cache Entirely (Not Recommended)**

```javascript
// In supabaseService.js, modify loadTranslations():

async loadTranslations(staticResources) {
    // Comment out cache check:
    // const cachedAr = await this.loadFromCache('ar');
    // if (cachedAr) { ... }
    
    // Force fetch from Supabase:
    const arFromSupabase = await this.loadFromSupabase('ar');
    // ... rest of the code
}
```

⚠️ **Warning:** Disabling cache will increase API calls and slow down app startup.

---

## 📊 **Cache Logs - What They Mean**

| Log Message | Meaning |
|------------|---------|
| `📭 No cache found for ar` | First time loading, no cache exists |
| `💾 Using cached translations for ar (cached 2 min ago)` | Cache is valid, using it |
| `⏰ Cache expired for ar (cached 25 min ago, max: 5 min)` | Cache expired, will fetch fresh |
| `📡 Loading ar translations from Supabase...` | Fetching from Supabase |
| `✅ Loaded 712 translations from Supabase` | Successfully fetched |
| `💾 Cached translations for ar` | Saved to cache |
| `🗑️ All translation caches cleared` | Manual cache clear |

---

## 🔍 **Debugging Cache Issues**

### **Issue: Cache never expires**
**Check:**
```javascript
// In supabaseService.js
console.log('Cache duration (ms):', this.cacheDuration);
console.log('Cache duration (min):', this.cacheDuration / (60 * 1000));
console.log('__DEV__ flag:', __DEV__);
```

### **Issue: Always fetching from Supabase**
**Possible causes:**
1. Cache duration is 0
2. AsyncStorage is failing (check permissions)
3. Cache key mismatch

**Debug:**
```javascript
// Check if cache exists
import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheKey = '@sera_supabase_i18n_cache_ar';
const cached = await AsyncStorage.getItem(cacheKey);
console.log('Cached data exists:', !!cached);

if (cached) {
    const { timestamp } = JSON.parse(cached);
    const ageMinutes = Math.floor((Date.now() - timestamp) / (60 * 1000));
    console.log('Cache age (minutes):', ageMinutes);
}
```

### **Issue: Translations not updating**
**Solutions:**
1. Clear cache manually (see Method 2 above)
2. Wait for cache to expire (5 min in dev, 24 hrs in prod)
3. Check if translations were uploaded to Supabase correctly:
   ```bash
   node scripts/upload-translations-to-supabase.js
   ```
4. Verify in Supabase dashboard: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua

---

## 🎯 **Best Practices**

### **During Development:**
✅ **Use 5-minute cache** (default in dev mode)
✅ **Clear cache after updating i18n.js**
✅ **Use `forceRefresh()` when testing Supabase changes**

### **In Production:**
✅ **Use 24-hour cache** (default in production)
✅ **Let users manually clear cache if needed** (Settings screen)
✅ **Monitor Supabase API usage**

### **When Updating Translations:**
1. Update `i18n.js`
2. Run: `node scripts/upload-translations-to-supabase.js`
3. Clear cache: Settings → Clear Cache
4. Reload app

---

## 📱 **Testing the Cache System**

### **Test 1: Cache Creation**
```bash
# 1. Clear all app data
# 2. Launch app
# 3. Look for logs:
📭 No cache found for ar
📡 Loading ar translations from Supabase...
✅ Loaded translations from Supabase
💾 Cached translations for ar
```

### **Test 2: Cache Usage**
```bash
# 1. Close app
# 2. Relaunch app (within 5 minutes in dev mode)
# 3. Look for logs:
💾 Using cached translations for ar (cached 1 min ago)
💾 Using cached translations for en (cached 1 min ago)
```

### **Test 3: Cache Expiration**
```bash
# 1. Wait > 5 minutes in dev mode (or > 24 hours in production)
# 2. Relaunch app
# 3. Look for logs:
⏰ Cache expired for ar (cached 6 min ago, max: 5 min)
📡 Loading ar translations from Supabase...
✅ Loaded translations from Supabase
💾 Cached translations for ar
```

### **Test 4: Manual Cache Clear**
```bash
# 1. In app: Settings → Clear Cache
# 2. Reload app
# 3. Look for logs:
🗑️ All translation caches cleared
📭 No cache found for ar
📡 Loading ar translations from Supabase...
```

---

## 🔧 **Advanced: Force Refresh Function**

Add a hidden developer menu to force refresh:

```javascript
// In SettingsScreen.js or DevMenu.js
import supabaseI18nService from '../services/supabaseService';
import { refreshI18nTranslations } from '../localization/i18n';

const handleForceRefresh = async () => {
    try {
        console.log('🔄 Force refreshing translations...');
        
        // Method 1: Via supabaseService
        await supabaseI18nService.forceRefresh();
        
        // Method 2: Via i18n (updates current instance)
        await refreshI18nTranslations();
        
        alert('✅ Translations refreshed from Supabase!');
    } catch (error) {
        console.error('❌ Error refreshing:', error);
        alert('❌ Failed to refresh translations');
    }
};

// Add button:
<Button title="🔄 Force Refresh Translations" onPress={handleForceRefresh} />
```

---

## 📊 **Cache Performance Stats**

### **Without Cache:**
- App launch: ~2-3 seconds (waits for Supabase)
- API calls per day: ~100+ (every launch)
- Data usage: ~500KB/day
- User experience: Slower startup

### **With Cache (24h):**
- App launch: ~0.5 seconds (instant from cache)
- API calls per day: ~1-2 (only when expired)
- Data usage: ~10KB/day
- User experience: Fast startup ✅

---

## ✅ **Current Configuration (Recommended)**

```javascript
// src/services/supabaseService.js
this.cacheDuration = __DEV__ 
    ? 5 * 60 * 1000  // 5 minutes for development
    : 24 * 60 * 60 * 1000; // 24 hours for production
```

This configuration provides:
- ✅ Fast development iteration (5 min cache)
- ✅ Optimal production performance (24h cache)
- ✅ Balance between freshness and performance
- ✅ Automatic fallback to static translations if Supabase fails

---

**Last Updated:** 2025-01-27  
**Status:** ✅ Active  
**Cache Duration:** 5 min (dev) / 24 hrs (prod)

