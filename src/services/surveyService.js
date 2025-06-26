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
                params: { SurveyCode: surveyCode },
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Get survey response:', response.data);
            }

            if (response.data && response.data.success) {
                return {
                    success: true,
                    surveyData: response.data.surveyData,
                    surveyJson: response.data.surveyJson,
                    message: response.data.message || 'Survey loaded successfully',
                    rawData: response.data,
                };
            } else {
                throw new Error(
                    response.data?.errorMessage || 'Failed to load survey'
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
                params: { InvitationNumber: invitationNumber },
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

            if (AppConfig.development.enableDebugLogs) {
                console.log('Updating survey response with URL:', url);
                console.log('Survey response data:', surveyResponseData);
            }

            const response = await axios.post(url, surveyResponseData, {
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

            if (AppConfig.development.enableDebugLogs) {
                console.log('Updating full survey with URL:', url);
                console.log('Full survey data:', fullSurveyData);
            }

            const response = await axios.post(url, fullSurveyData, {
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
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Get action types response:', response.data);
            }

            if (response.data && response.data.success) {
                return {
                    success: true,
                    actionTypes: response.data.actionTypes || response.data.result,
                    message: 'Action types retrieved successfully',
                    rawData: response.data,
                };
            } else {
                throw new Error(
                    response.data?.errorMessage || 'Failed to get action types'
                );
            }
        } catch (error) {
            if (AppConfig.development.enableDebugLogs) {
                console.error('Get action types error:', error);
            }

            if (error.response) {
                throw new Error(
                    `Action types API error: ${error.response.status} - ${error.response.data?.errorMessage || error.response.statusText}`
                );
            } else if (error.request) {
                throw new Error('Network error: Unable to reach action types service');
            } else {
                throw new Error(`Action types error: ${error.message}`);
            }
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

        return await this.getSurveyByCode(surveyCode);
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

        return await this.getActionTypes();
    }
}

// Export singleton instance
const surveyService = new SurveyService();
export default surveyService; 