import React, {useEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';
import {FiChevronDown, FiChevronUp, FiPhone, FiShare2} from 'react-icons/fi';

import {Loader} from '../../components';
import ReportHeader from '../../components/ReportHeader/ReportHeader';
import {DistStatusAPI} from '../../api/ReportsAPICalls';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {useNetInfo} from '../../hooks/useNetInfo';
import {Colors} from '../../theme/colors';

interface DistStatusItem {
  Distributor: string;
  Area: string;
  LastUploadDate: string;
  LastInvoiceDate: string;
  ContactNumber: string;
  Day1: string;
  Day2: string;
  Day3: string;
  Day4: string;
  Day5: string;
  Day6: string;
  Day7: string;
}

interface DistStatusDetails {
  NoOfDistributors: string;
  UploadPerMonthly: string;
}

interface DistStatusData {
  Success: boolean;
  DistStatus: DistStatusItem[];
  Details: DistStatusDetails[];
}

const DistributorDataStatus: React.FC = () => {
  const navigate = useNavigate();
  const {userId} = useLoginAction();
  const {isNetConnected} = useNetInfo();

  const [data, setData] = useState<DistStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openItems, setOpenItems] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    if (isNetConnected === false) {
      alert('No internet connection available');
      return;
    }

    const payload = {
      DistDataStatusReport: [
        {
          UserID: userId,
          SortBy: '1',
        },
      ],
    };

    setIsLoading(true);
    try {
      const resp = await DistStatusAPI(payload);
      setData(resp);
    } catch (error: any) {
      console.error('Error fetching distributor status:', error);
      alert(error.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isNetConnected]);

  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((i) => i !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const openPhoneDialer = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const getUploadStatus = (dayValue: string): boolean => {
    const status = dayValue.split(':')[1];
    return status === '1' || status === 'true';
  };

  const getDateFromDay = (dayValue: string): string => {
    return dayValue.split(':')[0];
  };

  const generateAndSharePDF = async () => {
    if (!data?.Success || !data.DistStatus?.length) return;

    const reportGeneratedOn = moment().format('DD-MMM-YYYY [at] HH:mm:ss');

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2, h3 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .report-generated { text-align: right; font-size: 10px; color: #555; }
          </style>
        </head>
        <body>
          <div class="report-generated">Report generated on ${reportGeneratedOn}</div>
          <h2>Distributor Status Report</h2>
          <h3>Distributor: ${data.DistStatus[0]?.Distributor || 'N/A'}</h3>
          <table>
            <tr><th>No. of Distributors</th><th>Upload % Monthly</th></tr>
            <tr><td>${data.Details?.[0]?.NoOfDistributors || '-'}</td><td>${data.Details?.[0]?.UploadPerMonthly || '-'}%</td></tr>
          </table>
          <table>
            <tr><th>Date</th><th>Upload Status</th></tr>
            ${data.DistStatus.map((status) => `
              <tr><td>${getDateFromDay(status.Day1)}</td><td>${getUploadStatus(status.Day1) ? 'Yes' : 'No'}</td></tr>
              <tr><td>${getDateFromDay(status.Day2)}</td><td>${getUploadStatus(status.Day2) ? 'Yes' : 'No'}</td></tr>
              <tr><td>${getDateFromDay(status.Day3)}</td><td>${getUploadStatus(status.Day3) ? 'Yes' : 'No'}</td></tr>
              <tr><td>${getDateFromDay(status.Day4)}</td><td>${getUploadStatus(status.Day4) ? 'Yes' : 'No'}</td></tr>
              <tr><td>${getDateFromDay(status.Day5)}</td><td>${getUploadStatus(status.Day5) ? 'Yes' : 'No'}</td></tr>
              <tr><td>${getDateFromDay(status.Day6)}</td><td>${getUploadStatus(status.Day6) ? 'Yes' : 'No'}</td></tr>
              <tr><td>${getDateFromDay(status.Day7)}</td><td>${getUploadStatus(status.Day7) ? 'Yes' : 'No'}</td></tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    // For PWA, we'll open in a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#F5F5F5',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  };

  const summaryContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '16px 0',
    marginBottom: 16,
  };

  const summaryItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const summaryLabelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#362828',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const summaryValueStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#362828',
    fontFamily: 'Proxima Nova, sans-serif',
    marginTop: 4,
  };

  const shareButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
  };

  const distributorNameStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#221818',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const areaStyle: React.CSSProperties = {
    fontSize: 10,
    color: '#221818',
    fontFamily: 'Proxima Nova, sans-serif',
    marginTop: 4,
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: '#E6DFDF',
    margin: '0 16px',
  };

  const cardBodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
  };

  const infoColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#362828',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#796A6A',
    fontFamily: 'Proxima Nova, sans-serif',
    marginTop: 4,
  };

  const callButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
  };

  const expandedContentStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: '#FAFAFA',
  };

  const scheduledTitleStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#796A6A',
    fontFamily: 'Proxima Nova, sans-serif',
    marginBottom: 12,
  };

  const dayRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  };

  const dayDateStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const statusBadgeStyle = (uploaded: boolean): React.CSSProperties => ({
    backgroundColor: uploaded ? '#2FC36E' : '#E23333',
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    padding: '4px 12px',
    borderRadius: 15,
    fontFamily: 'Proxima Nova, sans-serif',
  });

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

  return (
    <div style={containerStyle}>
      <Loader visible={isLoading} />

      <ReportHeader title="Distributor Data Status" onBack={() => navigate(-1)} />

      <div style={contentStyle}>
        {/* Summary Section */}
        {data?.Details?.map((item, index) => (
          <div key={index} style={summaryContainerStyle}>
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>Upload % Monthly</span>
              <span style={summaryValueStyle}>{item.UploadPerMonthly}%</span>
            </div>
            <div style={summaryItemStyle}>
              <span style={summaryLabelStyle}>No. of Distributors</span>
              <span style={summaryValueStyle}>{item.NoOfDistributors}</span>
            </div>
            <button style={shareButtonStyle} onClick={generateAndSharePDF}>
              <FiShare2 size={24} color={Colors.mainBackground} />
            </button>
          </div>
        ))}

        {/* Divider */}
        <div style={{...dividerStyle, margin: '0 0 16px 0'}} />

        {/* Distributor Cards */}
        {data?.DistStatus?.map((item, index) => (
          <div key={index} style={cardStyle}>
            {/* Card Header - Clickable */}
            <div style={cardHeaderStyle} onClick={() => toggleItem(index)}>
              <div>
                <div style={distributorNameStyle}>{item.Distributor}</div>
                <div style={areaStyle}>{item.Area}</div>
              </div>
              {openItems.includes(index) ? (
                <FiChevronUp size={18} color={Colors.black} />
              ) : (
                <FiChevronDown size={18} color={Colors.black} />
              )}
            </div>

            <div style={dividerStyle} />

            {/* Card Body */}
            <div style={cardBodyStyle}>
              <div style={infoColumnStyle}>
                <span style={labelStyle}>Last Uploaded</span>
                <span style={valueStyle}>{item.LastUploadDate}</span>
              </div>
              <div style={infoColumnStyle}>
                <span style={labelStyle}>Last Invoice</span>
                <span style={valueStyle}>{item.LastInvoiceDate}</span>
              </div>
              <button
                style={callButtonStyle}
                onClick={() => openPhoneDialer(item.ContactNumber)}>
                <FiPhone size={20} color={Colors.mainBackground} />
              </button>
            </div>

            {/* Expanded Content */}
            {openItems.includes(index) && (
              <div style={expandedContentStyle}>
                <div style={scheduledTitleStyle}>Scheduled Upload Date</div>
                {[item.Day1, item.Day2, item.Day3, item.Day4, item.Day5, item.Day6, item.Day7].map(
                  (day, dayIndex) => (
                    <div key={dayIndex} style={dayRowStyle}>
                      <span style={dayDateStyle}>{getDateFromDay(day)}</span>
                      <span style={statusBadgeStyle(getUploadStatus(day))}>
                        {getUploadStatus(day) ? 'Yes' : 'No'}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        ))}

        {/* No Data */}
        {!isLoading && (!data?.DistStatus || data.DistStatus.length === 0) && (
          <div style={noDataStyle}>
            <span style={{color: 'white', fontSize: 16}}>No data available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributorDataStatus;
