import {CONFIG} from '@/config';
import {Conversation} from '@/models/processed';

export function validateMinChatsForDonation(conversations: Conversation[] | File[]): boolean {
    return conversations.length >= CONFIG.MIN_CHATS_FOR_DONATION;
}

export function validateMinImportantChatsForDonation(conversations: Conversation[]): boolean {

    // Filter conversations based on messages and contacts, for validation
    const filteredConversations = conversations.filter(conv => {
        return conv.messages.length + conv.messagesAudio.length >= CONFIG.MIN_MESSAGES_PER_CHAT &&
            conv.participants.length >= CONFIG.MIN_CONTACTS_PER_CHAT
    });

    // Final validation for the number of conversations after filtering
    return validateMinChatsForDonation(filteredConversations);
}
