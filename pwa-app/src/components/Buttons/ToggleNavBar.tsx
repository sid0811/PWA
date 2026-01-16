import React, {useState, useMemo, useCallback} from 'react';
import * as FeatherIcons from 'react-icons/fi';
import {DEFAULT_TAB_NAMES} from '../../constants/screenConstants';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  component: React.JSX.Element;
}

interface ToggleNavBarProps {
  navItems: NavItem[];
  defaultTab?: string;
}

interface TabButtonProps {
  item: NavItem;
  isActive: boolean;
  onPress: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = React.memo(
  ({item, isActive, onPress}) => {
    // Dynamic icon mapping from Feather icons
    const IconComponent = (FeatherIcons as any)[`Fi${item.icon.charAt(0).toUpperCase() + item.icon.slice(1).replace(/-./g, x => x[1].toUpperCase())}`] || FeatherIcons.FiCircle;

    const tabButtonStyle: React.CSSProperties = {
      flex: 1,
      minHeight: 56,
      margin: '0 4px',
      backgroundColor: isActive ? '#fff' : 'transparent',
      borderRadius: 20,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };

    const tabContentStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '8px',
    };

    const tabLabelStyle: React.CSSProperties = {
      color: '#000',
      fontWeight: 600,
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
    };

    return (
      <button
        style={tabButtonStyle}
        onClick={() => onPress(item.id)}
      >
        <div style={tabContentStyle}>
          <IconComponent size={20} color={isActive ? '#000' : '#fff'} />
          {isActive && (
            <span style={tabLabelStyle}>
              {item.label}
            </span>
          )}
        </div>
      </button>
    );
  }
);

const ToggleNavBar: React.FC<ToggleNavBarProps> = ({
  navItems,
  defaultTab = DEFAULT_TAB_NAMES[0],
}) => {
  const [activeTab, setActiveTab] = useState(() => {
    return navItems.some(item => item.id === defaultTab)
      ? defaultTab
      : navItems[0]?.id || '';
  });

  const handlePress = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const ActiveComponent = useMemo(
    () => navItems.find(item => item.id === activeTab)?.component,
    [navItems, activeTab]
  );

  if (!navItems.length) {
    return null;
  }

  const navBarStyle: React.CSSProperties = {
    backgroundColor: '#382928',
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-between',
    margin: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
  };

  return (
    <>
      <div style={navBarStyle}>
        {navItems.map(item => (
          <TabButton
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            onPress={handlePress}
          />
        ))}
      </div>
      <div style={contentStyle}>
        {ActiveComponent}
      </div>
    </>
  );
};

export default React.memo(ToggleNavBar);
