import React from 'react';
//import {Text} from 'react-native-svg';
// import Loader from './Loader';

const Loader = ({visible = false}) => {
  if (!visible) return null;

  const overlayStyle: React.CSSProperties = {
    //   flex:1,
    backgroundColor: '#fff',
    height: '100%',
    opacity: 0.7,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    display: 'flex',
    top: 0,
    left: 0,
  };

  const spinnerStyle: React.CSSProperties = {
    height: 140,
    width: 140,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #6C3779',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={overlayStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} />
    </div>
  );
};

export default Loader;
