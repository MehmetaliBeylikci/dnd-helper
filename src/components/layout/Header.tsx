import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-40 parchment-card border-b border-parchment-300/80 dark:border-dark-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-burgundy-600 dark:bg-burgundy-500 flex items-center justify-center">
              <span className="text-2xl font-display text-white">⚔</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-parchment-900 dark:text-parchment-100">
                {t('app.title')}
              </h1>
              <p className="text-xs text-parchment-600 dark:text-parchment-400 font-body">
                {t('app.subtitle')}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              aria-label={t('settings.language')}
              title={t('settings.language')}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline uppercase">
                {i18n.language}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              aria-label={isDark ? t('settings.lightMode') : t('settings.darkMode')}
              title={isDark ? t('settings.lightMode') : t('settings.darkMode')}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
