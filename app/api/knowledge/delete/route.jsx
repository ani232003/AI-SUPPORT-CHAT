import { NextResponse } from 'next/server'
import { db } from '@/DB/client'
import { eq } from 'drizzle-orm'
import { knowledge } from '@/DB/schema'
import { isAuthorized } from '@/lib/auth'

export async function DELETE(request) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await request.json()

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
        }

        await db.delete(knowledge).where(eq(knowledge.id, id))

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}