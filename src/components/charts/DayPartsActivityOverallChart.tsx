import React from "react";
import { Bar } from "react-chartjs-2";
import {useTranslations} from "next-intl";
import { DailyHourPoint } from "@models/graphData";
import Box from "@mui/material/Box";
import DownloadButtons from "@components/charts/DownloadButtons";

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

    const t = useTranslations("feedback.dailyActivityTimes.dayPartsOverall");

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
                label: t("legend.received"),
                data: receivedCounts.map((count) => (totalReceived > 0 ? (count / totalReceived) * 100 : 0)),
                backgroundColor: "#FF8800",
                barPercentage: 0.5,
            },
            {
                label: t("legend.sent"),
                data: sentCounts.map((count) => (totalSent > 0 ? (count / totalSent) * 100 : 0)),
                backgroundColor: "#1f77b4",
                barPercentage: 0.8,
            },
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            tooltip: {
                callbacks: { label: (context: any) => `${context.raw?.toFixed(2)}%` },
            },
        },
        scales: {
            x: {
                title: { display: true, text: t("xAxis") },
                grid: { drawOnChartArea: false },
                stacked: true,
            },
            y: {
                title: { display: true, text: t("yAxis") },
                ticks: { callback: (value: number | string) => `${value}%` },
            },
        },
    };

    return (
        <Box p={2} pt={0} id={container_name} position="relative">
            <Box display="flex" justifyContent="right" alignItems="center" mb={-2}>
                <DownloadButtons chartId={container_name} fileNamePrefix={CHART_NAME} />
            </Box>
            <Box sx={{ width: "100%", height: 400 }}>
                <Bar data={chartData} options={options} />
            </Box>
        </Box>
    );
};

export default DayPartsActivityOverallChart;
