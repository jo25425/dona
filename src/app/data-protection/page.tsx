"use client";

import { useRichTranslations } from "@/hooks/useRichTranslations";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { SectionTitle, ContactBlock, MainTitle, BodyText } from "@/styles/StyledTypography";
import Typography from "@mui/material/Typography";

export default function DataProtection() {
    const protection = useRichTranslations("data-protection");
    const storage = useRichTranslations("data-storage");
    const consent = useRichTranslations("consent");

    return (
        <Container>
            <Box className="mobile-padding">
                <Typography variant="h4">{protection.t("title")}</Typography>

                <MainTitle variant="h5">{protection.t("technical-details.title")}</MainTitle>
                <BodyText>{protection.rich("technical-details.body1")}</BodyText>
                <BodyText>{protection.rich("technical-details.body2")}</BodyText>
                <BodyText>{protection.rich("technical-details.body3")}</BodyText>
                <BodyText>{protection.rich("technical-details.body4")}</BodyText>

                <MainTitle variant="h5">{protection.t("participation.title")}</MainTitle>

                <SectionTitle variant="h5">{storage.t("title")}</SectionTitle>
                <BodyText>{storage.rich("body1")}</BodyText>
                <BodyText>{storage.rich("body2", { link: "limesurvey" })}</BodyText>

                <SectionTitle variant="h5">{consent.t("voluntary.title")}</SectionTitle>
                <BodyText>{consent.rich("voluntary.body")}</BodyText>

                <SectionTitle variant="h5">{consent.t("data-protection.title")}</SectionTitle>
                <BodyText>{consent.rich("data-protection.body")}</BodyText>
                <ContactBlock>{consent.rich("data-protection.contact")}</ContactBlock>

                <SectionTitle variant="h5">{protection.t("participation.usage.title")}</SectionTitle>
                <BodyText>{protection.rich("participation.usage.body")}</BodyText>
            </Box>
        </Container>
    );
}
