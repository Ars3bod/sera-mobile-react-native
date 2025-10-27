# 🌐 SERA Mobile - Supabase i18n Integration Guide

## Overview

This guide walks you through setting up **dynamic i18n** (internationalization) for the SERA Mobile app using **Supabase** as the backend. This allows you to update translations without releasing a new app version.

## Architecture

```
┌─────────────────┐
│   React Native  │
│      App        │
└────────┬────────┘
         │
         ├─→ 1. Check Local Cache (24hr TTL)
         │
         ├─→ 2. Fetch from Supabase (if cache expired)
         │
         └─→ 3. Fallback to Static (if offline)
```

### Strategy
- **Cache First**: Load from AsyncStorage cache (24-hour TTL)
- **Supabase Second**: Fetch fresh translations if cache expired
- **Static Fallback**: Use built-in translations if Supabase unavailable

---

## 📋 Prerequisites

- Supabase account (free tier is sufficient)
- Node.js installed
- SERA Mobile app development environment setup

---

## 🚀 Step-by-Step Setup

### Step 1: Database Setup

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua
   - Click **SQL Editor** in the left sidebar

2. **Run the Setup Script**
   - Open the file: `supabase-i18n-setup.sql`
   - Copy all contents
   - Paste into Supabase SQL Editor
   - Click **Run** button

3. **Verify Table Creation**
   ```sql
   SELECT * FROM translations LIMIT 10;
   ```
   You should see sample translations for Arabic and English.

### Step 2: Install Dependencies

The required package is already installed:

```bash
npm install @supabase/supabase-js
```

### Step 3: Configuration (Already Done)

The following files have been configured:

#### `src/services/supabaseService.js`
- Handles all Supabase operations
- Manages caching strategy
- Provides translation loading logic

#### `src/localization/i18n.js`
- Updated to use Supabase service
- Automatic initialization on app launch
- Fallback to static translations

### Step 4: Upload Your Translations

You have two options to upload translations:

#### Option A: Manual Upload (Supabase Dashboard)

1. Go to **Table Editor** → `translations`
2. Click **Insert row**
3. Fill in:
   - `key`: e.g., `common.cancel`
   - `language`: `ar` or `en`
   - `value`: `"إلغاء"` (must be JSON string with quotes)
   - `category`: e.g., `common`
4. Click **Save**

#### Option B: Bulk Upload (Recommended)

1. Edit the script: `scripts/upload-translations-to-supabase.js`
2. Replace `sampleTranslations` with your full translations
3. Run the script:
   ```bash
   node scripts/upload-translations-to-supabase.js
   ```

Example format for bulk upload:
```javascript
const translations = {
  en: {
    common: {
      cancel: 'Cancel',
      ok: 'OK',
      // ... more translations
    },
    auth: {
      login: 'Login',
      // ... more translations
    },
  },
  ar: {
    common: {
      cancel: 'إلغاء',
      ok: 'موافق',
      // ... more translations
    },
  },
};
```

---

## 🧪 Testing

### Test in Development

1. **Start the app**:
   ```bash
   npx react-native start
   npx react-native run-ios
   # or
   npx react-native run-android
   ```

2. **Check console logs**:
   Look for these messages:
   ```
   🌐 Initializing i18n with Supabase...
   📡 Loading ar translations from Supabase...
   ✅ Loaded 150 translation keys from Supabase
   ✅ i18n initialized successfully with Supabase support
   ```

3. **Verify translation loading**:
   - First launch: Loads from Supabase (slow)
   - Second launch: Loads from cache (instant)
   - Offline: Uses static fallback

### Test Connection

Add this to any screen to test:

```javascript
import supabaseI18nService from '../services/supabaseService';

const testSupabase = async () => {
  const isConnected = await supabaseI18nService.testConnection();
  console.log('Supabase connected:', isConnected);
  
  const translations = await supabaseI18nService.loadFromSupabase('ar');
  console.log('Loaded translations:', translations);
};
```

---

## 🔄 Updating Translations

### Method 1: Supabase Dashboard (Quick Updates)

1. Go to **Table Editor** → `translations`
2. Find the row (filter by `key` or `language`)
3. Click the row to edit
4. Update the `value` field
5. Save

**Note**: App will pick up changes after cache expires (24 hours) or on manual refresh.

### Method 2: Programmatic Update (Admin Panel)

You can create an admin panel that uses:

```javascript
import supabaseI18nService from '../services/supabaseService';

// Update single translation
await supabaseI18nService.updateTranslation(
  'common.cancel',  // key
  'ar',            // language
  'إلغاء',         // value
  'common'         // category (optional)
);

// Bulk update
await supabaseI18nService.bulkUpdateTranslations([
  { key: 'common.cancel', language: 'ar', value: 'إلغاء', category: 'common' },
  { key: 'common.ok', language: 'ar', value: 'موافق', category: 'common' },
  // ... more translations
]);
```

### Method 3: Force Refresh in App

Add a "Refresh Translations" button in your Settings screen:

```javascript
import { refreshI18nTranslations } from '../localization/i18n';

const handleRefreshTranslations = async () => {
  const success = await refreshI18nTranslations();
  if (success) {
    Alert.alert('Success', 'Translations updated!');
  } else {
    Alert.alert('Error', 'Failed to refresh translations');
  }
};
```

