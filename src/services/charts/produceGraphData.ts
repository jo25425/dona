import {Conversation, DataSourceValue} from "@models/processed";
import {CountOption, DailySentReceivedPoint, GraphData} from "@models/graphData";
import {
    aggregateDailyWords, monthlyCountsPerConversation, produceAllDays,
    produceAnswerTimesPerConversation,
    produceDailyWordsPerConversation,
    produceMonthlySentReceived,
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
                // Extract focus conversations
                const focusConversations = conversations
                    .filter((conversation) => conversation.focusInFeedback)
                    .map((conversation) => conversation.conversationPseudonym);

                // Per conversation data
                const dailyWordsPerConversation = conversations.map((conversation) =>
                    produceDailyWordsPerConversation(donorId, conversation)
                );
                const participantsPerConversation = conversations.map((conversation) =>
                    conversation.participants.filter((participant) => participant !== donorId)
                );
                const monthlyWordsPerConversation = monthlyCountsPerConversation(donorId, conversations, "words");
                const monthlySecondsPerConversation = monthlyCountsPerConversation(donorId, conversations, "seconds");

                // Aggregated conversations data
                const dailyWords = aggregateDailyWords(dailyWordsPerConversation);

                // Determine the global date range using calculateMinMaxDates
                const { minDate, maxDate } = calculateMinMaxDates(conversations, true);
                console.log(minDate, maxDate);
                let slidingWindowMeanDailyWords: DailySentReceivedPoint[] = [];
                if (minDate && maxDate) {
                    // Generate the complete list of all days within the global date range
                    const completeDaysList = produceAllDays(minDate, maxDate);
                    // Create sliding window mean using the complete days list
                    slidingWindowMeanDailyWords = produceSlidingWindowMean(dailyWords, completeDaysList);
                }
                const dailySentHours = produceWordCountDailyHours(donorId, conversations, true);
                const dailyReceivedHours = produceWordCountDailyHours(donorId, conversations, false);

                const answerTimes = conversations.flatMap((conversation) =>
                    produceAnswerTimesPerConversation(donorId, conversation)
                );

                // General statistics
                const messageCounts = produceMonthlySentReceived(donorId, conversations, "messages");
                const wordCounts = Object.values(monthlyWordsPerConversation).flat();
                const basicStatistics = produceBasicStatistics(messageCounts, wordCounts);

                // Return all graph data for the data source
                return [
                    dataSourceValue,
                    {
                        focusConversations,
                        monthlyWordsPerConversation,
                        monthlySecondsPerConversation,
                        dailyWords,
                        slidingWindowMeanDailyWords,
                        dailyWordsPerConversation,
                        dailySentHours,
                        dailyReceivedHours,
                        answerTimes,
                        basicStatistics,
                        participantsPerConversation,
                    },
                ];
            })
    ) as Record<DataSourceValue, GraphData>;
}
