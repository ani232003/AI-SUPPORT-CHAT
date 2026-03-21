import { NextResponse } from 'next/server'
import { db } from '@/DB/client'
import { eq } from 'drizzle-orm'
import { metadata } from '@/DB/schema'
import { SignJWT } from 'jose'

export async function POST(request) {
    try {
        const { widgetId } = await request.json();
        if (!widgetId) {
            return NextResponse.json({ success: false, error: 'widgetId is required' }, { status: 400 });
        }

        const [bot] = await db.select().from(metadata)
            .where(eq(metadata.id, widgetId))
            .limit(1);

        if (!bot) {
            return NextResponse.json({ success: false, error: 'Invalid widgetId' }, { status: 404 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const sessionId = crypto.randomUUID();

        const token = await new SignJWT({ widgetId, ownerEmail: bot.user_email, sessionId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret);

        return NextResponse.json({ success: true, sessionId: token }, { status: 200 });

    } catch (error) {
        console.error('Widget session error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}