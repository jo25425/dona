type CountMode =  "sent" | "received" | "sent+received" | "word";

interface CountsOverTimeData {
    counts: Record<string, number[]>;
    sortedMonths: string[];
    globalMax: number;
}

/**
 * Prepares cumulative counts over time for conversations based on the provided mode.
 *
 * @param dataMonthlyPerConversation - Monthly sent/received/word data for each conversation.
 * @param listOfConversations - Array of conversation identifiers.
 * @param mode - Determines whether to count "sent", "received", "sent+received", or "word" (fallback to "sent").
 * @returns An object containing counts per month, sorted month keys, and the global maximum count.
 */

interface DataPoint {
    year: number;
    month: number;
    wordCount?: number;
    sentCount?: number;
    receivedCount?: number;
}

export const prepareCountsOverTimeData = (
    dataMonthlyPerConversation: DataPoint[][],
    listOfConversations: string[],
    mode: CountMode = "sent"
): CountsOverTimeData => {
    if (!["sent", "received", "sent+received", "word"].includes(mode)) {
        throw new Error(`Invalid mode: ${mode}. Expected 'sent', 'received', 'sent+received', or 'word'.`);
    }

    const counts: Record<string, number[]> = {};
    const monthsSet = new Set<string>();
    let globalMax = 0;

    dataMonthlyPerConversation.forEach((conversationData, convIdx) => {
        let cumulativeSum = 0;
        conversationData.forEach((dataPoint) => {
            const monthKey = `${dataPoint.year}-${dataPoint.month.toString().padStart(2, "0")}`;
            monthsSet.add(monthKey);

            if (!counts[monthKey]) counts[monthKey] = Array(listOfConversations.length).fill(0);

            const value =
                mode === "word"
                    ? dataPoint.wordCount || 0
                    : mode === "sent"
                        ? dataPoint.sentCount || 0
                        : mode === "received"
                            ? dataPoint.receivedCount || 0
                            : (dataPoint.sentCount || 0) + (dataPoint.receivedCount || 0);

            cumulativeSum += value;
            counts[monthKey][convIdx] = cumulativeSum;

            if (cumulativeSum > globalMax) globalMax = cumulativeSum;
        });
    });

    const sortedMonths = Array.from(monthsSet).sort();
    let lastValues = Array(listOfConversations.length).fill(0);
    sortedMonths.forEach((monthKey) => {
        if (!counts[monthKey]) counts[monthKey] = [...lastValues];
        lastValues = counts[monthKey];
    });

    return { counts, sortedMonths, globalMax };
};
