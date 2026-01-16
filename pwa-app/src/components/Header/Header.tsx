import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import {Colors} from '../../theme/colors';
import {CustomFontStyle} from '../../theme/typography';

// Web equivalent of widthPercentageToDP
const wp = (percentage: number) => `${percentage}vw`;

interface HeaderProp {
  navigation?: any;
  title: string;
  flexValue?: number | undefined;
  isBackValidation?: boolean;
  backBtnValidFunc?: () => void;
}

const Header = (props: HeaderProp) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    navigation,
    title,
    flexValue: _flexValue = undefined,
    isBackValidation = false,
    backBtnValidFunc,
  } = props;

  const handleBackButtonPress = () => {
    if (isBackValidation && backBtnValidFunc) {
      backBtnValidFunc();
    } else {
      console.log('Navigation location:', location.pathname);
      if (navigation?.goBack) {
        navigation.goBack();
      } else {
        navigate(-1);
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    flexDirection: 'row',
    height: 'auto',
    padding: 7,
    backgroundColor: Colors.mainBackground,
    display: 'flex',
    alignItems: 'center',
  };

  const backButtonStyle: React.CSSProperties = {
    marginLeft: wp(1.4),
    marginTop: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  };

  const titleStyle: React.CSSProperties = {
    ...CustomFontStyle().titleExtraLarge,
    marginLeft: wp(4),
    marginTop: 10,
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={handleBackButtonPress}
        style={backButtonStyle}
      >
        <FiArrowLeft size={24} color={Colors.black} />
      </button>
      <span style={titleStyle}>
        {title}
      </span>
    </div>
  );
};

export default Header;
