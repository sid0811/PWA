import {API_ENDPOINTS} from '../constants/APIEndPoints';
import type {DashGraph, UserChildren} from '../types/types';
import createApiClient from './Client';

// Types
interface DashGraphParams {
  UserId: string;
  UOM: string;
}

export interface PerformanceItem {
  Activity: string;
  Figure: string;
  Icon: string;
  IconBg: string;
  IconColor: string;
  IconFamily: string;
}

export interface TeamActivityReport {
  Id: string;
  Name: string;
  color: string;
  distanceTravelled: number;
  visitDate?: string;
}

type TeamActivityReportParams = {
  ParentUserID?: string;
  Date: string;
  CommandType: string;
  UserID?: string;
  CollectionType?: string;
};

/**
 * Get Dashboard Graph Data
 * @param data - UserId and UOM
 * @returns Dashboard data including user details, sales trend, etc.
 */
export const dashGraph = async (data: DashGraphParams): Promise<DashGraph> => {
  const apiClient = await createApiClient();
  const response = await apiClient.get<DashGraph>(API_ENDPOINTS.DASHGRAPH, {
    params: data,
  });
  return response.data;
};

/**
 * Get Child Executive List (for parent users)
 * @param headers - loginId header
 * @returns List of child executives
 */
export const childExecutiveList = async (headers: {loginId: string}): Promise<UserChildren> => {
  const apiClient = await createApiClient();
  const response = await apiClient.post<UserChildren>(
    API_ENDPOINTS.EXECUTIVE_LIST,
    null,
    {headers},
  );
  return response.data;
};

/**
 * Get User Performance Report
 * @param UserID - User ID
 * @param CommandType - Report type
 * @param UOM - Unit of measure
 * @param distID - Distributor ID
 * @param Brand - Brand filter
 * @param fromDate - Start date
 * @param toDate - End date
 * @returns Performance report data
 */
export const userPerformanceReport = async (
  UserID: string,
  CommandType: string,
  UOM: string,
  distID?: string,
  Brand?: string,
  fromDate?: string,
  toDate?: string,
): Promise<any> => {
  const Payload = {
    UserProfileReport: [
      {
        UserID,
        CommandType,
        CustomerId: '',
        DistributorId: distID || '0',
        Brand: Brand?.length ? Brand : '',
        UOM: UOM || '',
        FromDate: fromDate || '',
        ToDate: toDate || '',
      },
    ],
  };

  const apiClient = await createApiClient();
  const response = await apiClient.post<any>(
    API_ENDPOINTS.DASHBOARD_USER_PERF,
    Payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

/**
 * Get Team Performance Summary
 * @param ParentUserID - Parent user ID
 * @param Date - Date for the report
 * @param CommandType - 1 for team, 0 for individual
 * @returns Team performance summary items
 */
export const getTeamPerfomanceSummary = async (
  ParentUserID: string,
  Date: string,
  CommandType: number,
): Promise<PerformanceItem[]> => {
  const headers = {
    ParentUserID,
    Date,
    CommandType: String(CommandType),
  };

  const apiClient = await createApiClient();
  const response = await apiClient.get<PerformanceItem[]>(
    API_ENDPOINTS.TEAM_SUMMARY_REP,
    {headers},
  );
  return response.data;
};

/**
 * Get Team Activity Report
 * @param params - Report parameters
 * @returns Team activity report data
 */
export const getTeamActivityReport = async ({
  ParentUserID,
  Date,
  CommandType,
  UserID = '0',
  CollectionType,
}: TeamActivityReportParams): Promise<TeamActivityReport[]> => {
  const headers = {
    ParentUserID,
    Date,
    CommandType,
    UserID,
    CollectionType,
  };

  const apiClient = await createApiClient();
  const response = await apiClient.get<TeamActivityReport[]>(
    API_ENDPOINTS.TEAM_ACTIVITY_REP,
    {headers},
  );
  return response.data;
};

export default {
  dashGraph,
  childExecutiveList,
  userPerformanceReport,
  getTeamPerfomanceSummary,
  getTeamActivityReport,
};