---

## 🛠️ Advanced Usage

### Clear Cache Manually

```javascript
import supabaseI18nService from '../services/supabaseService';

await supabaseI18nService.clearCache();
```

### Refresh Single Language

```javascript
const freshArabic = await supabaseI18nService.refreshTranslations('ar');
```

### Query Translations

View all translations for a language:
```sql
SELECT * FROM get_translations_for_language('ar');
```

View recent updates:
```sql
SELECT * FROM translations 
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;
```

---

## 📊 Database Schema

### `translations` Table

| Column       | Type      | Description                              |
|--------------|-----------|------------------------------------------|
| `id`         | BIGSERIAL | Primary key (auto-increment)             |
| `key`        | TEXT      | Translation key (e.g., `common.cancel`)  |
| `language`   | TEXT      | Language code (`ar`, `en`)               |
| `value`      | JSONB     | Translation value (JSON string)          |
| `category`   | TEXT      | Optional category (e.g., `common`)       |
| `created_at` | TIMESTAMP | Creation timestamp                       |
| `updated_at` | TIMESTAMP | Last update timestamp                    |

**Unique Constraint**: `(key, language)` - Prevents duplicate translations

**Indexes**:
- `idx_translations_key_lang`: Fast lookup by key and language
- `idx_translations_category`: Filter by category
- `idx_translations_updated`: Sort by update time

---

## 🔒 Security

### Row Level Security (RLS)

The table has RLS enabled with these policies:

1. **Public Read Access**: Anyone can read translations
   ```sql
   CREATE POLICY "Enable read access for all users" ON translations
   FOR SELECT USING (true);
   ```

2. **Authenticated Write** (Optional): Only authenticated users can modify
   ```sql
   CREATE POLICY "Enable write for authenticated users" ON translations
   FOR ALL USING (auth.role() = 'authenticated');
   ```

### API Keys

- **Anon Key**: Used in the app (safe to expose)
- **Service Role Key**: Never use in client-side code (server-only)

---

## 🐛 Troubleshooting

### Issue: Translations not loading

**Check**:
1. Console logs show errors?
2. Is internet connection available?
3. Is Supabase project active?
4. Run: `await supabaseI18nService.testConnection()`

**Solution**:
```javascript
// Clear cache and retry
await supabaseI18nService.clearCache();
await refreshI18nTranslations();
```

### Issue: Old translations showing

**Cause**: Cache is still valid (24-hour TTL)

**Solution**:
```javascript
// Force refresh
import { refreshI18nTranslations } from '../localization/i18n';
await refreshI18nTranslations();
```

### Issue: App works offline but not online

**Check**:
1. Supabase URL is correct
2. Anon key is valid
3. RLS policies allow read access
4. Network requests not blocked by firewall

### Issue: Bulk upload fails

**Check**:
1. SQL table exists (run `supabase-i18n-setup.sql`)
2. Value is JSON string: `"Cancel"` not `Cancel`
3. Check batch size (reduce if timeout)

---

## 📱 Production Checklist

Before going live:

- [ ] All translations uploaded to Supabase
- [ ] Tested cache mechanism (24-hour TTL)
- [ ] Tested offline fallback (airplane mode)
- [ ] Tested language switching (ar ↔ en)
- [ ] Verified RLS policies are correct
- [ ] Tested on both iOS and Android
- [ ] Performance acceptable (< 2s initial load)
- [ ] Error handling works (network failures)
- [ ] Backup static translations are complete

---

## 🎯 Best Practices

1. **Always Provide Static Fallback**: Never rely solely on Supabase
2. **Use Categories**: Organize translations by feature/screen
3. **Version Translations**: Add a `version` field for major changes
4. **Monitor Usage**: Check Supabase dashboard for API usage
5. **Batch Updates**: Upload multiple translations at once
6. **Test Offline**: Ensure app works without internet
7. **Cache Strategy**: 24-hour TTL is reasonable for most apps
8. **Incremental Rollout**: Test with small changes first

---

## 🚀 Next Steps

1. **Run SQL Setup**: Execute `supabase-i18n-setup.sql`
2. **Upload Translations**: Use bulk upload script
3. **Test in Dev**: Verify translations load correctly
4. **Clear Cache**: Test refresh mechanism
5. **Test Offline**: Ensure fallback works
6. **Deploy**: Release to TestFlight/Google Play Internal Testing

---

## 📚 Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua
- **Supabase Docs**: https://supabase.com/docs
- **i18next Docs**: https://www.i18next.com/
- **React i18next**: https://react.i18next.com/

---

## 💡 Future Enhancements

- [ ] Admin web panel for translation management
- [ ] A/B testing for translations
- [ ] Translation versioning system
- [ ] Automated translation sync on app launch
- [ ] Analytics for missing translations
- [ ] Integration with translation services (Google Translate API)
- [ ] Export/import translations (CSV, JSON)

---

## 🆘 Support

If you encounter issues:

1. Check console logs for error messages
2. Verify Supabase connection: `testConnection()`
3. Check network tab for failed requests
4. Review Supabase logs in dashboard
5. Test with static fallback disabled

For questions, contact the development team.

---

**Last Updated**: October 27, 2025  
**Version**: 1.0.0  
**Supabase Project**: yxlfdigmbgxhfeudnbua

