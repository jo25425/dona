"use client";

import React from "react";
import {useTranslations} from "next-intl";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
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

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Grid container spacing={2}
              sx={{
                  justifyContent: 'center',
                  alignItems: 'top'
              }}
        >
            <Grid item xs={6} sx={{mt: 10}}>
                <Typography variant="h5">
                    {t('instructions.p1.title')}
                </Typography>
                <Typography variant="body1">
                    {t('instructions.p1.body')}
                </Typography>
                <Typography variant="h5">
                    {t('instructions.p2.title')}
                </Typography>
                <Typography variant="body1">
                    {t.rich('instructions.p2.body', {
                        strong: (txt) => <strong>{txt}</strong>,
                        br: () => <br/>
                    })}
                </Typography>
                <Typography variant="h5">
                    {t('instructions.p3.title')}
                </Typography>
                <Typography variant="body1">
                    {t.rich('instructions.p3.body', {
                        link: (txt) => <a target="_blank" href={t("instructions.p3.secure-delete-url")}>{txt}</a>,
                        link2: (txt) => <a target="_blank" href={t("instructions.p3.datenschutz-url")}>{txt}</a>
                    })}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="iOS" {...a11yProps(0)} />
                        <Tab label="Android" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <CardMedia
                        component="video"
                        image={t("instructions.video.ios")}
                        title='iOS'
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
                        title='Android'
                        controls
                    />
                    <Typography variant="caption">
                        {t("instructions.video.android-caption")}
                    </Typography>
                </TabPanel>
            </Grid>
        </Grid>
    );
}