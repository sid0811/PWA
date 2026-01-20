import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  FiTrendingUp,
  FiTarget,
  FiUploadCloud,
  FiMapPin,
  FiActivity,
  FiBarChart,
  FiNavigation,
  FiMap,
} from 'react-icons/fi';

import {Loader} from '../../components';
import {useGlobleAction} from '../../redux/actionHooks/useGlobalAction';
import {isAccessControlProvided} from '../../utility/utils';
import {AccessControlKeyConstants} from '../../constants/screenConstants';
import {Colors} from '../../theme/colors';
import {
  getClassificationfromDBReport1,
  getClassificationfromDBReport2,
} from '../../database/SqlDatabase';

interface ReportItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  duration: string;
  route: string;
  accessKeyValue: string;
  isActive?: boolean;
}

const MyReportList: React.FC = () => {
  const navigate = useNavigate();
  const {getAccessControlSettings} = useGlobleAction();

  const [isLoading, setIsLoading] = useState(true);
  const [report1Data, setReport1Data] = useState<any[]>([]);
  const [report2Data, setReport2Data] = useState<any[]>([]);

  useEffect(() => {
    loadReportConfigs();
  }, []);

  const loadReportConfigs = async () => {
    try {
      setIsLoading(true);
      const [rep1, rep2] = await Promise.all([
        getClassificationfromDBReport1().catch(() => []),
        getClassificationfromDBReport2().catch(() => []),
      ]);
      setReport1Data(rep1 || []);
      setReport2Data(rep2 || []);
    } catch (error) {
      console.error('Error loading report configs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Static report items (from MyReportListData in RN)
  const staticReports: ReportItem[] = [
    {
      id: 'distributor-data',
      icon: <FiUploadCloud size={28} color={Colors.mainBackground} />,
      title: 'Distributor Data Upload',
      duration: 'Last 7 days',
      route: '/reports/distributor-data-status',
      accessKeyValue: AccessControlKeyConstants.REPORT_DISTRIBUTOR_DATA_UPLOAD,
    },
    {
      id: 'outlet-visit',
      icon: <FiMapPin size={28} color={Colors.mainBackground} />,
      title: 'Outlet Visit Report',
      duration: 'Last 30 days',
      route: '/reports/outlet-visit',
      accessKeyValue: AccessControlKeyConstants.REPORT_OUTLET_VISIT_REPORTS,
    },
    {
      id: 'my-activity',
      icon: <FiActivity size={28} color={Colors.mainBackground} />,
      title: 'My Activity Report',
      duration: 'Last 3 days',
      route: '/reports/my-activity',
      accessKeyValue: AccessControlKeyConstants.REPORT_OUTLET_MYACTIVITY_PARTYLIST,
    },
    {
      id: 'outlet-performance',
      icon: <FiBarChart size={28} color={Colors.mainBackground} />,
      title: 'Outlet Performance Report',
      duration: '',
      route: '/reports/outlet-performance',
      accessKeyValue: AccessControlKeyConstants.REPORT_OUTLET_PERFORMANCE_REPORT,
    },
    {
      id: 'visit-based-map',
      icon: <FiNavigation size={28} color={Colors.mainBackground} />,
      title: 'Visit Based MapView',
      duration: '',
      route: '/reports/visit-based-map',
      accessKeyValue: AccessControlKeyConstants.REPORT_VISIT_BASED_MAPVIEW,
    },
    {
      id: 'live-location-map',
      icon: <FiMap size={28} color={Colors.mainBackground} />,
      title: 'Live Location MapView',
      duration: '',
      route: '/reports/live-location-map',
      accessKeyValue: AccessControlKeyConstants.REPORT_LIVE_LOCATION_MAPVIEW,
    },
  ];

  const handleNavigate = (route: string, isActive?: boolean) => {
    if (isActive === false) {
      alert('Please contact your organization to enable this report.');
      return;
    }
    navigate(route);
  };

  const hasAccess = (accessKeyValue: string) => {
    return isAccessControlProvided(getAccessControlSettings, accessKeyValue);
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#F5F5F5',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: Colors.mainBackground,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const backButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    marginRight: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const headerTitleStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px',
    paddingBottom: 100,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: Colors.white,
    borderRadius: 8,
    border: `1px solid ${Colors.border}`,
    marginBottom: 16,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    overflow: 'hidden',
  };

  const cardContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '16px 20px',
  };

  const iconContainerStyle: React.CSSProperties = {
    marginRight: 16,
  };

  const textContainerStyle: React.CSSProperties = {
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.DarkBrown,
    fontFamily: 'Proxima Nova, sans-serif',
    marginBottom: 4,
  };

  const durationBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#F8F4F4',
    borderRadius: 20,
    padding: '6px 12px',
    marginLeft: 'auto',
  };

  const durationTextStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.DarkBrown,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const ReportCard: React.FC<{item: ReportItem}> = ({item}) => (
    <div
      style={cardStyle}
      onClick={() => handleNavigate(item.route, item.isActive)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
      <div style={cardContentStyle}>
        <div style={iconContainerStyle}>{item.icon}</div>
        <div style={textContainerStyle}>
          <div style={titleStyle}>{item.title}</div>
        </div>
        {item.duration && (
          <div style={durationBadgeStyle}>
            <span style={durationTextStyle}>{item.duration}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <Loader visible={isLoading} />

      {/* Header */}
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span style={headerTitleStyle}>Reports</span>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {/* Brand Wise Sales Report (from DB config) */}
        {report1Data.map((item, index) =>
          hasAccess(AccessControlKeyConstants.REPORT_BRAND_WISE_SALES) ? (
            <ReportCard
              key={`brand-${index}`}
              item={{
                id: `brand-wise-${index}`,
                icon: <FiTrendingUp size={28} color={Colors.mainBackground} />,
                title: item.LabelName || 'Brand Wise Sales',
                duration: 'Last 3 Months',
                route: '/reports/brand-wise-sales',
                accessKeyValue: AccessControlKeyConstants.REPORT_BRAND_WISE_SALES,
                isActive: item.IsActive?.trim() === 'True',
              }}
            />
          ) : null,
        )}

        {/* Target vs Achievement Report (from DB config) */}
        {report2Data.map((item, index) =>
          hasAccess(AccessControlKeyConstants.REPORT_TVA) ? (
            <ReportCard
              key={`tva-${index}`}
              item={{
                id: `tva-${index}`,
                icon: <FiTarget size={28} color={Colors.mainBackground} />,
                title: item.LabelName || 'Target vs Achievement',
                duration: 'Monthly',
                route: '/reports/target-achievement',
                accessKeyValue: AccessControlKeyConstants.REPORT_TVA,
                isActive: item.IsActive?.trim() === 'True',
              }}
            />
          ) : null,
        )}

        {/* Static Reports */}
        {staticReports.map((item) =>
          hasAccess(item.accessKeyValue) ? (
            <ReportCard key={item.id} item={item} />
          ) : null,
        )}

        {/* Show message if no reports available */}
        {!isLoading &&
          report1Data.length === 0 &&
          report2Data.length === 0 &&
          staticReports.every((r) => !hasAccess(r.accessKeyValue)) && (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: Colors.TexthintColor,
              }}>
              No reports available for your account.
            </div>
          )}
      </div>
    </div>
  );
};

export default MyReportList;
