import {useDispatch, useSelector} from 'react-redux';
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
} from '../reducers/dashboardReducers';
import type {RootState} from '../store';

type DashActionReturn = {
  setIsCollectionVisible?: (payload: any) => void;
  setCollectionData?: (payload: any) => void;
  setMarketCallData?: (payload: any) => void;
  setSalesTrend?: (payload: any) => void;
  setTargetCalls?: (payload: any) => void;
  setUserDetails?: (payload: any) => void;
  CollectionStatus: any;
  CollectionVisible: any;
  MarketCalls: any;
  SalesTrend: any;
  Target: any;
  UserDetails: any;
  // Modal
  setAttendanceActivity?: (payload: string) => void;
  setSelectedAreaDash?: (payload: string | number) => void;
  AttendActivity: string;
  SelectedArea: string;
  setSelectedDivision?: (payload: any) => void;
  SelectedDivison: any;
  AttendanceIn: boolean;
  setIsAttDone?: (payload: boolean) => void;
  AttendanceOut: boolean;
  setIsAttendOut?: (payload: boolean) => void;
  setBase64Strings?: (payload: string) => void;
  base64: string;
  ConsentApiVersion: string;
  setConsentApiVersion?: (payload: string) => void;
  ConsentAppVersion: string;
  setConsentAppVersion?: (payload: string) => void;
  cachedTeamSummary: {
    data: any[];
    timestamp: string;
    isTeamReport: boolean;
    date: string;
  } | null;
  setCachedTeamSummaryData?: (payload: any) => void;
};

/**
 * Custom hook to interact with dashboard reducer
 * @returns Dashboard actions and state values
 */
export const useDashAction = (): DashActionReturn => {
  const dispatch = useDispatch();

  const setCollectionData = (payload: any) => {
    dispatch(setCollection(payload));
  };

  const setIsCollectionVisible = (payload: any) => {
    dispatch(setShowCollection(payload));
  };

  const setMarketCallData = (payload: any) => {
    dispatch(setMarketdata(payload));
  };

  const setSalesTrend = (payload: any) => {
    dispatch(setSalesData(payload));
  };

  const setTargetCalls = (payload: any) => {
    dispatch(setTargetData(payload));
  };

  const setUserDetails = (payload: any) => {
    dispatch(setUserDetail(payload));
  };

  // Modal
  const setAttendanceActivity = (payload: string) => {
    dispatch(setAttendActivity(payload));
  };

  const setSelectedAreaDash = (payload: number | string) => {
    dispatch(setSelectedArea(payload));
  };

  const setSelectedDivision = (payload: any) => {
    dispatch(setDivisionSelected(payload));
  };

  const setIsAttDone = (payload: boolean) => {
    dispatch(setAttendanceDone(payload));
  };

  const setIsAttendOut = (payload: boolean) => {
    dispatch(setAttendanceOut(payload));
  };

  const setBase64Strings = (payload: string) => {
    dispatch(setBase64String(payload));
  };

  const setConsentApiVersion = (payload: string) => {
    dispatch(setApiVersion(payload));
  };

  const setConsentAppVersion = (payload: string) => {
    dispatch(setAppVersion(payload));
  };

  const setCachedTeamSummaryData = (payload: any) => {
    dispatch(setCachedTeamSummary(payload));
  };

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
  };
};
