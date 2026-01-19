import React, {useEffect, useState, useCallback} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {FiPackage, FiMapPin} from 'react-icons/fi';

import {Loader} from '../../components';
import ReportHeader from '../../components/ReportHeader/ReportHeader';
import {userPerformanceReport} from '../../api/DashboardAPICalls';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {useNetInfo} from '../../hooks/useNetInfo';
import {Colors} from '../../theme/colors';

// Types
interface OutletData {
  Outlet?: string;
  Item?: string;
  Area?: string;
  Route?: string;
  LastInvDate?: string;
}

// Report config based on CommandType
const ReportConfig = {
  '3': {
    title: 'Un-Billed Outlets',
    dataKey: 'Unbilled_Outlets',
    searchPlaceholder: 'Search Outlet...',
    countLabel: 'Un-Billed Outlets',
    showArea: true,
    showRoute: false,
    showLastInv: true,
    isProduct: false,
  },
  '4': {
    title: 'Un-Billed Products',
    dataKey: 'Unbilled_Items',
    searchPlaceholder: 'Search Product...',
    countLabel: 'Un-Billed Products',
    showArea: false,
    showRoute: false,
    showLastInv: true,
    isProduct: true,
  },
  '5': {
    title: 'Not Visited Outlets',
    dataKey: 'Not_Visited_Outlets',
    searchPlaceholder: 'Search Outlet...',
    countLabel: 'Not Visited Outlets',
    showArea: true,
    showRoute: true,
    showLastInv: false,
    isProduct: false,
  },
};

const NegativeShopReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const commandType = searchParams.get('type') || '3';

  const {isNetConnected} = useNetInfo();
  const {userId} = useLoginAction();

  const [data, setData] = useState<OutletData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const config = ReportConfig[commandType as keyof typeof ReportConfig] || ReportConfig['3'];

  const fetchData = useCallback(async () => {
    if (!userId) return;
    if (isNetConnected === false) {
      alert('No internet connection available');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userPerformanceReport(userId, commandType, '');
      setData(response?.[config.dataKey] || []);
    } catch (error: any) {
      console.error('Error fetching report:', error);
      alert(error.message || 'An error occurred while fetching the report');
    } finally {
      setIsLoading(false);
    }
  }, [userId, commandType, isNetConnected, config.dataKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data by search
  const filteredData = data.filter((item) => {
    const searchField = config.isProduct ? item.Item : item.Outlet;
    return searchField?.toLowerCase().includes(searchText.toLowerCase());
  });

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#F5F5F5',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  };

  const infoContainerStyle: React.CSSProperties = {
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.richCharcoal,
    marginBottom: 8,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const detailRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 4,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    color: Colors.darkGray,
    fontFamily: 'Proxima Nova, sans-serif',
    minWidth: 80,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 13,
    color: Colors.black,
    fontFamily: 'Proxima Nova, sans-serif',
    flex: 1,
  };

  const noDataStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fc5c65',
    padding: '16px 32px',
    borderRadius: 8,
    margin: '20px auto',
    width: 'fit-content',
  };

  const noDataTextStyle: React.CSSProperties = {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  return (
    <div style={containerStyle}>
      <Loader visible={isLoading} />

      <ReportHeader
        title={config.title}
        onBack={() => navigate(-1)}
        showSearch={true}
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder={config.searchPlaceholder}
        dataCount={filteredData.length}
        countLabel={config.countLabel}
      />

      <div style={contentStyle}>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} style={cardStyle}>
              <div style={iconContainerStyle}>
                {config.isProduct ? (
                  <FiPackage size={24} color={Colors.primary} />
                ) : (
                  <FiMapPin size={24} color={Colors.primary} />
                )}
              </div>
              <div style={infoContainerStyle}>
                <div style={titleStyle}>{item.Outlet || item.Item || '-'}</div>

                {config.showArea && item.Area && (
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Area:</span>
                    <span style={valueStyle}>{item.Area}</span>
                  </div>
                )}

                {config.showRoute && item.Route && (
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Route:</span>
                    <span style={valueStyle}>{item.Route}</span>
                  </div>
                )}

                {config.showLastInv && item.LastInvDate && (
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Last Invoice:</span>
                    <span style={valueStyle}>{item.LastInvDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : !isLoading ? (
          <div style={noDataStyle}>
            <span style={noDataTextStyle}>No data available</span>
          </div>
        ) : null}

        <div style={{paddingBottom: 100}} />
      </div>
    </div>
  );
};

export default NegativeShopReport;
