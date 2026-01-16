import React from 'react';

interface CustomSafeViewProp {
  isScrollView?: boolean;
  children?: React.ReactNode;
  header?: React.ReactNode;
  edges?: string[];
}

const mainStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
};

const scrollContainerStyle: React.CSSProperties = {
  ...mainStyle,
  overflowY: 'auto',
  overflowX: 'hidden',
};

const noScrollContainerStyle: React.CSSProperties = {
  ...mainStyle,
  overflow: 'hidden',
};

export default function CustomSafeView(props: CustomSafeViewProp) {
  const {isScrollView = false, children, header} = props;

  if (!isScrollView) {
    // NoScrollView equivalent
    return (
      <div style={noScrollContainerStyle}>
        {children}
      </div>
    );
  }

  // ScrollViewFunction equivalent
  return (
    <div style={mainStyle}>
      {header ? header : null}
      <div style={scrollContainerStyle}>
        {children}
      </div>
    </div>
  );
}
