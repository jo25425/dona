import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import DownloadButtons from "@components/charts/DownloadButtons";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface WordCountOverallBarChartProps {
    sentWordsTotal: number;
    receivedWordsTotal: number;
}

const WordCountOverallBarChart: React.FC<WordCountOverallBarChartProps> = (
    { sentWordsTotal, receivedWordsTotal }
) => {
    const CHART_NAME = "word-count-overall-barchart";
    const container_name = `chart-wrapper-${CHART_NAME}`;

    const t = useTranslations("feedback.interactionIntensity.wordCountOverallBarChart");

    const generateChartData = () => {
        return {
            labels: [t("yAxis.sent"), t("yAxis.received")],
            datasets: [
                {
                    data: [sentWordsTotal, receivedWordsTotal],
                    backgroundColor: ["#1f77b4", "#FF8800"],
                },
            ],
        };
    };

    return (
        <Box>
            <Box id={container_name} position="relative" px={2} py={2}>
                <Box display="flex" justifyContent="right" alignItems="center" mb={-2}>
                    <DownloadButtons chartId={container_name} fileNamePrefix={CHART_NAME} />
                </Box>
                <Bar
                    data={generateChartData()}
                    options={{
                        responsive: true,
                        indexAxis: "y",
                        plugins: {
                            legend: { display: false },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: t("xAxis") },
                                beginAtZero: true,
                            },
                            y: {grid: { drawOnChartArea: false } },
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default WordCountOverallBarChart;
