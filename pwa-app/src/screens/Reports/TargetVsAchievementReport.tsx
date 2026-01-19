import React, {useEffect, useState, useCallback} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import {Loader} from '../../components';
import ReportHeader from '../../components/ReportHeader/ReportHeader';
import {userPerformanceReport} from '../../api/DashboardAPICalls';
import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {useNetInfo} from '../../hooks/useNetInfo';
import {Colors} from '../../theme/colors';

// Types
interface TargetVsPerformance {
  MTD: string;
  NAME: string;
  YTD: string;
}

interface TransformedData {
  color: string;
  label: string;
  value: number;
}

type DataFrom = 'TvA' | 'WOD';

// Report categories config
const ReportConfig = {
  '1': {
    title: 'Target vs Achievement',
    subtitle: 'Secondary Performance',
    dataKey: 'Target_Vs_Performance',
    type: 'TvA' as DataFrom,
    validNames: ['PLAN', 'ACHIV', 'BTG'],
    colors: ['#003f5c', '#ffa600', '#bc5090'],
  },
  '2': {
    title: 'WOD Performance',
    subtitle: '',
    dataKey: 'WOD_Performance',
    type: 'WOD' as DataFrom,
    validNames: ['Total Outlets', 'Visited', 'Ordered', 'Billed'],
    colors: ['#22a7f0', '#58508d', '#bc5090', '#ffa600'],
  },
};

const TargetVsAchievementReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const commandType = searchParams.get('type') || '1';

  const {isNetConnected} = useNetInfo();
  const {userId} = useLoginAction();

  const [data, setData] = useState<TargetVsPerformance[]>([]);
  const [chartData, setChartData] = useState<{YTD: TransformedData[]; MTD: TransformedData[]}>({
    YTD: [],
    MTD: [],
  });
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'YTD' | 'MTD'>('YTD');
  const [isLoading, setIsLoading] = useState(false);

  const config = ReportConfig[commandType as keyof typeof ReportConfig] || ReportConfig['1'];

  const fetchData = useCallback(async () => {
    if (!userId) return;
    if (isNetConnected === false) {
      alert('No internet connection available');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userPerformanceReport(userId, commandType, '');
      const reportData = response?.[config.dataKey] || [];
      setData(reportData);
      transformDataForChart(reportData);
    } catch (error: any) {
      console.error('Error fetching report:', error);
      alert(error.message || 'An error occurred while fetching the report');
    } finally {
      setIsLoading(false);
    }
  }, [userId, commandType, isNetConnected, config.dataKey]);

  const transformDataForChart = (data: TargetVsPerformance[]) => {
    const result: {YTD: TransformedData[]; MTD: TransformedData[]} = {YTD: [], MTD: []};

    (['YTD', 'MTD'] as const).forEach((timeframe) => {
      let colorIndex = 0;
      data?.forEach((item) => {
        if (config.validNames.includes(item.NAME)) {
          result[timeframe].push({
            color: config.colors[colorIndex % config.colors.length],
            label: item.NAME,
            value: parseFloat(item[timeframe].replace(' %', '')) || 0,
          });
          colorIndex++;
        }
      });
    });

    setChartData(result);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    padding: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '16px 0',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: Colors.white,
    margin: '0 16px',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#333',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
  };

  const cellStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px 10px',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const headerCellStyle: React.CSSProperties = {
    ...cellStyle,
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const nameCellStyle: React.CSSProperties = {
    ...cellStyle,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'left',
  };

  const chartCardStyle: React.CSSProperties = {
    margin: '20px 16px',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
  };

  const timeFrameBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    right: 15,
    top: 10,
    padding: '2px 10px',
    border: `1px solid ${Colors.primary}`,
    borderRadius: 4,
  };

  const timeFrameTextStyle: React.CSSProperties = {
    color: Colors.FABColor,
    fontSize: 12,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const chartContainerStyle: React.CSSProperties = {
    marginTop: 20,
    padding: 16,
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

  // Simple Bar Chart Component
  const BarChart = ({data}: {data: TransformedData[]}) => {
    const maxValue = Math.max(...data.map((d) => d.value), 100);

    return (
      <div style={{padding: '20px 0'}}>
        {data.map((item, index) => (
          <div key={index} style={{marginBottom: 16}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
              <span style={{fontSize: 14, fontWeight: '500', color: Colors.richCharcoal}}>
                {item.label}
              </span>
              <span style={{fontSize: 14, fontWeight: 'bold', color: item.color}}>
                {item.value.toFixed(1)}%
              </span>
            </div>
            <div
              style={{
                height: 24,
                backgroundColor: '#E5E7EB',
                borderRadius: 4,
                overflow: 'hidden',
              }}>
              <div
                style={{
                  height: '100%',
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                  borderRadius: 4,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Simple Donut Chart Component (for TvA)
  const DonutChart = ({data}: {data: TransformedData[]}) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20}}>
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: `conic-gradient(${data
              .map((item, index) => {
                const startPercent = data.slice(0, index).reduce((sum, d) => sum + d.value, 0) / total * 100;
                const endPercent = startPercent + (item.value / total) * 100;
                return `${item.color} ${startPercent}% ${endPercent}%`;
              })
              .join(', ')})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: Colors.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <span style={{fontSize: 16, fontWeight: 'bold', color: Colors.richCharcoal}}>
              {selectedTimeFrame}
            </span>
          </div>
        </div>
        {/* Legend */}
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20, gap: 16}}>
          {data.map((item, index) => (
            <div key={index} style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: item.color,
                }}
              />
              <span style={{fontSize: 14, color: Colors.richCharcoal}}>
                {item.label}: {item.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <Loader visible={isLoading} />

      <ReportHeader title={config.title} onBack={() => navigate(-1)} />

      <div style={contentStyle}>
        {config.subtitle && <div style={subtitleStyle}>{config.subtitle}</div>}

        {data.length > 0 ? (
          <>
            {/* Data Table */}
            <div style={tableContainerStyle}>
              {/* Header */}
              <div style={headerRowStyle}>
                <div style={{...headerCellStyle, textAlign: 'left'}}> </div>
                <div
                  style={{
                    ...headerCellStyle,
                    backgroundColor: selectedTimeFrame === 'YTD' ? Colors.primary : '#333',
                  }}
                  onClick={() => setSelectedTimeFrame('YTD')}>
                  YTD
                </div>
                <div
                  style={{
                    ...headerCellStyle,
                    backgroundColor: selectedTimeFrame === 'MTD' ? Colors.primary : '#333',
                  }}
                  onClick={() => setSelectedTimeFrame('MTD')}>
                  MTD
                </div>
              </div>

              {/* Data Rows */}
              {data.map((item, index) => (
                <div key={index} style={rowStyle}>
                  <div style={nameCellStyle}>{item.NAME}</div>
                  <div style={cellStyle}>{item.YTD}</div>
                  <div style={cellStyle}>{item.MTD}</div>
                </div>
              ))}
            </div>

            {/* Chart Card */}
            <div style={chartCardStyle}>
              <div style={timeFrameBadgeStyle}>
                <span style={timeFrameTextStyle}>{selectedTimeFrame}</span>
              </div>
              <div style={chartContainerStyle}>
                {config.type === 'TvA' ? (
                  <DonutChart data={chartData[selectedTimeFrame]} />
                ) : (
                  <BarChart data={chartData[selectedTimeFrame]} />
                )}
              </div>
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

export default TargetVsAchievementReport;
