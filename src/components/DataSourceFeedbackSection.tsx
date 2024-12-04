import React, {useState} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChartContainer from "@components/ChartContainer";
import ChartExplanationModal from "@components/ChartExplanationModal";
import {useTranslations} from "next-intl";
import {Conversation, DataSourceValue} from "@models/processed";
import Alert from "@mui/material/Alert";

export default function DataSourceFeedbackSection({ dataSourceValue, conversations }: { dataSourceValue: string, conversations: Conversation[] }) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const t = useTranslations('feedback');

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">{t("graph.title", {source: dataSourceValue})}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {dataSourceValue == DataSourceValue.Facebook && (
                    <Alert severity="info" sx={{ mt: 2 }}>{t('facebook.info')}</Alert>
                )}
                {dataSourceValue == DataSourceValue.Instagram && (
                    <Alert severity="info" sx={{ mt: 2 }}>{t('instagram.info')}</Alert>
                )}
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="h6">{t('chartTitle1')}</Typography>
                        <ChartContainer />
                        <Button onClick={handleModalOpen}>{t('chartExplanation')}</Button>
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="h6">{t('chartTitle2')}</Typography>
                        <ChartContainer />
                        <Button onClick={handleModalOpen}>{t('chartExplanation')}</Button>
                    </Grid>
                </Grid>
                <ChartExplanationModal
                    open={modalOpen}
                    onClose={handleModalClose}
                    explanation={t('chartExplanationText')}
                />
            </AccordionDetails>
        </Accordion>
    );
}
