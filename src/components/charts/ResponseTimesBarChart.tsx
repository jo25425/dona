import React from "react";
import Plot from "react-plotly.js";
import _ from "lodash";
import {useTranslations} from "next-intl";
import {AnswerTimePoint} from "@models/graphData";
import Plotly, {Data, ModeBarDefaultButtons} from "plotly.js";
import {getDownloadButtons} from "@components/charts/buttonConfig";

type BarMode = "overlay" | "stack" | "group" | "relative" | undefined;
type HoverMode = false | "x" | "y" | "closest" | "x unified" | "y unified" | undefined;
type OrientationMode = "v" | "h" | undefined;

interface ResponseTimeBarChartProps {
    responseTimes: AnswerTimePoint[];
    isOnlyOneOrLessConv: boolean;
}

const ResponseTimesBarChart: React.FC<ResponseTimeBarChartProps> = ({
   responseTimes,
   isOnlyOneOrLessConv,
}) => {
    const labels = useTranslations("feedback.graph.responseTimes.responseTimeBarChart");

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

    // Categorize response times
    const categorizeResponseTime = (timeInMs: number) => {
        return ranges.findIndex((range) => timeInMs <= range.max);
    };

    // Group response times by donor/friends
    const groupedByIsDonor = _.groupBy(responseTimes, (responseTime) => responseTime.isFromDonor);

    const countByRange = (group: { responseTimeMs: number }[]) => {
        const counts = Array(ranges.length).fill(0);
        group.forEach((responseTime) => {
            counts[categorizeResponseTime(responseTime.responseTimeMs)]++;
        });
        return counts;
    };

    const donorCounts = countByRange(groupedByIsDonor.true || []);
    const friendCounts = countByRange(groupedByIsDonor.false || []);

    const donorTotal = donorCounts.reduce((a, b) => a + b, 0);
    const friendTotal = friendCounts.reduce((a, b) => a + b, 0);

    const donorPercentages = donorCounts.map((count) => (donorTotal > 0 ? count / donorTotal : 0));
    const friendPercentages = friendCounts.map((count) => (friendTotal > 0 ? count / friendTotal : 0));

    const maxPercentage = Math.max(...donorPercentages, ...friendPercentages);

    // Plot data
    const data: Data[] = [
        {
            name: labels("legend.donor"),
            x: ranges.map((range) => range.label),
            y: donorPercentages,
            type: "bar",
            marker: { color: "#60BDFF" },
            width: Array(ranges.length).fill(0.8),
        },
        ...(isOnlyOneOrLessConv
            ? []
            : [
                {
                    name: labels("legend.contacts"),
                    x: ranges.map((range) => range.label),
                    y: friendPercentages,
                    type: "bar",
                    marker: { color: "#FF8800" },
                    width: Array(ranges.length).fill(0.5),
                } as Data,
            ]),
    ];

    const layout = {
        xaxis: {
            title: labels("xAxis"),
            fixedrange: true,
            tickfont: { size: 12 }
        },
        yaxis: {
            title: labels("yAxis"),
            range: [0, maxPercentage],
            tickformat: ".0%",
            hoverformat: ".2%",
            fixedrange: true,
            tickfont: { size: 12 },
        },
        barmode: "overlay" as BarMode,
        legend: { x: -0, y: 1.2, orientation: "h" as OrientationMode }, // Horizontal legend to save space
        hovermode: "x" as HoverMode,
        autosize: true,
        margin: {l: 50, r: 20, t: 10, b: 50},
    };

    const config: Partial<Plotly.Config> = {
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: [
            "zoomIn2d",
            "zoomOut2d",
            "pan2d",
            "zoom2d",
            "select2d",
            "lasso2d",
            "hoverClosestCartesian",
            "hoverCompareCartesian",
            "toggleSpikelines",
            "autoScale2d",
            "resetScale2d",
            "toImage"
        ] as ModeBarDefaultButtons[],
        modeBarButtonsToAdd: getDownloadButtons("response_times_barchart")
    };

    return <Plot data={data} layout={layout} config={config} />;
};

export default ResponseTimesBarChart;
