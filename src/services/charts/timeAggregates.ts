import {Conversation} from "@models/processed";
import {AnswerTimePoint, DailyHourPoint, DailySentReceivedPoint, SentReceivedPoint} from "@models/graphData";


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
 * @param conversation - The conversation to process.
 * @param sent - If true, computes word counts for sent messages; otherwise, for received messages.
 * @returns An array of DailyHourPoint objects, each representing word counts for a specific hour.
 */
export const produceWordCountDailyHours = (
    donorId: string,
    conversation: Conversation,
    sent: boolean
): DailyHourPoint[] => {
    const hourlyMap = new Map<string, number>();

    conversation.messages
        .filter((message) =>
            sent ? message.sender === donorId : message.sender !== donorId
        )
        .forEach((message) => {
            const date = new Date(message.timestamp);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

            hourlyMap.set(key, (hourlyMap.get(key) || 0) + message.wordCount);
        });

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

/**
 * Generates a list of all days between the earliest and latest timestamps in the input data.
 *
 * @param dailyWords - An array of DailySentReceivedPoint objects to determine the date range.
 * @returns An array of TimeFrameWithDaysInts objects, each representing a specific day within the date range.
 */
export const createAllDaysList = (dailyWords: DailySentReceivedPoint[]): DailySentReceivedPoint[] => {
    if (dailyWords.length === 0) return [];

    const startDate = new Date(dailyWords[0].epochSeconds * 1000);
    const endDate = new Date(dailyWords[dailyWords.length - 1].epochSeconds * 1000);

    const allDays: DailySentReceivedPoint[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        allDays.push({
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
            date: currentDate.getDate(),
            sentCount: 0,
            receivedCount: 0,
            epochSeconds: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                12,
                30
            ).getTime() / 1000,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return allDays;
}

export function produceSlidingWindowMean(
    dailyData: DailySentReceivedPoint[],
    allDays: DailySentReceivedPoint[],
    windowSize: number = 15
): DailySentReceivedPoint[] {
    // Map daily data for quick lookup
    const dataMap = new Map<string, DailySentReceivedPoint>();
    dailyData.forEach((day) => {
        const key = `${day.year}-${day.month}-${day.date}`;
        dataMap.set(key, day);
    });

    return allDays.map((currentDay, index) => {
        const startIndex = Math.max(0, index - windowSize);
        const endIndex = Math.min(allDays.length - 1, index + windowSize);

        let sentSum = 0;
        let receivedSum = 0;
        let count = 0;

        // Iterate over the sliding window
        for (let i = startIndex; i <= endIndex; i++) {
            const windowDay = allDays[i];
            const key = `${windowDay.year}-${windowDay.month}-${windowDay.date}`;
            const data = dataMap.get(key);

            if (data) {
                sentSum += data.sentCount;
                receivedSum += data.receivedCount;
                count++;
            }
        }

        // Calculate means
        const meanSent = count > 0 ? Math.round(sentSum / count) : 0;
        const meanReceived = count > 0 ? Math.round(receivedSum / count) : 0;

        return {
            ...currentDay,
            sentCount: meanSent,
            receivedCount: meanReceived,
        };
    });
}


