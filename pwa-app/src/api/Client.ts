// import {create} from 'apisauce';
import cacheStorage from '../localstorage/secureStorage';
import {UserPreferenceKeys} from '../constants/asyncStorageKeys';
import axios from 'axios';

const createApiClient = async () => {
  const clientBaseURL = await cacheStorage.getString(
    UserPreferenceKeys.BASE_URL,
  );
  const userId = await cacheStorage.getString(UserPreferenceKeys.LOGIN_USER_ID);

  return axios.create({
    baseURL: clientBaseURL,
    timeout: 500000, // ✅ 5 minute timeout: prevents hanging requests, accommodates large sync operations
    headers: {
      'Content-Type': 'application/json',
      LogUserId: userId ? userId : '', //used for log writting of user on server side
    },
  });
};

export default createApiClient;
