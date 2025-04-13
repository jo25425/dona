import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {GraphData} from "@models/graphData";
import pick from "@services/basicHelpers";
import ResponseTimeBarChart from "@components/charts/ResponseTimeBarChart";
import AnimatedCountsPerChatBarChart from "@components/charts/AnimatedCountsPerChatBarChart";
import AnimatedDayPartsActivityChart from "@components/charts/AnimatedDayPartsActivityChart";
import AnimatedIntensityPolarChart from "@components/charts/AnimatedIntensityPolarChart";
import AnimatedResponseTimeBarChart from "@components/charts/AnimatedResponseTimeBarChart";
import DailyActivityChart from "@components/charts/DailyActivityChart";
import DayPartsActivityOverallChart from "@components/charts/DayPartsActivityOverallChart";
import SentReceivedSlidingWindowChart from "@components/charts/SentReceivedSlidingWindowChart";
import CountsOverallBarChart from "@components/charts/CountsOverallBarChart";

export enum ChartType {
    AnimatedIntensityPolarChart = "animatedIntensityPolarChart",
    AnimatedWordsPerChatBarChart = "animatedWordsPerChatBarChart",
    AnimatedSecondsPerChatBarChart = "animatedSecondsPerChatBarChart",
    WordCountOverallBarChart = "wordCountOverallBarChart",
    SecondCountOverallBarChart = "secondCountOverallBarChart",
    WordCountSlidingWindowMean = "wordCountSlidingWindowMean",
    SecondCountSlidingWindowMean = "secondCountSlidingWindowMean",
    ResponseTimeBarChart = "responseTimeBarChart",
    AnimatedResponseTimeBarChart = "animatedResponseTimeBarChart",
    DailyActivityHoursChart = "dailyActivityHoursChart",
    DayPartsActivityOverallChart = "dayPartsActivityOverallChart",
    AnimatedDayPartsActivityChart = "animatedDayPartsActivityChart",
}

interface ChartContainerProps {
    type: ChartType;
    data: GraphData;
    dataSourceValue?: string;
}

export default function ChartContainer({ type, data }: ChartContainerProps) {
    // For charts that show data per conversation, keep only the ones selected by the user
    const selectedChatsWordsData = pick(data.monthlyWordsPerConversation, data.focusConversations);
    const selectedChatsSecondsData = pick(data.monthlySecondsPerConversation, data.focusConversations);

    const renderChart = () => {
        switch (type) {

            // Focus conversations only
            case ChartType.AnimatedIntensityPolarChart:
                return <AnimatedIntensityPolarChart dataMonthlyPerConversation={selectedChatsWordsData}/>;
            case ChartType.AnimatedWordsPerChatBarChart:
                return <AnimatedCountsPerChatBarChart dataMonthlyPerConversation={selectedChatsWordsData} mode="text"/>;
            case ChartType.AnimatedSecondsPerChatBarChart:
                return <AnimatedCountsPerChatBarChart dataMonthlyPerConversation={selectedChatsSecondsData} mode="audio"/>;

            // Aggregated data only
            case ChartType.WordCountOverallBarChart:
                return (
                    <CountsOverallBarChart
                        sentWordsTotal={data.basicStatistics.wordsTotal.sent}
                        receivedWordsTotal={data.basicStatistics.wordsTotal.received}
                        mode="text"
                    />
                );
            case ChartType.SecondCountOverallBarChart:
                return (
                    <CountsOverallBarChart
                        sentWordsTotal={data.basicStatistics.secondsTotal.sent}
                        receivedWordsTotal={data.basicStatistics.secondsTotal.received}
                        mode="audio"
                    />
                );
            case ChartType.WordCountSlidingWindowMean:
                return (
                    <SentReceivedSlidingWindowChart
                        slidingWindowMeanDailyWords={data.slidingWindowMeanDailyWords} mode="text"
                    />
                );
            case ChartType.SecondCountSlidingWindowMean:
                return (
                    <SentReceivedSlidingWindowChart
                        slidingWindowMeanDailyWords={data.slidingWindowMeanDailySeconds} mode="audio"
                    />
                );
            case ChartType.ResponseTimeBarChart:
                return <ResponseTimeBarChart responseTimes={data.answerTimes}/>;
            case ChartType.AnimatedResponseTimeBarChart:
                return <AnimatedResponseTimeBarChart answerTimes={data.answerTimes}/>;
            case ChartType.DailyActivityHoursChart:
                return <DailyActivityChart dataSent={data.dailySentHours}/>;
            case ChartType.DayPartsActivityOverallChart:
                return (
                    <DayPartsActivityOverallChart
                        dailySentHours={data.dailySentHours}
                        dailyReceivedHours={data.dailyReceivedHours}
                    />
                );
            case ChartType.AnimatedDayPartsActivityChart:
                return <AnimatedDayPartsActivityChart dailySentHours={data.dailySentHours}/>;
            default:
                return (
                    <Box
                        sx={{
                            width: '100%',
                            border: '1px dashed grey',
                            height: 150,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body2">Placeholder for {type} chart</Typography>
                    </Box>
                );
        }
    };

    return renderChart();
}
