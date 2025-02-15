"use client";

import React, { useEffect, useState } from 'react';
import {useLocale, useTranslations} from 'next-intl';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDonation } from '@/context/DonationContext';
import {fetchGraphDataByDonationId, getDonationId} from './actions';
import LoadingSpinner from '@components/LoadingSpinner';
import DataSourceFeedbackSection from '@components/DataSourceFeedbackSection';


const isFeedbackSurveyEnabled = process.env.NEXT_PUBLIC_FEEDBACK_SURVEY_ENABLED === 'true';
const feedbackSurveyLink = process.env.NEXT_PUBLIC_FEEDBACK_SURVEY_LINK;

export default function DonationFeedbackPage() {
    const a = useTranslations('actions');
    const t = useTranslations('feedback');
    const { externalDonorId, feedbackData, setDonationData } = useDonation();
    const [isLoading, setIsLoading] = useState(!feedbackData);
    const locale = useLocale();

    useEffect(() => {
        const loadGraphData = async () => {
            if (!feedbackData) {
                try {
                    const donationIdFromCookie = await getDonationId();
                    if (donationIdFromCookie) {
                        const fetchedGraphData = await fetchGraphDataByDonationId(donationIdFromCookie);
                        setDonationData(donationIdFromCookie, fetchedGraphData);
                    }
                } catch (error) {
                    console.error('Error fetching graph data:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadGraphData();
    }, [feedbackData, setDonationData]);

    const handleContinue = () => {
        window.location.href = isFeedbackSurveyEnabled && feedbackSurveyLink
            ? `${feedbackSurveyLink}?UID=${externalDonorId}&lang=${locale}`
            : '/';
    };

    return (
        <Container maxWidth='md' sx={{flexGrow: 1, mt: 4}}>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 'auto'
                }}
            >
                <Typography variant='h4' sx={{my: 2}}>
                    {t('title')}
                </Typography>

                {/* Loading indicator */}
                {isLoading &&
                    <LoadingSpinner message={t('loading')}/>
                }

                {/* Error fetching required data*/}
                {!isLoading && !feedbackData && (
                    <Alert severity='error' sx={{ mt: 2 }}>{t('genericError')}</Alert>
                )}

                {feedbackData && (
                    <>
                        <Alert severity='warning' sx={{ my: 2 }}>
                            <Typography variant='body1'>{t('importantMessage.title')}</Typography>
                            <Typography variant='body2'>
                                {t.rich('importantMessage.disclaimer', {
                                    b: (txt) => <b>{txt}</b>,
                                    u: (txt) => <u>{txt}</u>
                                })}
                            </Typography>
                        </Alert>

                        {Object.entries(feedbackData).map(([source, data]) => (
                            <DataSourceFeedbackSection
                                key={source}
                                dataSourceValue={source}
                                graphData={data}
                            />
                        ))}

                        <Typography variant='body1' sx={{my: 3}}>{t('thanks')}</Typography>
                        <Button variant='contained' onClick={handleContinue}>
                            {a('next')}
                        </Button>
                    </>
                )}
            </Stack>
        </Container>
    );
}