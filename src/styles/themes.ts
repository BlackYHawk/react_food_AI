export const lightTheme = {
  backgroundColor: '#fff',
  primaryColor: '#00C984',
  secondaryColor: '#f8f9fa',
  textPrimary: '#333',
  textSecondary: '#666',
  textLight: '#999',
  rem: (value: number) => {
    const baseFontSize = 16; // 假设基准字体大小为16px
    return value * baseFontSize;
  },
};

export const darkTheme = {
  backgroundColor: '#121212',
  primaryColor: '#00C984',
  secondaryColor: '#272727',
  textPrimary: '#fff',
  textSecondary: '#b3b3b3',
  textLight: '#808080',
  rem: (value: number) => {
    const baseFontSize = 16; // 假设基准字体大小为16px
    return value * baseFontSize;
  },
};
