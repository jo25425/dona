import * as p from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const donationStatus = p.pgEnum("donation_status", ["notstarted", "pending", "complete", "deleted"]);

export const donations = p.pgTable("donations", {
    id: p.uuid("id").defaultRandom().primaryKey(),
    externalDonorId: p.text("external_donor_id").notNull().unique(),
    donorId: p.uuid("donor_id"),
    status: donationStatus("status").notNull(),
    createdAt: p.timestamp("created_at").defaultNow().notNull(),
});

export const dataSources = p.pgTable("data_sources", {
    id: p.integer("id").generatedByDefaultAsIdentity().primaryKey(),
    name: p.text("name").notNull(),
});

export const conversations = p.pgTable("conversations", {
    id: p.uuid("id").defaultRandom().primaryKey(),
    isGroupConversation: p.boolean("is_group_conversation").default(false).notNull(),
    dataSourceId: p.integer("data_source_id").notNull().references(() => dataSources.id),
    donationId: p.uuid("donation_id").notNull().references(() => donations.id),
    conversationPseudonym: p.varchar("conversation_pseudonym", { length: 10 }).notNull(),
});

export const conversationParticipants = p.pgTable("conversation_participants", {
    id: p.uuid("id").defaultRandom().primaryKey(),
    conversationId: p.uuid("conversation_id").notNull().references(() => conversations.id),
    participantId: p.uuid("participant_id").defaultRandom().notNull(),
    participantPseudonym: p.text("participant_pseudonym")
});

export const messages = p.pgTable("messages", {
    id: p.uuid("id").defaultRandom().primaryKey(),
    senderId: p.uuid("sender_id").defaultRandom().notNull(),
    dateTime: p.timestamp("datetime").notNull(),
    wordCount: p.integer("word_count").notNull(),
    conversationId: p.uuid("conversation_id").notNull().references(() => conversations.id)
});

export const messagesAudio = p.pgTable("messages_audio", {
    id: p.uuid("id").defaultRandom().primaryKey(),
    senderId: p.uuid("sender_id").defaultRandom().notNull(),
    dateTime: p.timestamp("datetime").notNull(),
    lengthSeconds: p.integer("length_seconds"),
    conversationId: p.uuid("conversation_id").notNull().references(() => conversations.id)
});

export const graphData = p.pgTable("graph_data", {
    id: p.uuid("id").defaultRandom().primaryKey(),
    donationId: p.uuid("donation_id").notNull().references(() => donations.id, { onDelete: "cascade" }),
    data: p.jsonb("data").notNull(),
    createdAt: p.timestamp("created_at").defaultNow().notNull(),
});

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

export const graphDataRelations = relations(graphData, ({ one }) => ({
    donation: one(donations, {
        fields: [graphData.donationId],
        references: [donations.id],
    }),
}));
