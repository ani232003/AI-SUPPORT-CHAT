import { isAuthorized } from "@/lib/auth"
import { NextResponse } from "next/server"
import { db } from "@/DB/client"
import { knowledge } from "@/DB/schema"
import { eq } from "drizzle-orm"

export async function GET() {
    try {
        const user = await isAuthorized()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const sources = await db.select().from(knowledge).where(eq(knowledge.user_email, user.email))

        return NextResponse.json({ success: true, data: sources }, { status: 200 })

    } catch (error) {
        console.error("Error:", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}