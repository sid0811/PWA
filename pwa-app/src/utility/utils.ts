import moment from 'moment';
import {VERSION_DETAIL, AUTH_ENDPOINTS} from '../constants';
import Apis from '../api/LoginAPICalls';
import type {GlobleAction} from '../redux/actionHooks/useGlobalAction';
import type {GeofenceSettings} from '../types/types';

// ERROR LOGS - PWA stub (will connect to DB later)
export const writeErrorLog = async (funcName: string, err: any) => {
  const curDateTime = new Date().toISOString();
  console.error(`ERROR: ${funcName} ${String(err)} `, curDateTime);
};

// Activity LOGS
export const writeActivityLog = async (activity: string) => {
  const curDateTime = new Date().toISOString();
  console.log(`Activity: ${activity}`, curDateTime);
};

export const writeApiVersionLog = async () => {
  const curDateTime = new Date().toISOString();
  console.log(
    `App Version: ${VERSION_DETAIL} APP API Version: ${AUTH_ENDPOINTS.APP_API_VERSION} `,
    curDateTime,
  );
};

// Activity LOGS
export const writeReportsLog = async (activity: string) => {
  const curDateTime = new Date().toISOString();
  console.log(`Reports: ${activity}`, curDateTime);
};

export const writeLocationLog = async (
  funcName: string,
  event: string,
  err: any,
) => {
  const curDateTime = new Date().toISOString();
  console.log(
    `Geofence: ${event} :- ${funcName} ${String(err)} `,
    curDateTime,
  );
};

// post data sync object keys
export const dataSyncObjectKeys = {
  OrderMaster: 'OrderMaster',
  OrderDetails: 'OrderDetails',
  NewParty: 'NewParty',
  NewPartyImage: 'NewPartyImage',
  newPartyTargetId: 'newPartyTargetId',
};

// Collection types for OrderMaster
export const enum COLLECTION_TYPE {
  ORDER = '0',
  DATA_COLLECTION1 = '1',
  DATA_COLLECTION2 = '2',
  IMAGE = '3',
  VISITED_SHOPS = '4',
  ASSETS = '5',
  MEETING = '6',
  PAYMENT_COLLECTION = '7',
  ATTENDANCE_IN = '8',
  ATTENDANCE_OUT = '9',
  TAKE_SURVEY = '10',
}

// Global Utilities
export const getAppOrderId = async (uid: number | string) => {
  let AOID = '';
  AOID = uid + moment().format('YYMMDDHHmmss');
  return AOID;
};

export const getCurrentDateTime = async (date = new Date()) =>
  moment(date).format('YYYY-MM-DD HH:mm:ss');

export const getCurrentDate = async (date = new Date()) =>
  moment(date).format('DD-MMM-YYYY');

export const getCurrentDateWithTime = async (date = new Date()) =>
  moment(date).format('DDMMMYYYYHHmmss');

export const generateRandomOTP = async () =>
  Math.floor(Math.random() * 9000 + 1000);

export const removeNonNumeric = (input = '') => input.replace(/[^0-9]/g, '');
export const removeSpecialCharacters = (input = '') =>
  input.replace(/[^a-zA-Z0-9 ]/g, '');
