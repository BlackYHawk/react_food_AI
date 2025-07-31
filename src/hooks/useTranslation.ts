import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import i18n from '@/i18n/i18n';

/**
 * Custom hook that provides translation function and automatically re-renders
 * components when language changes
 */
export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  const [, forceUpdate] = useState({});

  // Force re-render when language changes
  useEffect(() => {
    forceUpdate({});
  }, [currentLanguage]);

  const t = (key: string, options?: any) => {
    return i18n.t(key, options);
  };

  return {
    t,
    currentLanguage,
    i18n,
  };
};