/**
 * Get font's from this file
 */
import {Colors} from './colors';

/**
 * normalize function return's integer value for font size
 */
export function normalize(size: number) {
  return Math.ceil(size);
}

export const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
export const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 812;

export const fontsSize = {
  verySmall: normalize(10),
  small: normalize(12),
  smallDefault: normalize(13),
  default: normalize(14),
  medium: normalize(16),
  large: normalize(18),
  extraLarge: normalize(20),
  extraLarger: normalize(24),
  mainHeadinSize: normalize(30),
  ratingSize: normalize(48),
};

/**
 * fontFamily returns fonts style according to platform
 */
export const fontFamily = () => {
  return {
    ReemrKufiBold: 'ReemKufi-Bold',
    Reemregular: 'ReemKufiInk-Regular',
    ProximaNova: 'Proxima Nova',
    Interregular: 'Inter-Regular',
    InterBlack: 'Inter-Black',
    InterBold: 'Inter-Bold',
    InterLight: 'Inter-Light',
  };
};

/**
 * There is no need to define font size in app explicitly
 */
export const CustomFontStyle = (isDarkMode?: boolean | undefined) => ({
  mainTitle: {
    color: isDarkMode ? Colors.white : Colors.black,
    fontSize: fontsSize.mainHeadinSize,
    fontFamily: fontFamily().ProximaNova,
  },
  greatingDash: {
    color: Colors.white,
    fontSize: fontsSize.large,
    fontFamily: fontFamily().ProximaNova,
  },
  topDashCard: {
    color: Colors.darkGreen,
    fontSize: fontsSize.small,
    fontFamily: fontFamily().ProximaNova,
  },
  titleExtraLarge: {
    color: Colors.white,
    fontSize: fontsSize.extraLarge,
    fontFamily: fontFamily().ProximaNova,
  },
});
