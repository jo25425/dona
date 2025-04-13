import React from "react";
import {Box, Typography} from "@mui/material";
import ChartContainer, {ChartType} from "@components/charts/ChartContainer";
import {GraphData} from "@models/graphData";
import {useTranslations} from "next-intl";
import FullSizeModal from "@components/FullSizeModal";
import {BlockTitle, MainTitle, RichText} from "@/styles/StyledTypography";

interface MoreChartsModalProps {
    open: boolean;
    onClose: () => void;
    graphData: GraphData;
    section: "responseTimes" | "dailyActivityTimes" | "interactionIntensity";
    showDetailedAudioFeedback: boolean;
}

const MoreChartsModal: React.FC<MoreChartsModalProps> = ({
     open, onClose, graphData, section, showDetailedAudioFeedback
 }) => {
    const sectionTexts = useTranslations(`feedback.${section}`);

    const chartsData = (
        section == "interactionIntensity" ?
            showDetailedAudioFeedback ?
                [
                    {"headerKey": "textHeader"},
                    {"descriptionKey": "wordCountOverallBarChart", "chartType": ChartType.WordCountOverallBarChart},
                    {"descriptionKey": "wordCountSlidingWindowMean", "chartType": ChartType.WordCountSlidingWindowMean},
                    {"headerKey": "audioHeader"},
                    {"descriptionKey": "secondCountOverallBarChart", "chartType": ChartType.SecondCountOverallBarChart},
                    {"descriptionKey": "secondCountSlidingWindowMean", "chartType": ChartType.SecondCountSlidingWindowMean}
                ]
            :
                [
                    {"descriptionKey": "wordCountOverallBarChart", "chartType": ChartType.WordCountOverallBarChart},
                    {"descriptionKey": "wordCountSlidingWindowMean", "chartType": ChartType.WordCountSlidingWindowMean}
                ]
        : section == "dailyActivityTimes" ?
            [
                {"descriptionKey": "dayPartsOverall", "chartType": ChartType.DayPartsActivityOverallChart},
                {"descriptionKey": "dayPartsMonthly", "chartType": ChartType.AnimatedDayPartsActivityChart}
            ]
        : section == "responseTimes" ?
            [
                {"descriptionKey": "responseTimeBarChartMonthly", "chartType": ChartType.AnimatedResponseTimeBarChart}
            ]
        : []
    );

    return (
        <FullSizeModal open={open} onClose={onClose}>
            <MainTitle variant="h5">
                {sectionTexts("moreAbout")}
            </MainTitle>
            <Box sx={{textAlign: "center"}}>
                {chartsData.map(({headerKey, descriptionKey, chartType}, chartIndex) => (
                    <Box key={chartIndex} mb={4}>
                        {headerKey && (
                            <BlockTitle>{sectionTexts(headerKey)}</BlockTitle>
                        )}
                        {descriptionKey && (
                            <RichText>{sectionTexts.rich(`${descriptionKey}.description`)}</RichText>
                        )}
                        {chartType && (
                            <ChartContainer type={chartType} data={graphData}/>
                        )}
                    </Box>
                ))}
            </Box>
        </FullSizeModal>
    );
};

export default MoreChartsModal;
