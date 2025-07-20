import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// 基于设计稿的尺寸
const designWidth = 375;
const designHeight = 812;

// 计算缩放比例
const widthScale = width / designWidth;
const heightScale = height / designHeight;

// rem 函数，用于响应式布局
export const rem = (size: number): number => {
  return size * widthScale;
};

// 垂直方向的 rem 函数
export const vrem = (size: number): number => {
  return size * heightScale;
};

// 导出设备尺寸
export const deviceWidth = width;
export const deviceHeight = height;