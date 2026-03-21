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

        const [metaRecord] = await db.select().from(metadata).where(eq(metadata.user_email, user.email))

        const organization = {
            ...(metaRecord || {}),       // fix: was spreading [] (array), should be {} (object)
            id: user.organization_id,
        }

        return NextResponse.json(organization, { status: 200 })

    } catch (error) {
        console.error('Error fetching organization:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}