import React from "react";
import {Bar} from "react-chartjs-2";
import {useTranslations} from "next-intl";
import {DailyHourPoint} from "@models/graphData";
import Box from "@mui/material/Box";
import DownloadButtons from "@components/charts/DownloadButtons";
import {BARCHART_OPTIONS, CHART_COLORS, CHART_LAYOUT, TOOLTIP, TOP_LEGEND} from "@components/charts/chartConfig";

interface DayPartsActivityOverallPlotProps {
    dailySentHoursPerConversation: DailyHourPoint[][];
    dailyReceivedHoursPerConversation: DailyHourPoint[][];
}

const DayPartsActivityOverallChart: React.FC<DayPartsActivityOverallPlotProps> = ({
                                                                                     dailySentHoursPerConversation,
                                                                                     dailyReceivedHoursPerConversation,
                                                                                 }) => {
    const CHART_NAME = "dayparts-activity-overall-barchart";
    const container_name = `chart-wrapper-${CHART_NAME}`;

    const chartTexts = useTranslations("feedback.dailyActivityTimes.dayPartsOverall");

    const buckets = ["00:00-05:59", "06:00-11:59", "12:00-17:59", "18:00-23:59"];
    const sentCounts = [0, 0, 0, 0];
    const receivedCounts = [0, 0, 0, 0];

    dailySentHoursPerConversation.forEach((conversation) => {
        conversation.forEach((point) => {
            const bucketIndex =
                point.hour < 6 ? 0 : point.hour < 12 ? 1 : point.hour < 18 ? 2 : 3;
            sentCounts[bucketIndex] += point.wordCount;
        });
    });

    dailyReceivedHoursPerConversation.forEach((conversation) => {
        conversation.forEach((point) => {
            const bucketIndex =
                point.hour < 6 ? 0 : point.hour < 12 ? 1 : point.hour < 18 ? 2 : 3;
            receivedCounts[bucketIndex] += point.wordCount;
        });
    });

    const totalSent = sentCounts.reduce((sum, count) => sum + count, 0);
    const totalReceived = receivedCounts.reduce((sum, count) => sum + count, 0);

    const chartData = {
        labels: buckets,
        datasets: [
            {
                label: chartTexts("legend.received"),
                data: receivedCounts.map((count) => (totalReceived > 0 ? (count / totalReceived) * 100 : 0)),
                backgroundColor: CHART_COLORS.secondaryBar,
                barPercentage: 0.5,
            },
            {
                label: chartTexts("legend.sent"),
                data: sentCounts.map((count) => (totalSent > 0 ? (count / totalSent) * 100 : 0)),
                backgroundColor: CHART_COLORS.primaryBar,
                barPercentage: 0.8,
            },
        ]
    };

    const options = {
        ...BARCHART_OPTIONS,
        plugins: {
            legend: TOP_LEGEND,
            tooltip: TOOLTIP,
        },
        scales: {
            x: {
                ...BARCHART_OPTIONS.scales.x,
                title: { display: true, text: chartTexts("xAxis") },
                stacked: true,
            },
            y: {
                ...BARCHART_OPTIONS.scales.y,
                title: { display: true, text: chartTexts("yAxis") }
            },
        },
    };

    return (
        <Box id={container_name} position="relative" p={CHART_LAYOUT.paddingX}>
            <Box display="flex" justifyContent="right" alignItems="center" mb={1}>
                <DownloadButtons chartId={container_name} fileNamePrefix={CHART_NAME} />
            </Box>
            <Box sx={{ width: "100%", height: CHART_LAYOUT.responsiveChartHeight }}>
                <Bar data={chartData} options={options} />
            </Box>
        </Box>
    );
};

export default DayPartsActivityOverallChart;
