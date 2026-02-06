import React, { createContext, useState, useEffect } from 'react';
import { translations } from './translations';

export const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      const stored = localStorage.getItem('locale');
      return stored && translations[stored] ? stored : 'en';
    } catch {
      return 'en';
    }
  });
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const t = (key) => translations[locale]?.[key] ?? translations.en[key] ?? key;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
