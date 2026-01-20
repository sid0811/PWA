import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FiSearch} from 'react-icons/fi';

import {Loader} from '../../components';
import ReportHeader from '../../components/ReportHeader/ReportHeader';
import {
  getDataForActivity,
  getdatafromcust,
  getdatafromdist,
} from '../../database/SqlDatabase';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {Colors} from '../../theme/colors';

interface CustomerItem {
  date?: string;
  Party: string;
  CustomerId: string;
}

const OutletVisitReports: React.FC = () => {
  const navigate = useNavigate();
  const {userId} = useLoginAction();

  const [customerList, setCustomerList] = useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const activityData = await getDataForActivity();

      if (activityData && Array.isArray(activityData)) {
        const customerPromises = activityData.map(async (item: any) => {
          if (item.entity_type === 1) {
            return getdatafromcust(item.entity_id, userId);
          } else if (item.entity_type === 0) {
            return getdatafromdist(item.entity_id, userId);
          }
          return [];
        });

        const results = await Promise.all(customerPromises);
        const flattenedResults = results.flat().filter(Boolean);
        setCustomerList(flattenedResults);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredList = customerList.filter((item) =>
    item.Party?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  const handleItemClick = (item: CustomerItem) => {
    navigate('/reports/outlet-visit-activity', {
      state: {
        Party: item.Party,
        entity_id: item.CustomerId,
      },
    });
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#F5F5F5',
  };

  const searchContainerStyle: React.CSSProperties = {
    backgroundColor: '#221818',
    padding: '8px 16px 16px',
  };

  const searchInputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    border: '1px solid #E6DFDF',
    padding: '12px 16px',
    gap: 12,
  };

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 14,
    fontFamily: 'Proxima Nova, sans-serif',
    backgroundColor: 'transparent',
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: '#E6DFDF',
    marginTop: 10,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  };

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    border: '1px solid #E6DFDF',
    padding: 16,
    marginBottom: 12,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease',
  };

  const shopIconStyle: React.CSSProperties = {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  };

  const shopDetailsStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const dateTextStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#796A6A',
    fontFamily: 'Proxima Nova, sans-serif',
    marginBottom: 8,
  };

  const partyTextStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#796A6A',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const noDataStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    color: Colors.TexthintColor,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  return (
    <div style={containerStyle}>
      <Loader visible={isLoading} />

      <ReportHeader title="Outlet Visit Report" onBack={() => navigate(-1)} />

      {/* Search Section */}
      <div style={searchContainerStyle}>
        <div style={searchInputContainerStyle}>
          <FiSearch size={22} color="#796A6A" />
          <input
            type="text"
            placeholder="Search Shop"
            style={searchInputStyle}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div style={dividerStyle} />
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {filteredList.map((item, index) => (
          <div
            key={index}
            style={cardStyle}
            onClick={() => handleItemClick(item)}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}>
            <div style={shopIconStyle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 21H21M4 21V8L12 3L20 8V21M9 21V15H15V21"
                  stroke="#796A6A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={shopDetailsStyle}>
              {item.date && <span style={dateTextStyle}>{item.date}</span>}
              <span style={partyTextStyle}>{item.Party}</span>
            </div>
          </div>
        ))}

        {/* No Data */}
        {!isLoading && filteredList.length === 0 && (
          <div style={noDataStyle}>No outlet visit data available</div>
        )}
      </div>
    </div>
  );
};

export default OutletVisitReports;
