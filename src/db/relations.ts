import {relations} from "drizzle-orm";
import {conversationParticipants, conversations, dataSources, donations, messages, messagesAudio} from "@/db/schema";

export const donationsRelations = relations(donations, ({many}) => ({
    conversations: many(conversations)
}));

export const dataSourcesRelations = relations(dataSources, ({ many }) => ({
    conversations: many(conversations)
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
    donation: one(donations, {
        fields: [conversations.donationId],
        references: [donations.id]
    }),
    dataSource: one(dataSources, {
        fields: [conversations.dataSourceId],
        references: [dataSources.id],
    }),
    participants: many(conversationParticipants),
    messages: many(messages),
    messagesAudio: many(messagesAudio),
}));

export const conversationParticipantsRelations = relations(conversationParticipants, ({ one }) => ({
    conversation: one(conversations, {
        fields: [conversationParticipants.conversationId],
        references: [conversations.id]
    })
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, {
        fields: [messages.conversationId],
        references: [conversations.id]
    })
}));

export const messagesAudioRelations = relations(messagesAudio, ({ one }) => ({
    conversation: one(conversations, {
        fields: [messagesAudio.conversationId],
        references: [conversations.id]
    })
}));