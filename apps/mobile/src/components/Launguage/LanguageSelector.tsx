import React, { useState } from 'react';
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
import { useLanguage } from '@/i18n/LanguageProvider';
import { useTranslation } from '@/hooks/useTranslation';

interface LanguageSelectorProps {
  onClose?: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  // 支持的语言列表
  const supportedLanguages = [
    { code: 'zh', name: '中文', nativeName: '中文 (简体)' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ja', name: '日本語', nativeName: '日本語' },
    { code: 'ko', name: '한국어', nativeName: '한국어' },
    { code: 'fr', name: 'Français', nativeName: 'Français' },
    { code: 'es', name: 'Español', nativeName: 'Español' },
    { code: 'de', name: 'Deutsch', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italiano', nativeName: 'Italiano' },
    { code: 'pt', name: 'Português', nativeName: 'Português' },
    { code: 'ru', name: 'Русский', nativeName: 'Русский' },
  ];

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
  <>
  <View style={styles.languageModalHeader}>
    <Text style={[styles.languageModalTitle, {color: theme.textPrimary}]}>
      {t('settings.language.selectLanguage')}
    </Text>
    {onClose && (
      <TouchableOpacity onPress={onClose} style={styles.languageModalCloseButton}>
        <Icon
          name="close"
          size={24}
          color={theme.textPrimary}
          tvParallaxProperties={{}}
        />
      </TouchableOpacity>
    )}
  </View>

  <ScrollView style={styles.languageList}>
    {supportedLanguages.map((language) => (
      <TouchableOpacity
        key={language.code}
        style={[
          styles.languageItem,
          {
            backgroundColor: currentLanguage === language.code
              ? theme.primaryColor + '20'
              : 'transparent'
          }
        ]}
        onPress={() => handleLanguageSelect(language.code)}
      >
        <View style={styles.languageItemContent}>
          <Text style={[styles.languageName, {color: theme.textPrimary}]}>
            {language.nativeName}
          </Text>
          <Text style={[styles.languageSubname, {color: theme.textSecondary}]}>
            {language.name}
          </Text>
        </View>
        {currentLanguage === language.code && (
          <Icon
            name="check"
            size={20}
            color={theme.primaryColor}
            tvParallaxProperties={{}}
          />
        )}
      </TouchableOpacity>
    ))}
  </ScrollView>
  </>
  )
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  languageModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageModalCloseButton: {
    padding: 4,
  },
  languageList: {
    maxHeight: height * 0.5,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  languageItemContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  languageSubname: {
    fontSize: 14,
  },
});

export default LanguageSelector;
