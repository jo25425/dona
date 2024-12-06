import React, {useState} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChartContainer from "@components/ChartContainer";
import ChartExplanationModal from "@components/ChartExplanationModal";
import {useTranslations} from "next-intl";
import {Conversation, DataSourceValue} from "@models/processed";
import Alert from "@mui/material/Alert";
import StatisticsCard from "@components/StatisticsCard";
import {GraphData} from "@models/graphData";

export default function DataSourceFeedbackSection({ dataSourceValue, graphData }: { dataSourceValue: string, graphData: GraphData }) {
    const t = useTranslations('feedback');
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const showCustomDataSourceAlert = [DataSourceValue.Facebook, DataSourceValue.Instagram] as string[];

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">{t("graph.title", {source: dataSourceValue})}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {showCustomDataSourceAlert.includes(dataSourceValue) && (
                    <Alert severity="info" sx={{ my: 2 }}>
                        {t(`${dataSourceValue.toLowerCase()}.info`)}
                    </Alert>
                )}
                {/* Overview */}
                <StatisticsCard stats={graphData.basicStatistics} />
                {/* Interaction Intensity */}
                {/*<Grid container spacing={2} sx={{mt: 2}}>*/}
                {/*    <Grid size={12} sx={{textAlign: "center"}}>*/}
                {/*        <Typography variant="h6" >*/}
                {/*            {t("sectionTitles.interactionIntensity")}*/}
                {/*        </Typography>*/}
                {/*    </Grid>*/}
                {/*    <Grid size={{xs: 12, sm: 6}}>*/}
                {/*        <ChartContainer*/}
                {/*            type="PolarPlot"*/}
                {/*            data={polarPlotData}*/}
                {/*        />*/}
                {/*        <Button onClick={() => setModalOpen(true)}>{t('chartExplanation')}</Button>*/}
                {/*    </Grid>*/}
                {/*    <Grid size={{xs: 12, sm: 6}}>*/}
                {/*        <ChartContainer*/}
                {/*            type="BarChart"*/}
                {/*            data={barChartData}*/}
                {/*        />*/}
                {/*        <Button onClick={() => setModalOpen(true)}>{t('chartExplanation')}</Button>*/}
                {/*    </Grid>*/}
                {/*</Grid>*/}
                {/*<ChartExplanationModal*/}
                {/*    open={modalOpen}*/}
                {/*    onClose={() => setModalOpen(false)}*/}
                {/*    explanation={t('chartExplanationText')}*/}
                {/*/>*/}
            </AccordionDetails>
        </Accordion>
    );
}
