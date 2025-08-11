import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { Icon } from 'react-native-elements';
import ThemeSelector from './ThemeSelector';

import { useTranslation } from '@/hooks/useTranslation';

interface ThemeSwitchProps {
  showLabel?: boolean;
  compact?: boolean;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  showLabel = true,
  compact = false,
}) => {
  const { theme, themeType, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleOpenThemeSelector = () => {
    setShowThemeSelector(true);
  };

  const handleCloseThemeSelector = () => {
    setShowThemeSelector(false);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={[styles.compactButton, { backgroundColor: theme.cardBackground }]}
          onPress={handleToggleTheme}
        >
          <Icon
            name={theme.isDark ? 'light-mode' : 'dark-mode'}
            size={20}
            color={theme.textPrimary}
            tvParallaxProperties={{}}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.compactButton,
            { backgroundColor: theme.cardBackground, marginLeft: 8 },
          ]}
          onPress={handleOpenThemeSelector}
        >
          <Icon
            name="palette"
            size={20}
            color={theme.primaryColor}
            tvParallaxProperties={{}}
          />
        </TouchableOpacity>

        <Modal
          visible={showThemeSelector}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseThemeSelector}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.backgroundColor },
              ]}
            >
              <ThemeSelector onClose={handleCloseThemeSelector} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 明暗模式切换 */}
      <TouchableOpacity
        style={[
          styles.switchButton,
          { backgroundColor: theme.cardBackground },
        ]}
        onPress={handleToggleTheme}
      >
        <Icon
          name={theme.isDark ? 'light-mode' : 'dark-mode'}
          size={24}
          color={theme.textPrimary}
          tvParallaxProperties={{}}
        />
        {showLabel && (
          <Text style={[styles.switchText, { color: theme.textPrimary }]}>
            {theme.isDark ? t('settings.theme.switchToLight') : t('settings.theme.switchToDark')}
          </Text>
        )}
      </TouchableOpacity>

      {/* 主题选择器按钮 */}
      <TouchableOpacity
        style={[
          styles.switchButton,
          { backgroundColor: theme.cardBackground, marginTop: 12 },
        ]}
        onPress={handleOpenThemeSelector}
      >
        <Icon
          name="palette"
          size={24}
          color={theme.primaryColor}
          tvParallaxProperties={{}}
        />
        {showLabel && (
          <Text style={[styles.switchText, { color: theme.textPrimary }]}>
            {t('settings.theme.selectTheme')}
          </Text>
        )}
      </TouchableOpacity>

      {/* 主题选择器模态框 */}
      <Modal
        visible={showThemeSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseThemeSelector}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <ThemeSelector onClose={handleCloseThemeSelector} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  switchText: {
    marginLeft: 12,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeSwitch;