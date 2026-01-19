import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {
  setIsLoggedIn,
  setIsDarkMode,
  setIsMultiDivision,
  setIsParentUser,
  setIsParentEnabled,
  setSyncFlagState,
  setAccessControlData,
  setMenuOrderData,
  setLastExecTimeStamp,
  setShopCheckedIn,
  setMeetingEnded,
  setStartTime,
  setBlockedShop,
  setSelectedAreaId,
  setSyncRefersh,
  setIsSplashShowned,
  setGeofenceSettings,
  setIsLogEnabled,
  setAllowBackdatedDispatchDays,
  setMeetingEndBlocker,
  resetMeetingValidation,
  setIsPDCandUnallocatedEnabled,
  setIsOnNavWipeDataPOD,
  setAccessControlSettingsReducer,
  setIsSyncImmediateReducer,
  setIsNavigationSourceShopsReducer,
  setisWhatsAppOrderPostDocumentReducer,
  setAttendanceOptions,
  setExternalShare,
  setOrderConfirmationSignature,
} from '../reducers/globalReducers';
import {useAppSelector} from '../store';
import {GeofenceSettings, MeetingEndBlockValidation} from '../../types/types';

type Function = {
  setIsLogin?: any;
  setDarkMode?: any;
  setMultiDivision?: any;
  setParentUser?: any;
  setParentEnabled?: any;
  setSyncFlag?: any;
  setAccessControl?: any;
  setMenuOrder?: any;
  setLastExecTime?: any;
  isLoggedin?: boolean;
  isDarkMode?: boolean;
  isMultiDivision?: boolean;
  isParentUser?: boolean;
  parentEnabled?: boolean;
  syncFlag?: boolean;
  accessControl?: any;
  menuOrder?: any;
  lastExecutionTime?: any;
  isShopCheckedIn: boolean;
  setIsShopCheckIn?: any;
  isMeetingEnded?: boolean;
  setIsMeetingEnded?: any;
  persistedStartTime?: string;
  selectedAreaId?: string;
  setPersistStartTime?: any;
  setSelectedAreaID?: any;
  syncRefresh?: boolean;
  setIsSyncRefersh?: (val: boolean) => void;
  blockedShopName?: any;
  setBlockedShopDetail?: any;
  isSplashShown?: boolean;
  setIsSplashShown?: (val: boolean) => void;
  geofenceGlobalSettingsAction?: GeofenceSettings;
  setGeofenceGlobalSettingsAction?: (val: GeofenceSettings) => void;
  setLogWritingEnabled?: (val: boolean) => void;
  isLogWritingEnabled?: boolean;
  AllowBackdatedDispatchDays?: string;
  setAllowedBackdateDispatchDays: (val: string) => void;
  meetingEndBlocker: MeetingEndBlockValidation;
  setMeetingEndBlockerVal: (val: MeetingEndBlockValidation) => void;
  resetMeetingValidations: () => void;
  isPDC_Unallocated_Enabled: boolean;
  setIsPDCandUnallocatedEnable?: any;
  onNavWipeDataPOD: boolean;
  setIsOnNavWipePODData: (val: boolean) => void;
  setAccessControlSettingsAction: (val: string[]) => void;
  getAccessControlSettings: string[];
  setIsSyncImmediateAction: (val: boolean) => void;
  isSyncImmediate: boolean;
  setIsNavigationSourceShopsAction: (val: boolean) => void;
  isNavigationSourceShops: boolean;
  isWhatsAppOrderPostDocument: boolean;
  setisWhatsAppOrderPostDocumentAction: (val: boolean) => void;
  AttendanceOptions: {id: string; name: string}[];
  setAttendanceOptionsAction: (val: {id: string; name: string}[]) => void;
  externalShare: boolean;
  setExternalShare: (val: boolean) => void;
  OrderConfirmationSignature: boolean;
  setOrderConfirmationSignatureAction: (val: boolean) => void;
};
/**
 *
 * @param dispatch is function
 * @param data payload data to sent to reducer
 */
