import { scalekit } from "@/lib/scalekit";
import { teamMembers } from "@/DB/schema";  
import { eq } from "drizzle-orm";
import { isAuthorized } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/DB/client";

export async function POST(request) {
    try {
        const LoggedInUser = await isAuthorized()
        if (!LoggedInUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { email, name } = await request.json()
        if (!email || !name) {
            return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
        }

        const pendingTeamMember = await db.select().from(teamMembers).where(eq(teamMembers.user_email, email));
        if (pendingTeamMember.length > 0) {
            return NextResponse.json({ error: 'A team member with this email already exists.' }, { status: 400 })
        }

        // fix: handle case where user already exists in Scalekit
        try {
            await scalekit.user.createUserAndMembership(LoggedInUser.organizationId, {
                email,
                userProfile: {
                    firstName: name || email.split('@')[0],
                    lastName: '',
                },
                sendInvitationEmail: true,
            })
        } catch (scalekitError) {
            if (scalekitError._httpStatus !== 409) {
                throw scalekitError // re-throw if it's not a conflict error
            }
            // 409 means user already exists in Scalekit, just continue to add to DB
        }

        await db.insert(teamMembers).values({
            organization_id: LoggedInUser.organizationId,
            user_email: email,
            name: name || email.split('@')[0],
        });

        return NextResponse.json({ message: 'Team member added successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error adding team member:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}