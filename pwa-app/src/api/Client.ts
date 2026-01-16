// import {create} from 'apisauce';
import cacheStorage from '../localstorage/secureStorage';
import {UserPreferenceKeys} from '../constants/asyncStorageKeys';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Check if we're in production (Vercel) and need to use proxy
const useProxy = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

const createApiClient = async (): Promise<AxiosInstance> => {
  const clientBaseURL = await cacheStorage.getString(
    UserPreferenceKeys.BASE_URL,
  );
  const userId = await cacheStorage.getString(UserPreferenceKeys.LOGIN_USER_ID);

  if (useProxy && clientBaseURL) {
    // Production: Use proxy to avoid CORS
    const client = axios.create({
      baseURL: '/api/proxy', // Vercel serverless function
      timeout: 500000,
      headers: {
        'Content-Type': 'application/json',
        LogUserId: userId ? userId : '',
      },
    });

    // Interceptor to add target URL header and modify request
    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // Build the full target URL with query params
      let targetUrl = clientBaseURL + (config.url || '');

      // If there are params, serialize them and append to target URL
      if (config.params && Object.keys(config.params).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(config.params)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        }
        const queryString = searchParams.toString();
        if (queryString) {
          targetUrl += (targetUrl.includes('?') ? '&' : '?') + queryString;
        }
        // Clear params since they're now in the target URL
        config.params = undefined;
      }

      config.headers['x-target-url'] = targetUrl;
      config.url = ''; // Clear URL since we're using proxy
      return config;
    });

    return client;
  }

  // Development: Direct API calls (or if no baseURL yet)
  return axios.create({
    baseURL: clientBaseURL,
    timeout: 500000,
    headers: {
      'Content-Type': 'application/json',
      LogUserId: userId ? userId : '',
    },
  });
};

export default createApiClient;
