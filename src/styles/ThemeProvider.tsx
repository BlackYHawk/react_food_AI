import React, { createContext, useState, useContext } from 'react';
import { lightTheme, darkTheme } from '@/styles/themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// 主题映射对象
const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeKey = keyof typeof themes;

interface ThemeContextType {
  theme: typeof lightTheme;
  allThemes: ThemeKey[];
  currentThemeKey: ThemeKey;
  setTheme: (themeKey: ThemeKey) => void;
  isLightTheme?: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  allThemes: Object.keys(themes) as ThemeKey[],
  currentThemeKey: 'light',
  setTheme: (themeKey: ThemeKey) => {},
  isLightTheme: false
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('light');

  return (
    <ThemeContext.Provider value={{
        theme: themes[currentTheme],
        allThemes: Object.keys(themes) as ThemeKey[],
        currentThemeKey: currentTheme,
        setTheme: (key: ThemeKey) => setCurrentTheme(key),
        isLightTheme: currentTheme === 'light',
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
