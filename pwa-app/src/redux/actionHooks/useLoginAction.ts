import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {
  setEnteredUName,
  setUserPassword,
  setClientCode,
  setClientBaseURL,
  setLoginLoading,
  setUName,
  setUId,
  setDevId,
  setAreaaId,
  setToken,
  setSavedApiVersion,
  setSavedAppendedApiVersion,
} from '../reducers/loginReducers';
import {useAppSelector} from '../store';

type Function = {
  setUserPass: (payload: string) => void;
  setEnterUserName: (payload: string) => void;
  setEnteredClientCode: (payload: string) => void;
  setClientBasedURL: (payload: string) => void;
  setLoginLoader: (payload: boolean) => void;
  enteredUserName: string;
  userPassword: string;
  savedClientCode: string;
  clientBaseURL: string;
  loginLoading: boolean;
  setUserName: (payload: string | number | undefined) => void;
  setUserId: (payload: string | number | undefined) => void;
  setDeviceId: (payload: string | number | undefined) => void;
  setAreaId: (payload: string | number | undefined) => void;
  userName: string;
  userId: string;
  deviceId: string;
  areaId: string;
  setJWTToken: (payload: any) => void;
  token: any;
  setSavedAppendedApiVersionAction: (payload: string) => void;
  savedAppendApiVersion: string;
  setSavedApiVersionAction: (payload: string) => void;
  savedApiVersion: string;
};
/**
 *
 * @param dispatch is function
 * @param data payload data to sent to reducer
 */
export const useLoginAction = (): Function => {
  const dispatch = useDispatch();

  // Memoize all setter functions to prevent re-renders
  const setEnterUserName = useCallback((payload: string) => {
    dispatch(setEnteredUName(payload));
  }, [dispatch]);

  const setUserPass = useCallback((payload: string) => {
    dispatch(setUserPassword(payload));
  }, [dispatch]);

  const setEnteredClientCode = useCallback((payload: string) => {
    dispatch(setClientCode(payload));
  }, [dispatch]);

  const setClientBasedURL = useCallback((payload: string) => {
    dispatch(setClientBaseURL(payload));
  }, [dispatch]);

  const setLoginLoader = useCallback((payload: boolean) => {
    dispatch(setLoginLoading(payload));
  }, [dispatch]);

  //API Response
  const setUserName = useCallback((payload: string | number | undefined) => {
    dispatch(setUName(payload));
  }, [dispatch]);

  const setUserId = useCallback((payload: string | number | undefined) => {
    dispatch(setUId(payload));
  }, [dispatch]);

  const setDeviceId = useCallback((payload: string | number | undefined) => {
    dispatch(setDevId(payload));
  }, [dispatch]);

  const setAreaId = useCallback((payload: string | number | undefined) => {
    dispatch(setAreaaId(payload));
  }, [dispatch]);

  const setJWTToken = useCallback((payload: any) => {
    dispatch(setToken(payload));
  }, [dispatch]);

  //#region--------------API VERSION------------
  const setSavedApiVersionAction = useCallback((payload: string) => {
    dispatch(setSavedApiVersion(payload));
  }, [dispatch]);

  const setSavedAppendedApiVersionAction = useCallback((payload: string) => {
    dispatch(setSavedAppendedApiVersion(payload));
  }, [dispatch]);
  //#endregion

  const enteredUserName = useAppSelector(
    state => state.loginReducer.enteredUserName,
  );
  const userPassword = useAppSelector(state => state.loginReducer.userPassword);
  const savedClientCode = useAppSelector(
    state => state.loginReducer.savedClientCode,
  );
  const clientBaseURL = useAppSelector(
    state => state.loginReducer.clientBaseURL,
  );
  const loginLoading = useAppSelector(state => state.loginReducer.loginLoading);

  const userName = useAppSelector(state => state.loginReducer.userName);
  const userId = useAppSelector(state => state.loginReducer.userId);
  const deviceId = useAppSelector(state => state.loginReducer.deviceId);
  const areaId = useAppSelector(state => state.loginReducer.areaId);
  const token = useAppSelector(state => state.loginReducer.token);

  //#region--------------API VERSION------------
  const savedApiVersion = useAppSelector(
    state => state.loginReducer.savedApiVersion,
  );
  const savedAppendApiVersion = useAppSelector(
    state => state.loginReducer.savedAppendApiVersion,
  );
  //#endregion

  return {
    enteredUserName,
    setEnterUserName,
    userPassword,
    setUserPass,
    savedClientCode,
    setEnteredClientCode,
    clientBaseURL,
    setClientBasedURL,
    loginLoading,
    setLoginLoader,
    userName,
    setUserName,
    userId,
    setUserId,
    deviceId,
    setDeviceId,
    areaId,
    setAreaId,
    token,
    setJWTToken,
    setSavedApiVersionAction,
    savedApiVersion,
    setSavedAppendedApiVersionAction,
    savedAppendApiVersion,
  };
};
