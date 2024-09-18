import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from './services/locale';

export default getRequestConfig(async () => {
    const locale = await getUserLocale();

    return {
        locale,
        messages: (await import(`../locales/${locale}.json`)).default,
        defaultTranslationValues: {
            b: (content) => <b>{content}</b>,
            strong: (content) => <strong>{content}</strong>,
            email: (address) => <a href={"mailto:" + address}>{address}</a>
        }
    };
});