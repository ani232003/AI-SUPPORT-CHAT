import { NextResponse } from 'next/server'
import { scalekit } from '@/lib/scalekit'

export async function GET() {
    try {
        const redirectUri = process.env.SCALEKIT_REDIRECT_URI
        
        const options = {
            scopes: ['openid', 'profile', 'email', 'offline_access'],
        }
        
        const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, options)
        return NextResponse.redirect(authorizationUrl)
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Login failed' }, { status: 500 })
    }
}