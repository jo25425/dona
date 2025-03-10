import React, {useMemo, useState} from "react";
import {Scatter} from "react-chartjs-2";
import {Box, MenuItem, Select} from "@mui/material";
import {useTranslations} from "next-intl";
import {Chart as ChartJS, Legend, LinearScale, PointElement, TimeScale, Title, Tooltip} from "chart.js";
import "chartjs-adapter-date-fns";
import ColorScale from "@components/charts/ColorScale";
import {calculateZScores} from "@services/charts/zScores";
import {adjustRange} from "@services/charts/preprocessing";
import Typography from "@mui/material/Typography";
import DownloadButtons from "@components/charts/DownloadButtons";
import {DailyHourPoint} from "@models/graphData";
import {CHART_LAYOUT, COMMON_CHART_OPTIONS} from "@components/charts/chartConfig";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement, TimeScale);

const ALL_CHATS = "ALL_CHATS";
const Z_SCORE_LIMIT = 1.39;
const backgroundColor = (a: number): string => `rgba(8, 48, 107, ${a})`;

interface DailyActivityChartProps {
    dataSent: DailyHourPoint[][];
    listOfConversations: string[];
}

const DailyActivityChart: React.FC<DailyActivityChartProps> = ({
                                                                   dataSent,
                                                                   listOfConversations,
                                                               }) => {
    const CHART_NAME = "daily-activity-times-scatter-plot";
    const container_name = `chart-wrapper-${CHART_NAME}`;
    const selection_label_name = `select-label-${CHART_NAME}`;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const labelTexts = useTranslations("feedback.chartLabels");
    const chartTexts = useTranslations("feedback.dailyActivityTimes.dailyActivityHoursChart");
    const [selectedConversation, setSelectedConversation] = useState<string>(ALL_CHATS);

    const preprocessData = (data: DailyHourPoint[][]) => {
        const allData = data.flat().map((point) => ({
            x: `${point.year}-${String(point.month).padStart(2, "0")}-${String(point.date).padStart(2, "0")}`,
            y: `1970-01-01T${String(point.hour).padStart(2, "0")}:${String(point.minute).padStart(2, "0")}:00`,
            wordCount: point.wordCount,
        }));

        const zScores = calculateZScores(allData.map((d) => d.wordCount), Z_SCORE_LIMIT) as number[];
        return allData.map((d, i) => ({
            ...d,
            z: zScores[i],
        }));
    };

    // For all data available
    const preparedData = useMemo(() => preprocessData(dataSent), [dataSent]);

    // For the selection by dropdown
    const filteredData = useMemo(() => {
        if (selectedConversation === ALL_CHATS) return preparedData;
        const conversationIndex = listOfConversations.indexOf(selectedConversation);
        return preprocessData([dataSent[conversationIndex]]);
    }, [preparedData, selectedConversation]);

    const { xMin, xMax } = adjustRange(
        filteredData.map((point) => point.x),
        0.05
    );

    const data = {
        datasets: [
            {
                data: filteredData,
                backgroundColor: (context: any) => {
                    const value = context.raw?.z || 0;
                    return backgroundColor(Math.abs((value + Z_SCORE_LIMIT) / (2 * Z_SCORE_LIMIT)));
                },
                pointStyle: "rect",
                pointRadius: 10,
            },
        ],
    };

    const options = {
        ...COMMON_CHART_OPTIONS,
        scales: {
            x: {
                type: "time" as const,
                time: {
                    unit: "day" as const,
                    displayFormats: { day: "dd-MM-yyyy" },
                },
                ticks: {
                    maxTicksLimit: isMobile? 6 : 20,
                    minRotation: 30,
                    includeBounds: true,
                },
                min: xMin,
                max: xMax,
            },
            y: {
                type: "time" as const,
                time: {
                    unit: "hour" as const,
                    displayFormats: { hour: "HH:mm" },
                },
                title: {
                    display: true,
                    text: chartTexts("yAxis"),
                },
            },
        },
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", width: "100%" }}>
            <Box sx={{ flex: 1, position: "relative" }}>
                <Select
                    value={selectedConversation}
                    onChange={(e) => setSelectedConversation(e.target.value)}
                    size="small"
                    variant="outlined"
                    sx={{ mb: -2, pb: 0, fontSize: CHART_LAYOUT.labelFontSize }}
                >
                    <MenuItem value={ALL_CHATS} sx={{ fontSize: CHART_LAYOUT.labelFontSize }}>{labelTexts("overallData")}</MenuItem>
                    {listOfConversations.map((conversation) => (
                        <MenuItem sx={{ fontSize: CHART_LAYOUT.labelFontSize }} key={conversation} value={conversation}>
                            {conversation}
                        </MenuItem>
                    ))}
                </Select>

                <Box id={container_name} p={CHART_LAYOUT.paddingX} sx={{ mt: -2, pt: 0}}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography id={selection_label_name} variant="body2" align="right">
                            <b>{selectedConversation === ALL_CHATS ? labelTexts("overallData") : selectedConversation}</b>
                        </Typography>
                        <DownloadButtons chartId={container_name} fileNamePrefix={CHART_NAME} currentLabel={selectedConversation} labelToShowId={selection_label_name} />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", height: CHART_LAYOUT.responsiveChartHeight, ml: -1.5 }}>
                        <Box sx={{ flex: 1, height: "100%" }}>
                            <Scatter data={data} options={options} />
                        </Box>
                        <ColorScale
                            colors={[backgroundColor(1), "white"]}
                            labels={[
                                chartTexts("moreThanAverage"),
                                chartTexts("average"),
                                chartTexts("lessThanAverage"),
                            ]}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DailyActivityChart;
