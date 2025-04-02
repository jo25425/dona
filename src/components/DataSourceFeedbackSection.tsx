import React, {ReactNode, useState} from "react";
import {useTranslations} from "next-intl";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import StatisticsCard from "@components/StatisticsCard";
import ChartContainer from "@components/charts/ChartContainer";
import ChartExplanationModal from "@components/charts/ChartExplanationModal";
import MoreChartsModal from "@components/charts/MoreChartsModal";
import {DataSourceValue} from "@models/processed";
import {GraphData} from "@models/graphData";
import {createListOfConversations} from "@services/charts/preprocessing";

export default function DataSourceFeedbackSection({ dataSourceValue, graphData }: { dataSourceValue: string; graphData: GraphData }) {
    const showCustomDataSourceAlert = [DataSourceValue.Facebook, DataSourceValue.Instagram] as string[];

    let t = useTranslations("feedback");
    const labels = useTranslations("feedback.chartLabels");
    const anon = useTranslations("donation.anonymisation");
    const ii = useTranslations("feedback.interactionIntensity");
    const dat = useTranslations("feedback.dailyActivityTimes");
    const rt = useTranslations("feedback.responseTimes");

    // State for ChartExplanationModal
    const [modalContent, setModalContent] = useState<{ title: string; contentHtml: string; imageSrc?: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for MoreChartsModal
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState<"responseTimes" | "dailyActivityTimes" | "interactionIntensity" | null>(null);

    // Handlers for ChartExplanationModal
    const openExplanationModal = (title: string, contentHtml: string, imageSrc?: string) => {
        setModalContent({ title, contentHtml, imageSrc });
        setIsModalOpen(true);
    };
    const closeExplanationModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    // Handlers for MoreChartsModal
    const openSectionModal = (section: "responseTimes" | "dailyActivityTimes" | "interactionIntensity") => {
        setCurrentSection(section);
        setIsSectionModalOpen(true);
    };
    const closeSectionModal = () => {
        setIsSectionModalOpen(false);
        setCurrentSection(null);
    };

    const listOfConversations = createListOfConversations(
        graphData.participantsPerConversation,
        anon("chat"),
        dataSourceValue[0].toUpperCase(),
        labels("chatWith"),
        anon("contactInitial"),
        anon("system")
    );

    const openModalSpan = (content: ReactNode, translator: any, chartName: string) => (
        <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() =>
                openExplanationModal(
                    translator(translator.has(`${chartName}.title`) ? `${chartName}.title` : "title"),
                    translator.raw(`${chartName}.example.text`),
                    translator(`${chartName}.example.image`)
                )
            }
        >
            {content}
        </span>
    );

    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                <Typography variant="h6">{t("sourceTitle", { source: dataSourceValue })}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ width: "100%", overflowX: "hidden" }}>
                <Stack
                    direction="column"
                    spacing={2}
                    sx={{ display: "flex", textAlign: "center", bgcolor: "background.paper" }}
                >
                    {showCustomDataSourceAlert.includes(dataSourceValue) && (
                        <Alert severity="info" sx={{ my: 2 }}>
                            {t("selectedDataMessage", { source: dataSourceValue })}
                        </Alert>
                    )}

                    {/* Statistics card */}
                    <Typography variant="h6">{t("statisticsCard.title")}</Typography>
                    <StatisticsCard stats={graphData.basicStatistics} />

                    {/* Interaction Intensity */}
                    <Typography variant="h6">{ii("title")}</Typography>
                    <Box>
                        <Typography variant="body1" fontWeight="fontWeightBold">
                            {ii("animatedIntensityPolarChart.title")}
                        </Typography>
                        <Typography variant="body2">
                            {ii.rich("animatedIntensityPolarChart.description", {
                                button: (label) => openModalSpan(label, ii, "animatedIntensityPolarChart"),
                            })}
                        </Typography>
                    </Box>
                    <ChartContainer
                        type="animatedIntensityPolarChart"
                        data={graphData}
                        listOfConversations={listOfConversations}
                        dataSourceValue={dataSourceValue}
                    />
                    <Box>
                        <Typography variant="body1" fontWeight="fontWeightBold">
                            {ii("animatedWordCountBarChart.title")}
                        </Typography>
                        <Typography variant="body2">
                            {ii.rich("animatedWordCountBarChart.description", {
                                button: (label) => openModalSpan(label, ii, "animatedWordCountBarChart"),
                            })}
                        </Typography>
                    </Box>
                    <ChartContainer
                        type="animatedWordCountBarChart"
                        data={graphData}
                        listOfConversations={listOfConversations}
                        dataSourceValue={dataSourceValue}
                    />
                    <Button onClick={() => openSectionModal("interactionIntensity")}>
                        {ii("moreAbout")}
                    </Button>

                    {/* Daily Activity Times */}
                    <Typography variant="h6">{dat("title")}</Typography>
                    <Box>
                        <Typography variant="body2">
                            {dat.rich("dailyActivityHoursChart.description", {
                                button: (label) => openModalSpan(label, dat, "dailyActivityHoursChart"),
                            })}
                        </Typography>
                    </Box>
                    <ChartContainer
                        type="dailyActivityHoursChart"
                        data={graphData}
                        listOfConversations={listOfConversations}
                        dataSourceValue={dataSourceValue}
                    />
                    <Button onClick={() => openSectionModal("dailyActivityTimes")}>
                        {dat("moreAbout")}
                    </Button>

                    {/* Response Times */}
                    <Typography variant="h6">{rt("title")}</Typography>
                    <Box>
                        <Typography variant="body2">
                            {rt.rich("responseTimeBarChart.description", {
                                button: (label) => openModalSpan(label, rt, "responseTimeBarChart"),
                            })}
                        </Typography>
                    </Box>
                    <ChartContainer
                        type="responseTimeBarChart"
                        data={graphData}
                        listOfConversations={listOfConversations}
                        dataSourceValue={dataSourceValue}
                    />
                    <Button onClick={() => openSectionModal("responseTimes")}>
                        {rt("moreAbout")}
                    </Button>
                </Stack>
            </AccordionDetails>

            {/* ChartExplanationModal */}
            <ChartExplanationModal
                open={isModalOpen}
                onClose={closeExplanationModal}
                title={modalContent?.title || ""}
                contentHtml={modalContent?.contentHtml || ""}
                imageSrc={modalContent?.imageSrc}
            />

            {/* MoreChartsModal */}
            {currentSection && (
                <MoreChartsModal
                    open={isSectionModalOpen}
                    onClose={closeSectionModal}
                    graphData={graphData}
                    listOfConversations={listOfConversations}
                    section={currentSection}
                />
            )}
        </Accordion>
    );
}
