import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { Colors } from '../../theme/colors';
import { useGlobleAction } from '../../redux/actionHooks/useGlobalAction';

// Web utility function to remove quotation marks
const removeQuotation = (text: string): string => {
  return text.replace(/['"]/g, '');
};

interface TextInputProps {
  onChangeText?: (txt: string) => void;
  onSubmitEditing?: any;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  iconStyle?: any;
  placeholder?: string;
  width?: any;
  marginVertical?: any;
  value?: string;
  otherProps?: any;
  multiline?: boolean;
  iconName?: any;
  iconFamily?: any;
  iconSize?: any;
  height?: any;
  isPassword?: boolean;
  blurOnSubmit?: boolean;
}

const AppTextInput = (prop: TextInputProps) => {
  const {
    onChangeText,
    onSubmitEditing,
    style,
    containerStyle,
    iconStyle: _iconStyle,
    placeholder,
    width = '100%',
    marginVertical,
    value,
    otherProps,
    multiline = false,
    blurOnSubmit: _blurOnSubmit = false,
    iconName,
    iconFamily: _iconFamily,
    iconSize,
    height,
    isPassword = false,

  } = prop;
  const { isDarkMode } = useGlobleAction();

  const [isSecureText, setIsSecureText] = useState(isPassword);

  const toggleSecureText = () => {
    setIsSecureText(prev => !prev); // Toggle the secure text state
  };

  const containerStyles: React.CSSProperties = {
    alignItems: 'center',
    backgroundColor: isDarkMode ? Colors.textColor2 : Colors.white,
    borderColor: Colors.inputBox,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'solid',
    marginTop: marginVertical ? Number(marginVertical) : 6,
    marginBottom: marginVertical ? Number(marginVertical) : 6,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    width: width,
    height: height,
    ...containerStyle,
  };

  const textStyles: React.CSSProperties = {
    flex: 1,
    fontSize: 18,
    color: isDarkMode ? Colors.white : Colors.black,
    paddingTop: 6,
    paddingBottom: 6,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    ...style,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && onSubmitEditing) {
      onSubmitEditing();
    }
  };

  return (
    <div style={containerStyles}>
      {iconName && (
        <div style={{ marginRight: 5 }}>
          {/* Icon placeholder - using text for now */}
          <span style={{ fontSize: iconSize || 20 }}>{iconName}</span>
        </div>
      )}

      {multiline ? (
        <textarea
          onChange={(e) => onChangeText?.(removeQuotation(e.target.value))}
          placeholder={placeholder}
          style={{...textStyles, resize: 'none'}}
          value={value}
          {...otherProps}
        />
      ) : (
        <input
          type={isSecureText ? 'password' : 'text'}
          onChange={(e) => onChangeText?.(removeQuotation(e.target.value))}
          placeholder={placeholder}
          style={textStyles}
          value={value}
          onKeyDown={handleKeyDown}
          {...otherProps}
        />
      )}

      {isPassword && (
        <button
          type="button"
          onClick={toggleSecureText}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isSecureText ? (
            <FiEyeOff size={24} color={Colors.primary} />
          ) : (
            <FiEye size={24} color={Colors.primary} />
          )}
        </button>
      )}
    </div>
  );
};

export default AppTextInput;
