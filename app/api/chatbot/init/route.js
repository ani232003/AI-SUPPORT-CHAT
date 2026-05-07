// Save this as: app/api/chatbot/init/route.js
// This will auto-create chatbot metadata for new users

import { db } from "@/DB/client";
import { metadata, chatBotMetaData } from "@/DB/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";

export async function POST(req) {
    try {
        const user = await isAuthorized();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if metadata already exists
        const [existingMetadata] = await db
            .select()
            .from(metadata)
            .where(eq(metadata.user_email, user.email))
            .limit(1);

        if (existingMetadata) {
            return NextResponse.json({ 
                success: true, 
                chatbotId: existingMetadata.id,
                message: 'Chatbot already exists' 
            });
        }

        // Check if chatBotMetaData exists
        const [existingChatBotMeta] = await db
            .select()
            .from(chatBotMetaData)
            .where(eq(chatBotMetaData.user_email, user.email))
            .limit(1);

        if (!existingChatBotMeta) {
            // Create default chatBotMetaData
            await db.insert(chatBotMetaData).values({
                user_email: user.email,
                color: "#6366f1",
                welcome_message: "Hello! How can I assist you today?"
            });
        }

        // Create default metadata with auto-generated UUID
        const insertedRows = await db.insert(metadata).values({
                    user_email: user.email,
                    business_name: "My Business", // Default name
                    website_url: "https://example.com", // Default URL
                    external_links: null,
                }).returning();

                const newMetadata = insertedRows[0];

        const chatBotMeta = await db.select().from(chatBotMetaData).where(eq(chatBotMetaData.user_email, user.email)).limit(1);

        const responsePayload = {
          ...newMetadata,
          color: chatBotMeta.length > 0 ? chatBotMeta[0].color : '#6366f1',
          welcome_message: chatBotMeta.length > 0 ? chatBotMeta[0].welcome_message : 'Hello! How can I assist you today?'
        }

        return NextResponse.json({ 
                    success: true, 
                    chatbotId: newMetadata.id,
                    metadata: responsePayload,
                    message: 'Chatbot created successfully'
                }, { status: 201 });

    } catch (error) {
        console.error('Chatbot Init Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}