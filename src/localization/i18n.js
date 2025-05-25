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
        validating: 'Verifying your information...',
        validationSuccess: 'Information verified successfully',
        validationFailed:
          'Information verification failed, but you can continue',
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
      services: {
        title: 'Electronic Services',
        language: 'عر',
        permitRequest: {
          title: 'Permit Request',
          description:
            'You can request permits to benefit from electronic submission...',
        },
        complaints: {
          title: 'Complaints',
          description:
            'You can submit complaints or objections to the authority...',
        },
        licenseIssuance: {
          title: 'License Issuance',
          description:
            'You can request to benefit from applying for license issuance...',
        },
        dataSharing: {
          title: 'Data Sharing',
          description:
            'Sharing allows information exchange with the applicant...',
        },
        freedomOfInformation: {
          title: 'Freedom of Information',
          description:
            'The authority provides public data according to the freedom of information policy issued by the data management office...',
        },
      },
      more: {
        title: 'More',
        language: 'عر',
        mainActions: 'Main Actions',
        settings: {
          title: 'Settings',
          description: 'Manage your app preferences and account settings',
        },
        aboutUs: {
          title: 'About Us',
          description: 'Learn about SERA and our mission',
        },
        contactUs: {
          title: 'Contact Us',
          description: 'Get in touch with us for support or inquiries',
        },
        news: {
          title: 'News',
          description: 'Stay updated with latest announcements and updates',
        },
        policies: {
          title: 'Policies',
          description: 'Read our terms, privacy policy, and guidelines',
        },
        faq: {
          title: 'FAQ',
          description: 'Find answers to frequently asked questions',
        },
        importantLinks: {
          title: 'Important Links',
          description: 'Quick access to essential resources and websites',
        },
        complaints: {
          title: 'Complaints',
          description: 'Submit and track your complaints easily',
        },
      },
      settings: {
        title: 'Settings',
        language: {
          title: 'Language',
          description: 'Change app language preference',
          current: 'Current: English',
        },
        notifications: {
          title: 'Notifications',
          description: 'Manage notification preferences',
          enabled: 'Enabled',
          disabled: 'Disabled',
        },
        darkMode: {
          title: 'Dark Mode',
          description: 'Switch between light and dark theme',
          enabled: 'Enabled',
          disabled: 'Disabled',
        },
        biometric: {
          title: 'Biometric Login',
          description: 'Use fingerprint or face recognition',
          enabled: 'Enabled',
          disabled: 'Disabled',
        },
        fontSize: {
          title: 'Font Size',
          description: 'Adjust text size for better readability',
          small: 'Small',
          medium: 'Medium',
          large: 'Large',
        },
        clearCache: {
          title: 'Clear Cache',
          description: 'Free up storage space',
        },
        logout: {
          title: 'Logout',
          description: 'Sign out from your account',
          confirmTitle: 'Confirm Logout',
          confirmMessage: 'Are you sure you want to logout?',
          cancel: 'Cancel',
          confirm: 'Logout',
        },
      },
      about: {
        title: 'About Us',
        mission: {
          title: 'Our Mission',
          description:
            'To regulate the electricity sector, protect consumers, ensure service sustainability, and achieve balance among stakeholders with fairness and transparency.',
        },
        vision: {
          title: 'Our Vision',
          description:
            'To be a leading regulatory authority in the electricity sector regionally and globally.',
        },
        values: {
          title: 'Our Values',
          transparency: 'Transparency',
          fairness: 'Fairness',
          excellence: 'Excellence',
          innovation: 'Innovation',
        },
        establishment: {
          title: 'Establishment',
          year: 'Established in 2001',
          description:
            'The Saudi Electricity Regulatory Authority was established to regulate and oversee the electricity sector in the Kingdom of Saudi Arabia.',
        },
      },
      contact: {
        title: 'Contact Us',
        address: {
          title: 'Address',
          street: 'King Fahd Road, Al Olaya District',
          city: 'Riyadh 12333',
          country: 'Saudi Arabia',
        },
        phone: {
          title: 'Phone',
          number: '+966 11 461 0666',
        },
        email: {
          title: 'Email',
          address: 'info@ecra.gov.sa',
        },
        website: {
          title: 'Website',
          url: 'www.ecra.gov.sa',
        },
        workingHours: {
          title: 'Working Hours',
          schedule: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
        },
      },
      news: {
        title: 'News & Updates',
        latest: 'Latest News',
        viewAll: 'View All',
        readMore: 'Read More',
        noNews: 'No news available at the moment.',
        categories: {
          all: 'All',
          announcements: 'Announcements',
          regulations: 'Regulations',
          updates: 'Updates',
        },
      },
      policies: {
        title: 'Policies & Terms',
        privacyPolicy: {
          title: 'Privacy Policy',
          description:
            'Learn how we collect, use, and protect your information.',
        },
        termsOfService: {
          title: 'Terms of Service',
          description: 'Read our terms and conditions for using our services.',
        },
        dataProtection: {
          title: 'Data Protection',
          description: 'Information about how we protect your personal data.',
        },
        cookiePolicy: {
          title: 'Cookie Policy',
          description:
            'Learn about our use of cookies and similar technologies.',
        },
      },
      faq: {
        title: 'Frequently Asked Questions',
        searchPlaceholder: 'Search questions...',
        categories: {
          general: 'General',
          services: 'Services',
          billing: 'Billing',
          technical: 'Technical Support',
        },
        noResults: 'No questions found matching your search.',
        questions: [
          {
            id: 1,
            category: 'general',
            question: 'What is SERA?',
            answer:
              'SERA is the Saudi Electricity Regulatory Authority responsible for regulating the electricity sector in Saudi Arabia and protecting consumers.',
          },
          {
            id: 2,
            category: 'general',
            question: 'How can I submit a complaint?',
            answer:
              'You can submit complaints through our electronic services portal or by contacting customer service.',
          },
          {
            id: 3,
            category: 'services',
            question: 'What electronic services are available?',
            answer:
              'We provide various services such as permit applications, complaint submissions, and license issuance.',
          },
          {
            id: 4,
            category: 'technical',
            question: 'I cannot access my account, what should I do?',
            answer:
              'Make sure your login credentials are correct or contact technical support.',
          },
          {
            id: 5,
            category: 'billing',
            question: 'How can I dispute my electricity bill?',
            answer:
              'You can file a complaint regarding billing issues through our complaint system. We will review your case and respond within 30 days.',
          },
          {
            id: 6,
            category: 'services',
            question: 'How long does it take to process a license application?',
            answer:
              'License applications are typically processed within 60-90 business days, depending on the type and complexity of the application.',
          },
          {
            id: 7,
            category: 'general',
            question: 'What are consumer rights in the electricity sector?',
            answer:
              'Consumers have the right to reliable electricity service, fair pricing, transparent billing, and prompt complaint resolution.',
          },
          {
            id: 8,
            category: 'technical',
            question: 'How do I report a power outage?',
            answer:
              'Contact your electricity service provider directly. For regulatory complaints about service quality, you can also contact SERA.',
          },
        ],
      },
      importantLinks: {
        title: 'Important Links',
        government: {
          title: 'Government Portals',
          saudiGov: 'Saudi.gov.sa',
          vision2030: 'Vision 2030',
          nationalPortal: 'National Portal',
        },
        services: {
          title: 'Related Services',
          sec: 'Saudi Electricity Company',
          waterElectricity: 'Water & Electricity',
          energyEfficiency: 'Energy Efficiency',
        },
        resources: {
          title: 'Resources',
          regulations: 'Regulations & Laws',
          reports: 'Annual Reports',
          statistics: 'Statistics',
        },
      },
      retry: 'Retry',
      complaints: {
        title: 'Complaints',
        description: 'Submit and track your complaints easily',
        welcomeTitle: 'Complaints Center',
        welcomeDescription:
          'Submit complaints and track their status easily and transparently',
        newComplaint: {
          title: 'New Complaint',
          description: 'Submit a new complaint or objection',
        },
        viewComplaints: {
          title: 'View Complaints',
          description: 'View and track your existing complaints',
        },
        filters: {
          all: 'All',
          open: 'Open',
          closed: 'Closed',
          rejected: 'Rejected',
        },
        create: {
          title: 'New Complaint',
          serviceProvider: 'Service Provider',
          serviceProviderPlaceholder: 'Select Service Provider',
          consumptionCategory: 'Consumption Category',
          consumptionCategoryPlaceholder: 'Select Consumption Category',
          complaintType: 'Complaint Type',
          complaintTypePlaceholder: 'Select Complaint Type',
          complaintDetails: 'Complaint Details',
          complaintDetailsPlaceholder: 'Write your complaint details here...',
          attachments: 'Attachments',
          attachFile: 'Attach File',
          attachmentNote:
            'Max size: 20 MB per file\nAllowed types: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          submit: 'Submit Complaint',
          submitting: 'Submitting...',
          success: 'Success',
          successMessage:
            'Your complaint has been submitted successfully. Complaint number: #12345',
          error: 'Error',
          errorMessage: 'Please fill all required fields',
          submitError: 'An error occurred while submitting the complaint',
          uploadFileTitle: 'Upload File',
          uploadFileMessage:
            'Max size: 20 MB\nAllowed types: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          cancel: 'Cancel',
          chooseFile: 'Choose File',
          ok: 'OK',
          close: 'Close',
          required: '*',
        },
        view: {
          title: 'Complaints',
          loading: 'Loading...',
          noComplaints: 'No Complaints',
          noComplaintsMessage: 'No complaints found with the selected filter',
          yourComplaints: 'Your Complaints',
          invalidDate: 'Invalid Date',
          priority: {
            high: 'High',
            medium: 'Medium',
            low: 'Low',
          },
          status: {
            open: 'Open',
            closed: 'Closed',
            rejected: 'Rejected',
          },
        },
        serviceProviders: {
          sec: 'Saudi Electricity Company',
          marafiq: 'Marafiq',
        },
        consumptionCategories: {
          residential: 'Residential',
          commercial: 'Commercial',
          industrial: 'Industrial',
          government: 'Government',
        },
        complaintTypes: {
          powerOutage: 'Power Outage',
          highBill: 'High Bill',
          serviceQuality: 'Service Quality',
          connectionDelay: 'Connection Delay',
          customerService: 'Customer Service',
        },
      },
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
        validating: 'التحقق من معلوماتك...',
        validationSuccess: 'تم التحقق من المعلومات بنجاح',
        validationFailed: 'فشل التحقق من المعلومات، ولكن يمكنك المتابعة',
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
      services: {
        title: 'الخدمات الإلكترونية',
        language: 'EN',
        permitRequest: {
          title: 'طلب تصريح',
          description: 'يمكن طلب التصريح للاستفادة من التقديم الإلكتروني ...',
        },
        complaints: {
          title: 'الشكوى',
          description: 'يمكن تقديم الشكوى أو طلب الاعتراض لدى الهيئة ...',
        },
        licenseIssuance: {
          title: 'إصدار رخصة',
          description: 'يمكن طلب الاستفادة من التقديم على إصدار الرخصة ...',
        },
        dataSharing: {
          title: 'مشاركة البيانات',
          description: 'تتيح المشاركة تبادل المعلومات مع صاحب الطلب ...',
        },
        freedomOfInformation: {
          title: 'حرية المعلومات',
          description:
            'توفر الهيئة البيانات العامة وذلك حسب سياسة حرية المعلومات الصادرة من مكتب إدارة البيانات...',
        },
      },
      more: {
        title: 'المزيد',
        language: 'عر',
        mainActions: 'الإجراءات الرئيسية',
        settings: {
          title: 'الإعدادات',
          description: 'إدارة تفضيلاتك وإعدادات حسابك',
        },
        aboutUs: {
          title: 'عن الهيئة',
          description: 'تعرف على الهيئة ومهمتنا',
        },
        contactUs: {
          title: 'تواصل معنا',
          description: 'إتصل بنا للدعم أو الاستفسارات',
        },
        news: {
          title: 'الأخبار',
          description: 'تبقى على اطلاع بأحدث الإعلانات والتحديثات',
        },
        policies: {
          title: 'السياسات',
          description: 'قراءة موافقاتنا وسياسة الخصوصية والمبادئ',
        },
        faq: {
          title: 'الأسئلة الشائعة',
          description: 'إيجاد إجابات على الأسئلة الشائعة',
        },
        importantLinks: {
          title: 'الروابط المهمة',
          description: 'الوصول السريع إلى الموارد والمواقع الأساسية',
        },
        complaints: {
          title: 'الشكاوى',
          description: 'تقديم ومتابعة شكاويك بسهولة',
        },
      },
      settings: {
        title: 'الإعدادات',
        language: {
          title: 'اللغة',
          description: 'تغيير تفضيلات التطبيق',
          current: 'الحالي: العربية',
        },
        notifications: {
          title: 'الإشعارات',
          description: 'إدارة تفضيلات الإشعارات',
          enabled: 'مفعل',
          disabled: 'غير مفعل',
        },
        darkMode: {
          title: 'الوضع الليلي',
          description: 'التبديل بين الوضعين الضوئي والليلي',
          enabled: 'مفعل',
          disabled: 'غير مفعل',
        },
        biometric: {
          title: 'تسجيل الدخول بصمة الإصبع أو الوجه',
          description: 'استخدام الإصبع أو التعرف على الوجه',
          enabled: 'مفعل',
          disabled: 'غير مفعل',
        },
        fontSize: {
          title: 'حجم الخط',
          description: 'تعديل حجم الخط لإتاحة القراءة',
          small: 'صغير',
          medium: 'متوسط',
          large: 'كبير',
        },
        clearCache: {
          title: 'مسح التخزين',
          description: 'تخفيض مساحة التخزين',
        },
        logout: {
          title: 'تسجيل الخروج',
          description: 'تسجيل الخروج من حسابك',
          confirmTitle: 'تأكيد تسجيل الخروج',
          confirmMessage: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
          cancel: 'إلغاء',
          confirm: 'تسجيل الخروج',
        },
      },
      about: {
        title: 'عن الهيئة',
        mission: {
          title: 'مهمتنا',
          description:
            'لتنظيم قطاع الكهرباء، حماية المستهلك، واستدامة الخدمة، وتحقيق التوازن بين أصحاب المصلحة، بعدالة وشفافية.',
        },
        vision: {
          title: 'رؤيتنا',
          description:
            'لتكون مؤسسة تنظيمية رائدة في مجال الكهرباء في المنطقة والعالمية.',
        },
        values: {
          title: 'قيمنا',
          transparency: 'الشفافية',
          fairness: 'العدالة',
          excellence: 'الكفاءة',
          innovation: 'الابتكار',
        },
        establishment: {
          title: 'تأسيس',
          year: 'تأسست عام 2001',
          description:
            'الهيئة السعودية لتنظيم الكهرباء تأسست لتنظيم ورقابة قطاع الكهرباء في المملكة العربية السعودية.',
        },
      },
      contact: {
        title: 'تواصل معنا',
        address: {
          title: 'العنوان',
          street: 'شارع الملك فهد، منطقة العليا، الرياض 12333',
          city: 'الرياض',
          country: 'المملكة العربية السعودية',
        },
        phone: {
          title: 'الهاتف',
          number: '+966 11 461 0666',
        },
        email: {
          title: 'البريد الإلكتروني',
          address: 'Info@sera.gov.sa',
        },
        website: {
          title: 'الموقع الإلكتروني',
          url: 'www.sera.gov.sa',
        },
        workingHours: {
          title: 'ساعات العمل',
          schedule: 'الأحد - الخميس: من 8:00 صباعا إلى 4:00 مساء',
        },
      },
      news: {
        title: 'الأخبار والتحديثات',
        latest: 'أحدث الأخبار',
        viewAll: 'إظهار الكل',
        readMore: 'قراءة المزيد',
        noNews: 'لا توجد أخبار متاحة في الوقت الحالي.',
        categories: {
          all: 'الكل',
          announcements: 'الإعلانات',
          regulations: 'التنظيمات',
          updates: 'التحديثات',
        },
      },
      policies: {
        title: 'السياسات والشروط',
        privacyPolicy: {
          title: 'سياسة الخصوصية',
          description: 'تعرف على كيفية جمع واستخدام وحماية معلوماتك.',
        },
        termsOfService: {
          title: 'شروط الخدمة',
          description: 'قراءة شروط وأحكامنا لاستخدام خدماتنا.',
        },
        dataProtection: {
          title: 'حماية البيانات',
          description: 'معلومات عن حماية البيانات الشخصية لدينا.',
        },
        cookiePolicy: {
          title: 'سياسة الملفات المؤقتة',
          description:
            'تعرف على كيفية استخدامنا للملفات المؤقتة وتكنولوجيات مماثلة.',
        },
      },
      faq: {
        title: 'الأسئلة الشائعة',
        searchPlaceholder: 'ابحث عن الأسئلة...',
        categories: {
          general: 'عام',
          services: 'الخدمات',
          billing: 'الفوترة',
          technical: 'دعم تكنولوجي',
        },
        noResults: 'لم يتم العثور على أسئلة مطابقة لبحثك.',
        questions: [
          {
            id: 1,
            category: 'general',
            question: 'ما هي الهيئة السعودية لتنظيم الكهرباء؟',
            answer:
              'الهيئة السعودية لتنظيم الكهرباء مسؤولة عن تنظيم قطاع الكهرباء في المملكة العربية السعودية وحماية المستهلك.',
          },
          {
            id: 2,
            category: 'general',
            question: 'كيف يمكنني تقديم شكوى؟',
            answer:
              'يمكنك تقديم الشكوى عبر بوابة الخدمات الإلكترونية أو من خلال الاتصال بخدمة العملاء.',
          },
          {
            id: 3,
            category: 'services',
            question: 'ما هي الخدمات الإلكترونية المتاحة؟',
            answer:
              'نوفر خدمات متنوعة مثل طلب التصاريح، تقديم الشكاوى، وإصدار التراخيص.',
          },
          {
            id: 4,
            category: 'technical',
            question: 'لا أستطيع الوصول إلى حسابي، ماذا أفعل؟',
            answer: 'تأكد من صحة بيانات تسجيل الدخول أو تواصل مع الدعم الفني.',
          },
          {
            id: 5,
            category: 'billing',
            question: 'كيف يمكنني الاعتراض على فاتورة الكهرباء؟',
            answer:
              'يمكنك تقديم شكوى بخصوص مشاكل الفوترة من خلال نظام الشكاوى لدينا. سنراجع حالتك ونرد خلال 30 يوماً.',
          },
          {
            id: 6,
            category: 'services',
            question: 'كم يستغرق معالجة طلب الترخيص؟',
            answer:
              'عادة ما تتم معالجة طلبات التراخيص خلال 60-90 يوم عمل، حسب نوع وتعقيد الطلب.',
          },
          {
            id: 7,
            category: 'general',
            question: 'ما هي حقوق المستهلك في قطاع الكهرباء؟',
            answer:
              'للمستهلكين الحق في خدمة كهرباء موثوقة، وتسعير عادل، وفوترة شفافة، وحل سريع للشكاوى.',
          },
          {
            id: 8,
            category: 'technical',
            question: 'كيف أبلغ عن انقطاع في الكهرباء؟',
            answer:
              'اتصل بمقدم خدمة الكهرباء مباشرة. للشكاوى التنظيمية حول جودة الخدمة، يمكنك أيضاً التواصل مع الهيئة.',
          },
        ],
      },
      importantLinks: {
        title: 'الروابط المهمة',
        government: {
          title: 'بوابات الحكومة',
          saudiGov: 'saudi.gov.sa',
          vision2030: 'رؤية 2030',
          nationalPortal: 'بوابة الموقع الوطني',
        },
        services: {
          title: 'الخدمات المرتبطة',
          sec: 'شركة الكهرباء السعودية',
          waterElectricity: 'المياه والكهرباء',
          energyEfficiency: 'كفاءة الطاقة',
        },
        resources: {
          title: 'الموارد',
          regulations: 'التنظيمات والقوانين',
          reports: 'تقارير السنوية',
          statistics: 'الإحصائيات',
        },
      },
      retry: 'إعادة المحاولة',
      complaints: {
        title: 'الشكاوى',
        description: 'تقديم ومتابعة شكاويك بسهولة',
        welcomeTitle: 'مركز الشكاوى',
        welcomeDescription: 'تقديم الشكاوى ومتابعة حالتها بسهولة وشفافية',
        newComplaint: {
          title: 'شكوى جديدة',
          description: 'تقديم شكوى أو اعتراض جديد',
        },
        viewComplaints: {
          title: 'عرض الشكاوى',
          description: 'عرض ومتابعة شكاويك الحالية',
        },
        filters: {
          all: 'الكل',
          open: 'مفتوحة',
          closed: 'مغلقة',
          rejected: 'مرفوضة',
        },
        create: {
          title: 'شكوى جديدة',
          serviceProvider: 'مقدم الخدمة',
          serviceProviderPlaceholder: 'اختر مقدم الخدمة',
          consumptionCategory: 'فئة الاستهلاك',
          consumptionCategoryPlaceholder: 'اختر فئة الاستهلاك',
          complaintType: 'نوع الشكوى',
          complaintTypePlaceholder: 'اختر نوع الشكوى',
          complaintDetails: 'تفاصيل الشكوى',
          complaintDetailsPlaceholder: 'اكتب تفاصيل شكواك هنا...',
          attachments: 'المرفقات',
          attachFile: 'إرفاق ملف',
          attachmentNote:
            'الحد الأقصى: 20 ميجا لكل ملف\nالأنواع المسموحة: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          submit: 'تقديم الشكوى',
          submitting: 'جاري التقديم...',
          success: 'تم بنجاح',
          successMessage: 'تم تقديم شكواك بنجاح. رقم الشكوى: #12345',
          error: 'خطأ',
          errorMessage: 'يرجى ملء جميع الحقول المطلوبة',
          submitError: 'حدث خطأ أثناء تقديم الشكوى',
          uploadFileTitle: 'رفع ملف',
          uploadFileMessage:
            'الحد الأقصى: 20 ميجا\nالأنواع المسموحة: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          cancel: 'إلغاء',
          chooseFile: 'اختيار ملف',
          ok: 'موافق',
          close: 'إغلاق',
          required: '*',
        },
        view: {
          title: 'الشكاوى',
          loading: 'جاري التحميل...',
          noComplaints: 'لا توجد شكاوى',
          noComplaintsMessage: 'لم يتم العثور على أي شكاوى بالفلتر المحدد',
          yourComplaints: 'شكاويك',
          invalidDate: 'تاريخ غير صحيح',
          priority: {
            high: 'عالية',
            medium: 'متوسطة',
            low: 'منخفضة',
          },
          status: {
            open: 'مفتوحة',
            closed: 'مغلقة',
            rejected: 'مرفوضة',
          },
        },
        serviceProviders: {
          sec: 'الشركة السعودية للكهرباء',
          marafiq: 'مرافق',
        },
        consumptionCategories: {
          residential: 'سكني',
          commercial: 'تجاري',
          industrial: 'صناعي',
          government: 'حكومي',
        },
        complaintTypes: {
          powerOutage: 'انقطاع الكهرباء',
          highBill: 'فاتورة مرتفعة',
          serviceQuality: 'جودة الخدمة',
          connectionDelay: 'تأخير في التوصيل',
          customerService: 'خدمة العملاء',
        },
      },
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
