import React from 'react';

// Web equivalent of responsive screen utilities
const wp = (percentage: number) => `${percentage}vw`;
const hp = (percentage: number) => `${percentage}vh`;

const Logo = () => {
  const containerStyle: React.CSSProperties = {
    alignItems: 'center',
    marginTop: hp(8),
    display: 'flex',
    flexDirection: 'column',
  };

  const imageStyle: React.CSSProperties = {
    width: wp(30),
    height: hp(21),
    objectFit: 'contain',
  };

  return (
    <div style={containerStyle}>
      <img
        style={imageStyle}
        src="/icons/icon-192x192.png"
        alt="Logo"
      />
    </div>
  );
};

export default Logo;
