import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { Icon } from 'react-native-elements';
import { ThemeColors } from '@/styles/themes';

const { width } = Dimensions.get('window');
const THEME_ITEM_SIZE = width / 4 - 20;

interface ThemeSelectorProps {
  onClose?: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { theme, themeType, availableThemes, setThemeType } = useTheme();

  // 将主题分组为亮色和暗色主题
  const lightThemes = Object.entries(availableThemes).filter(
    ([_, themeObj]) => !themeObj.isDark
  );
  
  const darkThemes = Object.entries(availableThemes).filter(
    ([_, themeObj]) => themeObj.isDark
  );

  const handleThemeSelect = (themeId: string) => {
    setThemeType(themeId as any);
    if (onClose) {
      onClose();
    }
  };

  const renderThemeItem = ([id, themeObj]: [string, ThemeColors]) => {
    const isSelected = id === themeType;
    
    return (
      <TouchableOpacity
        key={id}
        style={[
          styles.themeItem,
          {
            backgroundColor: themeObj.backgroundColor,
            borderColor: isSelected ? theme.primaryColor : themeObj.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => handleThemeSelect(id)}
      >
        {/* 主题预览 */}
        <View style={styles.themePreview}>
          {/* 顶部栏 */}
          <View
            style={[
              styles.previewHeader,
              { backgroundColor: themeObj.primaryColor },
            ]}
          />
          
          {/* 内容区域 */}
          <View style={styles.previewContent}>
            <View
              style={[
                styles.previewCard,
                { backgroundColor: themeObj.cardBackground },
              ]}
            />
            <View
              style={[
                styles.previewText,
                { backgroundColor: themeObj.textSecondary },
              ]}
            />
            <View
              style={[
                styles.previewText,
                {
                  backgroundColor: themeObj.textLight,
                  width: '60%',
                },
              ]}
            />
          </View>
        </View>

        {/* 主题名称 */}
        <Text
          style={[
            styles.themeName,
            { color: themeObj.textPrimary },
          ]}
        >
          {themeObj.name}
        </Text>

        {/* 选中标记 */}
        {isSelected && (
          <View style={styles.selectedMark}>
            <Icon
              name="check-circle"
              size={24}
              color={theme.primaryColor}
              tvParallaxProperties={{}}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          选择主题
        </Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon
              name="close"
              size={24}
              color={theme.textPrimary}
              tvParallaxProperties={{}}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* 亮色主题 */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          亮色主题
        </Text>
        <View style={styles.themesGrid}>
          {lightThemes.map(renderThemeItem)}
        </View>

        {/* 暗色主题 */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          暗色主题
        </Text>
        <View style={styles.themesGrid}>
          {darkThemes.map(renderThemeItem)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  themeItem: {
    width: THEME_ITEM_SIZE,
    height: THEME_ITEM_SIZE * 1.3,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 8,
    justifyContent: 'space-between',
  },
  themePreview: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewHeader: {
    height: 8,
    width: '100%',
  },
  previewContent: {
    flex: 1,
    padding: 4,
  },
  previewCard: {
    height: 20,
    width: '100%',
    borderRadius: 4,
    marginBottom: 4,
  },
  previewText: {
    height: 4,
    width: '80%',
    borderRadius: 2,
    marginBottom: 2,
  },
  themeName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  selectedMark: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
});

export default ThemeSelector;