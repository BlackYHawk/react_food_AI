import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { allThemes, lightTheme } from '@/styles/themes';
import type { ThemeColors, ThemeType } from '@/styles/themes';

interface ThemeContextType {
  theme: ThemeColors;
  themeType: ThemeType;
  availableThemes: Record<string, ThemeColors>;
  toggleTheme: () => void;
  setThemeType: (type: ThemeType) => void;
  isLightTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'light',
  availableThemes: allThemes,
  toggleTheme: () => {},
  setThemeType: () => {},
  isLightTheme: true,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('light');
  const [theme, setTheme] = useState<ThemeColors>(lightTheme);
  const isLightTheme = !theme.isDark;

  useEffect(() => {
    // Load saved theme from AsyncStorage
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeType');
        if (savedTheme && savedTheme in allThemes) {
          setThemeType(savedTheme as ThemeType);
          setTheme(allThemes[savedTheme as ThemeType]);
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };

    loadTheme();
  }, []);

  // 切换明暗主题
  const toggleTheme = async () => {
    // 如果当前是亮色主题，切换到暗色主题，反之亦然
    // 我们选择同一色系的暗色/亮色主题
    let newThemeType: ThemeType = 'light';
    
    if (!theme.isDark) {
      // 当前是亮色主题，切换到对应的暗色主题
      if (themeType === 'light') newThemeType = 'dark';
      else if (themeType === 'blue') newThemeType = 'darkBlue';
      else if (themeType === 'purple') newThemeType = 'darkPurple';
      else newThemeType = 'dark'; // 默认暗色主题
    } else {
      // 当前是暗色主题，切换到对应的亮色主题
      if (themeType === 'dark') newThemeType = 'light';
      else if (themeType === 'darkBlue') newThemeType = 'blue';
      else if (themeType === 'darkPurple') newThemeType = 'purple';
      else newThemeType = 'light'; // 默认亮色主题
    }
    
    await setThemeTypeHandler(newThemeType);
  };

  // 设置特定主题
  const setThemeTypeHandler = async (type: ThemeType) => {
    if (!(type in allThemes)) {
      console.error(`Theme type "${type}" not found`);
      return;
    }
    
    setThemeType(type);
    setTheme(allThemes[type]);

    try {
      await AsyncStorage.setItem('themeType', type);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        availableThemes: allThemes,
        toggleTheme,
        setThemeType: setThemeTypeHandler,
        isLightTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
