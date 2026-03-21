import { isAuthorized } from "@/lib/auth"
import { NextResponse } from "next/server"
import { db } from "@/DB/client" 
import { eq } from "drizzle-orm" 
import { metadata } from "@/DB/schema" 

export async function GET() {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const [existingMetadata] = await db.select().from(metadata).where(eq(metadata.user_email, user.email))

        if (!existingMetadata) {
            return NextResponse.json({ data: null }, { status: 200 })
        }

        return NextResponse.json({ data: existingMetadata }, { status: 200 }) // fix: missing return

    } catch (error) {
        console.error("Error:", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}