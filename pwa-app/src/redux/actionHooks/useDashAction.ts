import {useDispatch, useSelector} from 'react-redux';
import {useCallback} from 'react';
import {
  setCollection,
  setShowCollection,
  setMarketdata,
  setSalesData,
  setTargetData,
  setUserDetail,
  setAttendActivity,
  setSelectedArea,
  setDivisionSelected,
  setAttendanceDone,
  setAttendanceOut,
  setBase64String,
  setApiVersion,
  setAppVersion,
  setCachedTeamSummary,
  setCachedDashboardData,
} from '../reducers/dashboardReducers';
import type {RootState} from '../store';

type DashActionReturn = {
  setIsCollectionVisible: (payload: any) => void;
  setCollectionData: (payload: any) => void;
  setMarketCallData: (payload: any) => void;
  setSalesTrend: (payload: any) => void;
  setTargetCalls: (payload: any) => void;
  setUserDetails: (payload: any) => void;
  CollectionStatus: any;
  CollectionVisible: any;
  MarketCalls: any;
  SalesTrend: any;
  Target: any;
  UserDetails: any;
  // Modal
  setAttendanceActivity: (payload: string) => void;
  setSelectedAreaDash: (payload: string | number) => void;
  AttendActivity: string;
  SelectedArea: string;
  setSelectedDivision: (payload: any) => void;
  SelectedDivison: any;
  AttendanceIn: boolean;
  setIsAttDone: (payload: boolean) => void;
  AttendanceOut: boolean;
  setIsAttendOut: (payload: boolean) => void;
  setBase64Strings: (payload: string) => void;
  base64: string;
  ConsentApiVersion: string;
  setConsentApiVersion: (payload: string) => void;
  ConsentAppVersion: string;
  setConsentAppVersion: (payload: string) => void;
  cachedTeamSummary: {
    data: any[];
    timestamp: string;
    isTeamReport: boolean;
    date: string;
  } | null;
  setCachedTeamSummaryData: (payload: any) => void;
  cachedDashboardData: {
    SalesTrend: any;
    UserDetails: any;
    timestamp: string;
  } | null;
  setCachedDashboardDataAction: (payload: any) => void;
};

/**
 * Custom hook to interact with dashboard reducer
 * @returns Dashboard actions and state values
 */
export const useDashAction = (): DashActionReturn => {
  const dispatch = useDispatch();

  // Memoize all setter functions to prevent re-renders
  const setCollectionData = useCallback((payload: any) => {
    dispatch(setCollection(payload));
  }, [dispatch]);

  const setIsCollectionVisible = useCallback((payload: any) => {
    dispatch(setShowCollection(payload));
  }, [dispatch]);

  const setMarketCallData = useCallback((payload: any) => {
    dispatch(setMarketdata(payload));
  }, [dispatch]);

  const setSalesTrend = useCallback((payload: any) => {
    dispatch(setSalesData(payload));
  }, [dispatch]);

  const setTargetCalls = useCallback((payload: any) => {
    dispatch(setTargetData(payload));
  }, [dispatch]);

  const setUserDetails = useCallback((payload: any) => {
    dispatch(setUserDetail(payload));
  }, [dispatch]);

  // Modal
  const setAttendanceActivity = useCallback((payload: string) => {
    dispatch(setAttendActivity(payload));
  }, [dispatch]);

  const setSelectedAreaDash = useCallback((payload: number | string) => {
    dispatch(setSelectedArea(payload));
  }, [dispatch]);

  const setSelectedDivision = useCallback((payload: any) => {
    dispatch(setDivisionSelected(payload));
  }, [dispatch]);

  const setIsAttDone = useCallback((payload: boolean) => {
    dispatch(setAttendanceDone(payload));
  }, [dispatch]);

  const setIsAttendOut = useCallback((payload: boolean) => {
    dispatch(setAttendanceOut(payload));
  }, [dispatch]);

  const setBase64Strings = useCallback((payload: string) => {
    dispatch(setBase64String(payload));
  }, [dispatch]);

  const setConsentApiVersion = useCallback((payload: string) => {
    dispatch(setApiVersion(payload));
  }, [dispatch]);

  const setConsentAppVersion = useCallback((payload: string) => {
    dispatch(setAppVersion(payload));
  }, [dispatch]);

  const setCachedTeamSummaryData = useCallback((payload: any) => {
    dispatch(setCachedTeamSummary(payload));
  }, [dispatch]);

  const setCachedDashboardDataAction = useCallback((payload: any) => {
    dispatch(setCachedDashboardData(payload));
  }, [dispatch]);

  // Selectors
  const CollectionStatus = useSelector(
    (state: RootState) => state.dashReducer.CollectionStatus,
  );
  const CollectionVisible = useSelector(
    (state: RootState) => state.dashReducer.CollectionVisible,
  );
  const MarketCalls = useSelector(
    (state: RootState) => state.dashReducer.MarketCalls,
  );
  const SalesTrend = useSelector(
    (state: RootState) => state.dashReducer.SalesTrend,
  );
  const Target = useSelector((state: RootState) => state.dashReducer.Target);
  const UserDetails = useSelector(
    (state: RootState) => state.dashReducer.UserDetails,
  );
  //
  const AttendActivity = useSelector(
    (state: RootState) => state.dashReducer.AttendActivity,
  );
  const SelectedArea = useSelector(
    (state: RootState) => state.dashReducer.SelectedArea,
  );
  const SelectedDivison = useSelector(
    (state: RootState) => state.dashReducer.SelectedDivison,
  );
  const AttendanceIn = useSelector(
    (state: RootState) => state.dashReducer.AttendanceIn,
  );
  const AttendanceOut = useSelector(
    (state: RootState) => state.dashReducer.AttendanceOut,
  );

  const base64 = useSelector(
    (state: RootState) => state.dashReducer.base64String,
  );
  const ConsentApiVersion = useSelector(
    (state: RootState) => state.dashReducer.ApiVersion,
  );
  const ConsentAppVersion = useSelector(
    (state: RootState) => state.dashReducer.AppVersion,
  );

  const cachedTeamSummary = useSelector(
    (state: RootState) => state.dashReducer.cachedTeamSummary,
  );

  const cachedDashboardData = useSelector(
    (state: RootState) => state.dashReducer.cachedDashboardData,
  );

  return {
    CollectionStatus,
    setCollectionData,
    CollectionVisible,
    setIsCollectionVisible,
    MarketCalls,
    setMarketCallData,
    SalesTrend,
    setSalesTrend,
    Target,
    setTargetCalls,
    UserDetails,
    setUserDetails,
    AttendActivity,
    setAttendanceActivity,
    SelectedArea,
    setSelectedAreaDash,
    SelectedDivison,
    setSelectedDivision,
    AttendanceIn,
    setIsAttDone,
    AttendanceOut,
    setIsAttendOut,
    setBase64Strings,
    base64,
    cachedTeamSummary,
    setCachedTeamSummaryData,
    setConsentApiVersion,
    setConsentAppVersion,
    ConsentApiVersion,
    ConsentAppVersion,
    cachedDashboardData,
    setCachedDashboardDataAction,
  };
};
