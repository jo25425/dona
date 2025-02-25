"use client";

import { useRichTranslations } from "@/hooks/useRichTranslations";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { BlockTitle } from "@/styles/StyledTypography";
import { InstructionVideo, StepsList, TabbedInstructionVideo } from "@/components/InstructionComponents";
import { DataSourceValue } from "@models/processed";

export default function DatasourceSpecificInstructions({ dataSource }: { dataSource: DataSourceValue }) {
    const source = useRichTranslations(dataSource.toLowerCase());
    const generic = useRichTranslations("instructions");

    const isWhatsApp = dataSource === DataSourceValue.WhatsApp;
    const secondParagraph = isWhatsApp ? "selection" : "duration";
    const stepsCount = isWhatsApp ? 8 : 10;

    const externalLinks = {
        link_android: `${dataSource.toLowerCase()}.android-documentation`,
        link_ios: `${dataSource.toLowerCase()}.ios-documentation`,
        link: `${dataSource.toLowerCase()}.external-documentation`,
    };

    const FirstBlock = ({ halfWidth = false }: { halfWidth?: boolean }) => (
        <Grid size={{ xs: 12, md: halfWidth ? 6 : 10 }}>
            <BlockTitle>{generic.t("headers.devices")}</BlockTitle>
            <Typography>{source.rich("devices.body")}</Typography>

            <BlockTitle>{source.t(`${secondParagraph}.title`)}</BlockTitle>
            <Typography>{source.rich(`${secondParagraph}.body`)}</Typography>

            <BlockTitle>{generic.t("headers.data-deletion")}</BlockTitle>
            <Typography>
                {source.rich("data-deletion.body", {
                    link: "secure-delete",
                    link_datenschutz: "datenschutz",
                    link_android: "delete-from-android",
                    link_ios: "delete-from-ios",
                })}
            </Typography>
        </Grid>
    );

    return (
        <Grid container spacing={2} mt={-2} justifyContent="center" alignItems="flex-start">
            {isWhatsApp ? (
                <Grid container spacing={2} alignItems="flex-start">
                    <FirstBlock halfWidth />
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TabbedInstructionVideo
                            iosVideoUrl={source.t("video.ios")}
                            androidVideoUrl={source.t("video.android")}
                            iosCaption={source.t("video.ios-caption")}
                            androidCaption={source.t("video.android-caption")}
                        />
                    </Grid>
                </Grid>
            ) : (
                <>
                    <FirstBlock />
                    <InstructionVideo videoUrl={source.t("video")} />
                </>
            )}

            <StepsList title={generic.t("headers.overview")} translation={source} count={stepsCount} />

            <Grid size={{ xs: 12, md: 10 }}>
                <Typography>{source.rich("external-documentation", externalLinks)}</Typography>
            </Grid>
        </Grid>
    );
}
