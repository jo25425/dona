import {Conversation, DataDonation, Message, MessageAudio} from "@models/processed";
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
export async function processFiles(files: File[]): Promise<{ messages: Message[]; audioMessages: MessageAudio[] }> {
    const messages: Message[] = [];
    const audioMessages: MessageAudio[] = [];

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
                    audioMessages.push(parseAudioFile(file));
                }
            }
        } else if (file.type === "text/plain") {
            // Handle plain text files
            const content = await file.text();
            messages.push(parseTextFile(content));
        } else if (file.type.startsWith("audio/")) {
            // Handle audio files
            audioMessages.push(parseAudioFile(file));
        }
    }

    return { messages, audioMessages };
}

// export async function anonymize_data(files: File[]): Promise<DataDonation> {
//     return new Promise((resolve, reject) => {
//         try {
//
//             const donorId: string = "";
//             const conversations: Conversation[] = [];
//             const messages: Message[] = [];
//             const audioMessages: MessageAudio[] = [];
//
//             for (const file of files) {
//                 if (file.type === "application/zip") {
//                     // Handle zip files
//                     const zip = await JSZip.loadAsync(file);
//                     const zipFiles = zip.files;
//
//                     for (const filename in zipFiles) {
//                         const zipFile = zipFiles[filename];
//
//                         if (filename.endsWith(".txt")) {
//                             const content = await zipFile.async("string");
//                             messages.push(parseTextFile(content));
//                         } else if (filename.endsWith(".mp3") || filename.endsWith(".wav")) {
//                             audioMessages.push(parseAudioFile(file));
//                         }
//                     }
//                 } else if (file.type === "text/plain") {
//                     // Handle plain text files
//                     const content = await file.text();
//                     messages.push(parseTextFile(content));
//                 } else if (file.type.startsWith("audio/")) {
//                     // Handle audio files
//                     audioMessages.push(parseAudioFile(file));
//                 }
//             }
//
//             const anonymizedData: DataDonation = {
//                 donorId,
//                 conversations
//             } ;
//             return anonymizedData;
//
//         } catch (error) {
//             reject(error);
//         }
//     });
// };