export const useGlobleAction = (): Function => {
  const dispatch = useDispatch();

  // Memoize all setter functions to prevent re-renders
  const setIsLogin = useCallback((payload: boolean) => {
    dispatch(setIsLoggedIn(payload));
  }, [dispatch]);

  const setDarkMode = useCallback((payload: boolean) => {
    dispatch(setIsDarkMode(payload));
  }, [dispatch]);

  const setMultiDivision = useCallback((payload: boolean) => {
    dispatch(setIsMultiDivision(payload));
  }, [dispatch]);

  const setParentUser = useCallback((payload: boolean) => {
    dispatch(setIsParentUser(payload));
  }, [dispatch]);

  const setParentEnabled = useCallback((payload: boolean) => {
    dispatch(setIsParentEnabled(payload));
  }, [dispatch]);

  const setSyncFlag = useCallback((payload: boolean) => {
    dispatch(setSyncFlagState(payload));
  }, [dispatch]);

  const setAccessControl = useCallback((payload: any) => {
    dispatch(setAccessControlData(payload));
  }, [dispatch]);

  const setMenuOrder = useCallback((payload: any) => {
    dispatch(setMenuOrderData(payload));
  }, [dispatch]);

  const setLastExecTime = useCallback((payload: string) => {
    dispatch(setLastExecTimeStamp(payload));
  }, [dispatch]);

  const setIsShopCheckIn = useCallback((payload: boolean) => {
    dispatch(setShopCheckedIn(payload));
  }, [dispatch]);

  const setIsMeetingEnded = useCallback((payload: boolean) => {
    dispatch(setMeetingEnded(payload));
  }, [dispatch]);

  const setPersistStartTime = useCallback((payload: string) => {
    dispatch(setStartTime(payload));
  }, [dispatch]);

  const setSelectedAreaID = useCallback((payload: string) => {
    dispatch(setSelectedAreaId(payload));
  }, [dispatch]);

  const setIsSyncRefersh = useCallback((payload: boolean) => {
    dispatch(setSyncRefersh(payload));
  }, [dispatch]);

  const setBlockedShopDetail = useCallback((payload: any) => {
    dispatch(setBlockedShop(payload));
  }, [dispatch]);

  const setIsSplashShown = useCallback((payload: boolean) => {
    dispatch(setIsSplashShowned(payload));
  }, [dispatch]);

  const setGeofenceGlobalSettingsAction = useCallback((payload: GeofenceSettings) => {
    dispatch(setGeofenceSettings(payload));
  }, [dispatch]);

  const setLogWritingEnabled = useCallback((payload: boolean) => {
    dispatch(setIsLogEnabled(payload));
  }, [dispatch]);

  const setAllowedBackdateDispatchDays = useCallback((payload: string) => {
    dispatch(setAllowBackdatedDispatchDays(payload));
  }, [dispatch]);

  const setMeetingEndBlockerVal = useCallback((payload: MeetingEndBlockValidation) => {
    dispatch(setMeetingEndBlocker(payload));
  }, [dispatch]);

  const resetMeetingValidations = useCallback(() => {
    dispatch(resetMeetingValidation());
  }, [dispatch]);

  const setIsPDCandUnallocatedEnable = useCallback((payload: boolean) => {
    dispatch(setIsPDCandUnallocatedEnabled(payload));
  }, [dispatch]);

  const setIsOnNavWipePODData = useCallback((payload: boolean) => {
    dispatch(setIsOnNavWipeDataPOD(payload));
  }, [dispatch]);

  const setAccessControlSettingsAction = useCallback((payload: string[]) => {
    dispatch(setAccessControlSettingsReducer(payload));
  }, [dispatch]);

  const setIsSyncImmediateAction = useCallback((payload: boolean) => {
    dispatch(setIsSyncImmediateReducer(payload));
  }, [dispatch]);

  const setIsNavigationSourceShopsAction = useCallback((payload: boolean) => {
    dispatch(setIsNavigationSourceShopsReducer(payload));
  }, [dispatch]);

  const setisWhatsAppOrderPostDocumentAction = useCallback((payload: boolean) => {
    dispatch(setisWhatsAppOrderPostDocumentReducer(payload));
  }, [dispatch]);

  const setAttendanceOptionsAction = useCallback((
    payload: {id: string; name: string}[],
  ) => {
    dispatch(setAttendanceOptions(payload));
  }, [dispatch]);

  const setExternalShareAction = useCallback((payload: boolean) => {
    dispatch(setExternalShare(payload));
  }, [dispatch]);

  const setOrderConfirmationSignatureAction = useCallback((payload: boolean) => {
    dispatch(setOrderConfirmationSignature(payload));
  }, [dispatch]);

  const isLoggedin = useAppSelector(state => state.globalReducer.isLoggedin);
  const isDarkMode = useAppSelector(state => state.globalReducer.isDarkMode);
  const isMultiDivision = useAppSelector(
    state => state.globalReducer.isMultiDivision,
  );
  const isParentUser = useAppSelector(
    state => state.globalReducer.isParentUser,
  );
  const parentEnabled = useAppSelector(
    state => state.globalReducer.parentEnabled,
  );
  const syncFlag = useAppSelector(state => state.globalReducer.syncFlag);
  const accessControl = useAppSelector(
    state => state.globalReducer.accessControl,
  );
  const menuOrder = useAppSelector(state => state.globalReducer.menuOrder);
  const lastExecutionTime = useAppSelector(
    state => state.globalReducer.lastExecutionTime,
  );
  const isShopCheckedIn = useAppSelector(
    state => state.globalReducer.isShopCheckedIn,
  );
  const isMeetingEnded = useAppSelector(
    state => state.globalReducer.isMeetingEnded,
  );
  const persistedStartTime = useAppSelector(
    state => state.globalReducer.persistedStartTime,
  );
  const selectedAreaId = useAppSelector(
    state => state.globalReducer.selectedAreaId,
  );
  const syncRefresh = useAppSelector(state => state.globalReducer.syncRefresh);

  const blockedShopName = useAppSelector(
    state => state.globalReducer.blockedShopName,
  );
  const isSplashShown = useAppSelector(
    state => state.globalReducer.isSplashShown,
  );

  const geofenceGlobalSettingsAction = useAppSelector(
    state => state.globalReducer.globalGeofenceSettings,
  );

  const isLogWritingEnabled = useAppSelector(
    state => state.globalReducer.isLogWritingEnabled,
  );

  const AllowBackdatedDispatchDays = useAppSelector(
    state => state.globalReducer.AllowBackdatedDispatchDays,
  );

  const meetingEndBlocker = useAppSelector(
    state => state.globalReducer.meetingEndBlocker,
  );
  const isPDC_Unallocated_Enabled = useAppSelector(
    state => state.globalReducer.isPDC_Unallocated_Enabled,
  );
  const onNavWipeDataPOD = useAppSelector(
    state => state.globalReducer.onNavWipeDataPOD,
  );
  const getAccessControlSettings = useAppSelector(
    state => state.globalReducer.accessControlSettings,
  );

  const isSyncImmediate = useAppSelector(
    state => state.globalReducer.isSyncImmediate,
  );

  const isNavigationSourceShops = useAppSelector(
    state => state.globalReducer.navigationSourceShops,
  );

  const isWhatsAppOrderPostDocument = useAppSelector(
    state => state.globalReducer.isWhatsAppOrderPostDocument,
  );

  const AttendanceOptions = useAppSelector(
    state => state.globalReducer.AttendanceOptions,
  );

  const externalShare = useAppSelector(
    state => state.globalReducer.externalShare,
  );

  const OrderConfirmationSignature = useAppSelector(
    state => state.globalReducer.OrderConfirmationSignature,
  );

  return {
    isLoggedin,
    setIsLogin,
    isDarkMode,
    setDarkMode,
    isMultiDivision,
    setMultiDivision,
    isParentUser,
    setParentUser,
    parentEnabled,
    setParentEnabled,
    syncFlag,
    setSyncFlag,
    accessControl,
    setAccessControl,
    menuOrder,
    setMenuOrder,
    lastExecutionTime,
    setLastExecTime,
    isShopCheckedIn,
    setIsShopCheckIn,
    isMeetingEnded,
    setIsMeetingEnded,
    persistedStartTime,
    setPersistStartTime,
    selectedAreaId,
    setSelectedAreaID,
    syncRefresh,
    setIsSyncRefersh,
    blockedShopName,
    setBlockedShopDetail,
    isSplashShown,
    setIsSplashShown,
    geofenceGlobalSettingsAction,
    setGeofenceGlobalSettingsAction,
    isLogWritingEnabled,
    setLogWritingEnabled,
    AllowBackdatedDispatchDays,
    setAllowedBackdateDispatchDays,
    meetingEndBlocker,
    setMeetingEndBlockerVal,
    resetMeetingValidations,
    isPDC_Unallocated_Enabled,
    setIsPDCandUnallocatedEnable,
    onNavWipeDataPOD,
    setIsOnNavWipePODData,
    setAccessControlSettingsAction,
    getAccessControlSettings,
    setIsSyncImmediateAction,
    isSyncImmediate,
    setIsNavigationSourceShopsAction,
    isNavigationSourceShops,
    setisWhatsAppOrderPostDocumentAction,
    isWhatsAppOrderPostDocument,
    AttendanceOptions,
    setAttendanceOptionsAction,
    externalShare,
    setExternalShare: setExternalShareAction,
    OrderConfirmationSignature,
    setOrderConfirmationSignatureAction,
  };
};

export type GlobleAction = ReturnType<typeof useGlobleAction>;

// Alias for backward compatibility
export const useGlobalAction = useGlobleAction;
