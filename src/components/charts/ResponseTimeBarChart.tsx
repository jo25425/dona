import React from "react";
import { Bar } from "react-chartjs-2";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import _ from "lodash";
import { AnswerTimePoint } from "@models/graphData";
import DownloadButtons from "@components/charts/DownloadButtons";
import { ChartDataset } from "chart.js";

const FIRST = "< 1 min";
const SECOND = "1-2 min";
const THIRD = "3-5 min";
const FOURTH = "6-15 min";
const FIFTH = "16-30 min";
const SIXTH = "31-60 min";
const SEVENTH = "> 60 min";

const ranges = [
    { max: 60000, label: FIRST },
    { max: 120000, label: SECOND },
    { max: 300000, label: THIRD },
    { max: 900000, label: FOURTH },
    { max: 1800000, label: FIFTH },
    { max: 3600000, label: SIXTH },
    { max: Infinity, label: SEVENTH },
];

interface ResponseTimeBarChartProps {
    responseTimes: AnswerTimePoint[];
    isOnlyOneOrLessConv: boolean;
}

const ResponseTimeBarChart: React.FC<ResponseTimeBarChartProps> = ({
                                                                         responseTimes,
                                                                         isOnlyOneOrLessConv,
                                                                     }) => {
    const CHART_NAME = "response-times-barchart";
    const container_name = `chart-wrapper-${CHART_NAME}`;

    const chartTexts = useTranslations("feedback.responseTimes.responseTimeBarChart");

    const categorizeResponseTime = (timeInMs: number) => {
        return ranges.findIndex((range) => timeInMs <= range.max);
    };

    const groupedByIsDonor = _.groupBy(responseTimes, (responseTime) => responseTime.isFromDonor);

    const countByRange = (group: { responseTimeMs: number }[]) => {
        const counts = Array(ranges.length).fill(0);
        group.forEach((responseTime) => {
            counts[categorizeResponseTime(responseTime.responseTimeMs)]++;
        });
        return counts;
    };

    const donorCounts = countByRange(groupedByIsDonor.true || []);
    const contactCounts = countByRange(groupedByIsDonor.false || []);

    const donorTotal = donorCounts.reduce((a, b) => a + b, 0);
    const contactTotal = contactCounts.reduce((a, b) => a + b, 0);

    const donorPercentages = donorCounts.map((count) => (donorTotal > 0 ? (count / donorTotal) * 100 : 0));
    const contactPercentages = contactCounts.map((count) => (contactTotal > 0 ? (count / contactTotal) * 100 : 0));

    const datasets: ChartDataset<"bar", number[]>[] = [
        !isOnlyOneOrLessConv && {
            label: chartTexts("legend.contacts"),
            data: contactPercentages,
            backgroundColor: "#FF8800",
            barPercentage: 0.5,
        },
        {
            label: chartTexts("legend.donor"),
            data: donorPercentages,
            backgroundColor: "#1f77b4",
            barPercentage: 0.8,
        },
    ].filter(Boolean) as ChartDataset<"bar", number[]>[];

    const data = {
        labels: ranges.map((range) => range.label),
        datasets: datasets
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
                title: { display: true, text: chartTexts("xAxis") },
                grid: { drawOnChartArea: false },
                stacked: true,
            },
            y: {
                title: { display: true, text: chartTexts("yAxis") },
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
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
};

export default ResponseTimeBarChart;
