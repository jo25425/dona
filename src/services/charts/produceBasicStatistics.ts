import {BasicStatistics, DailySentReceivedPoint, SentReceivedPoint} from "@models/graphData";

const produceBasicStatistics = (messageCounts: SentReceivedPoint[], wordCounts: SentReceivedPoint[]): BasicStatistics => {
    const totalSentMessages = messageCounts.map((point) => point.sentCount).reduce((a, b) => a + b, 0);
    const totalReceivedMessages = messageCounts.map((point) => point.receivedCount).reduce((a, b) => a + b, 0);

    const totalSentWords = wordCounts.map((point) => point.sentCount).reduce((a, b) => a + b, 0);
    const totalReceivedWords = wordCounts.map((point) => point.receivedCount).reduce((a, b) => a + b, 0);

    const activeMonths = messageCounts.length;
    const activeYears = new Set(messageCounts.map((point) => point.year)).size;

    const sentPerActiveMonth = activeMonths > 0 ? Math.round(totalSentMessages / activeMonths) : 0;
    const receivedPerActiveMonth = activeMonths > 0 ? Math.round(totalReceivedMessages / activeMonths) : 0;

    return {
        sentMessagesTotal: totalSentMessages,
        receivedMessagesTotal: totalReceivedMessages,
        sentWordsTotal: totalSentWords,
        receivedWordsTotal: totalReceivedWords,
        numberOfActiveMonths: activeMonths,
        numberOfActiveYears: activeYears,
        sentPerActiveMonth,
        receivedPerActiveMonth,
    };
}

export default produceBasicStatistics;
