import wordCount from '@services/parsing/shared/wordCount';
import {ValidEntry} from "@services/parsing/shared/zipExtraction";
import calculateAudioLength from "@services/parsing/shared/audioLength";
import {isTextMessage, isVoiceMessage} from "@services/parsing/meta/messageChecks";
import {ParsedConversation} from "@services/parsing/meta/metaHandlers";
import {AnonymizationResult, Conversation, DataSourceValue, Message, MessageAudio} from "@models/processed";
import {getAliasConfig} from "@services/parsing/shared/aliasConfig";


async function deIdentify(
    parsedConversations: ParsedConversation[],
    audioEntries: ValidEntry[],
    dataSourceValue: DataSourceValue
): Promise<AnonymizationResult> {
    const aliasConfig = getAliasConfig();
    const deIdentifier = new DeIdentifier(aliasConfig.friendAlias);

    const deIdentifiedConversations: Conversation[] = await Promise.all(
        parsedConversations.map(async (jsonContent) => {
            const uniqueParticipants = new Set<string>();
            const textMessages: Message[] = [];
            const audioMessages: MessageAudio[] = [];

            await Promise.all(
                jsonContent.messages.map(async (messageData) => {
                    const senderName = deIdentifier.getDeIdentifiedId(messageData.sender_name);
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
        participantNamesToPseudonyms: deIdentifier.getPseudonymMap(),
        chatsToShowMapping: [], // Fill based on filtering logic
    };
}

export default deIdentify;
