import React, {useEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';

// Components
import {Loader, CustomSafeView, Dropdown} from '../../components';
import ToggleNavBar from '../../components/Buttons/ToggleNavBar';
import TopCard from './Component/TopCard';
import TeamPerformanceReport from './ManagerDashboard/TeamPerformanceReport';
import ReportCard from './UserPerformance/ReportCard';

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
  getAttendanceEndDay,
  getTotalOrdersOfOrderMAsternotsync,
  getDataDistributorMaster,
} from '../../database/SqlDatabase';

// Utils & Constants
import {Colors} from '../../theme/colors';
import {writeErrorLog, getCurrentDate} from '../../utility/utils';
import {DEFAULT_TAB_NAMES} from '../../constants/screenConstants';

// Sidebar menu items
import {FiHome, FiShoppingBag, FiFileText, FiUsers, FiBarChart2, FiLogOut, FiSettings, FiRefreshCw} from 'react-icons/fi';

function DashboardScreen() {
  const navigate = useNavigate();
  const {isNetConnected} = useNetInfo();

  // Redux hooks
  const {
    syncFlag,
    isMultiDivision,
    lastExecutionTime: _lastExecutionTime,
    setIsLogin,
    setSyncFlag,
  } = useGlobleAction();

  const {userId, userName} = useLoginAction();

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

  // State
  const [lastSync, setLastSync] = useState('');
  const [isDataSynced, setIsDataSynced] = useState(true);
  const [multiData, setMultiData] = useState<any[]>([]);
  const [dayUserEnd, setDayUserEnd] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasFetchedDashboard, setHasFetchedDashboard] = useState(false);

  /**
   * Load initial dashboard data
   */
  const loadDashboardData = useCallback(async () => {
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

      // Check attendance status
      const currentDate = await getCurrentDate();
      const attendanceData = await getAttendance(currentDate);
      const attendanceOutData = await getAttendance2(currentDate);
      const dayEndData = await getAttendanceEndDay(currentDate);

      setIsAttDone?.(attendanceData.length > 0);
      setIsAttendOut?.(attendanceOutData.length > 0);
      setDayUserEnd(dayEndData);

      // Check sync status
      const notSyncedData = await getTotalOrdersOfOrderMAsternotsync();
      const notSyncedCount = notSyncedData[0]?.TotalCount || 0;
      setIsDataSynced(notSyncedCount === 0);

      // Get multi-division data
      if (isMultiDivision) {
        const distributorData = await getDataDistributorMaster();
        setMultiData(distributorData);
      }
    } catch (error) {
      writeErrorLog('loadDashboardData', error);
      console.error('Error loading dashboard data:', error);
    }
  }, [isMultiDivision, setIsAttDone, setIsAttendOut]);

  /**
   * Fetch dashboard graph data from API
   */
  const fetchDashboardGraphData = useCallback(async (force = false) => {
    // Prevent multiple fetches
    if (hasFetchedDashboard && !force) {
      console.log('Dashboard data already fetched - skipping');
      return;
    }

    if (!isNetConnected && isNetConnected !== null) {
      console.log('Offline - skipping dashboard graph fetch');
      return;
    }

    // Skip if no userId
    if (!userId) {
      console.log('No userId - skipping dashboard graph fetch');
      return;
    }

    try {
      setIsLoading(true);
      setHasFetchedDashboard(true);
      console.log('Fetching dashboard data for userId:', userId);
      const data = await dashGraph({
        UserId: userId,
        UOM: '', // PWA: UOM will be fetched from settings when implemented
      });
      console.log('Dashboard data received:', data ? 'success' : 'empty');

      if (data) {
        // Update redux state with fetched data
        if (data.SalesTrend) {
          setSalesTrend?.(data.SalesTrend);
        }
        if (data.UserDetails && data.UserDetails.length > 0) {
          setUserDetails?.(data.UserDetails[0]);
        }
        if (data.ConsentAPIVersion) {
          setConsentApiVersion?.(data.ConsentAPIVersion);
        }
        if (data.ConsentAppVersion) {
          setConsentAppVersion?.(data.ConsentAppVersion);
        }
      }
    } catch (error) {
      writeErrorLog('fetchDashboardGraphData', error);
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isNetConnected, hasFetchedDashboard, setSalesTrend, setUserDetails, setConsentApiVersion, setConsentAppVersion]);

  // Initial data load - only once when component mounts
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Fetch dashboard data when userId is available
  useEffect(() => {
    if (userId && !hasFetchedDashboard) {
      fetchDashboardGraphData();
    }
  }, [userId, hasFetchedDashboard, fetchDashboardGraphData]);

  // Refresh data when sync flag changes (user initiated sync)
  useEffect(() => {
    if (syncFlag && hasFetchedDashboard) {
      setHasFetchedDashboard(false);
    }
  }, [syncFlag]);

  /**
   * Handle manual sync
   */
  const handleSync = useCallback(async () => {
    if (!isNetConnected && isNetConnected !== null) {
      alert('No internet connection. Please connect to the internet to sync.');
      return;
    }

    setIsLoading(true);
    try {
      // Trigger sync flag update
      setSyncFlag?.(!syncFlag);
      localStorage.setItem('lastSync', moment().format('DD-MMM-YYYY HH:mm'));
      setLastSync(moment().format('DD-MMM-YYYY HH:mm'));
      alert('Sync completed successfully');
    } catch (error) {
      writeErrorLog('handleSync', error);
      alert('Sync failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isNetConnected, syncFlag, setSyncFlag]);

  const onDDItemChange = (selectedValue: any) => {
    setSelectedDivision?.(selectedValue);
  };

  const handleLogout = () => {
    setIsLogin?.(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/login', {replace: true});
  };

  // Navigation items for ToggleNavBar
  const navigationItems = [
    {
      id: 'home',
      icon: 'layout',
      label: 'Home',
      component: <TeamPerformanceReport />,
    },
    {
      id: 'my_perf_rep',
      icon: 'bar-chart-2',
      label: 'Performance Report',
      component: <ReportCard />,
    },
  ];

  // Sidebar menu items
  const menuItems = [
    {icon: FiHome, label: 'Dashboard', path: '/dashboard'},
    {icon: FiShoppingBag, label: 'Shops', path: '/shops'},
    {icon: FiFileText, label: 'Orders', path: '/orders'},
    {icon: FiUsers, label: 'Collections', path: '/collections'},
    {icon: FiBarChart2, label: 'Reports', path: '/reports'},
    {icon: FiSettings, label: 'Settings', path: '/settings'},
  ];

  const navigateTo = (path: string) => {
    setIsSidebarOpen(false);
    navigate(path);
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#F5F5F5',
  };

  const sidebarOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isSidebarOpen ? 0 : '-280px',
    width: 280,
    height: '100vh',
    backgroundColor: Colors.mainBackground,
    zIndex: 999,
    transition: 'left 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  };

  const sidebarHeaderStyle: React.CSSProperties = {
    padding: 20,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  };

  const sidebarLogoStyle: React.CSSProperties = {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  };

  const sidebarUserNameStyle: React.CSSProperties = {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  };

  const sidebarUserRoleStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  };

  const sidebarNavStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 0',
  };

  const sidebarNavItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '15px 20px',
    color: 'white',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 16,
  };

  const sidebarNavIconStyle: React.CSSProperties = {
    marginRight: 15,
  };

  const sidebarFooterStyle: React.CSSProperties = {
    padding: 20,
    borderTop: '1px solid rgba(255,255,255,0.1)',
  };

  const sidebarLogoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    padding: 0,
    marginBottom: 15,
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
      <Loader visible={isLoading} />

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          style={sidebarOverlayStyle}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>
          <img
            src="/icons/icon-72x72.png"
            alt="Logo"
            style={sidebarLogoStyle}
          />
          <p style={sidebarUserNameStyle}>{userName || 'User'}</p>
          <p style={sidebarUserRoleStyle}>Sales Executive</p>
        </div>

        <nav style={sidebarNavStyle}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              style={sidebarNavItemStyle}
              onClick={() => navigateTo(item.path)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <item.icon size={20} style={sidebarNavIconStyle} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={sidebarFooterStyle}>
          <button style={sidebarLogoutStyle} onClick={handleSync}>
            <FiRefreshCw size={20} style={sidebarNavIconStyle} />
            <span>Sync Now</span>
          </button>
          <button style={{...sidebarLogoutStyle, marginBottom: 0}} onClick={handleLogout}>
            <FiLogOut size={20} style={sidebarNavIconStyle} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

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
              label="Distributor"
              placeHolder="Select Distributor"
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
