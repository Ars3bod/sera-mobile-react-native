# 🔤 **دليل الخطوط - SERA App**

## 📖 **نظرة عامة**

يستخدم تطبيق SERA خط **IBM Plex Sans** من Google Fonts كخط أساسي عبر جميع منصات التطبيق (iOS & Android).

## 🎨 **لماذا IBM Plex Sans؟**

- ✅ **دعم ممتاز للعربية**: يدعم الأحرف العربية بشكل مثالي
- ✅ **مقروئية عالية**: مصمم لسهولة القراءة على الشاشات
- ✅ **تنوع الأوزان**: 4 أوزان مختلفة (Regular, Medium, SemiBold, Bold)
- ✅ **متوافق عالمياً**: يعمل بشكل مثالي مع النصوص الإنجليزية والعربية
- ✅ **احترافي**: من تطوير IBM، جودة عالية ومحدث باستمرار

## 📦 **الأوزان المتاحة**

| الوزن              | اسم الملف                 | الاستخدام                         |
| ------------------ | ------------------------- | --------------------------------- |
| **Regular (400)**  | `IBMPlexSans_400Regular`  | النصوص العادية، المحتوى الأساسي   |
| **Medium (500)**   | `IBMPlexSans_500Medium`   | التسميات، النصوص المهمة           |
| **SemiBold (600)** | `IBMPlexSans_600SemiBold` | العناوين الفرعية، أزرار           |
| **Bold (700)**     | `IBMPlexSans_700Bold`     | العناوين الرئيسية، النصوص المميزة |

## 🚀 **كيفية الاستخدام**

### 1. **استخدام StyleManager**

```javascript
import StyleManager from '../styles/StyleManager';

const styleManager = StyleManager.getInstance();
const styles = styleManager.getCommonStyles();

// الخط يُطبق تلقائياً عبر StyleManager
<Text style={styles.headerText}>العنوان الرئيسي</Text>;
```

### 2. **استخدام FontUtils (الطريقة السهلة)**

```javascript
import { TextStyles, getTextStyle } from '../utils/fontUtils';

// استخدام الأنماط الجاهزة
<Text style={TextStyles.h1()}>عنوان رئيسي</Text>
<Text style={TextStyles.body1()}>نص عادي</Text>
<Text style={TextStyles.button()}>نص زر</Text>

// إنشاء نمط مخصص
<Text style={getTextStyle('semiBold', 18, '#00623B', 'center')}>
  نص مخصص
</Text>
```

### 3. **الاستخدام المباشر**

```javascript
const customStyle = {
  fontFamily: 'IBMPlexSans_600SemiBold',
  fontSize: 18,
  color: '#00623B',
};

<Text style={customStyle}>نص مخصص</Text>;
```

## 🎯 **أفضل الممارسات**

### **للعناوين الرئيسية**

```javascript
// استخدم Bold للعناوين المهمة
fontFamily: 'IBMPlexSans_700Bold'
fontSize: 24-32px
```

### **للعناوين الفرعية**

```javascript
// استخدم SemiBold للعناوين الفرعية
fontFamily: 'IBMPlexSans_600SemiBold'
fontSize: 18-24px
```

### **للنصوص العادية**

```javascript
// استخدم Regular للمحتوى العادي
fontFamily: 'IBMPlexSans_400Regular'
fontSize: 14-16px
```

### **للأزرار والتسميات**

```javascript
// استخدم Medium للأزرار والتسميات
fontFamily: 'IBMPlexSans_500Medium'
fontSize: 14-18px
```

## 🔧 **التكوين التقني**

### **تثبيت الخط**

```bash
npm install @expo-google-fonts/ibm-plex-sans expo-font --legacy-peer-deps
```

### **التحميل في App.js**

```javascript
import {FontProvider} from './src/context/FontProvider';

export default function App() {
  return <FontProvider>{/* باقي التطبيق */}</FontProvider>;
}
```

### **أحجام الخط المستخدمة**

```javascript
sizes: {
  xs: 13,     // للتسميات الصغيرة
  sm: 15,     // للنصوص الثانوية
  base: 16,   // للنصوص العادية
  lg: 18,     // للعناوين الصغيرة
  xl: 20,     // للعناوين المتوسطة
  xxl: 22,    // للعناوين الكبيرة
  xxxl: 24,   // للعناوين الرئيسية
  huge: 28,   // للعناوين المميزة
  massive: 32,// للعناوين الضخمة
  giant: 40,  // للشعارات والعناوين الكبرى
}
```

## 🌍 **دعم اللغات**

- ✅ **العربية**: دعم كامل مع RTL
- ✅ **الإنجليزية**: دعم كامل مع LTR
- ✅ **الأرقام**: دعم الأرقام العربية والإنجليزية
- ✅ **الرموز**: دعم جميع الرموز الخاصة

## 🎨 **مثال شامل**

```javascript
import React from 'react';
import {View, Text} from 'react-native';
import {TextStyles} from '../utils/fontUtils';

const ExampleScreen = () => {
  return (
    <View>
      <Text style={TextStyles.h1()}>العنوان الرئيسي</Text>
      <Text style={TextStyles.h3()}>العنوان الفرعي</Text>
      <Text style={TextStyles.body1()}>
        هذا نص تجريبي يوضح استخدام خط IBM Plex Sans في تطبيق SERA مع دعم كامل
        للغة العربية.
      </Text>
      <Text style={TextStyles.caption()}>تسمية صغيرة</Text>
    </View>
  );
};
```

## 🚦 **اختبار الخط**

للتأكد من تحميل الخط بشكل صحيح:

1. قم بتشغيل التطبيق: `npx expo start --clear`
2. تأكد من ظهور شاشة التحميل أولاً (FontProvider)
3. تحقق من ظهور النصوص بالخط الجديد
4. جرب تبديل اللغة للتأكد من دعم RTL/LTR

## 📱 **معاينة الخط**

يمكنك معاينة الخط على: [IBM Plex Sans - Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Sans)

---

_تم تطوير نظام الخطوط بعناية لضمان أفضل تجربة مستخدم عربية واحترافية._
