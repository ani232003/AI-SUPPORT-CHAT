import { isAuthorized } from "@/lib/auth"
import { NextResponse } from "next/server"
import { db } from "@/DB/client"
import { eq } from "drizzle-orm"
import { teamMembers } from "@/DB/schema"

export async function GET() {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!user.organizationId) {
            return NextResponse.json([], { status: 200 })
        }

        const teamMembersData = await db.select({
            id: teamMembers.id,
            user_email: teamMembers.user_email,
            role: teamMembers.role,
            name: teamMembers.name,
            status: teamMembers.status, // added back
            created_at: teamMembers.created_at,
        }).from(teamMembers).where(eq(teamMembers.organization_id, user.organizationId))

        return NextResponse.json(teamMembersData ?? [], { status: 200 })
    } catch (error) {
        console.error('Error fetching team members:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}