"use client";

import {useTranslations} from 'next-intl';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import React, {useState} from "react";
import MultiFileSelect from '@components/MultiFileSelect';
import {Conversation, DataSourceValue} from "@models/processed";
import {addDonation} from './actions';
import {useAliasConfig} from "@services/parsing/shared/aliasConfig";

export default function DataDonationPage() {
    const a = useTranslations('actions');
    const t = useTranslations('donation');
    useAliasConfig(); // Will allow donation logic to use translations for aliases in anonymization

    // State to hold the donated conversations from all multiselect elements
    const [allDonatedConversations, setAllDonatedConversations] = useState<Conversation[]>([]);

    // Callback to handle donated conversations changes from child components
    const handleDonatedConversationsChange = (newConversations: Conversation[]) => {
        setAllDonatedConversations((prevDonatedConversations) => [...prevDonatedConversations, ...newConversations]); // Add new donated conversations to the existing list
    };

    // On "Submit" click
    const onDataDonationUpload = () => {
        if (allDonatedConversations.length > 0) {
            const newDonation = {
                // id?: string,
                donorId: "unknown",
                // status?: DonationStatus, DonationStatus.NotStarted?
                // externalDonorId?: ExternalDonorId,
                conversations: allDonatedConversations
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
                                {t("select-data.datasource.title-format", {datasource: "Whatsapp"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect dataSourceValue={DataSourceValue.WhatsApp} onDonatedConversationsChange={handleDonatedConversationsChange} />
                        </AccordionDetails>
                    </Accordion>
                    {/* Facebook */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <FacebookIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("select-data.datasource.title-format", {datasource: "Facebook"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect dataSourceValue={DataSourceValue.Facebook} onDonatedConversationsChange={handleDonatedConversationsChange} />
                        </AccordionDetails>
                    </Accordion>
                    {/* Instagram */}
                    <Accordion sx={{my: 1}}>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            <InstagramIcon sx={{mr: 1, mt: 0.5}}/>
                            <Typography variant="h6">
                                {t("select-data.datasource.title-format", {datasource: "Instagram"})}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MultiFileSelect dataSourceValue={DataSourceValue.Instagram} onDonatedConversationsChange={handleDonatedConversationsChange} />
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