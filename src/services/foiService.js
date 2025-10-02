import axios from 'axios';
import AppConfig from '../config/appConfig';

/**
 * Freedom of Information Service
 * Handles all API interactions for Freedom of Information requests
 */
class FOIService {
    constructor() {
        this.baseURL = 'https://sera.gov.sa/api/sitecore/foi';
        this.bearerToken = 'ff0ef6ae-eef6-47fb-88a6-147292210f82'; // Static Bearer token
    }

    /**
     * Submit a new Freedom of Information request
     * @param {Object} requestData - The FOI request data
     * @returns {Promise<Object>} Response with success status and request number
     */
    async submitFOIRequest(requestData) {
        try {
            if (AppConfig.development.enableDebugLogs) {
                console.log('Submitting FOI request:', requestData);
            }

            const response = await axios.post(
                `${this.baseURL}/SubmitFOIRequest`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.bearerToken}`,
                    },
                    timeout: 30000, // 30 seconds timeout
                }
            );

            if (AppConfig.development.enableDebugLogs) {
                console.log('FOI submission response:', response.data);
            }

            return {
                success: response.data.Success || false,
                requestNo: response.data.FOIData?.RequestNo || null,
                errorMessage: response.data.ErrorMessage || '',
                errorCode: response.data.ErrorCode || 200,
            };
        } catch (error) {
            console.error('Error submitting FOI request:', error);

            return {
                success: false,
                requestNo: null,
                errorMessage: error.response?.data?.ErrorMessage || error.message || 'Failed to submit FOI request',
                errorCode: error.response?.data?.ErrorCode || error.response?.status || 500,
            };
        }
    }

    /**
     * Get all FOI requests by requester ID
     * @param {Object} params - Request parameters
     * @param {string} params.requesterId - Requester national ID
     * @param {string} params.lang - Language code ('ar' or 'en')
     * @returns {Promise<Object>} Response with requests array
     */
    async getFOIRequests({ requesterId, lang }) {
        try {
            if (AppConfig.development.enableDebugLogs) {
                console.log('Fetching FOI requests for:', requesterId);
            }

            const response = await axios.post(
                `${this.baseURL}/MyFoiRequests`,
                {
                    Id: requesterId,
                    lang: lang,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.bearerToken}`,
                    },
                    timeout: 30000,
                }
            );

            if (AppConfig.development.enableDebugLogs) {
                console.log('FOI requests response:', response.data);
            }

            const requests = this.parseFOIRequests(response.data.results || [], lang === 'ar');

            return {
                success: true,
                requests: requests,
            };
        } catch (error) {
            console.error('Error fetching FOI requests:', error);

            return {
                success: false,
                requests: [],
                errorMessage: error.message || 'Failed to fetch FOI requests',
            };
        }
    }

    /**
     * Parse and format FOI requests from API response
     * @param {Array} results - Raw results from API
     * @param {boolean} isRTL - Is right-to-left language
     * @returns {Array} Formatted requests array
     */
    parseFOIRequests(results, isRTL) {
        return results.map((request) => {
            const status = this.mapStatus(request.Status, isRTL ? 'ar' : 'en');

            return {
                id: request.RequestNo,
                requestNo: request.RequestNo,
                title: request.RequestTitle || 'N/A',
                requesterName: request.RequesterFullName || 'N/A',
                requesterPhone: request.RequesterPhone || 'N/A',
                requesterEmail: request.RequesterMail || 'N/A',
                requesterId: request.RequesterId || 'N/A',
                reasonForRequestId: request.ReasonForRequestId,
                reasonForRequest: request.ReasonForRequest || 'N/A',
                otherReasonOfRequest: request.OtherReasonOfRequest || '',
                isDataAnalysisPublished: request.IsDataAnalysisPublished || false,
                isDataProvidedThirdParty: request.IsDataProvidedThirdParty || false,
                isContainsPersonalData: request.IsContainsPersonalData || false,
                requiredDataDetails: request.RequiredDataDetails || 'N/A',
                evaluationId: request.EvaluationId || 0,
                evaluationType: request.EvaluationType || 'N/A',
                requestRaisedDateTime: this.formatDate(request.RequestRaisedDateTime, isRTL),
                requestRaisedDateFormatted: this.formatDate(request.RequestRaisedDateTime, isRTL),
                lastUpdatedDateTime: this.formatDate(request.LastUpdatedDateTime, isRTL),
                lastUpdatedDateFormatted: this.formatDate(request.LastUpdatedDateTime, isRTL),
                status: request.Status,
                statusLabel: status.label,
                statusColor: status.color,
                reasonForRejection: request.ReasonForRejection || null,
                downloadsLink: request.DownloadsLink || null,
                informationSharedByAdmin: request.InformationSharedByAdmin || null,
                grievanceCount: request.GrievanceCount || 0,
                grievanceDetails: request.GrievanceDetails || null,
                lang: request.Lang,
            };
        });
    }

    /**
     * Format Microsoft JSON date string to readable date
     * @param {string} dateString - Date string in format /Date(timestamp)/
     * @param {boolean} isRTL - Is right-to-left language
     * @returns {string} Formatted date string
     */
    formatDate(dateString, isRTL) {
        if (!dateString) return 'N/A';

        try {
            // Parse Microsoft JSON date format /Date(timestamp)/
            const match = dateString.match(/\/Date\((\d+)\)\//);
            if (match) {
                const timestamp = parseInt(match[1], 10);
                const date = new Date(timestamp);

                // Format date based on language
                const options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                };

                return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', options);
            }

            return dateString;
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    }

    /**
     * Map status ID to label and color
     * @param {number} statusId - Status ID from API
     * @param {string} lang - Language code
     * @returns {Object} Status object with label and color
     */
    mapStatus(statusId, lang) {
        const statusMap = {
            0: {
                label: lang === 'ar' ? 'قيد المعالجة' : 'Pending',
                color: '#FFA500', // Orange
            },
            1: {
                label: lang === 'ar' ? 'موافق عليه' : 'Approved',
                color: '#4CAF50', // Green
            },
            2: {
                label: lang === 'ar' ? 'مرفوض' : 'Rejected',
                color: '#F44336', // Red
            },
        };

        return statusMap[statusId] || statusMap[0];
    }

    /**
     * Get counts of requests by status
     * @param {Array} requests - Array of requests
     * @returns {Object} Counts object
     */
    getRequestsCounts(requests) {
        const counts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            total: requests.length,
        };

        requests.forEach((request) => {
            if (request.status === 0) counts.pending++;
            else if (request.status === 1) counts.approved++;
            else if (request.status === 2) counts.rejected++;
        });

        return counts;
    }
}

// Export singleton instance
const foiService = new FOIService();
export default foiService;

