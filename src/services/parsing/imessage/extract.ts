import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { Conversation, Message, AnonymizationResult } from '@/models/processed';
import { generatePseudonym } from '@/services/parsing/shared/pseudonyms';

const DB_PATH = '/mnt/data/chat.db'; // Update as needed

export async function extractMessagesFromChatDB(): Promise<AnonymizationResult> {
    const db: Database = await open({ filename: DB_PATH, driver: sqlite3.Database });

    // Query iMessage messages
    const messages = await db.all(`
        SELECT message.rowid as id, message.text, message.date,
               handle.id as sender
        FROM message
                 LEFT JOIN handle ON message.handle_id = handle.rowid
        WHERE message.text IS NOT NULL;
    `);

    // Process results into Conversation format
    const conversationsMap = new Map<string, Conversation>();
    const participantPseudonyms = new Map<string, string>();
    const chatMappingToShow = new Map<string, string[]>();

    messages.forEach((msg) => {
        const timestamp = Number(msg.date) / 1000000000 + 978307200; // Convert Apple timestamp
        const sender = msg.sender || 'Unknown';

        // Generate or reuse pseudonym
        if (!participantPseudonyms.has(sender)) {
            participantPseudonyms.set(sender, generatePseudonym(sender));
        }
        const pseudonym = participantPseudonyms.get(sender)!;

        const conversationId = `imessage-${pseudonym}`;
        if (!conversationsMap.has(conversationId)) {
            conversationsMap.set(conversationId, {
                id: conversationId,
                isGroupConversation: false,
                dataSource: 'imessage',
                messages: [],
                messagesAudio: [],
                participants: [pseudonym],
                conversationPseudonym: generatePseudonym(conversationId)
            });
            chatMappingToShow.set(conversationId, [pseudonym]);
        }

        conversationsMap.get(conversationId)?.messages.push({
            id: msg.id,
            wordCount: msg.text.split(/\s+/).length,
            timestamp,
            sender: pseudonym
        } as Message);
    });

    await db.close();
    return {
        anonymizedConversations: Array.from(conversationsMap.values()),
        participantNamesToPseudonyms: Object.fromEntries(participantPseudonyms),
        chatMappingToShow
    };
}

// Simple test function for debugging
if (require.main === module) {
    extractMessagesFromChatDB()
        .then(result => console.log(JSON.stringify(result, null, 2)))
        .catch(console.error);
}
