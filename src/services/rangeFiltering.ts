import {Conversation} from "@models/processed";

export function calculateMinMaxDates(conversations: Conversation[]): { minDate: Date | null; maxDate: Date | null } {

    const timestamps = conversations.flatMap(conversation =>
        [...conversation.messages, ...conversation.messagesAudio].map(message => message.timestamp)
    );

    if (timestamps.length === 0) return { minDate: null, maxDate: null };

    return {
        minDate: new Date(Math.min(...timestamps)),
        maxDate: new Date(Math.max(...timestamps)),
    };
}
