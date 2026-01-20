import {API_ENDPOINTS} from '../constants/APIEndPoints';
import createApiClient from './Client';

// Types
export interface OutletPerformanceData {
  OutletPerformanceReport: {
    UserID: string;
    Brands: string;
    SKU: string;
    Size: string;
    PartyID: string;
    UOM: string;
    DistributorId: string;
    FromDate: string;
    ToDate: string;
  }[];
}

export interface BrandWiseData {
  BrandWiseSalesReport: {
    UserID: string;
    Brands: string;
    Distributors: string;
    UOM: string;
    SortBy: string;
    Month: string;
    Year: string;
  }[];
}

export interface TarVsAchiData {
  TargetVsAchievementReport: {
    UserID: string;
    Brands: string;
    Distributors: string;
    UOM: string;
    SortBy: string;
    Month: string;
    Year: string;
  }[];
}

export interface DistStatusData {
  DistDataStatusReport: {
    UserID: string;
    SortBy?: string;
    FromDate?: string;
    ToDate?: string;
  }[];
}

export interface VisitBasedHeaders {
  UserID: string;
  Date: string;
  CommandType: string;
}

export interface LiveLocationHeaders {
  UserID: string;
  Date: string;
  CommandType: string;
}

/**
 * Outlet Performance Report API
 * @param data - OutletPerformanceData
 * @returns Outlet performance report data
 */
export const OutletPerformaceReportAPI = async (data: OutletPerformanceData): Promise<any> => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(API_ENDPOINTS.OUTLET_PERFORM, data);
  return response.data?.OutletPerformanceReport;
};

/**
 * Visit Based API for map view
 * @param headers - Visit based headers (UserID, Date, CommandType)
 * @returns Visit based lat/long details
 */
export const VisitBasedAPI = async (headers: VisitBasedHeaders): Promise<any> => {
  // PWA: Use x-custom- prefixed headers which proxy converts to actual header names
  const customHeaders = {
    'x-custom-UserID': headers.UserID,
    'x-custom-Date': headers.Date,
    'x-custom-CommandType': headers.CommandType,
  };

  const apiClient = await createApiClient();
  const response = await apiClient.post(API_ENDPOINTS.VISIT_BASED, null, {
    headers: customHeaders,
  });
  return response.data?.VisitBaseLatLongDetails;
};

/**
 * Brand Wise Sales Report API
 * @param data - BrandWiseData
 * @returns Brand wise sales report data
 */
export const BrandWiseAPI = async (data: BrandWiseData): Promise<any> => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(API_ENDPOINTS.BRAND_WISE_SALE, data);
  return response.data;
};

/**
 * Live Location Based API for map view
 * @param headers - Live location headers (UserID, Date, CommandType)
 * @returns Live location lat/long details
 */
export const LiveLocationBasedAPI = async (headers: LiveLocationHeaders): Promise<any> => {
  // PWA: Use x-custom- prefixed headers which proxy converts to actual header names
  const customHeaders = {
    'x-custom-UserID': headers.UserID,
    'x-custom-Date': headers.Date,
    'x-custom-CommandType': headers.CommandType,
  };

  const apiClient = await createApiClient();
  const response = await apiClient.post(API_ENDPOINTS.LOCATION_BASED, null, {
    headers: customHeaders,
  });
  return response.data?.LocationBaseLatLongDetails;
};

/**
 * Distributor Data Status Report API
 * @param data - DistStatusData
 * @returns Distributor status report data
 */
export const DistStatusAPI = async (data: DistStatusData): Promise<any> => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(API_ENDPOINTS.DIST_DATA_STATUS, data);
  return response.data;
};

/**
 * Target vs Achievement Report API
 * @param data - TarVsAchiData
 * @returns Target vs achievement report data
 */
export const TarVsAchiAPI = async (data: TarVsAchiData): Promise<any> => {
  const apiClient = await createApiClient();
  const response = await apiClient.post(API_ENDPOINTS.TARGET_VS_ACHI_REP_EP, data);
  return response.data;
};

export default {
  OutletPerformaceReportAPI,
  VisitBasedAPI,
  BrandWiseAPI,
  LiveLocationBasedAPI,
  DistStatusAPI,
  TarVsAchiAPI,
};
