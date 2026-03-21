import { isAuthorized } from "@/lib/auth"
import { NextResponse } from "next/server"
import { summarizeMarkdown } from "@/lib/openai"
import { db } from "@/DB/client"
import { knowledge } from "@/DB/schema"

export async function POST(request) {
    try {
        const user = await isAuthorized()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const contentType = request.headers.get("content-type") || ""

        let body = {}
        let type = ""

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData()
            type = formData.get('type')

            if (type === 'upload') {
                const file = formData.get('file')

                if (!file) {
                    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
                }

                const fileContent = await file.text()
                const lines = fileContent.split('\n').filter(line => line.trim() !== '')
                const headers = lines[0].split(',').map(header => header.trim())

                const markdown = await summarizeMarkdown(fileContent)

                const fileType = file.name.endsWith('.pdf') ? 'pdf' : 'upload'

                await db.insert(knowledge).values({
                    user_email: user.email,
                    name: file.name,
                    content: markdown,
                    type: fileType,
                    status: "active",
                    meta_data: JSON.stringify({
                        fileName: file.name,
                        fileSize: file.size,
                        headers: headers,
                        rowCount: lines.length - 1,
                    }),
                })

                return NextResponse.json({ success: true, content: markdown, message: "File processed successfully" }, { status: 200 })
            }

        } else {
            body = await request.json()
            type = body.type
        }

        if (type === 'website') {
            const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: body.url,
                    formats: ['markdown'],
                }),
            })

            if (!res.ok) {
                const errorText = await res.text()
                console.error('Firecrawl error:', res.status, errorText)
                return NextResponse.json({
                    error: `Failed to fetch website content: ${res.status}`
                }, { status: 400 })
            }

            const data = await res.json()
            const html = data?.data?.markdown || ''

            if (!html) {
                return NextResponse.json({ error: 'No content extracted from website' }, { status: 400 })
            }

            const markdown = await summarizeMarkdown(html)
            console.log('OpenAI key exists:', !!process.env.OPEN_AI_API_KEY)
            console.log('Firecrawl content length:', html.length)
            console.log('Markdown result length:', markdown?.length)

            await db.insert(knowledge).values({
                user_email: user.email,
                name: body.url,
                source_url: body.url,
                content: markdown,
                type: "website",
                status: "active",
            })

            return NextResponse.json({ success: true, content: markdown }, { status: 200 })
        }

        if (type === 'text') {
            const markdown = await summarizeMarkdown(body.content)

            await db.insert(knowledge).values({
                user_email: user.email,
                name: body.title,
                content: markdown || body.content,
                type: "text",
                status: "active",
            })

            return NextResponse.json({ success: true, content: markdown }, { status: 200 })
        }

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error("Full error:", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}