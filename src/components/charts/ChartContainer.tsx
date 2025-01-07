import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GraphData } from "@models/graphData";
import ResponseTimeBarChart from "@components/charts/ResponseTimeBarChart";
import AnimatedWordCountBarChart from "@components/charts/AnimatedWordCountBarChart";
import AnimatedIntensityPolarChart from "@components/charts/AnimatedIntensityPolarChart";
import DailyActivityChart from "@components/charts/DailyActivityChart";
import AnimatedResponseTimeBarChart from "@components/charts/AnimatedResponseTimeBarChart";
import DayPartsActivityOverallChart from "@components/charts/DayPartsActivityOverallChart";
import AnimatedDayPartsActivityChart from "@components/charts/AnimatedDayPartsActivityChart";
import WordCountOverallBarChart from "@components/charts/WordCountOverallBarChart";
import {graphData} from "@/db/schema";
import SentReceivedSlidingWindowChart from "@components/charts/SentReceivedSlidingWindowChart";


interface ChartContainerProps {
    type: string;
    data: GraphData;
    listOfConversations: string[];
    dataSourceValue?: string;
}

export default function ChartContainer({ type, data, listOfConversations }: ChartContainerProps) {
    const renderChart = () => {
        switch (type) {
            case "animatedIntensityPolarChart":
                return (
                    <AnimatedIntensityPolarChart
                        dataMonthlyPerConversation={data.monthlySentReceivedPerConversation}
                        listOfConversations={listOfConversations}
                    />
                );
            case "animatedWordCountBarChart":
                return (
                    <AnimatedWordCountBarChart
                        dataMonthlyPerConversation={data.monthlySentReceivedPerConversation}
                        listOfConversations={listOfConversations}
                    />
                );
            case "wordCountOverallBarChart":
                return (
                    <WordCountOverallBarChart
                        sentWordsTotal={data.basicStatistics.sentWordsTotal}
                        receivedWordsTotal={data.basicStatistics.receivedWordsTotal}
                    />
                );
            case "sentReceivedSlidingWindowMean":
                return (
                    <SentReceivedSlidingWindowChart
                        slidingWindowMeanPerConversation={data.slidingWindowMeanPerConversation}
                        listOfConversations={listOfConversations}
                    />
                );
            case "responseTimeBarChart":
                return (
                    <ResponseTimeBarChart
                        responseTimes={data.answerTimes}
                        isOnlyOneOrLessConv={listOfConversations.length <= 1}
                    />
                );
            case "animatedResponseTimeBarChart":
                return (
                    <AnimatedResponseTimeBarChart
                        answerTimes={data.answerTimes}
                    />
                );
            case "dailyActivityHoursChart":
                return (
                    <DailyActivityChart
                        dataSent={data.dailySentHoursPerConversation}
                        listOfConversations={listOfConversations}
                    />
                );
            case "dayPartsActivityOverallChart":
                return (
                    <DayPartsActivityOverallChart
                        dailySentHoursPerConversation={data.dailySentHoursPerConversation}
                        dailyReceivedHoursPerConversation={data.dailyReceivedHoursPerConversation}
                    />
                );
            case "animatedDayPartsActivityChart":
                return (
                    <AnimatedDayPartsActivityChart
                        dailySentHoursPerConversation={data.dailySentHoursPerConversation}
                    />
                );
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
