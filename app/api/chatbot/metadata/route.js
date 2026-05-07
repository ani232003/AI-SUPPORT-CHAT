import { isAuthorized } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { db } from '@/DB/client'
import { eq } from 'drizzle-orm'
import { knowledge, metadata, conversations, messages } from '@/DB/schema'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY })

// Aggressive markdown removal
function cleanText(text) {
    if (!text) return ''
    
    return text
        // Remove all markdown headers (# ## ### etc)
        .replace(/^#+\s+/gm, '')
        // Remove bold: **text** or __text__
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        // Remove italics: *text* or _text_
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        // Remove inline code: `text`
        .replace(/`([^`]+)`/g, '$1')
        // Remove code blocks: ```code```
        .replace(/```[\s\S]*?```/g, '')
        // Remove links: [text](url) -> text
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove bullet points and numbered lists
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        // Remove horizontal rules
        .replace(/^---+$/gm, '')
        // Remove extra spaces
        .replace(/\s+/g, ' ')
        // Remove extra line breaks but keep single line breaks
        .replace(/\n\n+/g, '\n')
        // Clean up the start and end
        .trim()
}

export async function POST(request) {
    try {
        let { messages: msgList, metadata: metadataBody, activeSection, widgetId, conversationId } = await request.json()

        let userEmail = null
        const user = await isAuthorized()
        if (user) {
            userEmail = user.email
        } else if (widgetId) {
            const [biz] = await db.select().from(metadata).where(eq(metadata.id, widgetId)).limit(1)
            if (biz) userEmail = biz.user_email
        }

        if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const metaData = metadataBody?.data || metadataBody
        const sources = await db.select().from(knowledge).where(eq(knowledge.user_email, userEmail))
        let context = sources.map(s => s.content).filter(Boolean).join('\n\n')

        const tokenCount = msgList.reduce((acc, m) => acc + (m.content?.length || 0), 0)
        if (tokenCount > 6000) {
            const recent = msgList.slice(-10)
            const older = msgList.slice(0, -10)
            if (older.length > 0) {
                context = 'Summary:\n' + older.map(m => `${m.role}: ${m.content}`).join('\n') + '\n\n' + context
                msgList = recent
            }
        }

        const cleanedMessages = msgList.map(({ role, content }) => ({ role, content }))
        const businessName = metaData?.business_name || 'this business'
        const userMessage = cleanedMessages[cleanedMessages.length - 1]?.content || ''

        const systemPrompt = `You are a helpful AI assistant for ${businessName}. 

IMPORTANT: Your response MUST be plain text only. Do NOT use ANY markdown formatting.
- Do not use # for headers
- Do not use * or _ for bold or italics
- Do not use [] or () for links - just write the URL
- Do not use - or numbers for lists
- Do not use \`\`\` for code blocks
- Write everything as normal paragraphs

Knowledge Base:
${context || 'No specific knowledge base content available.'}

Instructions:
1. Answer in plain text paragraphs
2. Be helpful and professional
3. Use the knowledge base for specific information
4. If you don't know, suggest contacting support
5. Never discuss politics, religion, or competitors
6. Be concise and friendly${activeSection ? `

Active Section: ${activeSection.name}
Tone: ${activeSection.tone || 'neutral'}` : ''}`

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 500,
            messages: [{ role: 'system', content: systemPrompt }, ...cleanedMessages]
        })

        let reply = completion.choices[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response."
        
        // AGGRESSIVE cleaning
        reply = cleanText(reply)

        // Save conversation and messages
        if (widgetId) {
            let convId = conversationId

            if (!convId) {
                const [newConv] = await db.insert(conversations).values({
                    user_email: userEmail,
                    chatbot_id: widgetId,
                    status: 'open',
                }).returning({ id: conversations.id })
                convId = newConv.id
            }

            await db.insert(messages).values([
                { conversation_id: convId, role: 'user', content: userMessage },
                { conversation_id: convId, role: 'assistant', content: reply },
            ])

            return NextResponse.json({ success: true, message: reply, conversationId: convId }, { status: 200 })
        }

        return NextResponse.json({ success: true, message: reply }, { status: 200 })

    } catch (error) {
        console.error('Chat error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}