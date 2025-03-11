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
import {CHART_COLORS, CHART_LAYOUT, COMMON_CHART_OPTIONS, TOP_LEGEND} from "@components/charts/chartConfig";
import Typography from "@mui/material/Typography";

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
    };

    return (

    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", width: "100%" }}>
        <Box sx={{ flex: 1, position: "relative", width: "100%" }}>
            <Select
                value={selectedConversation}
                onChange={(e) => setSelectedConversation(e.target.value)}
                size="small"
                variant="outlined"
                sx={{ mb: -2, pb: 0, fontSize: CHART_LAYOUT.labelFontSize }}
            >
                <MenuItem value={ALL_CHATS} sx={{ fontSize: CHART_LAYOUT.labelFontSize }}>{labelTexts("overallData")}</MenuItem>
                {listOfConversations.map((conversation) => (
                    <MenuItem sx={{ fontSize: CHART_LAYOUT.labelFontSize }} key={conversation} value={conversation}>
                        {conversation}
                    </MenuItem>
                ))}
            </Select>
            <Box id={container_name} p={CHART_LAYOUT.paddingX} sx={{ mt: -2, pt: 0}}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography id={selection_label_name} variant="body2" align="right">
                        <b>{selectedConversation === ALL_CHATS ? labelTexts("overallData") : selectedConversation}</b>
                    </Typography>
                    <DownloadButtons chartId={container_name} fileNamePrefix={CHART_NAME} currentLabel={selectedConversation} labelToShowId={selection_label_name} />
                </Box>
                <Box sx={{ width: "100%", minHeight: "250px" }}>
                    <Line
                        data={generateChartData()}
                        options={{
                            ...COMMON_CHART_OPTIONS,
                            spanGaps: 1000 * 60 * 60 * 24 * 2, // Show gaps from 2 days in the data
                            plugins: { "legend": TOP_LEGEND },
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
                                    ticks: {
                                        ...COMMON_CHART_OPTIONS.scales.x.ticks,
                                        maxRotation: 45, minRotation: 45
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
