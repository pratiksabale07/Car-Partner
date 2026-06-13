import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dot_language');
    if (saved && translations[saved]) setLanguage(saved);
    else setShowModal(true);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('dot_language', lang);
    setShowModal(false);
  };

  const t = (key) => {
    if (!language) return '';
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) value = value?.[k];
    return value ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, showModal, setShowModal, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
