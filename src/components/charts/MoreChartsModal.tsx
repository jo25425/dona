import React from "react";
import {Box, Typography} from "@mui/material";
import ChartContainer from "@components/charts/ChartContainer";
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
               {"descriptionKey": "wordCountOverallBarChart", "chartType": "wordCountOverallBarChart"},
               {"descriptionKey": "sentReceivedSlidingWindowMean", "chartType": "sentReceivedSlidingWindowMean"}
           ]
        : section == "dailyActivityTimes" ?
            [
                {"descriptionKey": "dayPartsOverall", "chartType": "dayPartsActivityOverallChart"},
                {"descriptionKey": "dayPartsMonthly", "chartType": "animatedDayPartsActivityChart"}
            ]
        : section == "responseTimes" ?
            [
                {"descriptionKey": "responseTimeBarChartMonthly", "chartType": "animatedResponseTimeBarChart"}
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
