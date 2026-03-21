import { db } from "@/DB/client";
import { metadata } from "@/DB/schema";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";

export async function POST(req) {
    try {
        const user = await isAuthorized();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { businessName, businessEmail, businessWebsite, externalLinks } = await req.json();

        console.log('user:', user)
        console.log('businessName:', businessName)
        console.log('businessWebsite:', businessWebsite)

        if (!businessName || !businessWebsite) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await db.insert(metadata).values({
            user_email: user.email,
            business_name: businessName,
            website_url: businessWebsite,
            external_links: externalLinks || null,
        });

        console.log('DB INSERT RESULT:', result)

        (await cookies()).set("metadata", JSON.stringify({
            business_name: businessName,
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('STORE ERROR:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}