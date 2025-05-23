import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {
    translation: {
      login: 'Login',
      login_subtitle:
        'Identity Verification For Saudi citizens or residents with Saudi residency',
      login_button: 'Login via Nafath',
      nafathLogin: {
        title: 'Nafath',
        subtitle: 'Enter your National ID to continue logging in with Nafath',
        placeholder: 'National ID Number',
        continue: 'Continue',
        loading: '...',
        error: 'Error',
        loginFailed: 'Failed to login with Nafath.',
      },
      nafathVerification: {
        title: 'Nafath',
        subtitle:
          'Identity Verification For Saudi citizens or residents with Saudi residency',
        remainingTime: 'Remaining time',
        resendRequest: 'Resend Request',
        verificationFailed: 'Verification failed or timed out.',
        timeoutError: 'Verification timed out.',
        resendFailed: 'Failed to resend request.',
        openAppTitle: 'Open Nafath App',
        openAppMessage: 'This would open the Nafath app.',
        openApp: 'Open Nafath App',
        appNotInstalledTitle: 'Nafath App Not Installed',
        appNotInstalledMessage:
          'Nafath app is not installed on your device. Would you like to download it from the store?',
        cancel: 'Cancel',
        download: 'Download',
        errorTitle: 'Error',
        errorMessage:
          'An error occurred while trying to open Nafath app. Please try again.',
      },
      home: {
        header: 'Saudi Electricity Regulatory Authority',
        subHeader:
          'Regulating the electricity sector, protecting consumers, ensuring service sustainability, and achieving balance among stakeholders with fairness and transparency.',
        mainCards: {
          consumer: 'Consumer',
          investor: 'Investor',
          serviceProvider: 'Service Provider',
        },
        infoCards: {
          rightsTitle: 'Consumer Rights & Responsibilities',
          rightsDesc:
            'Learn about your rights and duties as an electricity service consumer',
          compensationTitle: 'Consumer Compensation',
          compensationDesc:
            'Learn about your rights and duties as an electricity service consumer',
        },
        sectionTitle: 'Consumer Protection',
        sectionDesc:
          'Consumer protection and care for their rights is a main focus of the Authority through activating its regulatory and supervisory role, and ensuring communication with consumers to guarantee the reliability and efficiency of the provided electricity service.',
        tabs: {
          main: 'Main',
          services: 'Services',
          chat: 'Chat',
          more: 'More',
        },
      },
      // ...add more keys as needed
    },
  },
  ar: {
    translation: {
      login: 'تسجيل الدخول',
      login_subtitle: 'التحقق من الهوية للمواطنين والمقيمين في السعودية',
      login_button: 'تسجيل الدخول عبر نفاذ',
      nafathLogin: {
        title: 'نفاذ',
        subtitle: 'أدخل رقم الهوية لمتابعة تسجيل الدخول باستخدام نفاذ',
        placeholder: 'رقم الهوية الوطنية',
        continue: 'استمرار',
        loading: '...',
        error: 'خطأ',
        loginFailed: 'فشل في تسجيل الدخول عبر نفاذ.',
      },
      nafathVerification: {
        title: 'نفاذ',
        subtitle: 'التحقق من الهوية للمواطنين والمقيمين في السعودية',
        remainingTime: 'الوقت المتبقي',
        resendRequest: 'إعادة إرسال الطلب',
        verificationFailed: 'فشل التحقق أو انتهت المهلة الزمنية.',
        timeoutError: 'انتهت مهلة التحقق.',
        resendFailed: 'فشل في إعادة إرسال الطلب.',
        openAppTitle: 'فتح تطبيق نفاذ',
        openAppMessage: 'سيتم فتح تطبيق نفاذ.',
        openApp: 'فتح تطبيق نفاذ',
        appNotInstalledTitle: 'تطبيق نفاذ غير مثبت',
        appNotInstalledMessage:
          'تطبيق نفاذ غير مثبت على جهازك. هل تريد تنزيله من متجر التطبيقات؟',
        cancel: 'إلغاء',
        download: 'تنزيل',
        errorTitle: 'خطأ',
        errorMessage:
          'حدث خطأ أثناء محاولة تشغيل تطبيق نفاذ. يرجى المحاولة مرة أخرى.',
      },
      home: {
        header: 'الهيئة السعودية لتنظيم الكهرباء',
        subHeader:
          'تنظيم قطاع الكهرباء، حماية للمستهلك، واستدامة للخدمة، وتحقيقًا للتوازن بين أصحاب المصلحة، بعدالة وشفافية.',
        mainCards: {
          consumer: 'المستهلك',
          investor: 'المستثمر',
          serviceProvider: 'مقدم الخدمة',
        },
        infoCards: {
          rightsTitle: 'حقوق المستهلك ومسؤولياته',
          rightsDesc: 'تعرف على حقوقك وواجباتك كمستهلك للخدمة الكهربائية',
          compensationTitle: 'تعويض المستهلك',
          compensationDesc: 'تعرف على حقوقك وواجباتك كمستهلك للخدمة الكهربائية',
        },
        sectionTitle: 'حماية المستهلك',
        sectionDesc:
          'حماية المستهلك وعناية بحقوقه تشكل محورًا رئيسيًا من محاور اهتمام الهيئة من خلال تفعيل دور الهيئة التنظيمي والرقابي، وضمان التواصل مع المستهلك لضمان موثوقية وكفاءة الخدمة الكهربائية المقدمة.',
        tabs: {
          main: 'الرئيسية',
          services: 'الخدمات',
          chat: 'المحادثة',
          more: 'المزيد',
        },
      },
      // ...add more keys as needed
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
