import axios from 'axios';
import { getEndpointUrl } from '../config/apiConfig';

/**
 * Contact validation service for user verification
 */
class ContactService {
  constructor() {
    this.environment = 'flux'; // Default to flux environment for contact validation
  }

  /**
   * Validate contact information with SERA backend
   * @param {Object} contactData - User contact data from Nafath authentication
   * @returns {Promise<Object>} Validation response
   */
  async validateContact(contactData) {
    try {
      const url = getEndpointUrl(
        'contact',
        'validateContact',
        this.environment,
      );

      console.log('Validating contact with URL:', url);
      console.log('Contact data being sent:', contactData);

      const response = await axios.post(url, contactData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });

      console.log('Contact validation response:', response.data);

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          data: response.data,
          userInfo: this.parseUserInfo(response.data.message),
        };
      } else {
        throw new Error(
          response.data?.errorMessage || 'Contact validation failed',
        );
      }
    } catch (error) {
      console.error('Contact validation error:', error);

      if (error.response) {
        // Server responded with error status
        throw new Error(
          `Contact validation failed: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new Error(
          'Network error: Unable to reach contact validation service',
        );
      } else {
        // Something else happened
        throw new Error(`Contact validation error: ${error.message}`);
      }
    }
  }

  /**
   * Parse user information from the validation response message
   * @param {string} messageString - JSON string from response message
   * @returns {Object|null} Parsed user information with mobilePhone from MobilePhone field
   */
  parseUserInfo(messageString) {
    try {
      if (!messageString) return null;

      const userInfo = JSON.parse(messageString);

      return {
        id: userInfo.Id,
        birthDate: userInfo.BirthDate,
        birthDateH: userInfo.BirthDateH,
        contactType: userInfo.ContactType,
        email: userInfo.Email,
        firstName: userInfo.FName,
        firstNameAr: userInfo.FNameT,
        lastName: userInfo.LName,
        lastNameAr: userInfo.LNameT,
        middleName: userInfo.MName,
        middleNameAr: userInfo.MNameT,
        mobilePhone: userInfo.MobilePhone, // Mapped from API's MobilePhone field
        nationalId: userInfo.NIN,
        nationality: userInfo.Nationality,
        idType: userInfo.IdType,
        image: userInfo.Image,
      };
    } catch (error) {
      console.warn('Failed to parse user info from message:', error);
      return null;
    }
  }

  /**
   * Set the environment for API calls
   * @param {'prod'|'flux'|'staging'} env - Environment to use
   */
  setEnvironment(env) {
    this.environment = env;
  }

  /**
   * Get current environment
   * @returns {string} Current environment
   */
  getEnvironment() {
    return this.environment;
  }
}

// Export singleton instance
export default new ContactService();
