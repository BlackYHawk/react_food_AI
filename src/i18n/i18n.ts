import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
// Import translations
import en from './translations/en';
import zh from './translations/zh';

// Create i18n instance
export const i18n = new I18n({
  en,
  zh,
});

// 兼容不同版本的 locale 获取方式
export const getLocale = () => {
  if ('locale' in Localization) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (Localization as any).locale;
  }
  if ('getLocales' in Localization) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Localization.getLocales()[0]?.languageCode;
  }
  return 'zh';
};

// Set the locale once at the beginning of your app
i18n.locale = (getLocale() || 'zh').split('-')[0] || 'zh';
i18n.enableFallback = true;
i18n.defaultLocale = 'zh';

// 支持的语言列表
export const supportedLanguages : LanguageOpt[] = [
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

// 基础语言接口
export interface LanguageOpt {
  code: string;
  name: string;
  nativeName: string;
}
