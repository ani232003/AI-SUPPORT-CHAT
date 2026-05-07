import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { widgetId } = await request.json();
        if (!widgetId) {
            return new Response(JSON.stringify({ success: false, error: 'widgetId is required' }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }
        return new Response(JSON.stringify({ success: true, sessionId: widgetId }), { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}