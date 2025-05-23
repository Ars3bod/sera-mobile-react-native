import axios from 'axios';
import {PROD_API_DOMAIN} from '../config/apiConfig';

const BASE_URL = `${PROD_API_DOMAIN}/api/Nafath`;
let wToken = null;

export async function loginNafath(id) {
  const response = await axios.post(`${BASE_URL}/LoginNafath`, {id});
  return response.data;
}

export async function pollNafathStatus(
  transId,
  random,
  id,
  shouldContinue,
  onSuccess,
) {
  console.log('pollNafathStatus called with:', {transId, random, id});
  const start = Date.now();
  while (shouldContinue() && Date.now() - start < 120000) {
    console.log('Polling...');
    try {
      const res = await axios.post(`${BASE_URL}/CheckStatus`, {
        transId,
        random,
        id,
      });
      const data = res.data;
      console.log('CheckStatus response:', data);
      if (data && data.status === 'COMPLETED') {
        wToken = data.wToken;
        onSuccess(data);
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
