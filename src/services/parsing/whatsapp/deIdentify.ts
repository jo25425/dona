import {ParsedMessage} from "@services/parsing/whatsapp/whatsappParser";
import {AnonymizationResult, Conversation, DataSourceValue, Message} from "@models/processed";
import {getAliasConfig} from "@services/parsing/shared/aliasConfig";
import wordCount from "@services/parsing/shared/wordCount";
import {ChatPseudonyms, ContactPseudonyms} from "@services/parsing/shared/pseudonyms";

const SYSTEM_MESSAGE = "Messages to this chat and calls are now secured with end-to-end encryption.";

export default async function deIdentify(parsedFiles: ParsedMessage[][], donorName: string): Promise<AnonymizationResult> {
    const aliasConfig = getAliasConfig();
    const contactPseudonyms = new ContactPseudonyms(aliasConfig.friendAlias, aliasConfig.systemAlias);
    const chatPseudonyms = new ChatPseudonyms(aliasConfig.donorAlias, aliasConfig.chatAlias, DataSourceValue.WhatsApp);
    chatPseudonyms.setDonorName(donorName);

    const deIdentifiedConversations: Conversation[] = [];
    parsedFiles.forEach((lines) => {
        const participantPseudonyms = new Set<string>();
        const messages: Message[] = lines
            .filter(line => line.message && !line.message.includes(SYSTEM_MESSAGE)) // Filter first to exclude unwanted lines
            .map(line => {
                const participant = contactPseudonyms.getPseudonym(line.author);
                participantPseudonyms.add(participant);
                return {
                    sender: participant,
                    timestamp: line.date,
                    wordCount: wordCount(line.message),
                };
            })

        const participants = Array.from(participantPseudonyms);
        const isGroupConversation = (
            participants.length === 3 && !participantPseudonyms.has(aliasConfig.systemAlias)
            || participants.length > 2
        );

        // Add to chats to show
        contactPseudonyms.setPseudonym(donorName, aliasConfig.donorAlias);
        const conversationPseudonym = chatPseudonyms.getPseudonym(contactPseudonyms.getOriginalNames(participants));

        // Add to conversations
        deIdentifiedConversations.push({
            isGroupConversation,
            dataSource: DataSourceValue.WhatsApp,
            messages,
            messagesAudio: [],
            participants,
            conversationPseudonym
        });
    });

    return {
        anonymizedConversations: deIdentifiedConversations,
        participantNamesToPseudonyms: contactPseudonyms.getPseudonymMap(),
        chatMappingToShow: chatPseudonyms.getPseudonymMap()
    };
}
