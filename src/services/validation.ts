import {CONFIG} from '@/config';
import {Conversation} from '@/models/processed';

export function validateMinChatsForDonation(conversations: Conversation[] | File[]): boolean {
    return conversations.length >= CONFIG.MIN_CHATS_FOR_DONATION;
}

export function validateMinMessagesPerChat(conversations: Conversation[]): boolean {
    return conversations.every(conv => conv.messages.length + conv.messagesAudio.length >= CONFIG.MIN_MESSAGES_PER_CHAT);
}
