"use client";

import {useRichTranslations} from "@/hooks/useRichTranslations";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {MainTitle, RichText, SectionTitle} from "@/styles/StyledTypography";

export default function Imprint() {
    const imprint = useRichTranslations("imprint");

    return (
        <Container>
            <Box className="mobile-padding">
                <MainTitle variant="h4">{imprint.t("title")}</MainTitle>

                <RichText>{imprint.rich("imprint", {link: "uni-bielefeld"})}</RichText>

                <SectionTitle variant="h5">{imprint.t("rsa.title")}</SectionTitle>
                <RichText>{imprint.rich("rsa.body")}</RichText>

                <SectionTitle variant="h5">{imprint.t("responsible-dona.title")}</SectionTitle>
                <RichText>{imprint.rich("responsible-dona.body", {link: "dona-responsible-homepage"})}</RichText>

                <SectionTitle variant="h5">{imprint.t("responsible-central-website.title")}</SectionTitle>
                <RichText>{imprint.rich("responsible-central-website.body")}</RichText>

                <SectionTitle variant="h5">{imprint.t("liability-disclaimer.title")}</SectionTitle>
                <RichText>{imprint.rich("liability-disclaimer.body")}</RichText>

                <SectionTitle variant="h5">{imprint.t("copyright.title")}</SectionTitle>
                <RichText>{imprint.rich("copyright.body")}</RichText>

                <SectionTitle variant="h5">{imprint.t("photo-credits.title")}</SectionTitle>
                <RichText>{imprint.rich("photo-credits.body")}</RichText>
            </Box>
        </Container>
    );
}
