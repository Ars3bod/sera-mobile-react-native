import axios from 'axios';
import { getEndpointUrl } from '../config/apiConfig';
import AppConfig from '../config/appConfig';

/**
 * Complaint Creation Service for managing complaint submission
 */
class ComplaintCreationService {
  constructor() {
    this.environment = AppConfig.api.defaultEnvironment;
  }

  /**
   * Get list of service providers
   * @returns {Promise<Object>} Service providers response
   */
  async getServiceProviders() {
    try {
      const url = `${getEndpointUrl(
        'base',
        '',
        this.environment,
      )}/against/list?PageSize=10&PageNumber=1`;

      if (AppConfig.development.enableDebugLogs) {
        console.log('Fetching service providers from URL:', url);
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: AppConfig.api.requestTimeout,
      });

      if (AppConfig.development.enableDebugLogs) {
        console.log('Service providers response:', response.data);
      }

      if (response.data && response.data.success) {
        return {
          success: true,
          providers: response.data.result || [],
          rawData: response.data,
        };
      } else {
        throw new Error(
          response.data?.errorMessage || 'Failed to fetch service providers',
        );
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Service providers fetch error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to fetch service providers: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach service providers API');
      } else {
        throw new Error(`Service providers fetch error: ${error.message}`);
      }
    }
  }

  /**
   * Get consumption categories
   * @param {string} language - Language code ('ar' or 'en')
   * @returns {Promise<Object>} Consumption categories response
   */
  async getConsumptionCategories(language = 'ar') {
    try {
      const lcid = language === 'ar' ? '1025' : '1033';
      const url = `${getEndpointUrl(
        'base',
        '',
        this.environment,
      )}/optionsets/nw_complainertype?lcid=${lcid}`;

      if (AppConfig.development.enableDebugLogs) {
        console.log('Fetching consumption categories from URL:', url);
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: AppConfig.api.requestTimeout,
      });

      if (AppConfig.development.enableDebugLogs) {
        console.log('Consumption categories response:', response.data);
      }

      if (response.data && response.data.success) {
        return {
          success: true,
          categories: response.data.result || [],
          rawData: response.data,
        };
      } else {
        throw new Error(
          response.data?.errorMessage ||
          'Failed to fetch consumption categories',
        );
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Consumption categories fetch error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to fetch consumption categories: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error(
          'Network error: Unable to reach consumption categories API',
        );
      } else {
        throw new Error(`Consumption categories fetch error: ${error.message}`);
      }
    }
  }

  /**
   * Get complaint types
   * @returns {Promise<Object>} Complaint types response
   */
  async getComplaintTypes() {
    try {
      const url = `${getEndpointUrl(
        'base',
        '',
        this.environment,
      )}/casetype/list?PageSize=100&PageNumber=1`;

      if (AppConfig.development.enableDebugLogs) {
        console.log('Fetching complaint types from URL:', url);
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: AppConfig.api.requestTimeout,
      });

      if (AppConfig.development.enableDebugLogs) {
        console.log('Complaint types response:', response.data);
      }

      if (response.data && response.data.success) {
        return {
          success: true,
          types: response.data.result || [],
          rawData: response.data,
        };
      } else {
        throw new Error(
          response.data?.errorMessage || 'Failed to fetch complaint types',
        );
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Complaint types fetch error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to fetch complaint types: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach complaint types API');
      } else {
        throw new Error(`Complaint types fetch error: ${error.message}`);
      }
    }
  }

  /**
   * Check which fields to show/hide based on complaint type
   * @param {string} caseTypeId - Selected case type ID
   * @returns {Promise<Object>} Field visibility response
   */
  async checkFieldVisibility(caseTypeId) {
    try {
      const url = `${getEndpointUrl(
        'base',
        '',
        this.environment,
      )}/case/showhideaccountorordernumber`;

      const requestData = {
        caseTypeToCheck: caseTypeId,
      };

      if (AppConfig.development.enableDebugLogs) {
        console.log('Checking field visibility with URL:', url);
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
        console.log('Field visibility response:', response.data);
      }

      if (response.data && response.data.success) {
        return {
          success: true,
          showAccountNumber: response.data.showAccountNumber || false,
          showOrderNumber: response.data.showOrderNumber || false,
          rawData: response.data,
        };
      } else {
        throw new Error(
          response.data?.errorMessage || 'Failed to check field visibility',
        );
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Field visibility check error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to check field visibility: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach field visibility API');
      } else {
        throw new Error(`Field visibility check error: ${error.message}`);
      }
    }
  }

  /**
   * Create attachments XML format for complaint
   * @param {Array} attachments - Array of attachment objects
   * @returns {string} XML formatted attachments
   */
  createAttachmentsXML(attachments) {
    if (!attachments || attachments.length === 0) {
      return null;
    }

    const attachmentDataElements = attachments.map(attachment => {
      return `    <AttachmentData>
      <Name>${attachment.name}</Name>
      <Type>${attachment.type || 'application/octet-stream'}</Type>
      <Body>${attachment.base64Data}</Body>
    </AttachmentData>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="utf-16"?>
<ArrayOfAttachmentData xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
${attachmentDataElements}
</ArrayOfAttachmentData>`;
  }

  /**
   * Create a new complaint
   * @param {Object} complaintData - Complaint data
   * @param {Array} attachments - Array of file attachments
   * @returns {Promise<Object>} Create complaint response
   */
  async createComplaint(complaintData, attachments = []) {
    try {
      const url = `${getEndpointUrl(
        'base',
        '',
        this.environment,
      )}/case/createcase`;

      // Add attachments to complaint data if provided
      const finalComplaintData = { ...complaintData };
      if (attachments && attachments.length > 0) {
        finalComplaintData.attachmentsObject = this.createAttachmentsXML(attachments);
      }

      if (AppConfig.development.enableDebugLogs) {
        console.log('Creating complaint with URL:', url);
        console.log('Request data:', { ...finalComplaintData, attachmentsObject: finalComplaintData.attachmentsObject ? '[ATTACHMENTS_XML]' : null });
      }

      const response = await axios.post(url, finalComplaintData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: AppConfig.api.requestTimeout,
      });

      if (AppConfig.development.enableDebugLogs) {
        console.log('Create complaint response:', response.data);
      }

      if (response.data && response.data.success) {
        return {
          success: true,
          caseId: response.data.caseId,
          message: response.data.message || 'Complaint created successfully',
          surveyResponseId: response.data.surveyResponseId,
          rawData: response.data,
        };
      } else {
        throw new Error(
          response.data?.errorMessage || 'Failed to create complaint',
        );
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Create complaint error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to create complaint: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach create complaint API');
      } else {
        throw new Error(`Create complaint error: ${error.message}`);
      }
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
   * Upload attachment file
   * @param {Object} attachmentData - Attachment data
   * @param {string} attachmentData.fileName - File name with extension
   * @param {string} attachmentData.titleInArabic - File title in Arabic
   * @param {string} attachmentData.titleInEnglish - File title in English
   * @param {string} attachmentData.beneficiary - User's contact ID
   * @param {string} attachmentData.base64Data - Base64 encoded file content
   * @returns {Promise<Object>} Upload response
   */
  async uploadAttachment(attachmentData) {
    try {
      const url = `${getEndpointUrl(
        'base',
        '',
        this.environment,
      )}/attachment/uploadattachment`;

      // Sanitize file name (replace spaces with underscores)
      const sanitizedFileName = attachmentData.fileName.replace(/\s+/g, '_');

      const requestData = {
        fileNameWithExtention: sanitizedFileName,
        titleInArabic: attachmentData.titleInArabic,
        titleInEnglish: attachmentData.titleInEnglish,
        entitylogicalname: 'ntw_case', // For complaints
        beneficiary: attachmentData.beneficiary,
        attachmentId: 'ntw_attachments', // Default attachment field
        stepNumber: '0', // General step for complaints
        recordId: attachmentData.recordId || '', // Will be set after case creation
        base64Data: attachmentData.base64Data.replace(/^data:[^;]+;base64,/, ''), // Remove data URL prefix
        token: 'yI0vI0f4ba78wewqeWER$!!77', // Hardcoded token
      };

      if (AppConfig.development.enableDebugLogs) {
        console.log('Uploading attachment with URL:', url);
        console.log('Request data:', { ...requestData, base64Data: '[BASE64_DATA]' });
      }

      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: AppConfig.api.requestTimeout * 3, // Extended timeout for file uploads
      });

      if (AppConfig.development.enableDebugLogs) {
        console.log('Upload attachment response:', response.data);
      }

      if (response.data && response.data.isSuccess) {
        return {
          success: true,
          message: 'File uploaded successfully',
          rawData: response.data,
        };
      } else {
        throw new Error(
          response.data?.errorMessage || 'Failed to upload attachment',
        );
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Upload attachment error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to upload attachment: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach upload attachment API');
      } else {
        throw new Error(`Upload attachment error: ${error.message}`);
      }
    }
  }

  /**
   * Get attachments by record ID
   * @param {string} recordId - Record ID (case ID)
   * @param {number} step - Step number (0 for general)
   * @returns {Promise<Object>} Attachments response
   */
  async getAttachmentsByRecordId(recordId, step = 0) {
    try {
      const url = `${getEndpointUrl(
        'base',
        '',
        this.environment,
      )}/file/getattachmentsbyrecordid`;

      const requestData = {
        RecordId: recordId,
        Step: step,
      };

      if (AppConfig.development.enableDebugLogs) {
        console.log('Getting attachments with URL:', url);
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
        console.log('Get attachments response:', response.data);
      }

      if (response.data && response.data.result) {
        return {
          success: true,
          attachments: response.data.result || [],
          rawData: response.data,
        };
      } else {
        throw new Error('Failed to get attachments');
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Get attachments error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to get attachments: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach get attachments API');
      } else {
        throw new Error(`Get attachments error: ${error.message}`);
      }
    }
  }

  /**
   * Delete attachment
   * @param {string} filePath - File path to delete
   * @returns {Promise<Object>} Delete response
   */
  async deleteAttachment(filePath) {
    try {
      const url = `${getEndpointUrl(
        'base',
        '',
        this.environment,
      )}/attachment/deleteattachment`;

      const requestData = {
        restApiUrl: 'https://eservicesapi.sera.gov.sa/api/Attachments/RemoveAttachment',
        token: 'yI0vI0f4ba78wewqeWER$!!77',
        filePath: filePath,
      };

      if (AppConfig.development.enableDebugLogs) {
        console.log('Deleting attachment with URL:', url);
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
        console.log('Delete attachment response:', response.data);
      }

      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'File deleted successfully',
          rawData: response.data,
        };
      } else {
        throw new Error('Failed to delete attachment');
      }
    } catch (error) {
      if (AppConfig.development.enableDebugLogs) {
        console.error('Delete attachment error:', error);
      }

      if (error.response) {
        throw new Error(
          `Failed to delete attachment: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
          }`,
        );
      } else if (error.request) {
        throw new Error('Network error: Unable to reach delete attachment API');
      } else {
        throw new Error(`Delete attachment error: ${error.message}`);
      }
    }
  }

  /**
   * Validate file for upload
   * @param {Object} file - File object
   * @returns {Object} Validation result
   */
  validateFile(file) {
    const validExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'zip', 'xls', 'xlsx', 'svg'];
    const maxSizeBytes = 20 * 1024 * 1024; // 20MB

    if (!file || !file.name) {
      return { isValid: false, error: 'File is required' };
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !validExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${validExtensions.join(', ')}`
      };
    }

    // Check file size
    if (file.size && file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size too large. Maximum size is 20MB`
      };
    }

    return { isValid: true };
  }
}

