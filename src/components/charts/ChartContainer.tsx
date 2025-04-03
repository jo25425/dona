import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {GraphData} from "@models/graphData";
import pick from "@services/basicHelpers";
import ResponseTimeBarChart from "@components/charts/ResponseTimeBarChart";
import AnimatedWordCountBarChart from "@components/charts/AnimatedWordCountBarChart";
import AnimatedIntensityPolarChart from "@components/charts/AnimatedIntensityPolarChart";
import DailyActivityChart from "@components/charts/DailyActivityChart";
import AnimatedResponseTimeBarChart from "@components/charts/AnimatedResponseTimeBarChart";
import DayPartsActivityOverallChart from "@components/charts/DayPartsActivityOverallChart";
import AnimatedDayPartsActivityChart from "@components/charts/AnimatedDayPartsActivityChart";
import WordCountOverallBarChart from "@components/charts/WordCountOverallBarChart";
import SentReceivedSlidingWindowChart from "@components/charts/SentReceivedSlidingWindowChart";


interface ChartContainerProps {
    type: string;
    data: GraphData;
    dataSourceValue?: string;
}

export default function ChartContainer({ type, data }: ChartContainerProps) {
    // For charts that show data per conversation, keep only the ones selected by the user
    const selectedConversations = pick(data.monthlySentReceivedPerConversation, data.focusConversations);

    const renderChart = () => {
        switch (type) {

            // Focus conversations only
            case "animatedIntensityPolarChart":
                return (
                    <AnimatedIntensityPolarChart
                        dataMonthlyPerConversation={selectedConversations}
                    />
                );
            case "animatedWordCountBarChart":
                return (
                    <AnimatedWordCountBarChart
                        dataMonthlyPerConversation={selectedConversations}
                    />
                );

            // Aggregated data only
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
                        slidingWindowMeanDailyWords={data.slidingWindowMeanDailyWords}
                    />
                );
            case "responseTimeBarChart":
                return (
                    <ResponseTimeBarChart responseTimes={data.answerTimes}/>
                );
            case "animatedResponseTimeBarChart":
                return (
                    <AnimatedResponseTimeBarChart answerTimes={data.answerTimes}/>
                );
            case "dailyActivityHoursChart":
                return (
                    <DailyActivityChart dataSent={data.dailySentHours}/>
                );
            case "dayPartsActivityOverallChart":
                return (
                    <DayPartsActivityOverallChart
                        dailySentHours={data.dailySentHours}
                        dailyReceivedHours={data.dailyReceivedHours}
                    />
                );
            case "animatedDayPartsActivityChart":
                return (
                    <AnimatedDayPartsActivityChart dailySentHours={data.dailySentHours}/>
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
