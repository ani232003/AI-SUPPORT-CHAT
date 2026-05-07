import { NextResponse } from 'next/server'
import { db } from '@/DB/client'
import { eq } from 'drizzle-orm'
import { metadata } from '@/DB/schema'
import { SignJWT } from 'jose'

export async function POST(request) {
    try {
        const { widgetId } = await request.json();
        if (!widgetId) {
            return new Response(JSON.stringify({ success: false, error: 'widgetId is required' }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        const [bot] = await db.select().from(metadata)
            .where(eq(metadata.id, widgetId))
            .limit(1);

        if (!bot) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid widgetId' }), { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const sessionId = crypto.randomUUID();

        const token = await new SignJWT({ widgetId, ownerEmail: bot.user_email, sessionId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret);

        return new Response(JSON.stringify({ success: true, sessionId: token }), { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });

    } catch (error) {
        console.error('Widget session error:', error)
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}