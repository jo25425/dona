'use server';

import {db} from "@/db/drizzle";
import {conversationParticipants, conversations, donations, messages, messagesAudio} from "@/db/schema";
import {NewConversation, NewMessage, NewMessageAudio} from "@models/persisted";
import {DataDonation, DataSource, DonationStatus} from "@models/processed";


function generateExternalDonorId(): string {
    return crypto.getRandomValues(new Uint8Array)?.toString().substring(0, 6)
}

export async function addDonation(donation: DataDonation) {
    const { donorId, externalDonorId, status} = donation;
    const donatedConversations = donation.conversations;
    // @ts-ignore
    const dataSourceOptions: DataSource[] = (await db.query.dataSources.findMany());

    try {
        await db.transaction(async (tx) => {
            const donationId = await tx.insert(donations).values({
                donorId,
                externalDonorId: externalDonorId ? externalDonorId: generateExternalDonorId(),
                status: status ? status: DonationStatus.Pending
            }).returning({ id: donations.id });
            donatedConversations.map(async (convo) => {

                const newConversation: NewConversation = NewConversation.create(donationId[0].id, convo, dataSourceOptions)
                const conversationId = await db.insert(conversations).values(newConversation).returning({id: conversations.id});

                convo.messages.map(async (message) => {
                    const newMessage: NewMessage = NewMessage.create(conversationId[0].id, message)
                    await db.insert(messages).values(newMessage);
                });
                convo.messagesAudio.map(async (messageAudio) => {
                    const newMessageAudio: NewMessageAudio = NewMessageAudio.create(conversationId[0].id, messageAudio)
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