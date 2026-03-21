import { isAuthorized } from "@/lib/auth";
import { db } from "@/DB/client";
import { sections } from "@/DB/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(req) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
        }

        const { id } = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ message: 'ID is required' }), { status: 400 })
        }

        const section = await db.select().from(sections).where(
            and(eq(sections.id, id), eq(sections.createdBy, user.organizationId))
        );

        if (!section || section.length === 0) {
            return new Response(JSON.stringify({ message: 'Section not found' }), { status: 404 })
        }

        await db.delete(sections).where(
            and(eq(sections.id, id), eq(sections.createdBy, user.organizationId))
        );

        return new Response(JSON.stringify({ message: 'Section deleted successfully' }), { status: 200 })

    } catch (error) {
        console.error('Error deleting section:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 })
    }
}