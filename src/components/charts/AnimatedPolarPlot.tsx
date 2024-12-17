import React, {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {preparePolarChartData} from "./polarChartpreprocessing";
import {SentReceivedPoint} from "@models/graphData";
import PlotlyWrapper from "@components/charts/PlotlyWrapper";

const BACKGROUND_IMAGE = "images/charts/FeedbackBackgroundForPolarPlot.svg";

interface AnimatedPolarPlotProps {
    dataMonthlyPerConversation: SentReceivedPoint[][];
    listOfConversations: string[];
    dataSourceType: string;
}

const AnimatedPolarPlot: React.FC<AnimatedPolarPlotProps> = ({ dataMonthlyPerConversation, listOfConversations, dataSourceType }) => {
    const labels = useTranslations("feedback.chartLabels");
    const [plotData, setPlotData] = useState<any[]>([]);
    const [frames, setFrames] = useState<any[]>([]);
    const [layout, setLayout] = useState<any>(null);

    useEffect(() => {

        async function preprocessAndSetData() {

            const { sortedData, sortedKeys } = await preparePolarChartData<SentReceivedPoint>(dataMonthlyPerConversation);
            const zScoreLimit = 1.96;

            // Prepare frames and traces
            const frames = sortedKeys.map((key, index) => ({
                name: key,
                data: [
                    {
                        r: sortedData[index].map((point) => point.zScore ?? -zScoreLimit),
                        theta: listOfConversations,
                        type: "scatterpolar",
                    },
                ],
            }));

            const traces = [
                {
                    name: labels("chatWith"),
                    type: "scatterpolar",
                    mode: "markers",
                    r: listOfConversations.map(() => 0),
                    theta: listOfConversations,
                    marker: {
                        color: "white",
                        size: 18,
                    },
                },
            ];

            let layout = {
                height: 550,
                hovermode: false,
                showlegend: true,
                legend: {
                    bgcolor: "#13223C",
                    font: {color: "white"},
                    x: 0.9,
                    y: 1.2,
                },
                xaxis: {
                    fixedrange: true
                },
                yaxis: {
                    fixedrange: true
                },
                polar: {
                    bgcolor: "rgba(255, 255, 255, 0)",
                    radialaxis: {
                        color: "#C3C3C3",
                        showline: false,
                        showgrid: false,
                        showticklabels: false,
                        ticks: "",
                        range: [zScoreLimit, -zScoreLimit],
                    },
                    angularaxis: {
                        rotation: 15,
                        color: "white",
                        layer: "below traces",
                        showgrid: false,
                        gridcolor: "#f5f5f5",
                        gridwidth: 0.1,
                        griddash: 'dash',
                    }
                },
                images: [
                    {
                        source: BACKGROUND_IMAGE,
                        xref: "paper",
                        yref: "paper",
                        x: 0.5,
                        y: 0.5,
                        sizex: 1.5,
                        sizey: 1.5,
                        xanchor: "center",
                        yanchor: "middle",
                        sizing: "fill",
                        opacity: 1,
                        layer: "below"
                    }
                ],
                updatemenus: [
                    {
                        x: 0.1,
                        y: 1.2,
                        showactive: false,
                        direction: 'left',
                        type: 'buttons',
                        pad: {t: 0, r: 10},
                        buttons: [
                            {
                                method: "relayout",
                                args: [
                                    {
                                        'polar.radialaxis.range': [zScoreLimit + zScoreLimit * 0.5, -zScoreLimit]
                                    }
                                ],
                                label: labels("resetView")
                            }
                        ]
                    },
                    {
                        x: 0,
                        y: 0,
                        yanchor: 'top',
                        xanchor: 'left',
                        showactive: false,
                        direction: 'left',
                        type: 'buttons',
                        pad: {t: 127, r: 10},
                        buttons: [
                            {
                                method: "animate",
                                args: [
                                    null,
                                    {
                                        mode: 'immediate',
                                        fromcurrent: true,
                                        transition: {duration: 300, easing: 'linear'},
                                        frame: {duration: 300, redraw: true}
                                    }
                                ],
                                label: labels("start")
                            },
                            {
                                method: 'animate',
                                args: [[null], {
                                    mode: 'immediate',
                                    transition: {duration: 0},
                                    frame: {duration: 0, redraw: true}
                                }],
                                label: labels("pause")
                            }
                        ]
                    }
                ]
            };

            setPlotData(traces);
            setFrames(frames);
            setLayout(layout);
        }

        preprocessAndSetData();
    }, [dataMonthlyPerConversation, listOfConversations, dataSourceType, labels]);

    return (
        <PlotlyWrapper
            data={plotData}
            layout={layout}
            frames={frames}
            config={{ responsive: true }}
            style={{ width: "100%", height: "100%" }}
        />
    );
};

export default AnimatedPolarPlot;
