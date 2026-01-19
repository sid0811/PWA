import React from 'react';
import {FiArrowLeft, FiSearch} from 'react-icons/fi';
import {Colors} from '../../theme/colors';

interface ReportHeaderProps {
  title: string;
  onBack: () => void;
  showSearch?: boolean;
  searchText?: string;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
  dataCount?: number;
  countLabel?: string;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  title,
  onBack,
  showSearch = false,
  searchText = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  dataCount,
  countLabel,
}) => {
  const headerContainerStyle: React.CSSProperties = {
    backgroundColor: Colors.mainBackground,
    padding: '16px',
    paddingTop: '20px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const backButtonStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Proxima Nova, sans-serif',
    color: Colors.white,
  };

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  };

  const searchInputContainerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: '8px 12px',
  };

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  const countContainerStyle: React.CSSProperties = {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
  };

  const countTextStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.richCharcoal,
    fontFamily: 'Proxima Nova, sans-serif',
  };

  return (
    <div style={headerContainerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={onBack}>
          <FiArrowLeft size={24} color={Colors.white} />
        </button>
        <span style={titleStyle}>{title}</span>
      </div>

      {showSearch && (
        <div style={searchContainerStyle}>
          <div style={searchInputContainerStyle}>
            <FiSearch size={18} color={Colors.darkGray} />
            <input
              style={searchInputStyle}
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
          {dataCount !== undefined && (
            <div style={countContainerStyle}>
              <span style={countTextStyle}>
                {countLabel || 'Total'}: {dataCount}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportHeader;
