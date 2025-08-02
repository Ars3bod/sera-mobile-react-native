import axios from 'axios';
import { getEndpointUrl } from '../config/apiConfig';
import AppConfig from '../config/appConfig';

/**
 * Comment Service for managing complaint comments
 */
class CommentService {
    constructor() {
        this.environment = AppConfig.api.defaultEnvironment;
    }

    /**
     * Add a comment to a complaint
     * @param {Object} commentData - Comment data
     * @param {string} commentData.caseNumber - Case number
     * @param {string} commentData.commentText - Comment text
     * @param {string} commentData.beneficiary - User's contact ID
     * @param {Array} attachments - Array of file attachments
     * @returns {Promise<Object>} Add comment response
     */
    async addComment(commentData, attachments = []) {
        try {
            // Check if mock data is enabled
            if (AppConfig.development.mockServices.comments) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                return {
                    success: true,
                    message: 'Comment added successfully (mock)',
                    commentId: `comment-${Date.now()}`,
                    rawData: { mock: true },
                };
            }

            const url = getEndpointUrl('case', 'addComment', this.environment);

            // Prepare request data
            const requestData = {
                caseNumber: commentData.caseNumber,
                commentText: commentData.commentText,
                beneficiary: commentData.beneficiary,
                attachmentsObject: attachments && attachments.length > 0 ?
                    this.createAttachmentsXML(attachments) : null,
            };

            if (AppConfig.development.enableDebugLogs) {
                console.log('Adding comment with URL:', url);
                console.log('Request data:', {
                    ...requestData,
                    attachmentsObject: requestData.attachmentsObject ? '[ATTACHMENTS_XML]' : null
                });
            }

            const response = await axios.post(url, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Add comment response:', response.data);
            }

            if (response.data && response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'Comment added successfully',
                    commentId: response.data.commentId,
                    rawData: response.data,
                };
            } else {
                throw new Error(
                    response.data?.errorMessage || 'Failed to add comment',
                );
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Add comment error:', error);
            }

            // Don't fallback silently - let errors propagate to UI for proper user notification

            if (error.response) {
                throw new Error(
                    `Failed to add comment: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
                    }`,
                );
            } else if (error.request) {
                throw new Error('Network error: Unable to reach comment service');
            } else {
                throw new Error(`Add comment error: ${error.message}`);
            }
        }
    }

    /**
     * Get comments for a specific complaint
     * @param {string} caseNumber - Case number
     * @returns {Promise<Object>} Comments response
     */
    async getComments(caseNumber) {
        try {
            // Check if mock data is enabled
            if (AppConfig.development.mockServices.comments) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockComments = this.generateMockComments(caseNumber);
                return {
                    success: true,
                    comments: mockComments,
                    rawData: { mock: true },
                };
            }

            const url = getEndpointUrl('case', 'getComments', this.environment);

            const requestData = {
                caseNumber: caseNumber,
            };

            if (AppConfig.development.enableDebugLogs) {
                console.log('Getting comments with URL:', url);
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
                console.log('Get comments response:', response.data);
            }

            if (response.data && response.data.success) {
                return {
                    success: true,
                    comments: response.data.comments || [],
                    rawData: response.data,
                };
            } else {
                throw new Error(
                    response.data?.errorMessage || 'Failed to get comments',
                );
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Get comments error:', error);
            }

            // Don't fallback silently - let errors propagate to UI for proper user notification

            if (error.response) {
                throw new Error(
                    `Failed to get comments: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText
                    }`,
                );
            } else if (error.request) {
                throw new Error('Network error: Unable to reach comment service');
            } else {
                throw new Error(`Get comments error: ${error.message}`);
            }
        }
    }

    /**
     * Upload attachment for comment
     * @param {Object} attachmentData - Attachment data
     * @param {string} attachmentData.fileName - File name with extension
     * @param {string} attachmentData.titleInArabic - File title in Arabic
     * @param {string} attachmentData.titleInEnglish - File title in English
     * @param {string} attachmentData.beneficiary - User's contact ID
     * @param {string} attachmentData.recordId - Case ID
     * @param {string} attachmentData.base64Data - Base64 encoded file content
     * @returns {Promise<Object>} Upload response
     */
    async uploadCommentAttachment(attachmentData) {
        try {
            // Check if mock data is enabled
            if (AppConfig.development.mockServices.comments) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                return {
                    success: true,
                    message: 'File uploaded successfully (mock)',
                    rawData: { mock: true },
                };
            }

            // Note: Using a direct URL construction since this might be a different base path
            const baseUrl = getEndpointUrl('case', 'getComments', this.environment).replace('/case/getcomments', '');
            const url = `${baseUrl}/attachment/uploadattachment`;

            // Sanitize file name (replace spaces with underscores)
            const sanitizedFileName = attachmentData.fileName.replace(/\s+/g, '_');

            const requestData = {
                fileNameWithExtention: sanitizedFileName,
                titleInArabic: attachmentData.titleInArabic,
                titleInEnglish: attachmentData.titleInEnglish,
                entitylogicalname: 'ntw_case', // For complaints
                beneficiary: attachmentData.beneficiary,
                attachmentId: 'ntw_comments_attachments', // For comment attachments
                stepNumber: '1', // Step 1 for comments
                recordId: attachmentData.recordId,
                base64Data: attachmentData.base64Data.replace(/^data:[^;]+;base64,/, ''), // Remove data URL prefix
                token: 'yI0vI0f4ba78wewqeWER$!!77', // Hardcoded token
            };

            if (AppConfig.development.enableDebugLogs) {
                console.log('Uploading comment attachment with URL:', url);
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
                console.log('Upload comment attachment response:', response.data);
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
                console.error('Upload comment attachment error:', error);
            }

            // Don't fallback silently - let errors propagate to UI for proper user notification

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
     * Create attachments XML format for comment
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

    /**
     * Generate mock comments for development
     * @param {string} caseNumber - Case number
     * @returns {Array} Mock comments
     */
    generateMockComments(caseNumber) {
        return [
            // {
            //     id: 'comment-1',
            //     text: 'Thank you for your complaint. We have received it and will investigate the matter.',
            //     author: 'SERA Team',
            //     date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            //     attachments: [],
            //     isFromUser: false,
            // },
            // {
            //     id: 'comment-2',
            //     text: 'We have contacted the service provider and requested additional information.',
            //     author: 'SERA Team',
            //     date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            //     attachments: [],
            //     isFromUser: false,
            // },
            // {
            //     id: 'comment-3',
            //     text: 'I would like to provide additional details about the power outage duration.',
            //     author: 'Customer',
            //     date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            //     attachments: [
            //         {
            //             name: 'additional_evidence.pdf',
            //             type: '.pdf',
            //             size: '1.2 MB',
            //         }
            //     ],
            //     isFromUser: true,
            // },
        ];
    }

    /**
     * Test method to check if comment service is properly configured
     * @returns {boolean} True if service is configured correctly
     */
    testServiceConfiguration() {
        try {
            // Test URL construction
            const getCommentsUrl = getEndpointUrl('case', 'getComments', this.environment);
            const addCommentUrl = getEndpointUrl('case', 'addComment', this.environment);

            if (AppConfig.development.enableDebugLogs) {
                console.log('Comment service URLs:');
                console.log('Get comments:', getCommentsUrl);
                console.log('Add comment:', addCommentUrl);
                console.log('Mock data enabled:', AppConfig.development.mockServices.comments);
            }

            return true;
        } catch (error) {
            console.error('Comment service configuration error:', error);
            return false;
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

export default new CommentService(); 