import wordCount from '@/services/parsing/shared/wordCount';
import {makeArrayOfMessages, ParsedMessage, parseMessages, ParsingResult} from './whatsappParser';
import _ from "lodash";
import {AnonymizationResult, Conversation, DataSourceValue, Message} from "@models/processed";
import {DonationErrors} from "@services/validation";
import {DONOR_ALIAS, FRIEND_ALIAS, SYSTEM_ALIAS} from "@services/parsing/meta/deIdentify";

const SYSTEM_MESSAGE = "Messages to this chat and calls are now secured with end-to-end encryption.";


async function handleWhatsappTxtFiles(fileList: File[]): Promise<AnonymizationResult> {
    const files = Array.from(fileList);

    return new Promise((resolve, reject) => {

        if (files.length !== 0 && (files.length < 5 || files.length > 7)) {
            reject(DonationErrors.Not5to7Files);
            return;
        }

        const fileSize = files[0].size;
        const allSameSize = files.every(file => file.size === fileSize);
        if (allSameSize) {
            reject(DonationErrors.SameFiles);
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
                reject(DonationErrors.EmptyOrOneContact);
                return;
            }

            const parsedConversations = parsed.map((obj) => obj.texts);
            const contacts = parsed.map((obj) => obj.contacts);
            const possibleUserNames = _.intersection(...contacts);

            resolve(deIdentification(parsedConversations, possibleUserNames[0]));
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

async function deIdentification(parsedFiles: ParsedMessage[][], donorName: string): Promise<AnonymizationResult> {
    const namesToPseudonyms: Record<string, string> = {};
    const deIdentifiedConversations: Conversation[] = [];
    let counter = 1;

    const getDeIdentifiedId= (name: string): string => {
        if (!namesToPseudonyms[name]) {
            namesToPseudonyms[name] = name === SYSTEM_ALIAS
                ? SYSTEM_ALIAS!
                : `${FRIEND_ALIAS}${counter++}`;
        }
        return namesToPseudonyms[name];
    }

    parsedFiles.forEach(lines => {
        const uniqueParticipants = new Set<string>();
        namesToPseudonyms[donorName] = DONOR_ALIAS;

        const messages: Message[] = lines
            .filter(line => line.message && !line.message.includes(SYSTEM_MESSAGE)) // Filter first to exclude unwanted lines
            .map(line => {
                const participant = getDeIdentifiedId(line.author);
                uniqueParticipants.add(participant);
                return {
                    sender: participant,
                    timestamp: line.date,
                    wordCount: wordCount(line.message),
                };
            })
        const participants = Array.from(uniqueParticipants);
        const isGroupConversation = (
            participants.length === 3 && !uniqueParticipants.has(SYSTEM_ALIAS)
            || participants.length > 2
        );

        deIdentifiedConversations.push({
            isGroupConversation,
            dataSource: DataSourceValue.WhatsApp,
            messages,
            messagesAudio: [],
            participants
        });
    });

    const chatsToShowMapping = deIdentifiedConversations.map(
        chat => chat.participants.map(
            participantId => ({ name: participantId })
        )
    );
    return {
        anonymizedConversations: deIdentifiedConversations,
        participantNamesToPseudonyms: namesToPseudonyms,
        chatsToShowMapping
    };
}

export default handleWhatsappTxtFiles;
