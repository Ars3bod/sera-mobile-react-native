import axios from 'axios';
import { getEndpointUrl } from '../config/apiConfig';
import AppConfig from '../config/appConfig';

/**
 * Complaints service for managing user complaints and cases
 */
class ComplaintsService {
  constructor() {
    this.environment = AppConfig.api.defaultEnvironment;
  }

  /**
   * Get list of complaints/cases for a user using casesearch endpoint
   * @param {Object} params - Request parameters
   * @param {string} params.cid - Contact ID (user identifier)
   * @param {string} params.phoneNumber - User's phone number
   * @param {string} params.nin - National ID number
   * @param {string} params.langCode - Language code ('ar' or 'en')
   * @param {string} params.pageNumber - Page number (default: 1)
   * @param {string} params.pageSize - Page size (default: 99)
   * @returns {Promise<Object>} Complaints list response
   */
  async getComplaintsList({
    cid,
    phoneNumber,
    nin,
    langCode = 'en',
    pageNumber = 1,
    pageSize = 99,
  }) {
    try {
      // Update endpoint to use casesearch
      const url = getEndpointUrl('case', 'search', this.environment);

      // Convert language code to numeric format
      const numericLangCode = langCode === 'ar' ? 1025 : 1033;

      const requestData = {
        langCode: numericLangCode,
        pageNumber: pageNumber,
        cid: cid,
        pageSize: pageSize,
        phoneNumber: phoneNumber,
        nin: nin,
      };

      if (AppConfig.development.enableDebugLogs) {
        console.log('Fetching complaints with URL:', url);
        console.log('Request data:', requestData);
      }

      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: AppConfig.api.requestTimeout,
      });

      if (AppConfig.development.enableDebugLogs) {
        console.log('Complaints response:', response.data);
      }

