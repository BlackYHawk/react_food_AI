import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Import translations
import en from './translations/en';
import zh from './translations/zh';

// Create i18n instance
const i18n = new I18n({
  en,
  zh,
});

// Set the locale once at the beginning of your app
i18n.locale = (Localization.locale || 'zh').split('-')[0] || 'zh';
i18n.enableFallback = true;
i18n.defaultLocale = 'zh';

export default i18n;