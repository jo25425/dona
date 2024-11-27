'use server';

import {db} from "@/db/drizzle";
import {v4 as uuidv4} from 'uuid';
import {conversationParticipants, conversations, donations, messages, messagesAudio} from "@/db/schema";
import {NewConversation, NewMessage, NewMessageAudio} from "@models/persisted";
import {Conversation, DataSource, DonationStatus} from "@models/processed";


function generateExternalDonorId(): string {
    return Math.random().toString(36).substring(2, 8);
}

export async function addDonation(donatedConversations: Conversation[], donorAlias: string, externalDonorId?: string) {

    const donorId = uuidv4();
    const dataSourceOptions: DataSource[] = await db.query.dataSources.findMany() as DataSource[];

    try {
        await db.transaction(async (tx) => {

            // Insert the donation and get its ID
            const donationId = await tx.insert(donations).values({
                donorId,
                externalDonorId: externalDonorId || generateExternalDonorId(),
                status: DonationStatus.Complete
            }).returning({ id: donations.id });

            for (const convo of donatedConversations) {
                const newConversation: NewConversation = NewConversation.create(donationId[0].id, convo, dataSourceOptions);
                const conversationId = await tx.insert(conversations).values(newConversation).returning({ id: conversations.id });

                // Map to track participant IDs for this conversation
                const participantIdMap: Record<string, string> = {};

                // Function to resolve participant IDs within the conversation
                const resolveParticipantId = (participant: string): string => {
                    if (participant === donorAlias) return donorId; // Use donorId for the donor
                    if (!participantIdMap[participant]) participantIdMap[participant] = uuidv4(); // Assign new ID if not already assigned
                    return participantIdMap[participant];
                };

                // Insert messages
                for (const message of convo.messages) {
                    const senderId = resolveParticipantId(message.sender);
                    const newMessage: NewMessage = NewMessage.create(conversationId[0].id, { ...message, sender: senderId });
                    await tx.insert(messages).values(newMessage);
                }

                for (const messageAudio of convo.messagesAudio) {
                    const senderId = resolveParticipantId(messageAudio.sender);
                    const newMessageAudio: NewMessageAudio = NewMessageAudio.create(conversationId[0].id, { ...messageAudio, sender: senderId });
                    await tx.insert(messagesAudio).values(newMessageAudio);
                }

                // Insert participants
                for (const participant of convo.participants) {
                    const participantId = resolveParticipantId(participant);
                    await tx.insert(conversationParticipants).values({
                        participantId,
                        conversationId: conversationId[0].id,
                        participantPseudonym: participant
                    });
                }
            }
        });
    } catch (e) {
        console.error("Failed to add donation", externalDonorId, donatedConversations, e);
    }
}