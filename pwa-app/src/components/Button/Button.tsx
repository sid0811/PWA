import React from 'react';
import {Colors} from '../../theme/colors';
import {useGlobleAction} from '../../redux/actionHooks/useGlobalAction';

interface btnProps {
  onPress?: any;
  title: string;
  height?: any;
  width?: any;
  textStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const AppButton = (props: btnProps) => {
  const {onPress, title, style, textStyle, height, width} = props;
  const {isDarkMode: _isDarkMode} = useGlobleAction();

  const buttonStyle: React.CSSProperties = {
    backgroundColor: Colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    height: height || 40,
    width: width,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.buttonPrimary,
    display: 'flex',
    cursor: 'pointer',
    outline: 'none',
    ...style,
  };

  const textStyleDefault: React.CSSProperties = {
    fontSize: 15,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    ...textStyle,
  };

  return (
    <>
      <button
        style={buttonStyle}
        onClick={onPress}
      >
        <span style={textStyleDefault}>{title}</span>
      </button>
    </>
  );
};

export default AppButton;
