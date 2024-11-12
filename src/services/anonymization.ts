import {Conversation, DataSourceValue, Message, MessageAudio} from "@models/processed";
// const facebookZipFileHandler = require('./parsing/facebook/facebookZipFileHandler');
// const whatsappTxtFileHandler = require('./parsing/whatsapp/whatsappTxtFileHandler');
// const instagramZipFileHandler = require('./parsing/instagram/instagramZipFileHandler');
// const whatsappZipFileHandler = require("./parsing/whatsapp/whatsappZipFileHandler");

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

    let handler;

    switch (dataSourceValue) {
        case DataSourceValue.WhatsApp:
            let txtFiles = []
            let zipFiles = []

            // there can be zip or txt files
            // collect all txt files and extract txt files from zip files
            for (let i = 0; i < files.length; i++) {
                if (files[i].type == "text/plain") {
                    txtFiles.push(files[i])
                } else {
                    zipFiles.push(whatsappZipFileHandler(files[i]))
                }
            }

            if (zipFiles.length > 0) {
                handler = Promise.all(zipFiles)
                    .then(res => {
                        // filter out null, null would be other files in the zip that are not .txt
                        return whatsappTxtFileHandler(txtFiles.concat(res.flat().filter(file => file != null)))
                    })
            } else {
                handler = whatsappTxtFileHandler(txtFiles);
            }
            break;
        // case DataSourceValue.Facebook:
        //     handler = facebookZipFileHandler(files);
        //     break;
        // case DataSourceValue.Instagram:
        //     handler = instagramZipFileHandler(files);
        //     break;
    }

    const res = await handler()

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
