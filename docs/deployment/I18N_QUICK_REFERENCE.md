# 🚀 i18n Quick Reference Guide - SERA Mobile

## 📖 **How to Use i18n in Your Code**

### **Basic Text Translation**
```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.submit')}</Text>
  );
};
```

### **Translation with Variables**
```javascript
<Text>{t('common.welcome', { name: userName })}</Text>

// In i18n.js:
// welcome: 'Welcome, {{name}}!'
```

### **Array/Object Translations**
```javascript
const items = t('home.homeNew.seraUpdates.items', { returnObjects: true });

// Always check if it's an array
if (Array.isArray(items)) {
  items.map(item => {
    // Use item.title, item.description, etc.
  });
}
```

### **Nested Object Translations**
```javascript
const categories = t('compensationStandards.screen.categories', { returnObjects: true });

// Access nested properties
<Text>{categories.service}</Text>
<Text>{categories.restoration}</Text>
```

---

## 📍 **Where to Find Translations**

### **HomeScreenNew.js Translations**
```javascript
// Location in i18n.js: home.homeNew.*

// Basic UI
t('home.homeNew.lastVisit')
t('home.homeNew.accountVerified')

// Stats
t('home.homeNew.stats.activeComplaints')
t('home.homeNew.stats.completed')
t('home.homeNew.stats.pending')

// Quick Actions
t('home.homeNew.quickActions.newComplaint')
t('home.homeNew.quickActions.newPermit')
t('home.homeNew.quickActions.contactUs')
t('home.homeNew.quickActions.shareData')

// SERA Updates (array)
t('home.homeNew.seraUpdates.items', { returnObjects: true })

// Compensation Standards (array)
t('home.homeNew.compensation.standards', { returnObjects: true })

// Coming Soon Modal
t('home.homeNew.comingSoon.title')
t('home.homeNew.comingSoon.message')
t('home.homeNew.comingSoon.okButton')
```

### **CompensationStandardsScreen.js Translations**
```javascript
// Location in i18n.js: compensationStandards.*

// Screen Labels
t('compensationStandards.screen.title')
t('compensationStandards.screen.subtitle')
t('compensationStandards.screen.description')
t('compensationStandards.screen.conditions')
t('compensationStandards.screen.period')
t('compensationStandards.screen.compensation')
t('compensationStandards.screen.additionalCompensation')
t('compensationStandards.screen.notes')
t('compensationStandards.screen.downloadGuide')

// Categories
t('compensationStandards.screen.categories.service')
t('compensationStandards.screen.categories.restoration')
t('compensationStandards.screen.categories.notification')
t('compensationStandards.screen.categories.emergency')
t('compensationStandards.screen.categories.violation')
t('compensationStandards.screen.categories.complaint')

// All 9 Standards (array)
t('compensationStandards.standards', { returnObjects: true })
```

---

## 🔄 **How to Update Translations**

### **Method 1: Update i18n.js (Static)**
1. Open `src/localization/i18n.js`
2. Find the `staticResources` object
3. Update the English (`en`) and Arabic (`ar`) values
4. Run upload script: `node scripts/upload-translations-to-supabase.js`
5. Clear app cache and reload

### **Method 2: Update via Supabase (Dynamic)**
1. Go to Supabase dashboard: https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua
2. Navigate to **Table Editor → translations**
3. Find the translation key you want to update
4. Edit the `value` field (stored as JSON)
5. Changes take effect on next app launch (or cache refresh)

---

## 🆕 **How to Add New Translations**

### **Step 1: Add to i18n.js**
```javascript
// In staticResources.en.translation:
myNewSection: {
  title: 'My Title',
  description: 'My Description',
  items: [
    {
      id: 1,
      name: 'Item 1',
    },
  ],
}

// In staticResources.ar.translation:
myNewSection: {
  title: 'العنوان',
  description: 'الوصف',
  items: [
    {
      id: 1,
      name: 'العنصر 1',
    },
  ],
}
```

### **Step 2: Upload to Supabase**
```bash
node scripts/upload-translations-to-supabase.js
```

### **Step 3: Use in Your Code**
```javascript
const { t } = useTranslation();

<Text>{t('myNewSection.title')}</Text>
<Text>{t('myNewSection.description')}</Text>

const items = t('myNewSection.items', { returnObjects: true });
```

---

## 🌐 **Language Switching**

```javascript
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // 'ar' or 'en'
  };
  
  return (
    <>
      <Button onPress={() => changeLanguage('en')}>English</Button>
      <Button onPress={() => changeLanguage('ar')}>العربية</Button>
    </>
  );
};
```

---

## 🗂️ **i18n.js Structure**

