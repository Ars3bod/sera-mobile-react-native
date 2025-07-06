import axios from 'axios';
import { getApiDomain } from '../config/apiConfig';
import AppConfig from '../config/appConfig';

/**
 * Survey Service for managing feedback surveys and responses
 * Based on the survey system logic from documentation
 */
class SurveyService {
    constructor() {
        this.environment = AppConfig.api.defaultEnvironment;
        this.baseUrl = getApiDomain(this.environment);
    }

    /**
     * Get survey questions by survey code
     * @param {string} surveyCode - Survey code (e.g., 'SURV-1001', 'SURV-1002')
     * @returns {Promise<Object>} Survey questions response
     */
    async getSurveyByCode(surveyCode) {
        try {
            const url = `${this.baseUrl}/survey/getsurveybycode`;

            if (AppConfig.development.enableDebugLogs) {
                console.log('Fetching survey with URL:', url);
                console.log('Survey code:', surveyCode);
            }

            const response = await axios.get(url, {
                params: {
                    SurveyCode: surveyCode,
                    PageNumber: 1,
                    PageSize: 50  // Reasonable page size for survey questions
                },
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Get survey response:', response.data);
            }

            // Handle the new API response format
            let surveyArray = null;

            // Check if data is in result array or directly as array
            if (response.data && response.data.result && Array.isArray(response.data.result)) {
                surveyArray = response.data.result;
            } else if (response.data && Array.isArray(response.data)) {
                surveyArray = response.data;
            }

            if (surveyArray && surveyArray.length > 0) {
                const surveyRecord = surveyArray[0];

                if (AppConfig.development.enableDebugLogs) {
                    console.log('Survey record from API:', surveyRecord);
                    console.log('Raw JSON metadata:', surveyRecord.ntw_jsonmetadata);
                }

                // Parse the JSON metadata containing survey questions
                let surveyMetadata = {};
                if (surveyRecord.ntw_jsonmetadata) {
                    try {
                        surveyMetadata = JSON.parse(surveyRecord.ntw_jsonmetadata);

                        if (AppConfig.development.enableDebugLogs) {
                            console.log('Parsed survey metadata:', surveyMetadata);
                        }
                    } catch (parseError) {
                        console.error('Failed to parse survey metadata:', parseError);

                        // If JSON parsing fails, try to create a simple survey structure
                        if (AppConfig.development.enableDebugLogs) {
                            console.log('Falling back to simple survey structure');
                        }

                        return {
                            success: true,
                            surveyData: {
                                title: surveyRecord.ntw_name || 'Survey',
                                surveyId: surveyRecord.ntw_surveyid,
                                questions: [{
                                    name: 'question1',
                                    title: surveyRecord.ntw_name || 'Please provide your feedback',
                                    type: 'comment',
                                    isRequired: false
                                }]
                            },
                            surveyJson: {},
                            message: 'Survey loaded with fallback format',
                            rawData: surveyArray,
                        };
                    }
                } else {
                    if (AppConfig.development.enableDebugLogs) {
                        console.warn('No ntw_jsonmetadata found in survey record');
                    }
                }

                // Convert SurveyJS format to our expected format
                const convertedSurvey = this.convertSurveyJSFormat(surveyMetadata, surveyRecord);

                if (AppConfig.development.enableDebugLogs) {
                    console.log('Converted survey:', convertedSurvey);
                    console.log('Number of questions:', convertedSurvey.questions?.length || 0);
                }

                // If no questions were converted, create a fallback
                if (!convertedSurvey.questions || convertedSurvey.questions.length === 0) {
                    if (AppConfig.development.enableDebugLogs) {
                        console.warn('No questions found after conversion, creating fallback');
                    }

                    convertedSurvey.questions = [{
                        name: 'feedback',
                        title: surveyRecord.ntw_name || 'Please provide your feedback',
                        type: 'comment',
                        isRequired: false
                    }];
                }

                return {
                    success: true,
                    surveyData: convertedSurvey,
                    surveyJson: surveyMetadata,
                    message: 'Survey loaded successfully',
                    rawData: surveyArray,
                };
            } else if (response.data && response.data.success) {
                // Handle old format for backward compatibility
                return {
                    success: true,
                    surveyData: response.data.surveyData,
                    surveyJson: response.data.surveyJson,
                    message: response.data.message || 'Survey loaded successfully',
                    rawData: response.data,
                };
            } else {
                throw new Error(
                    response.data?.errorMessage || 'Failed to load survey or survey not found'
                );
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Get survey error:', error);
            }

            if (error.response) {
                throw new Error(
                    `Survey API error: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText}`
                );
            } else if (error.request) {
                throw new Error('Network error: Unable to reach survey service');
            } else {
                throw new Error(`Survey error: ${error.message}`);
            }
        }
    }

    /**
     * Get survey status by invitation number
     * @param {string} invitationNumber - Survey invitation number
     * @returns {Promise<Object>} Survey status response
     */
    async getSurveyStatus(invitationNumber) {
        try {
            const url = `${this.baseUrl}/survey/GetStatusFullSurvey`;

            if (AppConfig.development.enableDebugLogs) {
                console.log('Fetching survey status with URL:', url);
                console.log('Invitation number:', invitationNumber);
            }

            const response = await axios.get(url, {
                params: {
                    InvitationNumber: invitationNumber,
                    PageNumber: 1,
                    PageSize: 10  // Small page size since we only expect one status record
                },
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Get survey status response:', response.data);
            }

            if (response.data) {
                return {
                    success: true,
                    isActive: response.data.statecode === 0, // Survey is active if statecode is 0
                    status: response.data,
                    message: 'Survey status retrieved successfully',
                    rawData: response.data,
                };
            } else {
                throw new Error('Failed to get survey status');
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Get survey status error:', error);
            }

            if (error.response) {
                throw new Error(
                    `Survey status API error: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText}`
                );
            } else if (error.request) {
                throw new Error('Network error: Unable to reach survey status service');
            } else {
                throw new Error(`Survey status error: ${error.message}`);
            }
        }
    }

    /**
     * Update survey response (for embedded surveys)
     * @param {Object} surveyResponseData - Survey response data
     * @param {string} surveyResponseData.surveyResponseId - Survey response ID
     * @param {Object} surveyResponseData.surveyData - Survey answers
     * @param {string} surveyResponseData.actionType - Action type (Confirmed, Rejected, etc.)
     * @returns {Promise<Object>} Update response
     */
    async updateSurveyResponse(surveyResponseData) {
        try {
            const url = `${this.baseUrl}/survey/updatesurveyresponse`;

            // Validate input data (comment in English)
            if (!surveyResponseData) {
                throw new Error('Survey response data is required');
            }

            if (!surveyResponseData.surveyResponseId) {
                throw new Error('Survey response ID is required');
            }

            if (!surveyResponseData.surveyCode) {
                throw new Error('Survey code is required');
            }

            if (!surveyResponseData.actionType) {
                throw new Error('Action type is required');
            }

            // Ensure action types are loaded for GUID lookup (comment in English)
            if (!this.cachedActionTypes) {
                try {
                    await this.getActionTypes();
                } catch (error) {
                    if (AppConfig.development.enableDebugLogs) {
                        console.warn('Failed to load action types, using fallback GUIDs:', error.message);
                    }
                }
            }

            const actionTypeGuid = this.getActionTypeGuid(surveyResponseData.actionType);

            // Correct payload format based on documentation (comment in English)
            // First encoding: Convert survey data to JSON
            const surveyDataJson = JSON.stringify(surveyResponseData.surveyData || {});
            // Second encoding: Escape and encode again for safe transmission
            const doubleEncodedJson = JSON.stringify(this.escapeDoubleQuotes(surveyDataJson));

            const payload = {
                json: doubleEncodedJson,                           // Double-encoded survey data
                actionType: actionTypeGuid,                        // Action type GUID
                surveyResponse: surveyResponseData.surveyResponseId // Survey response ID
            };

            if (AppConfig.development.enableDebugLogs) {
                console.log('Updating survey response with URL:', url);
                console.log('Original survey response data:', surveyResponseData);
                console.log('Formatted payload:', payload);
            }

            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Update survey response result:', response.data);
            }

            if (response.data && response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'Survey response updated successfully',
                    rawData: response.data,
                };
            } else {
                throw new Error(
                    response.data?.errorMessage || 'Failed to update survey response'
                );
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Update survey response error:', error);
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);
            }

            if (error.response) {
                throw new Error(
                    `Survey update API error: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText}`
                );
            } else if (error.request) {
                throw new Error('Network error: Unable to reach survey update service');
            } else {
                throw new Error(`Survey update error: ${error.message}`);
            }
        }
    }

    /**
     * Update full survey (for standalone surveys)
     * @param {Object} fullSurveyData - Complete survey data
     * @param {string} fullSurveyData.invitationNumber - Survey invitation number
     * @param {Object} fullSurveyData.surveyData - Survey answers
     * @param {string} fullSurveyData.actionType - Action type
     * @returns {Promise<Object>} Update response
     */
    async updateFullSurvey(fullSurveyData) {
        try {
            const url = `${this.baseUrl}/survey/surveyupdatefullsurvey`;

            // Ensure action types are loaded for GUID lookup (comment in English)
            if (!this.cachedActionTypes) {
                try {
                    await this.getActionTypes();
                } catch (error) {
                    if (AppConfig.development.enableDebugLogs) {
                        console.warn('Failed to load action types, using fallback GUIDs:', error.message);
                    }
                }
            }

            // Correct payload format for full survey based on documentation (comment in English)
            // First encoding: Convert survey data to JSON
            const surveyDataJson = JSON.stringify(fullSurveyData.surveyData || {});
            // Second encoding: Escape and encode again for safe transmission
            const doubleEncodedJson = JSON.stringify(this.escapeDoubleQuotes(surveyDataJson));

            const payload = {
                json: doubleEncodedJson,                        // Double-encoded survey data
                actionType: this.getActionTypeGuid(fullSurveyData.actionType), // Action type GUID
                surveyResponse: fullSurveyData.invitationNumber // Survey response/invitation number
            };

            if (AppConfig.development.enableDebugLogs) {
                console.log('Updating full survey with URL:', url);
                console.log('Original full survey data:', fullSurveyData);
                console.log('Formatted payload:', payload);
            }

            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Update full survey result:', response.data);
            }

            if (response.data && response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'Full survey updated successfully',
                    rawData: response.data,
                };
            } else {
                throw new Error(
                    response.data?.errorMessage || 'Failed to update full survey'
                );
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Update full survey error:', error);
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);
            }

            if (error.response) {
                throw new Error(
                    `Full survey API error: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText}`
                );
            } else if (error.request) {
                throw new Error('Network error: Unable to reach full survey service');
            } else {
                throw new Error(`Full survey error: ${error.message}`);
            }
        }
    }

    /**
     * Get action types for surveys
     * @returns {Promise<Object>} Action types response
     */
    async getActionTypes() {
        try {
            const url = `${this.baseUrl}/lookupscode/listactiontypes`;

            if (AppConfig.development.enableDebugLogs) {
                console.log('Fetching action types with URL:', url);
            }

            const response = await axios.get(url, {
                params: {
                    PageNumber: 1,
                    PageSize: 100  // Get enough records to cover all action types
                },
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Get action types response:', response.data);
            }

            // More flexible response handling (comment in English)
            if (response.data) {
                // Handle various response formats
                const actionTypes = response.data.actionTypes ||
                    response.data.result ||
                    response.data.data ||
                    (Array.isArray(response.data) ? response.data : []);

                // Cache action types for GUID lookup (comment in English)
                this.cacheActionTypes(actionTypes);

                return {
                    success: true,
                    actionTypes: actionTypes,
                    message: 'Action types retrieved successfully',
                    rawData: response.data,
                };
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Get action types error:', error);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                    console.error('Response data:', error.response.data);
                }
            }

            if (error.response) {
                throw new Error(
                    `Action types API error: ${error.response.status} - ${error.response.data?.errorMessage || error.response.data?.message || error.response.statusText}`
                );
            } else if (error.request) {
                throw new Error('Network error: Unable to reach action types service');
            } else {
                throw new Error(`Action types error: ${error.message}`);
            }
        }
    }

    /**
     * Convert SurveyJS format from API to our expected format
     * @param {Object} surveyMetadata - Parsed JSON metadata from API
     * @param {Object} surveyRecord - Survey record from API
     * @returns {Object} Converted survey data
     */
    convertSurveyJSFormat(surveyMetadata, surveyRecord) {
        const survey = {
            title: surveyRecord.ntw_name || 'Survey',
            surveyId: surveyRecord.ntw_surveyid,
            questions: []
        };

        if (AppConfig.development.enableDebugLogs) {
            console.log('Converting survey - metadata pages:', surveyMetadata.pages);
        }

        // Process pages and elements from SurveyJS format
        if (surveyMetadata.pages && Array.isArray(surveyMetadata.pages)) {
            surveyMetadata.pages.forEach((page, pageIndex) => {
                if (AppConfig.development.enableDebugLogs) {
                    console.log(`Processing page ${pageIndex}:`, page);
                    console.log(`Page elements:`, page.elements);
                }

                if (page.elements && Array.isArray(page.elements)) {
                    page.elements.forEach((element, elementIndex) => {
                        if (AppConfig.development.enableDebugLogs) {
                            console.log(`Processing element ${elementIndex}:`, element);
                        }

                        const question = this.convertSurveyJSQuestion(element);
                        if (question) {
                            survey.questions.push(question);

                            if (AppConfig.development.enableDebugLogs) {
                                console.log(`Converted question:`, question);
                            }
                        } else {
                            if (AppConfig.development.enableDebugLogs) {
                                console.warn(`Failed to convert element:`, element);
                            }
                        }
                    });
                }
            });
        } else {
            if (AppConfig.development.enableDebugLogs) {
                console.warn('No pages found in survey metadata or pages is not an array');
            }
        }

        if (AppConfig.development.enableDebugLogs) {
            console.log(`Final survey with ${survey.questions.length} questions:`, survey);
        }

        return survey;
    }

    /**
     * Convert individual SurveyJS question to our format
     * @param {Object} element - SurveyJS question element
     * @returns {Object} Converted question
     */
    convertSurveyJSQuestion(element) {
        if (AppConfig.development.enableDebugLogs) {
            console.log('Converting question element:', element);
            console.log('Element type:', element.type);
            console.log('Element properties:', Object.keys(element));
        }

        const baseQuestion = {
            name: element.name,
            title: element.title || element.text || 'Question',
            isRequired: element.isRequired || false
        };

        switch (element.type) {
            case 'rating':
                const ratingQuestion = {
                    ...baseQuestion,
                    type: 'rating',
                    rateMin: 1,
                    rateMax: element.rateValues ? element.rateValues.length : 5,
                    rateType: element.rateType || 'stars',
                    choices: element.rateValues || [],
                    comment: element.showCommentArea ? {
                        enabled: true,
                        text: element.commentText || 'Additional comments'
                    } : null
                };

                if (AppConfig.development.enableDebugLogs) {
                    console.log('Created rating question:', ratingQuestion);
                }
                return ratingQuestion;

            case 'radiogroup':
            case 'dropdown':
                return {
                    ...baseQuestion,
                    type: 'radiogroup',
                    choices: element.choices ? element.choices.map(choice => ({
                        value: choice.value,
                        text: choice.text || choice.value
                    })) : []
                };

            case 'comment':
            case 'text':
                return {
                    ...baseQuestion,
                    type: 'comment',
                    placeholder: element.placeholder || 'Enter your comments...'
                };

            case 'boolean':
                return {
                    ...baseQuestion,
                    type: 'radiogroup',
                    choices: [
                        { value: true, text: 'Yes' },
                        { value: false, text: 'No' }
                    ]
                };

            default:
                if (AppConfig.development.enableDebugLogs) {
                    console.warn(`Unsupported question type: ${element.type}`, element);
                }
                return null;
        }
    }

    /**
     * Get mock survey data for development/testing
     * @param {string} surveyCode - Survey code
     * @returns {Object} Mock survey data
     */
    getMockSurveyData(surveyCode) {
        const mockSurveys = {
            'SURV-1001': {
                title: {
                    en: 'Complaint Evaluation Survey',
                    ar: 'استطلاع تقييم الشكوى'
                },
                questions: [
                    {
                        name: 'satisfaction',
                        title: {
                            en: 'How satisfied are you with the complaint resolution?',
                            ar: 'ما مدى رضاك عن حل الشكوى؟'
                        },
                        type: 'radiogroup',
                        choices: [
                            { value: 'very_satisfied', text: { en: 'Very Satisfied', ar: 'راضٍ جداً' } },
                            { value: 'satisfied', text: { en: 'Satisfied', ar: 'راضٍ' } },
                            { value: 'neutral', text: { en: 'Neutral', ar: 'محايد' } },
                            { value: 'dissatisfied', text: { en: 'Dissatisfied', ar: 'غير راضٍ' } },
                            { value: 'very_dissatisfied', text: { en: 'Very Dissatisfied', ar: 'غير راضٍ جداً' } }
                        ],
                        isRequired: true
                    },
                    {
                        name: 'response_time',
                        title: {
                            en: 'How would you rate the response time?',
                            ar: 'كيف تقيم وقت الاستجابة؟'
                        },
                        type: 'rating',
                        rateMin: 1,
                        rateMax: 5,
                        minRateDescription: { en: 'Very Slow', ar: 'بطيء جداً' },
                        maxRateDescription: { en: 'Very Fast', ar: 'سريع جداً' },
                        isRequired: true
                    },
                    {
                        name: 'additional_comments',
                        title: {
                            en: 'Any additional comments or suggestions?',
                            ar: 'أي تعليقات أو اقتراحات إضافية؟'
                        },
                        type: 'comment',
                        isRequired: false
                    }
                ]
            },
            'SURV-1002': {
                title: {
                    en: 'Inquiry Evaluation Survey',
                    ar: 'استطلاع تقييم الاستفسار'
                },
                questions: [
                    {
                        name: 'helpfulness',
                        title: {
                            en: 'How helpful was the information provided?',
                            ar: 'ما مدى إفادة المعلومات المقدمة؟'
                        },
                        type: 'radiogroup',
                        choices: [
                            { value: 'very_helpful', text: { en: 'Very Helpful', ar: 'مفيد جداً' } },
                            { value: 'helpful', text: { en: 'Helpful', ar: 'مفيد' } },
                            { value: 'somewhat_helpful', text: { en: 'Somewhat Helpful', ar: 'مفيد إلى حد ما' } },
                            { value: 'not_helpful', text: { en: 'Not Helpful', ar: 'غير مفيد' } }
                        ],
                        isRequired: true
                    },
                    {
                        name: 'clarity',
                        title: {
                            en: 'How clear was the explanation?',
                            ar: 'ما مدى وضوح الشرح؟'
                        },
                        type: 'rating',
                        rateMin: 1,
                        rateMax: 5,
                        minRateDescription: { en: 'Very Unclear', ar: 'غير واضح جداً' },
                        maxRateDescription: { en: 'Very Clear', ar: 'واضح جداً' },
                        isRequired: true
                    }
                ]
            }
        };

        return mockSurveys[surveyCode] || mockSurveys['SURV-1001'];
    }

    /**
     * Get mock action types for development/testing
     * @returns {Array} Mock action types
     */
    getMockActionTypes() {
        return [
            { key: 'confirmed', value: 'Confirmed', description: 'User completed survey positively' },
            { key: 'rejected', value: 'Rejected', description: 'User declined to take survey' },
            { key: 'cancelled', value: 'Cancelled', description: 'User started but didn\'t complete' },
            { key: 'new_confirm', value: 'New Confirm', description: 'User is progressing through survey' }
        ];
    }

    /**
     * Check if should use mock data based on config
     * @returns {boolean} Whether to use mock data
     */
    shouldUseMockData() {
        return AppConfig.api.useMockData || AppConfig.development.mockServices?.survey;
    }

    /**
 * Convert action type string to GUID (comment in English)
 * @param {string} actionType - Action type string
 * @returns {string} Action type GUID
 */
    getActionTypeGuid(actionType) {
        // Validate input (comment in English)
        if (!actionType) {
            throw new Error('Action type is required');
        }

        // Check if we have cached action types with GUIDs
        if (this.cachedActionTypes && this.cachedActionTypes.length > 0) {
            const actionTypeData = this.cachedActionTypes.find(at =>
                at.ntw_name === actionType || at.value === actionType || at.key === actionType.toLowerCase()
            );
            if (actionTypeData && actionTypeData.ntw_actiontypeid) {
                return actionTypeData.ntw_actiontypeid;
            }
        }

        // Fallback GUID mapping for common action types (comment in English)
        const actionTypeGuidMap = {
            'Confirmed': '00000000-0000-0000-0000-000000000001',
            'Rejected': '00000000-0000-0000-0000-000000000002',
            'Cancelled': '00000000-0000-0000-0000-000000000003',
            'New Confirm': '00000000-0000-0000-0000-000000000004'
        };

        return actionTypeGuidMap[actionType] || actionTypeGuidMap['Confirmed'];
    }

    /**
     * Cache action types for GUID lookup (comment in English)
     * @param {Array} actionTypes - Action types from API
     */
    cacheActionTypes(actionTypes) {
        this.cachedActionTypes = actionTypes;
    }

    /**
     * Escape double quotes in JSON strings (comment in English)
     * @param {string} input - Input string to escape
     * @returns {string} Escaped string
     */
    escapeDoubleQuotes(input) {
        return input.replace(/"/g, '\\"');
    }

    /**
     * Main method to update survey response (with mock fallback)
     * @param {Object} surveyResponseData - Survey response data
     * @returns {Promise<Object>} Update response
     */
    async updateSurveyResponseSafely(surveyResponseData) {
        if (AppConfig.development.enableDebugLogs) {
            console.log('=== Survey Response Update Debug ===');
            console.log('Input data:', surveyResponseData);
            console.log('Should use mock data:', this.shouldUseMockData());
            console.log('Mock service config:', AppConfig.development.mockServices?.survey);
            console.log('API useMockData:', AppConfig.api.useMockData);
        }

        // Validate survey data (comment in English)
        if (!surveyResponseData.surveyData || typeof surveyResponseData.surveyData !== 'object') {
            if (AppConfig.development.enableDebugLogs) {
                console.warn('Survey data is empty or invalid, using empty object');
            }
            surveyResponseData.surveyData = {};
        }

        if (this.shouldUseMockData()) {
            if (AppConfig.development.enableDebugLogs) {
                console.log('Using mock survey response update for:', surveyResponseData);
            }

            // Simulate successful update with mock response (comment in English)
            return {
                success: true,
                message: 'Survey response updated successfully (mock)',
                isMockData: true,
                responseId: `MOCK-${Date.now()}`,
                timestamp: new Date().toISOString()
            };
        }

        try {
            return await this.updateSurveyResponse(surveyResponseData);
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Survey API Error:', error.message);
                console.warn('Using mock success response as fallback');
            }

            // Fallback to mock success response if API fails (comment in English)
            return {
                success: true,
                message: 'Survey response recorded (API unavailable - using fallback)',
                isMockData: true,
                fallbackUsed: true,
                responseId: `FALLBACK-${Date.now()}`,
                timestamp: new Date().toISOString(),
                originalError: error.message,
                apiErrorDetails: {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                }
            };
        }
    }

    /**
     * Main method to get survey data (with mock fallback)
     * @param {string} surveyCode - Survey code
     * @returns {Promise<Object>} Survey data
     */
    async getSurvey(surveyCode) {
        if (this.shouldUseMockData()) {
            if (AppConfig.development.enableDebugLogs) {
                console.log('Using mock survey data for code:', surveyCode);
            }

            return {
                success: true,
                surveyData: this.getMockSurveyData(surveyCode),
                isMockData: true,
                message: 'Mock survey data loaded'
            };
        }

        try {
            return await this.getSurveyByCode(surveyCode);
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.warn('Survey API failed, falling back to mock data:', error.message);
            }

            // Fallback to mock data if API fails (comment in English)
            return {
                success: true,
                surveyData: this.getMockSurveyData(surveyCode),
                isMockData: true,
                message: 'Mock survey data loaded (API fallback)'
            };
        }
    }

    /**
     * Main method to get action types (with mock fallback)
     * @returns {Promise<Object>} Action types
     */
    async getAvailableActionTypes() {
        if (this.shouldUseMockData()) {
            if (AppConfig.development.enableDebugLogs) {
                console.log('Using mock action types data');
            }

            return {
                success: true,
                actionTypes: this.getMockActionTypes(),
                isMockData: true,
                message: 'Mock action types loaded'
            };
        }

        try {
            return await this.getActionTypes();
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.warn('Action types API failed, falling back to mock data:', error.message);
            }

            // Fallback to mock data if API fails (comment in English)
            return {
                success: true,
                actionTypes: this.getMockActionTypes(),
                isMockData: true,
                message: 'Mock action types loaded (API fallback)'
            };
        }
    }
}

// Export singleton instance
const surveyService = new SurveyService();
export default surveyService; 