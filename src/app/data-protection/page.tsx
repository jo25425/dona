"use client";

import {useRichTranslations} from "@/hooks/useRichTranslations";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {BlockTitle, ContactBlock, MainTitle} from "@/styles/StyledTypography";
import Typography from "@mui/material/Typography";

export default function DataProtection() {
    const protection = useRichTranslations("data-protection");
    const storage = useRichTranslations("data-storage");
    const consent = useRichTranslations("consent");

    return (
        <Container>
            <Box className="mobile-padding">
                <MainTitle variant="h4">{protection.t("title")}</MainTitle>

                <MainTitle variant="h5">{protection.t("technical-details.title")}</MainTitle>
                <Typography gutterBottom>{protection.rich("technical-details.body1")}</Typography>
                <Typography gutterBottom>{protection.rich("technical-details.body2")}</Typography>
                <Typography gutterBottom>{protection.rich("technical-details.body3")}</Typography>
                <Typography gutterBottom>{protection.rich("technical-details.body4")}</Typography>

                <MainTitle variant="h5">{protection.t("participation.title")}</MainTitle>

                <BlockTitle variant="h5">{storage.t("title")}</BlockTitle>
                <Typography gutterBottom>{storage.rich("body1")}</Typography>
                <Typography gutterBottom>{storage.rich("body2", { link: "limesurvey" })}</Typography>

                <BlockTitle variant="h5">{consent.t("voluntary.title")}</BlockTitle>
                <Typography gutterBottom>{consent.rich("voluntary.body")}</Typography>

                <BlockTitle variant="h5">{consent.t("data-protection.title")}</BlockTitle>
                <Typography gutterBottom>{consent.rich("data-protection.body")}</Typography>
                <ContactBlock>{consent.rich("data-protection.contact")}</ContactBlock>

                <BlockTitle variant="h5">{protection.t("participation.usage.title")}</BlockTitle>
                <Typography gutterBottom>{protection.rich("participation.usage.body")}</Typography>
            </Box>
        </Container>
    );
}
