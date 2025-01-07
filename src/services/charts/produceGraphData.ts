import {Conversation, DataSourceValue} from "@models/processed";
import {DailySentReceivedPoint, GraphData} from "@models/graphData";
import {
    aggregateDailyWords, produceAllDays,
    produceAnswerTimesPerConversation,
    produceDailyWordsPerConversation, produceMonthlySentReceivedMessages,
    produceMonthlySentReceivedWords,
    produceSlidingWindowMean,
    produceWordCountDailyHours
} from "@services/charts/timeAggregates";
import produceBasicStatistics from "@services/charts/produceBasicStatistics";
import {calculateMinMaxDates} from "@services/rangeFiltering";

export default function produceGraphData(donorId: string, allConversations: Conversation[]): Record<string, GraphData> {
    return Object.fromEntries(
        Map.groupBy(allConversations, ({ dataSource }) => dataSource)
            .entries()
            .map(([dataSourceValue, conversations]) => {
                // Compute various data points for each conversation
                const dailyWordsPerConversation = conversations.map((conversation) =>
                    produceDailyWordsPerConversation(donorId, conversation)
                );
                const allDailyWords = aggregateDailyWords(dailyWordsPerConversation);

                // Determine the global date range using calculateMinMaxDates
                const { minDate, maxDate } = calculateMinMaxDates(conversations, true);
                let slidingWindowMeanPerConversation: DailySentReceivedPoint[][] = [];
                if (minDate && maxDate) {
                    // Generate the complete list of all days within the global date range
                    const completeDaysList = produceAllDays(minDate, maxDate);

                    // Create sliding window mean using the complete days list
                    slidingWindowMeanPerConversation = dailyWordsPerConversation.map((dailyWords) =>
                        produceSlidingWindowMean(dailyWords, completeDaysList)
                    );
                }

                // Compute other data points
                const monthlySentReceivedPerConversation = conversations.map((conversation) =>
                    produceMonthlySentReceivedWords(donorId, [conversation])
                );
                const dailySentHoursPerConversation = conversations.map((conversation) =>
                    produceWordCountDailyHours(donorId, conversation, true)
                );
                const dailyReceivedHoursPerConversation = conversations.map((conversation) =>
                    produceWordCountDailyHours(donorId, conversation, false)
                );
                const answerTimes = conversations.flatMap((conversation) =>
                    produceAnswerTimesPerConversation(donorId, conversation)
                );
                const participantsPerConversation = conversations.map((conversation) =>
                    conversation.participants.filter((participant) => participant !== donorId)
                );

                // General statistics
                const messageCounts = produceMonthlySentReceivedMessages(donorId, conversations);
                const wordCounts = monthlySentReceivedPerConversation.flat();
                const basicStatistics = produceBasicStatistics(messageCounts, wordCounts);

                // Return all graph data for the data source
                return [
                    dataSourceValue,
                    {
                        monthlySentReceivedPerConversation,
                        dailyWords: allDailyWords,
                        slidingWindowMeanPerConversation,
                        dailyWordsPerConversation,
                        dailySentHoursPerConversation,
                        dailyReceivedHoursPerConversation,
                        answerTimes,
                        basicStatistics,
                        participantsPerConversation,
                    },
                ];
            })
    ) as Record<DataSourceValue, GraphData>;
}
