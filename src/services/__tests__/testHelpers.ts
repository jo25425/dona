import {Conversation} from "@models/processed";


export const createConversation = (dataSource: string, messages: Array<[number, number, string]>): Conversation => {
    const parsedMessages = messages.map(([year, month, sender]) => ({
        timestamp: new Date(year, month - 1, 1, 12, 0).getTime(),
        wordCount: 15,
        sender,
    }));

    const participants = [...new Set(messages.map(([_, __, sender]) => sender))];

    return {
        isGroupConversation: participants.length > 2,
        conversationId: "123",
        participants,
        messages: parsedMessages,
        messagesAudio: [],
        dataSource,
        conversationPseudonym: "test-convo",
    };
}

export const getEpochSeconds = (year: number, month: number, date: number, hour: number, minute: number): number => {
    return Math.floor(new Date(year, month - 1, date, hour, minute).getTime() / 1000);
};