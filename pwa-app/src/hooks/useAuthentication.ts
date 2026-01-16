import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

import {AUTH_ENDPOINTS} from '../constants/APIEndPoints';
import {useLoginAction} from '../redux/actionHooks/useLoginAction';
import Apis from '../api/LoginAPICalls';
import ApiAuth from '../api/AuthApiCall';
import cacheStorage from '../localstorage/secureStorage';
import {UserPreferenceKeys} from '../constants/asyncStorageKeys';
import {
  fetchUserAccess,
  generateRandomOTP,
  writeActivityLog,
  writeApiVersionLog,
  writeErrorLog,
} from '../utility/utils';
import cache from '../localstorage/userPreference';
import {useGlobleAction} from '../redux/actionHooks/useGlobalAction';
import {ScreenName} from '../constants/screenConstants';
import {insertAllData} from '../database/SqlDatabase';
import {versionChecking} from './utilHooks';

interface loginProp {
  user: string;
  password: string;
  SCode: string;
  deviceID: string;
  navigation?: any;
  authBackground?: boolean;
  loaderState?: any;
  isLoginScreen?: boolean;
  FcmToken?: any;
  t: any;
}

interface DecodedResponse {
  UserName?: string;
  UserId?: string;
  DeviceId?: string;
  AreaId?: string;
}

