import {AnonymizationResult, DataSourceValue} from "@models/processed";
import handleWhatsappTxtFiles from "@services/parsing/whatsapp/whatsappHandler";
import {extractTxtFilesFromZip} from "@services/parsing/shared/zipExtraction";
import {DonationValidationError, DonationErrors} from "@services/errors";
import {handleFacebookZipFiles, handleInstagramZipFiles} from "@services/parsing/meta/metaHandlers";
import handleImessageDBFiles from "@services/parsing/imessage/imessageHandler";
import {validateMinChatsForDonation} from "@services/validation";
import {CONFIG} from "@/config";

export async function anonymizeData(dataSourceValue: DataSourceValue, files: File[]): Promise<AnonymizationResult> {
    let resultPromise;
    switch (dataSourceValue) {
        case DataSourceValue.WhatsApp:
            const txtFiles: File[] = [];
            const zipFilesPromises: Promise<File[]>[] = [];

            // Separate text files and handle zip files
            files.forEach(file => {
                if (file.type === "text/plain") {
                    txtFiles.push(file);
                } else {
                    zipFilesPromises.push(extractTxtFilesFromZip(file));
                }
            });

            resultPromise = Promise.all(zipFilesPromises)
                .then(unzippedFiles => handleWhatsappTxtFiles(txtFiles.concat(unzippedFiles.flat())));
            break;
        case DataSourceValue.Facebook:
            resultPromise = handleFacebookZipFiles(files);
            break;
        case DataSourceValue.Instagram:
            resultPromise = handleInstagramZipFiles(files);
            break;
        case DataSourceValue.IMessage:
            resultPromise = handleImessageDBFiles(files);
            break;
    }

    const result = await resultPromise;

    // Initial validation for the number of conversations
    if (!validateMinChatsForDonation(result.anonymizedConversations)) {
        throw DonationValidationError(DonationErrors.TooFewChats, { minChats: CONFIG.MIN_CHATS_FOR_DONATION });
    }

    // Filter conversations based on messages and contacts
    const filteredConversations = result.anonymizedConversations.filter(conv =>
        conv.messages.length + conv.messagesAudio.length >= CONFIG.MIN_MESSAGES_PER_CHAT &&
        conv.participants.length >= CONFIG.MIN_CONTACTS_PER_CHAT
    );

    // Final validation for the number of conversations after filtering
    if (!validateMinChatsForDonation(filteredConversations)) {
        throw DonationValidationError(DonationErrors.TooFewContactsOrMessages, { minChats: CONFIG.MIN_CHATS_FOR_DONATION });
    }

    return {
        ...result,
        anonymizedConversations: filteredConversations
    };
}
