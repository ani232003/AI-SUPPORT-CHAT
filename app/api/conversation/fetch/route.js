import { NextResponse } from 'next/server'
import { db } from '@/DB/client'
import { eq } from 'drizzle-orm'
import { conversations, messages } from '@/DB/schema'
import { isAuthorized } from '@/lib/auth'

export async function GET() {
    try {
        const user = await isAuthorized()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const convs = await db.select().from(conversations)
            .where(eq(conversations.user_email, user.email))

        const convsWithMessages = await Promise.all(convs.map(async (conv) => {
            const msgs = await db.select().from(messages)
                .where(eq(messages.conversation_id, conv.id))
            return { ...conv, messages: msgs }
        }))

        return NextResponse.json({ success: true, data: convsWithMessages }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}