// Theme.js
import { Dimensions, PixelRatio } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base width to scale fonts (based on iPhone 8)
const BASE_WIDTH = 375;

// Function to scale fonts
const responsiveFont = (size) => {
  const newSize = size * (SCREEN_WIDTH / BASE_WIDTH);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Function to scale spacing if needed
const responsiveSpacing = (size) => {
  const newSize = size * (SCREEN_WIDTH / BASE_WIDTH);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Colors
const Colors = {
  primary: '#515151',
  secondary: '#FD9D56',
  background: '#FFFFFF',
  secondary_background: '#FD9D56',
  surface: '#F2F2F2',
  text: '#515151',
  disabled: '#A1A1A1',
  error: '#B00020',
  black: '#000000',
  cream: '#f5e3c9',
  white: '#FFFFFF',
  darkcream: '#CDA87B',
  lightred: '#8C615E',
  graylightblack: '#666',
  lightBlack: '#00000033',
  projectbase: '#FD9D56',
  btncolor: '#FD9D56',
  v1_light_gray: '#ccc',
  whiteddd: '#ddd',
  whitefff: '#fff',
  blackshadow: '#000',
  red: 'rgba(245, 12, 54, 1)',
  green: 'rgba(34, 197, 94, 1)',
};

// Font sizes (responsive)
const FontSizes = {
  xxs : responsiveFont(10),
  xs: responsiveFont(12),
  small: responsiveFont(14),
  smedium: responsiveFont(16),
  medium: responsiveFont(18),
  lmedium: responsiveFont(20),
  large: responsiveFont(22),
  xlarge: responsiveFont(24),
  xxlarge: responsiveFont(26),
  huge: responsiveFont(30),
};

// Fonts
const Fonts = {
  Light: 'Inter_18pt-Light',
  regular: 'Inter_18pt-Regular',
  medium: 'Inter_18pt-Medium',
  SemiBold: 'Inter_18pt-SemiBold',
  bold: 'Inter_18pt-Bold',
  ExtraBold: 'Inter_18pt-ExtraBold',
};

// Spacing (responsive)
const Spacing = {
  tiny: responsiveSpacing(4),
  small: responsiveSpacing(8),
  medium: responsiveSpacing(16),
  large: responsiveSpacing(24),
  xlarge: responsiveSpacing(32),
};

// Theme export
const Theme = {
  colors: Colors,
  fontSizes: FontSizes,
  fonts: Fonts,
  spacing: Spacing,
  responsiveFont,
  responsiveSpacing,
};

export default Theme;
