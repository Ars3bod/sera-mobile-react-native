import axios from 'axios';
import AppConfig from '../config/appConfig';

/**
 * Data Share service for managing user data sharing requests
 */
class DataShareService {
    constructor() {
        this.baseUrl = 'https://sera.gov.sa/api/sitecore/DataShare';
    }

    /**
     * Parse Microsoft JSON date format to JavaScript Date object
     * @param {string} dateString - Date in format "/Date(1759295069040)/"
     * @returns {Date|null} Parsed date or null if invalid
     */
    parseMSDate(dateString) {
        if (!dateString || typeof dateString !== 'string') {
            return null;
        }

        const match = dateString.match(/\/Date\((\d+)\)\//);
        if (match && match[1]) {
            return new Date(parseInt(match[1], 10));
        }

        return null;
    }

    /**
     * Format date to readable string
     * @param {Date} date - Date object
     * @param {string} langCode - Language code ('ar' or 'en')
     * @returns {string} Formatted date string
     */
    formatDate(date, langCode = 'en') {
        if (!date || !(date instanceof Date) || isNaN(date)) {
            return '';
        }

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        const locale = langCode === 'ar' ? 'ar-SA' : 'en-US';
        return date.toLocaleDateString(locale, options);
    }

    /**
     * Get status label and color based on status code
     * @param {number} status - Status code (0: Pending, 1: Approved, 2: Rejected)
     * @param {string} langCode - Language code ('ar' or 'en')
     * @returns {Object} Status label and color
     */
    getStatusInfo(status, langCode = 'en') {
        const statusMap = {
            0: {
                label: langCode === 'ar' ? 'قيد المراجعة' : 'Under Review',
                color: '#FFA500', // Orange
            },
            1: {
                label: langCode === 'ar' ? 'موافق عليه' : 'Approved',
                color: '#4CAF50', // Green
            },
            2: {
                label: langCode === 'ar' ? 'مرفوض' : 'Rejected',
                color: '#F44336', // Red
            },
        };

        return statusMap[status] || statusMap[0];
    }

    /**
     * Get all data share requests by requester ID
     * @param {Object} params - Request parameters
     * @param {string} params.requesterId - User's legal/national ID
     * @param {string} params.lang - Language code ('ar' or 'en')
     * @returns {Promise<Object>} Data share requests response
     */
    async getDataShareRequests({ requesterId, lang = 'en' }) {
        try {
            const url = `${this.baseUrl}/GetAllDataShareRequestsByRequesterID?requesterID=${encodeURIComponent(requesterId)}`;

            const requestData = {
                Id: requesterId,
                lang: lang,
            };

            if (AppConfig.development.enableDebugLogs) {
                console.log('Fetching data share requests with URL:', url);
                console.log('Request data:', requestData);
            }

            const response = await axios.post(url, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ff0ef6ae-eef6-47fb-88a6-147292210f82',
                },
                timeout: AppConfig.api.requestTimeout,
            });

            if (AppConfig.development.enableDebugLogs) {
                console.log('Data share requests response:', response.data);
            }

            if (response.data && response.data.results) {
                // Parse and format the requests
                const requests = this.parseDataShareRequests(
                    response.data.results,
                    lang
                );

                return {
                    success: true,
                    count: requests.length,
                    requests: requests,
                    rawData: response.data,
                };
            } else {
                throw new Error('Invalid response format from data share API');
            }
        } catch (error) {
            console.error('Error fetching data share requests:', error);

            // Handle timeout specifically
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout - please try again');
            }

            // Handle network errors
            if (error.message === 'Network Error') {
                throw new Error('Network error - please check your connection');
            }

            throw error;
        }
    }

    /**
     * Parse and format data share requests
     * @param {Array} results - Raw results from API
     * @param {string} lang - Language code
     * @returns {Array} Formatted data share requests
     */
    parseDataShareRequests(results, lang = 'en') {
        if (!Array.isArray(results)) {
            return [];
        }

        return results.map((item) => {
            const requestRaisedDate = this.parseMSDate(item.RequestRaisedDateTime);
            const lastUpdatedDate = this.parseMSDate(item.LastUpdatedDateTime);
            const timeStart = this.parseMSDate(item.TimeStart);
            const timeEnd = this.parseMSDate(item.TimeEnd);

            const statusInfo = this.getStatusInfo(item.Status, lang);

            return {
                id: item.ApplicationNo,
                applicationNo: item.ApplicationNo,
                title: item.RequestTitle || (lang === 'ar' ? 'بدون عنوان' : 'Untitled'),
                applicantName: item.ApplicantFullName,
                nationalIdentity: item.NationalIdentity,
                entityName: item.EntityName,
                email: item.Email,
                contactNo: item.ContactNo,

                // Request details
                requiredDataDetails: item.RequiredDataDetails,
                legalJustificationDescription: item.LegalJustificationDescription,

                // Request type and format
                dataFormatType: item.DataFormatType,
                requestNature: item.RequestNature,
                requestPriority: item.RequestPriority,
                reasonForRequest: item.ReasonForRequest,
                visitorType: item.VisitorType,
                participationMechanism: item.ParticipationMechanism,

                // Status
                status: item.Status,
                statusLabel: statusInfo.label,
                statusColor: statusInfo.color,

                // Dates
                requestRaisedDate: requestRaisedDate,
                requestRaisedDateFormatted: this.formatDate(requestRaisedDate, lang),
                lastUpdatedDate: lastUpdatedDate,
                lastUpdatedDateFormatted: this.formatDate(lastUpdatedDate, lang),
                timeStart: timeStart,
                timeStartFormatted: this.formatDate(timeStart, lang),
                timeEnd: timeEnd,
                timeEndFormatted: this.formatDate(timeEnd, lang),

                // Additional info
                reasonForRejection: item.ReasonForRejection,
                informationSharedByAdmin: item.InformationSharedByAdmin,
                downloadsLink: item.DownloadsLink,
                grievanceCount: item.GrievanceCount || 0,

                // File IDs
                affiliationProofFileId: item.AffiliationProofFileId,

                // Flags
                isDataAnalysisPublished: item.IsDataAnalysisPublished,
                isDataProvidedThirdParty: item.IsDataProvidedThirdParty,
                dataSharingAgreementExists: item.DataSharingAgreementExists,
                isContainsPersonalData: item.IsContainsPersonalData,
                legalBasisForDataRequest: item.LegalBasisForDataRequest,

                // Raw data for details screen
                rawData: item,
            };
        });
    }

    /**
     * Get counts of requests by status
     * @param {Array} requests - Array of data share requests
     * @returns {Object} Counts object
     */
    getRequestsCounts(requests) {
        if (!Array.isArray(requests)) {
            return {
                pending: 0,
                approved: 0,
                rejected: 0,
                total: 0,
            };
        }

        const counts = requests.reduce(
            (acc, request) => {
                if (request.status === 0) acc.pending++;
                else if (request.status === 1) acc.approved++;
                else if (request.status === 2) acc.rejected++;
                acc.total++;
                return acc;
            },
            { pending: 0, approved: 0, rejected: 0, total: 0 }
        );

        return counts;
    }
}

// Export singleton instance
const dataShareService = new DataShareService();
export default dataShareService;

