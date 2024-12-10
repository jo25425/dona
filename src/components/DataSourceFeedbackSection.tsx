import React, {ReactNode, useState} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChartContainer from "@components/ChartContainer";
import {useTranslations} from "next-intl";
import {DataSourceValue} from "@models/processed";
import Alert from "@mui/material/Alert";
import StatisticsCard from "@components/StatisticsCard";
import {GraphData} from "@models/graphData";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ChartExplanationModal from "@components/ChartExplanationModal";
import {createListOfConversations} from "@services/charts/preprocessing";

export default function DataSourceFeedbackSection({ dataSourceValue, graphData }: { dataSourceValue: string, graphData: GraphData }) {
    const showCustomDataSourceAlert = [DataSourceValue.Facebook, DataSourceValue.Instagram] as string[];

    // Translation functions separate for clarity -> general and per section
    let t = useTranslations('feedback');
    const labels = useTranslations("feedback.graph.labels");
    const anon = useTranslations("donation.anonymisation");
    const ii = useTranslations('feedback.graph.interactionIntensity');
    const dat = useTranslations('feedback.graph.dailyActivityTimes');
    const rt = useTranslations('feedback.graph.responseTimes');

    // State
    const [modalContent, setModalContent] = useState<{ title: string; contentHtml: string; imageSrc?: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (title: string, contentHtml: string, imageSrc?: string) => {
        setModalContent({ title, contentHtml, imageSrc });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    const chatInitial = dataSourceValue[0].toUpperCase();
    const chatWith: string = labels("chatWith");
    const contactInitial: string = anon("friendInitial"); //TODO: Change to "contacts" everywhere..
    const chatLabel: string = anon("chat");
    const systemName: string = anon("system");
    const listOfConversations = createListOfConversations(
        graphData.participantsPerConversation,
        chatLabel,
        chatInitial,
        chatWith,
        contactInitial,
        systemName
    );

    const openModalSpan = (content: ReactNode, translator: any, plotName: string) => (
        <span
            style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}
            onClick={() =>
                openModal(
                    translator(translator.has(`${plotName}.title`) ? `${plotName}.title`: "title"),
                    translator.raw(`${plotName}.example.text`),
                    translator(`${plotName}.example.image`)
                )
            }
        >
            {content}
        </span>
    );

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">{t("sourceTitle", {source: dataSourceValue})}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack direction="column" spacing={2} sx={{textAlign: "center", bgcolor: "background.paper"}}>
                    {showCustomDataSourceAlert.includes(dataSourceValue) && (
                        <Alert severity="info" sx={{ my: 2 }}>
                            {t("selectedDataMessage", {source: dataSourceValue})}
                        </Alert>
                    )}

                    {/* Statistics card */}
                    <Typography variant="h6" >
                        {t("graph.statisticsCard.title")}
                    </Typography>
                    <StatisticsCard stats={graphData.basicStatistics} />

                    {/* Interaction Intensity */}
                    <Typography variant="h6">{ii("title")}</Typography>
                    <Box>
                        <Typography variant="body1" fontWeight="fontWeightBold">
                            {ii("animatedPolarPlot.title")}
                        </Typography>
                        <Typography variant="body2">
                            {ii.rich("animatedPolarPlot.description", {
                                button: (label) => openModalSpan(label, ii, "animatedPolarPlot")
                            })}
                        </Typography>
                    </Box>
                    <ChartContainer
                        type="animatedPolarPlot"
                        data={graphData}
                        listOfConversations={listOfConversations}
                        dataSourceValue={dataSourceValue}
                    />
                    <Box>
                        <Typography variant="body1" fontWeight="fontWeightBold">
                        {ii("animatedHorizontalBarChart.title")}
                        </Typography>
                        <Typography variant="body2">
                            {ii.rich("animatedHorizontalBarChart.description", {
                                button: (label) => openModalSpan(label, ii, "animatedHorizontalBarChart")
                            })}
                        </Typography>
                    </Box>
                    <ChartContainer
                        type="animatedHorizontalBarChart"
                        data={graphData}
                        listOfConversations={listOfConversations}
                        dataSourceValue={dataSourceValue}
                    />
                    <Button>{ii('moreAbout')}</Button>

                    {/* Daily Activity Times */}
                    <Typography variant="h6" >
                        {dat("title")}
                    </Typography>
                    <Box>
                        <Typography variant="body2">
                            {dat.rich("dailyActivityHoursPlot.description", {
                                button: (label) => openModalSpan(label, dat, "dailyActivityHoursPlot")
                            })}
                        </Typography>
                    </Box>
                    <ChartContainer
                        type="DailyActivityHoursPlot"
                        data={graphData}
                        listOfConversations={listOfConversations}
                        dataSourceValue={dataSourceValue}
                    />
                    <Button>{dat('moreAbout')}</Button>

                    {/* Response Times */}
                    <Typography variant="h6" >
                        {rt("title")}
                    </Typography>
                    <Box>
                        <Typography variant="body2">
                            {rt.rich("responseTimeBarChart.description", {
                                button: (label) => openModalSpan(label, rt, "responseTimeBarChart")
                            })}
                        </Typography>
                    </Box>
                    <ChartContainer
                        type="responseTimeBarChart"
                        data={graphData}
                        listOfConversations={listOfConversations}
                        dataSourceValue={dataSourceValue}
                    />
                    <Button>{rt('moreAbout')}</Button>

                </Stack>
            </AccordionDetails>
            {modalContent && (
                <ChartExplanationModal
                    open={isModalOpen}
                    onClose={closeModal}
                    title={modalContent.title}
                    contentHtml={modalContent.contentHtml}
                    imageSrc={modalContent.imageSrc}
                />
            )}
        </Accordion>
    );
}
