import { isAuthorized } from "@/lib/auth";
import { db } from "@/DB/client";
import { sections } from "@/DB/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const user = await isAuthorized();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
        }

        const response = await db.select().from(sections).where(eq(sections.createdBy, user.organizationId));

        const transformedSections = response.map((section) => ({
            id: section.id,
            name: section.name,
            description: section.description,
            sourceCount: section.sourceIds ? section.sourceIds.split(',').filter(Boolean).length : 0,
            source_ids: section.sourceIds ? section.sourceIds.split(',').filter(Boolean) : [],
            tone: section.tone,
            allowed_topics: section.allowedTopics,
            blocked_topics: section.blockedTopics,
            status: section.status,
        }))

        return new Response(JSON.stringify({ data: transformedSections }), { status: 200 });
    } catch (error) {
        console.error('Error fetching sections:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}