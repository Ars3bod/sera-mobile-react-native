/**
 * Application Configuration
 * Central place for app-wide settings and feature flags
 */

const AppConfig = {
  // API Configuration
  api: {
    // Set to true to use mock data, false to use real API
    useMockData: false, // Change this to switch between modes - temporarily enabled for testing

    // Default environment for API calls
    defaultEnvironment: 'flux', // 'prod' or 'flux'

    // Request timeout in milliseconds
    requestTimeout: 30000,
  },

  // Session Management Configuration - Simplified
  session: {
    // Idle timeout in minutes (15 minutes default for government apps)
    idleTimeoutMinutes: 15,

    // Enable session management
    enableSessionManagement: true,

    // Enable idle timeout detection
    enableIdleTimeout: true,

    // Clear app data on logout
    clearDataOnLogout: true,

    // Reset navigation stack on session expiry
    resetNavigationOnExpiry: true,

    // Screens that should be excluded from idle timeout
    excludedScreens: [
      'Login',
      'Splash',
      'NafathLogin',
      'NafathVerification',
    ],
  },

  // Development Configuration
  development: {
    // Enable debug logging
    enableDebugLogs: __DEV__,

    // Show performance metrics
    showPerformanceMetrics: false,

    // Show development tools (session status, debug panels, etc.)
    showDevelopmentTools: __DEV__, // Set to false to hide dev tools even in debug mode

    // Development tools configuration
    developmentTools: {
      showPerformanceMetrics: false, // Show performance overlay
      showNetworkRequests: false, // Show network request logs
      showNavigationDebug: false, // Show navigation state debug
      enableTestingControls: true, // Enable testing buttons and controls
    },

    // Enable mock data for specific services
    mockServices: {
      complaints: false, // Complaints viewing
      complaintCreation: false, // Complaint creation APIs
      permits: false, // Permits viewing and management
      nafath: false,
      validateContact: false,
      survey: false, // Survey system (use true for mock data) - temporarily enabled for debugging
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
