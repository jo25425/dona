import * as p from "drizzle-orm/pg-core";

export const donationStatus = p.pgEnum("donation_status", ["notstarted", "pending", "complete", "deleted"]);

export const donations = p.pgTable("donations", {
    id: p.uuid("id").defaultRandom().primaryKey(),
    externalDonorId: p.text("external_donor_id").notNull().unique(),
    donorId: p.uuid("donor_id"),
    status: donationStatus("status").notNull(),        
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
    participantId: p.uuid("participant_id").defaultRandom().notNull()
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
