import React from 'react';
import {useNavigate} from 'react-router-dom';
import {
  FiX,
  FiRefreshCw,
  FiMapPin,
  FiTruck,
  FiClipboard,
  FiShoppingCart,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiBarChart2,
  FiFolder,
  FiLogOut,
  FiAlertTriangle,
  FiDatabase,
  FiCheckSquare,
} from 'react-icons/fi';

import {useLoginAction} from '../../redux/actionHooks/useLoginAction';
import {useGlobleAction} from '../../redux/actionHooks/useGlobalAction';
import {useDashAction} from '../../redux/actionHooks/useDashAction';
import {isAccessControlProvided} from '../../utility/utils';
import {AccessControlKeyConstants, VERSION_DETAIL} from '../../constants/screenConstants';
import {Colors} from '../../theme/colors';

interface SidemenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSync?: () => void;
  onRefreshData?: () => void;
}

// Menu items configuration
const getMenuItems = (navigate: ReturnType<typeof useNavigate>, onClose: () => void, onSync?: () => void, onRefreshData?: () => void) => [
  {
    name: 'Sync Now',
    icon: FiRefreshCw,
    action: () => {
      onSync?.();
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_SYNCNOW,
    isDefault: true,
  },
  {
    name: 'Refresh Data',
    icon: FiDatabase,
    action: () => {
      onRefreshData?.();
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_REFRESHDATA,
    isDefault: true,
  },
  {
    name: 'Shops',
    icon: FiMapPin,
    action: () => {
      navigate('/shops');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_SHOPS,
  },
  {
    name: 'POD',
    icon: FiTruck,
    action: () => {
      navigate('/pod');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_POD,
  },
  {
    name: 'Data Collection',
    icon: FiClipboard,
    action: () => {
      navigate('/data-collection');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_DATACOLLECTION,
  },
  {
    name: 'Data Cards',
    icon: FiCheckSquare,
    action: () => {
      navigate('/data-cards');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_DATACARDS,
  },
  {
    name: 'Orders',
    icon: FiShoppingCart,
    action: () => {
      navigate('/orders');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_ORDERS,
  },
  {
    name: 'Activity',
    icon: FiCalendar,
    action: () => {
      navigate('/activity');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_ACTIVITY,
  },
  {
    name: 'Collections',
    icon: FiCreditCard,
    action: () => {
      navigate('/collections');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_COLLECTIONS,
  },
  {
    name: 'Surveys',
    icon: FiFileText,
    action: () => {
      navigate('/surveys');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_SURVEYS,
  },
  {
    name: 'Resources',
    icon: FiFolder,
    action: () => {
      navigate('/resources');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_RESOURCES,
  },
  {
    name: 'Reports',
    icon: FiBarChart2,
    action: () => {
      navigate('/reports');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_REPORTS,
  },
  {
    name: 'Advance Reports',
    icon: FiBarChart2,
    action: () => {
      navigate('/advance-reports');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_ADVANCEREPORTS,
  },
  {
    name: 'Report Error',
    icon: FiAlertTriangle,
    action: () => {
      navigate('/report-error');
      onClose();
    },
    accessKeyValue: AccessControlKeyConstants.SIDE_MENU_REPORTERROR,
    isDefault: true,
  },
];

// Default access values that are always shown
const defaultAccessKeys = [
  AccessControlKeyConstants.SIDE_MENU_SYNCNOW,
  AccessControlKeyConstants.SIDE_MENU_REFRESHDATA,
  AccessControlKeyConstants.SIDE_MENU_LOGOUT,
  AccessControlKeyConstants.SIDE_MENU_REPORTERROR,
];

const Sidemenu: React.FC<SidemenuProps> = ({isOpen, onClose, onSync, onRefreshData}) => {
  const navigate = useNavigate();
  const {enteredUserName} = useLoginAction();
  const {setIsLogin, getAccessControlSettings} = useGlobleAction();
  const {base64} = useDashAction();

  const handleLogout = () => {
    setIsLogin?.(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/login', {replace: true});
    onClose();
  };

  const menuItems = getMenuItems(navigate, onClose, onSync, onRefreshData);

  // Check if user has access to menu item
  const hasAccess = (accessKeyValue: string, isDefault?: boolean) => {
    if (isDefault || defaultAccessKeys.includes(accessKeyValue as any)) {
      return true;
    }
    return isAccessControlProvided(getAccessControlSettings, accessKeyValue);
  };

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : '-300px',
    width: 300,
    height: '100vh',
    backgroundColor: Colors.white,
    zIndex: 999,
    transition: 'left 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: Colors.mainBackground,
    padding: '20px',
    paddingTop: '40px',
    position: 'relative',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 15,
    right: 15,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
  };

  const profileContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  };

  const avatarStyle: React.CSSProperties = {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const avatarImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const userInfoStyle: React.CSSProperties = {
    marginLeft: 16,
    flex: 1,
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const navContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '10px 0',
  };

  const navItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '15px 20px',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const navIconStyle: React.CSSProperties = {
    marginRight: 16,
  };

  const navTextStyle: React.CSSProperties = {
    fontSize: 15,
    color: '#362828',
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: Colors.border,
    margin: '10px 0',
  };

  const footerStyle: React.CSSProperties = {
    borderTop: `1px solid ${Colors.border}`,
    padding: '15px 20px',
  };

  const footerLogoContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  };

  const logoStyle: React.CSSProperties = {
    width: 40,
    height: 45,
    marginRight: 12,
  };

  const brandNameStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.richCharcoal,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const footerLinksStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  };

  const footerLinkStyle: React.CSSProperties = {
    fontSize: 11,
    color: '#362828',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'Montserrat, sans-serif',
  };

  const footerDividerStyle: React.CSSProperties = {
    width: 1,
    height: 12,
    backgroundColor: '#DFE9E0',
  };

  const copyrightStyle: React.CSSProperties = {
    fontSize: 10,
    color: '#868686',
    fontFamily: 'Montserrat, sans-serif',
  };

  const versionStyle: React.CSSProperties = {
    fontSize: 10,
    color: '#868686',
    fontFamily: 'Montserrat, sans-serif',
    marginTop: 4,
  };

  return (
    <>
      {/* Overlay */}
      <div style={overlayStyle} onClick={onClose} />

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <button style={closeButtonStyle} onClick={onClose}>
            <FiX size={24} color={Colors.white} />
          </button>

          <div style={profileContainerStyle}>
            <div style={avatarStyle}>
              {base64 ? (
                <img
                  src={`data:image/png;base64,${base64}`}
                  alt="Profile"
                  style={avatarImageStyle}
                />
              ) : (
                <img
                  src="/icons/icon-72x72.png"
                  alt="Profile"
                  style={avatarImageStyle}
                />
              )}
            </div>
            <div style={userInfoStyle}>
              <span style={userNameStyle}>{enteredUserName || 'User'}</span>
            </div>
          </div>
        </div>

        <div style={dividerStyle} />

        {/* Navigation Items */}
        <nav style={navContainerStyle}>
          {menuItems.map((item, index) => {
            if (!hasAccess(item.accessKeyValue, item.isDefault)) {
              return null;
            }

            return (
              <button
                key={index}
                style={navItemStyle}
                onClick={item.action}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                <item.icon size={22} color={Colors.mainBackground} style={navIconStyle} />
                <span style={navTextStyle}>{item.name}</span>
              </button>
            );
          })}

          {/* Logout */}
          <button
            style={navItemStyle}
            onClick={handleLogout}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F5';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}>
            <FiLogOut size={22} color={Colors.mainBackground} style={navIconStyle} />
            <span style={navTextStyle}>Log Out</span>
          </button>
        </nav>

        {/* Footer */}
        <div style={footerStyle}>
          <div style={footerLogoContainerStyle}>
            <img src="/icons/icon-72x72.png" alt="Logo" style={logoStyle} />
            <span style={brandNameStyle}>Zylemini+</span>
          </div>

          <div style={footerLinksStyle}>
            <button
              style={footerLinkStyle}
              onClick={() => {
                navigate('/privacy');
                onClose();
              }}>
              Privacy Policy
            </button>
            <div style={footerDividerStyle} />
            <button
              style={footerLinkStyle}
              onClick={() => {
                navigate('/security');
                onClose();
              }}>
              Security Notice
            </button>
            <div style={footerDividerStyle} />
            <button
              style={footerLinkStyle}
              onClick={() => {
                navigate('/about');
                onClose();
              }}>
              About
            </button>
          </div>

          <div style={copyrightStyle}>© 2024 Zylem Technologies. All rights reserved.</div>
          <div style={versionStyle}>{VERSION_DETAIL}</div>
        </div>
      </aside>
    </>
  );
};

export default Sidemenu;
