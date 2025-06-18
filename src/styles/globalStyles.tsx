import { Dimensions, PixelRatio, Platform, StyleSheet } from 'react-native';

// @ts-ignore
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  primaryColor: "#00C984",
  secondaryColor: '#f8f9fa',
  textPrimary: '#333',
  textSecondary: '#666',
  textLight: '#999',
});

export const standardTheme = {
  Button: {
    raised: true,
  },
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // 基于375宽度的设计稿

export function rem(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
