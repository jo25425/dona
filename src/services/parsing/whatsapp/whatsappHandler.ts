import wordCount from '@/services/parsing/shared/wordCount';
import {makeArrayOfMessages, ParsedMessage, parseMessages, ParsingResult} from './whatsappParser';
import _ from "lodash";
import {AnonymizationResult, Conversation, DataSourceValue, Message} from "@models/processed";
import {DonationErrors} from "@services/validation";

const SYSTEM_MESSAGE = "Messages to this chat and calls are now secured with end-to-end encryption.";
const SYSTEM_ALIAS = "System";  // TODO: Get from text files (SYSTEM_MESSAGE too? Use class to pass translations?)
const FRIEND_ALIAS = "Contact";   // TODO: Get from text files
const DONOR_ALIAS = "Donor";   // TODO: Get from text files

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

            const textList = parsed.map((obj) => obj.texts);
            const contacts = parsed.map((obj) => obj.contacts);
            const possibleUserNames = _.intersection(...contacts);

            resolve(deIdentification(textList, possibleUserNames[0]));
            // TODO: How to ask user for username? Is it required?
            // Determine which of usernames found is the donor's
            // if (possibleUserNames.length === 1) {
            //     resolve(deIdentification(textList, possibleUserNames[0]));
            // } else {
                // askUserForUsername(possibleUserNames)
                //     .then(username => resolve(deIdentification(textList, username)));
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

async function deIdentification(parsedFiles: ParsedMessage[][], userName: string): Promise<AnonymizationResult> {
    const namesToPseudonyms: Record<string, string> = {};
    const deIdentifiedJsonContents: Conversation[] = [];
    let i = 1;

    parsedFiles.forEach(lines => {
        const eachFileParticipants = new Set<string>();
        namesToPseudonyms[userName] = DONOR_ALIAS;  // Get this from text file

        const messages: Message[] = lines
            .filter(line => line.message && !line.message.includes(SYSTEM_MESSAGE)) // Filter first to exclude unwanted lines
            .map(line => {
                const participant = getDeIdentifiedId(line.author);
                eachFileParticipants.add(participant);
                return {
                    sender: participant,
                    timestamp: line.date,
                    wordCount: wordCount(line.message),
                };
            })
        const participants = Array.from(eachFileParticipants);//.map(participantId => ({ name: participantId }));
        const isGroupConversation = (
            participants.length === 3 && !eachFileParticipants.has(SYSTEM_ALIAS)
            || participants.length > 2
        );

        deIdentifiedJsonContents.push({
            isGroupConversation,
            dataSource: DataSourceValue.WhatsApp,
            messages,
            messagesAudio: [],
            participants
        });
    });

    const chatsToShowMapping = deIdentifiedJsonContents.map(
        chat => chat.participants.map(
            participantId => ({ name: participantId })
        )
    );
    return {
        anonymizedConversations: deIdentifiedJsonContents,
        participantNamesToPseudonyms: namesToPseudonyms,
        chatsToShowMapping
    };

    function getDeIdentifiedId(name: string): string {
        if (!namesToPseudonyms[name]) {
            namesToPseudonyms[name] = name === SYSTEM_ALIAS
                ? SYSTEM_ALIAS!
                : `${FRIEND_ALIAS}${i++}`;
        }
        return namesToPseudonyms[name];
    }
}

export default handleWhatsappTxtFiles;
