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

  /**
   * Get detailed information about a specific complaint
   * @param {string} caseNumber - The case number to fetch details for
   * @returns {Promise<Object>} Promise resolving to complaint details response
   */
  async getComplaintDetails(caseNumber) {
    try {
      if (AppConfig.development.enableDebugLogs) {
        console.log('Getting complaint details for case:', caseNumber);
      }

      // Build full API endpoint URL
      const url = getEndpointUrl('case', 'details', this.environment);

      // Prepare request data for POST body
      const requestData = {
        caseNumber: caseNumber
      };

      if (AppConfig.development.enableDebugLogs) {
        console.log('Fetching complaint details with URL:', url);
        console.log('Request data:', requestData);
      }

      // Make API request using POST method
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: AppConfig.api.requestTimeout,
      });

      if (AppConfig.development.enableDebugLogs) {
        console.log('Complaint details API response:', response);
      }

      // Check if response is successful
      if (response.data && response.data.success && response.data.caseObjectResult) {
        // Parse the JSON string in caseObjectResult
        let parsedComplaint;
        try {
          parsedComplaint = JSON.parse(response.data.caseObjectResult);
        } catch (parseError) {
          console.error('Error parsing complaint details JSON:', parseError);
          throw new Error('Invalid response format');
        }

        // Process and normalize the complaint data
        const processedComplaint = {
          CaseId: parsedComplaint.CaseId,
          CaseNumber: parsedComplaint.CaseNumber,
          Account: parsedComplaint.Account, // {Key, Value} - Service provider
          Region: parsedComplaint.Region, // {Key, Value} - Region
          City: parsedComplaint.City, // {Key, Value} - City
          Office: parsedComplaint.Office, // {Key, Value} - Office
          OriginatingCaseNumber: parsedComplaint.OriginatingCaseNumber,
          CaseType: parsedComplaint.CaseType, // {Key, Value} - Complaint type
          Description: parsedComplaint.Description,
          Attachment: parsedComplaint.Attachment || [], // Array of attachments
          CompalintRegistered: parsedComplaint.CompalintRegistered,
          CouncilDescription: parsedComplaint.CouncilDescription, // Service provider response
          Comments: parsedComplaint.Comments || [], // Case comments/updates
          ComplainterType: parsedComplaint.ComplainterType, // {Key, Value} - Customer type
          ProcessingResult: parsedComplaint.ProcessingResult, // {Key, Value} - Final decision
          ProcessingResultText: parsedComplaint.ProcessingResultText, // Detailed decision text
          Reopen: parsedComplaint.Reopen, // {IsReopen, ReopenComment, ReopenReason, FileBase, FileName}
          SurveyCode: parsedComplaint.SurveyCode,
          SurveyResponseId: parsedComplaint.SurveyResponseId,
          Status: parsedComplaint.Status, // {Key, Value} - Current status
          CaseStage: parsedComplaint.CaseStage, // {Key, Value} - Current stage
          ResultReaded: parsedComplaint.ResultReaded,
          CanReopen: parsedComplaint.CanReopen,
          CreationDate: parsedComplaint.CreationDate,
          ClosedDate: parsedComplaint.ClosedDate,
          SubCaseType: parsedComplaint.SubCaseType,
          Logo: parsedComplaint.Logo,
        };

        // Mark result as read if status indicates completion
        if (parsedComplaint.Status?.Key === '266990011' || parsedComplaint.Status?.Key === '266990015') {
          if (!parsedComplaint.ResultReaded) {
            // Call API to mark as read (optional - depends on business requirements)
            try {
              await this.markComplaintResultAsRead(caseNumber);
              processedComplaint.ResultReaded = true;
            } catch (markError) {
              console.warn('Failed to mark complaint result as read:', markError);
              // Don't fail the whole request for this
            }
          }
        }

        return {
          success: true,
          complaint: processedComplaint,
          message: 'Complaint details loaded successfully'
        };
      } else {
        throw new Error(response.data?.errorMessage || 'Failed to fetch complaint details');
      }
    } catch (error) {
      console.error('Error in getComplaintDetails:', error);

      // Check if we should use mock data based on config or error type
      const shouldUseMock = AppConfig.api.useMockData ||
        AppConfig.development.useMockData ||
        (error.code === 'NETWORK_ERROR') ||
        (error.message && error.message.includes('Network Error'));

      if (shouldUseMock) {
        if (AppConfig.development.enableDebugLogs) {
          console.log('Using mock data for complaint details due to:', error.message);
        }

        // Return mock data for development
        const mockComplaint = this.generateMockComplaintDetails(caseNumber);
        return {
          success: true,
          complaint: mockComplaint,
          message: 'Mock complaint details loaded (network unavailable)',
          isMockData: true
        };
      }

      // Handle different types of errors
      let errorMessage = 'Failed to load complaint details';

      if (error.response) {
        // Server responded with error status
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText}`;
      } else if (error.request) {
        // Network error - no response received
        errorMessage = 'Network error: Unable to reach complaint details service. Please check your connection.';
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred';
      }

      return {
        success: false,
        complaint: null,
        message: errorMessage,
        errorType: error.response ? 'server' : error.request ? 'network' : 'unknown'
      };
    }
  }

  /**
   * Mark complaint result as read
   * @param {string} caseNumber - The case number to mark as read
   * @returns {Promise<Object>} Promise resolving to mark read response
   */
  async markComplaintResultAsRead(caseNumber) {
    try {
      const url = getEndpointUrl('case', 'markresultread', this.environment);
      const requestData = {
        caseNumber: caseNumber
      };

      if (AppConfig.development.enableDebugLogs) {
        console.log('Marking complaint result as read with URL:', url);
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
        console.log('Mark result as read response:', response);
      }

      return response;
    } catch (error) {
      console.error('Error marking complaint result as read:', error);
      throw error;
    }
  }

  /**
   * Generate mock complaint details for development
   * @param {string} caseNumber - The case number
   * @returns {Object} Mock complaint details
   */
  generateMockComplaintDetails(caseNumber) {
    const statusOptions = [
      { Key: '1', Value: 'Under Processing' },
      { Key: '266990010', Value: 'Checking Complaint' },
      { Key: '266990011', Value: 'Closed' },
      { Key: '266990005', Value: 'Closed as inquiry' },
    ];

    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    return {
      CaseId: `${caseNumber}-id`,
      CaseNumber: caseNumber,
      Account: {
        Key: "1eff1c6e-6fb0-ed11-bada-00155d00725a",
        Value: "الشركة السعودية للكهرباء"
      },
      Region: {
        Key: "962d623d-0a35-ee11-baea-0205857feb80",
        Value: "شركة مرافق السعودية"
      },
      City: {
        Key: "cc631fd4-926d-ee11-baf4-00155d007258",
        Value: "ينبع الصناعية"
      },
      Office: {
        Key: null,
        Value: null
      },
      OriginatingCaseNumber: null,
      CaseType: {
        Key: "825daad3-57a9-ed11-bada-00155d00725a",
        Value: "جودة الخدمة الكهربائية"
      },
      Description: "Test complaint description for case " + caseNumber,
      Attachment: [
        {
          Id: "attachment-1",
          Name: "sample_document.pdf",
          Type: ".pdf",
          Body: "JVBERi0xLjQKJdPr6eEKMSAwIG9iaiAKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSAxIDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSA4IFRmCjEwMCA3NTAgVGQKKFNhbXBsZSBQREYgRG9jdW1lbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKCjEgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAzODkgMDAwMDAgbiAKMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDA1NyAwMDAwMCBuIAowMDAwMDAwMTE0IDAwMDAwIG4gCjAwMDAwMDAyNDUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0NDkKJSVFT0Y="
        },
        {
          Id: "attachment-2",
          Name: "complaint_receipt.pdf",
          Type: ".pdf",
          Body: "JVBERi0xLjQKJdPr6eEKMSAwIG9iaiAKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSAxIDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo1IDAgb2JqCjw8Ci9MZW5ndGggNTAKPj4Kc3RyZWFtCkJUCi9GMSA4IFRmCjEwMCA3NTAgVGQKKENvbXBsYWludCBSZWNlaXB0IERvY3VtZW50KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgoxIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMzk1IDAwMDAwIG4gCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1NyAwMDAwMCBuIAowMDAwMDAwMTE0IDAwMDAwIG4gCjAwMDAwMDAyNDUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0NTUKJSVFT0Y="
        }
      ],
      CompalintRegistered: false,
      CouncilDescription: "Service provider response for this complaint",
      Comments: [
        {
          text: "Complaint received and under review",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          author: "SERA Team"
        },
        {
          text: "Additional information requested from service provider",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          author: "SERA Team"
        }
      ],
      ComplainterType: {
        Key: "266990002",
        Value: "Industrial"
      },
      ProcessingResult: randomStatus.Key === '266990011' ? {
        Key: "result-key",
        Value: "Complaint resolved in customer favor"
      } : null,
      ProcessingResultText: randomStatus.Key === '266990011' ?
        "The complaint has been thoroughly investigated and resolved. Service provider has been instructed to improve their service quality." : null,
      Reopen: {
        IsReopen: randomStatus.Key === '266990011' ? "True" : "False",
        ReopenComment: null,
        ReopenReason: null,
        FileBase: null,
        FileName: null
      },
      SurveyCode: "SURV-1003",
      SurveyResponseId: "fb5c05e6-e050-f011-baff-aa5fa518ce00",
      Status: randomStatus,
      CaseStage: {
        Key: "266990001",
        Value: "Complaint Check"
      },
      ResultReaded: false,
      CanReopen: randomStatus.Key === '266990011',
      CreationDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      ClosedDate: randomStatus.Key === '266990011' ? new Date().toISOString() : null,
      SubCaseType: null,
      Logo: null,
    };
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
