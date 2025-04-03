import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    PointElement,
    Filler
} from "chart.js";
import DownloadButtons from "@components/charts/DownloadButtons";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import { DailySentReceivedPoint } from "@models/graphData";
import { CHART_COLORS, CHART_LAYOUT, COMMON_CHART_OPTIONS, TOP_LEGEND } from "@components/charts/chartConfig";
import Typography from "@mui/material/Typography";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

interface SentReceivedSlidingWindowChartProps {
    slidingWindowMeanDailyWords: DailySentReceivedPoint[];
}

const SentReceivedSlidingWindowChart: React.FC<SentReceivedSlidingWindowChartProps> = ({
                                                                                           slidingWindowMeanDailyWords,
                                                                                       }) => {
    const CHART_NAME = "sent-received-sliding-window";
    const container_name = `chart-wrapper-${CHART_NAME}`;
    const selection_label_name = `select-label-${CHART_NAME}`;

    const labelTexts = useTranslations("feedback.chartLabels");
    const chartTexts = useTranslations("feedback.interactionIntensity.sentReceivedSlidingWindowMean");

    const chartData = useMemo(() => {
        const labels = slidingWindowMeanDailyWords.map((data) => new Date(data.epochSeconds * 1000).toISOString().split("T")[0]);
        const sentData = slidingWindowMeanDailyWords.map((data) => data.sentCount);
        const receivedData = slidingWindowMeanDailyWords.map((data) => data.receivedCount);

        return {
            labels,
            datasets: [
                {
                    label: chartTexts("legend.sent"),
                    data: sentData,
                    borderColor: CHART_COLORS.primaryBar,
                    backgroundColor: CHART_COLORS.primaryTransparent,
                    fill: true,
                    pointRadius: 3,
                },
                {
                    label: chartTexts("legend.received"),
                    data: receivedData,
                    borderColor: CHART_COLORS.secondaryBar,
                    backgroundColor: CHART_COLORS.secondaryTransparent,
                    fill: true,
                    pointRadius: 3,
                },
            ],
        };
    }, [slidingWindowMeanDailyWords, chartTexts]);

    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", width: "100%" }}>
            <Box sx={{ flex: 1, position: "relative", width: "100%" }}>
                <Box id={container_name} p={CHART_LAYOUT.paddingX} sx={{ mt: -2, pt: 0 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography id={selection_label_name} variant="body2" align="right">
                            <b>{labelTexts("overallData")}</b>
                        </Typography>
                        <DownloadButtons chartId={container_name} fileNamePrefix={CHART_NAME} currentLabel={labelTexts("overallData")} labelToShowId={selection_label_name} />
                    </Box>
                    <Box sx={{ width: "100%", minHeight: "250px" }}>
                        <Line
                            data={chartData}
                            options={{
                                ...COMMON_CHART_OPTIONS,
                                spanGaps: 1000 * 60 * 60 * 24 * 2, // Show gaps from 2 days in the data
                                plugins: { legend: TOP_LEGEND },
                                scales: {
                                    x: {
                                        type: "time",
                                        time: {
                                            unit: "month",
                                            tooltipFormat: "dd-MM-yyyy",
                                            displayFormats: {
                                                day: "MM-yyyy",
                                            },
                                        },
                                        title: { display: false },
                                        ticks: {
                                            ...COMMON_CHART_OPTIONS.scales.x.ticks,
                                            maxRotation: 45,
                                            minRotation: 45,
                                        },
                                    },
                                    y: {
                                        ...COMMON_CHART_OPTIONS.scales.y,
                                        title: { display: true, text: chartTexts("yAxis") },
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SentReceivedSlidingWindowChart;