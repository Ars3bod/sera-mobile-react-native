/**
 * Version Service
 * Handles app version checking and force update logic
 */

import axios from 'axios';
import { Platform } from 'react-native';

class VersionService {
    constructor() {
        // API endpoint to check minimum required version
        this.versionCheckURL = 'https://sera.gov.sa/api/app/version-check';

        // Fallback minimum version if API fails
        this.fallbackMinVersion = '1.3.0';

        // Cache duration: 1 hour
        this.cacheDuration = 60 * 60 * 1000;
        this.cachedData = null;
        this.lastCheckTime = null;
    }

    /**
     * Parse version string to comparable number
     * e.g., "1.3.0" -> 1003000 (major * 1000000 + minor * 1000 + patch)
     */
    parseVersion(versionString) {
        if (!versionString) return 0;

        const parts = versionString.split('.').map(num => parseInt(num, 10) || 0);
        const [major = 0, minor = 0, patch = 0] = parts;

        return major * 1000000 + minor * 1000 + patch;
    }

    /**
     * Compare two version strings
     * Returns: -1 if current < required, 0 if equal, 1 if current > required
     */
    compareVersions(currentVersion, requiredVersion) {
        const current = this.parseVersion(currentVersion);
        const required = this.parseVersion(requiredVersion);

        if (current < required) return -1;
        if (current > required) return 1;
        return 0;
    }

    /**
     * Check if current app version meets minimum requirement
     */
    async checkVersion(currentVersion) {
        try {
            // Check cache first
            if (this.cachedData && this.lastCheckTime) {
                const timeSinceLastCheck = Date.now() - this.lastCheckTime;
                if (timeSinceLastCheck < this.cacheDuration) {
                    console.log('Using cached version data');
                    return this.processVersionCheck(currentVersion, this.cachedData);
                }
            }

            // Fetch from API
            console.log('Fetching version requirements from API...');
            const response = await axios.get(this.versionCheckURL, {
                params: {
                    platform: Platform.OS,
                    currentVersion: currentVersion
                },
                timeout: 10000 // 10 second timeout
            });

            if (response.data && response.data.success) {
                this.cachedData = response.data;
                this.lastCheckTime = Date.now();

                return this.processVersionCheck(currentVersion, response.data);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.log('Version check API failed, using fallback:', error.message);

            // Use fallback minimum version
            return this.processVersionCheck(currentVersion, {
                minVersion: this.fallbackMinVersion,
                message: {
                    en: 'Please update to the latest version to continue using the app.',
                    ar: 'يرجى التحديث إلى أحدث إصدار للاستمرار في استخدام التطبيق.'
                },
                updateUrl: {
                    ios: 'https://apps.apple.com/app/sera/id1234567890', // Replace with actual App Store URL
                    android: 'https://play.google.com/store/apps/details?id=sa.gov.sera.mobile' // Replace with actual Play Store URL
                }
            });
        }
    }

    /**
     * Process version check result
     */
    processVersionCheck(currentVersion, data) {
        const minVersion = data.minVersion || this.fallbackMinVersion;
        const comparison = this.compareVersions(currentVersion, minVersion);

        const needsUpdate = comparison < 0;

        return {
            needsUpdate,
            currentVersion,
            minVersion,
            message: data.message || {
                en: 'Please update to the latest version to continue using the app.',
                ar: 'يرجى التحديث إلى أحدث إصدار للاستمرار في استخدام التطبيق.'
            },
            updateUrl: data.updateUrl || {
                ios: 'https://apps.apple.com/app/sera/id1234567890',
                android: 'https://play.google.com/store/apps/details?id=sa.gov.sera.mobile'
            },
            isOptional: data.isOptional || false // If true, allow user to skip
        };
    }

    /**
     * Get current app version from package.json
     */
    getCurrentVersion() {
        // In React Native, you can use react-native-device-info
        // or import from app.json
        // For now, we'll read from app.json
        const appConfig = require('../../app.json');
        return appConfig.version || '1.0.0';
    }

    /**
     * Clear cache (useful for testing)
     */
    clearCache() {
        this.cachedData = null;
        this.lastCheckTime = null;
    }
}

export default new VersionService();

