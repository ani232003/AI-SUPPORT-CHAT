import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request) {
    const cookieStore = await cookies()
    cookieStore.delete('session_user')
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('session_user')
    return response
}