"use client";

import React, {useState} from "react";
import {useTranslations} from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {Conversation, DataSourceValue, DonationStatus} from "@models/processed";
import {addDonation} from './actions';
import {useAliasConfig} from "@services/parsing/shared/aliasConfig";
import MultiFileSelect from '@components/MultiFileSelect';

type ConversationsBySource = Record<DataSourceValue, Conversation[]>;

export default function DataDonationPage() {
    const a = useTranslations('actions');
    const t = useTranslations('donation');
    useAliasConfig(); // Will allow donation logic to use translations for aliases in anonymization

    const [allDonatedConversationsBySource, setAllDonatedConversationsBySource] = useState<ConversationsBySource>({} as ConversationsBySource);

    // Callback to handle donated conversations changes from child components
    const handleDonatedConversationsChange = (dataSource: DataSourceValue, newConversations: Conversation[]) => {
        setAllDonatedConversationsBySource((prevConversations) => ({
            ...prevConversations,
            [dataSource]: newConversations, // Replace conversations for the given data source
        }));
    };
    const donationChangeWrapper = (dataSource: DataSourceValue) => {
        return (newConversations: Conversation[]) => handleDonatedConversationsChange(dataSource, newConversations);
    };

    // On "Submit" click
    const onDataDonationUpload = () => {
        const allConversations = Object.values(allDonatedConversationsBySource).flat();
        if (allConversations.length > 0) {
            const newDonation = {
                donorId: uuidv4(),
                status: DonationStatus.Complete,
                conversations: allConversations,
            };
            // TODO: Return status and use it for feedback on the page
            addDonation(newDonation)
        }
    };

    return (
        <Container maxWidth="md" sx={{flexGrow: 1}}>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{my: 2}}>
                        {t('select-data.title')}
                    </Typography>
                    <Typography variant="body1">
                        {t('select-data.body1')}
                    </Typography>
                    <br/>
                    <Typography variant="body1">
                        {t.rich('select-data.body2')}
                    </Typography>
                </Box>
                <Box sx={{my: 4, minWidth: "80%", textAlign: 'left'}}>
                    {/* WhatsApp */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <WhatsAppIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("datasource-title_format", {datasource: "Whatsapp"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect
                                dataSourceValue={DataSourceValue.WhatsApp}
                                onDonatedConversationsChange={donationChangeWrapper(DataSourceValue.WhatsApp)}
                            />
                        </AccordionDetails>
                    </Accordion>
                    {/* Facebook */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <FacebookIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("datasource-title_format", {datasource: "Facebook"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect
                                dataSourceValue={DataSourceValue.Facebook}
                                onDonatedConversationsChange={donationChangeWrapper(DataSourceValue.Facebook)}
                            />
                        </AccordionDetails>
                    </Accordion>
                    {/* Instagram */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <InstagramIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("datasource-title_format", {datasource: "Instagram"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect
                                dataSourceValue={DataSourceValue.Instagram}
                                onDonatedConversationsChange={donationChangeWrapper(DataSourceValue.Instagram)}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box>
                    <Stack spacing={2} direction="row" sx={{justifyContent: "center"}}>
                        <Button variant="contained" href="/instructions">
                            {a('previous')}
                        </Button>
                        <Button variant="contained" onClick={onDataDonationUpload} >
                            {a('submit')}
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}