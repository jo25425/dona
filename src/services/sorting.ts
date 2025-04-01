import {Conversation} from "@models/processed";

export function sortConversationsByWordCount(conversations: Conversation[]): Conversation[] {
    return conversations.sort((a, b) => {
        const wordCountA = a.messages.reduce((count, message) => count + message.wordCount, 0);
        const wordCountB = b.messages.reduce((count, message) => count + message.wordCount, 0);
        return wordCountB - wordCountA;
    });
}
