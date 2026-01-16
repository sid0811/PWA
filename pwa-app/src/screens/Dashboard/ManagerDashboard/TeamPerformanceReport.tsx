import React, {useState, useCallback, useEffect, memo} from 'react';
import moment from 'moment';
import {FiCalendar, FiBarChart2, FiTrendingUp} from 'react-icons/fi';

import {Loader} from '../../../components';
import {useLoginAction} from '../../../redux/actionHooks/useLoginAction';
import {useGlobleAction} from '../../../redux/actionHooks/useGlobalAction';
import {useDashAction} from '../../../redux/actionHooks/useDashAction';
import {useNetInfo} from '../../../hooks/useNetInfo';
import {Colors} from '../../../theme/colors';
import {isAccessControlProvided, writeErrorLog} from '../../../utility/utils';
import {AccessControlKeyConstants} from '../../../constants/screenConstants';
import {getTeamPerfomanceSummary, getTeamActivityReport} from '../../../api/DashboardAPICalls';
import type {PerformanceItem} from '../../../api/DashboardAPICalls';

// Re-export PerformanceItem type
export type {PerformanceItem};

// Memoized Summary Item Component
const SummaryItem = memo(({item}: {item: PerformanceItem}) => {
  const itemContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    borderBottom: '1px solid #E5E7EB',
  };

  const itemContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  };

  const iconContainerStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: item.IconBg || '#E5E7EB',
  };

  const activityTextStyle: React.CSSProperties = {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  };

  const figureTextStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
  };

  return (
    <div style={itemContainerStyle}>
      <div style={itemContentStyle}>
        <div style={iconContainerStyle}>
          <FiBarChart2 size={20} color={item.IconColor || '#374151'} />
        </div>
        <span style={activityTextStyle}>{item.Activity}</span>
      </div>
      <span style={figureTextStyle}>{item.Figure}</span>
    </div>
  );
});

// Header Component
const Header = memo(
  ({
    selectedDate,
    onCalendarOpen,
    isTeamReport,
    onSwitchChange,
    isParentUser,
  }: {
    selectedDate: string;
    onCalendarOpen: () => void;
    isTeamReport: boolean;
    onSwitchChange: (value: boolean) => void;
    isParentUser: boolean;
  }) => {
    const headerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottom: '1px solid #E5E7EB',
    };

    const headerLeftStyle: React.CSSProperties = {
      flex: 1,
    };

    const titleRowStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    };

    const headerTitleStyle: React.CSSProperties = {
      fontSize: 20,
      fontWeight: 600,
      color: '#111827',
      flex: 1,
      marginRight: 8,
    };

    const dateContainerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      padding: '4px 8px',
      borderRadius: 16,
      alignSelf: 'flex-start',
      cursor: 'pointer',
      border: 'none',
    };

    const dateTextStyle: React.CSSProperties = {
      fontSize: 12,
      color: '#4B5563',
      marginLeft: 4,
    };

    const switchContainerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    };

    const switchButtonStyle: React.CSSProperties = {
      padding: '4px 12px',
      borderRadius: 16,
      border: 'none',
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 500,
    };

    return (
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <div style={titleRowStyle}>
            <span style={headerTitleStyle}>
              {isParentUser && isTeamReport
                ? 'Team Summary'
                : 'My Activity Summary'}
            </span>
            {isParentUser && (
              <div style={switchContainerStyle}>
                <button
                  style={{
                    ...switchButtonStyle,
                    backgroundColor: isTeamReport ? Colors.mainBackground : '#E5E7EB',
                    color: isTeamReport ? 'white' : '#374151',
                  }}
                  onClick={() => onSwitchChange(true)}
                >
                  Team
                </button>
                <button
                  style={{
                    ...switchButtonStyle,
                    backgroundColor: !isTeamReport ? Colors.mainBackground : '#E5E7EB',
                    color: !isTeamReport ? 'white' : '#374151',
                  }}
                  onClick={() => onSwitchChange(false)}
                >
                  Individual
                </button>
              </div>
            )}
          </div>
          <button style={dateContainerStyle} onClick={onCalendarOpen}>
            <FiCalendar size={16} color={Colors.black} />
            <span style={dateTextStyle}>{selectedDate}</span>
          </button>
        </div>
      </div>
    );
  },
);

