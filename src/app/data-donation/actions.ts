'use server';

import { db } from "@/db/drizzle";
import { conversationParticipants, conversations, donations, messages, messagesAudio } from "@/db/schema";

function generateExternalDonorId(): string {
    const id = crypto.getRandomValues(new Uint8Array)?.toString().substring(0,6);
    return id
}

type Participant = string;

type ExternalDonorId = string;

enum DataSourceValue {
    WhatsApp = "WhatsApp",
    Facebook = "Facebook",
    Instagram = "Instagram",
}

enum DonationStatus {
    NotStarted = "notstarted",
    Pending = "pending",
    Complete = "complete",
    Deleted = "deleted",
}

interface DataSource {
    id?: number,
    name: DataSourceValue
}

interface Message {
    id?: string,
    wordCount: number,
    timestamp: number,
    sender: string,
}

interface MessageAudio {
    id?: string,
    lengthSeconds: number,
    timestamp: number,
    sender: string,
}

interface Conversation {
    id?: string,
    isGroupConversation?: boolean,
    conversationId?: string,
    dataSource: string,
    messages: Array<Message>,
    messagesAudio: Array<MessageAudio>,
    participants: Array<Participant>,
}

interface DataDonation {
    id?: string,
    donorId: string,
    status?: DonationStatus,
    externalDonorId?: ExternalDonorId,
    conversations: Array<Conversation>,
}

type NewConversation = typeof conversations.$inferInsert;
type NewMessage = typeof messages.$inferInsert;
type NewMessageAudio = typeof messagesAudio.$inferInsert;

export async function addDonation(donation: DataDonation) {
    const { donorId, externalDonorId, status} = donation;
    const donatedConversations = donation.conversations;

    const dataSourceOptions = (await db.query.dataSources.findMany());
    try {
        await db.transaction(async (tx) => {
            const donationId = await tx.insert(donations).values({
                donorId,
                externalDonorId: externalDonorId ? externalDonorId: generateExternalDonorId(),
                status: status ? status: DonationStatus.Pending
            }).returning({ id: donations.id });
            donatedConversations.map(async (convo) => {
                const {isGroupConversation, dataSource} = convo;
                const newConversation: NewConversation = {
                    donationId: donationId[0].id,
                    dataSourceId: dataSourceOptions.find(({name})=> name == dataSource)!.id,
                    isGroupConversation: isGroupConversation || undefined,
                };
                const conversationId = await db.insert(conversations).values(newConversation).returning({id: conversations.id});
                convo.messages.map(async ({wordCount, timestamp, sender}) => {
                    const newMessage: NewMessage = {
                        wordCount,
                        dateTime: new Date(timestamp),
                        senderId: sender || undefined,
                        conversationId: conversationId[0].id
                    }
                    await db.insert(messages).values(newMessage);
                });
                convo.messagesAudio.map(async ({lengthSeconds, timestamp, sender}) => {
                    const newMessageAudio: NewMessageAudio = {
                        lengthSeconds,
                        dateTime: new Date(timestamp),
                        senderId: sender || undefined,
                        conversationId: conversationId[0].id
                    }
                    await db.insert(messagesAudio).values(newMessageAudio);
                });
                convo.participants.map(async (participant) => {
                    await db.insert(conversationParticipants).values({
                        participantId: participant,
                        conversationId: conversationId[0].id
                    });
                });
            });
        }); 
    } catch (e) {
        console.error("Failed to add new donation", donation, e)
    }
}