```javascript
staticResources = {
  en: {
    translation: {
      common: { ... },           // Common UI elements
      home: {
        homeNew: { ... },        // HomeScreenNew content
        greeting: { ... },       // Time-based greetings
      },
      services: { ... },         // Services screen
      compensationStandards: {   // Compensation standards
        screen: { ... },         // Screen labels
        standards: [ ... ],      // All 9 standards
      },
      more: { ... },             // More screen
      // ... etc
    }
  },
  ar: {
    translation: {
      // Same structure as English, but with Arabic values
    }
  }
}
```

---

## 🔧 **Common Patterns**

### **Pattern 1: Simple Text**
```javascript
<Text>{t('common.cancel')}</Text>
```

### **Pattern 2: Array of Objects**
```javascript
const standards = t('compensationStandards.standards', { returnObjects: true });

{Array.isArray(standards) && standards.map(item => (
  <View key={item.id}>
    <Text>{item.title}</Text>
    <Text>{item.description}</Text>
  </View>
))}
```

### **Pattern 3: Nested Object**
```javascript
const categories = t('compensationStandards.screen.categories', { returnObjects: true });

<Text>{categories.service}</Text>
<Text>{categories.restoration}</Text>
```

### **Pattern 4: Conditional Text**
```javascript
<Text>{isNew ? t('home.homeNew.seraUpdates.new') : ''}</Text>
```

### **Pattern 5: RTL-aware Layouts**
```javascript
const { i18n } = useTranslation();
const isRTL = i18n.language === 'ar';

<View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
  <Text>{t('common.title')}</Text>
</View>
```

---

## 🚨 **Common Mistakes to Avoid**

### ❌ **DON'T: Hardcode Text**
```javascript
// Bad
<Text>{isRTL ? 'مرحبا' : 'Hello'}</Text>

// Good
<Text>{t('common.hello')}</Text>
```

### ❌ **DON'T: Forget returnObjects for Arrays**
```javascript
// Bad
const items = t('home.homeNew.seraUpdates.items'); // Returns string

// Good
const items = t('home.homeNew.seraUpdates.items', { returnObjects: true }); // Returns array
```

### ❌ **DON'T: Assume Array Type**
```javascript
// Bad
const items = t('key', { returnObjects: true });
items.map(...); // Crashes if not an array

// Good
const items = t('key', { returnObjects: true });
if (Array.isArray(items)) {
  items.map(...);
}
```

### ❌ **DON'T: Mix Static and Dynamic Content**
```javascript
// Bad
<Text>Welcome, {userName}</Text>

// Good
<Text>{t('common.welcome', { name: userName })}</Text>
```

---

## 📊 **Translation Key Naming Convention**

```
screen.section.subsection.key

Examples:
- home.homeNew.stats.activeComplaints
- compensationStandards.screen.title
- common.buttons.submit
- services.dataShare.title
```

**Rules:**
- Use camelCase for keys
- Use dots (.) to separate levels
- Keep keys descriptive and meaningful
- Group related translations together

---

## 🔄 **Refresh Translations from Supabase**

```javascript
import { refreshI18nTranslations } from '../localization/i18n';

// Manually refresh translations (clears cache and reloads from Supabase)
const handleRefresh = async () => {
  const success = await refreshI18nTranslations();
  if (success) {
    console.log('✅ Translations refreshed');
  }
};
```

---

## 📦 **Supabase Configuration**

```javascript
// In src/services/supabaseService.js

const supabaseUrl = 'https://yxlfdigmbgxhfeudnbua.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Translations Table:
// - key: string (e.g., 'home.homeNew.title')
// - language: string ('en' or 'ar')
// - value: JSON (the translation value)
// - category: string (e.g., 'home', 'services')
// - updated_at: timestamp
```

---

## 🎯 **Best Practices**

1. ✅ **Always use `t()` for user-facing text**
2. ✅ **Keep all translations in `i18n.js`**
3. ✅ **Use descriptive translation keys**
4. ✅ **Test both English and Arabic**
5. ✅ **Check RTL layout in Arabic**
6. ✅ **Upload to Supabase after changes**
7. ✅ **Use `returnObjects: true` for arrays/objects**
8. ✅ **Always check `Array.isArray()` before mapping**
9. ✅ **Keep static fallback in `i18n.js`**
10. ✅ **Clear cache when testing translation updates**

---

## 📞 **Support**

- **i18n Documentation:** https://react.i18next.com/
- **Supabase Dashboard:** https://supabase.com/dashboard/project/yxlfdigmbgxhfeudnbua
- **Upload Script:** `node scripts/upload-translations-to-supabase.js`

---

**Last Updated:** 2025-01-27  
**Version:** 1.0  
**Status:** ✅ Active

