import { useContext } from 'react';
import { LocaleContext } from './i18n';
import { translations } from './translations';

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: 'en',
      setLocale: () => {},
      t: (key) => translations.en[key] ?? key,
    };
  }
  return ctx;
}