      if (response.data && response.data.success) {
        // Parse the caseObjectResult JSON string
        const complaints = this.parseComplaintsData(
          response.data.caseObjectResult,
        );

        return {
          success: true,
          count: response.data.count || 0,
          complaints: complaints,
          rawData: response.data,
        };
      } else {
        throw new Error(
          response.data?.errorMessage || 'Failed to fetch complaints',
        );
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Complaints fetch error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to fetch complaints: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach complaints service');
      } else {
        throw new Error(`Complaints fetch error: ${error.message}`);
      }
    }
  }

  /**
   * Parse complaints data from API response
   * @param {string} caseObjectResultString - JSON string from API response
   * @returns {Array} Parsed complaints array
   */
  parseComplaintsData(caseObjectResultString) {
    try {
      if (!caseObjectResultString) return [];

      const complaintsArray = JSON.parse(caseObjectResultString);

      return complaintsArray.map(complaint => ({
        id: complaint.CaseId,
        caseNumber: complaint.CaseNumber,
        title: complaint.CaseType?.Value || 'Unknown Type',
        description: complaint.CaseType?.Value || '',
        status: this.mapStatus(complaint.Status?.Value),
        statusValue: complaint.Status?.Key,
        statusCode: complaint.Status?.Value,
        statusCategory: this.getStatusCategory(complaint.Status?.Value),
        stage: complaint.CaseStage?.Value || 'Unknown Stage',
        stageKey: complaint.CaseStage?.Key,
        type: complaint.CaseType?.Value || 'Unknown',
        typeKey: complaint.CaseType?.Key,
        subType: complaint.SubCaseType?.Value || null,
        subTypeKey: complaint.SubCaseType?.Key || null,
        creationDate: this.parseDate(complaint.CreationDate),
        closedDate: this.parseDate(complaint.ClosedDate),
        canReopen: complaint.CanReopen || false,
        logo: complaint.Logo,
        // Additional mapped fields for UI compatibility
        priority: this.mapPriority(complaint.CaseStage?.Key),
        dateSubmitted: this.parseDate(complaint.CreationDate),
      }));
    } catch (error) {
      console.warn('Failed to parse complaints data:', error);
      return [];
    }
  }

  /**
   * Parse date string from API response
   * API returns dates like "5\/25\/2025 10:25:12 AM" with escaped slashes
   * @param {string} dateString - Date string from API
   * @returns {string} Formatted date string or original if parsing fails
   */
  parseDate(dateString) {
    if (!dateString) return null;

    try {
      // Remove escape characters from date string
      const cleanDateString = dateString.replace(/\\/g, '');

      // Parse the date
      const parsedDate = new Date(cleanDateString);

      // Check if date is valid
      if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid date format:', dateString);
        return dateString; // Return original if parsing fails
      }

      // Return ISO string for consistent formatting
      return parsedDate.toISOString();
    } catch (error) {
      console.warn('Error parsing date:', dateString, error);
      return dateString; // Return original if parsing fails
    }
  }

  /**
   * Map API status to UI status using updated mapping
   * @param {string|number} apiStatus - Status code from API
   * @returns {string} Mapped status
   */
  mapStatus(apiStatus) {
    if (!apiStatus) return 'open';

    const statusCode = apiStatus.toString();

    // Simplified status mapping - only open and closed
    switch (statusCode) {
      case '1':
        return 'open';
      case '266990010':
      case '266990011':
        return 'closed';
      default:
        return 'open'; // All other statuses considered open
    }
  }

  /**
   * Get status display text for UI
   * @param {string|number} apiStatus - Status code from API
   * @param {string} language - Language code ('ar' or 'en')
   * @returns {string} Display text for status
   */
  getStatusDisplayText(apiStatus, language = 'en') {
    if (!apiStatus) return language === 'ar' ? 'مفتوحة' : 'Open';

    const statusCode = apiStatus.toString();

    if (language === 'ar') {
      switch (statusCode) {
        case '1':
          return 'مفتوحة';
        case '266990010':
          return 'مغلق كاستفسار';
        case '266990011':
          return 'مغلقة';
        default:
          return 'مفتوحة';
      }
    } else {
      switch (statusCode) {
        case '1':
          return 'Open';
        case '266990010':
          return 'Closed as inquiry';
        case '266990011':
          return 'Closed';
        default:
          return 'Open';
      }
    }
  }

  /**
   * Get status category for filtering
   * @param {string|number} apiStatus - Status code from API
   * @returns {string} Status category
   */
  getStatusCategory(apiStatus) {
    if (!apiStatus) return 'open';

    const statusCode = apiStatus.toString();

    switch (statusCode) {
      case '1':
        return 'open';
      case '266990010':
      case '266990011':
        return 'closed';
      default:
        return 'open'; // All other statuses considered open
    }
  }

  /**
   * Map stage to priority for UI display
   * @param {string} stageKey - Stage key from API
   * @returns {string} Priority level
   */
  mapPriority(stageKey) {
    // This is a placeholder mapping - adjust based on actual stage meanings
    if (!stageKey) return 'medium';

    if (stageKey.includes('urgent') || stageKey.includes('critical')) {
      return 'high';
    }
    if (stageKey.includes('low') || stageKey.includes('minor')) {
      return 'low';
    }
    return 'medium';
  }

  /**
   * Filter complaints by status category
   * @param {Array} complaints - Array of complaints
   * @param {string} filter - Filter type ('all', 'open', 'closed')
   * @returns {Array} Filtered complaints array
   */
  filterComplaintsByStatus(complaints, filter) {
    if (!complaints || !Array.isArray(complaints)) return [];

    if (filter === 'all') {
      return complaints;
    }

    return complaints.filter(complaint => {
      const category = this.getStatusCategory(complaint.statusCode);
      return category === filter;
    });
  }

  /**
   * Get available filter options for complaints
   * @param {string} language - Language code ('ar' or 'en')
   * @returns {Array} Array of filter options
   */
  getFilterOptions(language = 'en') {
    if (language === 'ar') {
      return [
        { key: 'all', label: 'الكل' },
        { key: 'open', label: 'مفتوحة' },
        { key: 'closed', label: 'مغلقة' },
      ];
    } else {
      return [
        { key: 'all', label: 'All' },
        { key: 'open', label: 'Open' },
        { key: 'closed', label: 'Closed' },
      ];
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

  /**
   * Get complaint counts by status category
   * @param {Array} complaints - Array of complaints
   * @returns {Object} Counts object with all, open, and closed counts
   */
  getComplaintCounts(complaints) {
    if (!complaints || !Array.isArray(complaints)) {
      return { all: 0, open: 0, closed: 0 };
    }

    const counts = {
      all: complaints.length,
      open: 0,
      closed: 0
    };

    complaints.forEach(complaint => {
      const statusCode = complaint.statusCode?.toString();

      if (statusCode === '1') {
        counts.open++;
      } else if (statusCode === '266990010' || statusCode === '266990011') {
        counts.closed++;
      } else {
        // All other status codes are considered open
        counts.open++;
      }
    });

    return counts;
  }
}

// Export singleton instance
export default new ComplaintsService();

// Mock data for fallback/testing (kept for presentation purposes)
export const MOCK_COMPLAINTS_DATA = {
  all: [
    {
      id: '1',
      caseNumber: '25010001',
      title: 'Power Outage',
      description: 'Frequent power outages in residential area',
      status: 'open',
      priority: 'high',
      dateSubmitted: '2024-01-15',
      creationDate: '2024-01-15',
      serviceProvider: 'SEC',
      type: 'Technical Issue',
    },
    {
      id: '2',
      caseNumber: '25010002',
      title: 'High Bill',
      description: 'Unexpectedly high electricity bill',
      status: 'closed',
      priority: 'medium',
      dateSubmitted: '2024-01-10',
      creationDate: '2024-01-10',
      serviceProvider: 'SEC',
      type: 'Billing Issue',
    },
    {
      id: '3',
      caseNumber: '25010003',
      title: 'Service Quality',
      description: 'Poor customer service experience',
      status: 'rejected',
      priority: 'low',
      dateSubmitted: '2024-01-05',
      creationDate: '2024-01-05',
      serviceProvider: 'Marafiq',
      type: 'Service Quality',
    },
  ],
};
