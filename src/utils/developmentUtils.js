import AppConfig from '../config/appConfig';

/**
 * Development Utilities
 * 
 * Provides utility functions for managing development tools and features.
 * All functions respect the app configuration settings.
 */

/**
 * Check if development tools should be shown
 * @returns {boolean} True if development tools should be displayed
 */
export const shouldShowDevelopmentTools = () => {
    return AppConfig.development.showDevelopmentTools;
};

/**
 * Check if session status component should be shown
 * @returns {boolean} True if session status should be displayed
 */
export const shouldShowSessionStatus = () => {
    return shouldShowDevelopmentTools() && AppConfig.development.developmentTools.showSessionStatus;
};

/**
 * Check if testing controls should be enabled
 * @returns {boolean} True if testing controls should be shown
 */
export const shouldEnableTestingControls = () => {
    return shouldShowDevelopmentTools() && AppConfig.development.developmentTools.enableTestingControls;
};

/**
 * Check if performance metrics should be shown
 * @returns {boolean} True if performance metrics should be displayed
 */
export const shouldShowPerformanceMetrics = () => {
    return shouldShowDevelopmentTools() && AppConfig.development.developmentTools.showPerformanceMetrics;
};

/**
 * Check if network request logs should be shown
 * @returns {boolean} True if network logs should be displayed
 */
export const shouldShowNetworkRequests = () => {
    return shouldShowDevelopmentTools() && AppConfig.development.developmentTools.showNetworkRequests;
};

/**
 * Check if navigation debug info should be shown
 * @returns {boolean} True if navigation debug should be displayed
 */
export const shouldShowNavigationDebug = () => {
    return shouldShowDevelopmentTools() && AppConfig.development.developmentTools.showNavigationDebug;
};

/**
 * Check if debug logging is enabled
 * @returns {boolean} True if debug logs should be shown
 */
export const isDebugLoggingEnabled = () => {
    return AppConfig.development.enableDebugLogs;
};

/**
 * Log a debug message if debug logging is enabled
 * @param {string} message - The message to log
 * @param {any} data - Optional data to include with the log
 */
export const debugLog = (message, data = null) => {
    if (isDebugLoggingEnabled()) {
        if (data) {
            console.log(`[DEBUG] ${message}`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    }
};

/**
 * Log a session-related debug message
 * @param {string} message - The session message to log
 * @param {any} data - Optional session data
 */
export const sessionDebugLog = (message, data = null) => {
    if (isDebugLoggingEnabled()) {
        if (data) {
            console.log(`[SESSION] ${message}`, data);
        } else {
            console.log(`[SESSION] ${message}`);
        }
    }
};

/**
 * Get development configuration for easy access
 * @returns {object} Development configuration object
 */
export const getDevelopmentConfig = () => {
    return AppConfig.development;
};

/**
 * Get session debug configuration
 * @returns {object} Session debug configuration object
 */
export const getSessionDebugConfig = () => {
    return AppConfig.development.sessionDebug;
};

/**
 * Check if short session timeouts are enabled for testing
 * @returns {boolean} True if short timeouts are enabled
 */
export const isShortSessionTimeoutsEnabled = () => {
    return AppConfig.development.sessionDebug.enableShortTimeouts;
};

export default {
    shouldShowDevelopmentTools,
    shouldShowSessionStatus,
    shouldEnableTestingControls,
    shouldShowPerformanceMetrics,
    shouldShowNetworkRequests,
    shouldShowNavigationDebug,
    isDebugLoggingEnabled,
    debugLog,
    sessionDebugLog,
    getDevelopmentConfig,
    getSessionDebugConfig,
    isShortSessionTimeoutsEnabled,
}; 