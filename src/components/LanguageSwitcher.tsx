import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  React.useEffect(() => {
    document.documentElement.dir = i18n.language.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  }, [i18n.language]);

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white/10 transition-colors"
      aria-label="Toggle Language"
    >
      <Globe className="w-5 h-5 text-cyan-400" />
      <span className="font-medium text-sm">
        {i18n.language.startsWith('en') ? 'العربية' : 'English'}
      </span>
    </button>
  );
}
