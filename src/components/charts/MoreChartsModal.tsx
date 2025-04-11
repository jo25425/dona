import React from "react";
import {Box, Typography} from "@mui/material";
import ChartContainer, {ChartType} from "@components/charts/ChartContainer";
import {GraphData} from "@models/graphData";
import {useTranslations} from "next-intl";
import FullSizeModal from "@components/FullSizeModal";

interface MoreChartsModalProps {
    open: boolean;
    onClose: () => void;
    graphData: GraphData;
    section: "responseTimes" | "dailyActivityTimes" | "interactionIntensity";
}

const MoreChartsModal: React.FC<MoreChartsModalProps> = ({
                                                             open,
                                                             onClose,
                                                             graphData,
                                                             section,
                                                         }) => {
    const t = useTranslations(`feedback.${section}`);

    const chartsData = (
        section == "interactionIntensity" ?
           [
               {"descriptionKey": "wordCountOverallBarChart", "chartType": ChartType.WordCountOverallBarChart},
               {"descriptionKey": "sentReceivedSlidingWindowMean", "chartType": ChartType.SentReceivedSlidingWindowMean}
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
            <Typography variant="h6" mb={2}>
                {t("moreAbout")}
            </Typography>
            <Box sx={{textAlign: "center"}}>
                {chartsData.map(({descriptionKey, chartType}, index) => (
                    <Box key={index} mb={4}>
                        <Typography
                            variant="body1" mb={2}
                            dangerouslySetInnerHTML={{ __html: t.raw(`${descriptionKey}.description`)}}
                        />
                        <ChartContainer
                            type={chartType}
                            data={graphData}
                        />
                    </Box>
                ))}
            </Box>
        </FullSizeModal>
    );
};

export default MoreChartsModal;
