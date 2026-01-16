import {AUTH_ENDPOINTS} from '../constants/APIEndPoints';
import createApiClient from './Client';
import { writeErrorLog } from '../utility/utils';

export const postAuthLogin = async (headers: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN_EP, null, {
    headers,
  });
  return response.data;
};

export const postOTP = async (headers: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(AUTH_ENDPOINTS.OTP_EP, null, {
    headers,
  });
  return response.data;
};

export const postAuthToken = async (headers: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(AUTH_ENDPOINTS.TOKEN_EP, null, {
    headers,
  });
  return response;
};
export const postData = async (data: any, token?: string): Promise<any> => {
  // ✅ REMOVED DOUBLE TIMEOUT: Let axios handle timeout (5 minutes) and higher level handle app timeout
  // This prevents double timeout issues where API times out before app timeout

  try {
    console.log('🚀 POST REQUEST: Starting data sync...');
    const dataSizeKB = JSON.stringify(data).length / 1024;
    const dataSizeMB = dataSizeKB / 1024;
    console.log(`📊 Data size: ${dataSizeMB.toFixed(2)}MB (${dataSizeKB.toFixed(1)}KB, ${JSON.stringify(data).length} characters)`);
    console.log('📋 Data keys:', Object.keys(data));
    if (token) {
      console.log('🔐 Using authentication token');
    }

    const apiClient = await createApiClient();

    // ✅ Add authentication headers if token is provided
    const config: any = {};
    if (token) {
      config.headers = {
        'Content-Type': 'application/json',
        'authheader': token,
      };
    }

    // ✅ NETWORK DIAGNOSTICS: Log request start
    console.log(`🌐 AXIOS REQUEST START: ${new Date().toISOString()}`);
    const axiosStartTime = Date.now();

    const response = await apiClient.post(AUTH_ENDPOINTS.POSTDATA_EP, data, config);

    const axiosDuration = Date.now() - axiosStartTime;
    console.log(`✅ AXIOS RESPONSE: Data sync completed in ${axiosDuration}ms`);
    console.log(`🌐 AXIOS RESPONSE TIME: ${new Date().toISOString()}`);
    console.log('📈 Response status:', response.status);
    console.log('📄 Response data keys:', Object.keys(response.data || {}));

    // ✅ Return the nested Data object for proper sync processing
    if (response.data && response.data.Data) {
      console.log('🎯 Returning nested Data object for sync processing');
      return response.data.Data;
    } else {
      // Fallback for backward compatibility
      return response.data;
    }

  } catch (error: any) {
    const dataSizeMB = (JSON.stringify(data).length / 1024 / 1024).toFixed(2);
    console.error(`❌ AXIOS ERROR: ${error.message}`);
    console.error(`🔍 Error details: ${error.code || error.name || 'Unknown'}`);
    console.error(`📊 Failed request size: ${dataSizeMB}MB`);
    console.error(`🌐 Network status: ${error.code}, HTTP ${error.response?.status || 'N/A'}`);
    console.error(`🕐 Error time: ${new Date().toISOString()}`);

    // ✅ ENHANCED ERROR CLASSIFICATION
    if (error.code === 'ECONNABORTED') {
      console.error(`⏰ AXIOS TIMEOUT: Request exceeded 5 minute limit`);
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(`🌐 NETWORK ERROR: Cannot reach server`);
    } else if (error.response?.status >= 500) {
      console.error(`🔴 SERVER ERROR: HTTP ${error.response.status}`);
    } else if (error.response?.status === 401) {
      console.error(`🔐 AUTH ERROR: Token expired or invalid`);
    }

    writeErrorLog('postData API call failed', error);
    throw error; // Re-throw to let higher level handle
  }
};

export const getAuthData = async (headers: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.get(AUTH_ENDPOINTS.GETDATA_EP, {
    headers,
  });
  return response.data;
};

export const postDeviceID = async (headers: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(AUTH_ENDPOINTS.UPDATE_DEV_ID_EP, null, {
    headers,
  });
  return response.data;
};

export const getUserAccess = async (data: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.get(AUTH_ENDPOINTS.USERACCESS, {
    params: data,
  });
  return response.data;
};

export const getVersionForUpdate = async (data: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.get(AUTH_ENDPOINTS.CHECK_VERSION, {
    params: data,
  });
  return response.data;
};

export const postErrorReport = async (headers: any, body: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(AUTH_ENDPOINTS.REPORT_ERROR_EP, body, {
    headers,
  });

  return response.data;
};

export const postFullErrorReport = async (headers: any, body: any) => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(
    AUTH_ENDPOINTS.RPORT_FULLERROR_EP,
    body,
    {
      headers,
    },
  );

  return response.data;
};

export const postDocuments = async (body: any) => {
  try {
    console.log('postDocuments', body);
    const apiClient = await createApiClient();
    const response = await apiClient.post(AUTH_ENDPOINTS.POST_DOCUMENT, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response && response.data && response.data.Data) {
      return response.data.Data;
    } else {
      console.error('Unexpected response structure:', response);
      return null;
    }
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
export default {
  postAuthLogin,
  postOTP,
  postAuthToken,
  getAuthData,
  postData,
  postDeviceID,
  getUserAccess,
  getVersionForUpdate,
  postErrorReport,
  postFullErrorReport,
  postDocuments,
};
