// app/api/auth/callback/route.js

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { scalekit } from "@/lib/scalekit";
import { db } from "@/DB/client";
import { metadata, chatBotMetaData } from "@/DB/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
    try {
        console.log("🚀 Auth callback started");

        const { searchParams } = new URL(request.url);

        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        console.log("📌 Callback params:", {
            codeExists: !!code,
            error,
            errorDescription,
        });

        // Handle provider auth errors
        if (error) {
            console.error("❌ Auth provider error:", error, errorDescription);

            return NextResponse.json(
                {
                    success: false,
                    stage: "provider_error",
                    error,
                    errorDescription,
                },
                { status: 400 }
            );
        }

        // Only require code
        if (!code) {
            console.error("❌ Missing authorization code");

            return NextResponse.json(
                {
                    success: false,
                    stage: "missing_code",
                },
                { status: 400 }
            );
        }

        console.log("✅ Authorization code received");

        const redirectUri = process.env.SCALEKIT_REDIRECT_URI;

        console.log("🔐 Authenticating with ScaleKit...");

        const { user } = await scalekit.authenticateWithCode(
            code,
            redirectUri
        );

        console.log("✅ ScaleKit authentication success");
        console.log("👤 User:", user);

        // Validate user
        if (!user || !user.email) {
            console.error("❌ Invalid user returned from ScaleKit");

            return NextResponse.json(
                {
                    success: false,
                    stage: "invalid_user",
                    user,
                },
                { status: 400 }
            );
        }

        console.log("👤 Authenticated user:", user.email);

        // AUTO INITIALIZE CHATBOT FOR NEW USERS
        try {
            console.log("🔍 Checking existing metadata...");

            const [existingMetadata] = await db
                .select()
                .from(metadata)
                .where(eq(metadata.user_email, user.email))
                .limit(1);

            console.log("Existing metadata:", existingMetadata);

            // NEW USER
            if (!existingMetadata) {
                console.log("🆕 New user detected");

                // Check chatbot appearance metadata
                const [existingChatbotMeta] = await db
                    .select()
                    .from(chatBotMetaData)
                    .where(eq(chatBotMetaData.user_email, user.email))
                    .limit(1);

                // Create chatbot appearance metadata
                if (!existingChatbotMeta) {
                    console.log("➕ Creating chatbot appearance metadata...");

                    await db.insert(chatBotMetaData).values({
                        user_email: user.email,
                        color: "#6366f1",
                        welcome_message:
                            "Hello! How can I assist you today?",
                    });

                    console.log("✅ chatbot appearance metadata created");
                }

                // Create main chatbot metadata
                console.log("➕ Creating main chatbot metadata...");

                const insertedRows = await db
                    .insert(metadata)
                    .values({
                        user_email: user.email,
                        business_name: "My Business",
                        website_url: "https://example.com",
                        external_links: null,
                    })
                    .returning();

                console.log(
                    "✅ Main chatbot metadata created:",
                    insertedRows[0]
                );
            } else {
                console.log("✅ Existing user metadata found");
            }
        } catch (initError) {
            console.error("❌ CHATBOT INIT ERROR:", initError);
            console.error("❌ MESSAGE:", initError?.message);
            console.error("❌ STACK:", initError?.stack);

            // Do NOT fail login because of chatbot init
        }

        // CREATE USER SESSION COOKIE
        const cookieStore = await cookies();

        console.log("🍪 Creating session cookie...");

        cookieStore.set("session_user", JSON.stringify({
                email: user.email,
                name: user.given_name || user.email,
                id: user.id,
            }),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            }
        );

        // Clear old auth state cookie if exists
        cookieStore.delete("auth_state");

        console.log("✅ Session cookie created successfully");

        console.log("➡️ Redirecting to dashboard/chatbot");

        return NextResponse.redirect(
            new URL("/dashboard/chatbot", request.url)
        );

    } catch (error) {
        console.error("❌ CALLBACK ERROR FULL:", error);
        console.error("❌ MESSAGE:", error?.message);
        console.error("❌ STACK:", error?.stack);

        return NextResponse.json(
            {
                success: false,
                stage: "callback_catch",
                message: error?.message,
            },
            { status: 500 }
        );
    }
}