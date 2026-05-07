import { isAuthorized } from "@/lib/auth"
import { NextResponse } from "next/server"
import { db } from "@/DB/client" 
import { eq } from "drizzle-orm" 
import { metadata } from "@/DB/schema" 

// GET - Fetch existing metadata
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

        return NextResponse.json(existingMetadata, { status: 200 })

    } catch (error) {
        console.error("Error:", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Create new metadata
export async function POST(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { business_name, website_url, color, welcome_message } = body

        // Check if metadata already exists for this user
        const [existingMetadata] = await db.select().from(metadata).where(eq(metadata.user_email, user.email))

        if (existingMetadata) {
            return NextResponse.json({ 
                error: 'Metadata already exists for this user',
                data: existingMetadata 
            }, { status: 400 })
        }

        // Create new metadata
        const result = await db.insert(metadata).values({
            user_email: user.email,
            business_name: business_name || 'My Business',
            website_url: website_url || '',
            color: color || '#6366f1',
            welcome_message: welcome_message || 'Hello! How can I assist you today?'
        }).returning()

        return NextResponse.json(result[0], { status: 201 })

    } catch (error) {
        console.error("Error creating metadata:", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PUT - Update existing metadata
export async function PUT(req) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { color, welcome_message } = body

        // Update metadata
        const result = await db.update(metadata)
            .set({
                color: color || '#6366f1',
                welcome_message: welcome_message || 'Hello! How can I assist you today?'
            })
            .where(eq(metadata.user_email, user.email))
            .returning()

        if (result.length === 0) {
            return NextResponse.json({ error: 'Metadata not found' }, { status: 404 })
        }

        return NextResponse.json(result[0], { status: 200 })

    } catch (error) {
        console.error("Error updating metadata:", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}