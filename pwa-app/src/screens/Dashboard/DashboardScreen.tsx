import React, {useEffect, useState, useCallback} from 'react';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

// Components
import {Loader, CustomSafeView, Dropdown} from '../../components';
import ToggleNavBar from '../../components/Buttons/ToggleNavBar';
import TopCard from './Component/TopCard';
import TeamPerformanceReport from './ManagerDashboard/TeamPerformanceReport';
import ReportCard from './UserPerformance/ReportCard';
import Sidemenu from '../../components/Sidemenu/Sidemenu';

// Hooks & Redux
import {useGlobleAction} from '../../redux/actionHooks/useGlobalAction';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {useDashAction} from '../../redux/actionHooks/useDashAction';
import {useNetInfo} from '../../hooks/useNetInfo';

// API
import {dashGraph} from '../../api/DashboardAPICalls';

// Database
import {
  getLastSync,
  getAttendance,
  getAttendance2,
  getDataDistributorMaster,
  getTotalOrdersOfOrderMAsternotsync,
  getAttendanceEndDay,
  getAttendanceSettings,
} from '../../database/SqlDatabase';

// Utils & Constants
import {Colors} from '../../theme/colors';
import {writeErrorLog, getCurrentDate} from '../../utility/utils';
import {DEFAULT_TAB_NAMES} from '../../constants/screenConstants';

