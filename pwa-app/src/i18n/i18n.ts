import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './languages/en.json';
import hi from './languages/hi.json';

export const resources = {
  en: en,
  hi: hi,
};

// PWA language detector
const languageDetector: any = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lng: string) => void) => {
    // Check localStorage first, then browser language
    const savedLang = localStorage.getItem('app_language');
    if (savedLang) {
      callback(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      callback(browserLang === 'hi' ? 'hi' : 'en');
    }
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    localStorage.setItem('app_language', lng);
  },
};

i18n.use(languageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  returnEmptyString: false,
  compatibilityJSON: 'v3',
  partialBundledLanguages: true,
  ns: [],
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export const changeAppLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    localStorage.setItem('app_language', lang);
  } catch (error) {
    console.error('changeAppLanguage error:', error);
  }
};

export default i18n;
