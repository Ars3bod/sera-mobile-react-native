# 🔍 Hardcoded Content Audit - SERA Mobile App

## 📋 Summary
This document identifies all screens with hardcoded content that should be moved to `i18n.js` for proper internationalization and dynamic content management via Supabase.

---

## 🚨 **CRITICAL - Screens with Extensive Hardcoded Content**

### 1. **HomeScreenNew.js** ⚠️ HIGH PRIORITY
**Location:** `src/screens/HomeScreenNew.js`
**Lines:** 72-133, 136-240

#### Hardcoded Content:
- **`translations` object (lines 72-133):**
  - `lastVisit`, `accountVerified`
  - `stats` (activeComplaints, completed, pending)
  - `quickActionsTitle`, `quickActions` (4 items)
  - `recentActivityTitle`, `activities` (6 items)
  - `comingSoon` modal (title, message, okButton)
  - `tabs` (main, services, chat, more)
  - `seraUpdates` (title, seeAll, new)
  - `profile.viewProfile`
  - `compensation` (title, subtitle, viewAll, period, compensation, additionalCompensation)

- **`seraUpdates` array (lines 136-176):**
  - 3 update items with Arabic/English titles and descriptions
  - Includes: announcements, news, regulations

- **`compensationStandards` array (lines 179-240):**
  - 4 compensation standards with full details
  - Each has: title, period, compensation, additionalCompensation, color, category

#### Recommendation:
```javascript
// REPLACE WITH:
const translations = {
  lastVisit: t('home.homeNew.lastVisit'),
  accountVerified: t('home.homeNew.accountVerified'),
  // ... etc
};

// And move seraUpdates & compensationStandards data to:
// 1. Supabase for dynamic content, OR
// 2. i18n.js as static fallback
```

---

### 2. **CompensationStandardsScreen.js** ⚠️ HIGH PRIORITY
**Location:** `src/screens/CompensationStandardsScreen.js`
**Lines:** 31-229, 231-263

#### Hardcoded Content:
- **`compensationStandards` array (lines 31-229):**
  - 9 comprehensive compensation standards
  - Each standard includes:
    - `id`, `icon`, `title`, `description`
    - `conditions`, `period`, `compensation`
    - `additionalCompensation`, `notes`
    - `color`, `category`
  - **Total:** ~200 lines of hardcoded bilingual content

- **`translations` object (lines 231-263):**
  - Screen-specific labels: title, subtitle, description
  - Field labels: conditions, period, compensation, etc.
  - Categories: service, restoration, notification, emergency, violation, complaint
  - Quick stats labels
  - Download guide button text

#### Current Structure Example:
```javascript
{
  id: 1,
  title: isRTL
    ? 'مدة تسجيل العداد باسم المستهلك'
    : 'Meter Registration Period in Consumer Name',
  description: isRTL
    ? 'طلب تسجيل العداد...'
    : 'Request to register...',
  // ... 6 more fields per standard
}
```

#### Recommendation:
```javascript
// MOVE TO i18n.js:
compensationStandards: {
  screen: {
    title: '...',
    subtitle: '...',
    // labels
  },
  standards: [
    {
      id: 1,
      titleKey: 'compensationStandards.standards.1.title',
      descriptionKey: 'compensationStandards.standards.1.description',
      // etc
    }
  ]
}
```

---

## ⚠️ **MEDIUM PRIORITY - Screens with Mock/Hardcoded Data**

### 3. **NewsScreen.js**
**Location:** `src/screens/NewsScreen.js`
**Lines:** 46+

#### Hardcoded Content:
- `newsData` array with mock news articles
- Each article has: title, excerpt, date, category, imageUrl

#### Recommendation:
- Should fetch from API/Supabase
- Add i18n keys for "No news available" messages

---

### 4. **FAQScreen.js**
**Location:** `src/screens/FAQScreen.js`
**Lines:** 44+

#### Hardcoded Content:
- FAQ questions and answers (already in i18n)
- ✅ Already properly using `t('faq.questions')`

**Status:** ✅ Good - Already implemented correctly

---

### 5. **ChatbotScreen.js**
**Location:** `src/screens/ChatbotScreen.js`
**Lines:** 46-50, 114-115

#### Hardcoded Content:
- Initial bot message: `isRTL ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟' : 'Hello! How can I assist you today?'`
- Bot nickname: `isRTL ? 'المساعد الذكي' : 'AI Assistant'`

#### Recommendation:
```javascript
// ADD TO i18n.js:
chat: {
  chatbot: {
    welcomeMessage: '...',
    botName: '...'
  }
}
```

---

## 📊 **Statistics**

| Screen | Hardcoded Lines | Content Type | Priority |
|--------|----------------|--------------|----------|
| **HomeScreenNew.js** | ~168 lines | UI Text + Data Arrays | 🔴 HIGH |
| **CompensationStandardsScreen.js** | ~230 lines | UI Text + Standards Data | 🔴 HIGH |
| **ChatbotScreen.js** | ~4 lines | Welcome Messages | 🟡 MEDIUM |
| **NewsScreen.js** | Variable | Mock Data | 🟡 MEDIUM |
| **FAQScreen.js** | 0 | Already using i18n | ✅ DONE |

**Total Hardcoded Content:** ~400+ lines across 2 main screens

---

## 🎯 **Recommended Action Plan**

### Phase 1: Move Static Text to i18n.js ⚠️ URGENT
1. **HomeScreenNew.js**
   - Move `translations` object → `i18n.js` under `home.homeNew.*`
   - Estimated time: 30 minutes

