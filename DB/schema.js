import { pgTable, text } from "drizzle-orm/pg-core"; 
import { sql } from "drizzle-orm";                  

export const users = pgTable("users", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    organization_id: text("organization_id").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    image: text("image"),
    created_at: text("created_at").notNull().default(sql`now()`),
});

export const metadata = pgTable("metadata", {
   id: text("id").primaryKey().default(sql`gen_random_uuid()`),
   user_email: text("user_email").notNull(),
   business_name: text("business_name").notNull(),
   website_url: text("website_url").notNull(),
   external_links: text("external_links"),
   created_at: text("created_at").notNull().default(sql`now()`),
});

export const knowledge = pgTable("knowledge", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    type: text("type").notNull().default("website"),
    name: text("name").notNull(),
    status: text("status").notNull().default("active"),
    source_url: text("source_url"),
    content: text("content"),
    meta_data: text("meta_data"),
    last_updated: text("last_updated").notNull().default(sql`now()`),
    created_at: text("created_at").notNull().default(sql`now()`),
})

export const sections = pgTable("sections", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    description: text("description").notNull(),
    tone: text("tone").notNull(),
    allowedTopics: text("allowed_topics"),
    blockedTopics: text("blocked_topics"),
    sourceIds: text("source_ids").notNull(),
    createdBy: text("created_by").notNull(),
    status: text("status").notNull().default("active"),
    created_at: text("created_at").notNull().default(sql`now()`),
})

export const chatBotMetaData = pgTable("chatBotMetaData", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    color: text("color").notNull().default("#4f39f6"),
    welcome_message: text("welcome_message").notNull().default("Hello! How can I assist you today?"),
    created_at: text("created_at").notNull().default(sql`now()`),
})

export const teamMembers = pgTable("team_members", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    organization_id: text("organization_id").notNull(),
    user_email: text("user_email").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull().default("member"),
    status: text("status").notNull().default("pending"), // added
    created_at: text("created_at").notNull().default(sql`now()`),
})

export const conversations = pgTable("conversations", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    visitor_ip: text("visitor_ip"),
    name: text("name"),
    chatbot_id: text("chatbot_id").notNull(),
    status: text("status").notNull().default("open"),
    created_at: text("created_at").notNull().default(sql`now()`),
    updated_at: text("updated_at").notNull().default(sql`now()`),
})

export const messages = pgTable("messages", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    conversation_id: text("conversation_id").notNull(),
    role : text("role").notNull(),
    content: text("content").notNull(),
    created_at: text("created_at").notNull().default(sql`now()`),
})

export const widgets = pgTable("widgets", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    organization_id: text("organization_id").notNull(),
    name: text("name").notNull(),
   allowed_domains: text("allowed_domains").array(),
    status: text("status").notNull().default("active"),
    created_at: text("created_at").notNull().default(sql`now()`),
})