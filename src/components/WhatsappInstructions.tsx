"use client";

import React from "react";
import {useTranslations} from "next-intl";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function WhatsappInstructions() {
    const t = useTranslations("whatsapp")
    const headers = useTranslations("instructions.headers")

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Grid container spacing={2}
              sx={{
                  justifyContent: "center",
                  alignItems: "top"
              }}
        >
            <Grid size={{xs: 12, sm: 6}} sx={{mt: 8}}>
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
                    {t.rich("instructions.p2.body", {
                        strong: (txt) => <strong>{txt}</strong>,
                        br: () => <br/>
                    })}
                </Typography>
                <Typography variant="h5">
                    {headers("data-deletion")}
                </Typography>
                <Typography variant="body1">
                        {t.rich("instructions.data-deletion.body", {
                            link: (txt) => <a target="_blank" href={t("instructions.data-deletion.secure-delete-url")}>{txt}</a>,
                            link2: (txt) => <a target="_blank" href={t("instructions.data-deletion.datenschutz-url")}>{txt}</a>
                        })}
                    </Typography>
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="iOS" {...a11yProps(0)} />
                        <Tab label="Android" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <CardMedia
                        component="video"
                        image={t("instructions.video.ios")}
                        title="iOS"
                        controls
                    />
                    <Typography variant="caption">
                        {t("instructions.video.ios-caption")}
                    </Typography>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <CardMedia
                        component="video"
                        image={t("instructions.video.android")}
                        title="Android"
                        controls
                    />
                    <Typography variant="caption">
                        {t("instructions.video.android-caption")}
                    </Typography>
                </TabPanel>
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
                    <li key="step-7">{t("overview.7")}</li>
                    <li key="step-8">{t("overview.8")}</li>
                </ol>
            </Grid>
        </Grid>
    );
}