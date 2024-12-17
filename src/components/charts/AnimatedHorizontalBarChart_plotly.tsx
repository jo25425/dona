import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SentReceivedPoint } from "@models/graphData";
import PlotlyWrapper from "@components/charts/PlotlyWrapper";
import { getDownloadButtons } from "@components/charts/buttonConfig";
import {Config, ModeBarDefaultButtons} from "plotly.js";

interface AnimatedHorizontalBarChartProps {
    dataMonthlyPerConversation: SentReceivedPoint[][];
    listOfConversations: string[];
    dataSourceType: string;
}

const AnimatedHorizontalBarChart: React.FC<AnimatedHorizontalBarChartProps> = ({
                                                                                   dataMonthlyPerConversation,
                                                                                   listOfConversations,
                                                                                   dataSourceType,
                                                                               }) => {
    const labels = useTranslations("feedback.chartLabels");
    const chart = useTranslations("feedback.interactionIntensity.animatedHorizontalBarChart")
    const [plotData, setPlotData] = useState<any[]>([]);
    const [frames, setFrames] = useState<any[]>([]);
    const [layout, setLayout] = useState<any>(null);

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
        function buildFrames() {
            const cumulativeCounts: Record<string, number[]> = {};
            const sliderSteps: any[] = [];
            const animationFrames: any[] = [];
            const allMonths = new Set<string>();

            dataMonthlyPerConversation.forEach((conversationData, conversationIdx) => {
                conversationData.forEach((dataPoint) => {
                    const monthKey = `${dataPoint.year}-${dataPoint.month.toString().padStart(2, "0")}`;
                    allMonths.add(monthKey);

                    if (!cumulativeCounts[monthKey]) {
                        cumulativeCounts[monthKey] = Array(listOfConversations.length).fill(0);
                    }
                    cumulativeCounts[monthKey][conversationIdx] += dataPoint.sentCount || 0;
                });
            });

            const sortedMonths = Array.from(allMonths).sort();

            sortedMonths.reduce((acc, monthKey) => {
                cumulativeCounts[monthKey].forEach((count, idx) => {
                    acc[idx] += count;
                });
                const frameData = {
                    type: "bar",
                    orientation: "h",
                    x: [...acc],
                    y: listOfConversations,
                    marker: { color: "#60BDFF" },
                    width: Array(listOfConversations.length).fill(0.8),
                };

                animationFrames.push({ name: monthKey, data: [frameData] });
                sliderSteps.push({
                    method: "animate",
                    label: monthKey,
                    args: [[monthKey], {
                        mode: "immediate",
                        transition: { duration: 300 },
                        frame: { duration: 300, redraw: true },
                    }],
                });
                return acc;
            }, Array(listOfConversations.length).fill(0));

            const maxCount = Math.max(...Object.values(cumulativeCounts).flat());
            return { animationFrames, sliderSteps, maxCount };
        }

        const { animationFrames, sliderSteps, maxCount } = buildFrames();

        const layout = {
            barmode: 'overlay',
            hovermode: 'closest',
            title: { text: chart("title"), font: { size: 16 } },
            xaxis: {
                title: chart("xAxis"),
                range: [0, maxCount],
                fixedrange: true,
            },
            yaxis: { automargin: true, fixedrange: true },
            sliders: [{
                pad: { l: 130, t: 50 },
                currentvalue: {
                    visible: true,
                    prefix: labels("yearMonth"),
                    xanchor: "right",
                    font: { size: 12 },
                },
                steps: sliderSteps,
            }],
            updatemenus: [{
                x: 0,
                y: 0,
                yanchor: 'top',
                xanchor: 'left',
                showactive: false,
                direction: 'left',
                type: 'buttons',
                pad: {t: 70, r: 20},
                buttons: [
                    {
                        method: "animate",
                        args: [null, {
                            mode: "immediate",
                            transition: { duration: 300 },
                            frame: { duration: 300, redraw: true },
                        }],
                        label: labels("start"),
                    },
                    {
                        method: "animate",
                        args: [[null], {
                            mode: "immediate",
                            transition: { duration: 0 },
                            frame: { duration: 0, redraw: true },
                        }],
                        label: labels("pause"),
                    },
                ],
            }],
        };

        getDownloadButtons("interaction_intensity_barchart").then((buttons) => {
            setConfig((prevConfig) => ({
                ...prevConfig,
                modeBarButtonsToAdd: buttons,
            }));
        });
        setPlotData([animationFrames[0].data[0]]);
        setFrames(animationFrames);
        setLayout(layout);
    }, [dataMonthlyPerConversation, listOfConversations, labels]);

    return (
        <PlotlyWrapper
            data={plotData}
            layout={layout}
            frames={frames}
            config={config}
            style={{ width: "100%", height: "100%" }}
        />
    );
};

export default AnimatedHorizontalBarChart;
