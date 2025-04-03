import {Conversation} from "@models/processed";
import {AnswerTimePoint, DailyHourPoint, DailySentReceivedPoint, SentReceivedPoint} from "@models/graphData";

type DatePoint = {
    year: number;
    month: number;
    date: number;
};

const produceMonthlySentReceived = (
    donorId: string, conversations: Conversation[], toCount: "words" | "messages"
): SentReceivedPoint[] => {
    const monthlyMap = new Map<string, { sent: number; received: number }>();

    conversations.forEach(conversation => {
        conversation.messages.forEach(message => {
            const date = new Date(message.timestamp);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (!monthlyMap.has(key)) monthlyMap.set(key, { sent: 0, received: 0 });

            const stats = monthlyMap.get(key)!;
            const toAdd: number = toCount == "words" ? message.wordCount : 1;
            if (message.sender === donorId) stats.sent += toAdd;
            else stats.received += toAdd;
        });
    });

    return Array.from(monthlyMap.entries()).map(([key, { sent, received }]) => {
        const [year, month] = key.split("-").map(Number);
        return { year, month, sentCount: sent, receivedCount: received };
    });
}

/**
 * Aggregates the total sent and received message counts per month for a set of conversations.
 *
 * @param donorId - The ID of the donor whose messages are being analyzed.
 * @param conversations - A list of conversations to process.
 * @returns An array of SentReceivedPoint objects, each representing message counts for a specific month.
 */
export const produceMonthlySentReceivedMessages = (
    donorId: string, conversations: Conversation[]
): SentReceivedPoint[] => {
    return produceMonthlySentReceived(donorId, conversations, "messages");
}

/**
 * Aggregates the total sent and received word counts per month for a set of conversations.
 *
 * @param donorId - The ID of the donor whose messages are being analyzed.
 * @param conversations - A list of conversations to process.
 * @returns An array of SentReceivedPoint objects, each representing word counts for a specific month.
 */
export const produceMonthlySentReceivedWords = (
    donorId: string, conversations: Conversation[]
): SentReceivedPoint[] => {
    return produceMonthlySentReceived(donorId, conversations, "words");
}

/**
 * Aggregates the total sent and received word counts per day for a specific conversation.
 *
 * @param donorId - The ID of the donor whose messages are being analyzed.
 * @param conversation - The conversation to process.
 * @returns An array of DailySentReceivedPoint objects, each representing word counts for a specific day.
 */
export const produceDailyWordsPerConversation = (
    donorId: string,
    conversation: Conversation
): DailySentReceivedPoint[] => {
    const dailyMap = new Map<string, { sent: number; received: number }>();

    conversation.messages.forEach((message) => {
        const date = new Date(message.timestamp);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        if (!dailyMap.has(key)) dailyMap.set(key, { sent: 0, received: 0 });

        const stats = dailyMap.get(key)!;
        if (message.sender === donorId) stats.sent += message.wordCount;
        else stats.received += message.wordCount;
    });

    return Array.from(dailyMap.entries()).map(([key, { sent, received }]) => {
        const [year, month, date] = key.split("-").map(Number);
        const epochSeconds = new Date(year, month - 1, date, 12, 30).getTime() / 1000;
        return { year, month, date, sentCount: sent, receivedCount: received, epochSeconds };
    });
}

/**
 * Aggregates the total sent and received word counts per day for a set of conversations.
 *
 * @param perConversationData - An array of DailySentReceivedPoint objects, each representing word counts for a specific day.
 * @returns An array of DailySentReceivedPoint objects, each representing word counts for a specific day across all conversations.
 */
export const aggregateDailyWords = (
    perConversationData: DailySentReceivedPoint[][]
): DailySentReceivedPoint[] => {
    const aggregateMap = new Map<string, { sent: number; received: number }>();

    perConversationData.flat().forEach(({ year, month, date, sentCount, receivedCount }) => {
        const key = `${year}-${month}-${date}`;
        if (!aggregateMap.has(key)) aggregateMap.set(key, { sent: 0, received: 0 });

        const stats = aggregateMap.get(key)!;
        stats.sent += sentCount;
        stats.received += receivedCount;
    });

    return Array.from(aggregateMap.entries()).map(([key, { sent, received }]) => {
        const [year, month, date] = key.split("-").map(Number);
        const epochSeconds = new Date(year, month - 1, date, 12, 30).getTime() / 1000;
        return { year, month, date, sentCount: sent, receivedCount: received, epochSeconds };
    });
}

/**
 * Aggregates the word counts per hour for a specific conversation, based on sent or received messages.
 *
 * @param donorId - The ID of the donor whose messages are being analyzed.
 * @param conversations - The conversations to process.
 * @param sent - If true, computes word counts for sent messages; otherwise, for received messages.
 * @returns An array of DailyHourPoint objects, each representing word counts for a specific hour.
 */
