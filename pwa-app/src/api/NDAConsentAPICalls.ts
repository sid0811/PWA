import createApiClient from './Client';
import {API_ENDPOINTS} from '../constants/APIEndPoints';

/**
 * Post NDA consent data
 * @param UserId - User ID
 * @param Latitude - Current latitude
 * @param Longitude - Current longitude
 * @param DateTimeStamp - Date and time of consent
 * @param AppVersion - App version
 * @param APIVersion - API version
 * @returns Response data
 */
export const postNDAConsentData = async (
  UserId: string,
  Latitude: string | number,
  Longitude: string | number,
  DateTimeStamp: string,
  AppVersion: string,
  APIVersion: string
): Promise<any> => {
  const apiClient = await createApiClient();

  const formData = {
    UserId,
    Latitude,
    Longitude,
    DateTimeStamp,
    AppVersion,
    APIVersion,
  };

  // PWA: Use x-custom- prefixed headers which proxy converts to actual header names
  const customHeaders = {
    'Content-Type': 'application/json',
    'x-custom-UserId': UserId,
    'x-custom-Latitude': String(Latitude),
    'x-custom-Longitude': String(Longitude),
    'x-custom-DateTimeStamp': DateTimeStamp,
    'x-custom-AppVersion': AppVersion,
    'x-custom-APIVersion': APIVersion,
  };

  const response = await apiClient.post<any>(
    API_ENDPOINTS.NDA_CONSENT_POST,
    formData,
    {
      headers: customHeaders,
    }
  );

  return response.data;
};

export default {
  postNDAConsentData,
};
