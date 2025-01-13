'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';
import i18n from './config';

const countryToLanguage: { [key: string]: string } = {
  US: 'en',
  GB: 'en',
  ES: 'es',
  MX: 'es',
  FR: 'fr',
  IN: 'hi',
};

const languageNames: { [key: string]: string } = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  hi: 'हिंदी',
};

const detectUserLanguage = async (): Promise<string> => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    const countryCode = response.data.country_code;
    return countryToLanguage[countryCode] || 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en';
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const init = async () => {
      const hasLanguagePreference = localStorage.getItem('i18nextLng');

      if (!hasLanguagePreference || hasLanguagePreference.includes('-')) {
        const detectedLang = await detectUserLanguage();
        
        toast.success(
          `Setting language to ${languageNames[detectedLang] || detectedLang} based on your location`, 
          { duration: 5000 }
        );

        await i18n.changeLanguage(detectedLang);
      }
    };

    init().catch(console.error);
  }, []);

  return <>{children}</>;
} 