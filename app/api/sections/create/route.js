import { isAuthorized } from "@/lib/auth";
import { db } from "@/DB/client";
import { sections } from "@/DB/schema";

export async function POST(request) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const body = await request.json();
        const { name, description, tone, allowedTopics, blockedTopics, sourceIds } = body;

        if (!name || !description || !tone) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        if (!sourceIds || !Array.isArray(sourceIds) || sourceIds.length === 0) {
            return new Response(JSON.stringify({ error: 'At least one knowledge source must be selected' }), { status: 400 });
        }

        const section = await db.insert(sections).values({
            name,
            description,
            tone,
            allowedTopics: allowedTopics || null,
            blockedTopics: blockedTopics || null,
            sourceIds: sourceIds.join(','),
            createdBy: user.organizationId,
            status: 'active',
        })

        return new Response(JSON.stringify({ message: 'Section created successfully', data: section }), { status: 201 });
    } catch (error) {
        console.error('Error creating section:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}