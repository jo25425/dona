"use client";

import {useRichTranslations} from "@/hooks/useRichTranslations";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {MainTitle, RichText, BlockTitle} from "@/styles/StyledTypography";

export default function Imprint() {
    const imprint = useRichTranslations("imprint");

    return (
        <Container>
            <Box className="mobile-padding">
                <MainTitle variant="h4">{imprint.t("title")}</MainTitle>

                <RichText>{imprint.rich("imprint", {link: "uni-bielefeld"})}</RichText>

                <BlockTitle variant="h5">{imprint.t("rsa.title")}</BlockTitle>
                <RichText>{imprint.rich("rsa.body")}</RichText>

                <BlockTitle variant="h5">{imprint.t("responsible-dona.title")}</BlockTitle>
                <RichText>{imprint.rich("responsible-dona.body", {link: "dona-responsible-homepage"})}</RichText>

                <BlockTitle variant="h5">{imprint.t("responsible-central-website.title")}</BlockTitle>
                <RichText>{imprint.rich("responsible-central-website.body")}</RichText>

                <BlockTitle variant="h5">{imprint.t("liability-disclaimer.title")}</BlockTitle>
                <RichText>{imprint.rich("liability-disclaimer.body")}</RichText>

                <BlockTitle variant="h5">{imprint.t("copyright.title")}</BlockTitle>
                <RichText>{imprint.rich("copyright.body")}</RichText>

                <BlockTitle variant="h5">{imprint.t("photo-credits.title")}</BlockTitle>
                <RichText>{imprint.rich("photo-credits.body")}</RichText>
            </Box>
        </Container>
    );
}
