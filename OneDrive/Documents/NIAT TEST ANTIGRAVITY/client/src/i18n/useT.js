import { useState, useEffect } from 'react';
import { dictionary } from './dictionary.js';

export function useT(profileLanguage = null) {
  const [lang, setLangState] = useState(() => {
    return profileLanguage || localStorage.getItem('krishi_lang') || 'en';
  });

  useEffect(() => {
    if (profileLanguage && ['en', 'hi', 'mr'].includes(profileLanguage)) {
      setLangState(profileLanguage);
      localStorage.setItem('krishi_lang', profileLanguage);
    }
  }, [profileLanguage]);

  const changeLanguage = (newLang) => {
    if (['en', 'hi', 'mr'].includes(newLang)) {
      setLangState(newLang);
      localStorage.setItem('krishi_lang', newLang);
    }
  };

  const t = (key, fallback = '') => {
    const activeDict = dictionary[lang] || dictionary.en;
    return activeDict[key] || dictionary.en[key] || fallback || key;
  };

  return { t, lang, setLanguage: changeLanguage };
}
