import ReactNativeBiometrics from 'react-native-biometrics';
import Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for biometric settings
const BIOMETRIC_STORAGE_KEYS = {
    ENABLED: '@sera_biometric_enabled',
    USER_CREDENTIALS: '@sera_biometric_credentials',
    FAILED_ATTEMPTS: '@sera_biometric_failed_attempts',
};

// Maximum failed attempts before forcing login
const MAX_FAILED_ATTEMPTS = 3;

class BiometricService {
    constructor() {
        this.rnBiometrics = new ReactNativeBiometrics();
    }

    /**
     * Check if biometric authentication is available on the device
     * @returns {Promise<{available: boolean, biometryType: string}>}
     */
    async isBiometricAvailable() {
        try {
            const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();
            return {
                available,
                biometryType, // 'TouchID', 'FaceID', 'Biometrics', or null
            };
        } catch (error) {
            console.log('Error checking biometric availability:', error);
            return { available: false, biometryType: null };
        }
    }

    /**
     * Check if biometric authentication is enabled by user
     * @returns {Promise<boolean>}
     */
    async isBiometricEnabled() {
        try {
            const enabled = await AsyncStorage.getItem(BIOMETRIC_STORAGE_KEYS.ENABLED);
            return enabled === 'true';
        } catch (error) {
            console.log('Error checking biometric enabled status:', error);
            return false;
        }
    }

    /**
     * Enable or disable biometric authentication
     * @param {boolean} enabled - Whether to enable biometric auth
     * @param {Object} userCredentials - User credentials to store securely
     * @returns {Promise<boolean>} - Success status
     */
    async setBiometricEnabled(enabled, userCredentials = null) {
        try {
            if (enabled) {
                // Check if biometric is available
                const { available } = await this.isBiometricAvailable();
                if (!available) {
                    throw new Error('Biometric authentication is not available on this device');
                }

                // First, prompt for biometric authentication to verify the user can use it
                const authResult = await this.rnBiometrics.simplePrompt({
                    promptMessage: 'Authenticate to enable biometric login',
                    cancelButtonText: 'Cancel'
                });

                if (!authResult.success) {
                    throw new Error('Biometric authentication failed. Please try again.');
                }

                // Store user credentials securely after successful authentication
                if (userCredentials) {
                    await this.storeCredentialsSecurely(userCredentials);
                }

                // Enable biometric authentication
                await AsyncStorage.setItem(BIOMETRIC_STORAGE_KEYS.ENABLED, 'true');

                // Reset failed attempts
                await this.resetFailedAttempts();
            } else {
                // Disable biometric authentication and clear stored data
                await AsyncStorage.setItem(BIOMETRIC_STORAGE_KEYS.ENABLED, 'false');
                await this.clearStoredCredentials();
                await this.resetFailedAttempts();
            }

            return true;
        } catch (error) {
            console.log('Error setting biometric enabled status:', error);
            throw error;
        }
    }

    /**
     * Store user credentials securely using Keychain
     * @param {Object} credentials - User credentials to store
     * @returns {Promise<boolean>}
     */
    async storeCredentialsSecurely(credentials) {
        try {
            const credentialsString = JSON.stringify(credentials);

            // Use the simpler setInternetCredentials method for better compatibility
            await Keychain.setInternetCredentials(
                'sera_biometric_auth',
                credentials.nationalId || 'sera_user',
                credentialsString
            );

            return true;
        } catch (error) {
            console.log('Error storing credentials securely:', error);

            // Fallback to AsyncStorage if keychain fails
            if (error.message && error.message.includes('setInternetCredentialsForServer')) {
                try {
                    const credentialsString = JSON.stringify(credentials);
                    await AsyncStorage.setItem(BIOMETRIC_STORAGE_KEYS.USER_CREDENTIALS, credentialsString);
                    return true;
                } catch (fallbackError) {
                    console.log('Fallback storage also failed:', fallbackError);
                    throw fallbackError;
                }
            }

            throw error;
        }
    }

    /**
     * Retrieve stored credentials (without biometric prompt - that's handled separately)
     * @returns {Promise<Object|null>} - User credentials or null
     */
    async getStoredCredentials() {
        try {
            const credentials = await Keychain.getInternetCredentials('sera_biometric_auth');

            if (credentials && credentials.password) {
                return JSON.parse(credentials.password);
            }

            return null;
        } catch (error) {
            console.log('Error retrieving stored credentials from Keychain:', error);

            // Fallback to AsyncStorage if keychain fails
            try {
                const storedCredentials = await AsyncStorage.getItem(BIOMETRIC_STORAGE_KEYS.USER_CREDENTIALS);
                if (storedCredentials) {
                    return JSON.parse(storedCredentials);
                }
            } catch (fallbackError) {
                console.log('Fallback retrieval also failed:', fallbackError);
            }

            throw error;
        }
    }

