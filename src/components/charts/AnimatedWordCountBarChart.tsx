import React, {useEffect, useRef, useState} from "react";
import {Bar} from "react-chartjs-2";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip} from "chart.js";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SliderWithButtons from "@components/charts/SliderWithButtons";
import {SentReceivedPoint} from "@models/graphData";
import {useTranslations} from "next-intl";
import DownloadButtons from "@components/charts/DownloadButtons";
import {prepareCountsOverTimeData} from "@services/charts/animations";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface AnimatedWordCountBarChartProps {
    dataMonthlyPerConversation: SentReceivedPoint[][];
    listOfConversations: string[];
}

const AnimatedWordCountBarChart: React.FC<AnimatedWordCountBarChartProps> = ({
                                                                                   dataMonthlyPerConversation,
                                                                                   listOfConversations,
                                                                               }) => {
    const CHART_NAME = "intensity-interaction-hbarchart";
    const container_name = `chart-wrapper-${CHART_NAME}`;

    const labelTexts = useTranslations("feedback.chartLabels");
    const chartTexts = useTranslations("feedback.interactionIntensity.animatedWordCountBarChart");

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
                    backgroundColor: "#1f77b4",
                    barThickness: 20,
                },
            ],
        };
    };

    return (
        <Box>
            <Box id={container_name} position="relative" px={2} py={2}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={-2}>
                    <Typography variant="body2" align="right" mt={1} mb={-1}>
                        <b>{labelTexts("yearMonth")}</b> {labels[currentFrame]}
                    </Typography>
                    <DownloadButtons
                        chartId={container_name}
                        fileNamePrefix={CHART_NAME}
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

export default AnimatedWordCountBarChart;
