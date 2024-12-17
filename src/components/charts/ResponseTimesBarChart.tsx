import React, {useEffect, useState} from "react";
import _ from "lodash";
import {useTranslations} from "next-intl";
import {AnswerTimePoint} from "@models/graphData";
import {Config, Data, ModeBarDefaultButtons} from "plotly.js";
import {getDownloadButtons} from "@components/charts/buttonConfig";
import PlotlyWrapper from "@components/charts/PlotlyWrapper";

type BarMode = "overlay" | "stack" | "group" | "relative" | undefined;
type HoverMode = false | "x" | "y" | "closest" | "x unified" | "y unified" | undefined;
type OrientationMode = "v" | "h" | undefined;

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

const ResponseTimesBarChart: React.FC<ResponseTimeBarChartProps> = ({
   responseTimes,
   isOnlyOneOrLessConv,
}) => {
    const labels = useTranslations("feedback.responseTimes.responseTimeBarChart");

    // Categorize response times
    const categorizeResponseTime = (timeInMs: number) => {
        return ranges.findIndex((range) => timeInMs <= range.max);
    };

    // Group response times by donor/contacts
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

    const donorPercentages = donorCounts.map((count) => (donorTotal > 0 ? count / donorTotal : 0));
    const contactPercentages = contactCounts.map((count) => (contactTotal > 0 ? count / contactTotal : 0));

    const maxPercentage = Math.max(...donorPercentages, ...contactPercentages);

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
                    y: contactPercentages,
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

    const [config, setConfig] = useState<Partial<Config>>({
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
        ] as ModeBarDefaultButtons[]
    });

    useEffect(() => {
        getDownloadButtons("response_times_barchart").then((buttons) => {
            setConfig((prevConfig) => ({
                ...prevConfig,
                modeBarButtonsToAdd: buttons,
            }));
        });
    }, []);

    return (
        <PlotlyWrapper
            data={data}
            layout={layout}
            config={config}
        />
    );
};

export default ResponseTimesBarChart;
