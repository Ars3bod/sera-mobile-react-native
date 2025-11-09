# 🚀 Supabase i18n Quick Start

## ✅ What's Been Implemented

Your SERA Mobile app now has **dynamic i18n** powered by Supabase!

### Files Created/Modified:

1. ✅ `src/services/supabaseService.js` - Supabase i18n service
2. ✅ `src/localization/i18n.js` - Updated to use Supabase
3. ✅ `supabase-i18n-setup.sql` - Database schema & initial data
4. ✅ `scripts/upload-translations-to-supabase.js` - Bulk upload tool
5. ✅ `SUPABASE_I18N_SETUP_GUIDE.md` - Complete documentation
6. ✅ `@supabase/supabase-js` - Installed via npm

---

## 🎯 Next Steps (3 Minutes)

### Step 1: Setup Database (1 min)

1. Open: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua
2. Click **SQL Editor** (left sidebar)
3. Copy/paste content from `supabase-i18n-setup.sql`
4. Click **Run**
5. Verify: `SELECT * FROM translations LIMIT 10;`

### Step 2: Test the App (1 min)

```bash
# Start Metro bundler
npx react-native start --reset-cache

# Run the app (new terminal)
npx react-native run-ios
# or
npx react-native run-android
```

Watch console for:
```
🌐 Initializing i18n with Supabase...
📡 Loading ar translations from Supabase...
✅ Loaded X translation keys from Supabase
✅ i18n initialized successfully
```

### Step 3: Upload Your Translations (1 min)

**Quick Test (sample data)**:
```bash
node scripts/upload-translations-to-supabase.js
```

**Full Upload (your data)**:
1. Edit `scripts/upload-translations-to-supabase.js`
2. Replace `sampleTranslations` with your full i18n data
3. Run: `node scripts/upload-translations-to-supabase.js`

---

## 🔄 How It Works

```
App Launch
    ↓
Check Cache (24hr)
    ↓ (if expired)
Fetch from Supabase
    ↓ (if online)
Merge with Static
    ↓ (if offline)
Use Static Fallback
```

**Benefits**:
- ⚡ Fast: Loads from cache (instant)
- 🌐 Dynamic: Update translations without app release
- 📴 Offline: Always works with static fallback
- 🔒 Secure: RLS policies enabled

---

## 📝 Update Translations (2 ways)

### Method 1: Supabase Dashboard (Quick)

1. Go to **Table Editor** → `translations`
2. Find & edit the row
3. Update `value` field
4. Save

Changes apply after 24hr or manual refresh.

### Method 2: In-App Refresh

Add to your Settings screen:

```javascript
import { refreshI18nTranslations } from '../localization/i18n';

const handleRefresh = async () => {
  await refreshI18nTranslations();
  Alert.alert('Success', 'Translations updated!');
};
```

---

## 🧪 Test Connection

Add this anywhere to test:

```javascript
import supabaseI18nService from '../services/supabaseService';

const test = async () => {
  const connected = await supabaseI18nService.testConnection();
  console.log('Supabase connected:', connected);
};
```

---

## 🐛 Troubleshooting

### Not Loading?

1. Check internet connection
2. Verify SQL script ran successfully
3. Check console for error messages
4. Test connection: `supabaseI18nService.testConnection()`

### Old Translations?

Clear cache:
```javascript
import supabaseI18nService from '../services/supabaseService';
await supabaseI18nService.clearCache();
```

### Still Using Static?

This is normal on first load if:
- No internet connection
- Supabase table empty
- Cache not yet created

**Solution**: Upload translations, then restart app.

---

## 📊 Verification Queries

Run in Supabase SQL Editor:

```sql
-- Check total translations
SELECT language, COUNT(*) as total 
FROM translations 
GROUP BY language;

-- View recent updates
SELECT * FROM translations 
WHERE updated_at > NOW() - INTERVAL '1 day'
ORDER BY updated_at DESC;

-- Find missing translations
SELECT key FROM translations WHERE language = 'ar'
EXCEPT
SELECT key FROM translations WHERE language = 'en';
```

---

## 🎯 Production Ready Checklist

- [ ] SQL script executed successfully
- [ ] All translations uploaded
- [ ] Tested cache mechanism
- [ ] Tested offline fallback
- [ ] Tested on iOS & Android
- [ ] Console logs show no errors
- [ ] Language switching works (ar ↔ en)

---

## 📚 Full Documentation

See `SUPABASE_I18N_SETUP_GUIDE.md` for complete details.

---

## 🔗 Quick Links

- **Dashboard**: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua
- **Table Editor**: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua/editor
- **SQL Editor**: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua/sql

---

## 💡 Pro Tips

1. **Always test offline**: Ensure static fallback works
2. **Monitor cache**: 24-hour TTL is optimal
3. **Use categories**: Organize by feature (`common`, `auth`, etc.)
4. **Batch updates**: Upload multiple translations at once
5. **Version control**: Keep `staticResources` in sync with Supabase

---

**Your app is now ready with dynamic i18n! 🎉**

Questions? Check the full guide: `SUPABASE_I18N_SETUP_GUIDE.md`

