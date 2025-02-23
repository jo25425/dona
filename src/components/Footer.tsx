"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
    const l = useTranslations("links");
    const urls = useTranslations("urls");
    const projectNumber = useTranslations("footer")("project-number");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detects mobile screens

    return (
        <Box
            component="footer"
            sx={{
                mt: "auto", // Ensures the footer is pushed to the bottom
                pt: 2,
                pb: 0.5,
                backgroundColor: theme.palette.background.default,
                textAlign: "center",
            }}
        >
            <Container>
                <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={0}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {/* Left: Buttons */}
                    <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
                        <Button variant="outlined" size={isMobile ? "small" : "medium"} sx={{ textTransform: "none", fontSize: isMobile ? "0.75rem" : "0.875rem" }} href={urls("report-problem")}>
                            {l("report-problem")}
                        </Button>
                        <Button variant="text" size={isMobile ? "small" : "medium"} sx={{ textTransform: "none", fontSize: isMobile ? "0.75rem" : "0.875rem" }} href="/data-protection">
                            {l("data-protection")}
                        </Button>
                        <Button variant="text" size={isMobile ? "small" : "medium"} sx={{ textTransform: "none", fontSize: isMobile ? "0.75rem" : "0.875rem" }} href="/imprint">
                            {l("imprint")}
                        </Button>
                    </Stack>

                    {/* Right: Icons + Project Number (below icons) */}
                    <Stack
                        direction="column"
                        alignItems="center"
                        // spacing={0}
                        sx={{ mt: isMobile ? 2 : 0 }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", justifyContent: "center" }}>
                            <Link href="https://www.bmbf.de/" target="_blank">
                                <Image
                                    src="images/BMBF_logo.svg"
                                    alt="Bundesministerium für Bildung und Forschung (BMBF) logo"
                                    width={90}
                                    height={30}
                                    style={{ maxWidth: "100%", height: "auto" }}
                                />
                            </Link>
                            <Link href="https://www.hpi.de" target="_blank">
                                <Image
                                    src="images/HPI_logo.svg"
                                    alt="Hasso Plattner Institut (HPI) logo"
                                    width={90}
                                    height={30}
                                    style={{ maxWidth: "100%", height: "auto" }}
                                />
                            </Link>
                            <Link href="https://www.data4life.care/" target="_blank">
                                <Image
                                    src="images/data4life-blueLogo.svg"
                                    alt="Data 4 Life logo"
                                    width={80}
                                    height={30}
                                    style={{ maxWidth: "100%", height: "auto" }}
                                />
                            </Link>
                        </Stack>
                        <Typography variant="caption" sx={{ textAlign: "center", mt: 0, pt: 0, mb: 0 }}>
                            {projectNumber}
                        </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
