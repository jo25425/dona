"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRichTranslations } from "@/hooks/useRichTranslations";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { Conversation, DataSourceValue } from "@models/processed";
import { addDonation } from "./actions";
import { useAliasConfig } from "@/services/parsing/shared/aliasConfig";
import MultiFileSelect from "@/components/MultiFileSelect";
import { useDonation } from "@/context/DonationContext";
import { useTranslations } from "next-intl";

type ConversationsBySource = Record<DataSourceValue, Conversation[]>;

export default function DataDonationPage() {
    const router = useRouter();
    const actions = useTranslations("actions");
    const donation = useRichTranslations("donation");
    const donorStrings = useRichTranslations("donor-id");
    const aliasConfig = useAliasConfig();
    const { setDonationData, loadExternalDonorIdFromCookie, externalDonorId } = useDonation();
    const [allDonatedConversationsBySource, setAllDonatedConversationsBySource] = useState<ConversationsBySource>({} as ConversationsBySource);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!externalDonorId) {
            loadExternalDonorIdFromCookie();
        }
    }, [externalDonorId]);

    const handleDonatedConversationsChange = (dataSource: DataSourceValue, newConversations: Conversation[]) => {
        setAllDonatedConversationsBySource((prev) => ({
            ...prev,
            [dataSource]: newConversations,
        }));
        setValidated(true);
    };

    const donationChangeWrapper = (dataSource: DataSourceValue) => {
        return (newConversations: Conversation[]) => handleDonatedConversationsChange(dataSource, newConversations);
    };

    const onDataDonationUpload = async () => {
        setLoading(true);
        setError(false);

        const allConversations = Object.values(allDonatedConversationsBySource).flat();
        if (allConversations.length > 0) {
            try {
                const result = await addDonation(allConversations, aliasConfig.donorAlias, externalDonorId);
                if (result.success && result.donationId && result.graphDataRecord) {
                    setDonationData(result.donationId, result.graphDataRecord);
                    router.push("/donation-feedback");
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ flexGrow: 1 }}>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ my: 2 }}>
                        {donation.t("select-data.title")}
                    </Typography>
                    <Typography variant="body1">
                        {donorStrings.t("your-id")}: {externalDonorId}
                    </Typography>
                    <br />
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
                {loading && <CircularProgress />}
                {!error && !loading && (
                    <Box>
                        <Typography variant="body1">{donation.t("select-data.body1")}</Typography>
                        <br />
                        <Typography variant="body1">{donation.rich("select-data.body2")}</Typography>
                    </Box>
                )}
                <Box sx={{ my: 4, minWidth: "80%", textAlign: "left" }}>
                    {[DataSourceValue.WhatsApp, DataSourceValue.Facebook, DataSourceValue.Instagram].map((source) => (
                        <Accordion key={source} sx={{ my: 1 }}>
                            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                                {source === DataSourceValue.WhatsApp && <WhatsAppIcon sx={{ mr: 1, mt: 0.5 }} />}
                                {source === DataSourceValue.Facebook && <FacebookIcon sx={{ mr: 1, mt: 0.5 }} />}
                                {source === DataSourceValue.Instagram && <InstagramIcon sx={{ mr: 1, mt: 0.5 }} />}
                                <Typography variant="h6">
                                    {donation.t("datasource-title_format", { datasource: source })}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <MultiFileSelect
                                    dataSourceValue={source}
                                    onDonatedConversationsChange={donationChangeWrapper(source)}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                <Box>
                    <Stack spacing={2} direction='row' sx={{justifyContent: 'center'}}>
                        <Button variant='contained' href='/instructions'>
                            {actions('previous')}
                        </Button>
                        <Button variant='contained' onClick={onDataDonationUpload} disabled={loading || !validated}>
                            {actions('submit')}
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}
