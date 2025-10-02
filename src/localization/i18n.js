import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        cancel: 'Cancel',
        ok: 'OK',
        close: 'Close',
        exit: 'Exit',
        error: 'Error',
        save: 'Save',
        submit: 'Submit',
        loading: 'Loading...',
        retry: 'Retry',
        goBack: "Go Back",
        notAvailable: "Not Available",
        networkError: "Network connection error",
        yesterday: 'Yesterday',
        daysAgo: '{{count}} days ago',
        invalidDate: 'Invalid Date',
        success: 'Success',
      },
      navigation: {
        restrictedMessage: 'Cannot navigate back to login screens',
        exitAppMessage: 'Press back again to exit the app',
      },
      session: {
        warning: {
          title: 'Session Expiring Soon',
          message: 'Your session will expire in {{minutes}} minutes due to inactivity. Do you want to stay logged in?',
          stayLoggedIn: 'Stay Logged In',
          logout: 'Logout Now',
        },
        expiry: {
          title: 'Session Expired',
          idleMessage: 'Your session has expired due to inactivity. Please login again to continue.',
          maxDurationMessage: 'Your session has expired due to maximum duration limit. Please login again to continue.',
          loginAgain: 'Login Again',
        },
      },
      permissions: {
        storage: {
          title: "Storage Permission",
          message: "This app needs storage permission to download files to your device.",
          neutral: "Ask me later",
          denied: "Storage permission is required to download files. Please enable it in device settings.",
        },
      },
      errors: {
        insufficientStorage: "Insufficient storage space on device. Please free up some space and try again.",
      },
      auth: {
        login: 'Login',
        cancel: 'Cancel',
        loginRequired: 'Login Required',
        loginRequiredMessage: 'You need to login to access this feature. Please login with your Nafath account to continue.',
      },
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
        comingSoon: {
          title: 'Coming Soon',
          message: 'This feature is coming soon. Stay tuned for updates!',
          okButton: 'OK',
        },
        greeting: {
          morning: 'Good Morning',
          afternoon: 'Good Afternoon',
          evening: 'Good Evening',
        },
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
            myReports: 'My Reports',
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
        },
      },
      services: {
        title: 'Electronic Services',
        language: 'عر',
        comingSoon: 'Coming Soon',
        description: {
          title: 'Digital Government Services',
          subtitle: 'Access SERA\'s digital services anytime, anywhere. Submit requests, track applications, and manage your account with ease and security.',
        },
        permitRequest: {
          title: 'Permit Request',
          description:
            'You can request permits to benefit from electronic submission...',
          detailedDescription: 'Service description coming soon.',
        },
        complaints: {
          title: 'Complaints',
          description:
            'You can submit complaints or objections to the authority...',
          detailedDescription: 'The service enables you to submit or escalate a complaint with SERA if you are unhappy with the outcome of the service provider\'s handling of your complaint, or if there is a delay in resolving it. It also allows you to follow up on the status of your complaint. The service is available 24/7 through various service delivery channels.',
        },
        licenseIssuance: {
          title: 'License Issuance',
          description:
            'You can request to benefit from applying for license issuance...',
          detailedDescription: 'Service description coming soon.',
        },
        dataSharing: {
          title: 'Data Sharing',
          description:
            'Sharing allows information exchange with the applicant...',
          detailedDescription: 'Service description coming soon.',
        },
        freedomOfInformation: {
          title: 'Freedom of Information',
          description:
            'The authority provides public data according to the freedom of information policy issued by the data management office...',
          detailedDescription: 'Service description coming soon.',
        },
      },
      consumptionTariff: {
        title: 'Consumption Tariff',
        description: {
          title: 'Electricity Consumption Tariff',
          content: 'The electricity consumption tariff is the price charged for electricity consumption by different consumer categories. These tariffs are set by SERA to ensure fair pricing while promoting efficient electricity use.',
        },
        stats: {
          categories: 'Categories',
          tariffRange: 'Tariff Range (HH/kWh)',
          effectiveYear: 'Effective Year',
        },
        table: {
          consumptionRange: 'Consumption Range (kWh/month)',
          networkType: 'Network Type',
          tariff: 'Tariff (HH/kWh)',
        },
        units: {
          kwhMonth: 'kWh/month',
          hhKwh: 'HH/kWh',
        },
        ranges: {
          all: 'All consumption levels',
        },
        networkTypes: {
          distributionnetwork: 'Connected to Distribution Network',
          transmissionnetwork: 'Connected to Transmission Network',
        },
        categories: {
          residential: {
            title: 'Residential',
          },
          commercial: {
            title: 'Commercial',
          },
          governmental: {
            title: 'Governmental',
          },
          industrial: {
            title: 'Industrial',
          },
          agricultural: {
            title: 'Agricultural',
          },
          organizations: {
            title: 'Organizations - Associations - Cooperatives',
          },
          healthEducation: {
            title: 'Private Health Facilities - Private Schools',
          },
          cloudComputing: {
            title: 'Cloud Computing',
            description: 'The cloud computing tariff is applied to establishments operating in the activities of providing cloud computing services, dedicated infrastructure, and the infrastructure that enables and is associated with it.',
          },
          highIntensityFirst: {
            title: 'High Intensity - First Cluster Facilities',
            description: 'Applied to facilities operating in eligible activities where the ratio of electricity cost to operational costs (excluding raw materials) is 20% or more and which fulfill the necessary requirements.',
          },
          highIntensitySecond: {
            title: 'High Intensity - Second Cluster Facilities',
            description: 'Applied to facilities operating in eligible activities where the ratio of electricity cost to operational costs (excluding raw materials) is between 10% and 19.9% and which achieve the necessary requirements.',
          },
        },
        notes: {
          effectiveFrom2025: 'The tariff will be applied starting from 28/05/2025',
          highIntensityConditions: 'The High Intensity Electricity Consumption Tariff is applied to eligible facilities, provided that the tariff granted does not exceed that of the facility\'s applicable category.',
        },
        additionalInfo: {
          title: 'Additional Information',
          content: 'For more detailed information about electricity tariffs, eligibility criteria, and application procedures, please visit the official SERA website or contact our customer service team.',
        },
      },
      more: {
        title: 'More',
        language: 'عر',
        mainActions: 'Main Actions',
        sections: {
          aboutSera: 'About SERA',
          legalAgreements: 'Legal Agreements',
          appSettings: 'App Settings',
        },
        settings: {
          title: 'Settings',
          description: 'Manage your app preferences and account settings',
        },
        profile: {
          title: 'Profile',
          description: 'View and manage your personal information',
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
        compensationStandards: {
          title: 'Compensation Standards',
          description: 'Learn about your consumer rights and compensation',
        },
        consumptionTariff: {
          title: 'Consumption Tariff',
          description: 'View current electricity consumption tariff rates',
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
        homeScreen: {
          title: 'New Home Screen',
          description: 'Enable enhanced home screen experience',
        },
        biometric: {
          title: 'Biometric Login',
          description: 'Use fingerprint or face recognition',
          enabled: 'Enabled',
          disabled: 'Disabled',
          enableTitle: 'Enable Biometric Authentication',
          enableMessage: 'Would you like to use {{biometricType}} for quick and secure access to your SERA account?',
          disableTitle: 'Disable Biometric Authentication',
          disableMessage: 'Are you sure you want to disable biometric authentication?',
          authPrompt: 'Authenticate to access SERA',
          authPromptEnable: 'Authenticate to enable biometric login',
          notAvailable: 'Biometric authentication is not available on this device',
          notEnrolled: 'No biometric data enrolled. Please set up biometric authentication in your device settings.',
          authFailed: 'Authentication failed',
          authCancelled: 'Authentication was cancelled',
          tooManyAttempts: 'Too many failed attempts. Please login with your credentials.',
          loginRequired: 'Please login first to enable biometric authentication',
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
          confirmTitle: 'Clear Cache',
          confirmMessage: 'Are you sure you want to clear the cache? This will free up storage space.',
          success: 'Cache cleared successfully',
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
          number: '+966 11 201 9000',
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
          schedule: 'Sunday - Thursday: 7:00 AM - 3:00 PM',
        },
      },
      news: {
        title: 'News & Updates',
        latest: 'Latest News',
        viewAll: 'View All',
        readMore: 'Read More',
        noNews: 'No news available at the moment.',
        categories: {
          news: 'News',
          events: 'Events',
          awareness: 'Awareness Campaigns',
          updates: 'Updates',
        },
      },
      policies: {
        title: 'Policies & Terms',
        introText:
          'We are committed to protecting your privacy and data security. Learn about our policies and terms of service.',
        footerTitle: 'Important Note',
        footerText:
          'These policies were last updated in January 2024. We recommend reviewing these policies regularly to stay informed of any changes.',
        privacyPolicy: {
          title: 'Privacy Policy',
          description:
            'Learn how we collect, use, and protect your information.',
          introduction:
            'We are committed to protecting your privacy and personal information. This privacy policy explains how we collect, use, and protect your information when you use our services.',
          informationCollection: {
            title: 'Information We Collect',
            content:
              'We collect information you provide directly to us, such as when you create an account, submit a complaint, or contact us. This may include personal information such as your name, email address, phone number, and identification documents.',
          },
          informationUse: {
            title: 'How We Use Your Information',
            content:
              'We use the information we collect to provide, maintain, and improve our services, process your requests, communicate with you, and comply with legal obligations.',
          },
          informationProtection: {
            title: 'How We Protect Your Information',
            content:
              'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
          },
          yourRights: {
            title: 'Your Rights',
            content:
              'You have the right to access, update, or delete your personal information. You may also have the right to restrict or object to certain processing of your information.',
          },
          contact: {
            title: 'Contact Us',
            content:
              'If you have any questions about this privacy policy or our privacy practices, please contact us at info@sera.gov.sa',
          },
          lastUpdated: 'Last updated: January 2024',
        },
        termsOfService: {
          title: 'Terms of Service',
          description: 'Read our terms and conditions for using our services.',
        },
        dataProtection: {
          title: 'Data Protection',
          description: 'Information about how we protect your personal data.',
          introduction:
            'We are committed to protecting your personal data and ensuring your privacy rights are respected. This policy outlines how we collect, process, secure, and protect your personal information.',
          dataCollection: {
            title: 'Data Collection',
            content:
              'We collect personal data that you provide to us directly, such as when you register for an account, submit a request, or contact us. We also collect data automatically when you use our services.',
          },
          dataProcessing: {
            title: 'Data Processing',
            content:
              'We process your personal data for legitimate purposes, including providing our services, improving user experience, complying with legal obligations, and protecting our rights.',
          },
          dataSecurity: {
            title: 'Data Security',
            content:
              'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.',
          },
          dataSharing: {
            title: 'Data Sharing',
            content:
              'We do not sell, trade, or rent your personal data to third parties. We may share your data only when required by law or with your explicit consent.',
          },
          dataRetention: {
            title: 'Data Retention',
            content:
              'We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.',
          },
          userRights: {
            title: 'Your Rights',
            content:
              'You have the right to access, update, delete, or restrict the processing of your personal data. You may also object to certain processing activities.',
          },
          contact: {
            title: 'Contact Us',
            content:
              'If you have any questions about data protection or wish to exercise your rights, please contact us at info@sera.gov.sa',
          },
          lastUpdated: 'Last updated: January 2024',
        },
        cookiePolicy: {
          title: 'Cookie Policy',
          description:
            'Learn about our use of cookies and similar technologies.',
          introduction:
            'This Cookie Policy explains how we use cookies and similar technologies when you visit our website or use our services.',
          whatAreCookies: {
            title: 'What are Cookies',
            content:
              'Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.',
          },
          howWeUseCookies: {
            title: 'How We Use Cookies',
            content:
              'We use cookies to improve your experience on our website, remember your preferences, analyze website traffic, and ensure security.',
          },
          typesOfCookies: {
            title: 'Types of Cookies',
            content:
              'We use essential cookies (necessary for website function), performance cookies (to analyze usage), functional cookies (to remember preferences), and security cookies (to protect against threats).',
          },
          managingCookies: {
            title: 'Managing Cookies',
            content:
              'You can control and manage cookies through your browser settings. You can choose to accept or reject cookies, but this may affect your experience on our website.',
          },
          thirdPartyCookies: {
            title: 'Third-Party Cookies',
            content:
              'We may use third-party services that place their own cookies on your device. These are governed by the respective third parties privacy policies.',
          },
          contact: {
            title: 'Contact Us',
            content:
              'If you have any questions about our use of cookies, please contact us at info@sera.gov.sa',
          },
          lastUpdated: 'Last updated: January 2024',
        },
        usagePolicy: {
          title: 'Terms of Use',
          introduction:
            'This electronic portal provides information, data and services related to the work of the Saudi Electricity Regulatory Authority in the Kingdom of Saudi Arabia. By using this portal, you acknowledge refraining from the following:',
          prohibitedActivities: {
            title: 'Prohibited Activities',
            intro:
              'By using this portal, you acknowledge refraining from the following:',
            list: [
              'Providing or uploading files containing software, materials, data or other information that you do not own or do not have a license for.',
              'Using this portal in any way to send any commercial or unwanted email, or any abuse of this kind.',
              'Providing or uploading files to this portal that contain viruses or corrupted data.',
              'Publishing, advertising, distributing or circulating materials or information containing defamation, violation of regulations, pornographic, obscene, or contrary to public morals, or any illegal materials or information through the portal.',
              'Participating through this portal in unlawful or irregular activities in the Kingdom of Saudi Arabia.',
              'Advertising on this portal for any product or service that puts us in a position of violating any applicable law or regulation in any field.',
              'Using any means, program or procedure to intercept or attempt to intercept the proper operation of the portal.',
              'Taking any action that imposes an unreasonable or inappropriately large burden on the portal infrastructure.',
            ],
          },
          termination: {
            title: 'Termination of Use',
            content:
              'SERA may, at its sole discretion, terminate, restrict or suspend your right to access and use the portal without notice and for any reason, including violation of the terms and conditions of use or any other conduct that we may consider at our sole discretion to be illegal or harmful to others. In the event of termination, you will not be authorized to access this portal.',
          },
          links: {
            title: 'Electronic Links',
            content:
              'Some links are provided to sites independent of SERA electronic portal, and we are not responsible for the contents or credibility of the portals and/or sites we link to and do not endorse their contents. Use of links to access those sites or portals is at your own risk. SERA also replaces these broken electronic links with other sites, but we cannot guarantee that these links will work permanently.',
          },
          intellectualProperty: {
            title: 'Intellectual Property Rights',
            content:
              'This portal belongs to the Saudi Electricity Regulatory Authority and all intellectual property rights and other rights related to the content of this portal are owned by SERA. You may not copy, modify, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products or services obtained from this portal.',
          },
          personalInfoProtection: {
            title: 'Personal Information Protection',
            content:
              'Your personal information will only be available to SERA employees who need to access it and are authorized to do so. Such information will not be available for public viewing without your consent. Furthermore, none of such information will be exchanged, traded or sold to any other party without your prior consent.',
          },
          cookies: {
            title: 'Cookies',
            content:
              'We may store what are called "Cookies" on your device when you visit our site. Cookies are pieces of data that uniquely identify you as a user. They can also be used to improve your knowledge of this electronic portal and to better understand the user base of this portal. Most browsers are initially set to accept cookies. You can reset your browser to reject all cookies or to alert when cookies are being sent.',
          },
          lastUpdated: 'Last updated: August 28, 2024',
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
          saudiGov: 'DGA',
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
      survey: {
        title: "Feedback Survey",
        defaultTitle: "Service Evaluation Survey",
        message: "Would you like to provide feedback about this complaint?",
        takeSurvey: "Take Survey",
        button: "Rate This Service",
        thankYou: "Thank You",
        completed: "Your feedback has been recorded",
        loading: "Loading survey...",
        progress: "Question {{current}} of {{total}}",
        comment: {
          placeholder: "Enter your comments here..."
        },
        buttons: {
          skip: "Skip Survey",
          previous: "Previous",
          next: "Next",
          submit: "Submit Survey"
        },
        completion: {
          title: "Survey Completed",
          message: "Thank you for your feedback! Your responses have been recorded."
        },
        cancel: {
          title: "Cancel Survey",
          message: "Are you sure you want to cancel this survey? Your progress will be lost."
        },
        errors: {
          title: "Survey Error",
          loadFailed: "Failed to load survey questions",
          submitFailed: "Failed to submit survey responses",
          networkError: "Network error. Please check your connection.",
          missingParameters: "Survey parameters are missing",
          surveyNotActive: "This survey is no longer active"
        }
      },
      dataShare: {
        title: 'Data Sharing',
        description: 'Submit and track your data sharing requests',
        summary: {
          title: 'Requests Summary',
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected',
          total: 'Total',
        },
        actions: {
          newRequest: {
            title: 'New Request',
            description: 'Submit a new data sharing request',
          },
          viewRequests: {
            title: 'View My Requests',
            description: 'View and track your existing requests',
          },
        },
        filters: {
          all: 'All Requests',
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected',
        },
        view: {
          title: 'Data Sharing Requests',
          filter: 'Filter',
          filterBy: 'Filter By',
          noRequests: 'No data sharing requests found',
          loadError: 'Failed to load requests',
          requestNumber: 'Request No',
          requestDate: 'Request Date',
          requestNature: 'Request Nature',
          dataFormat: 'Data Format',
          viewDetails: 'View Details',
        },
        details: {
          title: 'Request Details',
          noData: 'No request data available',
          basicInfo: 'Basic Information',
          requestDetails: 'Request Details',
          dates: 'Important Dates',
          applicationNo: 'Application Number',
          requestTitle: 'Request Title',
          applicantName: 'Applicant Name',
          email: 'Email',
          contactNo: 'Contact Number',
          requiredDataDetails: 'Required Data Details',
          legalJustification: 'Legal Justification',
          dataFormatType: 'Data Format Type',
          requestNature: 'Request Nature',
          requestPriority: 'Request Priority',
          reasonForRequest: 'Reason for Request',
          requestRaisedDate: 'Request Raised Date',
          lastUpdatedDate: 'Last Updated Date',
          timeStart: 'Start Date',
          timeEnd: 'End Date',
          rejectionReason: 'Reason for Rejection',
        },
        create: {
          title: 'New Data Sharing Request',
          externalFormTitle: 'External Form',
          externalFormDescription: 'Data sharing requests are submitted through an external form. Click below to open the form in your browser.',
          openExternalForm: 'Open Request Form',
          form: {
            notice: {
              title: 'Important Notice',
              point1: 'The Authority will process the request and inform the applicant within 30 days of receiving the request.',
              point2: 'The individual will be provided with the requested information within 10 business days of receiving the payment.',
              point3: 'If the Authority decides to extend, the response period to the applicant should not exceed an additional 30 days, depending on the size and nature of the requested information.',
              point4: 'In case of appeal, the applicant must file the appeal within 10 business days of receiving the Authority\'s decision.',
            },
            sections: {
              basicInfo: 'Basic Information',
              requestDetails: 'Request Details',
            },
            fields: {
              applicantName: 'Applicant Name',
              nationalIdentity: 'National Identity',
              entityType: 'Entity Type',
              entityName: 'Entity Name',
              affiliationProofPrivate: 'Proof of Representation (Company Representative)',
              affiliationProofGovernment: 'Proof of Representation (Government Liaison Officer)',
              crNumber: 'Commercial Registration Number',
              mobileNumber: 'Mobile Number',
              email: 'Email',
              requestTitle: 'Request Title',
              requestPurpose: 'Request Purpose',
              requestPurposeDescription: 'Detailed Purpose Description',
              requestType: 'Request Type',
              requestNature: 'Request Nature',
              dataFormatType: 'Data Format Type',
              participationMechanism: 'Participation Mechanism',
              timeStart: 'Start Date',
              timeEnd: 'End Date',
              isDataProvidedThirdParty: 'Will data or analysis results be provided to a third party?',
              isDataAnalysisPublished: 'Will data analysis results be published?',
              dataSharingAgreementExists: 'Is there a prior data sharing agreement?',
              isEntityDataRepresentation: 'Is the applicant the data representative at the entity?',
              isContainsPersonalData: 'Does it contain personal data?',
              legalBasisForDataRequest: 'Does the entity have a legal basis for requesting the data?',
              dataSharingAgreementFile: 'Data Sharing Agreement File',
              legalJustificationDescription: 'Legal Justification Description',
              requiredDataDetails: 'Detailed Description of Required Data',
              isSatisfiedWithProcess: 'Are you satisfied with the information request submission process?',
            },
            options: {
              entityType: {
                government: 'Government Entity',
                individual: 'Individual',
                private: 'Private Sector',
              },
              requestPurpose: {
                personal: 'Personal Use',
                research: 'Scientific Research',
                business: 'Business Requirements',
                other: 'Other',
              },
              requestType: {
                normal: 'Normal',
                urgent: 'Urgent Request',
              },
              requestNature: {
                once: 'One Time',
                recurring: 'Recurring',
              },
              dataFormatType: {
                csv: 'CSV',
                excel: 'Excel',
                json: 'JSON',
                pdf: 'PDF',
              },
              participationMechanism: {
                dataset: 'Dataset',
                integration: 'Integration',
              },
            },
            selectOption: 'Select an option',
            enterText: 'Enter text',
            attachFile: 'Attach File',
            selectDate: 'Select date',
            removeFile: 'Remove File',
            removeFileConfirm: 'Are you sure you want to remove "{{fileName}}"?',
            yes: 'Yes',
            no: 'No',
            declaration: 'I acknowledge and pledge that all information provided in this request is true and I bear responsibility if proven otherwise.',
            acknowledge: 'I acknowledge',
            submit: 'Submit Request',
            filePickerError: 'Error selecting file',
            submitError: 'Failed to submit request',
            validation: {
              entityTypeRequired: 'Please select entity type',
              requestTitleRequired: 'Please enter request title',
              requestPurposeRequired: 'Please select request purpose',
              requestTypeRequired: 'Please select request type',
              requestNatureRequired: 'Please select request nature',
              dataFormatTypeRequired: 'Please select data format type',
              declarationRequired: 'You must acknowledge the declaration',
              contactInfoRequired: 'Please provide mobile number and email',
              privateEntityInfoRequired: 'Please provide all required information for private sector',
              governmentEntityInfoRequired: 'Please provide all required information for government entity',
              startDateBeforeEnd: 'Start date must be before end date',
              endDateAfterStart: 'End date must be after start date',
              fileTooLarge: 'File size ({{size}} MB) exceeds the maximum allowed size of 5 MB',
              fileConversionError: 'Failed to process the file. Please try again',
            },
            success: {
              title: 'Request Submitted',
              message: 'Your data sharing request has been submitted successfully. You will be notified of the status within 30 days.',
            },
          },
        },
      },
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
        },
        create: {
          title: 'Create Complaint',
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
          removeAttachment: 'Remove Attachment',
          removeAttachmentConfirm: 'Are you sure you want to remove this attachment?',
          submit: 'Submit Complaint',
          submitting: 'Submitting...',
          accountNumber: 'Account Number',
          orderNumber: 'Order Number',
          accountNumberPlaceholder: 'Enter account number',
          orderNumberPlaceholder: 'Enter order number',
          loadingFormData: 'Loading form data...',
          success: 'Success',
          successMessage: 'Complaint submitted successfully!',
          submissionSuccess: 'Complaint submitted successfully!',
          successWithCaseId:
            'Complaint submitted successfully! Case ID: {{caseId}}',
          error: 'Error',
          errorMessage: 'Please fill all required fields',
          submitError: 'An error occurred while submitting the complaint',
          uploadFileTitle: 'Upload File',
          uploadFileMessage:
            'Max size: 20 MB\nAllowed types: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          cancel: 'Cancel',
          chooseFile: 'Choose File',
          mockDocument: 'Use Sample Document',
          ok: 'OK',
          close: 'Close',
          required: '*',
          attachmentError: 'Attachment Error',
          attachmentFailedSingle: 'Failed to process attachment: {{fileName}}',
          attachmentFailedMultiple: 'Failed to process {{count}} attachments: {{fileNames}}',
          attachmentErrorDetails: 'Error details',
          continueWithoutAttachments: 'Continue without these attachments',
          fixAttachments: 'Fix attachments',
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
          error: "Error",
          invalidComplaint: "Invalid complaint data",
          status: {
            open: "Open",
            closed: "Closed",
            unknown: "Unknown",
          },
        },
        status: {
          open: 'Open',
          closed: 'Closed',
          closedAsInquiry: 'Closed as Inquiry',
          unknown: 'Unknown Status',
        },
        stage: {
          complaintCheck: 'Complaint Check',
          investigation: 'Under Investigation',
          providerResponse: 'Awaiting Provider Response',
          finalDecision: 'Final Decision',
          closed: 'Closed',
          unknown: 'Unknown Stage',
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
        details: {
          title: "Complaint Details",
          caseNumber: "Case Number: {{number}}",
          loading: "Loading complaint details...",
          notFound: "Complaint not found",
          loadError: "Failed to load complaint details",
          error: "Error",
          sections: {
            status: "Status",
            basicInfo: "Basic Information",
            description: "Description",
            providerResponse: "Service Provider Response",
            result: "Processing Result",
            attachments: "Attachments",
            timeline: "Timeline",
          },
          complaintType: "Complaint Type",
          serviceProvider: "Service Provider",
          customerType: "Consumption category",
          region: "Region",
          city: "City",
          office: "Office",
          creationDate: "Creation Date",
          closedDate: "Closed Date",
          stage: "Stage",
          noAttachments: "No attachments available",
          noComments: "No timeline updates available",
          attachment: {
            title: "Attachment",
            message: "What would you like to do with {{fileName}}?",
            download: "Download",
            downloadTitle: "Download",
            downloadMessage: "{{fileName}} download has been initiated",
            downloading: "Downloading {{fileName}}...",
            downloadSuccess: "{{fileName}} downloaded successfully",
            downloadError: "Failed to download attachment",
            downloadUnsupported: "Cannot open {{fileName}}. File type not supported on this device",
            openFile: "Open File",
            shareTitle: "Share Document",
            fileLocation: "File Downloaded",
            fileLocationMessage: "File saved to: {{path}}",
            openError: "Cannot Open File",
            openErrorMessage: "Unable to open the downloaded file. You can find it in your device's file manager.",
            saveSuccess: "File Saved",
            saveSuccessMessage: "{{fileName}} has been saved successfully to your selected location.",
            saveTitle: "Save {{fileName}}",
            saveMessage: "Choose where to save {{fileName}}",
          },
          survey: {
            title: "Feedback Survey",
            defaultTitle: "Service Evaluation Survey",
            message: "Would you like to provide feedback about this complaint?",
            takeSurvey: "Take Survey",
            button: "Rate This Service",
            thankYou: "Thank You",
            completed: "Your feedback has been recorded",
            loading: "Loading survey...",
            progress: "Question {{current}} of {{total}}",
            comment: {
              placeholder: "Enter your comments here..."
            },
            buttons: {
              skip: "Skip Survey",
              previous: "Previous",
              next: "Next",
              submit: "Submit Survey"
            },
            completion: {
              title: "Survey Completed",
              message: "Thank you for your feedback! Your responses have been recorded."
            },
            cancel: {
              title: "Cancel Survey",
              message: "Are you sure you want to cancel this survey? Your progress will be lost."
            },
            errors: {
              title: "Survey Error",
              loadFailed: "Failed to load survey questions",
              submitFailed: "Failed to submit survey responses",
              networkError: "Network error. Please check your connection.",
              missingParameters: "Survey parameters are missing",
              surveyNotActive: "This survey is no longer active"
            }
          },
          reopen: {
            title: "Reopen Complaint",
            message: "This complaint can be reopened if you are not satisfied with the resolution",
            button: "Reopen Complaint",
          },
        },
      },
      comments: {
        title: 'Comments',
        addComment: 'Add Comment',
        commentText: 'Comment Text',
        commentPlaceholder: 'Enter your comment here...',
        attachments: 'Attachments',
        attachFile: 'Attach File',
        submit: 'Submit Comment',
        success: 'Success',
        commentAdded: 'Comment added successfully',
        error: 'Error',
        commentRequired: 'Comment text is required',
        submitError: 'Failed to submit comment',
        loadError: 'Failed to load comments',
        loading: 'Loading comments...',
        noComments: 'No comments yet',
        maxAttachmentsReached: 'Maximum 3 attachments allowed',
        filePickerError: 'Failed to open file picker',
        fileAttachmentError: 'Failed to attach file',
        fileSelectionError: 'Failed to process selected file',
        removeAttachment: 'Remove Attachment',
        removeAttachmentConfirm: 'Are you sure you want to remove this attachment?',
        attachmentNotAvailable: 'Attachment is not available for download',
        downloadError: 'Failed to download attachment',
        saveAttachment: 'Save {{fileName}}',
        saveAttachmentMessage: 'Choose where to save {{fileName}}',
        you: 'You',
        seraTeam: 'SERA Team',
        closedComplaint: 'Closed',
      },
      permits: {
        title: 'Permit Requests',
        description: 'Submit and track your permit requests easily',
        welcomeTitle: 'Permit Requests Center',
        welcomeDescription:
          'Submit permit requests and track their status easily and transparently',
        newPermit: {
          title: 'New Permit Request',
          description: 'Submit a new permit request',
        },
        viewPermits: {
          title: 'View Permit Requests',
          description: 'View and track your existing permit requests',
        },
        permitTypes: {
          powerGeneration: {
            title: 'Power Generation Station Permit',
            description:
              'Request permit to establish a power generation or cogeneration station',
          },
          districtCooling: {
            title: 'District Cooling Station Permit',
            description:
              'Request permit to study the establishment of a district cooling station',
          },
        },
        overview: {
          title: 'Requests Overview',
          all: 'All Requests',
          completed: 'Completed Requests',
          processing: 'Processing Requests',
          unacceptable: 'Unacceptable Requests',
          unsent: 'Unsent Requests',
          returned: 'Returned Requests',
        },
        view: {
          title: 'طلبات التصريح',
          loading: 'Loading...',
          noPermits: 'No Permit Requests',
          noPermitsMessage: 'No permit requests found with the selected filter',
          yourPermits: 'Your Permit Requests',
          invalidDate: 'Invalid Date',
          table: {
            actions: 'Actions',
            requestNumber: 'Request Number',
            requestStage: 'Request Stage',
            requestName: 'Request Name',
            requestDate: 'Request Date',
            requestStatus: 'Request Status',
          },
          refreshing: 'Refreshing...',
          retry: 'Retry',
          errorMessage: 'Failed to load permit requests',
        },
        status: {
          all: 'All',
          completed: 'Completed',
          processing: 'Processing',
          unacceptable: 'Unacceptable',
          unsent: 'Unsent',
          returned: 'Returned',
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected',
        },
        powerGeneration: {
          title: 'Power Generation Permit Request',
          saveForLater: 'Save',
          submit: 'Submit Request',
          attachFile: 'Attach File',
          fileRequirements:
            'Max size: 20MB | Formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          confirmExit: {
            title: 'Confirm Exit',
            message:
              'Are you sure you want to exit? Any unsaved changes will be lost.',
          },
          fileAttachment: {
            title: 'Attach File',
            message: 'Select a file to attach',
            select: 'Select File',
          },
          saveSuccess: {
            title: 'Saved Successfully',
            message: 'Your request has been saved for later completion.',
          },
          saveError: {
            message: 'Failed to save request. Please try again.',
          },
          submitSuccess: {
            title: 'Request Submitted',
            message:
              'Your permit request has been submitted successfully. Request number: {{permitNumber}}',
          },
          submitError: {
            message: 'Failed to submit request. Please try again.',
          },
          validation: {
            requiredFields: 'Please fill in all required fields.',
          },
          sections: {
            basicData: '1. Basic Station Data',
            locationLayout:
              '2. Station/Project Location Coordinates and Layout',
            energySales: '3. Energy Sales Information',
            gridConnection: '4. Connection to Public Electricity Grid',
          },
          fields: {
            userAccount: 'User Account',
            stationNature: 'Nature of Station Product',
            stationType: 'Type of Proposed Station',
            stationLocation: 'Station/Project Location',
            expectedPowerAC: 'Expected Power of Electricity/AC (MW)',
            expectedPowerDC: 'Expected Power of Electricity/DC (MW)',
            fuelType: 'Type of Fuel Expected to be Used',
            stationUses: 'Station Uses',
            dualProductionCapacity:
              'Expected Dual Production Capacity (Water: m³/day)',
            cogenerationCapacity:
              'Expected Cogeneration Capacity (Steam: tons/day)',
            coordinatesFile: 'Coordinates',
            aerialPhotosFile: 'Aerial Photographs and Land Plan',
            siteOwnershipFile: 'Site Ownership Document',
            fuelAllocationFile: 'Fuel Allocation from Ministry of Energy',
            energyEfficiencyFile:
              'Proof of Coordination with Saudi Energy Efficiency Center',
            energySoldTo: 'Party to Whom Energy Will Be Sold',
            energyPercentageSold: 'Percentage of Energy Sold (%)',
            totalLoad: 'Total Load of License Applicant (MW)',
            gridConnection: 'Connection to Public Electricity Grid',
            anchorPoint: 'Approximate Anchor Point',
            connectionVoltage: 'Expected Connection Voltage (kV)',
            operationDate: 'Expected Date of Commercial Operation',
            initialApprovalFile:
              'Initial Approval from Public Electricity Service Provider',
          },
          placeholders: {
            selectAccount: 'Select user account',
            selectNature: 'Select station nature',
            selectType: 'Select station type',
            enterLocation: 'Enter station/project location',
            enterPowerAC: 'Enter expected AC power in MW',
            enterPowerDC: 'Enter expected DC power in MW',
            selectFuel: 'Select fuel type',
            selectUses: 'Select station uses',
            enterDualProduction: 'Enter dual production capacity',
            enterCogeneration: 'Enter cogeneration capacity',
            enterEnergySoldTo: 'Enter party name',
            enterPercentage: 'Enter percentage (0-100)',
            enterTotalLoad: 'Enter total load in MW',
            selectGridConnection: 'Select grid connection option',
            enterAnchorPoint: 'Enter approximate anchor point',
            enterVoltage: 'Enter voltage in kV',
            enterOperationDate: 'Enter expected operation date',
          },
          mockData: {
            accounts: {
              company1: 'abdullah 1st account',
              company2: 'abdullah 2nd account',
              company3: 'abdullah 3rd account',
            },
            natures: {
              solar: 'Solar Power',
              wind: 'Wind Power',
              gas: 'Natural Gas',
              diesel: 'Diesel',
              hybrid: 'Hybrid (Solar + Wind)',
            },
            types: {
              commercial: 'Commercial',
              industrial: 'Industrial',
              residential: 'Residential',
              utility: 'Utility Scale',
            },
            fuels: {
              naturalGas: 'Natural Gas',
              diesel: 'Diesel',
              solar: 'Solar (No Fuel)',
              wind: 'Wind (No Fuel)',
              biomass: 'Biomass',
            },
            uses: {
              powerOnly: 'Power Generation Only',
              cogeneration: 'Cogeneration (Power + Steam)',
              dualProduction: 'Dual Production (Power + Water)',
            },
            gridConnection: {
              yes: 'Yes',
              no: 'No',
              planned: 'Planned',
            },
          },
        },
        districtCooling: {
          title: 'District Cooling Station Permit Request',
          saveForLater: 'Save',
          submit: 'Submit Request',
          attachFile: 'Attach File',
          fileRequirements:
            'Max size: 20MB | Formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          confirmExit: {
            title: 'Confirm Exit',
            message:
              'Are you sure you want to exit? Any unsaved changes will be lost.',
          },
          fileAttachment: {
            title: 'Attach File',
            message: 'Select a file to attach',
            select: 'Select File',
          },
          saveSuccess: {
            title: 'Saved Successfully',
            message: 'Your request has been saved for later completion.',
          },
          saveError: {
            message: 'Failed to save request. Please try again.',
          },
          submitSuccess: {
            title: 'Request Submitted',
            message:
              'Your permit request has been submitted successfully. Request number: {{permitNumber}}',
          },
          submitError: {
            message: 'Failed to submit request. Please try again.',
          },
          validation: {
            requiredFields: 'Please fill in all required fields.',
          },
          sections: {
            basicData: '1. Basic Station Data',
            gridConnection: '2. Grid Connection Information',
          },
          fields: {
            userAccount: 'Account Selection',
            stationLocation: 'Station/Project Location',
            coolingPurposes: 'District Cooling Purposes',
            expectedCoolingQuantity:
              'Expected Cooling Water Quantity (Cooling Tons)',
            powerSource: 'Power Source',
            operationDate: 'Expected Date of Commercial Operation',
            coolingWaterSource: 'Cooling Water Source',
            ministryApprovalFile:
              'Approval from Ministry of Environment, Water and Agriculture',
            landPlanFile: 'Land and Buildings Plan',
            energyEfficiencyFile:
              'Coordination with Saudi Energy Efficiency Center',
            fuelAllocationFile: 'Fuel Allocation from Ministry of Energy',
            gridConnection: 'Connection to Public Electricity Grid',
            load: 'Load (MW)',
            internalVoltage: 'Internal Acquired Voltage (kV)',
            anchorPoint: 'Approximate Anchor Point',
            networkType: 'Connect to Transmission or Distribution Network',
            serviceProviderConsentFile: 'Service Provider Consent to Link',
          },
          placeholders: {
            selectAccount: 'Select account',
            enterLocation: 'Enter station/project location',
            selectPurposes: 'Select district cooling purposes',
            enterCoolingQuantity: 'Enter expected cooling quantity in tons',
            selectPowerSource: 'Select power source',
            enterOperationDate: 'Enter expected operation date (MM/DD/YYYY)',
            selectWaterSource: 'Select cooling water source',
            selectGridConnection: 'Select grid connection option',
            enterLoad: 'Enter load in MW',
            enterVoltage: 'Enter voltage in kV',
            enterAnchorPoint: 'Enter approximate anchor point',
            selectNetworkType: 'Select network type',
          },
          mockData: {
            accounts: {
              company1: 'Saudi Electricity Company',
              company2: 'Marafiq Power and Water',
              company3: 'District Cooling Solutions Ltd.',
            },
            purposes: {
              commercial: 'Commercial Buildings',
              residential: 'Residential Complexes',
              industrial: 'Industrial Facilities',
              mixed: 'Mixed Use Development',
            },
            powerSources: {
              grid: 'Electricity Grid',
              solar: 'Solar Power',
              gas: 'Natural Gas',
              hybrid: 'Hybrid (Grid + Solar)',
            },
            waterSources: {
              seawater: 'Seawater',
              groundwater: 'Groundwater',
              wastewater: 'Treated Wastewater',
              desalinated: 'Desalinated Water',
              other: 'Other',
            },
            gridConnection: {
              yes: 'Yes',
              no: 'No',
            },
            networkTypes: {
              transmission: 'Transmission Network',
              distribution: 'Distribution Network',
            },
          },
        },
      },
    },
  },
  ar: {
    translation: {
      common: {
        cancel: 'إلغاء',
        ok: 'موافق',
        close: 'إغلاق',
        exit: 'خروج',
        error: 'خطأ',
        save: 'حفظ',
        submit: 'تقديم',
        loading: 'جاري التحميل...',
        retry: 'إعادة المحاولة',
        goBack: "العودة",
        notAvailable: "غير متوفر",
        networkError: "خطأ في الاتصال بالشبكة",
        yesterday: 'أمس',
        daysAgo: 'منذ {{count}} أيام',
        invalidDate: 'تاريخ غير صحيح',
        success: 'نجح',
      },
      navigation: {
        restrictedMessage: 'لا يمكن العودة إلى شاشات تسجيل الدخول',
        exitAppMessage: 'اضغط مرة أخرى للخروج من التطبيق',
      },
      session: {
        warning: {
          title: 'الجلسة ستنتهي قريباً',
          message: 'ستنتهي جلستك خلال {{minutes}} دقائق بسبب عدم النشاط. هل تريد البقاء متصلاً؟',
          stayLoggedIn: 'البقاء متصلاً',
          logout: 'تسجيل الخروج الآن',
        },
        expiry: {
          title: 'انتهت الجلسة',
          idleMessage: 'انتهت جلستك بسبب عدم النشاط. يرجى تسجيل الدخول مرة أخرى للمتابعة.',
          maxDurationMessage: 'انتهت جلستك بسبب الوصول للحد الأقصى للمدة. يرجى تسجيل الدخول مرة أخرى للمتابعة.',
          loginAgain: 'تسجيل الدخول مرة أخرى',
        },
      },
      permissions: {
        storage: {
          title: "إذن التخزين",
          message: "يحتاج هذا التطبيق إلى إذن التخزين لتحميل الملفات على جهازك.",
          neutral: "اسأل لاحقاً",
          denied: "إذن التخزين مطلوب لتحميل الملفات. يرجى تفعيله في إعدادات الجهاز.",
        },
      },
      errors: {
        insufficientStorage: "مساحة تخزين غير كافية على الجهاز. يرجى توفير مساحة والمحاولة مرة أخرى.",
      },
      auth: {
        login: 'تسجيل الدخول',
        cancel: 'إلغاء',
        loginRequired: 'تسجيل الدخول مطلوب',
        loginRequiredMessage: 'تحتاج إلى تسجيل الدخول للوصول إلى هذه الميزة. يرجى تسجيل الدخول باستخدام حساب نفاذ للمتابعة.',
      },
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
        comingSoon: {
          title: 'قريباً',
          message: 'هذه الميزة قادمة قريباً. ترقبوا التحديثات!',
          okButton: 'حسناً',
        },
        greeting: {
          morning: 'صباح الخير',
          afternoon: 'مساء الخير',
          evening: 'مساء الخير',
        },
        homeNew: {
          lastVisit: 'آخر زيارة',
          accountVerified: 'الحساب موثق',
          stats: {
            activeComplaints: 'نشطة',
            completed: 'منجزة',
            pending: 'قيد المراجعة',
          },
          quickActionsTitle: 'الإجراءات السريعة',
          quickActions: {
            newComplaint: 'شكوى جديدة',
            newPermit: 'تصريح جديد',
            contactUs: 'تواصل معنا',
            myReports: 'تقاريري',
          },
          recentActivityTitle: 'النشاط الأخير',
          activities: {
            complaintReply: 'تم الرد على شكواك',
            permitReceived: 'تم استلام طلب التصريح',
            newUpdate: 'تحديث جديد متاح',
            twoHoursAgo: 'منذ ساعتين',
            yesterday: 'أمس',
            threeDaysAgo: 'منذ 3 أيام',
          },
        },
      },
      services: {
        title: 'الخدمات الإلكترونية',
        language: 'EN',
        comingSoon: 'قريباً',
        description: {
          title: 'الخدمات الرقمية',
          subtitle: 'اطلع على الخدمات الرقمية للهيئة في أي وقت ومن أي مكان. قدم طلباتك، تابع حالة المعاملات، وأدر حسابك بسهولة وأمان.',
        },
        permitRequest: {
          title: 'طلب تصريح',
          description: 'يمكن طلب التصريح للاستفادة من التقديم الإلكتروني ...',
          detailedDescription: 'وصف الخدمة قريباً.',
        },
        complaints: {
          title: 'الشكوى',
          description: 'يمكن تقديم الشكوى أو طلب الاعتراض لدى الهيئة ...',
          detailedDescription: 'تتيح هذه الخدمة تقديم أو تصعيد شكوى لدى الهيئة في حال الاعتراض على نتيجة معالجة مقدم الخدمة للشكوى أو التأخر في المعالجة، كما تمكنك من متابعة شكواك لدى الهيئة. وتتوفر الخدمة على مدار الساعة 24/7 عبر قنوات تقديم الخدمة.',
        },
        licenseIssuance: {
          title: 'إصدار رخصة',
          description: 'يمكن طلب الاستفادة من التقديم على إصدار الرخصة ...',
          detailedDescription: 'وصف الخدمة قريباً.',
        },
        dataSharing: {
          title: 'مشاركة البيانات',
          description: 'تتيح المشاركة تبادل المعلومات مع صاحب الطلب ...',
          detailedDescription: 'وصف الخدمة قريباً.',
        },
        freedomOfInformation: {
          title: 'حرية المعلومات',
          description:
            'توفر الهيئة البيانات العامة وذلك حسب سياسة حرية المعلومات الصادرة من مكتب إدارة البيانات...',
          detailedDescription: 'وصف الخدمة قريباً.',
        },
      },
      consumptionTariff: {
        title: 'تعرفة الاستهلاك',
        description: {
          title: 'تعرفة استهلاك الكهرباء',
          content: 'تعرفة استهلاك الكهرباء هي السعر المفروض على استهلاك الكهرباء لمختلف فئات المستهلكين. يتم تحديد هذه التعرفات من قبل الهيئة لضمان التسعير العادل مع تعزيز الاستخدام الفعال للكهرباء.',
        },
        stats: {
          categories: 'الفئات',
          tariffRange: 'نطاق التعرفة (هلله/ك.و.س)',
          effectiveYear: 'سنة التطبيق',
        },
        table: {
          consumptionRange: 'نطاق الاستهلاك (ك.و.س/شهر)',
          networkType: 'نوع الشبكة',
          tariff: 'التعرفة (هلله/ك.و.س)',
        },
        units: {
          kwhMonth: 'ك.و.س/شهر',
          hhKwh: 'هلله/ك.و.س',
        },
        ranges: {
          all: 'جميع مستويات الاستهلاك',
        },
        networkTypes: {
          distributionnetwork: 'متصل بشبكة التوزيع',
          transmissionnetwork: 'متصل بشبكة النقل',
        },
        categories: {
          residential: {
            title: 'السكني',
          },
          commercial: {
            title: 'التجاري',
          },
          governmental: {
            title: 'الحكومي',
          },
          industrial: {
            title: 'الصناعي',
          },
          agricultural: {
            title: 'الزراعي',
          },
          organizations: {
            title: 'المؤسسات - الجمعيات - التعاونيات والحكم عليها',
          },
          healthEducation: {
            title: 'المرافق الصحية الخاصة - المؤسسات والمدارس الخاصة',
          },
          cloudComputing: {
            title: 'الحوسبة السحابية',
            description: 'يتم تطبيق تعرفة الحوسبة السحابية على المؤسسات التي تعمل في أنشطة توفير خدمات الحوسبة السحابية والبنية التحتية المخصصة والبنية التحتية التي تمكن وترتبط بها.',
          },
          highIntensityFirst: {
            title: 'عالي الكثافة - مرافق المجموعة الأولى',
            description: 'يطبق على المرافق التي تعمل في الأنشطة المؤهلة حيث تبلغ نسبة تكلفة الكهرباء إلى التكاليف التشغيلية (باستثناء المواد الخام) 20% أو أكثر والتي تستوفي المتطلبات اللازمة.',
          },
          highIntensitySecond: {
            title: 'عالي الكثافة - مرافق المجموعة الثانية',
            description: 'يطبق على المرافق التي تعمل في الأنشطة المؤهلة حيث تتراوح نسبة تكلفة الكهرباء إلى التكاليف التشغيلية (باستثناء المواد الخام) بين 10% و 19.9% والتي تحقق المتطلبات اللازمة.',
          },
        },
        notes: {
          effectiveFrom2025: 'سيتم تطبيق التعرفة اعتباراً من 28/05/2025',
          highIntensityConditions: 'يتم تطبيق تعرفة استهلاك الكهرباء عالية الكثافة على المرافق المؤهلة، بشرط ألا تتجاوز التعرفة الممنوحة تعرفة الفئة المطبقة للمرفق.',
        },
        additionalInfo: {
          title: 'كيف يصرف التعويض؟ ومتي؟',
          content: 'يصل التعويض للمستهلك دون حاجة لتقديم شكوى أو مطالبة، يضاف كرصيد في الفاتورة خلال 10 أيام عمل من انتهاء الحالة، ويمكن طلب تحويل الرصيد إلى الحساب البنكي',
        },
      },
      more: {
        title: 'المزيد',
        language: 'عر',
        mainActions: 'الإجراءات الرئيسية',
        sections: {
          aboutSera: 'عن الهيئة السعودية لتنظيم الكهرباء',
          legalAgreements: 'الاتفاقيات القانونية',
          appSettings: 'إعدادات التطبيق',
        },
        settings: {
          title: 'الإعدادات',
          description: 'إدارة تفضيلاتك وإعدادات حسابك',
        },
        profile: {
          title: 'الملف الشخصي',
          description: 'مشاهدة وإدارة معلوماتك الشخصية',
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
          description: 'تقديم ومتابعة الشكاوى الخاصة بك بسهولة',
        },
        compensationStandards: {
          title: 'معايير التعويضات',
          description: 'تعرف على حقوقك كمستهلك ومعايير التعويض',
        },
        consumptionTariff: {
          title: 'تعرفة الاستهلاك',
          description: 'عرض أسعار تعرفة استهلاك الكهرباء الحالية',
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
        homeScreen: {
          title: 'الصفحة الرئيسية الجديدة',
          description: 'تفعيل تجربة الصفحة الرئيسية المحسنة',
        },
        biometric: {
          title: 'تسجيل الدخول بصمة الإصبع أو الوجه',
          description: 'استخدام الإصبع أو التعرف على الوجه',
          enabled: 'مفعل',
          disabled: 'غير مفعل',
          enableTitle: 'تفعيل المصادقة البيومترية',
          enableMessage: 'هل تريد استخدام {{biometricType}} للوصول السريع والآمن إلى حساب سيرا؟',
          disableTitle: 'إلغاء تفعيل المصادقة البيومترية',
          disableMessage: 'هل أنت متأكد من أنك تريد إلغاء تفعيل المصادقة البيومترية؟',
          authPrompt: 'قم بالمصادقة للوصول إلى سيرا',
          authPromptEnable: 'قم بالمصادقة لتفعيل تسجيل الدخول البيومتري',
          notAvailable: 'المصادقة البيومترية غير متاحة على هذا الجهاز',
          notEnrolled: 'لم يتم تسجيل بيانات بيومترية. يرجى إعداد المصادقة البيومترية في إعدادات الجهاز.',
          authFailed: 'فشلت المصادقة',
          authCancelled: 'تم إلغاء المصادقة',
          tooManyAttempts: 'محاولات فاشلة كثيرة جداً. يرجى تسجيل الدخول بمعلوماتك الشخصية.',
          loginRequired: 'يرجى تسجيل الدخول أولاً لتفعيل المصادقة البيومترية',
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
          confirmTitle: 'مسح التخزين',
          confirmMessage: 'هل أنت متأكد أنك تريد مسح التخزين المؤقت؟ سيؤدي هذا إلى تحرير مساحة التخزين.',
          success: 'تم مسح التخزين المؤقت بنجاح',
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
          transparency: 'الموثوقية',
          fairness: 'حماية المستهلك',
          excellence: 'الاستدامة',
          innovation: 'مركزية العميل',
        },
        establishment: {
          title: 'التأسيس',
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
          number: '+966 11 201 9000',
        },
        email: {
          title: 'البريد الإلكتروني',
          address: 'info@sera.gov.sa',
        },
        website: {
          title: 'الموقع الإلكتروني',
          url: 'www.sera.gov.sa',
        },
        workingHours: {
          title: 'ساعات العمل',
          schedule: 'الأحد - الخميس: من 7:00 صباعا إلى 3:00 مساء',
        },
      },
      news: {
        title: 'الأخبار والتحديثات',
        latest: 'أحدث الأخبار',
        viewAll: 'إظهار الكل',
        readMore: 'قراءة المزيد',
        noNews: 'لا توجد أخبار متاحة في الوقت الحالي.',
        categories: {
          news: 'الأخبار',
          events: 'الفعاليات',
          awareness: 'حملات التوعية',
          updates: 'التحديثات',
        },
      },
      policies: {
        title: 'السياسات والشروط',
        introText:
          'نلتزم بحماية خصوصيتك وأمان بياناتك. تعرف على سياساتنا وشروط استخدام خدماتنا.',
        footerTitle: 'ملاحظة مهمة',
        footerText:
          'آخر تحديث لهذه السياسات كان في يناير 2024. نوصي بمراجعة هذه السياسات بانتظام للبقاء على اطلاع بأي تغييرات.',
        privacyPolicy: {
          title: 'سياسة الخصوصية',
          description: 'تعرف على كيفية جمع واستخدام وحماية معلوماتك.',
          introduction:
            'نلتزم بحماية خصوصيتك ومعلوماتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام خدماتنا.',
          informationCollection: {
            title: 'المعلومات التي نجمعها',
            content:
              'نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو تقديم شكوى أو التواصل معنا. قد تشمل هذه المعلومات الشخصية مثل اسمك وعنوان بريدك الإلكتروني ورقم هاتفك ووثائق الهوية.',
          },
          informationUse: {
            title: 'كيف نستخدم معلوماتك',
            content:
              'نستخدم المعلومات التي نجمعها لتوفير خدماتنا والحفاظ عليها وتحسينها، ومعالجة طلباتك، والتواصل معك، والامتثال للالتزامات القانونية.',
          },
          informationProtection: {
            title: 'كيف نحمي معلوماتك',
            content:
              'نطبق تدابير أمنية تقنية وتنظيمية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.',
          },
          yourRights: {
            title: 'حقوقك',
            content:
              'لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها. قد يكون لديك أيضاً الحق في تقييد أو الاعتراض على معالجة معينة لمعلوماتك.',
          },
          contact: {
            title: 'تواصل معنا',
            content:
              'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات الخصوصية لدينا، يرجى التواصل معنا على info@sera.gov.sa',
          },
          lastUpdated: 'آخر تحديث: يناير 2024',
        },
        termsOfService: {
          title: 'شروط الخدمة',
          description: 'قراءة شروط وأحكامنا لاستخدام خدماتنا.',
        },
        dataProtection: {
          title: 'حماية البيانات',
          description: 'معلومات عن حماية البيانات الشخصية لدينا.',
          introduction:
            'نلتزم بحماية بياناتك الشخصية وضمان احترام حقوق خصوصيتك. توضح هذه السياسة كيفية جمع ومعالجة وتأمين وحماية معلوماتك الشخصية.',
          dataCollection: {
            title: 'جمع البيانات',
            content:
              'نجمع البيانات الشخصية التي تقدمها لنا مباشرة، مثل عند التسجيل للحساب أو تقديم طلب أو التواصل معنا. كما نجمع البيانات تلقائياً عند استخدام خدماتنا.',
          },
          dataProcessing: {
            title: 'معالجة البيانات',
            content:
              'نعالج بياناتك الشخصية لأغراض مشروعة، بما في ذلك تقديم خدماتنا وتحسين تجربة المستخدم والامتثال للالتزامات القانونية وحماية حقوقنا.',
          },
          dataSecurity: {
            title: 'أمان البيانات',
            content:
              'نطبق تدابير تقنية وتنظيمية مناسبة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.',
          },
          dataSharing: {
            title: 'مشاركة البيانات',
            content:
              'لا نبيع أو نتاجر أو نؤجر بياناتك الشخصية لأطراف ثالثة. قد نشارك بياناتك فقط عند الطلب القانوني أو بموافقتك الصريحة.',
          },
          dataRetention: {
            title: 'الاحتفاظ بالبيانات',
            content:
              'نحتفظ ببياناتك الشخصية فقط للمدة اللازمة لتحقيق الأغراض المبينة في هذه السياسة أو حسب ما يتطلبه القانون.',
          },
          userRights: {
            title: 'حقوقك',
            content:
              'لديك الحق في الوصول إلى بياناتك الشخصية أو تحديثها أو حذفها أو تقييد معالجتها. قد تعترض أيضاً على أنشطة معالجة معينة.',
          },
          contact: {
            title: 'تواصل معنا',
            content:
              'إذا كان لديك أي أسئلة حول حماية البيانات أو ترغب في ممارسة حقوقك، يرجى التواصل معنا على info@sera.gov.sa',
          },
          lastUpdated: 'آخر تحديث: يناير 2024',
        },
        cookiePolicy: {
          title: 'سياسة الكوكيز',
          description: 'تعرف على كيفية استخدامنا للكوكيز وتقنيات مماثلة.',
          introduction:
            'توضح سياسة الكوكيز هذه كيفية استخدامنا للكوكيز والتقنيات المماثلة عند زيارة موقعنا الإلكتروني أو استخدام خدماتنا.',
          whatAreCookies: {
            title: 'ما هي الكوكيز',
            content:
              'الكوكيز هي ملفات نصية صغيرة يتم وضعها على جهازك عند زيارة موقع إلكتروني. تُستخدم على نطاق واسع لجعل المواقع الإلكترونية تعمل بكفاءة أكبر وتوفير معلومات لأصحاب المواقع.',
          },
          howWeUseCookies: {
            title: 'كيف نستخدم الكوكيز',
            content:
              'نستخدم الكوكيز لتحسين تجربتك على موقعنا الإلكتروني، وتذكر تفضيلاتك، وتحليل حركة المرور على الموقع، وضمان الأمان.',
          },
          typesOfCookies: {
            title: 'أنواع الكوكيز',
            content:
              'نستخدم الكوكيز الأساسية (الضرورية لوظيفة الموقع)، وكوكيز الأداء (لتحليل الاستخدام)، والكوكيز الوظيفية (لتذكر التفضيلات)، وكوكيز الأمان (للحماية من التهديدات).',
          },
          managingCookies: {
            title: 'إدارة الكوكيز',
            content:
              'يمكنك التحكم في الكوكيز وإدارتها من خلال إعدادات المتصفح. يمكنك اختيار قبول أو رفض الكوكيز، ولكن هذا قد يؤثر على تجربتك على موقعنا.',
          },
          thirdPartyCookies: {
            title: 'كوكيز الأطراف الثالثة',
            content:
              'قد نستخدم خدمات الأطراف الثالثة التي تضع كوكيز خاصة بها على جهازك. هذه تحكمها سياسات الخصوصية الخاصة بالأطراف الثالثة المعنية.',
          },
          contact: {
            title: 'تواصل معنا',
            content:
              'إذا كان لديك أي أسئلة حول استخدامنا للكوكيز، يرجى التواصل معنا على info@sera.gov.sa',
          },
          lastUpdated: 'آخر تحديث: يناير 2024',
        },
        usagePolicy: {
          title: 'سياسة الاستخدام',
          introduction:
            'توفر هذه البوابة الإلكترونية معلومات وبيانات وخدمات تتعلق بعمل الهيئة السعودية لتنظيم الكهرباء بالمملكة العربية السعودية. باستخدامك لهذه البوابة، تقر بالامتناع عما يلي:',
          prohibitedActivities: {
            title: 'الأنشطة المحظورة',
            intro: 'باستخدامك لهذه البوابة، تقر بالامتناع عما يلي:',
            list: [
              'توفير أو تحميل ملفات تحتوى على برمجيات أو مواد أو بيانات أو معلومات أخرى ليست مملوكة لك أو لا تملك ترخيصاً بشأنها.',
              'استخدام هذه البوابة بأي طريقة لإرسال أي بريد إلكتروني تجاري أو غير مرغوب فيه، أو أي إساءة استخدام من هذا النوع.',
              'توفير أو تحميل ملفات على هذه البوابة تحتوى على فيروسات أو بيانات تالفة.',
              'نشر أو إعلان أو توزيع أو تعميم مواد أو معلومات تحتوي تشويهاً للسمعة أو انتهاكاً للأنظمة، أو مواد إباحية، أو بذيئة، أو مخالفة للآداب العامة، أو أي مواد أو معلومات غير قانونية من خلال البوابة.',
              'الاشتراك من خلال هذه البوابة في أنشطة غير مشروعة أو غير نظامية في المملكة العربية السعودية.',
              'الإعلان على هذه البوابة عن أي منتج أو خدمة تجعلنا في وضع انتهاك لأي قانون أو نظام مطبق في أي مجال.',
              'استخدام أي وسيلة أو برنامج أو إجراء لاعتراض أو محاولة اعتراض التشغيل الصحيح للبوابة.',
              'القيام بأي إجراء يفرض حملاً غير معقول أو كبير بصورة غير مناسبة على البنية التحتية للبوابة.',
            ],
          },
          termination: {
            title: 'إنهاء الاستخدام',
            content:
              'يجوز للهيئة وحسب تقديرها المطلق إنهاء أو تقييد أو إيقاف حقك في الدخول إلى البوابة واستخدامها دون إشعار ولأي سبب، بما في ذلك مخالفة شروط وبنود الاستخدام أو أي سلوك آخر قد نعتبره حسب تقديرنا الخاص غير قانوني أو مضرًا بالآخرين، وفي حال الإنهاء، فإنه لن يكون مصرحاً لك بالدخول إلى هذه البوابة.',
          },
          links: {
            title: 'الروابط الإلكترونية',
            content:
              'يتم توفير بعض الروابط لمواقع مستقلة عن بوابة الهيئة الإلكترونية، ونحن غير مسؤولين عن محتويات أو مصداقية البوابات و/أو المواقع التي نرتبط بها ولا نصادق على محتوياتها، واستخدام الروابط للوصول إلى تلك المواقع أو البوابات يتم على مسؤوليتك الخاصة.',
          },
          intellectualProperty: {
            title: 'حقوق الملكية الفكرية',
            content:
              'هذه البوابة تابعة للهيئة السعودية لتنظيم الكهرباء وجميع حقوق الملكية الفكرية والحقوق الأخرى المتعلقة بمحتوى هذه البوابة مملوكة للهيئة. لا يجوز لك نسخ أو تعديل أو توزيع أو إرسال أو عرض أو تنفيذ أو استنساخ أو نشر أو ترخيص أو إنشاء أعمال مشتقة من أو نقل أو بيع أي معلومات أو برامج أو منتجات أو خدمات تم الحصول عليها من هذه البوابة.',
          },
          personalInfoProtection: {
            title: 'حماية المعلومات الشخصية',
            content:
              'لن تكون معلوماتك الشخصية متاحة إلا لموظفي الهيئة السعودية لتنظيم الكهرباء الذين يحتاجون إلى الاطلاع عليها والمصرح لهم بذلك. ولن تكون تلك المعلومات متاحة لاطلاع الجمهور من غير موافقتك. وعلاوة على ذلك لن يتم تبادل، أو تداول أي من تلك المعلومات أو بيعها لأي طرف آخر من غير موافقتك المسبقة.',
          },
          cookies: {
            title: 'ملفات تعريف الارتباط',
            content:
              'قد نقوم بتخزين ما يسمى بملفات تعريف الارتباط "Cookies" على الجهاز الخاص بك عندما تقوم بزيارة موقعنا. حيث أن ملفات تعريف الارتباط "Cookies" هي جزء من البيانات التي تحددك كمستخدم بشكل فريد. كما يمكن استخدامها لتحسين معرفتك بهذه البوابة الإلكترونية ولفهم قاعدة مستخدم هذه البوابة على نحو أفضل.',
          },
          lastUpdated: 'آخر تحديث: 28 أغسطس 2025',
        },
      },
      faq: {
        title: 'الأسئلة الشائعة',
        searchPlaceholder: 'ابحث عن الأسئلة...',
        categories: {
          general: 'عام',
          services: 'الخدمات',
          billing: 'الفوترة',
          technical: 'دعم تقني',
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
          saudiGov: 'هيئة الحكومة الرقمية',
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
      survey: {
        title: "استطلاع رأي",
        defaultTitle: "استطلاع تقييم الخدمة",
        message: "هل تود تقديم ملاحظاتك حول هذه الشكوى؟",
        takeSurvey: "أخذ الاستطلاع",
        button: "قيم هذه الخدمة",
        thankYou: "شكراً لك",
        completed: "تم تسجيل ملاحظاتك",
        loading: "جاري تحميل الاستطلاع...",
        progress: "السؤال {{current}} من {{total}}",
        comment: {
          placeholder: "أدخل تعليقاتك هنا..."
        },
        buttons: {
          skip: "تخطي الاستطلاع",
          previous: "السابق",
          next: "التالي",
          submit: "إرسال الاستطلاع"
        },
        completion: {
          title: "تم إكمال الاستطلاع",
          message: "شكراً لك على ملاحظاتك! تم تسجيل إجاباتك."
        },
        cancel: {
          title: "إلغاء الاستطلاع",
          message: "هل أنت متأكد من رغبتك في إلغاء هذا الاستطلاع؟ سيتم فقدان تقدمك."
        },
        errors: {
          title: "خطأ في الاستطلاع",
          loadFailed: "فشل في تحميل أسئلة الاستطلاع",
          submitFailed: "فشل في إرسال إجابات الاستطلاع",
          networkError: "خطأ في الشبكة. يرجى التحقق من اتصالك.",
          missingParameters: "معاملات الاستطلاع مفقودة",
          surveyNotActive: "هذا الاستطلاع لم يعد نشطاً"
        }
      },
      dataShare: {
        title: 'مشاركة البيانات',
        description: 'تقديم ومتابعة طلبات مشاركة البيانات',
        summary: {
          title: 'ملخص الطلبات',
          pending: 'قيد المراجعة',
          approved: 'موافق عليه',
          rejected: 'مرفوض',
          total: 'المجموع',
        },
        actions: {
          newRequest: {
            title: 'طلب جديد',
            description: 'تقديم طلب مشاركة بيانات جديد',
          },
          viewRequests: {
            title: 'عرض طلباتي',
            description: 'عرض ومتابعة طلباتك الحالية',
          },
        },
        filters: {
          all: 'جميع الطلبات',
          pending: 'قيد المراجعة',
          approved: 'موافق عليه',
          rejected: 'مرفوض',
        },
        view: {
          title: 'طلبات مشاركة البيانات',
          filter: 'تصفية',
          filterBy: 'تصفية حسب',
          noRequests: 'لم يتم العثور على طلبات مشاركة بيانات',
          loadError: 'فشل في تحميل الطلبات',
          requestNumber: 'رقم الطلب',
          requestDate: 'تاريخ الطلب',
          requestNature: 'طبيعة الطلب',
          dataFormat: 'نوع البيانات',
          viewDetails: 'عرض التفاصيل',
        },
        details: {
          title: 'تفاصيل الطلب',
          noData: 'لا تتوفر بيانات الطلب',
          basicInfo: 'المعلومات الأساسية',
          requestDetails: 'تفاصيل الطلب',
          dates: 'التواريخ المهمة',
          applicationNo: 'رقم الطلب',
          requestTitle: 'عنوان الطلب',
          applicantName: 'اسم مقدم الطلب',
          email: 'البريد الإلكتروني',
          contactNo: 'رقم الاتصال',
          requiredDataDetails: 'تفاصيل البيانات المطلوبة',
          legalJustification: 'المرجعية القانونية',
          dataFormatType: 'نوع البيانات',
          requestNature: 'طبيعة الطلب',
          requestPriority: 'أولوية الطلب',
          reasonForRequest: 'سبب الطلب',
          requestRaisedDate: 'تاريخ تقديم الطلب',
          lastUpdatedDate: 'تاريخ آخر تحديث',
          timeStart: 'تاريخ البدء',
          timeEnd: 'تاريخ الانتهاء',
          rejectionReason: 'سبب الرفض',
        },
        create: {
          title: 'طلب مشاركة بيانات جديد',
          externalFormTitle: 'نموذج خارجي',
          externalFormDescription: 'يتم تقديم طلبات مشاركة البيانات من خلال نموذج خارجي. انقر أدناه لفتح النموذج في المتصفح.',
          openExternalForm: 'فتح نموذج الطلب',
          form: {
            notice: {
              title: 'تنويه هام',
              point1: 'تقوم الهيئة بمعالجة الطلب وإفادة مقدم الطلب خلال 30 يوم من استلام الطلب.',
              point2: 'يتم تزويد الفرد بالمعلومات المطلوبة خلال 10 أيام عمل من استلام المبلغ.',
              point3: 'إذا قامت الهيئة باتخاذ قرار التمديد فيجب ألا يتجاوز فترة الرد على مقدم الطلب 30 يوم إضافية وذلك بحسب حجم وطبيعة المعلومات المطلوبة.',
              point4: 'في حالة التظلم يجب على مقدم الطلب رفع التظلم خلال 10 أيام عمل من استلامه لقرار الهيئة.',
            },
            sections: {
              basicInfo: 'البيانات الأساسية',
              requestDetails: 'تفاصيل البيانات المطلوبة',
            },
            fields: {
              applicantName: 'اسم مقدم الطلب',
              nationalIdentity: 'الهوية الوطنية',
              entityType: 'صفة الجهة',
              entityName: 'إسم الجهة',
              affiliationProofPrivate: 'ارفاق مايثبت بأن مقدم الطلب ممثل عن المنشأة',
              affiliationProofGovernment: 'ارفاق مايثبت بأن مقدم الطلب ضابط اتصال لجهة حكومية',
              crNumber: 'رقم السجل التجاري',
              mobileNumber: 'رقم الجوال',
              email: 'البريد الالكتروني',
              requestTitle: 'عنوان الطلب',
              requestPurpose: 'الغرض من الطلب',
              requestPurposeDescription: 'وصف الغرض من الطلب بشكل مفصل',
              requestType: 'نوع الطلب',
              requestNature: 'طبيعة الطلب',
              dataFormatType: 'نوع تنسيق البيانات',
              participationMechanism: 'آلية المشاركة',
              timeStart: 'الفترة الزمنية المطلوبة – من',
              timeEnd: 'الفترة الزمنية المطلوبة – الى',
              isDataProvidedThirdParty: 'هل سيتم تزويد البيانات أو نتائج التحليل لطرف ثالث؟',
              isDataAnalysisPublished: 'هل سيتم نشر نتائج تحليل البيانات؟',
              dataSharingAgreementExists: 'هل توجد اتفاقية مشاركة بيانات مسبقًا؟',
              isEntityDataRepresentation: 'هل مقدم الطلب هو ممثل البيانات لدى الجهة؟',
              isContainsPersonalData: 'هل تحتوي على بيانات شخصية؟',
              legalBasisForDataRequest: 'هل يوجد لدى الجهة مسوغ قانوني لطلب البيانات؟',
              dataSharingAgreementFile: 'رفع ملف اتفاقية مشاركة بيانات',
              legalJustificationDescription: 'وصف المسوغ القانوني',
              requiredDataDetails: 'وصف البيانات المطلوبة بشكل مفصل',
              isSatisfiedWithProcess: 'هل أنت راضي عن طريقة تقديم طلب المعلومات؟',
            },
            options: {
              entityType: {
                government: 'جهة حكومية',
                individual: 'أفراد',
                private: 'قطاع خاص',
              },
              requestPurpose: {
                personal: 'الاستخدام الشخصي',
                research: 'البحث العلمي',
                business: 'متطلبات أعمال',
                other: 'أخرى',
              },
              requestType: {
                normal: 'عادي',
                urgent: 'طلب عاجل',
              },
              requestNature: {
                once: 'مرة واحدة',
                recurring: 'متكرر',
              },
              dataFormatType: {
                csv: 'CSV',
                excel: 'Excel',
                json: 'JSON',
                pdf: 'PDF',
              },
              participationMechanism: {
                dataset: 'مجموعة البيانات',
                integration: 'التكامل',
              },
            },
            selectOption: 'اختر',
            enterText: 'أدخل النص',
            attachFile: 'ارفاق ملف',
            selectDate: 'اختر التاريخ',
            removeFile: 'إزالة الملف',
            removeFileConfirm: 'هل أنت متأكد من إزالة "{{fileName}}"؟',
            yes: 'نعم',
            no: 'لا',
            declaration: 'أقر وأتعهد بأن جميع المعلومات المقدمة في هذا الطلب صحيحة وأتحمل المسؤولية في حال ثبوت خلاف ذلك.',
            acknowledge: 'أقر وأتعهد',
            submit: 'تقديم الطلب',
            filePickerError: 'خطأ في اختيار الملف',
            submitError: 'فشل في تقديم الطلب',
            validation: {
              entityTypeRequired: 'الرجاء اختيار صفة الجهة',
              requestTitleRequired: 'الرجاء إدخال عنوان الطلب',
              requestPurposeRequired: 'الرجاء اختيار الغرض من الطلب',
              requestTypeRequired: 'الرجاء اختيار نوع الطلب',
              requestNatureRequired: 'الرجاء اختيار طبيعة الطلب',
              dataFormatTypeRequired: 'الرجاء اختيار نوع تنسيق البيانات',
              declarationRequired: 'يجب الإقرار والتعهد بصحة المعلومات',
              contactInfoRequired: 'الرجاء تقديم رقم الجوال والبريد الالكتروني',
              privateEntityInfoRequired: 'الرجاء تقديم جميع المعلومات المطلوبة للقطاع الخاص',
              governmentEntityInfoRequired: 'الرجاء تقديم جميع المعلومات المطلوبة للجهة الحكومية',
              startDateBeforeEnd: 'يجب أن يكون تاريخ البداية قبل تاريخ النهاية',
              endDateAfterStart: 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية',
              fileTooLarge: 'حجم الملف ({{size}} ميجابايت) يتجاوز الحد الأقصى المسموح به وهو 5 ميجابايت',
              fileConversionError: 'فشل في معالجة الملف. يرجى المحاولة مرة أخرى',
            },
            success: {
              title: 'تم تقديم الطلب',
              message: 'تم تقديم طلب مشاركة البيانات بنجاح. سيتم إخطارك بالحالة خلال 30 يومًا.',
            },
          },
        },
      },
      complaints: {
        title: 'الشكاوى',
        description: 'تقديم ومتابعة الشكاوى الخاصة بك بسهولة',
        welcomeTitle: 'مركز الشكاوى',
        welcomeDescription: 'تقديم الشكاوى ومتابعة حالتها بسهولة وشفافية',
        newComplaint: {
          title: 'شكوى جديدة',
          description: 'تقديم شكوى أو اعتراض جديد',
        },
        viewComplaints: {
          title: 'عرض الشكاوى',
          description: 'عرض ومتابعة الشكاوى الخاصة بك الحالية',
        },
        filters: {
          all: 'الكل',
          open: 'مفتوحة',
          closed: 'مغلقة',
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
          removeAttachment: 'إزالة المرفق',
          removeAttachmentConfirm: 'هل أنت متأكد من إزالة هذا المرفق؟',
          submit: 'تقديم الشكوى',
          submitting: 'جاري التقديم...',
          accountNumber: 'رقم الحساب',
          orderNumber: 'رقم الطلب',
          accountNumberPlaceholder: 'أدخل رقم الحساب',
          orderNumberPlaceholder: 'أدخل رقم الطلب',
          loadingFormData: 'جاري تحميل بيانات النموذج...',
          success: 'تم بنجاح',
          successMessage: 'تم تقديم شكواك بنجاح. رقم الشكوى: #12345',
          submissionSuccess: 'تم تقديم الشكوى بنجاح!',
          successWithCaseId: 'تم تقديم الشكوى بنجاح! رقم الشكوى: {{caseId}}',
          error: 'خطأ',
          errorMessage: 'يرجى ملء جميع الحقون المطلوبة',
          submitError: 'حدث خطأ أثناء تقديم الشكوى',
          uploadFileTitle: 'رفع ملف',
          uploadFileMessage:
            'الحد الأقصى: 20 ميجا\nالأنواع المسموحة: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          cancel: 'إلغاء',
          chooseFile: 'اختيار ملف',
          mockDocument: 'استخدام مستند تجريبي',
          ok: 'موافق',
          close: 'إغلاق',
          required: '*',
          attachmentError: 'خطأ في المرفق',
          attachmentFailedSingle: 'فشل في معالجة المرفق: {{fileName}}',
          attachmentFailedMultiple: 'فشل في معالجة {{count}} مرفقات: {{fileNames}}',
          attachmentErrorDetails: 'تفاصيل الخطأ',
          continueWithoutAttachments: 'المتابعة بدون هذه المرفقات',
          fixAttachments: 'إصلاح المرفقات',
        },
        view: {
          title: 'الشكاوى',
          loading: 'جاري التحميل...',
          noComplaints: 'لا توجد شكاوى',
          noComplaintsMessage: 'لم يتم العثور على أي شكاوى بالفلتر المحدد',
          yourComplaints: 'الشكاوى الخاصة بك',
          invalidDate: 'تاريخ غير صحيح',
          priority: {
            high: 'عالية',
            medium: 'متوسطة',
            low: 'منخفضة',
          },
          status: {
            open: 'مفتوحة',
            closed: 'مغلقة',
            unknown: 'غير معروف',
          },
          error: "خطأ",
          invalidComplaint: "بيانات شكوى غير صحيحة",
        },
        status: {
          open: 'مفتوحة',
          closed: 'مغلقة',
          closedAsInquiry: 'مغلقة كاستفسار',
          unknown: 'حالة غير معروفة',
        },
        stage: {
          complaintCheck: 'فحص الشكوى',
          investigation: 'قيد التحقيق',
          providerResponse: 'انتظار رد مقدم الخدمة',
          finalDecision: 'القرار النهائي',
          closed: 'مغلقة',
          unknown: 'مرحلة غير معروفة',
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
        details: {
          title: "تفاصيل الشكوى",
          caseNumber: "رقم الشكوى: {{number}}",
          loading: "جاري تحميل تفاصيل الشكوى...",
          notFound: "لم يتم العثور على الشكوى",
          loadError: "فشل في تحميل تفاصيل الشكوى",
          error: "خطأ",
          sections: {
            status: "الحالة",
            basicInfo: "المعلومات الأساسية",
            description: "الوصف",
            providerResponse: "رد مقدم الخدمة",
            result: "نتيجة المعالجة",
            attachments: "المرفقات",
            timeline: "الخط الزمني",
          },
          complaintType: "نوع الشكوى",
          serviceProvider: "مقدم الخدمة",
          customerType: "فئة الاستهلاك",
          region: "المنطقة",
          city: "المدينة",
          office: "المكتب",
          creationDate: "تاريخ الإنشاء",
          closedDate: "تاريخ الإغلاق",
          stage: "المرحلة",
          noAttachments: "لا توجد مرفقات متاحة",
          noComments: "لا توجد تحديثات متاحة",
          attachment: {
            title: "المرفق",
            message: "ماذا تريد أن تفعل مع {{fileName}}؟",
            download: "تحميل",
            downloadTitle: "تحميل",
            downloadMessage: "تم بدء تحميل {{fileName}}",
            downloading: "جاري تحميل {{fileName}}...",
            downloadSuccess: "تم تحميل {{fileName}} بنجاح",
            downloadError: "فشل في تحميل المرفق",
            downloadUnsupported: "لا يمكن فتح {{fileName}}. نوع الملف غير مدعوم على هذا الجهاز",
            openFile: "فتح الملف",
            shareTitle: "مشاركة المستند",
            fileLocation: "تم تحميل الملف",
            fileLocationMessage: "تم حفظ الملف في: {{path}}",
            openError: "لا يمكن فتح الملف",
            openErrorMessage: "لا يمكن فتح الملف المحمل. يمكنك العثور عليه في مدير الملفات بجهازك.",
            saveSuccess: "تم حفظ الملف",
            saveSuccessMessage: "تم حفظ {{fileName}} بنجاح في الموقع المحدد.",
            saveTitle: "حفظ {{fileName}}",
            saveMessage: "اختر مكان حفظ {{fileName}}",
          },
          survey: {
            title: "استطلاع رأي",
            defaultTitle: "استطلاع تقييم الخدمة",
            message: "هل تود تقديم ملاحظاتك حول هذه الشكوى؟",
            takeSurvey: "أخذ الاستطلاع",
            button: "قيم هذه الخدمة",
            thankYou: "شكراً لك",
            completed: "تم تسجيل ملاحظاتك",
            loading: "جاري تحميل الاستطلاع...",
            progress: "السؤال {{current}} من {{total}}",
            comment: {
              placeholder: "أدخل تعليقاتك هنا..."
            },
            buttons: {
              skip: "تخطي الاستطلاع",
              previous: "السابق",
              next: "التالي",
              submit: "إرسال الاستطلاع"
            },
            completion: {
              title: "تم إكمال الاستطلاع",
              message: "شكراً لك على ملاحظاتك! تم تسجيل إجاباتك."
            },
            cancel: {
              title: "إلغاء الاستطلاع",
              message: "هل أنت متأكد من رغبتك في إلغاء هذا الاستطلاع؟ سيتم فقدان تقدمك."
            },
            errors: {
              title: "خطأ في الاستطلاع",
              loadFailed: "فشل في تحميل أسئلة الاستطلاع",
              submitFailed: "فشل في إرسال إجابات الاستطلاع",
              networkError: "خطأ في الشبكة. يرجى التحقق من اتصالك.",
              missingParameters: "معاملات الاستطلاع مفقودة",
              surveyNotActive: "هذا الاستطلاع لم يعد نشطاً"
            }
          },
          reopen: {
            title: "إعادة فتح الشكوى",
            message: "يمكن إعادة فتح هذه الشكوى إذا لم تكن راضياً عن الحل",
            button: "إعادة فتح الشكوى",
          },
        },
      },
      comments: {
        title: 'التعليقات',
        addComment: 'إضافة تعليق',
        commentText: 'نص التعليق',
        commentPlaceholder: 'أدخل تعليقك هنا...',
        attachments: 'المرفقات',
        attachFile: 'إرفاق ملف',
        submit: 'إرسال التعليق',
        success: 'نجح',
        commentAdded: 'تم إضافة التعليق بنجاح',
        error: 'خطأ',
        commentRequired: 'نص التعليق مطلوب',
        submitError: 'فشل في إرسال التعليق',
        loadError: 'فشل في تحميل التعليقات',
        loading: 'جاري تحميل التعليقات...',
        noComments: 'لا توجد تعليقات بعد',
        maxAttachmentsReached: 'الحد الأقصى 3 مرفقات مسموح',
        filePickerError: 'فشل في فتح منتقي الملفات',
        fileAttachmentError: 'فشل في إرفاق الملف',
        fileSelectionError: 'فشل في معالجة الملف المحدد',
        removeAttachment: 'إزالة المرفق',
        removeAttachmentConfirm: 'هل أنت متأكد من إزالة هذا المرفق؟',
        attachmentNotAvailable: 'المرفق غير متاح للتحميل',
        downloadError: 'فشل في تحميل المرفق',
        saveAttachment: 'حفظ {{fileName}}',
        saveAttachmentMessage: 'اختر مكان حفظ {{fileName}}',
        you: 'أنت',
        seraTeam: 'فريق الهيئة',
        closedComplaint: 'مغلقة',
      },
      permits: {
        title: 'طلب التصريح',
        description: 'تقديم ومتابعة طلبات التصريح بسهولة',
        welcomeTitle: 'مركز طلبات التصريح',
        welcomeDescription: 'تقديم طلبات التصريح ومتابعة حالتها بسهولة وشفافية',
        newPermit: {
          title: 'طلب تصريح جديد',
          description: 'تقديم طلب تصريح جديد',
        },
        viewPermits: {
          title: 'عرض طلبات التصريح',
          description: 'عرض ومتابعة طلبات التصريح الحالية',
        },
        permitTypes: {
          powerGeneration: {
            title: 'طلب تصريح محطة توليد الطاقة',
            description: 'طلب تصريح لإنشاء محطة توليد أو محطة توليد مشتركة',
          },
          districtCooling: {
            title: 'طلب تصريح محطة تبريد المنطقة',
            description: 'طلب تصريح لدراسة إنشاء محطة تبريد المنطقة',
          },
        },
        overview: {
          title: 'ملخص طلبات التصريح',
          all: 'جميع الطلبات',
          completed: 'طلبات مكتملة',
          processing: 'طلبات تجهيز',
          unacceptable: 'طلبات غير مقبولة',
          unsent: 'طلبات غير مرسلة',
          returned: 'طلبات مرجعة',
        },
        view: {
          title: 'طلبات التصريح',
          loading: 'Loading...',
          noPermits: 'No Permit Requests',
          noPermitsMessage: 'No permit requests found with the selected filter',
          yourPermits: 'Your Permit Requests',
          invalidDate: 'Invalid Date',
          table: {
            actions: 'Actions',
            requestNumber: 'Request Number',
            requestStage: 'Request Stage',
            requestName: 'Request Name',
            requestDate: 'Request Date',
            requestStatus: 'Request Status',
          },
          refreshing: 'Refreshing...',
          retry: 'Retry',
          errorMessage: 'Failed to load permit requests',
        },
        status: {
          all: 'جميع',
          completed: 'مكتمل',
          processing: 'تجهيز',
          unacceptable: 'غير مقبول',
          unsent: 'غير مرسل',
          returned: 'مرجع',
          pending: 'معالج',
          approved: 'موافق',
          rejected: 'مرفوض',
        },
        powerGeneration: {
          title: 'طلب تصريح محطة توليد الطاقة',
          saveForLater: 'حفظ',
          submit: 'تقديم الطلب',
          attachFile: 'إرفاق ملف',
          fileRequirements:
            'الحد الأقصى: 20 ميجا | الأنواع: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          confirmExit: {
            title: 'تأكيد الخروج',
            message: 'هل أنت متأكد من الخروج؟ ستفقد أي تغييرات غير محفوظة.',
          },
          fileAttachment: {
            title: 'إرفاق ملف',
            message: 'اختر ملف للإرفاق',
            select: 'اختيار ملف',
          },
          saveSuccess: {
            title: 'تم الحفظ بنجاح',
            message: 'تم حفظ طلبك لإكماله لاحقاً.',
          },
          saveError: {
            message: 'فشل في حفظ الطلب. يرجى المحاولة مرة أخرى.',
          },
          submitSuccess: {
            title: 'تم تقديم الطلب',
            message: 'تم تقديم طلب التصريح بنجاح. رقم الطلب: {{permitNumber}}',
          },
          submitError: {
            message: 'فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.',
          },
          validation: {
            requiredFields: 'يرجى ملء جميع الحقول المطلوبة.',
          },
          sections: {
            basicData: '1. البيانات الأساسية للمحطة',
            locationLayout: '2. إحداثيات ومخطط موقع المحطة/المشروع',
            energySales: '3. معلومات بيع الطاقة',
            gridConnection: '4. الربط بشبكة الكهرباء العامة',
          },
          fields: {
            userAccount: 'حساب المستخدم',
            stationNature: 'طبيعة منتج المحطة',
            stationType: 'نوع المحطة المقترحة',
            stationLocation: 'موقع المحطة/المشروع',
            expectedPowerAC:
              'القدرة المتوقعة للكهرباء/التيار المتردد (ميجاواط)',
            expectedPowerDC:
              'القدرة المتوقعة للكهرباء/التيار المستمر (ميجاواط)',
            fuelType: 'نوع الوقود المتوقع استخدامه',
            stationUses: 'استخدامات المحطة',
            dualProductionCapacity:
              'السعة المتوقعة للإنتاج المزدوج (المياه: م³/يوم)',
            cogenerationCapacity:
              'السعة المتوقعة للتوليد المشترك (البخار: طن/يوم)',
            coordinatesFile: 'الإحداثيات',
            aerialPhotosFile: 'الصور الجوية ومخطط الأرض والمباني',
            siteOwnershipFile: 'وثيقة ملكية الموقع أو إثبات حق الاستخدام',
            fuelAllocationFile: 'تخصيص الوقود من وزارة الطاقة',
            energyEfficiencyFile:
              'إثبات التنسيق مع المركز السعودي لكفاءة الطاقة',
            energySoldTo: 'الجهة التي ستباع لها الطاقة',
            energyPercentageSold: 'نسبة الطاقة المباعة (%)',
            totalLoad: 'إجمالي حمولة طالب الترخيص (ميجاواط)',
            gridConnection: 'الربط بشبكة الكهرباء العامة',
            anchorPoint: 'نقطة الربط التقريبية',
            connectionVoltage: 'جهد الربط المتوقع (كيلوفولت)',
            operationDate: 'التاريخ المتوقع لبدء التشغيل التجاري',
            initialApprovalFile:
              'الموافقة المبدئية من مقدم خدمة الكهرباء العامة',
          },
          placeholders: {
            selectAccount: 'اختر حساب المستخدم',
            selectNature: 'اختر طبيعة المحطة',
            selectType: 'اختر نوع المحطة',
            enterLocation: 'أدخل موقع المحطة/المشروع',
            enterPowerAC: 'أدخل القدرة المتوقعة للتيار المتردد بالميجاواط',
            enterPowerDC: 'أدخل القدرة المتوقعة للتيار المستمر بالميجاواط',
            selectFuel: 'اختر نوع الوقود',
            selectUses: 'اختر استخدامات المحطة',
            enterDualProduction: 'أدخل سعة الإنتاج المزدوج',
            enterCogeneration: 'أدخل سعة التوليد المشترك',
            enterEnergySoldTo: 'أدخل اسم الجهة',
            enterPercentage: 'أدخل النسبة المئوية (0-100)',
            enterTotalLoad: 'أدخل إجمالي الحمولة بالميجاواط',
            selectGridConnection: 'اختر خيار ربط الشبكة',
            enterAnchorPoint: 'أدخل نقطة الربط التقريبية',
            enterVoltage: 'أدخل الجهد بالكيلوفولت',
            enterOperationDate: 'أدخل تاريخ التشغيل المتوقع',
          },
          mockData: {
            accounts: {
              company1: 'حساب عبدالله1',
              company2: 'حساب عبدالله2',
              company3: 'حساب عبدالله3',
            },
            natures: {
              solar: 'الطاقة الشمسية',
              wind: 'طاقة الرياح',
              gas: 'الغاز الطبيعي',
              diesel: 'الديزل',
              hybrid: 'مختلط (شمسي + رياح)',
            },
            types: {
              commercial: 'تجاري',
              industrial: 'صناعي',
              residential: 'سكني',
              utility: 'واسع النطاق',
            },
            fuels: {
              naturalGas: 'الغاز الطبيعي',
              diesel: 'الديزل',
              solar: 'الطاقة الشمسية (بدون وقود)',
              wind: 'طاقة الرياح (بدون وقود)',
              biomass: 'الكتلة الحيوية',
            },
            uses: {
              powerOnly: 'توليد الطاقة فقط',
              cogeneration: 'التوليد المشترك (طاقة + بخار)',
              dualProduction: 'الإنتاج المزدوج (طاقة + مياه)',
            },
            gridConnection: {
              yes: 'نعم',
              no: 'لا',
              planned: 'مخطط',
            },
          },
        },
        districtCooling: {
          title: 'طلب تصريح محطة تبريد المنطقة',
          saveForLater: 'حفظ',
          submit: 'تقديم الطلب',
          attachFile: 'إرفاق ملف',
          fileRequirements:
            'الحد الأقصى: 20 ميجا | الأنواع: PDF, DOC, DOCX, XLS, XLSX, PNG, JPEG, JPG',
          confirmExit: {
            title: 'تأكيد الخروج',
            message: 'هل أنت متأكد من الخروج؟ ستفقد أي تغييرات غير محفوظة.',
          },
          fileAttachment: {
            title: 'إرفاق ملف',
            message: 'اختر ملف للإرفاق',
            select: 'اختيار ملف',
          },
          saveSuccess: {
            title: 'تم الحفظ بنجاح',
            message: 'تم حفظ طلبك لإكماله لاحقاً.',
          },
          saveError: {
            message: 'فشل في حفظ الطلب. يرجى المحاولة مرة أخرى.',
          },
          submitSuccess: {
            title: 'تم تقديم الطلب',
            message: 'تم تقديم طلب التصريح بنجاح. رقم الطلب: {{permitNumber}}',
          },
          submitError: {
            message: 'فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.',
          },
          validation: {
            requiredFields: 'يرجى ملء جميع الحقول المطلوبة.',
          },
          sections: {
            basicData: '1. البيانات الأساسية للمحطة',
            gridConnection: '2. معلومات الربط بالشبكة',
          },
          fields: {
            userAccount: 'اختيار الحساب',
            stationLocation: 'موقع المحطة/المشروع',
            coolingPurposes: 'أغراض تبريد المنطقة',
            expectedCoolingQuantity:
              'الكمية المتوقعة من مياه التبريد (طن تبريد)',
            powerSource: 'مصدر الطاقة',
            operationDate: 'التاريخ المتوقع للتشغيل التجاري',
            coolingWaterSource: 'مصدر مياه التبريد',
            ministryApprovalFile: 'موافقة وزارة البيئة والمياه والزراعة',
            landPlanFile: 'مخطط الأرض والمباني',
            energyEfficiencyFile: 'التنسيق مع المركز السعودي لكفاءة الطاقة',
            fuelAllocationFile: 'تخصيص الوقود من وزارة الطاقة',
            gridConnection: 'الربط بشبكة الكهرباء العامة',
            load: 'الحمولة (ميجاواط)',
            internalVoltage: 'الجهد الداخلي المكتسب (كيلوفولت)',
            anchorPoint: 'نقطة الربط التقريبية',
            networkType: 'الربط بشبكة النقل أو التوزيع',
            serviceProviderConsentFile: 'موافقة مقدم الخدمة على الربط',
          },
          placeholders: {
            selectAccount: 'اختر الحساب',
            enterLocation: 'أدخل موقع المحطة/المشروع',
            selectPurposes: 'اختر أغراض تبريد المنطقة',
            enterCoolingQuantity: 'أدخل الكمية المتوقعة بالطن',
            selectPowerSource: 'اختر مصدر الطاقة',
            enterOperationDate: 'أدخل تاريخ التشغيل المتوقع (MM/DD/YYYY)',
            selectWaterSource: 'اختر مصدر مياه التبريد',
            selectGridConnection: 'اختر خيار ربط الشبكة',
            enterLoad: 'أدخل الحمولة بالميجاواط',
            enterVoltage: 'أدخل الجهد بالكيلوفولت',
            enterAnchorPoint: 'أدخل نقطة الربط التقريبية',
            selectNetworkType: 'اختر نوع الشبكة',
          },
          mockData: {
            accounts: {
              company1: 'الشركة السعودية للكهرباء',
              company2: 'شركة مرافق للطاقة والمياه',
              company3: 'شركة حلول تبريد المنطقة المحدودة',
            },
            purposes: {
              commercial: 'المباني التجارية',
              residential: 'المجمعات السكنية',
              industrial: 'المنشآت الصناعية',
              mixed: 'التطوير المختلط الاستخدام',
            },
            powerSources: {
              grid: 'شبكة الكهرباء',
              solar: 'الطاقة الشمسية',
              gas: 'الغاز الطبيعي',
              hybrid: 'مختلط (شبكة + شمسي)',
            },
            waterSources: {
              seawater: 'مياه البحر',
              groundwater: 'المياه الجوفية',
              wastewater: 'مياه الصرف المعالجة',
              desalinated: 'المياه المحلاة',
              other: 'أخرى',
            },
            gridConnection: {
              yes: 'نعم',
              no: 'لا',
            },
            networkTypes: {
              transmission: 'شبكة النقل',
              distribution: 'شبكة التوزيع',
            },
          },
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
