import React, {useEffect, useRef, useState} from "react";
import {Bar} from "react-chartjs-2";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip} from "chart.js";
import {Box, Typography} from "@mui/material";
import SliderWithButtons from "./SliderWithButtons";
import {SentReceivedPoint} from "@models/graphData";
import {useTranslations} from "next-intl";
import {DownloadButtons} from "@components/charts/DonwloadButtons";
import {prepareCountsOverTimeData} from "@components/charts/animationPreprocessing";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface AnimatedHorizontalBarChartProps {
    dataMonthlyPerConversation: SentReceivedPoint[][];
    listOfConversations: string[];
}

const AnimatedHorizontalBarChart: React.FC<AnimatedHorizontalBarChartProps> = ({
                                                                                   dataMonthlyPerConversation,
                                                                                   listOfConversations,
                                                                               }) => {
    const labelTexts = useTranslations("feedback.chartLabels");
    const chartTexts = useTranslations("feedback.interactionIntensity.animatedHorizontalBarChart");

    const chartRef = useRef<any>(null);
    const [cumulativeCounts, setCumulativeCounts] = useState<Record<string, number[]>>({});
    const [labels, setLabels] = useState<string[]>([]);
    const [globalMax, setGlobalMax] = useState<number>(0);
    const [currentFrame, setCurrentFrame] = useState<number>(0);

    useEffect(() => {
        const { counts, sortedMonths, globalMax } = prepareCountsOverTimeData(dataMonthlyPerConversation, listOfConversations);
        setCumulativeCounts(counts);
        setLabels(sortedMonths);
        setGlobalMax(globalMax);
    }, [dataMonthlyPerConversation, listOfConversations]);

    const generateChartData = (frameIndex: number) => {
        const monthKey = labels[frameIndex];
        return {
            labels: listOfConversations,
            datasets: [
                {
                    label: chartTexts("legend"),
                    data: cumulativeCounts[monthKey] || [],
                    backgroundColor: "#60BDFF",
                    barThickness: 20,
                },
            ],
        };
    };

    return (
        <Box>
            <Box id="chart-wrapper" position="relative" px={2} py={2}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={-2}>
                    <Typography variant="body2" align="right" mt={1} mb={-1}>
                        <b>{labelTexts("yearMonth")}</b> {labels[currentFrame]}
                    </Typography>
                    <DownloadButtons
                        chartId="chart-wrapper"
                        fileNamePrefix="intensity-interaction-hbar"
                        currentLabel={labels[currentFrame]}
                    />
                </Box>

                <Bar
                    ref={chartRef}
                    data={generateChartData(currentFrame)}
                    options={{
                        indexAxis: "y",
                        responsive: true,
                        animation: { duration: 300 },
                        plugins: { legend: { display: false } },
                        scales: {
                            x: {
                                title: { display: true, text: chartTexts("xAxis") },
                                beginAtZero: true,
                                max: globalMax,
                            },
                            y: { grid: { drawOnChartArea: false } },
                        },
                    }}
                />
            </Box>

            <SliderWithButtons
                value={currentFrame}
                marks={labels.map((label, index) => ({ value: index, label }))}
                setCurrentFrame={setCurrentFrame}
            />
        </Box>
    );
};

export default AnimatedHorizontalBarChart;