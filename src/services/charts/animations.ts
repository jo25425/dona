interface CountsOverTimeData {
    counts: Record<string, number[]>;
    sortedMonths: string[];
    globalMax: number;
}

interface SentReceivedPoint {
    year: number;
    month: number;
    wordCount?: number;
    sentCount?: number;
    receivedCount?: number;
}

/**
 * Prepares cumulative counts over time for conversations based on the provided mode.
 *
 * @param dataMonthlyPerConversation - Monthly sent/received/word data for each conversation.
 * @returns An object containing counts per month, sorted month keys, and the global maximum count.
 */
export const prepareCountsOverTimeData = (
    dataMonthlyPerConversation: Record<string, SentReceivedPoint[]>,
    mode: "sent+received" | "sent"  = "sent+received",
): CountsOverTimeData => {
    const counts: Record<string, number[]> = {};
    const monthsSet = new Set<string>();
    let globalMax = 0;

    Object.entries(dataMonthlyPerConversation).forEach(([conversationId, conversationData], convIdx) => {
        let cumulativeSum = 0;
        conversationData.forEach((dataPoint) => {
            const monthKey = `${dataPoint.year}-${dataPoint.month.toString().padStart(2, "0")}`;
            monthsSet.add(monthKey);

            if (!counts[monthKey]) counts[monthKey] = Array(Object.keys(dataMonthlyPerConversation).length).fill(0);

            const value =
                 mode === "sent" ? dataPoint.sentCount || 0
                     : (dataPoint.sentCount || 0) + (dataPoint.receivedCount || 0);

            cumulativeSum += value;
            counts[monthKey][convIdx] = cumulativeSum;

            if (cumulativeSum > globalMax) globalMax = cumulativeSum;
        });
    });

    const sortedMonths = Array.from(monthsSet).sort();
    let lastValues = Array(Object.keys(dataMonthlyPerConversation).length).fill(0);
    sortedMonths.forEach((monthKey) => {
        if (!counts[monthKey]) counts[monthKey] = [...lastValues];
        lastValues = counts[monthKey];
    });

    return { counts, sortedMonths, globalMax };
};
