"use client";

import React from "react";
import {useTranslations} from "next-intl";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DataSourceFeedbackSection from "@components/DataSourceFeedbackSection";
import {useDonation} from "@/context/DonationContext";
import {Conversation} from "@models/processed";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ConsentModal from "@components/ConsentModal";
import Stack from "@mui/material/Stack";

export default function DonationFeedbackPage() {
    const a = useTranslations('actions');
    const t = useTranslations('feedback');
    const { donationData } = useDonation();

    if (!donationData) {
        // TODO: Proper error
        return <Typography variant="body1">No donation data available.</Typography>;
    }

    const dataByDataSource: Map<string, Conversation[]> = Map.groupBy(donationData, ({ dataSource}) => dataSource);
    return (
        <Container maxWidth="md" sx={{flexGrow: 1, mt: 4}}>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 'auto'
                }}
            >
                <Typography variant="h4" sx={{my: 2}}>
                    {t('thanks.title')}
                </Typography>

                <Alert severity="warning" sx={{ my: 2 }}>
                    <Typography variant="body1">{t('importantMessage.title')}</Typography>
                    <Typography variant="body2">
                        {t.rich('importantMessage.disclaimer', {
                            b: (txt) => <b>{txt}</b>,
                            u: (txt) => <u>{txt}</u>
                        })}
                    </Typography>
                </Alert>

                {dataByDataSource.entries().map(([source, data]) => (
                    <DataSourceFeedbackSection
                        key={source}
                        dataSourceValue={source}
                        conversations={data}
                    />
                ))}

                <Typography variant="body1" gutterBottom>{t('title.pleaseContinue')}</Typography>
                <Button variant="contained" href="/">
                    {a('next')}
                </Button>
            </Stack>
        </Container>
    );
}