    /**
     * Authenticate user using biometric
     * @param {string} promptMessage - Message to show in biometric prompt
     * @returns {Promise<{success: boolean, credentials?: Object, error?: string}>}
     */
    async authenticateWithBiometric(promptMessage = 'Authenticate to access SERA') {
        try {
            // Check if biometric is enabled
            const isEnabled = await this.isBiometricEnabled();
            if (!isEnabled) {
                return {
                    success: false,
                    error: 'Biometric authentication is not enabled',
                };
            }

            // Check failed attempts
            const failedAttempts = await this.getFailedAttempts();
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                return {
                    success: false,
                    error: 'Too many failed attempts. Please login normally.',
                    requiresLogin: true,
                };
            }

            // First, authenticate with native biometric prompt
            const authResult = await this.rnBiometrics.simplePrompt({
                promptMessage: promptMessage,
                cancelButtonText: 'Cancel'
            });

            if (!authResult.success) {
                // Increment failed attempts
                await this.incrementFailedAttempts();
                return {
                    success: false,
                    error: 'Biometric authentication failed',
                    cancelled: authResult.error === 'UserCancel'
                };
            }

            // If biometric authentication succeeded, get stored credentials
            const credentials = await this.getStoredCredentials();

            if (credentials) {
                // Reset failed attempts on success
                await this.resetFailedAttempts();
                return {
                    success: true,
                    credentials,
                };
            } else {
                return {
                    success: false,
                    error: 'No stored credentials found',
                };
            }
        } catch (error) {
            console.log('Biometric authentication error:', error);

            // Increment failed attempts
            await this.incrementFailedAttempts();

            // Handle specific error types
            if (error.message && error.message.includes('UserCancel')) {
                return {
                    success: false,
                    error: 'Authentication was cancelled by user',
                    cancelled: true,
                };
            } else if (error.message && error.message.includes('UserFallback')) {
                return {
                    success: false,
                    error: 'User chose to use fallback authentication',
                    fallback: true,
                };
            } else if (error.message && error.message.includes('BiometryNotAvailable')) {
                return {
                    success: false,
                    error: 'Biometric authentication is not available',
                };
            } else {
                return {
                    success: false,
                    error: 'Authentication failed',
                };
            }
        }
    }

    /**
     * Clear stored credentials
     * @returns {Promise<boolean>}
     */
    async clearStoredCredentials() {
        try {
            await Keychain.resetInternetCredentials('sera_biometric_auth');

            // Also clear AsyncStorage fallback
            await AsyncStorage.removeItem(BIOMETRIC_STORAGE_KEYS.USER_CREDENTIALS);

            return true;
        } catch (error) {
            console.log('Error clearing stored credentials:', error);

            // Try to clear AsyncStorage even if Keychain fails
            try {
                await AsyncStorage.removeItem(BIOMETRIC_STORAGE_KEYS.USER_CREDENTIALS);
            } catch (fallbackError) {
                console.log('Error clearing AsyncStorage fallback:', fallbackError);
            }

            return false;
        }
    }

    /**
     * Get current failed attempts count
     * @returns {Promise<number>}
     */
    async getFailedAttempts() {
        try {
            const attempts = await AsyncStorage.getItem(BIOMETRIC_STORAGE_KEYS.FAILED_ATTEMPTS);
            return attempts ? parseInt(attempts, 10) : 0;
        } catch (error) {
            console.log('Error getting failed attempts:', error);
            return 0;
        }
    }

    /**
     * Increment failed attempts counter
     * @returns {Promise<number>} - New failed attempts count
     */
    async incrementFailedAttempts() {
        try {
            const currentAttempts = await this.getFailedAttempts();
            const newAttempts = currentAttempts + 1;
            await AsyncStorage.setItem(BIOMETRIC_STORAGE_KEYS.FAILED_ATTEMPTS, newAttempts.toString());
            return newAttempts;
        } catch (error) {
            console.log('Error incrementing failed attempts:', error);
            return 0;
        }
    }

    /**
     * Reset failed attempts counter
     * @returns {Promise<boolean>}
     */
    async resetFailedAttempts() {
        try {
            await AsyncStorage.removeItem(BIOMETRIC_STORAGE_KEYS.FAILED_ATTEMPTS);
            return true;
        } catch (error) {
            console.log('Error resetting failed attempts:', error);
            return false;
        }
    }

    /**
     * Get biometric type name for UI display
     * @returns {Promise<string>}
     */
    async getBiometricTypeName() {
        try {
            const { biometryType } = await this.isBiometricAvailable();

            switch (biometryType) {
                case 'TouchID':
                    return 'Touch ID';
                case 'FaceID':
                    return 'Face ID';
                case 'Biometrics':
                    return 'Fingerprint';
                default:
                    return 'Biometric';
            }
        } catch (error) {
            console.log('Error getting biometric type name:', error);
            return 'Biometric';
        }
    }

    /**
     * Check if user has exceeded maximum failed attempts
     * @returns {Promise<boolean>}
     */
    async hasExceededMaxAttempts() {
        const failedAttempts = await this.getFailedAttempts();
        return failedAttempts >= MAX_FAILED_ATTEMPTS;
    }

    /**
     * Disable biometric authentication after too many failed attempts
     * @returns {Promise<boolean>}
     */
    async disableBiometricAfterFailure() {
        try {
            await this.setBiometricEnabled(false);
            return true;
        } catch (error) {
            console.log('Error disabling biometric after failure:', error);
            return false;
        }
    }
}

// Export singleton instance
export default new BiometricService();

