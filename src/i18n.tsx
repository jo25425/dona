import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from './services/locale';
import React from "react";

export default getRequestConfig(async () => {
    const locale = await getUserLocale();

    return {
        locale,
        messages: (await import(`../locales/${locale}.json`)).default,
        defaultTranslationValues: {
            br: (_) => <br/>,
            p: (txt) => <p>{txt}</p>,
            b: (content) => <b>{content}</b>,
            i: (content) => <i>{content}</i>,
            em: (content) => <em>{content}</em>,
            strong: (content) => <strong>{content}</strong>,
            email: (address) => <a href={"mailto:" + address}>{address}</a>
        }
    };
});