export const produceWordCountDailyHours = (
    donorId: string,
    conversations: Conversation[],
    sent: boolean
): DailyHourPoint[] => {
    const hourlyMap = new Map<string, number>();

    conversations.forEach((conversation) => {
        conversation.messages
            .filter((message) =>
                sent ? message.sender === donorId : message.sender !== donorId
            )
            .forEach((message) => {
                const date = new Date(message.timestamp);
                const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

                hourlyMap.set(key, (hourlyMap.get(key) || 0) + message.wordCount);
            });
    })

    return Array.from(hourlyMap.entries()).map(([key, wordCount]) => {
        const [year, month, date, hour, minute] = key.split("-").map(Number);
        const epochSeconds = new Date(year, month - 1, date, hour, minute).getTime() / 1000;
        return { year, month, date, hour, minute, wordCount, epochSeconds };
    });
}

/**
 * Calculates the answer times between messages in a specific conversation.
 *
 * @param donorId - The ID of the donor whose messages are being analyzed.
 * @param conversation - The conversation to process.
 * @returns An array of AnswerTimePoint objects, each representing the response time for a message.
 */
export const produceAnswerTimesPerConversation = (
    donorId: string,
    conversation: Conversation
): AnswerTimePoint[] => {
    const sortedMessages = [...conversation.messages].sort((a, b) => a.timestamp - b.timestamp);

    return sortedMessages
        .slice(1)
        .map((message, i) => {
            const prevMessage = sortedMessages[i];
            if (message.sender !== prevMessage.sender && message.timestamp >= prevMessage.timestamp) {
                return {
                    responseTimeMs: message.timestamp - prevMessage.timestamp,
                    isFromDonor: message.sender === donorId,
                    timestampMs: message.timestamp,
                };
            }
            return null;
        })
        .filter((point): point is AnswerTimePoint => point !== null);
}

export const getEpochSeconds = (
    year: number,
    month: number,
    date: number,
    hour: number = 12,
    minute: number = 30
): number => {
    return Math.floor(new Date(year, month - 1, date, hour, minute).getTime() / 1000);
};

/**
 * Produces a complete list of dates between the given start and end date (inclusive).
 *
 * @param startDate - Start dte.
 * @param endDate - End date.
 * @returns A list of objects representing each date with year, month, and date.
 */
export function produceAllDays(startDate: Date, endDate: Date): { year: number; month: number; date: number }[] {
    const allDays: { year: number; month: number; date: number }[] = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        allDays.push({
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1, // Months are zero-based in JS Date
            date: currentDate.getDate(),
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return allDays;
}

/**
 * Computes a sliding window mean of sent and received counts over a list of complete dates.
 * Means that are zero for both sent and received aren't included to avoid unnecessary data loads.
 *
 * @param dailyData - The input data containing daily sent and received counts.
 * @param completeDays - The list of all days to be considered for the computation (produced by produceAllDays).
 * @param windowSize - The size of the sliding window.
 * @returns A list of DailySentReceivedPoint objects with computed sliding means, skipping zero means that aren't the very first or last.
 */
export function produceSlidingWindowMean(
    dailyData: DailySentReceivedPoint[],
    completeDays: DatePoint[],
    windowSize: number = 30
): DailySentReceivedPoint[] {
    const dataMap = new Map<string, DailySentReceivedPoint>();

    // Populate the map for quick lookups
    dailyData.forEach((day) => {
        const key = `${day.year}-${String(day.month).padStart(2, "0")}-${String(day.date).padStart(2, "0")}`;
        dataMap.set(key, day);
    });

    const halfWindow = Math.floor(windowSize / 2);
    const allSlidingWindowMeans: DailySentReceivedPoint[] = completeDays.map(({ year, month, date }, index) => {
        const epochSeconds = getEpochSeconds(year, month, date);

        // Iterate over selected range, adding counts from daily data where available
        let sentSum = 0;
        let receivedSum = 0;
        let count = 0;
        completeDays.slice(
            Math.max(0, index - halfWindow),
            Math.min(completeDays.length, index + halfWindow + 1)
        ).forEach(({ year: y, month: m, date: d }) => {
            const dayKey = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const dayData = dataMap.get(dayKey);

            if (dayData) {
                sentSum += dayData.sentCount;
                receivedSum += dayData.receivedCount;
            }
            count++; // Include all days, even without data, as long as they're within the donation
        });

        // Compute the means
        const meanSent = count > 1 ? Math.round(sentSum / count) : 0;
        const meanReceived = count > 1 ? Math.round(receivedSum / count) : 0;

        return {
            year,
            month,
            date,
            sentCount: meanSent,
            receivedCount: meanReceived,
            epochSeconds,
        };
    });

    // Filter out days with 0 sent and received means, but keep the first and last day
    return allSlidingWindowMeans.filter((day, index, array) => {
        const isNonZero = day.sentCount !== 0 || day.receivedCount !== 0;
        const isBoundary = index === 0 || index === array.length - 1;
        return isNonZero || isBoundary;
    });
}
