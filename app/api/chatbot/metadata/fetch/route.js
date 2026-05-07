import { db } from '@/DB/client';
import { metadata, chatBotMetaData } from '@/DB/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch chatbot metadata by user's email
    const [userMetadata] = await db.select().from(metadata).where(eq(metadata.user_email, user.email)).limit(1);

    if (!userMetadata) {
      // Return null or empty if no metadata found
      return NextResponse.json(null, { status: 200 });
    }

    // Fetch chatbot meta appearance data
    const [botMeta] = await db.select().from(chatBotMetaData).where(eq(chatBotMetaData.user_email, user.email)).limit(1);

    // Compose response metadata including color and welcome_message
    const responseMetadata = {
      id: userMetadata.id,
      user_email: userMetadata.user_email,
      business_name: userMetadata.business_name,
      website_url: userMetadata.website_url,
      external_links: userMetadata.external_links,
      color: botMeta?.color || '#6366f1',
      welcome_message: botMeta?.welcome_message || 'Hello! How can I assist you today?',
    };

    return NextResponse.json(responseMetadata, { status: 200 });

  } catch (error) {
    console.error('Fetch Chatbot Metadata Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
