import React, {useEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';

import {Loader} from '../../components';
import ReportHeader from '../../components/ReportHeader/ReportHeader';
import {userPerformanceReport} from '../../api/DashboardAPICalls';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {useNetInfo} from '../../hooks/useNetInfo';
import {Colors} from '../../theme/colors';

// Types
interface BrandWiseSalesData {
  BrandName: string;
  BillCuts: string;
  Outlets: string;
  Sales: string;
  Value: string;
  ValuePercent: string;
  VolumePercent: string;
  [key: string]: string;
}

const BrandWiseSalesReport: React.FC = () => {
  const navigate = useNavigate();
  const {isNetConnected} = useNetInfo();
  const {userId} = useLoginAction();

  const [data, setData] = useState<BrandWiseSalesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Month headers
  const today = moment();
  const previousMonth = moment().subtract(1, 'month');
  const twoMonthsBack = moment().subtract(2, 'months');

  const monthHeaders = [
    {label: today.format('MMM'), key: 'current'},
    {label: previousMonth.format('MMM'), key: 'prev'},
    {label: twoMonthsBack.format('MMM'), key: 'prev2'},
  ];

  const fetchData = useCallback(async () => {
    if (!userId) return;
    if (isNetConnected === false) {
      alert('No internet connection available');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userPerformanceReport(userId, '6', '');
      setData(response?.Brand_Wise_Sales || []);
    } catch (error: any) {
      console.error('Error fetching report:', error);
      alert(error.message || 'An error occurred while fetching the report');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isNetConnected]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data by search
  const filteredData = data.filter((item) =>
    item.BrandName?.toLowerCase().includes(searchText.toLowerCase()),
  );

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
    marginBottom: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  const cardHeaderStyle: React.CSSProperties = {
    backgroundColor: Colors.mainBackground,
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const brandNameStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const cardBodyStyle: React.CSSProperties = {
    padding: 0,
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: '#F3F4F6',
  };

  const thStyle: React.CSSProperties = {
    padding: '10px 8px',
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.richCharcoal,
    textAlign: 'center',
    borderBottom: '1px solid #E5E7EB',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const tdStyle: React.CSSProperties = {
    padding: '10px 8px',
    fontSize: 13,
    color: Colors.black,
    textAlign: 'center',
    borderBottom: '1px solid #E5E7EB',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const rowLabelStyle: React.CSSProperties = {
    ...tdStyle,
    textAlign: 'left',
    fontWeight: '500',
    backgroundColor: '#FAFAFA',
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

  const rows = [
    {label: 'Bill Cuts', key: 'BillCuts'},
    {label: 'Outlets', key: 'Outlets'},
    {label: 'Sales', key: 'Sales'},
    {label: 'Value', key: 'Value'},
    {label: 'Value %', key: 'ValuePercent'},
    {label: 'Volume %', key: 'VolumePercent'},
  ];

  return (
    <div style={containerStyle}>
      <Loader visible={isLoading} />

      <ReportHeader
        title="Brand Wise Sales"
        onBack={() => navigate(-1)}
        showSearch={true}
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search Brand..."
        dataCount={filteredData.length}
        countLabel="Brands"
      />

      <div style={contentStyle}>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <span style={brandNameStyle}>{item.BrandName || 'Unknown Brand'}</span>
              </div>
              <div style={cardBodyStyle}>
                <table style={tableStyle}>
                  <thead style={tableHeaderStyle}>
                    <tr>
                      <th style={{...thStyle, textAlign: 'left', width: '30%'}}></th>
                      {monthHeaders.map((month, idx) => (
                        <th key={idx} style={thStyle}>
                          {month.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td style={rowLabelStyle}>{row.label}</td>
                        <td style={tdStyle}>{item[`${row.key}_M1`] || item[row.key] || '-'}</td>
                        <td style={tdStyle}>{item[`${row.key}_M2`] || '-'}</td>
                        <td style={tdStyle}>{item[`${row.key}_M3`] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default BrandWiseSalesReport;
