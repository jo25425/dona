import initSqlJs from 'sql.js';
import { AnonymizationResult, Conversation, DataSourceValue, Message, MessageAudio } from '@/models/processed';
import { ContactPseudonyms, ChatPseudonyms } from '@/services/parsing/shared/pseudonyms';
import {getAliasConfig} from "@services/parsing/shared/aliasConfig";

export default async function handleImessageDBFiles(file: File): Promise<AnonymizationResult> {
    const SQL = await initSqlJs();
    const buffer = await file.arrayBuffer();
    const db = new SQL.Database(new Uint8Array(buffer));
    const aliasConfig = getAliasConfig();
    let donorName = ''; // Example donor ID

    // Query to get messages
    const messages: any[] = [];
    const messagesStmt = db.prepare(`
        SELECT COALESCE(m.text, '') AS text,
               m.date,
               COALESCE(m.handle_id, 0) AS handle_id,
               COALESCE(c.group_id, '') AS group_id,
               COALESCE(c.room_name, '') AS room_name,
               COALESCE(m.is_from_me, 0) AS is_from_me,
               COALESCE(m.is_audio_message, 0) AS is_audio_message,
               COALESCE(m.error, 0) AS error,
               COALESCE(a.mime_type, '') AS mime_type
        FROM message m
                 LEFT JOIN chat_message_join cmj ON m.ROWID = cmj.message_id
                 LEFT JOIN chat c ON cmj.chat_id = c.ROWID
                 LEFT JOIN message_attachment_join maj ON maj.message_id = m.ROWID
                 LEFT JOIN attachment a ON maj.attachment_id = a.ROWID
        WHERE m.error = 0 AND c.group_id IS NOT NULL;
    `);
    while (messagesStmt.step()) {
        const row = messagesStmt.getAsObject();
        messages.push(row);
    }
    messagesStmt.free();
    // console.log("Messages:", messages.length);

    // Query to get group chat information
    const groupChats = new Set<string>();
    const groupInfoStmt = db.prepare(`
        SELECT group_id, COUNT(DISTINCT COALESCE(room_name, '')) as rmc
        FROM chat
        GROUP BY group_id;
    `);

    while (groupInfoStmt.step()) {
        const row = groupInfoStmt.getAsObject();
        if (Number(row.rmc ?? 0) > 0) {
            groupChats.add(String(row.group_id ?? ''));
        }
    }
    groupInfoStmt.free();
    // console.log(groupChats);

    const conversationsMap = new Map<string, Conversation>();
    const contactPseudonyms = new ContactPseudonyms(aliasConfig.contactAlias);
    const chatPseudonyms = new ChatPseudonyms(aliasConfig.donorAlias, aliasConfig.chatAlias, DataSourceValue.IMessage);

    messages.forEach(row => {
        const timestamp = Number(row.date) / 1000000000 + 978307200;
        // TODO: Get sender name from handle_id
        const sender: string = row.handle_id?.toString() || 'Unknown';

         // Set donor ID once found
        if (row.is_from_me && !donorName) {
            donorName = sender;
            chatPseudonyms.setDonorName(donorName);
            contactPseudonyms.setPseudonym(donorName, aliasConfig.donorAlias)
        }
        const conversationId = row.group_id?.toString() || 'Unknown';
        const isGroupConversation = groupChats.has(conversationId);
        const isAudioMessage = Number(row.is_audio_message ?? 0) > 0;

        const pseudonym = contactPseudonyms.getPseudonym(sender);

        if (!conversationsMap.has(conversationId)) {
            conversationsMap.set(conversationId, {
                id: conversationId,
                isGroupConversation,
                dataSource: DataSourceValue.IMessage,
                messages: [],
                messagesAudio: [],
                participants: [],
                conversationPseudonym: ''
            });
        }

        const conversation = conversationsMap.get(conversationId);
        if (conversation) {
            if (!conversation.participants.includes(pseudonym)) {
                conversation.participants.push(pseudonym);
            }

            if (isAudioMessage) {
                conversation.messagesAudio.push({
                    lengthSeconds: 0, // Placeholder, calculate if needed
                    timestamp,
                    sender: pseudonym
                } as MessageAudio);
            } else {
                conversation.messages.push({
                    id: row.id?.toString(),
                    wordCount: (row.text as string).split(/\s+/).length,
                    timestamp,
                    sender: pseudonym
                } as Message);
            }
        }
    });

    // Generate conversation pseudonyms based on all participants
    conversationsMap.forEach(conversation => {
        const participants = contactPseudonyms.getOriginalNames(conversation.participants);
        conversation.conversationPseudonym = chatPseudonyms.getPseudonym(participants);
    });

    db.close();

    return {
        anonymizedConversations: Array.from(conversationsMap.values()),
        participantNamesToPseudonyms: contactPseudonyms.getPseudonymMap(),
        chatMappingToShow: chatPseudonyms.getPseudonymMap()
    };
}
