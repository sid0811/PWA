import React from 'react';

const Loader = ({visible = false}) => {
  if (!visible) return null;

  const overlayStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    height: '100%',
    position: 'fixed',
    width: '100%',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    top: 0,
    left: 0,
    pointerEvents: 'all',
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
