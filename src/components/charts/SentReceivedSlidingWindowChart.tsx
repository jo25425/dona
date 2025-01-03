import React, { useState, useMemo } from "react";
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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { DailySentReceivedPoint } from "@models/graphData";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const ALL_CHATS = "ALL_CHATS";

interface SentReceivedSlidingWindowChartProps {
    slidingWindowMeanPerConversation: DailySentReceivedPoint[][];
    listOfConversations: string[];
}

const SentReceivedSlidingWindowChart: React.FC<SentReceivedSlidingWindowChartProps> = ({
                                                                                           slidingWindowMeanPerConversation,
                                                                                           listOfConversations,
                                                                                       }) => {
    const CHART_NAME = "sent-received-sliding-window";
    const container_name = `chart-wrapper-${CHART_NAME}`;
    const selection_label_name = `select-label-${CHART_NAME}`;

    const labelTexts = useTranslations("feedback.chartLabels");
    const chartTexts = useTranslations("feedback.interactionIntensity.sentReceivedSlidingWindowMean");

    const [selectedConversation, setSelectedConversation] = useState<string>(ALL_CHATS);

    // Aggregate data for "ALL_CHATS" and individual conversations
    const aggregatedData = useMemo(() => {
        if (selectedConversation === ALL_CHATS) {
            const aggregate: Record<string, { sentSum: number; receivedSum: number; count: number }> = {};

            slidingWindowMeanPerConversation.forEach((conversationData) => {
                conversationData.forEach((point) => {
                    const key = point.epochSeconds; // Use epochSeconds for unique identification
                    if (!aggregate[key]) {
                        aggregate[key] = { sentSum: 0, receivedSum: 0, count: 0 };
                    }
                    aggregate[key].sentSum += point.sentCount;
                    aggregate[key].receivedSum += point.receivedCount;
                    aggregate[key].count++;
                });
            });

            return Object.keys(aggregate)
                .sort((a, b) => Number(a) - Number(b))
                .map((key) => ({
                    epochSeconds: Number(key),
                    sentMean: aggregate[key].sentSum / aggregate[key].count,
                    receivedMean: aggregate[key].receivedSum / aggregate[key].count,
                }));
        }

        const conversationIndex = listOfConversations.indexOf(selectedConversation);
        if (conversationIndex === -1) return [];

        return slidingWindowMeanPerConversation[conversationIndex].map((point) => ({
            epochSeconds: point.epochSeconds,
            sentMean: point.sentCount,
            receivedMean: point.receivedCount,
        }));
    }, [slidingWindowMeanPerConversation, selectedConversation, listOfConversations]);

    // Generate chart data
    const generateChartData = () => {
        const labels = aggregatedData.map((data) => new Date(data.epochSeconds * 1000).toISOString().split("T")[0]);
        const sentData = aggregatedData.map((data) => data.sentMean);
        const receivedData = aggregatedData.map((data) => data.receivedMean);

        return {
            labels,
            datasets: [
                {
                    label: chartTexts("legend.sent"),
                    data: sentData,
                    borderColor: "#1f77b4",
                    backgroundColor: "rgba(31, 119, 180, 0.2)",
                    fill: true,
                    pointRadius: 3,
                },
                {
                    label: chartTexts("legend.received"),
                    data: receivedData,
                    borderColor: "#ff7f0e",
                    backgroundColor: "rgba(255, 127, 14, 0.2)",
                    fill: true,
                    pointRadius: 3,
                },
            ],
        };
    };

    return (
        <Box>
            <Box id={container_name} position="relative" px={2} py={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Select
                        value={selectedConversation}
                        onChange={(e) => setSelectedConversation(e.target.value)}
                        size="small"
                        variant="outlined"
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value={ALL_CHATS} sx={{ fontSize: 12 }}>
                            {labelTexts("overallData")}
                        </MenuItem>
                        {listOfConversations.map((conversation) => (
                            <MenuItem sx={{ fontSize: 12 }} key={conversation} value={conversation}>
                                {conversation}
                            </MenuItem>
                        ))}
                    </Select>
                    <DownloadButtons
                        chartId={container_name}
                        fileNamePrefix={CHART_NAME}
                        currentLabel={selectedConversation}
                        labelToShowId={selection_label_name}
                    />
                </Box>
                <Line
                    data={generateChartData()}
                    options={{
                        responsive: true,
                        spanGaps: 1000 * 60 * 60 * 24 * 2, // Show gaps from 2 days in the data
                        plugins: {
                            legend: { display: true, position: "top" },
                        },
                        scales: {
                            x: {
                                type: "time",
                                time: {
                                    unit: "day",
                                    tooltipFormat: "dd-MM-yyyy",
                                    displayFormats: {
                                        day: "dd-MM-yyyy",
                                    },
                                },
                                title: { display: false },
                                ticks: { maxRotation: 45, minRotation: 45 },
                            },
                            y: {
                                title: { display: true, text: chartTexts("yAxis") },
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default SentReceivedSlidingWindowChart;
