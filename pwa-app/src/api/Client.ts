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
      // Build the full target URL
      const targetUrl = clientBaseURL + (config.url || '');
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
