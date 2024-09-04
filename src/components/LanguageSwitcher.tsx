"use client";

import {Locale, localeNames, locales} from '@/config';
import {setUserLocale} from '@/services/locale';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Box from "@mui/material/Box";

export default function LanguageSwitcher({
                                           locale,
                                       }: {
    locale: Locale;
}) {
    const changeLocale = (
        event: SelectChangeEvent,
    ) => {
        setUserLocale(event.target.value as Locale);
    };

    return (
        <Box>
            <Select
                size="small"
                value={locale}
                onChange={changeLocale}
                variant="outlined"
                sx={{
                    color: 'inherit',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'inherit'
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'inherit'
                    }
                }}
            >
                {locales.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                        {localeNames[loc]}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
}