import {useTranslations} from "next-intl";
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {Locale} from "@/config";
import {AppBar, IconButton, Toolbar} from "@mui/material";
import Image from "next/image";

export default function Header({
                                   locale,
                               }: {
    locale: Locale;
}) {
    const t = useTranslations("landing.header");

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        sx={{mr: 2}}
                    >
                        <HomeIcon/> {/*TODO: Add link to / page */}
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {t("title")}
                    </Typography>
                    <LanguageSwitcher locale={locale}/>
                </Toolbar>
            </AppBar>
            <Box sx={{ml: '1.5em'}}>
                <a
                    href="https://www.uni-bielefeld.de/"
                    target="_blank"
                >
                    <Image
                        src='images/UBF-logo_graustufen.svg'
                        alt="Universität Bielefeld logo"
                        width={200}
                        height={100}
                    />
                </a>
            </Box>
        </Box>
    );
}