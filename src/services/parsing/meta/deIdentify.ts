import {TextDecoder} from "util";
import wordCount from '@services/parsing/shared/wordCount';
import {ValidEntry} from "@services/parsing/shared/zipExtraction";
import calculateAudioLength from "@services/parsing/shared/audioLength";
import {isTextMessage, isVoiceMessage} from "@services/parsing/meta/messageChecks";
import {ParsedConversation} from "@services/parsing/meta/metaHandlers";
import {AnonymizationResult, Conversation, DataSourceValue, Message, MessageAudio} from "@models/processed";

const SYSTEM_ALIAS = "System";  // TODO: Get from text files (SYSTEM_MESSAGE too? Use class to pass translations?)
const FRIEND_ALIAS = "Contact";   // TODO: Get from text files
const DONOR_ALIAS = "Donor";   // TODO: Get from text files
export { SYSTEM_ALIAS, FRIEND_ALIAS, DONOR_ALIAS};


const decode = (input: string): string => {
    const charCodes = [...input].map((char) => char.charCodeAt(0));

    // Check if all character codes fit within the plain UTF-8 range (i.e. no need to decode)
    const isPlainUtf8 = charCodes.every((code) => code <= 127);
    if (isPlainUtf8) {
        return input;
    }

    const decoder = new TextDecoder();
    const byteArray = new Uint8Array(charCodes);
    return decoder.decode(byteArray);
};

async function deIdentify(
    parsedConversations: ParsedConversation[],
    audioEntries: ValidEntry[],
    dataSourceValue: DataSourceValue
): Promise<AnonymizationResult> {
    const namesToPseudonyms: Record<string, string> = {};
    let counter = 1;

    const getDeIdentifiedId = (name: string): string => {
        const decodedName = decode(name);
        if (!namesToPseudonyms[decodedName]) {
            namesToPseudonyms[decodedName] = `${FRIEND_ALIAS}${counter++}`;
        }
        return namesToPseudonyms[decodedName];
    };

    const deIdentifiedConversations: Conversation[] = await Promise.all(
        parsedConversations.map(async (jsonContent) => {
            const uniqueParticipants = new Set<string>();
            const textMessages: Message[] = [];
            const audioMessages: MessageAudio[] = [];

            await Promise.all(
                jsonContent.messages.map(async (messageData) => {
                    const senderName = getDeIdentifiedId(messageData.sender_name);
                    uniqueParticipants.add(senderName);
                    const timestamp = messageData.timestamp_ms;

                    if (isVoiceMessage(messageData)) {
                        const audioFile = audioEntries.find(
                            (entry) => entry.filename === messageData.audio_files?.[0]?.uri
                        );
                        audioMessages.push({
                            lengthSeconds: await calculateAudioLength(audioFile),
                            timestamp,
                            sender: senderName,
                        } as MessageAudio);

                    } else if (isTextMessage(messageData)) {
                        textMessages.push({
                            wordCount: wordCount(messageData.content || ""),
                            timestamp,
                            sender: senderName,
                        } as Message);
                    }
                })
            );
            if (textMessages.length === 0 && audioMessages.length === 0) {
                return null;
            }

            const participants = Array.from(uniqueParticipants);
            const isGroupConversation = participants.length > 2;

            return {
                isGroupConversation,
                dataSource: dataSourceValue,
                messages: textMessages,
                messagesAudio: audioMessages,
                participants
            } as Conversation;
        })
    ).then((results) => results.filter(Boolean) as Conversation[]);

    // TODO: Filtering and chat selection logic

    return {
        anonymizedConversations: deIdentifiedConversations,
        participantNamesToPseudonyms: namesToPseudonyms,
        chatsToShowMapping: [], // Fill based on filtering logic
    };
}

export default deIdentify;
