import initSqlJs from 'sql.js';
import { AnonymizationResult, Conversation, Message } from '@/models/processed';
import { ContactPseudonyms, ChatPseudonyms } from '@/services/parsing/shared/pseudonyms';

export default async function handleImessageDBFiles(file: File): Promise<AnonymizationResult> {
    const SQL = await initSqlJs();
    const buffer = await file.arrayBuffer();
    const db = new SQL.Database(new Uint8Array(buffer));

    const messagesStmt = db.prepare(`
        SELECT message.rowid as id, message.text, message.date,
               handle.id as sender, chat.chat_identifier as conversationId
        FROM message
                 LEFT JOIN handle ON message.handle_id = handle.rowid
                 LEFT JOIN chat_message_join ON message.rowid = chat_message_join.message_id
                 LEFT JOIN chat ON chat_message_join.chat_id = chat.rowid
        WHERE message.text IS NOT NULL;
    `);

    const conversationsMap = new Map<string, Conversation>();
    const contactPseudonyms = new ContactPseudonyms('Contact');
    const chatPseudonyms = new ChatPseudonyms('Donor', 'Chat', 'iMessage');

    while (messagesStmt.step()) {
        const row = messagesStmt.getAsObject();
        const timestamp = Number(row.date) / 1000000000 + 978307200;
        const sender = row.sender?.toString() || 'Unknown';
        const conversationId = row.conversationId?.toString() || 'Unknown';

        const pseudonym = contactPseudonyms.getPseudonym(sender);

        if (!conversationsMap.has(conversationId)) {
            const chatPseudonym = chatPseudonyms.getPseudonym([pseudonym]);
            conversationsMap.set(conversationId, {
                id: conversationId,
                isGroupConversation: false,
                dataSource: 'iMessage',
                messages: [],
                messagesAudio: [],
                participants: [pseudonym],
                conversationPseudonym: chatPseudonym
            });
        }

        conversationsMap.get(conversationId)?.messages.push({
            id: row.id?.toString(),
            wordCount: (row.text as string).split(/\s+/).length,
            timestamp,
            sender: pseudonym
        } as Message);
    }

    messagesStmt.free();
    db.close();

    return {
        anonymizedConversations: Array.from(conversationsMap.values()),
        participantNamesToPseudonyms: contactPseudonyms.getPseudonymMap(),
        chatMappingToShow: chatPseudonyms.getPseudonymMap()
    };
}