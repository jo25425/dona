"use client";

import {Locale, localeNames, locales} from '@/config';
import {setUserLocale} from '@/services/locale';

export default function LocaleSwitcher({
                                           locale,
                                       }: {
    locale: Locale;
}) {
    const changeLocale = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const newLocale = event.target.value as Locale;
        setUserLocale(newLocale);
    };

    return (
        <div>
            <select
                value={locale}
                onChange={changeLocale}
                className="..."
            >
                {locales.map((loc) => (
                    <option key={loc} value={loc}>
                        {localeNames[loc]}
                    </option>
                ))}
            </select>
        </div>
    );
}