import {SentReceivedPoint} from "@models/graphData";
type CountMode = "sent" | "received" | "both";

interface CountsOverTimeData {
    counts: Record<string, number[]>;
    sortedMonths: string[];
    globalMax: number;
}

/**
 * Prepares cumulative counts over time for conversations based on the provided mode.
 *
 * @param dataMonthlyPerConversation - Monthly sent/received data for each conversation.
 * @param listOfConversations - Array of conversation identifiers.
 * @param mode - Determines whether to count "sent", "received", or "both".
 * @returns An object containing counts per month, sorted month keys, and the global maximum count.
 */
export const prepareCountsOverTimeData = (
    dataMonthlyPerConversation: SentReceivedPoint[][],
    listOfConversations: string[],
    mode: CountMode = "sent"
): CountsOverTimeData => {
    if (!["sent", "received", "both"].includes(mode)) {
        throw new Error(`Invalid mode: ${mode}. Expected 'sent', 'received', or 'both'.`);
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
            cumulativeSum += (
                mode == "sent" ? dataPoint.sentCount || 0 :
                    mode == "received" ? dataPoint.receivedCount || 0 :
                        (dataPoint.sentCount || 0) + (dataPoint.receivedCount || 0)
            )
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
