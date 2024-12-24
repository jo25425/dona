import React, { useEffect, useState } from "react";
import { Chart as ChartJS, RadialLinearScale, Tooltip, Legend, LineElement, PointElement } from "chart.js";
import { Radar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import SliderWithButtons from "./SliderWithButtons";
import { SentReceivedPoint } from "@models/graphData";
import { prepareCountsOverTimeData } from "@components/charts/animationPreprocessing";
import { DownloadButtons } from "@components/charts/DonwloadButtons";
import { useTranslations } from "next-intl";

ChartJS.register(RadialLinearScale, Tooltip, Legend, LineElement, PointElement);

const Z_SCORE_LIMIT = 1.96;
const BACKGROUND_IMAGE = "images/charts/FeedbackBackgroundForPolarPlot.svg";

interface AnimatedPolarChartProps {
    dataMonthlyPerConversation: SentReceivedPoint[][];
    listOfConversations: string[];
}

const AnimatedPolarChart: React.FC<AnimatedPolarChartProps> = ({
                                                                   dataMonthlyPerConversation,
                                                                   listOfConversations,
                                                               }) => {
    const CHART_NAME = "intensity-interaction-polar";
    const container_name = `chart-wrapper-${CHART_NAME}`;

    const labelTexts = useTranslations("feedback.chartLabels");
    const chartTexts = useTranslations("feedback.interactionIntensity.animatedPolarPlot");

    const [currentFrame, setCurrentFrame] = useState<number>(0);
    const [labels, setLabels] = useState<string[]>([]);
    const [frames, setFrames] = useState<Record<string, number[]>>({});

    // Preprocess data to create frames and calculate z-scores
    useEffect(() => {
        const { counts, sortedMonths } = prepareCountsOverTimeData(
            dataMonthlyPerConversation,
            listOfConversations,
            "both"
        );

        const totals = Object.values(counts).flat();
        const mean = totals.reduce((a, b) => a + b, 0) / totals.length;
        const stdDeviation = Math.sqrt(
            totals.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / totals.length
        );

        const zScoreFrames: Record<string, number[]> = {};
        sortedMonths.forEach((month) => {
            zScoreFrames[month] = counts[month].map((value) => {
                let zScore = (value - mean) / stdDeviation;
                if (zScore > Z_SCORE_LIMIT) zScore = Z_SCORE_LIMIT;
                if (zScore < -Z_SCORE_LIMIT) zScore = -Z_SCORE_LIMIT;
                return zScore;
            });
        });

        setLabels(sortedMonths);
        setFrames(zScoreFrames);
    }, [dataMonthlyPerConversation, listOfConversations]);

    // Generate chart data for the current frame
    const generateChartData = (frameIndex: number) => {
        const monthKey = labels[frameIndex];
        const conversationData = frames[monthKey] || [];

        return {
            labels: listOfConversations, // Angular positions
            datasets: [
                {
                    label: chartTexts("legend.others"),
                    data: conversationData, // Radial values (z-scores)
                    pointBackgroundColor: "#FFFFFF",
                    pointRadius: 10,
                    pointHoverRadius: 12,
                    borderWidth: 0,
                },
                {
                    label: chartTexts("legend.donor"),
                    data: [Z_SCORE_LIMIT + Z_SCORE_LIMIT * 0.5], // Donor data
                    pointBackgroundColor: "#FFD700",
                    pointRadius: 15,
                    pointHoverRadius: 17,
                    borderWidth: 0,
                },
            ],
        };
    };

    return (
        <Box p={2}>
            <Box
                id={container_name}
                position="relative"
            >
                <Box
                    position="relative"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{zIndex: 1, ml: 1, mb: -4, color: "#ccc"}}
                >
                    <Typography variant="body2" align="right" sx={{color: "#ccc"}}>
                        <b>{labelTexts("yearMonth")}</b> {labels[currentFrame]}
                    </Typography>
                    <DownloadButtons
                        chartId={container_name}
                        fileNamePrefix={CHART_NAME}
                        currentLabel={labels[currentFrame]}
                    />
                </Box>
                <Box
                    position="relative"
                    sx={{
                        zIndex: 0,
                        backgroundImage: `url(${BACKGROUND_IMAGE})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        padding: 2,
                        maxHeight: 500,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Radar
                        data={generateChartData(currentFrame)}
                        options={{
                            responsive: true,
                            animation: { duration: 300 },
                            scales: {
                                r: {
                                    reverse: true,
                                    beginAtZero: true,
                                    min: -Z_SCORE_LIMIT,
                                    max: Z_SCORE_LIMIT + Z_SCORE_LIMIT * 0.5,
                                    ticks: { count: 1, display: false},
                                    angleLines: { display: false },
                                    grid: {
                                        circular: true,
                                        color: "#FFFFFF",
                                    },
                                    pointLabels: {
                                        color: "#FFFFFF",
                                        font: { size: 14 }
                                    }
                                },
                            },
                            plugins: {
                                legend: {
                                    position: "right",
                                    align: "start",
                                    display: true,
                                    labels: {
                                        usePointStyle: true,
                                        textAlign: "left",
                                        color: "#FFFFFF"
                                    },
                                },
                            },
                        }}
                    />
                </Box>
            </Box>

            <SliderWithButtons
                value={currentFrame}
                marks={labels.map((label, index) => ({ value: index, label }))}
                setCurrentFrame={setCurrentFrame}
            />
        </Box>
    );
};

export default AnimatedPolarChart;