// Export singleton instance
export default new ComplaintCreationService();

// Mock data for fallback/testing
export const MOCK_SERVICE_PROVIDERS = [
  // {
  //   accountName: 'الشركة السعودية للكهرباء',
  //   englishName: 'SEC',
  //   accountid: '1eff1c6e-6fb0-ed11-bada-00155d00725a',
  //   ntw_code: '01',
  // },
  // {
  //   accountName: 'شركة مرافق',
  //   englishName: 'MARAFEK',
  //   accountid: '8bfbba8e-6fb0-ed11-bada-00155d00725a',
  //   ntw_code: '02',
  // },
];

export const MOCK_CONSUMPTION_CATEGORIES = {
  // ar: [
  //   { name: 'سكني', value: 266990001 },
  //   { name: 'تجاري', value: 266990000 },
  //   { name: 'صناعي', value: 266990002 },
  //   { name: 'حكومي', value: 266990003 },
  // ],
  // en: [
  //   { name: 'Residential', value: 266990001 },
  //   { name: 'Commercial', value: 266990000 },
  //   { name: 'Industrial', value: 266990002 },
  //   { name: 'Government', value: 266990003 },
  // ],
};

export const MOCK_COMPLAINT_TYPES = [
  // {
  //   caseType: 'انقطاع الخدمة الكهربائية',
  //   caseTypeId: 'bb5c2eb9-57a9-ed11-bada-00155d00725a',
  //   ntw_codenum: null,
  // },
  // {
  //   caseType: 'الفواتير',
  //   caseTypeId: '6e4ceb2d-57a9-ed11-bada-00155d00725a',
  //   ntw_codenum: null,
  // },
  // {
  //   caseType: 'جودة الخدمة الكهربائية',
  //   caseTypeId: '825daad3-57a9-ed11-bada-00155d00725a',
  //   ntw_codenum: null,
  // },
];
