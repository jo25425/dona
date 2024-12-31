import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GraphData } from "@models/graphData";
import ResponseTimesBarChart from "@components/charts/ResponseTimesBarChart";
import AnimatedHorizontalBarChart from "@components/charts/AnimatedHorizontalBarChart";
import AnimatedPolarChart from "@components/charts/AnimatedPolarChart";
import DailyActivityChart from "@components/charts/DailyActivityChart";
import AnimatedResponseTimesBarChart from "@components/charts/AnimatedResponseTimesBarChart";
import DayPartsActivityOverallChart from "@components/charts/DayPartsActivityOverallChart";


interface ChartContainerProps {
    type: string;
    data: GraphData;
    listOfConversations: string[];
    dataSourceValue?: string;
}

export default function ChartContainer({ type, data, listOfConversations }: ChartContainerProps) {
    const renderChart = () => {
        switch (type) {
            case "animatedPolarChart":
                return (
                    <AnimatedPolarChart
                        dataMonthlyPerConversation={data.monthlySentReceivedPerConversation}
                        listOfConversations={listOfConversations}
                    />
                );
            case "responseTimeBarChart":
                return (
                    <ResponseTimesBarChart
                        responseTimes={data.answerTimes}
                        isOnlyOneOrLessConv={listOfConversations.length <= 1}
                    />
                );
            case "animatedResponseTimeBarChart":
                return (
                    <AnimatedResponseTimesBarChart
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
            case "animatedHorizontalBarChart":
                return (
                    <AnimatedHorizontalBarChart
                        dataMonthlyPerConversation={data.monthlySentReceivedPerConversation}
                        listOfConversations={listOfConversations}
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
