import React, { useState, useEffect } from 'react';
import {CheckBox} from 'react-native-elements';
import {useTheme, ThemeKey} from '@/styles/ThemeProvider.tsx';
import { FlatList } from 'react-native';

interface Item {
  key: string;
  title: string;
  checked: boolean;
}

const ThemeSwitch = () => {
  const { theme, allThemes, currentThemeKey, setTheme } = useTheme();
  const [themeData, setThemeData] = useState<Item[]>([]);

  useEffect(() => {
    // 生成主题数据列表
    const themeData = allThemes.map(key => ({
      key,
      title: key,
      checked: key === currentThemeKey,
    }));
    setThemeData(themeData);
  }, [currentThemeKey, allThemes]);

  const renderThemeItem = ({item}: {item: Item}) => (
    <CheckBox
      key={item.key}
      title={item.title}
      checked={item.checked}
      checkedIcon="dot-circle-o"
      uncheckedIcon="circle-o"
      onPress={() => {
        if (item.checked) {
          return;
        }
        setTheme(item.title as ThemeKey);
      }}
      tvParallaxProperties={{}}></CheckBox>
  );

  return (
    <FlatList
        data={themeData}
        renderItem={renderThemeItem}
        keyExtractor={item => item.key}
        scrollEnabled={false} />
  );
}

export default ThemeSwitch;
