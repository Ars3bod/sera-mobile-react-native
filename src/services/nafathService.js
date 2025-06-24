import axios from 'axios';
import { getEndpointUrl } from '../config/apiConfig';
import contactService from './contactService';

let wToken = null;

export async function loginNafath(id) {
  try {
    const url = getEndpointUrl('nafath', 'loginNafath');
    const response = await axios.post(url, { id });
    return response.data;
  } catch (error) {
    console.error('Login Nafath error:', error);
    throw error;
  }
}

export async function pollNafathStatus(
  transId,
  random,
  id,
  shouldContinue,
  onSuccess,
  userContext = null,
) {
  console.log('pollNafathStatus called with:', { transId, random, id });
  const start = Date.now();

  while (shouldContinue() && Date.now() - start < 120000) {
    console.log('Polling...');
    try {
      const url = getEndpointUrl('nafath', 'checkStatus');
      const res = await axios.post(url, {
        transId,
        random,
        id,
      });

      const data = res.data;
      console.log('CheckStatus response:', data);

      if (data && data.status === 'COMPLETED') {
        wToken = data.wToken;

        try {
          // Store Nafath authentication data in user context
          if (userContext && userContext.storeNafathAuthData) {
            console.log('Storing Nafath auth data in user context...');
            await userContext.storeNafathAuthData(data);

            // Get formatted data for contact validation
            const contactData = userContext.getValidateContactData();

            if (contactData) {
              console.log('Calling validatecontact endpoint...');

              // Call validatecontact endpoint
              const contactValidationResult =
                await contactService.validateContact(contactData);

              if (contactValidationResult.success) {
                console.log(
                  'Contact validation successful:',
                  contactValidationResult,
                );

                // Update user context with additional contact information if needed
                if (contactValidationResult.userInfo) {
                  await userContext.updateUserProfile({
                    contactInfo: contactValidationResult.userInfo,
                    contactValidatedAt: new Date().toISOString(),
                    // Map MobilePhone to user.phone for easier access
                    phone: contactValidationResult.userInfo.mobilePhone,
                    // Also store contact ID for API calls
                    contactId: contactValidationResult.userInfo.id,
                  });
                }

                // Call success callback with enhanced data
                onSuccess({
                  ...data,
                  contactValidation: contactValidationResult,
                });
              } else {
                console.warn('Contact validation failed, proceeding anyway');
                onSuccess(data);
              }
            } else {
              console.warn('No contact data available for validation');
              onSuccess(data);
            }
          } else {
            console.warn('User context not available, skipping data storage');
            onSuccess(data);
          }
        } catch (integrationError) {
          console.error(
            'Integration error (continuing with basic auth):',
            integrationError,
          );
          // Still call success callback even if integration fails
          onSuccess(data);
        }

        return;
      }

      if (data && (data.status === 'EXPIRED' || data.status === 'REJECTED')) {
        throw new Error('Verification expired or rejected');
      }
    } catch (err) {
      console.log('CheckStatus API error:', err);
      throw err;
    }

    await new Promise(resolve => setTimeout(resolve, 30));
  }

  throw new Error('Verification failed or timed out');
}

export function getWToken() {
  return wToken;
}

export async function getUserInfo(token) {
  try {
    const url = getEndpointUrl('nafath', 'userInfo');
    const response = await axios.post(url, { token });
    return response.data;
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
}
