/**
 * Application Configuration
 * Central place for app-wide settings and feature flags
 */

const AppConfig = {
  // API Configuration
  api: {
    // Set to true to use mock data, false to use real API
    useMockData: false, // Change this to switch between modes

    // Default environment for API calls
    defaultEnvironment: 'flux', // 'prod' or 'flux'

    // Request timeout in milliseconds
    requestTimeout: 30000,
  },

  // Development Configuration
  development: {
    // Enable debug logging
    enableDebugLogs: __DEV__,

    // Show performance metrics
    showPerformanceMetrics: false,

    // Enable mock data for specific services
    mockServices: {
      complaints: false, // Set to true to force mock data for complaints
      nafath: false, // Set to true to force mock data for nafath
      contact: false, // Set to true to force mock data for contact validation
    },
  },

  // Feature Flags
  features: {
    // Enable/disable specific features
    complaintsIntegration: true,
    realTimeUpdates: false,
    offlineSupport: false,
    pushNotifications: true,
  },

  // UI Configuration
  ui: {
    // Default theme
    defaultTheme: 'light', // 'light' or 'dark'

    // Default language
    defaultLanguage: 'ar', // 'ar' or 'en'

    // Animation settings
    animations: {
      duration: 300,
      enabled: true,
    },
  },

  // Pagination Settings
  pagination: {
    defaultPageSize: 0,
    maxPageSize: 100,
  },
};

export default AppConfig;
