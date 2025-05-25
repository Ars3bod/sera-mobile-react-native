import axios from 'axios';
import {getEndpointUrl} from '../config/apiConfig';
import AppConfig from '../config/appConfig';

/**
 * Complaints service for managing user complaints and cases
 */
class ComplaintsService {
  constructor() {
    this.environment = AppConfig.api.defaultEnvironment;
  }

  /**
   * Get list of complaints/cases for a user
   * @param {Object} params - Request parameters
   * @param {string} params.cid - Contact ID from validatecontact response
   * @param {string} params.statusCode - Status filter (1: open/in-progress, 2: closed, 3: all)
   * @param {string} params.searchKey - Search keyword (optional)
   * @param {string} params.pageNumber - Page number (default: "1")
   * @param {string} params.pageSize - Page size (default: from config)
   * @returns {Promise<Object>} Complaints list response
   */
  async getComplaintsList({
    cid,
    statusCode = '3', // Default to all
    searchKey = '',
    pageNumber = '0',
    pageSize = AppConfig.pagination.defaultPageSize.toString(),
  }) {
    try {
      const url = getEndpointUrl('case', 'list', this.environment);

      const requestData = {
        langCode: '1033', // Hardcoded as specified
        cid: cid,
        searchKey: searchKey,
        statusCode: statusCode,
        desc: 'true', // Empty as specified
        pageNumber: pageNumber,
        pageSize: pageSize,
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
          `Failed to fetch complaints: ${error.response.status} - ${
            error.response.data?.errorMessage || error.response.statusText
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
        status: this.mapStatus(complaint.Status?.Key),
        statusValue: complaint.Status?.Value,
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
   * Map API status to UI status
   * @param {string} apiStatus - Status from API
   * @returns {string} Mapped status
   */
  mapStatus(apiStatus) {
    if (!apiStatus) return 'unknown';

    const statusLower = apiStatus.toLowerCase();
    if (statusLower.includes('verification') || statusLower.includes('check')) {
      return 'open';
    }
    if (statusLower.includes('closed') || statusLower.includes('resolved')) {
      return 'closed';
    }
    if (statusLower.includes('reject')) {
      return 'rejected';
    }
    return 'open'; // Default to open for unknown statuses
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
   * Get status code for API request based on filter
   * @param {string} filter - Filter type ('all', 'open', 'closed', 'rejected')
   * @returns {string} Status code for API
   */
  getStatusCodeForFilter(filter) {
    switch (filter) {
      case 'open':
        return '1'; // Open/In progress
      case 'closed':
        return '2'; // Closed
      case 'rejected':
        return '2'; // Treat rejected as closed for now
      case 'all':
      default:
        return '3'; // All
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