const TeamPerformanceReport = () => {
  const {isNetConnected} = useNetInfo();
  const {userId} = useLoginAction();
  const {isParentUser, syncFlag, getAccessControlSettings} = useGlobleAction();
  const {SalesTrend, cachedTeamSummary, setCachedTeamSummaryData} = useDashAction();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment().format('DD MMM YYYY'),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isTeamReport, setIsTeamReport] = useState(true);
  const [summaryData, setSummaryData] = useState<PerformanceItem[]>([]);
  const [showingCachedData, setShowingCachedData] = useState(false);
  const [_isPerformanceReportShown, setIsPerformanceReportShown] = useState(false);

  const MIN_DATE = moment().subtract(90, 'days');

  /**
   * Fetch team performance summary from API
   */
  const fetchTeamSummary = useCallback(async () => {
    if (isNetConnected === true || isNetConnected === null) {
      setShowingCachedData(false);
      setIsPerformanceReportShown(false);
      setIsLoading(true);
      try {
        const data = await getTeamPerfomanceSummary(
          userId,
          selectedDate,
          isTeamReport ? 1 : 0,
        );

        if (data && Array.isArray(data)) {
          setSummaryData([...data]);
          // Cache the new data
          setCachedTeamSummaryData?.({
            data: [...data],
            timestamp: new Date().toISOString(),
            isTeamReport,
            date: selectedDate,
          });
        } else {
          // Show empty state
          setSummaryData([]);
        }
      } catch (error) {
        writeErrorLog('fetchTeamSummary', error);
        console.error('Error fetching team summary:', error);
        // Try to use cached data
        handleOfflineMode();
      } finally {
        setIsLoading(false);
      }
    } else {
      // Use cached data if available
      handleOfflineMode();
    }
  }, [userId, selectedDate, isTeamReport, isNetConnected, syncFlag]);

  /**
   * Handle offline mode - use cached data
   */
  const handleOfflineMode = () => {
    setIsLoading(false);
    if (cachedTeamSummary) {
      setSummaryData(cachedTeamSummary.data);
      setShowingCachedData(true);
    } else {
      setSummaryData([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTeamSummary();
    }
  }, [fetchTeamSummary, selectedDate, isTeamReport, userId]);

  /**
   * Toggle detailed performance view
   */
  const togglePerformanceReport = useCallback(async () => {
    if (!isNetConnected && isNetConnected !== null) {
      alert('No internet connection available');
      return;
    }

    try {
      setIsLoading(true);
      const data = await getTeamActivityReport({
        ParentUserID: userId,
        Date: moment(selectedDate, 'DD MMM YYYY').format('DD-MM-YYYY'),
        CommandType: '1',
        UserID: isTeamReport ? '0' : userId,
        CollectionType: '0',
      });

      if (data && Array.isArray(data)) {
        setIsPerformanceReportShown(true);
        console.log('Team activity data:', data);
        // TODO: Show detailed performance modal/view
        if (data.length === 0) {
          alert('No detailed data found for this date');
        } else {
          alert(`Found ${data.length} activity records. Detailed view coming soon.`);
        }
      }
    } catch (error) {
      writeErrorLog('togglePerformanceReport', error);
      console.error('Failed to fetch team activity report:', error);
      alert('Failed to load detailed performance data');
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedDate, isTeamReport, isNetConnected]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (date) {
      setSelectedDate(moment(date).format('DD MMM YYYY'));
    }
    setIsCalendarOpen(false);
  }, []);

  const handleSwitchChange = useCallback((value: boolean) => {
    setIsTeamReport(value);
    setSummaryData([]); // Clear existing data
    setIsPerformanceReportShown(false);
  }, []);

  // Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    margin: 16,
    marginTop: 8,
  };

  const contentStyle: React.CSSProperties = {
    padding: 16,
    paddingTop: 4,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: Colors.lightGreenNext,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '14px',
    borderRadius: 8,
    marginTop: 16,
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  };

  const buttonTextStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
    marginLeft: 10,
  };

  const trendCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: '0 16px 10px 16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const trendHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  };

  const trendTitleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: Colors.richCharcoal,
    marginLeft: 12,
  };

  const noDataStyle: React.CSSProperties = {
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  };

  const cachedBannerStyle: React.CSSProperties = {
    backgroundColor: '#EF4444',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  };

  const cachedTextStyle: React.CSSProperties = {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  };

  const TrendReport = memo(() => (
    <div style={trendCardStyle}>
      <div style={trendHeaderStyle}>
        <FiTrendingUp size={34} color="#14B8A6" />
        <span style={trendTitleStyle}>Sales Trend Report</span>
      </div>
      {SalesTrend && SalesTrend.length > 0 ? (
        <div style={{height: 179, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span>Chart will be rendered here</span>
        </div>
      ) : (
        <div style={noDataStyle}>
          <span>No data available</span>
        </div>
      )}
    </div>
  ));

  return (
    <>
      <Loader visible={isLoading} />

      {isAccessControlProvided(
        getAccessControlSettings,
        AccessControlKeyConstants.DASHBOARD_PERFORMANCE_STR,
      ) && <TrendReport />}

      <div style={containerStyle}>
        <Header
          selectedDate={selectedDate}
          onCalendarOpen={() => setIsCalendarOpen(!isCalendarOpen)}
          isTeamReport={isTeamReport}
          onSwitchChange={handleSwitchChange}
          isParentUser={isParentUser || false}
        />

        {isCalendarOpen && (
          <div style={{padding: '0 16px'}}>
            <input
              type="date"
              onChange={handleDateChange}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                border: '1px solid #ddd',
              }}
              max={moment().format('YYYY-MM-DD')}
              min={MIN_DATE.format('YYYY-MM-DD')}
            />
          </div>
        )}

        <div style={contentStyle}>
          {showingCachedData && (
            <div style={cachedBannerStyle}>
              <span style={cachedTextStyle}>
                Displaying cached data from: {cachedTeamSummary?.date}
              </span>
            </div>
          )}

          {summaryData.length > 0 ? (
            summaryData.map((item, index) => (
              <SummaryItem key={index} item={item} />
            ))
          ) : !isLoading ? (
            <div style={noDataStyle}>
              <span>No summary data available</span>
            </div>
          ) : null}

          <button
            style={buttonStyle}
            onClick={togglePerformanceReport}
          >
            <FiBarChart2 size={20} color="white" />
            <span style={buttonTextStyle}>View Detailed Performance</span>
          </button>
        </div>
      </div>

      <div style={{paddingBottom: 200}} />
    </>
  );
};

export default memo(TeamPerformanceReport);
