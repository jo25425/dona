import {useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {Locale} from "@/config";

export default function Header({
                                   locale,
                               }: {
    locale: Locale;
}) {
    const t = useTranslations("landing.header");

    return (
        <Box sx={{flexShrink: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        sx={{mr: 2}}
                        href="/"
                    >
                        <HomeIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {t("title")}
                    </Typography>
                    <LanguageSwitcher locale={locale}/>
                </Toolbar>
            </AppBar>
            <Box sx={{ml: "1.5em"}}>
                <Link
                    href="https://www.uni-bielefeld.de/"
                    target="_blank"
                >
                    <Image
                        src="images/UBF-logo_graustufen.svg"
                        alt="Universität Bielefeld logo"
                        width={200}
                        height={100}
                    />
                </Link>
            </Box>
        </Box>
    );
}