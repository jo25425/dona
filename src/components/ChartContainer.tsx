import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GraphData } from "@models/graphData";
import AnimatedPolarPlot from "@components/charts/AnimatedPolarPlot";
import ResponseTimesBarChart from "@components/charts/ResponseTimesBarChart";


interface ChartContainerProps {
    type: string;
    data: GraphData;
    listOfConversations: string[];
    dataSourceValue: string;
}

export default function ChartContainer({ type, data, listOfConversations, dataSourceValue }: ChartContainerProps) {
    const renderChart = () => {
        switch (type) {
            case "animatedPolarPlot":
                return (
                    <AnimatedPolarPlot
                        dataMonthlyPerConversation={data.monthlySentReceivedPerConversation}
                        dataSourceType={dataSourceValue}
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
            // case "anotherChartType":
            //     return <AnotherChartComponent data={data} dataSourceValue={dataSourceValue} />;
            default:
                return (
                    <Box
                        sx={{
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
