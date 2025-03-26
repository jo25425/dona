import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

// Define an interface for the processed message data
interface ProcessedMessage {
    word_count: number;
    sender_id: string;
    donor_id: string;
    datetime: string;
    conversation_id: string;
    is_group_conversation: boolean;
    is_audio_message: boolean;
    is_media: boolean;
}

// Function to generate consistent UUIDs for sender IDs
const senderIdMap = new Map<number, string>();
function getOrGenerateSenderId(handle_id: number, donor_id: string): string {
    if (handle_id === 0) {
        return donor_id; // Messages sent by donor in group chats
    }
    if (!senderIdMap.has(handle_id)) {
        senderIdMap.set(handle_id, uuidv4());
    }
    return senderIdMap.get(handle_id)!;
}

// Convert Mac Absolute Time (nanoseconds) to a human-readable timestamp
function convertMacTimestamp(nanoTimestamp: number): string {
    const macEpoch = new Date('2001-01-01T00:00:00Z'); // Mac Absolute Time epoch
    const milliseconds = nanoTimestamp / 1e6; // Convert nanoseconds to milliseconds
    return new Date(macEpoch.getTime() + milliseconds).toISOString();
}

// Function to sanitize text input
function sanitizeText(text: string | null): string {
    return text ? text.replace(/[^\w\s@.-]/g, "").trim() : "";
}

// Open the SQLite database
async function processChatDB(dbPath: string): Promise<ProcessedMessage[]> {
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const donor_id = uuidv4(); // Generate a UUID for the donor

        // Get all messages with relevant details
        const messages = await db.all(`
            SELECT COALESCE(m.text, '') AS text, m.date, COALESCE(m.handle_id, 0) AS handle_id, 
                   COALESCE(c.group_id, '') AS group_id, COALESCE(c.room_name, '') AS room_name, 
                   COALESCE(m.is_from_me, 0) AS is_from_me, COALESCE(m.is_audio_message, 0) AS is_audio_message, 
                   COALESCE(m.error, 0) AS error, COALESCE(a.mime_type, '') AS mime_type
            FROM message m
            LEFT JOIN chat_message_join cmj ON m.ROWID = cmj.message_id
            LEFT JOIN chat c ON cmj.chat_id = c.ROWID
            LEFT JOIN message_attachment_join maj ON maj.message_id = m.ROWID
            LEFT JOIN attachment a ON maj.attachment_id = a.ROWID
        `);

        // Identify which group_ids correspond to group chats
        const groupChats = new Set<string>();
        const groupInfo = await db.all(`
            SELECT group_id, COUNT(DISTINCT COALESCE(room_name, '')) as rmc
            FROM chat
            GROUP BY group_id
        `);

        // group_ids that have a corresponding room name are actual group chats
        for (const row of groupInfo) {
            if (row.rmc > 0) {
                groupChats.add(row.group_id);
            }
        }

        // Process each message, filtering out messages with errors and missing conversation IDs
        const processedMessages: ProcessedMessage[] = messages
            .filter(msg => msg.error === 0 && msg.group_id.trim() !== '') // Remove messages with errors or missing group_id
            .map(msg => ({
                word_count: sanitizeText(msg.text).split(/\s+/).length,
                sender_id: msg.is_from_me ? donor_id : getOrGenerateSenderId(msg.handle_id, donor_id),
                donor_id: donor_id,
                datetime: convertMacTimestamp(msg.date), // Convert timestamp using Mac epoch
                conversation_id: msg.group_id,
                is_group_conversation: groupChats.has(msg.group_id),
                is_audio_message: msg.is_audio_message > 0,
                is_media: msg.mime_type !== '' // Flag for media presence
            }));

        await db.close();
        return processedMessages;
    } catch (error) {
        console.error("Error processing chat database:", error);
        return [];
    }
}

// Run the function (for standalone testing)
(async () => {
    const dbPath = 'chat.db';
    const result = await processChatDB(dbPath);
    console.log(result.slice(0, 10)); // Print first 10 processed messages as sample output
})();
