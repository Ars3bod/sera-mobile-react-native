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

  // Session Management Configuration
  session: {
    // Idle timeout in minutes (15 minutes default for government apps)
    idleTimeoutMinutes: 15,

    // Warning before session expiry in minutes (5 minutes before)
    warningBeforeExpiryMinutes: 5,

    // Maximum session duration in hours (8 hours for government apps)
    maxSessionDurationHours: 8,

    // Auto-refresh token before expiry (in minutes)
    tokenRefreshBeforeExpiryMinutes: 10,

    // Enable session management
    enableSessionManagement: true,

    // Enable idle timeout detection
    enableIdleTimeout: true,

    // Enable session warnings
    enableSessionWarnings: true,

    // Clear app data on logout
    clearDataOnLogout: true,

    // Reset navigation stack on session expiry
    resetNavigationOnExpiry: true,

    // Activities that should reset idle timer
    activitiesResetTimer: [
      'touch',
      'scroll',
      'keypress',
      'navigation',
      'api_call',
    ],

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
      showSessionStatus: false, // Show session status component
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
    },

    // Session debugging (shorter timeouts for testing)
    sessionDebug: {
      enableShortTimeouts: false, // Set to true for testing
      shortIdleTimeoutMinutes: 2, // 2 minutes for testing
      shortWarningMinutes: 1, // 1 minute warning for testing
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
