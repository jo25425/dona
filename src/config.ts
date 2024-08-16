export type Locale = (typeof locales)[number];

export const locales = ['en', 'de'] as const;
export const localeNames: Record<Locale, string> = {
    "en": "English",
    "de": "Deutsch",
};
export const defaultLocale: Locale = 'en';