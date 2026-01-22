import React from 'react';
import {useNavigate} from 'react-router-dom';
import {
  FiTarget,
  FiBarChart2,
  FiTag,
  FiAlertCircle,
  FiPackage,
  FiMapPin,
  FiDollarSign,
} from 'react-icons/fi';

import {useGlobleAction} from '../../../redux/actionHooks/useGlobalAction';
import {useNetInfo} from '../../../hooks/useNetInfo';
import {Colors} from '../../../theme/colors';
import {isAccessControlProvided} from '../../../utility/utils';
import {CustomSafeView} from '../../../components';
import {AccessControlKeyConstants} from '../../../constants/screenConstants';

// Web equivalent of responsive screen utilities
const hp = (percentage: number) => `${percentage}vh`;

// Report categories matching RN app with navigation routes
const ReportCategories = [
  {
    name: 'Target vs Achievement',
    subtitle: 'Achievement against set target',
    icon: FiTarget,
    iconColor: '#3498DB',
    accessKeyValue: AccessControlKeyConstants.DASHBOARD_PERFORMANCE_TVA,
    route: '/reports/target-achievement?type=1',
    commandType: '1',
  },
  {
    name: 'WOD Performance',
    subtitle: 'Brand wise sale with bill cut and width of distribution',
    icon: FiBarChart2,
    iconColor: '#2ECC71',
    accessKeyValue: AccessControlKeyConstants.DASHBOARD_PERFORMANCE_WOD,
    route: '/reports/target-achievement?type=2',
    commandType: '2',
  },
  {
    name: 'Brand-Wise Sales',
    subtitle: 'Width of Distribution',
    icon: FiTag,
    iconColor: '#E74C3C',
    accessKeyValue: AccessControlKeyConstants.DASHBOARD_PERFORMANCE_BWS,
    route: '/reports/brand-wise-sales',
    commandType: '6',
  },
  {
    name: 'Un-Billed Outlets',
    subtitle: 'Outlets Not Billed for last 3 months',
    icon: FiAlertCircle,
    iconColor: '#E67E22',
    accessKeyValue: AccessControlKeyConstants.DASHBOARD_PERFORMANCE_UBO,
    route: '/reports/negative-shop?type=3',
    commandType: '3',
  },
  {
    name: 'Un-Billed Products',
    subtitle: 'Products Not Billed for last 3 months',
    icon: FiPackage,
    iconColor: '#9B59B6',
    accessKeyValue: AccessControlKeyConstants.DASHBOARD_PERFORMANCE_UBP,
    route: '/reports/negative-shop?type=4',
    commandType: '4',
  },
  {
    name: 'Not Visited Outlets',
    subtitle: 'Outlets not visited in last 3 months',
    icon: FiMapPin,
    iconColor: '#1ABC9C',
    accessKeyValue: AccessControlKeyConstants.DASHBOARD_PERFORMANCE_NVO,
    route: '/reports/negative-shop?type=5',
    commandType: '5',
  },
  {
    name: 'Outstanding Age Report',
    subtitle: 'View outstanding age report',
    icon: FiDollarSign,
    iconColor: '#F1C40F',
    accessKeyValue: AccessControlKeyConstants.DASHBOARD_PERFORMANCE_OAR,
    route: '/reports/outstanding-age',
    commandType: '7',
  },
];

const ReportCard = () => {
  const navigate = useNavigate();
  const {isNetConnected} = useNetInfo();
  const {getAccessControlSettings} = useGlobleAction();

  const handleCategoryClick = (category: (typeof ReportCategories)[0]) => {
    if (isNetConnected === true || isNetConnected === null) {
      // Pass source tab so we can navigate back to the correct tab
      navigate(category.route, {state: {fromTab: 'my_perf_rep'}});
    } else {
      alert('No internet connection. Please connect to the internet for live updates.');
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
    minHeight: '100%',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Proxima Nova, sans-serif',
    color: Colors.richCharcoal,
    marginTop: -10,
  };

  const gridStyle: React.CSSProperties = {
    flexGrow: 1,
  };

  const itemStyle: React.CSSProperties = {
    width: '100%',
    minHeight: hp(13),
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 15,
    padding: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    border: `0.6px solid ${Colors.FABColor}`,
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const cardContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 20,
  };

  const rowContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };

  const textContainerStyle: React.CSSProperties = {
    flex: 1,
    marginLeft: 25,
  };

  const itemNameStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: Colors.richCharcoal,
    marginTop: 4,
    marginBottom: 4,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const itemSubtitleStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#7F8C8D',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  return (
    <CustomSafeView isScrollView={true}>
      <div style={containerStyle}>
        <span style={titleStyle}>Select Report Category</span>
        <div style={gridStyle}>
          {ReportCategories.map((category, index) => {
            const IconComponent = category.icon;
            const hasAccess = isAccessControlProvided(
              getAccessControlSettings,
              category.accessKeyValue,
            );

            if (!hasAccess) return null;

            return (
              <div
                key={index}
                style={itemStyle}
                onClick={() => handleCategoryClick(category)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                }}>
                <div style={cardContentStyle}>
                  <div style={rowContainerStyle}>
                    <IconComponent size={50} color={category.iconColor} />
                    <div style={textContainerStyle}>
                      <span style={itemNameStyle}>{category.name}</span>
                      <span style={itemSubtitleStyle}>{category.subtitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{paddingBottom: 60}} />
        </div>
      </div>
    </CustomSafeView>
  );
};

export default ReportCard;
