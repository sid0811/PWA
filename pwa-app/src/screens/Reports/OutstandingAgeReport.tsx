import React, {useEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import {Loader} from '../../components';
import ReportHeader from '../../components/ReportHeader/ReportHeader';
import {userPerformanceReport} from '../../api/DashboardAPICalls';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {useNetInfo} from '../../hooks/useNetInfo';
import {Colors} from '../../theme/colors';

// Types
interface OutstandingData {
  PARTY: string;
  Slot1: string;
  Slot2: string;
  Slot3: string;
  Slot4: string;
  Total: string;
}

const OutstandingAgeReport: React.FC = () => {
  const navigate = useNavigate();
  const {isNetConnected} = useNetInfo();
  const {userId} = useLoginAction();

  const [data, setData] = useState<OutstandingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [totals, setTotals] = useState<number[]>([0, 0, 0, 0, 0]);

  const headers = ['Party Name', '0-29', '30-59', '60-89', '90+', 'Total'];

  const fetchData = useCallback(async () => {
    if (!userId) return;
    if (isNetConnected === false) {
      alert('No internet connection available');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userPerformanceReport(userId, '7', '');
      const reportData = response?.Outstanding_Report || [];
      setData(reportData);
      calculateTotals(reportData);
    } catch (error: any) {
      console.error('Error fetching report:', error);
      alert(error.message || 'An error occurred while fetching the report');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isNetConnected]);

  const calculateTotals = (data: OutstandingData[]) => {
    const calculatedTotals = data.reduce(
      (acc, item) => {
        acc[0] += parseFloat(item.Slot1) || 0;
        acc[1] += parseFloat(item.Slot2) || 0;
        acc[2] += parseFloat(item.Slot3) || 0;
        acc[3] += parseFloat(item.Slot4) || 0;
        acc[4] += parseFloat(item.Total) || 0;
        return acc;
      },
      [0, 0, 0, 0, 0],
    );
    setTotals(calculatedTotals);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data by search
  const filteredData = data.filter((item) =>
    item.PARTY?.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Format currency
  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '-';
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#F5F5F5',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowX: 'auto',
    overflowY: 'auto',
    padding: '16px',
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: Colors.white,
    borderRadius: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    minWidth: 700,
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    padding: '14px 10px',
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    backgroundColor: Colors.mainBackground,
    fontFamily: 'Proxima Nova, sans-serif',
    whiteSpace: 'nowrap',
  };

  const thFirstStyle: React.CSSProperties = {
    ...thStyle,
    textAlign: 'left',
    paddingLeft: 16,
    minWidth: 200,
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 10px',
    fontSize: 13,
    color: Colors.black,
    textAlign: 'right',
    borderBottom: '1px solid #E5E7EB',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const tdFirstStyle: React.CSSProperties = {
    ...tdStyle,
    textAlign: 'left',
    paddingLeft: 16,
    fontWeight: '500',
  };

  const totalRowStyle: React.CSSProperties = {
    backgroundColor: '#F3F4F6',
  };

  const totalCellStyle: React.CSSProperties = {
    ...tdStyle,
    fontWeight: 'bold',
    color: Colors.richCharcoal,
    borderBottom: 'none',
  };

  const totalFirstCellStyle: React.CSSProperties = {
    ...totalCellStyle,
    textAlign: 'left',
    paddingLeft: 16,
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

  const scrollHintStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.darkGray,
    marginBottom: 8,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  return (
    <div style={containerStyle}>
      <Loader visible={isLoading} />

      <ReportHeader
        title="Outstanding Age Report"
        onBack={() => navigate(-1)}
        showSearch={true}
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search Party..."
        dataCount={filteredData.length}
        countLabel="Parties"
      />

      <div style={contentStyle}>
        {filteredData.length > 0 ? (
          <>
            <div style={scrollHintStyle}>← Scroll horizontally to see all columns →</div>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} style={index === 0 ? thFirstStyle : thStyle}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td style={tdFirstStyle}>{item.PARTY || '-'}</td>
                      <td style={tdStyle}>{formatCurrency(item.Slot1)}</td>
                      <td style={tdStyle}>{formatCurrency(item.Slot2)}</td>
                      <td style={tdStyle}>{formatCurrency(item.Slot3)}</td>
                      <td style={tdStyle}>{formatCurrency(item.Slot4)}</td>
                      <td style={{...tdStyle, fontWeight: 'bold'}}>{formatCurrency(item.Total)}</td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr style={totalRowStyle}>
                    <td style={totalFirstCellStyle}>TOTAL</td>
                    <td style={totalCellStyle}>{formatCurrency(totals[0])}</td>
                    <td style={totalCellStyle}>{formatCurrency(totals[1])}</td>
                    <td style={totalCellStyle}>{formatCurrency(totals[2])}</td>
                    <td style={totalCellStyle}>{formatCurrency(totals[3])}</td>
                    <td style={totalCellStyle}>{formatCurrency(totals[4])}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
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

export default OutstandingAgeReport;
