import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import zhCN from '@/i18n/zh-CN.json';

const i18n = new I18n({
  ...zhCN,
});

const locales = Localization.getLocales();
const locale = locales.length > 0 ? locales[0].languageTag : 'en';
console.log("locale:"+locale);
i18n.defaultLocale = 'zh-CN';
i18n.locale = 'zh-CN';

export default i18n;
