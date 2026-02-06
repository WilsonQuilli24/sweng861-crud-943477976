import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    appName: 'Dog Breeds',
    home: 'Home',
    about: 'About',
    breeds: 'Breeds',
    login: 'Login',
    logout: 'Logout',
    loading: 'Loading...',
    addNew: 'Add New Breed',
    viewDetails: 'View Details',
    couldNotLoad: 'Could not load. Please try again.',
    notFound: 'This item does not exist or has been deleted.',
    forbidden: 'You are not authorized to view this item.',
    saving: 'Saving...',
    save: 'Save',
    breedName: 'Breed Name',
    requiredBreed: 'Breed name is required.',
    loginWith: 'Login with',
  },
  es: {
    appName: 'Razas de Perro',
    home: 'Inicio',
    about: 'Acerca',
    breeds: 'Razas',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    loading: 'Cargando...',
    addNew: 'Agregar nueva raza',
    viewDetails: 'Ver detalles',
    couldNotLoad: 'No se pudo cargar. Por favor intente de nuevo.',
    notFound: 'Este elemento no existe o ha sido eliminado.',
    forbidden: 'No está autorizado para ver este elemento.',
    saving: 'Guardando...',
    save: 'Guardar',
    breedName: 'Nombre de la raza',
    requiredBreed: 'El nombre de la raza es obligatorio.',
    loginWith: 'Iniciar con',
  },
};

const LocaleContext = createContext();

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

export default translations;
