import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // 基于375宽度的设计稿

export const lightTheme = {
  backgroundColor: '#fff',
  primaryColor: '#00C984',
  secondaryColor: '#f8f9fa',
  textPrimary: '#333',
  textSecondary: '#666',
  textLight: '#999',
  borderColor: '#ff0000',

  rem: (value: number) => {
    const newSize = value * scale;

    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  },
};

export const darkTheme = {
  backgroundColor: '#121212',
  primaryColor: '#00C984',
  secondaryColor: '#272727',
  textPrimary: '#fff',
  textSecondary: '#b3b3b3',
  textLight: '#808080',
  borderColor: '#ff0000',

  rem: (value: number) => {
    const newSize = value * scale;

    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  },
};