export const useAuthentication = () => {
  const {
    setClientBasedURL,
    setUserName,
    setUserId,
    setDeviceId,
    setAreaId,
    setEnterUserName,
    setUserPass,
    setEnteredClientCode,
    setJWTToken,
    setSavedApiVersionAction,
    setSavedAppendedApiVersionAction,
  } = useLoginAction();

  const {
    setIsLogin,
    setMultiDivision,
    isMultiDivision: _isMultiDivision,
    setParentUser,
    setParentEnabled,
    setAccessControl,
    setMenuOrder,
    setLastExecTime,
    selectedAreaId,
    setSyncFlag,
    syncFlag,
    setIsSplashShown,
    setGeofenceGlobalSettingsAction,
    setAllowedBackdateDispatchDays,
    setIsPDCandUnallocatedEnable,
    setAccessControlSettingsAction,
  } = useGlobleAction();
  const globalActions = useGlobleAction();
  const doAuth = async ({
    user,
    password,
    SCode,
    deviceID,
    FcmToken,
    authBackground = false,
    navigation,
    loaderState = false,
    isLoginScreen = false,
    t,
  }: loginProp) => {
    console.log(
      user,
      password,
      SCode,
      deviceID,
      authBackground,
      loaderState,
      FcmToken,
    );
    const authHeaders = {
      LoginId: user,
      Password: password,
      ClientCode: SCode,
      DeviceId: deviceID,
      FcmToken: FcmToken,
      AppApiVersion: AUTH_ENDPOINTS.APP_API_VERSION, //testing
    };

    try {
      // 1st API
      //  console.log('authHeaders', authHeaders);
      writeApiVersionLog();
      loaderState && loaderState(true);
      const res = await ApiAuth.postAuthApi(authHeaders);
      versionChecking(
        res,
        setClientBasedURL,
        setSavedApiVersionAction,
        setSavedAppendedApiVersionAction,
        () => {
          loaderState && loaderState(false);
        },
        t,
      );

      const headers2 = {
        LoginId: user,
        Password: password,
        ClientCode: SCode,
        DeviceId: deviceID,
        authheader: res?.data?.Token,
        FcmToken: FcmToken,
      };

      try {
        // 2nd API
        const takeresp = await Apis.postAuthLogin(headers2);

        let generatedOTP = await generateRandomOTP();
        const otpHeader = {
          LoginId: user,
          OTP: generatedOTP,
        };

        if (takeresp?.Message == 4) {
          if (!authBackground) {
            const otpRes = await Apis.postOTP(otpHeader);
            // console.log('otpRes -->', otpRes);
            loaderState && loaderState(false);
            cache.storeCache(UserPreferenceKeys.USER_OTP, generatedOTP);
            writeActivityLog(`Forget OTP screen`);
            navigation.navigate(ScreenName.FORGET_OTP, {
              OTPres: otpRes,
              userDetails: authHeaders,
              navigation: navigation,
            });
          }
        } else if (takeresp?.Message != undefined) {
          loaderState && loaderState(false);
          console.log('2nd api message ===>', takeresp?.Message);
          // PWA: Use window.alert instead of RN Alert
          alert(takeresp?.Message);
          return;
        } else {
          const decodedResponse: DecodedResponse = jwtDecode(takeresp?.Token);
          console.log(
            '2nd api message decodedResponse ===>',
            takeresp?.Message,
          );

          setJWTToken(takeresp?.Token);
          setUserName(decodedResponse?.UserName);
          setUserId(decodedResponse?.UserId);
          setDeviceId(decodedResponse?.DeviceId);
          setAreaId(decodedResponse?.AreaId);
          cacheStorage.set(UserPreferenceKeys.LOGIN_CLIENT_CODE, SCode);
          cacheStorage.set(
            UserPreferenceKeys.LOGIN_USER_ID,
            decodedResponse?.UserId,
          );
          cacheStorage.set(UserPreferenceKeys.LOGIN_LOGIN_ID, user);
          cacheStorage.set(UserPreferenceKeys.LOGIN_USER_CRED, password);
          cacheStorage.set(UserPreferenceKeys.LOGIN_USER_DEVICE_ID, deviceID);
          cacheStorage.set(
            UserPreferenceKeys.LOGIN_USER_JWT_TOKEN,
            takeresp?.Token,
          );
          // console.log('decodedResponse-->', decodedResponse, takeresp?.Message);
          console.log(
            'inserted all data func',
            SCode,
            decodedResponse?.UserId,
            user,
            password,
            deviceID,
          );

          try {
            const getUserAccessData = await Apis.getUserAccess({
              UserId: Number(decodedResponse?.UserId),
            });
            // console.log('getUserAccessData --->', getUserAccessData);

            setMultiDivision(getUserAccessData.UserAccessDetails[0].isMultiDiv);
            setParentUser(getUserAccessData.UserAccessDetails[0].isParent);
            setParentEnabled(getUserAccessData.UserAccessDetails[0].isParent);
            setAccessControl(
              JSON.parse(getUserAccessData.UserAccessDetails[0].AccessControl),
            );
            setMenuOrder(
              JSON.parse(getUserAccessData.UserAccessDetails[0].MenuOrder),
            );
            fetchUserAccess(
              decodedResponse.UserId!,
              globalActions,
              setGeofenceGlobalSettingsAction,
              getUserAccessData,
              setAccessControlSettingsAction,
            );
            setAllowedBackdateDispatchDays(
              getUserAccessData.UserAccessDetails[0].AllowBackdatedDispatchDays,
            );
            setIsPDCandUnallocatedEnable(
              getUserAccessData?.UserAccessDetails[0]?.IsPDCEnabled === '1' ||
                false,
            );
          } catch (error) {
            writeErrorLog('getUserAccessData', error);
            console.log('error getting user access detail -->', error);
          }
        }

        try {
          // 3rd API
          const getToken = await Apis.postAuthToken(authHeaders);

          const headers4 = {
            authheader:
              takeresp?.Token != undefined ? getToken.data?.Token : null,
            AreaId: selectedAreaId,
          };

          try {
            // 4th API
            const getUserData = await Apis.getAuthData(headers4);
            console.log('4th api hit', getUserData?.BasicDetails);
            loaderState && loaderState(false);

            if (!authBackground && takeresp?.Message !== 4) {
              setEnterUserName(user);
              setUserPass(password);
              setEnteredClientCode(SCode);
              setLastExecTime(moment().format('DD-MMM-YYYY'));
              // insert data into DB
              if (isLoginScreen === false) {
                console.log('inserted all data func');
                await insertAllData(getUserData);
                setSyncFlag(!syncFlag);
              }
              // Sets to main route
              setIsSplashShown?.(false);
              setIsLogin(true);
            }
          } catch (error) {
            writeErrorLog('getUserData 4th API Error', error);
            console.log('4th API Error', error);
            loaderState && loaderState(false);
          }
        } catch (error) {
          writeErrorLog('getUserData 3rd API Error', error);
          console.log('3rd API Error', error);
          loaderState && loaderState(false);
        }
      } catch (error) {
        writeErrorLog('getUserData 2nd API Error', error);
        console.log('2nd API Error', error);
        loaderState && loaderState(false);
      }
    } catch (error) {
      writeErrorLog('getUserData 1st API Error', error);
      console.log('1st API Error', error);
      loaderState && loaderState(false);
    }
  };

  return {doAuth};
};
