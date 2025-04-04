import {Conversation} from "@models/processed";
import {RangeErrors} from "@services/errors";
import {CONFIG} from "@/config";

export type NullableRange = [Date | null, Date | null];

export function calculateMinMaxDates(conversations: Conversation[], textOnly: boolean = false): { minDate: Date | null; maxDate: Date | null } {
    const timestamps = conversations.flatMap(conversation =>
        (
            textOnly ?
                conversation.messages
                : [...conversation.messages, ...conversation.messagesAudio]
        ).map(message => message.timestamp)
    );

    if (timestamps.length === 0) return { minDate: null, maxDate: null };

    return {
        minDate: new Date(Math.min(...timestamps)),
        maxDate: new Date(Math.max(...timestamps)),
    };
}

export const filterDataByRange = (conversations: Conversation[], range: NullableRange): Conversation[] => {
    if (range[0] == null || range[1] == null) return conversations;

    const [startDate, endDate] = range;

    // Define a reusable filter for date range
    const withinRange = (timestamp: number) => {
        const msgDate = new Date(timestamp);
        return msgDate >= startDate && msgDate <= endDate;
    };

    return conversations
        .map(conversation => ({
            ...conversation,
            messages: conversation.messages.filter(msg => withinRange(msg.timestamp)),
            messagesAudio: conversation.messagesAudio.filter(msg => withinRange(msg.timestamp)),
        }))
        .filter(conversation => conversation.messages.length > 0 || conversation.messagesAudio.length > 0);
};

export const validateDateRange = (conversations: Conversation[], range: NullableRange): string | null => {
    if (!range[0] || !range[1]) return RangeErrors.NonsenseRange;

    const diffTime = Math.abs(range[1].getTime() - range[0]!.getTime());
    const diffMonths = diffTime / (1000 * 3600 * 24 * 30); // Approx. months difference

    if (diffMonths < CONFIG.MIN_DONATION_TIME_PERIOD_MONTHS) return RangeErrors.NotEnoughMonthsInRange;

    const filteredData = filterDataByRange(conversations, range);
    if (filteredData.length === 0) return RangeErrors.NoMessagesInRange;

    return null;
};
