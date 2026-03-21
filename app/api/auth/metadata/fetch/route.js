import { db } from "@/DB/client";
import { metadata } from "@/DB/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";

export async function GET(req) {
    try {
        const user = await isAuthorized();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cookieStore = await cookies();
        const metadataCookie = cookieStore.get('metadata');

        if (metadataCookie?.value) {
            return NextResponse.json({
                exists: true,
                source: "cookie",
                data: JSON.parse(metadataCookie.value)
            });
        }

        const [record] = await db.select().from(metadata).where(eq(metadata.user_email, user.email));

        if (record) {
            cookieStore.set("metadata", JSON.stringify({ business_name: record.business_name }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30,
            });

            return NextResponse.json({
                exists: true,
                source: "database",
                data: record,
            }, { status: 200 });
        }

        return NextResponse.json({
            exists: false,
            source: "database",
            data: null,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}