export const removeQuotation = (input = '') => input.replace(/['"]/g, '');
export const removeComaAndAT = (input = '') => input.replace(/[@,]/gm, '');

// Web equivalents of responsive screen utilities
const hp = (percentage: string | number) => `${percentage}vh`;
const wp = (percentage: string | number) => `${percentage}vw`;

export const LOGIN_BOX = {
  Height: hp('8'),
  Width: wp('87'),
};

export const UPTIME_FROM_CURRENT = Math.floor(Date.now() / 1000) + 120; // 2 minutes from now

// Database constants
export const databaseName = 'ZyleminiPlusDatabase.db';
export const databaseVersion = '1.0';
export const databaseDisplayName = 'ZyleminiPlusDatabase.db';
export const databaseSize = 200000000; // in bytes
export const DATABASE_VERSION = 7; // for DB Migration
export const MAX_SIZE_BYTES_TO_POST = 27 * 1024 * 1024; // 27 MB in bytes

export const _userAccessDataDefault: string[] = [
  'SIDE_MENU_SYNCNOW',
  'SIDE_MENU_REFRESHDATA',
  'SIDE_MENU_LOGOUT',
  'SIDE_MENU_REPORTERROR',
];

// Payment modes
export const PaymentMode = {
  CHEQUE: 'CHEQUE',
  CASH: 'CASH',
  NEFT: 'NEFT',
  RTGS: 'RTGS',
};

export const paymentModeCheck = [
  {type: 'CHEQUE', mode: 1},
  {type: 'CASH', mode: 0},
  {type: 'NEFT', mode: 3},
  {type: 'RTGS', mode: 2},
];

// Data collection types
export const SalesStock = {
  SALE: 'Sales',
  STOCK: 'Stock',
};

// Attendance list
export const attendanceList = [
  {id: '1', name: 'Local Market'},
  {id: '2', name: 'Outstation'},
  {id: '3', name: 'Work from Home'},
  {id: '4', name: 'Ex-Headquarter'},
];

// Fetch user access
export async function fetchUserAccess(
  userId: string,
  actions: GlobleAction,
  setGeofenceGlobalSettingsAction?: (val: GeofenceSettings) => void,
  getUserAccessDataParam?: any,
  setAccessControlSettingsAction?: (val: string[]) => void,
) {
  try {
    let _getUserAccessData: any = [];
    if (getUserAccessDataParam != null) {
      _getUserAccessData = getUserAccessDataParam;
    } else {
      _getUserAccessData = await Apis.getUserAccess({
        UserId: Number(userId),
      });
    }
    let isWhatsAppOrderPostDocument = false;
    isWhatsAppOrderPostDocument =
      (_getUserAccessData.UserAccessDetails[0].isWhatsAppOrderPostDocument
        ? _getUserAccessData.UserAccessDetails[0].isWhatsAppOrderPostDocument
        : '0') === '1';
    let geofenceSettings = _getUserAccessData?.GeoFencingSettings?.[0];
    let accessControlUserData: string =
      _getUserAccessData.UserAccessDetails[0].AccessControlUser;

    let _userAccessData = _userAccessDataDefault;
    if (accessControlUserData != null && accessControlUserData != undefined) {
      _userAccessData = accessControlUserData.includes(',')
        ? accessControlUserData.split(',').map((item: string) => item.trim())
        : [];
      _userAccessData.push(
        'SIDE_MENU_SYNCNOW',
        'SIDE_MENU_REFRESHDATA',
        'SIDE_MENU_LOGOUT',
        'SIDE_MENU_REPORTERROR',
      );
    }
    actions.setisWhatsAppOrderPostDocumentAction?.(isWhatsAppOrderPostDocument);
    setAccessControlSettingsAction?.(_userAccessData);

    // PWA: Simplified geofence settings handling
    if (geofenceSettings) {
      const geofenceSettingsToSet: GeofenceSettings = {
        IsGeoFencingEnabled: geofenceSettings.IsGeoFencingEnabled === '1',
        IsFetchOneTimeLatLogEnabled: geofenceSettings.IsFetchOneTimeLatLogEnabled === '1',
        IsLocationRestriction: geofenceSettings.IsLocationRestriction === '1',
        GeofenceRadius_Shop: geofenceSettings.GeoFenceRadius_Shop || '200',
        GeofenceRadiusLatDelat: geofenceSettings.GeoFenceZoomRadiusLatDelat || '0.001',
        GeofenceRadiusLongDelat: geofenceSettings.GeoFenceZoomRadiusLongDelat || '0.001',
        GeoFenceDistanceFilterMtr: geofenceSettings.GeoFenceDistanceFilterMtr || '100',
        IsLiveLocationTracking: geofenceSettings.IsLiveLocationTracking === '1',
        LiveLocationStartTime: geofenceSettings.LiveLocationStartTime || '09:00',
        LiveLocationEndTime: geofenceSettings.LiveLocationEndTime || '22:00',
        LoggedInUserId: userId,
        IsShopEnteredNotificationEnabled: geofenceSettings.IsShopEnteredNotificationEnabled === '1',
        LastSyncLiveLocationApiTimeStamp: 0,
        LastSyncThresholdTimeApiCall: 5,
        TypeOfLiveLocationTracking: {
          IsAttandanceBasedTracking: false,
          IsAppOpenedActivityBasedTracking: false,
        },
        ActivityTriggered: {
          IsAttandanceTriggeredForTheDay: false,
          AppOpenedActivityTriggeredForTheDay: undefined,
        },
      };

      setGeofenceGlobalSettingsAction?.(geofenceSettingsToSet);
    }
  } catch (error) {
    writeErrorLog('fetchUserAccess', error);
    console.log('Error fetching user access:', error);
  }
}

// Access control helper function
export function isAccessControlProvided(ref: string[], value: string): boolean {
  return ref?.includes(value) ?? false;
}

// Check if value is valid (not null, undefined, or empty)
export function isValidvalue(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

// Get current date time in format for display
export const getCurrentDateTimeT = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

// Get time with format
export const getTimeWithFormat = async () => {
  return moment().format('DD-MMM-YYYY');
};

// Format to IST
export const formatToIST = (timestamp: string) => {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
};
