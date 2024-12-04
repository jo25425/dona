'use server';

import {db} from "@/db/drizzle";
import {v4 as uuidv4} from 'uuid';
import {conversationParticipants, conversations, donations, messages} from "@/db/schema";
import {NewConversation, NewMessage} from "@models/persisted";
import {Conversation, DataSource, DonationStatus} from "@models/processed";
import {DonationErrors, DonationProcessingError} from "@services/errors";
import {DONATION_COMPLETE_FLAG} from "@/middleware";
import {cookies} from "next/headers";


function generateExternalDonorId(): string {
    return Math.random().toString(36).substring(2, 8);
}

interface AddDonationResult {
    success: boolean;
    donationId?: string;
    error?: Error;
}

export async function addDonation(
    donatedConversations: Conversation[],
    donorAlias: string,
    externalDonorId?: string
): Promise<AddDonationResult> {
    const donorId = uuidv4();
    const dataSourceOptions: DataSource[] = await db.query.dataSources.findMany() as DataSource[];

    try {
        const donationId = await db.transaction(async (tx) => {
            const insertedDonation = await tx.insert(donations).values({
                donorId,
                externalDonorId: externalDonorId || generateExternalDonorId(),
                status: DonationStatus.Complete,
            }).returning({ id: donations.id });

            const donationId = insertedDonation[0]?.id;

            if (!donationId) {
                throw new Error('Failed to insert donation.');
            }

            for (const convo of donatedConversations) {
                const newConversation: NewConversation = NewConversation.create(
                    donationId,
                    convo,
                    dataSourceOptions
                );

                const insertedConversation = await tx
                    .insert(conversations)
                    .values(newConversation)
                    .returning({ id: conversations.id });

                const conversationId = insertedConversation[0]?.id;

                if (!conversationId) {
                    throw new Error('Failed to insert conversation.');
                }

                const participantIdMap: Record<string, string> = {};
                const resolveParticipantId = (participant: string): string => {
                    if (participant === donorAlias) return donorId;
                    if (!participantIdMap[participant]) participantIdMap[participant] = uuidv4();
                    return participantIdMap[participant];
                };

                // Insert messages
                for (const message of convo.messages) {
                    const senderId = resolveParticipantId(message.sender);
                    const newMessage: NewMessage = NewMessage.create(conversationId, {
                        ...message,
                        sender: senderId,
                    });
                    await tx.insert(messages).values(newMessage);
                }

                // Insert participants
                for (const participant of convo.participants) {
                    const participantId = resolveParticipantId(participant);
                    await tx.insert(conversationParticipants).values({
                        participantId,
                        conversationId,
                        participantPseudonym: participant,
                    });
                }
            }

            return donationId;
        });

        // After a successful donation, set a cookie as a flag
        (await cookies()).set(DONATION_COMPLETE_FLAG, 'true', {
            httpOnly: true, // Prevent client-side access
            secure: process.env.NODE_ENV === 'production', // Use secure flag in production
            path: '/', // Accessible across the app
        });

        return { success: true, donationId };
    } catch (err) {
        console.error('Error in addDonation:', err);

        return {
            success: false,
            error: new DonationProcessingError(
                DonationErrors.TransactionFailed,
                { originalError: err }
            ),
        };
    }
}
