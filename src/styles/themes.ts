
// 基础主题接口
export interface ThemeColors {
  id: string;
  name: string;
  backgroundColor: string;
  cardBackground: string;
  primaryColor: string;
  secondaryColor: string;
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  border: string;
  isDark: boolean;
  // 添加rem函数用于响应式尺寸
  rem: (size: number) => number;
}

// 基础尺寸转换函数
const createRem = (baseFontSize: number = 16) => {
  return (size: number) => {
    return size;
  };
};

// 创建主题的工厂函数
const createTheme = (options: Partial<ThemeColors> & { id: string; name: string; isDark: boolean }): ThemeColors => {
  return {
    backgroundColor: '#ffffff',
    cardBackground: '#F5F5F5',
    primaryColor: '#00C984',
    secondaryColor: '#f8f9fa',
    textPrimary: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    border: '#E0E0E0',
    rem: createRem(),
    ...options
  };
};

// 预设主题
export const lightTheme = createTheme({
  id: 'light',
  name: '明亮',
  isDark: false,
  backgroundColor: '#ffffff',
  cardBackground: '#F5F5F5',
  primaryColor: '#00C984',
  secondaryColor: '#f8f9fa',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
});

export const darkTheme = createTheme({
  id: 'dark',
  name: '暗黑',
  isDark: true,
  backgroundColor: '#121212',
  cardBackground: '#1E1E1E',
  primaryColor: '#00C984',
  secondaryColor: '#272727',
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  textLight: '#808080',
  border: '#424242',
});

export const blueTheme = createTheme({
  id: 'blue',
  name: '蓝色',
  isDark: false,
  primaryColor: '#1976D2',
  secondaryColor: '#E3F2FD',
  backgroundColor: '#F5F9FF',
  cardBackground: '#FFFFFF',
  textPrimary: '#0D47A1',
  textSecondary: '#5C6BC0',
  textLight: '#90CAF9',
});

export const purpleTheme = createTheme({
  id: 'purple',
  name: '紫色',
  isDark: false,
  primaryColor: '#9C27B0',
  secondaryColor: '#F3E5F5',
  backgroundColor: '#FCF6FF',
  cardBackground: '#FFFFFF',
  textPrimary: '#4A148C',
  textSecondary: '#7B1FA2',
  textLight: '#CE93D8',
});

export const orangeTheme = createTheme({
  id: 'orange',
  name: '橙色',
  isDark: false,
  primaryColor: '#FF9800',
  secondaryColor: '#FFF3E0',
  backgroundColor: '#FFFAF0',
  cardBackground: '#FFFFFF',
  textPrimary: '#E65100',
  textSecondary: '#F57C00',
  textLight: '#FFB74D',
});

export const greenTheme = createTheme({
  id: 'green',
  name: '绿色',
  isDark: false,
  primaryColor: '#4CAF50',
  secondaryColor: '#E8F5E9',
  backgroundColor: '#F1F8E9',
  cardBackground: '#FFFFFF',
  textPrimary: '#1B5E20',
  textSecondary: '#388E3C',
  textLight: '#81C784',
});

export const redTheme = createTheme({
  id: 'red',
  name: '红色',
  isDark: false,
  primaryColor: '#F44336',
  secondaryColor: '#FFEBEE',
  backgroundColor: '#FFF5F5',
  cardBackground: '#FFFFFF',
  textPrimary: '#B71C1C',
  textSecondary: '#D32F2F',
  textLight: '#E57373',
});

export const darkBlueTheme = createTheme({
  id: 'darkBlue',
  name: '深蓝',
  isDark: true,
  backgroundColor: '#0A1929',
  cardBackground: '#132F4C',
  primaryColor: '#5090D3',
  secondaryColor: '#173A5E',
  textPrimary: '#FFFFFF',
  textSecondary: '#B2BAC2',
  textLight: '#6F7E8C',
  border: '#265D97',
});

export const darkPurpleTheme = createTheme({
  id: 'darkPurple',
  name: '深紫',
  isDark: true,
  backgroundColor: '#170B2A',
  cardBackground: '#301B4D',
  primaryColor: '#BB86FC',
  secondaryColor: '#3F2C70',
  textPrimary: '#FFFFFF',
  textSecondary: '#D0BCFF',
  textLight: '#7A5EA6',
  border: '#4E3A85',
});

// 所有可用主题的集合
export const allThemes = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  purple: purpleTheme,
  orange: orangeTheme,
  green: greenTheme,
  red: redTheme,
  darkBlue: darkBlueTheme,
  darkPurple: darkPurpleTheme,
};

// 主题类型
export type ThemeType = keyof typeof allThemes;
