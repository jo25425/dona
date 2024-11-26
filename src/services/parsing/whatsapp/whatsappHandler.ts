import {makeArrayOfMessages, parseMessages, ParsingResult} from '@services/parsing/whatsapp/whatsappParser';
import _ from "lodash";
import {AnonymizationResult} from "@models/processed";
import {DonationError, DonationErrors} from "@services/errors";
import deIdentify from "@services/parsing/whatsapp/deIdentify";

export default async function handleWhatsappTxtFiles(fileList: File[]): Promise<AnonymizationResult> {
    const files = Array.from(fileList);

    return new Promise((resolve, reject) => {

        if (files.length !== 0 && (files.length < 5 || files.length > 7)) {
            reject(new DonationError(DonationErrors.Not5to7Files));
            return;
        }

        const fileSize = files[0].size;
        const allSameSize = files.every(file => file.size === fileSize);
        if (allSameSize) {
            reject(new DonationError(DonationErrors.SameFiles));
            return;
        }

        const parsedFiles = files.map(file => readFile(file)
            .then(data => data.split('\n'))
            .then(makeArrayOfMessages)
            .then(messages => parseMessages(messages))
        );

        Promise.all(parsedFiles).then((parsed: ParsingResult[]) => {
            const hasInvalidData = parsed.some(({ texts, contacts }) => texts.length < 100 || contacts.length <= 1);
            if (hasInvalidData) {
                reject(new DonationError(DonationErrors.TooFewContactsOrMessages));
                return;
            }

            const parsedConversations = parsed.map((obj) => obj.texts);
            const contacts = parsed.map((obj) => obj.contacts);
            const possibleUserNames = _.intersection(...contacts);

            resolve(deIdentify(parsedConversations, possibleUserNames[0]));
            // TODO: How to ask user for username? Is it required?
            // Determine which of usernames found is the donor's
            // if (possibleUserNames.length === 1) {
            //     resolve(deIdentification(parsedConversations, possibleUserNames[0]));
            // } else {
                // askUserForUsername(possibleUserNames)
                //     .then(username => resolve(deIdentification(parsedConversations, username)));
            // }
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

// function askUserForUsername(possibilities: string[]): Promise<string> {
//     return new Promise((resolve) => {
//         const usernameSelector = document.getElementById("usernameSelect") as HTMLSelectElement;
//         const usernameSelectButton = document.getElementById("usernameSelectButton") as HTMLButtonElement;
//         usernameSelector.innerHTML = '';
//
//         possibilities.forEach((name) => {
//             const option = new Option(name, name);
//             usernameSelector.add(option);
//         });
//
//         usernameSelectButton.onclick = () => resolve(usernameSelector.value);
//         $('#usernameModal').modal('show');
//     });
// }
