import {useTranslations} from "next-intl";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";


export default function FacebookInstructions() {
    const t = useTranslations("facebook")
    const headers = useTranslations("instructions.headers")

    return (
        <Grid container spacing={2}
              sx={{
                  justifyContent: "center",
                  alignItems: "top"
              }}
        >
            <Grid size={12}>
                <Typography variant="h5">
                    {headers("devices")}
                </Typography>
                <Typography variant="body1">
                    {t("instructions.devices.body")}
                </Typography>
                <Typography variant="h5">
                    {t("instructions.p2.title")}
                </Typography>
                <Typography variant="body1">
                    {t("instructions.p2.body")}
                </Typography>
                <Typography variant="h5">
                    {headers("data-deletion")}
                </Typography>
                <Typography variant="body1">
                    {t.rich("instructions.data-deletion.body", {
                        link: (txt) => <a target="_blank" href={t("instructions.data-deletion.link-url")}>{txt}</a>,
                        link2: (txt) => <a target="_blank" href={t("instructions.data-deletion.link-url-2")}>{txt}</a>,
                        link3: (txt) => <a target="_blank" href={t("instructions.data-deletion.link-url-3")}>{txt}</a>
                    })}
                </Typography>
            </Grid>
            <Grid size={ 12}>
                <CardMedia
                    component="video"
                    image={t("video")}
                    title="Instructions"
                    controls
                />
            </Grid>
            <Grid size={12}>
                <Typography variant="h5">
                    {headers("overview")}
                </Typography>
                <ol style={{textAlign: "left", lineHeight: "1.75rem"}}>
                    <li key="step-1">{t("overview.1")}</li>
                    <li key="step-2">{t("overview.2")}</li>
                    <li key="step-3">{t("overview.3")}</li>
                    <li key="step-4">{t("overview.4")}</li>
                    <li key="step-5">{t("overview.5")}</li>
                    <li key="step-6">{t("overview.6")}</li>
                    <li key="step-7">{t.rich("overview.7", {b: (txt) => <b>{txt}</b>})}</li>
                    <li key="step-8">{t("overview.8")}</li>
                </ol>
            </Grid>
            <Grid>
                <Typography variant="body1">
                    {t.rich("external-documentation", {
                        link: (txt) => <a target="_blank" href="https://www.facebook.com/help/contact/2032834846972583">{txt}</a>,
                    })}
                </Typography>
            </Grid>
        </Grid>
    );
}