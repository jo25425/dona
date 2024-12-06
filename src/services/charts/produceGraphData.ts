import {Conversation, DataSourceValue} from "@models/processed";
import {GraphData} from "@models/graphData";
import {
    aggregateDailyWords,
    createAllDaysList,
    produceAnswerTimesPerConversation,
    produceDailyWordsPerConversation, produceMonthlySentReceivedMessages,
    produceMonthlySentReceivedWords,
    produceSlidingWindowMean,
    produceWordCountDailyHours
} from "@services/charts/timeAggregates";
import produceBasicStatistics from "@services/charts/produceBasicStatistics";

export default function produceGraphData(donorId: string, allConversations: Conversation[]): Record<string, GraphData> {
    return Object.fromEntries(
        Map.groupBy(allConversations, ({ dataSource}) => dataSource)
            .entries()
            .map(([dataSourceValue, conversations]) => {
                // Compute various data points
                const monthlySentReceivedPerConversation = conversations.map((conversation) =>
                    produceMonthlySentReceivedWords(donorId, [conversation])
                );
                const dailyWordsPerConversation = conversations.map(conversation =>
                    produceDailyWordsPerConversation(donorId, conversation)
                );
                const dailyWords = aggregateDailyWords(dailyWordsPerConversation);

                const dailySentHoursPerConversation = conversations.map((conversation) =>
                    produceWordCountDailyHours(donorId, conversation, true)
                );
                const dailyReceivedHoursPerConversation = conversations.map((conversation) =>
                    produceWordCountDailyHours(donorId, conversation, false)
                );
                const answerTimes = conversations.flatMap(conversation =>
                    produceAnswerTimesPerConversation(donorId, conversation)
                );
                const participantsPerConversation = conversations.map(conversation =>
                    conversation.participants.filter(participant => participant !== donorId)
                );

                // General statistics
                const messageCounts = produceMonthlySentReceivedMessages(donorId, conversations);
                const wordCounts = monthlySentReceivedPerConversation.flat();
                const basicStatistics = produceBasicStatistics(messageCounts, wordCounts);

                // Create sliding window mean
                const allDays = createAllDaysList(dailyWords);
                const slidingWindowMeanPerConversation = dailyWordsPerConversation.map((dailyWords) =>
                    produceSlidingWindowMean(dailyWords, allDays)
                );

                // Return all graph data
                return [
                    dataSourceValue,
                    {
                        monthlySentReceivedPerConversation,
                        dailyWords,
                        slidingWindowMeanPerConversation,
                        dailyWordsPerConversation,
                        dailySentHoursPerConversation,
                        dailyReceivedHoursPerConversation,
                        answerTimes,
                        basicStatistics,
                        participantsPerConversation,
                    }
                ];
            })
    ) as Record<DataSourceValue, GraphData>;
}