2. **CompensationStandardsScreen.js**
   - Move `translations` object → `i18n.js` under `compensationStandards.*`
   - Estimated time: 20 minutes

### Phase 2: Restructure Data Arrays 📦
3. **HomeScreenNew.js - Compensation Standards**
   - Move `compensationStandards` array data → `i18n.js`
   - Reference by keys instead of inline objects
   - Estimated time: 1 hour

4. **CompensationStandardsScreen.js - Full Standards**
   - Move entire `compensationStandards` array → `i18n.js`
   - Update component to use translation keys
   - Estimated time: 2 hours

### Phase 3: Dynamic Content (Future Enhancement) 🚀
5. **SERA Updates (seraUpdates)**
   - Consider fetching from Supabase/API instead of hardcoded
   - Add fallback to i18n if API fails

6. **News & Announcements**
   - Connect to CMS/Supabase for dynamic updates

---

## 📝 **i18n.js Structure Additions Needed**

```javascript
// Add to staticResources in i18n.js:

// For HomeScreenNew.js
home: {
  homeNew: {
    lastVisit: 'Last visit',
    accountVerified: 'Account Verified',
    stats: {
      activeComplaints: 'Active',
      completed: 'Completed',
      pending: 'Pending',
    },
    quickActionsTitle: 'Quick Actions',
    quickActions: {
      newComplaint: 'New Complaint',
      newPermit: 'New Permit',
      contactUs: 'Contact Us',
      shareData: 'Share Data',
    },
    recentActivityTitle: 'Recent Activity',
    activities: {
      complaintReply: 'Your complaint received a reply',
      permitReceived: 'Permit request received',
      newUpdate: 'New update available',
      twoHoursAgo: '2 hours ago',
      yesterday: 'Yesterday',
      threeDaysAgo: '3 days ago',
    },
    seraUpdates: {
      title: 'Latest SERA Updates',
      seeAll: 'See All',
      new: 'New',
      items: [
        {
          id: 1,
          type: 'announcement',
          title: 'Important: Electricity Systems Update',
          description: 'National electricity grid systems updated for improved service',
          time: '1 hour ago',
        },
        // ... more items
      ]
    },
    compensation: {
      title: 'Compensation Standards',
      subtitle: 'Your Rights as Electricity Consumer',
      viewAll: 'View All Standards',
      period: 'Required Period',
      compensation: 'Compensation',
      additionalCompensation: 'Additional Compensation',
      standards: [
        {
          id: 1,
          title: 'Register/Cancel Electricity Service',
          period: 'Within 3 working days',
          compensation: 'SAR 100',
          additionalCompensation: 'SAR 20 per additional working day or part thereof',
        },
        // ... 3 more items
      ]
    },
  },
},

// For CompensationStandardsScreen.js
compensationStandards: {
  screen: {
    title: 'Compensation Standards',
    subtitle: 'Your Rights as Electricity Consumer',
    description: 'Standard Description',
    conditions: 'Eligibility Condition',
    period: 'Time Period',
    compensation: 'Compensation Amount for Non-Compliance',
    additionalCompensation: 'Continued Non-Compliance "Additional Compensation"',
    notes: 'Additional Notes',
    mainDescription: 'Learn about your compensation rights when service providers fail to meet the standards...',
    downloadGuide: 'Download Simplified Guide',
    categories: {
      service: 'Electricity Services',
      restoration: 'Service Restoration',
      notification: 'Notifications',
      emergency: 'Emergency',
      violation: 'Violations',
      complaint: 'Complaints',
    },
    quickStats: {
      totalStandards: 'Available Standards',
      avgCompensation: 'Average Compensation',
      maxCompensation: 'Highest Compensation',
    },
  },
  standards: [
    {
      id: 1,
      category: 'service',
      title: 'Meter Registration Period in Consumer Name',
      description: 'Request to register the meter in the name of property owner or tenant...',
      conditions: 'Attach all required documents',
      period: '3 working days',
      compensation: 'SAR 100',
      additionalCompensation: 'SAR 20 per additional working day or part thereof',
      notes: 'Period starts from the working day following the request submission',
    },
    // ... 8 more standards (total 9)
  ]
},

// For ChatbotScreen.js
chat: {
  chatbot: {
    welcomeMessage: 'Hello! How can I assist you today?',
    botName: 'AI Assistant',
  },
},
```

---

## ✅ **Success Criteria**

After implementation, the following should be true:
1. ✅ No `isRTL ? 'Arabic' : 'English'` patterns in screen components
2. ✅ All user-facing text uses `t('key.path')` syntax
3. ✅ Data arrays reference i18n keys instead of inline objects
4. ✅ Easy to update translations via Supabase without code changes
5. ✅ Static fallback available in `i18n.js` if Supabase fails

---

## 🚀 **Next Steps**

1. **Run the upload script** to populate Supabase with current i18n content:
   ```bash
   node scripts/upload-translations-to-supabase.js
   ```

2. **Add missing translations** to `i18n.js` for HomeScreenNew and CompensationStandardsScreen

3. **Update the two screens** to use `t()` instead of hardcoded content

4. **Re-run upload script** to sync new translations to Supabase

5. **Test the app** to ensure all content displays correctly in both languages

---

**Generated:** 2025-01-27  
**Status:** 🔴 Actionable - Requires immediate attention for proper i18n implementation

