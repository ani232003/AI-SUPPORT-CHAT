import { NextResponse } from 'next/server'
import { db } from '@/DB/client'
import { eq } from 'drizzle-orm'
import { chatBotMetaData, metadata, sections } from '@/DB/schema'

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const widgetId = searchParams.get('token');

    if (!widgetId) {
        return NextResponse.json({ success: false, error: 'widgetId is required' }, { status: 400 });
    }

    try {
        const [botMeta] = await db.select().from(metadata)
            .where(eq(metadata.id, widgetId))
            .limit(1);

        if (!botMeta) {
            return NextResponse.json({ success: false, error: 'Widget not found' }, { status: 404 });
        }

        const [meta] = await db.select().from(chatBotMetaData)
            .where(eq(chatBotMetaData.user_email, botMeta.user_email))
            .limit(1);

        const userSections = await db.select()
            .from(sections)
            .where(eq(sections.createdBy, botMeta.user_email));

        return NextResponse.json({
            success: true,
            config: meta || {},
            business: botMeta,
            sections: userSections
        }, { status: 200 });

    } catch (error) {
        console.error('Widget config error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}