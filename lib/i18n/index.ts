import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fr from './fr.json';

export const SUPPORTED_LOCALES = ['en', 'fr'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

export type TranslationKey = keyof typeof en | `common.${string}`;

export const i18n = createInstance({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
  returnNull: false,
});

i18n.use(initReactI18next).init();

export function setLanguage(lang: SupportedLocale) {
  i18n.changeLanguage(lang);
}

export function getLanguage(): SupportedLocale {
  return (i18n.language?.split('-')[0] as SupportedLocale) ?? DEFAULT_LOCALE;
}