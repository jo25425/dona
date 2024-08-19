export type Locale = (typeof locales)[number];

export const locales = ['en', 'de', 'hy'] as const;
export const localeNames: Record<Locale, string> = {
    "en": "English",
    "de": "Deutsch",
    "hy": "Armenian"
};
export const defaultLocale: Locale = 'en';