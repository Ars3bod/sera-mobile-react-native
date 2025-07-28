export const PROD_API_DOMAIN = 'https://eservicesapi.sera.gov.sa';
export const FLUX_API_DOMAIN = 'https://eservicesapiflux.sera.gov.sa';

// Environment-based API selection
export const getApiDomain = (environment = 'prod') => {
  switch (environment) {
    case 'flux':
    case 'staging':
      return FLUX_API_DOMAIN;
    case 'prod':
    case 'production':
    default:
      return PROD_API_DOMAIN;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Nafath Authentication
  nafath: {
    base: '/api/Nafath',
    loginNafath: '/LoginNafath',
    checkStatus: '/CheckStatus',
    userInfo: '/UserInfo',
  },
  // Contact Validation
  contact: {
    base: '/contact',
    validateContact: '/validatecontact',
  },
  // Cases/Complaints
  case: {
    base: '/case',
    list: '/list',
    search: '/casesearch',
    create: '/create',
    details: '/details',
    addComment: '/addcomment',
    getComments: '/getcomments',
    markResultRead: '/markresultread',
  },
  // Survey/Feedback
  survey: {
    base: '/survey',
    getSurveyByCode: '/getsurveybycode',
    getSurveyStatus: '/GetStatusFullSurvey',
    updateSurveyResponse: '/updatesurveyresponse',
    updateFullSurvey: '/surveyupdatefullsurvey',
  },
  // Lookup Codes
  lookupscode: {
    base: '/lookupscode',
    listActionTypes: '/listactiontypes',
  },
  // Other endpoints can be added here
};

// Get full endpoint URL
export const getEndpointUrl = (category, endpoint, environment = 'prod') => {
  const domain = getApiDomain(environment);

  // Handle direct domain requests (for custom paths)
  if (!category || !endpoint) {
    return domain;
  }

  const baseEndpoint = API_ENDPOINTS[category];

  if (!baseEndpoint) {
    throw new Error(`Unknown API category: ${category}`);
  }

  const specificEndpoint = baseEndpoint[endpoint];
  if (!specificEndpoint) {
    throw new Error(`Unknown endpoint: ${endpoint} in category: ${category}`);
  }

  return `${domain}${baseEndpoint.base}${specificEndpoint}`;
};
