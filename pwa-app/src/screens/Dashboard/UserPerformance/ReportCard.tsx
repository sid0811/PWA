import React from 'react';
import {
  FiTrendingUp,
  FiTarget,
  FiBarChart2,
  FiMinusCircle,
  FiAlertCircle,
  FiClock,
  FiDollarSign,
} from 'react-icons/fi';

import {useGlobleAction} from '../../../redux/actionHooks/useGlobalAction';
import {useNetInfo} from '../../../hooks/useNetInfo';
import {Colors} from '../../../theme/colors';
import {isAccessControlProvided} from '../../../utility/utils';
import {CustomSafeView} from '../../../components';

// Web equivalent of responsive screen utilities
const hp = (percentage: number) => `${percentage}vh`;

// Report categories matching RN app
const ReportCategories = [
  {
    name: 'Target Vs Achievement',
    subtitle: 'View target vs achievement',
    icon: FiTarget,
    iconColor: '#E74C3C',
    accessKeyValue: 'DASHBOARD_TGT_VS_ACHI_REPORT',
  },
  {
    name: 'Target Vs Achievement Without Date',
    subtitle: 'View target vs achievement without date filter',
    icon: FiTrendingUp,
    iconColor: '#3498DB',
    accessKeyValue: 'DASHBOARD_TGT_VS_ACHI_WODATE_REPORT',
  },
  {
    name: 'Brand Wise Sales',
    subtitle: 'View brand wise sales data',
    icon: FiBarChart2,
    iconColor: '#2ECC71',
    accessKeyValue: 'DASHBOARD_BWS_REPORT',
  },
  {
    name: 'Negative Shop',
    subtitle: 'View shops with negative performance',
    icon: FiMinusCircle,
    iconColor: '#9B59B6',
    accessKeyValue: 'DASHBOARD_NEGATIVE_SHOP_REPORT',
  },
  {
    name: 'Zero Billing Shop',
    subtitle: 'View shops with zero billing',
    icon: FiAlertCircle,
    iconColor: '#E67E22',
    accessKeyValue: 'DASHBOARD_ZERO_BILLING_SHOP_REPORT',
  },
  {
    name: 'Non Billing Shop',
    subtitle: 'View non billing shops',
    icon: FiClock,
    iconColor: '#1ABC9C',
    accessKeyValue: 'DASHBOARD_NON_BILLING_SHOP_REPORT',
  },
  {
    name: 'Outstanding Age Report',
    subtitle: 'View outstanding age report',
    icon: FiDollarSign,
    iconColor: '#F1C40F',
    accessKeyValue: 'DASHBOARD_OUTSTANDING_AGE_REPORT',
  },
];

const ReportCard = () => {
  const {isNetConnected} = useNetInfo();
  const {getAccessControlSettings} = useGlobleAction();

  const toggleCategory = (category: string) => {
    if (isNetConnected === true || isNetConnected === null) {
      console.log('Navigate to report:', category);
      // PWA: Will implement navigation to specific report screens
      alert(`Report: ${category}\nThis feature will be implemented soon.`);
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
                onClick={() => toggleCategory(category.name)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                }}
              >
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