function DashboardScreen() {
  const {t} = useTranslation();
  const {isNetConnected} = useNetInfo();

  // Redux hooks
  const {
    syncFlag,
    isMultiDivision,
    lastExecutionTime: _lastExecutionTime,
    setLastExecTime: _setLastExecTime,
    setSyncFlag,
    setAttendanceOptionsAction,
    AttendanceOptions: _AttendanceOptions,
  } = useGlobleAction();

  const {userId} = useLoginAction();

  const {
    SelectedDivison,
    setSelectedDivision,
    AttendanceIn,
    AttendanceOut,
    setIsAttDone,
    setIsAttendOut,
    setSalesTrend,
    setUserDetails,
    setConsentApiVersion,
    setConsentAppVersion,
  } = useDashAction();

  // State - matching RN variable names
  const [lastSync, setLastSync] = useState('');
  const [isDataSynced, setIsDataSynced] = useState(true);
  const [multiData, setMultiData] = useState<any[]>([]);
  const [dayUserEnd, setdayUserEnd] = useState<any[]>([]);
  const [isloading, setIsloading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasFetchedDashboard, setHasFetchedDashboard] = useState(false);

  /**
   * Check sync status - matches RN checkIsSync
   */
  const checkIsSync = async () => {
    try {
      setTimeout(async () => {
        const isSynced = await getTotalOrdersOfOrderMAsternotsync();
        setIsDataSynced(isSynced[0]?.TotalCount === 0);
      }, 300);
    } catch (error) {
      writeErrorLog('checkIsSync', error);
    }
  };

  /**
   * Get user day end data - matches RN getUserDayEndData
   */
  const getUserDayEndData = async (): Promise<void> => {
    try {
      const date: string = await getCurrentDate();
      const newData: any = await getAttendanceEndDay(date);

      setdayUserEnd((prevData: any) => {
        if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
          return newData;
        }
        return prevData;
      });
    } catch (err) {
      writeErrorLog('getAttendanceEndDay', err);
    }
  };

  /**
   * Check if attendance is done - matches RN checkIsAttendanceDone
   */
  const checkIsAttendanceDone = async () => {
    try {
      const datee1 = await getCurrentDate();
      setTimeout(async () => {
        await getAttendance(datee1).then(data => {
          if (data.length <= 0) {
            setIsAttDone?.(false);
          } else {
            setIsAttDone?.(true);
            getAttendance2(datee1).then(data1 => {
              if (data1.length <= 0) {
                setIsAttendOut?.(true);
              } else {
                setIsAttendOut?.(false);
              }
            });
          }
        });
      }, 300);
    } catch (error) {
      writeErrorLog('checkIsAttendanceDone', error);
    }
  };

  /**
   * Get attendance options from settings - matches RN getAttendanceOptions
   */
  const getAttendanceOptions = async () => {
    await getAttendanceSettings()
      .then((data: any) => {
        if (data && data.length > 0) {
          const rawString = data[0].Value;
          let fixedString = rawString
            .replace(/(\w+):/g, '"$1":')
            .replace(/'/g, '"')
            .replace(/,\s*]/g, ']');
          try {
            const stringArray = JSON.parse(fixedString);
            setAttendanceOptionsAction?.(stringArray);
            console.log('Formatted attendance options:', stringArray);
          } catch (parseError) {
            console.error('JSON parse error after fixing:', parseError);
            console.log('String being parsed:', fixedString);
          }
        }
      })
      .catch((error: any) => {
        console.error('Error fetching sync data:', error);
      });
  };

  /**
   * Set access control data - matches RN setAccessControlData
   */
  const setAccessControlData = () => {
    checkIsSync();
    getAttendanceOptions();
    // getApiCallForImage(); // TODO: Implement when needed
  };

  /**
   * Get graph data from API - matches RN getGraphData
   */
  const getGraphData = async () => {
    if (!userId) {
      console.log('No userId - skipping dashboard graph fetch');
      return;
    }

    if (!isNetConnected && isNetConnected !== null) {
      console.log('Offline - skipping dashboard graph fetch');
      return;
    }

    if (hasFetchedDashboard) {
      console.log('Dashboard data already fetched - skipping');
      return;
    }

    try {
      setIsloading(true);
      setHasFetchedDashboard(true);
      console.log('Fetching dashboard data for userId:', userId);

      const graphData = await dashGraph({
        UserId: userId,
        UOM: '',
      });

      console.log('Dashboard data received:', graphData ? 'success' : 'empty');

      if (graphData) {
        if (graphData.SalesTrend) {
          setSalesTrend?.(graphData.SalesTrend);
        }
        if (graphData.UserDetails && graphData.UserDetails.length > 0) {
          setUserDetails?.(graphData.UserDetails[0]);
        }
        if (graphData.ConsentAPIVersion) {
          setConsentApiVersion?.(graphData.ConsentAPIVersion);
        }
        if (graphData.ConsentAppVersion) {
          setConsentAppVersion?.(graphData.ConsentAppVersion);
        }
      }
    } catch (error) {
      writeErrorLog('getGraphData', error);
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsloading(false);
    }
  };

  /**
   * Load initial data (last sync, multi-division) - matches RN useFocusEffect logic
   */
  const loadInitialData = useCallback(async () => {
    try {
      // Get last sync time
      const lastSyncData = await getLastSync();
      if (lastSyncData?.Value) {
        setLastSync(lastSyncData.Value);
      } else {
        const storedLastSync = localStorage.getItem('lastSync');
        if (storedLastSync) {
          setLastSync(storedLastSync);
        } else {
          setLastSync(moment().format('DD-MMM-YYYY HH:mm'));
        }
      }

      // Get multi-division data
      if (isMultiDivision) {
        const distributorData = await getDataDistributorMaster();
        setMultiData(distributorData);
      }
    } catch (error) {
      writeErrorLog('loadInitialData', error);
      console.error('Error loading initial data:', error);
    }
  }, [isMultiDivision]);

  // Effect for setAccessControlData - matches RN useEffect
  useEffect(() => {
    setAccessControlData();
  }, [syncFlag]);

  // Effect for attendance and day end checks - matches RN useFocusEffect
  useEffect(() => {
    checkIsAttendanceDone();
    getUserDayEndData();
  }, [syncFlag, lastSync]);

  // Effect for graph data - matches RN useEffect
  useEffect(() => {
    getGraphData();
  }, [userId, syncFlag]);

  // Initial data load
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Reset fetch flag when sync changes
  useEffect(() => {
    if (syncFlag && hasFetchedDashboard) {
      setHasFetchedDashboard(false);
    }
  }, [syncFlag]);

  /**
   * Handle dropdown item change - matches RN onDDItemChange
   */
  const onDDItemChange = (selectedValue: any) => {
    setSelectedDivision?.(selectedValue);
  };

  /**
   * Handle manual sync
   */
  const handleSync = useCallback(async () => {
    if (!isNetConnected && isNetConnected !== null) {
      alert(t('Alerts.NoInternetConnection') || 'No internet connection. Please connect to the internet to sync.');
      return;
    }

    setIsloading(true);
    try {
      setSyncFlag?.(!syncFlag);
      localStorage.setItem('lastSync', moment().format('DD-MMM-YYYY HH:mm'));
      setLastSync(moment().format('DD-MMM-YYYY HH:mm'));
      alert(t('Common.SyncComplete') || 'Sync completed successfully');
    } catch (error) {
      writeErrorLog('handleSync', error);
      alert(t('Alerts.SyncFailed') || 'Sync failed. Please try again.');
    } finally {
      setIsloading(false);
    }
  }, [isNetConnected, syncFlag, setSyncFlag, t]);

  // Navigation items for ToggleNavBar
  const navigationItems = [
    {
      id: 'home',
      icon: 'layout',
      label: t('Dashboard.Home') || 'Home',
      component: <TeamPerformanceReport />,
    },
    {
      id: 'my_perf_rep',
      icon: 'bar-chart-2',
      label: t('Dashboard.PerformanceReport') || 'Performance Report',
      component: <ReportCard />,
    },
  ];

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#F5F5F5',
  };

  const distContainerStyle: React.CSSProperties = {
    backgroundColor: Colors.mainBackground,
    height: 'auto',
    zIndex: 990,
    padding: '0 10px 25px 10px',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
  };

  return (
    <div style={containerStyle}>
      <Loader visible={isloading} />

      {/* Sidemenu */}
      <Sidemenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSync={handleSync}
        onRefreshData={() => {
          // TODO: Implement refresh data functionality
          alert(t('Common.RefreshDataComingSoon') || 'Refresh data functionality will be implemented soon');
        }}
      />

      {/* Main Content */}
      <TopCard
        onMenuPress={() => setIsSidebarOpen(true)}
        lastSync={lastSync}
        multiDivData={multiData}
        isDataSynced={isDataSynced}
        SelectedDivison={SelectedDivison}
        AttendanceMarked={AttendanceIn}
        AttendanceEnd={AttendanceOut}
        AttendanceDayEnd={dayUserEnd}
      />

      <CustomSafeView isScrollView={true}>
        {isMultiDivision && (
          <div style={distContainerStyle}>
            <Dropdown
              data={multiData}
              label={t('Dashboard.Distributor') || 'Distributor'}
              placeHolder={t('Dashboard.SelectDistributor') || 'Select Distributor'}
              onPressItem={(val: any) => onDDItemChange(val)}
              selectedValue={SelectedDivison?.Distributor}
            />
          </div>
        )}

        <div style={mainContentStyle}>
          <ToggleNavBar
            navItems={navigationItems}
            defaultTab={DEFAULT_TAB_NAMES[0]}
          />
        </div>
      </CustomSafeView>
    </div>
  );
}

export default DashboardScreen;
