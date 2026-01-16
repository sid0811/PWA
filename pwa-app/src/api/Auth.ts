// import {create} from 'apisauce';
import cacheStorage from '../localstorage/secureStorage';
import {UserPreferenceKeys} from '../constants/asyncStorageKeys';
import axios from 'axios';
import {AUTH_ENDPOINTS} from '../constants/APIEndPoints';

const createAuthApiClient = async () => {
  const AuthBaseURL = AUTH_ENDPOINTS.AUTH_URL;
  const userId = await cacheStorage.getString(UserPreferenceKeys.LOGIN_USER_ID);

  return axios.create({
    baseURL: AuthBaseURL,
    timeout: 500000, // ✅ 5 minute timeout: prevents hanging requests, accommodates large sync operations
    headers: {
      'Content-Type': 'application/json',
      LogUserId: userId ? userId : '', //used for log writting of user on server side
    },
  });
};

export default createAuthApiClient;
