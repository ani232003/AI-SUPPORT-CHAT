// Save this as: app/api/chatbot/embed-code/route.js
// This provides the embed code to users with their unique chatbot ID

import { db } from "@/DB/client";
import { metadata } from "@/DB/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";

export async function GET(req) {
    try {
        const user = await isAuthorized();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's chatbot metadata
        const [chatbotData] = await db
            .select()
            .from(metadata)
            .where(eq(metadata.user_email, user.email))
            .limit(1);

        if (!chatbotData) {
            return NextResponse.json({ 
                error: 'No chatbot found. Please initialize your chatbot first.' 
            }, { status: 404 });
        }

        const chatbotId = chatbotData.id;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Generate embed code with the user's unique chatbot ID
        const embedCode = `<!-- AI Support Chat Widget -->
<script>
  (function() {
    const chatWidget = document.createElement('iframe');
    chatWidget.src = '${baseUrl}/embed?token=${chatbotId}';
    chatWidget.style.cssText = 'position:fixed;bottom:20px;right:20px;width:400px;height:600px;border:none;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:9999;';
    chatWidget.setAttribute('allow', 'clipboard-write');
    chatWidget.setAttribute('title', 'AI Support Chat');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => document.body.appendChild(chatWidget));
    } else {
      document.body.appendChild(chatWidget);
    }
  })();
</script>`;

        // Also generate a script tag version
        const scriptTag = `<script src="${baseUrl}/chatbot-widget.js" data-chatbot-id="${chatbotId}" async></script>`;

        return NextResponse.json({ 
            success: true,
            chatbotId,
            embedCode,
            scriptTag,
            iframeUrl: `${baseUrl}/embed?token=${chatbotId}`
        });

    } catch (error) {
        console.error('Embed Code Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}