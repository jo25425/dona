import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import SliderWithButtons from "@components/charts/SliderWithButtons";
import DownloadButtons from "@components/charts/DownloadButtons";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DailyHourPoint } from "@models/graphData";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface AnimatedDayPartsActivityChartProps {
    dailySentHoursPerConversation: DailyHourPoint[][];
}

const AnimatedDayPartsActivityChart: React.FC<AnimatedDayPartsActivityChartProps> = ({
                                                                                         dailySentHoursPerConversation,
                                                                                     }) => {
    const CHART_NAME = "dayparts-activity-animated-barchart";
    const container_name = `chart-wrapper-${CHART_NAME}`;

    const t = useTranslations("feedback.dailyActivityTimes.dayPartsMonthly");
    const labelTexts = useTranslations("feedback.chartLabels");

    const buckets = ["00:00-05:59", "06:00-11:59", "12:00-17:59", "18:00-23:59"];
    const [currentFrame, setCurrentFrame] = useState<number>(0);
    const [preparedData, setPreparedData] = useState<Record<string, number[]> | null>(null);
    const [labels, setLabels] = useState<string[]>([]);

    const preprocessData = () => {
        const groupedByMonth: Record<string, number[]> = {};
        const monthsSet = new Set<string>();

        dailySentHoursPerConversation.forEach((conversation) => {
            conversation.forEach(({ year, month, hour, wordCount }) => {
                const bucketIndex = hour < 6 ? 0 : hour < 12 ? 1 : hour < 18 ? 2 : 3;
                const monthKey = `${year}-${String(month).padStart(2, "0")}`;
                monthsSet.add(monthKey);

                if (!groupedByMonth[monthKey]) {
                    groupedByMonth[monthKey] = new Array(buckets.length).fill(0);
                }

                groupedByMonth[monthKey][bucketIndex] += wordCount || 0;
            });
        });

        const sortedMonths = Array.from(monthsSet).sort();
        sortedMonths.forEach((monthKey) => {
            const total = groupedByMonth[monthKey].reduce((a, b) => a + b, 0);
            groupedByMonth[monthKey] = total
                ? groupedByMonth[monthKey].map((count) => (count / total) * 100)
                : new Array(buckets.length).fill(0);
        });

        return { counts: groupedByMonth, sortedMonths };
    };

    useEffect(() => {
        const { counts, sortedMonths } = preprocessData();
        setPreparedData(counts);
        setLabels(sortedMonths);
    }, [dailySentHoursPerConversation]);

    const generateChartData = (frameIndex: number) => {
        const monthKey = labels[frameIndex];
        return {
            labels: buckets,
            datasets: [
                {
                    label: t("legend.sent"),
                    data: preparedData?.[monthKey] || [],
                    backgroundColor: "#1f77b4",
                    barPercentage: 0.8,
                },
            ],
        };
    };

    return (
        <Box>
            <Box id={container_name} position="relative" p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={-2}>
                    <Typography variant="body2" align="right" mt={1} mb={-1}>
                        <b>{labelTexts("yearMonth")}</b> {labels[currentFrame]}
                    </Typography>
                    <DownloadButtons chartId={container_name} fileNamePrefix={CHART_NAME} currentLabel={labels[currentFrame]} />
                </Box>
                <Bar
                    data={generateChartData(currentFrame)}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                            tooltip: {
                                callbacks: { label: (context: any) => `${context.raw?.toFixed(2)}%` },
                            },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: t("xAxis") },
                                grid: { drawOnChartArea: false },
                            },
                            y: {
                                title: { display: true, text: t("yAxis") },
                                ticks: { callback: (value: number | string) => `${value}%` },
                                beginAtZero: true,
                                max: 100,
                            },
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

export default AnimatedDayPartsActivityChart;
