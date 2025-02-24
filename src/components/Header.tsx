"use client";

import {useTranslations} from "next-intl";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import HomeIcon from "@mui/icons-material/Home";
import {Locale} from "@/config";

export default function Header({ locale }: { locale: Locale }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const pathname = usePathname();
    const isLandingPage = pathname === "/";
    const t = useTranslations("landing.header");

    const [fadeIn, setFadeIn] = useState(false);
    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <Box
            component="header"
            sx={{
                position: "relative",
                width: "100%",
                height: "auto",
                backgroundImage: "url(/images/background.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: theme.spacing(1.5),
                transition: "height 0.5s ease-in-out",
                color: theme.palette.common.white, '& .MuiSvgIcon-root': { color: theme.palette.common.white }, // Ensure good visibility
            }}
        >
            {/* Top bar with Home & Language Switcher */}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {/* Left: Home Button */}
                <IconButton color="inherit" sx={{ fontSize: "2rem" }} href="/">
                    <HomeIcon fontSize="large" />
                </IconButton>

                {/* Right: Language Switcher */}
                <LanguageSwitcher locale={locale} />
            </Box>

            {/* Landing Page Header Text */}
            {isLandingPage && (
                <Box
                    sx={{
                        opacity: fadeIn ? 1 : 0,
                        transition: "opacity 1s ease-in-out",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        borderRadius: theme.spacing(2),
                        padding: theme.spacing(3),
                        maxWidth: isMobile ? '90%' : '700px',
                        textAlign: "center",
                        m: theme.spacing(2)
                    }}
                >
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        {t("title")}
                    </Typography>
                    <Typography variant="body1">
                        {t("body")}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
