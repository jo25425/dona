"use client";

import { useRichTranslations } from "@/hooks/useRichTranslations";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import { MainTitle, BlockTitle, RichText } from "@/styles/StyledTypography";

export default function HomePage() {
    const actions = useRichTranslations("actions");
    const landing = useRichTranslations("landing");

    return (
        <Container maxWidth="md" sx={{ flexGrow: 1 }}>
            <Stack spacing={2} alignItems="center" textAlign="center">
                {/* What Section */}
                <Box>
                    <MainTitle variant="h5">{landing.t("what.title")}</MainTitle>
                    <RichText>{landing.rich("what.body1")}</RichText>
                    <RichText>{landing.rich("what.body2")}</RichText>
                </Box>

                {/* Why Section */}
                <Box>
                    <MainTitle variant="h5">{landing.t("why.title")}</MainTitle>
                    <Grid container spacing={3} justifyContent="center">
                        {["col1", "col2", "col3"].map((col) => (
                            <Grid key={col} size={{ xs: 12, md: 4 }} textAlign="center">
                                {/* Force all images to be the same height */}
                                <Box sx={{ height: 180, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Image
                                        src={landing.t(`why.${col}.image-path`)}
                                        alt={landing.t(`why.${col}.title`)}
                                        width={310}
                                        height={170} // This value is ignored due to CSS override below
                                        style={{ maxWidth: "100%", height: "100%", objectFit: "contain" }}
                                        loading="lazy"
                                    />
                                </Box>

                                <BlockTitle sx={{ mt: 2 }}>{landing.t(`why.${col}.title`)}</BlockTitle>
                                <RichText>{landing.rich(`why.${col}.body`, { link: "learn-more"}, false)}</RichText>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* How to Participate Section */}
                <Box>
                    <MainTitle variant="h5">{landing.t("how-to-participate.title")}</MainTitle>
                    <RichText>{landing.rich("how-to-participate.body")}</RichText>
                </Box>

                {/* How to Cancel Section */}
                <Box>
                    <MainTitle variant="h5">{landing.t("how-to-cancel.title")}</MainTitle>
                    <RichText>{landing.rich("how-to-cancel.body")}</RichText>
                </Box>

                {/* Donation Info Section */}
                <Box>
                    <MainTitle variant="h5">{landing.t("donation-info.title")}</MainTitle>
                    <Grid container spacing={3} justifyContent="center">
                        {["data-request", "anonymisation", "storage"].map((section) => (
                            <Grid
                                container
                                key={section}
                                spacing={3}
                                size={{ xs: 12 }}
                                flexDirection={{ xs: "column", md: "row" }}
                                alignItems="center"
                            >
                                {/* Image Box */}
                                <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent="center">
                                    <Box sx={{ width: 260, mx: "auto", display: "flex", justifyContent: "center" }}>
                                        <Image
                                            src={landing.t(`donation-info.${section}.image`)}
                                            alt={landing.t(`donation-info.${section}.title`)}
                                            width={260}
                                            height={0}
                                            style={{ width: "100%", height: "auto", objectFit: "contain" }}
                                            loading="lazy"
                                        />
                                    </Box>
                                </Grid>

                                {/* Text Box */}
                                <Grid size={{ xs: 12, md: 6 }} textAlign={{ xs: "center", md: "left" }}>
                                    <RichText>
                                        <b>{landing.t(`donation-info.${section}.title`)}</b>
                                        {landing.rich(`donation-info.${section}.body`)}
                                    </RichText>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Contact Section */}
                <Box>
                    <RichText sx={{ fontStyle: "italic" }}>{landing.rich("contact.body")}</RichText>
                </Box>

                {/* Start Button */}
                <Box>
                    <Button variant="contained" href="/instructions">
                        {actions.t("start")}
                    </Button>
                </Box>
            </Stack>
        </Container>
    );
}
