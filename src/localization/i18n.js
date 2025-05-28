import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        cancel: 'Cancel',
        ok: 'OK',
        exit: 'Exit',
        error: 'Error',
        save: 'Save',
        submit: 'Submit',
        loading: 'Loading...',
        retry: 'Retry',
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
        exit: 'خروج',
        error: 'خطأ',
        save: 'حفظ',
        submit: 'تقديم',
        loading: 'جاري التحميل...',
        retry: 'إعادة المحاولة',
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
        homeScreen: {
          title: 'الصفحة الرئيسية الجديدة',
          description: 'تفعيل تجربة الصفحة الرئيسية المحسنة',
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
          description: 'تعرف على كيفية استخدامنا للكوكيز وتكنولوجيات مماثلة.',
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
          lastUpdated: 'آخر تحديث: 28 أغسطس 2024',
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
