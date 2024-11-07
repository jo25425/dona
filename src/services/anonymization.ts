import {Conversation, DataSourceValue, Message, MessageAudio} from "@models/processed";
import JSZip from "jszip";


// Function to parse the content of a text file to create a Message object
function parseTextFile(content: string): Message {
    const lines = content.split("\n");
    const wordCount = lines.join(" ").split(" ").length;
    const timestamp = Date.now(); // Extract timestamp from content if available
    const sender = "unknown"; // Set sender as needed

    return { wordCount, timestamp, sender };
}

// Function to parse audio file metadata
function parseAudioFile(file: File): MessageAudio {
    const lengthSeconds = 120; // Placeholder, determine length dynamically if possible
    const timestamp = Date.now(); // Placeholder, use actual timestamp if available
    const sender = "unknown"; // Placeholder

    return { lengthSeconds, timestamp, sender };
}

// Main function to process files
async function processFiles(dataSourceValue: DataSourceValue, files: File[]): Promise<{ messages: Message[]; messagesAudio: MessageAudio[] }> {
    const messages: Message[] = [];
    const messagesAudio: MessageAudio[] = [];

    // Datasource impacts the way files are processed?

    for (const file of files) {
        if (file.type === "application/zip") {
            // Handle zip files
            const zip = await JSZip.loadAsync(file);
            const zipFiles = zip.files;

            for (const filename in zipFiles) {
                const zipFile = zipFiles[filename];

                if (filename.endsWith(".txt")) {
                    const content = await zipFile.async("string");
                    messages.push(parseTextFile(content));
                } else if (filename.endsWith(".mp3") || filename.endsWith(".wav")) {
                    messagesAudio.push(parseAudioFile(file));
                }
            }
        } else if (file.type === "text/plain") {
            // Handle plain text files
            const content = await file.text();
            messages.push(parseTextFile(content));
        } else if (file.type.startsWith("audio/")) {
            // Handle audio files
            messagesAudio.push(parseAudioFile(file));
        }
    }

    return { messages, messagesAudio };
}

export async function anonymize_data(dataSourceValue: DataSourceValue, files: File[]): Promise<Conversation[]> {

    return new Promise(async (resolve, reject) => {
        try {
            const {messages, messagesAudio} = await processFiles(dataSourceValue, files)
            // TODO Actually use the distinct conversations uploaded
            const conversation: Conversation = {
                // id?: string,
                // isGroupConversation?: boolean,
                // conversationId?: string,
                dataSource: dataSourceValue,
                messages,
                messagesAudio,
                participants: []
            };
            return [conversation];

        } catch (error) {
            reject(error);
        }
    });
}
