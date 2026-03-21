import { cookies } from 'next/headers'

export async function GET() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session_user')

    if (!session) return Response.json(null, { status: 401 })

    return Response.json(JSON.parse(session.value))
}