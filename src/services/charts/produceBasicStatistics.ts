import {BasicStatistics, MessageCounts, SentReceivedPoint} from "@models/graphData";

const produceBasicStatistics = (messageCounts: MessageCounts, wordCounts: SentReceivedPoint[], secondCounts: SentReceivedPoint[]): BasicStatistics => {
    console.log("messageCounts", messageCounts);
    console.log("wordCounts", wordCounts);
    console.log("secondCounts", secondCounts);

    // Totals
   const calculateTotal = (data: SentReceivedPoint[], key: keyof SentReceivedPoint): number =>
       data.map((point) => point[key]).reduce((a, b) => a + b, 0);

   const sentWordsTotal = calculateTotal(wordCounts, "sentCount");
   const receivedWordsTotal = calculateTotal(wordCounts, "receivedCount");
   const sentSecondsTotal = calculateTotal(secondCounts, "sentCount");
   const receivedSecondsTotal = calculateTotal(secondCounts, "receivedCount");

    // Averages
    const activeMonths = new Set([...wordCounts, ...secondCounts].map((point) => `${point.year}-${point.month}`)).size;
    const activeYears = new Set([...wordCounts, ...secondCounts].map((point) => point.year)).size;

    const sentPerActiveMonth = activeMonths > 0 ? Math.round(messageCounts.allMessages.sent / activeMonths) : 0;
    const receivedPerActiveMonth = activeMonths > 0 ? Math.round(messageCounts.allMessages.received / activeMonths) : 0;

    return {
        sentMessagesTotal: messageCounts.allMessages.sent,
        receivedMessagesTotal: messageCounts.allMessages.received,
        sentWordsTotal,
        receivedWordsTotal,
        sentSecondsTotal,
        receivedSecondsTotal,
        numberOfActiveMonths: activeMonths,
        numberOfActiveYears: activeYears,
        sentWordsPerActiveMonth: sentPerActiveMonth,
        receivedWordsPerActiveMonth: receivedPerActiveMonth,
    };
}

export default produceBasicStatistics;
