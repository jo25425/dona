type Participant = string;
type ExternalDonorId = string;
export type ChatMapping = Map<string, string[]>;

export enum DataSourceValue {
    WhatsApp = "WhatsApp",
    Facebook = "Facebook",
    Instagram = "Instagram",
}

export enum DonationStatus {
    NotStarted = "notstarted",
    Pending = "pending",
    Complete = "complete",
    Deleted = "deleted",
}

export interface DataSource {
    id: number,
    name: DataSourceValue
}

export interface Message {
    id?: string,
    wordCount: number,
    timestamp: number,
    sender: string,
}

export interface MessageAudio {
    id?: string,
    lengthSeconds: number,
    timestamp: number,
    sender: string,
}

export interface Conversation {
    id?: string,
    isGroupConversation?: boolean,
    conversationId?: string,
    dataSource: string,
    messages: Array<Message>,
    messagesAudio: Array<MessageAudio>,
    participants: Array<Participant>,
    conversationPseudonym: string
}

export interface DataDonation {
    id?: string,
    donorId: string,
    status?: DonationStatus,
    externalDonorId?: ExternalDonorId,
    conversations: Array<Conversation>,
}

export interface AnonymizationResult {
    anonymizedConversations: Conversation[];
    participantNamesToPseudonyms: Record<string, string>;
    chatMappingToShow: ChatMapping;
}

