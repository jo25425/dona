import {makeArrayOfMessages, parseMessages, ParsingResult} from '@services/parsing/whatsapp/whatsappParser';
import _ from "lodash";
import {AnonymizationResult} from "@models/processed";
import {DonationErrors, DonationValidationError} from "@services/errors";
import deIdentify from "@services/parsing/whatsapp/deIdentify";
import {validateMinChatsForDonation} from "@services/validation";

export default async function handleWhatsappTxtFiles(fileList: File[]): Promise<AnonymizationResult> {
    const files = Array.from(fileList);

    return new Promise((resolve, reject) => {

        if (!validateMinChatsForDonation(fileList)) {
            throw DonationValidationError(DonationErrors.TooFewChats);
        }

        const fileSize = files[0].size;
        const allSameSize = files.every(file => file.size === fileSize);
        if (allSameSize) {
            reject(DonationValidationError(DonationErrors.SameFiles));
            return;
        }

        const parsedFiles = files.map(file => readFile(file)
            .then(data => data.split('\n'))
            .then(makeArrayOfMessages)
            .then(messages => parseMessages(messages))
        );

        Promise.all(parsedFiles).then((parsed: ParsingResult[]) => {

            const parsedConversations = parsed.map((obj) => obj.texts);
            const contacts = parsed.map((obj) => obj.contacts);
            const possibleUserNames = _.intersection(...contacts);

            resolve(deIdentify(parsedConversations, possibleUserNames[0]));

            // TODO: How to ask user for username? Is it required?

        }).catch((error) => reject(error));
    });
}

async function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target?.result as string);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}
