"use client";

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { Check, LanguagesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const languages = [
  { 
    code: 'en', 
    name: 'English', 
    flagImg: '/images/flags/us.svg'
  },
  { 
    code: 'es', 
    name: 'Español', 
    flagImg: '/images/flags/es.svg'
  },
  { 
    code: 'fr', 
    name: 'Français', 
    flagImg: '/images/flags/fr.svg'
  },
  { 
    code: 'hi', 
    name: 'हिंदी', 
    flagImg: '/images/flags/in.svg'
  },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      localStorage.setItem('i18nextLng', langCode);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 px-3 hover:bg-accent/50 transition-colors"
        >
          <Image 
            src={currentLang.flagImg}
            alt={currentLang.name}
            width={20}
            height={15}
            className="mr-2"
          />
          <LanguagesIcon className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      >
        {languages.map((language) => {
          const isActive = i18n.language === language.code;
          
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={cn(
                "flex items-center justify-between cursor-pointer",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "transition-colors",
                isActive && "bg-gray-50 dark:bg-gray-800"
              )}
            >
              <span className="flex items-center gap-2">
                <Image 
                  src={language.flagImg}
                  alt={language.name}
                  width={20}
                  height={15}
                  className="inline-block"
                />
                <span className="text-sm font-medium">{language.name}</span>
              </span>
              {isActive && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}